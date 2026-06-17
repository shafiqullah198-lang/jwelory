from django.db import models


class HeroBanner(models.Model):
    title_line1 = models.CharField(max_length=100, default='Wear Your')
    title_line2 = models.CharField(max_length=100, default='Inner')
    title_line3 = models.CharField(max_length=100, default='Radiance')
    eyebrow_text = models.CharField(max_length=100, default='New Collection 2025')
    description = models.TextField(default='Exquisite handcrafted artificial jewelry — where timeless elegance meets contemporary artistry. Crafted for the discerning modern woman.')
    primary_button_text = models.CharField(max_length=50, default='Shop Collection')
    primary_button_link = models.CharField(max_length=200, default='/products/')
    secondary_button_text = models.CharField(max_length=50, default='New Arrivals', blank=True)
    secondary_button_link = models.CharField(max_length=200, default='/products/?filter=new', blank=True)
    video = models.FileField(upload_to='banners/', blank=True, null=True)
    image = models.ImageField(upload_to='banners/', blank=True, null=True)
    stat1_value = models.CharField(max_length=20, default='50K+')
    stat1_label = models.CharField(max_length=50, default='Happy Customers')
    stat2_value = models.CharField(max_length=20, default='2K+')
    stat2_label = models.CharField(max_length=50, default='Designs')
    stat3_value = models.CharField(max_length=20, default='4.9★')
    stat3_label = models.CharField(max_length=50, default='Rating')
    is_active = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)

    class Meta:
        ordering = ['display_order']

    def __str__(self):
        return f"Hero: {self.title_line1} {self.title_line2}"


class Testimonial(models.Model):
    name = models.CharField(max_length=100)
    avatar_initials = models.CharField(max_length=5)
    rating = models.IntegerField(default=5)
    text = models.TextField()
    product_name = models.CharField(max_length=200, blank=True)
    is_active = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)

    class Meta:
        ordering = ['display_order']

    def __str__(self):
        return f"Review by {self.name}"


class SiteSettings(models.Model):
    """Singleton model for site-wide settings."""
    site_name = models.CharField(max_length=100, default='Rosella')
    tagline = models.CharField(max_length=200, default='Luxury Jewels')
    announcement_bar_text = models.CharField(
        max_length=300,
        default='✦ Free Shipping on Orders Over Rs. 999 | Use Code LUXURY15 for 15% Off ✦'
    )
    offer_title = models.CharField(max_length=200, default='Up to 40% Off', blank=True)
    offer_subtitle = models.CharField(max_length=200, default='On Bridal Collections', blank=True)
    offer_description = models.TextField(
        default='Use code BRIDE40 at checkout. Limited period offer only.',
        blank=True
    )
    offer_code = models.CharField(max_length=20, default='BRIDE40', blank=True)
    offer_hours = models.CharField(max_length=5, default='11')
    offer_mins = models.CharField(max_length=5, default='47')
    offer_secs = models.CharField(max_length=5, default='32')
    instagram_handle = models.CharField(max_length=100, default='@rosellalujoyjewels')
    free_shipping_threshold = models.DecimalField(max_digits=10, decimal_places=2, default=999)
    footer_description = models.TextField(
        default='Handcrafted artificial jewelry that celebrates your elegance. Premium designs, affordable luxury.',
        blank=True
    )

    class Meta:
        verbose_name = 'Site Settings'
        verbose_name_plural = 'Site Settings'

    def __str__(self):
        return "Site Settings"

    def save(self, *args, **kwargs):
        # Ensure singleton
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj


class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Message from {self.name}: {self.subject}"


class NewsletterSubscriber(models.Model):
    email = models.EmailField(unique=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.email
