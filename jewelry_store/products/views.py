import json
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
from django.http.multipartparser import MultiPartParser
from dashboard.decorators import staff_required
from .models import Product, Category


def product_list(request):
    """API: List products with filtering, sorting, and search."""
    show_all = request.GET.get('all', '').lower() in ('true', '1') or (request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser))
    if show_all:
        products = Product.objects.all().select_related('category')
    else:
        products = Product.objects.filter(is_active=True).select_related('category')

    # Category filter
    category_slug = request.GET.get('category', '')
    if category_slug:
        products = products.filter(category__slug=category_slug)

    # Filter flags
    filter_type = request.GET.get('filter', '')
    if filter_type == 'new':
        products = products.filter(is_new_arrival=True)
    elif filter_type == 'featured':
        products = products.filter(is_featured=True)
    elif filter_type == 'trending':
        products = products.filter(is_trending=True)
    elif filter_type == 'sale':
        products = products.filter(sale_price__isnull=False, sale_price__gt=0)

    # Search
    search_query = request.GET.get('q', '')
    if search_query:
        products = products.filter(
            Q(name__icontains=search_query) |
            Q(description__icontains=search_query) |
            Q(category__name__icontains=search_query)
        )

    # Sort
    sort_by = request.GET.get('sort', 'featured')
    if sort_by == 'price-asc':
        products = products.order_by('sale_price', 'price')
    elif sort_by == 'price-desc':
        products = products.order_by('-price')
    elif sort_by == 'rating':
        products = products.order_by('-rating')
    elif sort_by == 'newest':
        products = products.order_by('-created_at')
    else:
        products = products.order_by('-is_featured', '-is_trending', '-created_at')

    # Limit
    limit = request.GET.get('limit', '')
    if limit:
        products = products[:int(limit)]

    products_data = [_serialize_product(p) for p in products]

    return JsonResponse({
        'products': products_data,
        'count': len(products_data),
    })


def product_detail(request, slug):
    """API: Single product with related products."""
    product = get_object_or_404(Product, slug=slug, is_active=True)
    related = Product.objects.filter(
        category=product.category, is_active=True
    ).exclude(pk=product.pk)[:4]

    return JsonResponse({
        'product': _serialize_product(product, full=True),
        'related_products': [_serialize_product(p) for p in related],
    })


def category_list(request):
    """API: List all active categories."""
    categories = Category.objects.filter(is_active=True).order_by('display_order')
    data = []
    for cat in categories:
        data.append({
            'id': cat.id,
            'name': cat.name,
            'slug': cat.slug,
            'image': cat.image.url if cat.image else '',
            'icon_svg': cat.icon_svg,
            'description': cat.description,
            'product_count_label': cat.product_count_label,
            'product_count': cat.active_product_count,
        })
    return JsonResponse({'categories': data})


def _serialize_product(product, full=False):
    """Serialize a product to dict."""
    data = {
        'id': product.id,
        'name': product.name,
        'slug': product.slug,
        'category': product.category.name,
        'category_slug': product.category.slug,
        'price': float(product.price),
        'originalPrice': float(product.price),
        'salePrice': float(product.sale_price) if product.sale_price else None,
        'currentPrice': float(product.current_price),
        'discount': product.discount_percent,
        'rating': float(product.rating),
        'reviewCount': product.review_count,
        'image': product.get_image_url,
        'inStock': product.in_stock,
        'stock': product.stock,
        'isNew': product.is_new_arrival,
        'isTrending': product.is_trending,
        'isFeatured': product.is_featured,
        'category_id': product.category.id,
        'is_active': product.is_active,
    }
    if full:
        data['description'] = product.description
        data['images'] = [
            {'id': img.id, 'image': img.image.url, 'is_primary': img.is_primary}
            for img in product.images.all()
        ]
    return data


# Helper to convert truthy values from string/POST data to Boolean
def _to_bool(val):
    if isinstance(val, bool):
        return val
    if not val:
        return False
    return str(val).lower() in ('true', '1', 'on', 'yes')


@csrf_exempt
def product_list_or_create(request):
    if request.method == 'GET':
        return product_list(request)
    elif request.method == 'POST':
        return product_create(request)
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
@staff_required
def product_create(request):
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
    product.refresh_from_db()

    return JsonResponse({
        'success': True,
        'message': f'Product "{product.name}" created successfully.',
        'product': _serialize_product(product)
    })


@csrf_exempt
def product_api_detail(request, pk):
    if request.method == 'GET':
        product = get_object_or_404(Product, pk=pk)
        return JsonResponse({
            'success': True,
            'product': _serialize_product(product, full=True)
        })
    elif request.method == 'PATCH':
        return product_patch(request, pk)
    elif request.method == 'DELETE':
        return product_delete(request, pk)
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
@staff_required
def product_patch(request, pk):
    product = get_object_or_404(Product, pk=pk)
    
    if request.content_type.startswith('multipart/form-data'):
        # MultiPartParser handles multipart body on PATCH
        parser = MultiPartParser(request.META, request, request.upload_handlers)
        post_data, files_data = parser.parse()
        data = post_data
        if 'image' in files_data:
            product.image = files_data['image']
    else:
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Invalid JSON'}, status=400)

    if 'name' in data:
        product.name = data.get('name').strip()
    if 'category' in data:
        try:
            product.category = Category.objects.get(pk=int(data.get('category')))
        except (Category.DoesNotExist, ValueError):
            return JsonResponse({'success': False, 'message': 'Invalid Category selected.'}, status=400)
    if 'price' in data:
        product.price = data.get('price')
    if 'sale_price' in data:
        val = data.get('sale_price')
        product.sale_price = val if val else None
    if 'stock' in data:
        product.stock = int(data.get('stock', 0))
    if 'description' in data:
        product.description = data.get('description')
    if 'is_featured' in data:
        product.is_featured = _to_bool(data.get('is_featured'))
    if 'is_new_arrival' in data:
        product.is_new_arrival = _to_bool(data.get('is_new_arrival'))
    if 'is_trending' in data:
        product.is_trending = _to_bool(data.get('is_trending'))
    if 'is_active' in data:
        product.is_active = _to_bool(data.get('is_active'))

    product.save()
    product.refresh_from_db()
    return JsonResponse({
        'success': True,
        'message': f'Product "{product.name}" updated successfully.',
        'product': _serialize_product(product)
    })


@csrf_exempt
@staff_required
def product_delete(request, pk):
    product = get_object_or_404(Product, pk=pk)
    name = product.name
    product.delete()
    return JsonResponse({
        'success': True,
        'message': f'Product "{name}" deleted successfully.'
    })
