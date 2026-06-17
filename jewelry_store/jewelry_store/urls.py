from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from dashboard.views import admin_login as dashboard_admin_login

urlpatterns = [
    path('admin/', admin.site.urls),
    # API endpoints
    path('api/admin/login/', dashboard_admin_login, name='api_admin_login'),
    path('api/auth/', include('accounts.urls')),
    path('api/products/', include('products.urls')),
    path('api/cart/', include('cart.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/', include('core.urls')),
    # Dashboard (converted to backend API)
    path('api/dashboard/', include('dashboard.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
