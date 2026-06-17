import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET
from products.models import Product, Category
from .models import HeroBanner, Testimonial, SiteSettings, NewsletterSubscriber, ContactMessage


@require_GET
def homepage_data(request):
    """API: All data needed for the homepage."""
    hero = HeroBanner.objects.filter(is_active=True).first()
    categories = Category.objects.filter(is_active=True).order_by('display_order')
    best_sellers = Product.objects.filter(is_active=True, is_featured=True)[:4]
    new_arrivals = Product.objects.filter(is_active=True, is_new_arrival=True)[:4]
    all_products = Product.objects.filter(is_active=True).order_by('-is_featured', '-is_trending', '-created_at')[:24]
    testimonials = Testimonial.objects.filter(is_active=True).order_by('display_order')
    settings = SiteSettings.load()

    from products.views import _serialize_product

    return JsonResponse({
        'hero': {
            'title_line1': hero.title_line1 if hero else 'Wear Your',
            'title_line2': hero.title_line2 if hero else 'Inner',
            'title_line3': hero.title_line3 if hero else 'Radiance',
            'eyebrow_text': hero.eyebrow_text if hero else 'New Collection 2025',
            'description': hero.description if hero else '',
            'primary_button_text': hero.primary_button_text if hero else 'Shop Collection',
            'primary_button_link': hero.primary_button_link if hero else '/products',
            'secondary_button_text': hero.secondary_button_text if hero else 'New Arrivals',
            'secondary_button_link': hero.secondary_button_link if hero else '/products?filter=new',
            'video': hero.video.url if hero and hero.video else '',
            'image': hero.image.url if hero and hero.image else '',
            'stats': [
                {'value': hero.stat1_value if hero else '50K+', 'label': hero.stat1_label if hero else 'Happy Customers'},
                {'value': hero.stat2_value if hero else '2K+', 'label': hero.stat2_label if hero else 'Designs'},
                {'value': hero.stat3_value if hero else '4.9★', 'label': hero.stat3_label if hero else 'Rating'},
            ],
        },
        'categories': [{
            'id': cat.id,
            'name': cat.name,
            'slug': cat.slug,
            'image': cat.image.url if cat.image else '',
            'icon_svg': cat.icon_svg,
            'product_count_label': cat.product_count_label or f'{cat.active_product_count} products',
        } for cat in categories],
        'best_sellers': [_serialize_product(p) for p in best_sellers],
        'new_arrivals': [_serialize_product(p) for p in new_arrivals],
        'all_products': [_serialize_product(p) for p in all_products],
        'testimonials': [{
            'id': t.id,
            'name': t.name,
            'avatar': t.avatar_initials,
            'rating': t.rating,
            'text': t.text,
            'product': t.product_name,
        } for t in testimonials],
        'settings': {
            'site_name': settings.site_name,
            'tagline': settings.tagline,
            'announcement': settings.announcement_bar_text,
            'offer': {
                'title': settings.offer_title,
                'subtitle': settings.offer_subtitle,
                'description': settings.offer_description,
                'code': settings.offer_code,
                'hours': settings.offer_hours,
                'mins': settings.offer_mins,
                'secs': settings.offer_secs,
            },
            'instagram_handle': settings.instagram_handle,
            'free_shipping_threshold': float(settings.free_shipping_threshold),
            'footer_description': settings.footer_description,
        },
    })


@csrf_exempt
@require_POST
def newsletter_subscribe(request):
    """API: Subscribe to newsletter."""
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'message': 'Invalid JSON'}, status=400)

    email = data.get('email', '').strip()
    if not email:
        return JsonResponse({'success': False, 'message': 'Please enter your email address.'}, status=400)

    _, created = NewsletterSubscriber.objects.get_or_create(email=email)
    if created:
        return JsonResponse({'success': True, 'message': 'Welcome to the Rosella family!'})
    return JsonResponse({'success': True, 'message': 'You are already subscribed!'})


@csrf_exempt
@require_POST
def contact_submit(request):
    """API: Submit contact form."""
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'message': 'Invalid JSON'}, status=400)

    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    subject = data.get('subject', '').strip()
    message = data.get('message', '').strip()

    errors = {}
    if not name:
        errors['name'] = 'Name is required.'
    if not email:
        errors['email'] = 'Email is required.'
    if not subject:
        errors['subject'] = 'Subject is required.'
    if not message:
        errors['message'] = 'Message is required.'

    if errors:
        return JsonResponse({'success': False, 'errors': errors}, status=400)

    ContactMessage.objects.create(name=name, email=email, subject=subject, message=message)
    return JsonResponse({'success': True, 'message': 'Thank you! We will get back to you soon.'})
