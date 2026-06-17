from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from products.models import Category, Product
from core.models import HeroBanner, Testimonial, SiteSettings


class Command(BaseCommand):
    help = 'Seed database with initial data from the React frontend'

    def handle(self, *args, **options):
        self.stdout.write('Seeding database...')

        # Create superuser
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@rosella.com', 'admin123', first_name='Admin', last_name='User')
            self.stdout.write(self.style.SUCCESS('Created superuser: admin / admin123'))

        # Create categories
        categories_data = [
            {'name': 'Earrings', 'product_count_label': '240+ styles', 'display_order': 1},
            {'name': 'Necklaces', 'product_count_label': '180+ styles', 'display_order': 2},
            {'name': 'Rings', 'product_count_label': '120+ styles', 'display_order': 3},
            {'name': 'Bracelets', 'product_count_label': '90+ styles', 'display_order': 4},
            {'name': 'Bangles', 'product_count_label': '150+ styles', 'display_order': 5},
            {'name': 'Sets', 'product_count_label': '60+ styles', 'display_order': 6},
        ]
        cats = {}
        for cat_data in categories_data:
            cat, _ = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults=cat_data,
            )
            cats[cat.name] = cat
        self.stdout.write(self.style.SUCCESS(f'Created {len(cats)} categories'))

        # Create products (from ALL_PRODUCTS in ProductGrid.tsx)
        products_data = [
            {"name": "Rose Gold Pearl Drop Earrings", "category": "Earrings", "price": 1299, "sale_price": 849, "rating": 4.9, "review_count": 234, "image_url": "https://images.unsplash.com/photo-1723726871280-ab921c7e60c0?w=400&h=500&fit=crop&auto=format", "is_new_arrival": True, "is_trending": True, "is_featured": True, "stock": 50},
            {"name": "Delicate Heart Pendant Necklace", "category": "Necklaces", "price": 1599, "sale_price": 1099, "rating": 4.8, "review_count": 189, "image_url": "https://images.unsplash.com/photo-1513122991877-4a5678e6d72f?w=400&h=500&fit=crop&auto=format", "is_trending": True, "is_featured": True, "stock": 35},
            {"name": "Gold Floral Statement Ring", "category": "Rings", "price": 999, "sale_price": 699, "rating": 4.7, "review_count": 312, "image_url": "https://images.unsplash.com/photo-1592752411524-e823937f60dd?w=400&h=500&fit=crop&auto=format", "is_new_arrival": True, "stock": 45},
            {"name": "Charm Bead Bracelet Set", "category": "Bracelets", "price": 1799, "sale_price": 1249, "rating": 4.9, "review_count": 156, "image_url": "https://images.unsplash.com/photo-1633934542430-0905ccb5f050?w=400&h=500&fit=crop&auto=format", "stock": 30},
            {"name": "Layered Gold Hoop Earrings", "category": "Earrings", "price": 899, "sale_price": 649, "rating": 4.6, "review_count": 421, "image_url": "https://images.unsplash.com/photo-1632525231035-c054cd5019db?w=400&h=500&fit=crop&auto=format", "is_trending": True, "is_featured": True, "stock": 60},
            {"name": "Antique Rose Necklace Set", "category": "Sets", "price": 3499, "sale_price": 2499, "rating": 4.9, "review_count": 98, "image_url": "https://images.unsplash.com/photo-1777126413365-f4113a23eeab?w=400&h=500&fit=crop&auto=format", "is_new_arrival": True, "stock": 15},
            {"name": "Crystal Bangle Trio", "category": "Bangles", "price": 1299, "sale_price": 899, "rating": 4.7, "review_count": 267, "image_url": "https://images.unsplash.com/photo-1702476320482-0736c4b962f5?w=400&h=500&fit=crop&auto=format", "stock": 40},
            {"name": "Solitaire Diamond Ring", "category": "Rings", "price": 2199, "sale_price": 1599, "rating": 4.8, "review_count": 143, "image_url": "https://images.unsplash.com/photo-1588909006332-2e30f95291bc?w=400&h=500&fit=crop&auto=format", "is_trending": True, "is_featured": True, "stock": 25},
            {"name": "Floral Jhumka Earrings", "category": "Earrings", "price": 799, "sale_price": 549, "rating": 4.5, "review_count": 534, "image_url": "https://images.unsplash.com/photo-1692521248622-98a1da77b673?w=400&h=500&fit=crop&auto=format", "is_new_arrival": True, "stock": 70},
            {"name": "Pearl Layered Necklace", "category": "Necklaces", "price": 1899, "sale_price": 1349, "rating": 4.8, "review_count": 176, "image_url": "https://images.unsplash.com/photo-1704957205144-299bbf127891?w=400&h=500&fit=crop&auto=format", "stock": 20},
            {"name": "Gold Mangalsutra Chain", "category": "Necklaces", "price": 2499, "sale_price": 1899, "rating": 4.9, "review_count": 312, "image_url": "https://images.unsplash.com/photo-1717282924908-1c0262e4b136?w=400&h=500&fit=crop&auto=format", "is_trending": True, "stock": 30},
            {"name": "Infinity Twist Bracelet", "category": "Bracelets", "price": 1099, "sale_price": 799, "rating": 4.6, "review_count": 208, "image_url": "https://images.unsplash.com/photo-1565817292726-56c96f34355b?w=400&h=500&fit=crop&auto=format", "stock": 45},
            {"name": "Temple Design Jhumkas", "category": "Earrings", "price": 999, "sale_price": 749, "rating": 4.7, "review_count": 389, "image_url": "https://images.unsplash.com/photo-1720686615374-ea04dac6a66e?w=400&h=500&fit=crop&auto=format", "is_new_arrival": True, "stock": 55},
            {"name": "Kundan Bridal Set", "category": "Sets", "price": 4999, "sale_price": 3499, "rating": 4.9, "review_count": 67, "image_url": "https://images.unsplash.com/photo-1773097258713-a7ccd75e2aac?w=400&h=500&fit=crop&auto=format", "stock": 10},
            {"name": "Oxidised Silver Bangles (Set of 6)", "category": "Bangles", "price": 899, "sale_price": 649, "rating": 4.5, "review_count": 456, "image_url": "https://images.unsplash.com/photo-1723361656146-f201d215c49c?w=400&h=500&fit=crop&auto=format", "is_trending": True, "stock": 80},
            {"name": "Gold Adjustable Ring", "category": "Rings", "price": 649, "sale_price": 449, "rating": 4.4, "review_count": 612, "image_url": "https://images.unsplash.com/photo-1592752411563-02ee3ef57f2b?w=400&h=500&fit=crop&auto=format", "stock": 100},
            {"name": "Butterfly Charm Necklace", "category": "Necklaces", "price": 1299, "sale_price": 949, "rating": 4.7, "review_count": 234, "image_url": "https://images.unsplash.com/photo-1558882268-15aa056d885f?w=400&h=500&fit=crop&auto=format", "is_new_arrival": True, "stock": 35},
            {"name": "Diamond-Cut Hoop Earrings", "category": "Earrings", "price": 1399, "sale_price": 999, "rating": 4.8, "review_count": 178, "image_url": "https://images.unsplash.com/photo-1764265923632-b2126ec0dedc?w=400&h=500&fit=crop&auto=format", "stock": 40},
            {"name": "Floral Meenakari Set", "category": "Sets", "price": 3999, "sale_price": 2799, "rating": 4.9, "review_count": 89, "image_url": "https://images.unsplash.com/photo-1762122944695-4ee7032b7c9e?w=400&h=500&fit=crop&auto=format", "is_trending": True, "stock": 12},
            {"name": "Tennis Bracelet Gold", "category": "Bracelets", "price": 2299, "sale_price": 1699, "rating": 4.8, "review_count": 145, "image_url": "https://images.unsplash.com/photo-1779406084084-d47bb281136c?w=400&h=500&fit=crop&auto=format", "stock": 20},
            {"name": "Stackable Thin Bangles (4 pcs)", "category": "Bangles", "price": 699, "sale_price": 499, "rating": 4.6, "review_count": 523, "image_url": "https://images.unsplash.com/photo-1702476320482-0736c4b962f5?w=400&h=500&fit=crop&auto=format", "is_new_arrival": True, "stock": 90},
            {"name": "Emerald Drop Earrings", "category": "Earrings", "price": 1699, "sale_price": 1199, "rating": 4.9, "review_count": 201, "image_url": "https://images.unsplash.com/photo-1723726871280-ab921c7e60c0?w=400&h=500&fit=crop&auto=format", "is_trending": True, "stock": 25},
            {"name": "Rose Gold Chain Necklace", "category": "Necklaces", "price": 1499, "sale_price": 1099, "rating": 4.7, "review_count": 167, "image_url": "https://images.unsplash.com/photo-1513122991877-4a5678e6d72f?w=400&h=500&fit=crop&auto=format", "stock": 30},
            {"name": "Vintage Statement Ring", "category": "Rings", "price": 1199, "sale_price": 849, "rating": 4.8, "review_count": 289, "image_url": "https://images.unsplash.com/photo-1565817292726-56c96f34355b?w=400&h=500&fit=crop&auto=format", "is_new_arrival": True, "stock": 35},
        ]

        count = 0
        for p in products_data:
            cat = cats.get(p['category'])
            if not cat:
                continue
            product, created = Product.objects.get_or_create(
                name=p['name'],
                defaults={
                    'category': cat,
                    'price': p['price'],
                    'sale_price': p.get('sale_price'),
                    'rating': p.get('rating', 0),
                    'review_count': p.get('review_count', 0),
                    'stock': p.get('stock', 50),
                    'is_new_arrival': p.get('is_new_arrival', False),
                    'is_trending': p.get('is_trending', False),
                    'is_featured': p.get('is_featured', False),
                    'image_url': p.get('image_url', ''),
                    'description': 'Handcrafted with premium quality materials. Tarnish-resistant finish with a luxurious rose gold coating. Perfect for daily wear and special occasions.',
                }
            )
            if created:
                count += 1
                # Store the Unsplash URL in the image field description for now
                # In production, you'd download and save these images
                # For development, we'll reference them as external URLs
        self.stdout.write(self.style.SUCCESS(f'Created {count} products'))

        # NOTE: Product images use Unsplash URLs. Since Django ImageField needs actual files,
        # we'll handle this in the React frontend by checking if image starts with 'http'

        # Create testimonials
        testimonials_data = [
            {"name": "Priya Sharma", "avatar_initials": "PS", "rating": 5, "text": "Absolutely stunning quality! The rose gold earrings I ordered looked even better in person. Will definitely order again!", "product_name": "Pearl Drop Earrings"},
            {"name": "Ananya Rao", "avatar_initials": "AR", "rating": 5, "text": "Rosella has the most beautiful collection. Got my bridal set from here and received so many compliments. 10/10!", "product_name": "Kundan Bridal Set"},
            {"name": "Meera Patel", "avatar_initials": "MP", "rating": 5, "text": "Fast delivery, gorgeous packaging, and the jewelry quality is truly premium. My go-to for artificial jewelry.", "product_name": "Floral Meenakari Set"},
            {"name": "Ritu Agarwal", "avatar_initials": "RA", "rating": 5, "text": "The necklace I bought is so delicate and elegant. Couldn't believe it's artificial jewelry — looks completely real!", "product_name": "Pearl Layered Necklace"},
        ]
        t_count = 0
        for i, t_data in enumerate(testimonials_data):
            _, created = Testimonial.objects.get_or_create(
                name=t_data['name'],
                defaults={**t_data, 'display_order': i},
            )
            if created:
                t_count += 1
        self.stdout.write(self.style.SUCCESS(f'Created {t_count} testimonials'))

        # Create hero banner
        if not HeroBanner.objects.exists():
            HeroBanner.objects.create()
            self.stdout.write(self.style.SUCCESS('Created default hero banner'))

        # Create site settings
        SiteSettings.load()
        self.stdout.write(self.style.SUCCESS('Site settings initialized'))

        self.stdout.write(self.style.SUCCESS('Database seeding complete!'))
