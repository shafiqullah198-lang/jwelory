from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    path('homepage/', views.homepage_data, name='homepage'),
    path('newsletter/', views.newsletter_subscribe, name='newsletter'),
    path('contact/', views.contact_submit, name='contact'),
]
