from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    path('csrf/', views.csrf_token_view, name='csrf'),
    path('signup/', views.signup_view, name='signup'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('me/', views.me_view, name='me'),
    path('profile/', views.profile_view, name='profile'),
]
