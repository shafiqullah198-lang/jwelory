from .models import SiteSettings


def site_settings_context(request):
    """Make site settings available in all templates."""
    return {
        'site_settings': SiteSettings.load(),
    }
