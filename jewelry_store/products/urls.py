from django.urls import path
from . import views

app_name = 'products'

urlpatterns = [
    path('', views.product_list_or_create, name='product_list_or_create'),
    path('categories/', views.category_list, name='category_list'),
    path('<int:pk>/', views.product_api_detail, name='product_api_detail'),
    path('<slug:slug>/', views.product_detail, name='product_detail'),
]
