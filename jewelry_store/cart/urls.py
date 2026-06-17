from django.urls import path
from . import views

app_name = 'cart'

urlpatterns = [
    path('', views.cart_view, name='cart'),
    path('add/', views.add_to_cart, name='add'),
    path('remove/', views.remove_from_cart, name='remove'),
    path('update/', views.update_quantity, name='update'),
]
