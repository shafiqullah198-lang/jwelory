from .models import Category


def categories_processor(request):
    """Make categories available in all templates."""
    return {
        'nav_categories': Category.objects.filter(is_active=True).order_by('display_order')
    }
