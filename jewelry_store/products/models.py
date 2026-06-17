from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    icon_svg = models.TextField(blank=True, help_text='SVG icon markup for category display')
    description = models.TextField(blank=True)
    product_count_label = models.CharField(max_length=50, blank=True, help_text='e.g. "240+ styles"')
    display_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['display_order', 'name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    @property
    def active_product_count(self):
        return self.product_set.filter(is_active=True).count()


class Product(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stock = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    image_url = models.URLField(max_length=500, blank=True, help_text='External image URL (e.g. Unsplash)')
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0)
    review_count = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False, help_text='Show in Best Sellers section')
    is_new_arrival = models.BooleanField(default=False, help_text='Show in New Arrivals section')
    is_trending = models.BooleanField(default=False, help_text='Show HOT badge')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
            original_slug = self.slug
            counter = 1
            while Product.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
                self.slug = f'{original_slug}-{counter}'
                counter += 1
        super().save(*args, **kwargs)

    @property
    def current_price(self):
        if self.sale_price and self.sale_price < self.price:
            return self.sale_price
        return self.price

    @property
    def original_price(self):
        return self.price

    @property
    def discount_percent(self):
        if self.sale_price and self.sale_price < self.price:
            return round(((self.price - self.sale_price) / self.price) * 100)
        return 0

    @property
    def in_stock(self):
        return self.stock > 0

    @property
    def get_image_url(self):
        """Return image URL: uploaded file takes priority, then external URL."""
        if self.image:
            return self.image.url
        if self.image_url:
            return self.image_url
        primary = self.images.filter(is_primary=True).first()
        if primary:
            return primary.image.url
        first = self.images.first()
        if first:
            return first.image.url
        return ''


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    is_primary = models.BooleanField(default=False)
    display_order = models.IntegerField(default=0)

    class Meta:
        ordering = ['display_order']

    def __str__(self):
        return f"Image for {self.product.name}"
