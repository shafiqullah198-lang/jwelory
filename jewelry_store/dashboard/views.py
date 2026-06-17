import json
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.db.models import Sum, Count, Q
from django.contrib.auth import login as auth_login, logout as auth_logout, authenticate
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from .decorators import staff_required
from products.models import Product, Category
from orders.models import Order
from core.models import HeroBanner, Testimonial, SiteSettings, ContactMessage, NewsletterSubscriber


# ── Serializers ──

def _serialize_product(product):
    return {
        'id': product.id,
        'name': product.name,
        'slug': product.slug,
        'category': product.category.id,
        'category_name': product.category.name,
        'price': float(product.price),
        'sale_price': float(product.sale_price) if product.sale_price else None,
        'stock': product.stock,
        'description': product.description or '',
        'rating': float(product.rating),
        'review_count': product.review_count,
        'image': product.get_image_url,
        'is_featured': product.is_featured,
        'is_new_arrival': product.is_new_arrival,
        'is_trending': product.is_trending,
        'is_active': product.is_active,
    }


def _serialize_category(category):
    return {
        'id': category.id,
        'name': category.name,
        'slug': category.slug,
        'description': category.description or '',
        'display_order': category.display_order,
        'is_active': category.is_active,
        'image': category.image.url if category.image else '',
        'product_count': category.product_set.count(),
    }


def _serialize_order(order):
    return {
        'id': order.id,
        'order_number': order.order_number,
        'status': order.status,
        'status_display': order.get_status_display(),
        'status_color': order.status_color,
        'full_name': order.full_name,
        'email': order.email,
        'phone': order.phone,
        'address': order.address,
        'city': order.city,
        'state': order.state,
        'pincode': order.pincode,
        'subtotal': float(order.subtotal),
        'shipping': float(order.shipping),
        'total': float(order.total),
        'notes': order.notes or '',
        'created_at': order.created_at.isoformat(),
        'items': [{
            'id': item.id,
            'product_id': item.product.id if item.product else None,
            'product_name': item.product_name,
            'product_image': item.product_image,
            'price': float(item.price),
            'quantity': item.quantity,
            'line_total': float(item.line_total),
        } for item in order.items.all()]
    }


def _serialize_review(review):
    return {
        'id': review.id,
        'name': review.name,
        'avatar_initials': review.avatar_initials,
        'rating': review.rating,
        'text': review.text,
        'product_name': review.product_name or '',
        'is_active': review.is_active,
        'display_order': review.display_order,
    }


# Helper to convert truthy values from string/POST data to Boolean
def _to_bool(val):
    if isinstance(val, bool):
        return val
    if not val:
        return False
    return str(val).lower() in ('true', '1', 'on', 'yes')


# ── Authentication API ──

@csrf_exempt
def admin_login(request):
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'message': 'Invalid JSON'}, status=400)

    username = data.get('username')
    password = data.get('password')

    user = authenticate(request, username=username, password=password)
    if user is None:
        # Try logging in using email
        try:
            user_obj = User.objects.get(email=username)
            user = authenticate(request, username=user_obj.username, password=password)
        except User.DoesNotExist:
            pass

    if user is None:
        return JsonResponse({
            'success': False,
            'message': 'Invalid username/email or password'
        }, status=400)

    if not (user.is_staff or user.is_superuser):
        return JsonResponse({
            'success': False,
            'message': 'You are not allowed to access admin panel'
        }, status=403)

    auth_login(request, user)
    return JsonResponse({
        'success': True,
        'message': 'Admin login successful',
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff or user.is_superuser,
            'is_superuser': user.is_superuser
        },
        'token': 'session-auth-token'
    })


@csrf_exempt
@require_POST
def admin_logout(request):
    auth_logout(request)
    return JsonResponse({'success': True, 'message': 'Logged out successfully.'})


# ── Overview / Dashboard Statistics ──

@csrf_exempt
@staff_required
def dashboard_home(request):
    total_products = Product.objects.count()
    total_categories = Category.objects.count()
    total_orders = Order.objects.count()
    pending_orders = Order.objects.filter(status='pending').count()
    delivered_orders = Order.objects.filter(status='delivered').count()
    total_users = User.objects.filter(is_staff=False, is_superuser=False).count()
    total_revenue = Order.objects.exclude(status='cancelled').aggregate(total=Sum('total'))['total'] or 0
    low_stock_count = Product.objects.filter(stock__lte=5).count()
    
    recent_orders = Order.objects.all()[:8]
    low_stock_items = Product.objects.filter(stock__lte=5).order_by('stock')[:5]

    return JsonResponse({
        'success': True,
        'stats': {
            'total_products': total_products,
            'total_categories': total_categories,
            'total_orders': total_orders,
            'pending_orders': pending_orders,
            'delivered_orders': delivered_orders,
            'total_customers': total_users,
            'total_revenue': float(total_revenue),
            'low_stock_products': low_stock_count,
        },
        'recent_orders': [_serialize_order(o) for o in recent_orders],
        'low_stock_items': [_serialize_product(p) for p in low_stock_items],
    })


# ── Products API ──

@csrf_exempt
@staff_required
def product_list(request):
    products = Product.objects.select_related('category').all().order_by('-created_at')
    
    # Optional search / filter query params
    q = request.GET.get('q', '')
    if q:
        products = products.filter(Q(name__icontains=q) | Q(category__name__icontains=q))
    
    category_id = request.GET.get('category_id', '')
    if category_id:
        products = products.filter(category_id=category_id)

    return JsonResponse({
        'success': True,
        'products': [_serialize_product(p) for p in products]
    })


@csrf_exempt
@staff_required
def product_create(request):
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
    
    # Product data can come from multipart form or json
    if request.content_type.startswith('multipart/form-data'):
        data = request.POST
    else:
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Invalid JSON'}, status=400)

    name = data.get('name', '').strip()
    category_id = data.get('category')
    price = data.get('price', '0')
    sale_price = data.get('sale_price') or None
    stock = data.get('stock', '0')
    description = data.get('description', '')
    is_featured = _to_bool(data.get('is_featured'))
    is_new_arrival = _to_bool(data.get('is_new_arrival'))
    is_trending = _to_bool(data.get('is_trending'))
    is_active = _to_bool(data.get('is_active', True))
    
    image = request.FILES.get('image')

    if not name or not category_id:
        return JsonResponse({'success': False, 'message': 'Product name and category are required.'}, status=400)

    try:
        category = Category.objects.get(pk=int(category_id))
    except (Category.DoesNotExist, ValueError):
        return JsonResponse({'success': False, 'message': 'Invalid Category selected.'}, status=400)

    product = Product.objects.create(
        name=name,
        category=category,
        price=price,
        sale_price=sale_price,
        stock=int(stock),
        description=description,
        is_featured=is_featured,
        is_new_arrival=is_new_arrival,
        is_trending=is_trending,
        is_active=is_active,
        image=image
    )

    return JsonResponse({
        'success': True,
        'message': f'Product "{product.name}" created successfully.',
        'product': _serialize_product(product)
    })


@csrf_exempt
@staff_required
def product_edit(request, pk):
    product = get_object_or_404(Product, pk=pk)
    
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
        
    if request.content_type.startswith('multipart/form-data'):
        data = request.POST
    else:
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Invalid JSON'}, status=400)

    product.name = data.get('name', product.name).strip()
    
    category_id = data.get('category')
    if category_id:
        try:
            product.category = Category.objects.get(pk=int(category_id))
        except (Category.DoesNotExist, ValueError):
            return JsonResponse({'success': False, 'message': 'Invalid Category selected.'}, status=400)
            
    product.price = data.get('price', product.price)
    product.sale_price = data.get('sale_price') or None
    product.stock = int(data.get('stock', product.stock))
    product.description = data.get('description', product.description)
    
    if 'is_featured' in data:
        product.is_featured = _to_bool(data.get('is_featured'))
    if 'is_new_arrival' in data:
        product.is_new_arrival = _to_bool(data.get('is_new_arrival'))
    if 'is_trending' in data:
        product.is_trending = _to_bool(data.get('is_trending'))
    if 'is_active' in data:
        product.is_active = _to_bool(data.get('is_active'))
        
    if request.FILES.get('image'):
        product.image = request.FILES['image']

    product.save()

    return JsonResponse({
        'success': True,
        'message': f'Product "{product.name}" updated successfully.',
        'product': _serialize_product(product)
    })


@csrf_exempt
@staff_required
@require_POST
def product_delete(request, pk):
    product = get_object_or_404(Product, pk=pk)
    name = product.name
    product.delete()
    return JsonResponse({
        'success': True,
        'message': f'Product "{name}" deleted successfully.'
    })


# ── Categories API ──

@csrf_exempt
@staff_required
def category_list(request):
    categories = Category.objects.all().order_by('display_order', 'name')
    return JsonResponse({
        'success': True,
        'categories': [_serialize_category(c) for c in categories]
    })


@csrf_exempt
@staff_required
def category_create(request):
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)

    if request.content_type.startswith('multipart/form-data'):
        data = request.POST
    else:
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Invalid JSON'}, status=400)

    name = data.get('name', '').strip()
    description = data.get('description', '')
    product_count_label = data.get('product_count_label', '')
    display_order = int(data.get('display_order', '0') or '0')
    is_active = _to_bool(data.get('is_active', True))
    
    image = request.FILES.get('image')

    if not name:
        return JsonResponse({'success': False, 'message': 'Category name is required.'}, status=400)

    cat = Category.objects.create(
        name=name,
        description=description,
        product_count_label=product_count_label,
        display_order=display_order,
        is_active=is_active,
        image=image
    )

    return JsonResponse({
        'success': True,
        'message': f'Category "{cat.name}" created successfully.',
        'category': _serialize_category(cat)
    })


@csrf_exempt
@staff_required
def category_edit(request, pk):
    category = get_object_or_404(Category, pk=pk)
    
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)

    if request.content_type.startswith('multipart/form-data'):
        data = request.POST
    else:
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Invalid JSON'}, status=400)

    category.name = data.get('name', category.name).strip()
    category.description = data.get('description', category.description)
    category.product_count_label = data.get('product_count_label', category.product_count_label)
    category.display_order = int(data.get('display_order', category.display_order) or '0')
    
    if 'is_active' in data:
        category.is_active = _to_bool(data.get('is_active'))
        
    if request.FILES.get('image'):
        category.image = request.FILES['image']

    category.save()

    return JsonResponse({
        'success': True,
        'message': f'Category "{category.name}" updated successfully.',
        'category': _serialize_category(category)
    })


@csrf_exempt
@staff_required
@require_POST
def category_delete(request, pk):
    category = get_object_or_404(Category, pk=pk)
    name = category.name
    category.delete()
    return JsonResponse({
        'success': True,
        'message': f'Category "{name}" deleted successfully.'
    })


# ── Orders API ──

@csrf_exempt
@staff_required
def order_list(request):
    orders = Order.objects.select_related('user').all().order_by('-created_at')
    
    status_filter = request.GET.get('status', '')
    if status_filter:
        orders = orders.filter(status=status_filter)

    return JsonResponse({
        'success': True,
        'orders': [_serialize_order(o) for o in orders]
    })


@csrf_exempt
@staff_required
def order_detail(request, pk):
    order = get_object_or_404(Order, pk=pk)
    return JsonResponse({
        'success': True,
        'order': _serialize_order(order)
    })


@csrf_exempt
@staff_required
@require_POST
def order_update_status(request, pk):
    order = get_object_or_404(Order, pk=pk)
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'message': 'Invalid JSON'}, status=400)

    new_status = data.get('status', '')
    if new_status in dict(Order.STATUS_CHOICES):
        order.status = new_status
        order.save()
        return JsonResponse({
            'success': True,
            'message': f'Order #{order.order_number} status updated to {order.get_status_display()}.',
            'order': _serialize_order(order)
        })
    return JsonResponse({'success': False, 'message': 'Invalid order status choice.'}, status=400)


# ── Users API (Customers only) ──

@csrf_exempt
@staff_required
def user_list(request):
    # Registered normal users only, excluding staff/superuser
    users = User.objects.filter(is_staff=False, is_superuser=False).order_by('-date_joined')
    
    users_data = []
    for user in users:
        profile = getattr(user, 'profile', None)
        users_data.append({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'phone': profile.phone if profile else '',
            'address': profile.address if profile else '',
            'city': profile.city if profile else '',
            'state': profile.state if profile else '',
            'pincode': profile.pincode if profile else '',
            'date_joined': user.date_joined.isoformat(),
        })

    return JsonResponse({
        'success': True,
        'customers': users_data
    })


# ── Reviews API ──

@csrf_exempt
@staff_required
def review_list(request):
    reviews = Testimonial.objects.all().order_by('display_order', '-id')
    return JsonResponse({
        'success': True,
        'reviews': [_serialize_review(r) for r in reviews]
    })


@csrf_exempt
@staff_required
def review_create(request):
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'message': 'Invalid JSON'}, status=400)

    name = data.get('name', '').strip()
    avatar_initials = data.get('avatar_initials', '').strip()
    rating = int(data.get('rating', '5') or 5)
    text = data.get('text', '').strip()
    product_name = data.get('product_name', '').strip()
    display_order = int(data.get('display_order', '0') or 0)
    is_active = _to_bool(data.get('is_active', True))

    if not name or not text:
        return JsonResponse({'success': False, 'message': 'Reviewer name and comment text are required.'}, status=400)

    review = Testimonial.objects.create(
        name=name,
        avatar_initials=avatar_initials or name[:2].upper(),
        rating=rating,
        text=text,
        product_name=product_name,
        display_order=display_order,
        is_active=is_active
    )

    return JsonResponse({
        'success': True,
        'message': 'Review added successfully.',
        'review': _serialize_review(review)
    })


@csrf_exempt
@staff_required
def review_edit(request, pk):
    review = get_object_or_404(Testimonial, pk=pk)
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
        
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'message': 'Invalid JSON'}, status=400)

    review.name = data.get('name', review.name).strip()
    review.avatar_initials = data.get('avatar_initials', review.avatar_initials).strip()
    review.rating = int(data.get('rating', review.rating))
    review.text = data.get('text', review.text).strip()
    review.product_name = data.get('product_name', review.product_name).strip()
    review.display_order = int(data.get('display_order', review.display_order) or 0)
    
    if 'is_active' in data:
        review.is_active = _to_bool(data.get('is_active'))
        
    review.save()

    return JsonResponse({
        'success': True,
        'message': 'Review updated successfully.',
        'review': _serialize_review(review)
    })


@csrf_exempt
@staff_required
@require_POST
def review_approve(request, pk):
    review = get_object_or_404(Testimonial, pk=pk)
    review.is_active = True
    review.save()
    return JsonResponse({
        'success': True,
        'message': 'Review approved.',
        'review': _serialize_review(review)
    })


@csrf_exempt
@staff_required
@require_POST
def review_hide(request, pk):
    review = get_object_or_404(Testimonial, pk=pk)
    review.is_active = False
    review.save()
    return JsonResponse({
        'success': True,
        'message': 'Review hidden.',
        'review': _serialize_review(review)
    })


@csrf_exempt
@staff_required
@require_POST
def review_delete(request, pk):
    review = get_object_or_404(Testimonial, pk=pk)
    review.delete()
    return JsonResponse({
        'success': True,
        'message': 'Review deleted.'
    })


# ── CMS APIs ──

@csrf_exempt
@staff_required
def cms_hero(request):
    hero = HeroBanner.objects.first()
    if not hero:
        hero = HeroBanner.objects.create()

    if request.method == 'POST':
        if request.content_type.startswith('multipart/form-data'):
            data = request.POST
        else:
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return JsonResponse({'success': False, 'message': 'Invalid JSON'}, status=400)

        hero.title_line1 = data.get('title_line1', hero.title_line1)
        hero.title_line2 = data.get('title_line2', hero.title_line2)
        hero.title_line3 = data.get('title_line3', hero.title_line3)
        hero.eyebrow_text = data.get('eyebrow_text', hero.eyebrow_text)
        hero.description = data.get('description', hero.description)
        hero.primary_button_text = data.get('primary_button_text', hero.primary_button_text)
        hero.primary_button_link = data.get('primary_button_link', hero.primary_button_link)
        hero.secondary_button_text = data.get('secondary_button_text', hero.secondary_button_text)
        hero.secondary_button_link = data.get('secondary_button_link', hero.secondary_button_link)
        
        hero.stat1_value = data.get('stat1_value', hero.stat1_value)
        hero.stat1_label = data.get('stat1_label', hero.stat1_label)
        hero.stat2_value = data.get('stat2_value', hero.stat2_value)
        hero.stat2_label = data.get('stat2_label', hero.stat2_label)
        hero.stat3_value = data.get('stat3_value', hero.stat3_value)
        hero.stat3_label = data.get('stat3_label', hero.stat3_label)

        if request.FILES.get('video'):
            hero.video = request.FILES['video']
        if request.FILES.get('image'):
            hero.image = request.FILES['image']

        hero.save()
        return JsonResponse({'success': True, 'message': 'Hero banner CMS settings saved.'})

    # GET request
    return JsonResponse({
        'success': True,
        'hero': {
            'title_line1': hero.title_line1,
            'title_line2': hero.title_line2,
            'title_line3': hero.title_line3,
            'eyebrow_text': hero.eyebrow_text,
            'description': hero.description,
            'primary_button_text': hero.primary_button_text,
            'primary_button_link': hero.primary_button_link,
            'secondary_button_text': hero.secondary_button_text,
            'secondary_button_link': hero.secondary_button_link,
            'video': hero.video.url if hero.video else '',
            'image': hero.image.url if hero.image else '',
            'stat1_value': hero.stat1_value,
            'stat1_label': hero.stat1_label,
            'stat2_value': hero.stat2_value,
            'stat2_label': hero.stat2_label,
            'stat3_value': hero.stat3_value,
            'stat3_label': hero.stat3_label,
        }
    })


@csrf_exempt
@staff_required
def cms_settings(request):
    settings = SiteSettings.load()
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Invalid JSON'}, status=400)

        settings.site_name = data.get('site_name', settings.site_name)
        settings.tagline = data.get('tagline', settings.tagline)
        settings.announcement_bar_text = data.get('announcement_bar_text', settings.announcement_bar_text)
        settings.offer_title = data.get('offer_title', settings.offer_title)
        settings.offer_subtitle = data.get('offer_subtitle', settings.offer_subtitle)
        settings.offer_description = data.get('offer_description', settings.offer_description)
        settings.offer_code = data.get('offer_code', settings.offer_code)
        settings.offer_hours = data.get('offer_hours', settings.offer_hours)
        settings.offer_mins = data.get('offer_mins', settings.offer_mins)
        settings.offer_secs = data.get('offer_secs', settings.offer_secs)
        settings.instagram_handle = data.get('instagram_handle', settings.instagram_handle)
        
        shipping_threshold = data.get('free_shipping_threshold')
        if shipping_threshold is not None:
            settings.free_shipping_threshold = float(shipping_threshold)
            
        settings.footer_description = data.get('footer_description', settings.footer_description)
        settings.save()
        return JsonResponse({'success': True, 'message': 'Site settings updated successfully.'})

    # GET request
    return JsonResponse({
        'success': True,
        'settings': {
            'site_name': settings.site_name,
            'tagline': settings.tagline,
            'announcement_bar_text': settings.announcement_bar_text,
            'offer_title': settings.offer_title,
            'offer_subtitle': settings.offer_subtitle,
            'offer_description': settings.offer_description,
            'offer_code': settings.offer_code,
            'offer_hours': settings.offer_hours,
            'offer_mins': settings.offer_mins,
            'offer_secs': settings.offer_secs,
            'instagram_handle': settings.instagram_handle,
            'free_shipping_threshold': float(settings.free_shipping_threshold),
            'footer_description': settings.footer_description,
        }
    })


@csrf_exempt
@staff_required
def cms_content(request):
    """General CMS dashboard content view: subscribers and contact messages."""
    subscribers = NewsletterSubscriber.objects.all().order_by('-subscribed_at')
    messages_list = ContactMessage.objects.all().order_by('-created_at')

    subscribers_data = [{
        'id': sub.id,
        'email': sub.email,
        'subscribed_at': sub.subscribed_at.isoformat(),
        'is_active': sub.is_active,
    } for sub in subscribers]

    messages_data = [{
        'id': msg.id,
        'name': msg.name,
        'email': msg.email,
        'subject': msg.subject,
        'message': msg.message,
        'created_at': msg.created_at.isoformat(),
        'is_read': msg.is_read,
    } for msg in messages_list]

    return JsonResponse({
        'success': True,
        'subscribers': subscribers_data,
        'messages': messages_data,
    })


@csrf_exempt
@staff_required
@require_POST
def cms_subscriber_delete(request, pk):
    sub = get_object_or_404(NewsletterSubscriber, pk=pk)
    email = sub.email
    sub.delete()
    return JsonResponse({
        'success': True,
        'message': f'Subscriber "{email}" removed successfully.'
    })


@csrf_exempt
@staff_required
def contact_messages(request):
    messages_list = ContactMessage.objects.all().order_by('-created_at')
    
    messages_data = [{
        'id': msg.id,
        'name': msg.name,
        'email': msg.email,
        'subject': msg.subject,
        'message': msg.message,
        'created_at': msg.created_at.isoformat(),
        'is_read': msg.is_read,
    } for msg in messages_list]
    
    return JsonResponse({
        'success': True,
        'messages': messages_data
    })


@csrf_exempt
@staff_required
@require_POST
def mark_message_read(request, pk):
    msg = get_object_or_404(ContactMessage, pk=pk)
    msg.is_read = True
    msg.save()
    return JsonResponse({
        'success': True,
        'message': 'Message marked as read.'
    })
