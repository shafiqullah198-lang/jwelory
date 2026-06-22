import json
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET
from django.contrib.auth.decorators import login_required
from .models import Order, OrderItem
from cart.views import get_or_create_cart

PAYMENT_METHODS = {'cod', 'bank', 'jazzcash', 'easypaisa'}


@csrf_exempt
@login_required
def checkout_view(request):
    """API: Create order from cart."""
    if request.method == 'GET':
        # Return cart items for checkout display
        cart = get_or_create_cart(request)
        items = cart.items.select_related('product', 'product__category').all()
        if not items.exists():
            return JsonResponse({'success': False, 'message': 'Cart is empty'}, status=400)

        profile = getattr(request.user, 'profile', None)
        return JsonResponse({
            'cart': {
                'items': [{
                    'id': i.id,
                    'name': i.product.name,
                    'category': i.product.category.name,
                    'price': float(i.product.current_price),
                    'quantity': i.quantity,
                    'line_total': float(i.line_total),
                    'image': i.product.get_image_url,
                } for i in items],
                'subtotal': float(cart.subtotal),
                'total': float(cart.total),
            },
            'prefill': {
                'full_name': f"{request.user.first_name} {request.user.last_name}".strip(),
                'email': request.user.email,
                'phone': profile.phone if profile else '',
                'address': profile.address if profile else '',
                'city': profile.city if profile else '',
                'state': profile.state if profile else '',
                'pincode': profile.pincode if profile else '',
            }
        })

    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'errors': {'detail': 'Invalid JSON'}}, status=400)

        cart = get_or_create_cart(request)
        items = cart.items.select_related('product').all()

        if not items.exists():
            return JsonResponse({'success': False, 'message': 'Cart is empty'}, status=400)

        # Validate required fields
        required = ['full_name', 'email', 'phone', 'address', 'city', 'state']
        errors = {}
        for field in required:
            if not data.get(field, '').strip():
                errors[field] = f'{field.replace("_", " ").title()} is required.'
        if errors:
            return JsonResponse({'success': False, 'errors': errors}, status=400)

        payment_method = data.get('payment_method', 'cod')
        if payment_method not in PAYMENT_METHODS:
            return JsonResponse({
                'success': False,
                'errors': {'payment_method': 'Please select a valid payment method.'}
            }, status=400)

        # Check stock
        for item in items:
            if item.quantity > item.product.stock:
                return JsonResponse({
                    'success': False,
                    'message': f'Only {item.product.stock} of "{item.product.name}" available.'
                }, status=400)
            if not item.product.in_stock:
                return JsonResponse({
                    'success': False,
                    'message': f'"{item.product.name}" is out of stock.'
                }, status=400)

        # Create order
        shipping_fee = 0 if cart.subtotal >= 5000 else 200
        order = Order.objects.create(
            user=request.user,
            payment_method=payment_method,
            full_name=data['full_name'],
            email=data['email'],
            phone=data['phone'],
            address=data['address'],
            city=data['city'],
            state=data['state'],
            pincode=data.get('pincode', '').strip() or "-",
            notes=data.get('notes', ''),
            subtotal=cart.subtotal,
            shipping=shipping_fee,
            total=cart.subtotal + shipping_fee,
        )

        # Create order items and reduce stock
        for item in items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                product_name=item.product.name,
                product_image=item.product.get_image_url,
                price=item.product.current_price,
                quantity=item.quantity,
            )
            item.product.stock -= item.quantity
            item.product.save()

        # Clear cart
        items.delete()

        return JsonResponse({
            'success': True,
            'message': 'Order placed successfully!',
            'order': _serialize_order(order),
        })

    return JsonResponse({'error': 'Method not allowed'}, status=405)


@login_required
@require_GET
def order_history(request):
    """API: Get user's order history."""
    orders = request.user.orders.all()
    return JsonResponse({
        'orders': [_serialize_order(o) for o in orders]
    })


@login_required
@require_GET
def order_detail(request, order_number):
    """API: Get single order detail."""
    order = get_object_or_404(Order, order_number=order_number, user=request.user)
    return JsonResponse({
        'order': _serialize_order(order, full=True)
    })


def _serialize_order(order, full=False):
    """Serialize order to dict."""
    data = {
        'id': order.id,
        'order_number': order.order_number,
        'status': order.status,
        'status_display': order.get_status_display(),
        'status_color': order.status_color,
        'payment_method': order.payment_method,
        'payment_method_display': order.get_payment_method_display(),
        'total': float(order.total),
        'subtotal': float(order.subtotal),
        'shipping': float(order.shipping),
        'created_at': order.created_at.isoformat(),
        'item_count': order.items.count(),
    }
    if full:
        data.update({
            'full_name': order.full_name,
            'email': order.email,
            'phone': order.phone,
            'address': order.address,
            'city': order.city,
            'state': order.state,
            'pincode': order.pincode,
            'notes': order.notes,
            'items': [{
                'id': item.id,
                'product_name': item.product_name,
                'product_image': item.product_image,
                'price': float(item.price),
                'quantity': item.quantity,
                'line_total': float(item.line_total),
            } for item in order.items.all()],
        })
    return data
