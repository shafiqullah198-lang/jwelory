from django.urls import path
from . import views

app_name = 'dashboard'

urlpatterns = [
    path('', views.dashboard_home, name='home'),
    # Auth
    path('login/', views.admin_login, name='login'),
    path('logout/', views.admin_logout, name='logout'),
    # Products
    path('products/', views.product_list, name='product_list'),
    path('products/create/', views.product_create, name='product_create'),
    path('products/<int:pk>/edit/', views.product_edit, name='product_edit'),
    path('products/<int:pk>/delete/', views.product_delete, name='product_delete'),
    # Categories
    path('categories/', views.category_list, name='category_list'),
    path('categories/create/', views.category_create, name='category_create'),
    path('categories/<int:pk>/edit/', views.category_edit, name='category_edit'),
    path('categories/<int:pk>/delete/', views.category_delete, name='category_delete'),
    # Orders
    path('orders/', views.order_list, name='order_list'),
    path('orders/<int:pk>/', views.order_detail, name='order_detail'),
    path('orders/<int:pk>/status/', views.order_update_status, name='order_update_status'),
    # Users (Customers)
    path('users/', views.user_list, name='user_list'),
    # Reviews
    path('reviews/', views.review_list, name='review_list'),
    path('reviews/create/', views.review_create, name='review_create'),
    path('reviews/<int:pk>/edit/', views.review_edit, name='review_edit'),
    path('reviews/<int:pk>/approve/', views.review_approve, name='review_approve'),
    path('reviews/<int:pk>/hide/', views.review_hide, name='review_hide'),
    path('reviews/<int:pk>/delete/', views.review_delete, name='review_delete'),
    # CMS / Hero / Settings
    path('cms/hero/', views.cms_hero, name='cms_hero'),
    path('cms/settings/', views.cms_settings, name='cms_settings'),
    path('cms/content/', views.cms_content, name='cms_content'),
    path('cms/subscribers/<int:pk>/delete/', views.cms_subscriber_delete, name='cms_subscriber_delete'),
    # Messages
    path('messages/', views.contact_messages, name='contact_messages'),
    path('messages/<int:pk>/read/', views.mark_message_read, name='mark_message_read'),
]
