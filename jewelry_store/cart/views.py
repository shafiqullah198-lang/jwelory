import json
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET
from products.models import Product
from .models import Cart, CartItem


def get_or_create_cart(request):
    """Get or create cart for current user/session."""
    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return cart
    else:
        if not request.session.session_key:
            request.session.create()
        session_key = request.session.session_key
        cart, _ = Cart.objects.get_or_create(session_key=session_key, user=None)
        return cart


def merge_cart(request):
    """Merge session cart into user cart on login."""
    if not request.user.is_authenticated:
        return
    session_key = request.session.session_key
    if not session_key:
        return
    try:
        session_cart = Cart.objects.get(session_key=session_key, user=None)
    except Cart.DoesNotExist:
        return

    user_cart, _ = Cart.objects.get_or_create(user=request.user)
    for item in session_cart.items.all():
        existing = user_cart.items.filter(product=item.product).first()
        if existing:
            existing.quantity += item.quantity
            existing.save()
        else:
            item.cart = user_cart
            item.save()
    session_cart.delete()


@require_GET
def cart_view(request):
    """API: Get cart contents."""
    cart = get_or_create_cart(request)
    return JsonResponse(_serialize_cart(cart))


@csrf_exempt
@require_POST
def add_to_cart(request):
    """API: Add product to cart."""
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'message': 'Invalid JSON'}, status=400)

    product_id = data.get('product_id')
    quantity = int(data.get('quantity', 1))

    product = get_object_or_404(Product, id=product_id, is_active=True)

    if not product.in_stock:
        return JsonResponse({'success': False, 'message': 'Product is out of stock'}, status=400)
    if quantity > product.stock:
        return JsonResponse({'success': False, 'message': f'Only {product.stock} items available'}, status=400)

    cart = get_or_create_cart(request)
    cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)

    if not created:
        cart_item.quantity += quantity
    else:
        cart_item.quantity = quantity

    if cart_item.quantity > product.stock:
        cart_item.quantity = product.stock

    cart_item.save()

    return JsonResponse({
        'success': True,
        'message': f'{product.name} added to cart!',
        'cart': _serialize_cart(cart),
    })


@csrf_exempt
@require_POST
def remove_from_cart(request):
    """API: Remove item from cart."""
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'message': 'Invalid JSON'}, status=400)

    item_id = data.get('item_id')
    cart = get_or_create_cart(request)

    try:
        item = CartItem.objects.get(id=item_id, cart=cart)
        item.delete()
    except CartItem.DoesNotExist:
        pass

    return JsonResponse({
        'success': True,
        'cart': _serialize_cart(cart),
    })


@csrf_exempt
@require_POST
def update_quantity(request):
    """API: Update cart item quantity."""
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'message': 'Invalid JSON'}, status=400)

    item_id = data.get('item_id')
    quantity = int(data.get('quantity', 1))
    cart = get_or_create_cart(request)

    try:
        item = CartItem.objects.get(id=item_id, cart=cart)
        if quantity <= 0:
            item.delete()
        else:
            if quantity > item.product.stock:
                quantity = item.product.stock
            item.quantity = quantity
            item.save()
    except CartItem.DoesNotExist:
        pass

    return JsonResponse({
        'success': True,
        'cart': _serialize_cart(cart),
    })


def _serialize_cart(cart):
    """Serialize cart to dict."""
    items = cart.items.select_related('product', 'product__category').all()
    items_data = []
    for item in items:
        items_data.append({
            'id': item.id,
            'product_id': item.product.id,
            'name': item.product.name,
            'slug': item.product.slug,
            'category': item.product.category.name,
            'price': float(item.product.current_price),
            'image': item.product.get_image_url,
            'quantity': item.quantity,
            'line_total': float(item.line_total),
            'stock': item.product.stock,
        })
    return {
        'items': items_data,
        'count': cart.total_items,
        'subtotal': float(cart.subtotal),
        'total': float(cart.total),
    }
