import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.views.decorators.http import require_POST, require_GET
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from .models import UserProfile


@ensure_csrf_cookie
def csrf_token_view(request):
    """Return CSRF token for React frontend."""
    return JsonResponse({'detail': 'CSRF cookie set'})


@csrf_exempt
@require_POST
def signup_view(request):
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'errors': {'detail': 'Invalid JSON'}}, status=400)

    first_name = data.get('first_name', '').strip()
    last_name = data.get('last_name', '').strip()
    username = data.get('username', '').strip()
    email = data.get('email', '').strip()
    password = data.get('password', '')
    password2 = data.get('password2', '')

    errors = {}
    if not first_name:
        errors['first_name'] = 'First name is required.'
    if not username:
        errors['username'] = 'Username is required.'
    if not email:
        errors['email'] = 'Email is required.'
    if not password:
        errors['password'] = 'Password is required.'
    if password != password2:
        errors['password2'] = 'Passwords do not match.'
    if len(password) < 8:
        errors['password'] = 'Password must be at least 8 characters.'
    if User.objects.filter(username=username).exists():
        errors['username'] = 'This username is already taken.'
    if User.objects.filter(email=email).exists():
        errors['email'] = 'This email is already registered.'

    if errors:
        return JsonResponse({'success': False, 'errors': errors}, status=400)

    user = User.objects.create_user(
        username=username, email=email, password=password,
        first_name=first_name, last_name=last_name,
        is_staff=False, is_superuser=False,
    )
    login(request, user)

    # Merge session cart
    from cart.views import merge_cart
    merge_cart(request)

    return JsonResponse({
        'success': True,
        'message': f'Welcome to Rosella, {first_name}!',
        'user': _user_data(user),
    })


@csrf_exempt
@require_POST
def login_view(request):
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'errors': {'detail': 'Invalid JSON'}}, status=400)

    username = data.get('username', '')
    password = data.get('password', '')

    user = authenticate(request, username=username, password=password)
    if user is None:
        # Try email login
        try:
            user_obj = User.objects.get(email=username)
            user = authenticate(request, username=user_obj.username, password=password)
        except User.DoesNotExist:
            pass

    if user is None:
        return JsonResponse({'success': False, 'errors': {'detail': 'Invalid username or password.'}}, status=400)

    login(request, user)

    # Merge session cart
    from cart.views import merge_cart
    merge_cart(request)

    return JsonResponse({
        'success': True,
        'message': f'Welcome back, {user.first_name or user.username}!',
        'user': _user_data(user),
    })


@require_POST
def logout_view(request):
    logout(request)
    return JsonResponse({'success': True, 'message': 'Logged out successfully.'})


@require_GET
def me_view(request):
    """Get current user data."""
    if not request.user.is_authenticated:
        return JsonResponse({'authenticated': False})
    return JsonResponse({
        'authenticated': True,
        'user': _user_data(request.user),
    })


@csrf_exempt
@login_required
def profile_view(request):
    profile, _ = UserProfile.objects.get_or_create(user=request.user)

    if request.method == 'GET':
        return JsonResponse({
            'user': _user_data(request.user),
            'profile': {
                'phone': profile.phone,
                'address': profile.address,
                'city': profile.city,
                'state': profile.state,
                'pincode': profile.pincode,
            }
        })

    if request.method in ('POST', 'PUT', 'PATCH'):
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'errors': {'detail': 'Invalid JSON'}}, status=400)

        email = data.get('email', request.user.email).strip()
        if not email:
            return JsonResponse({'success': False, 'message': 'Email is required.'}, status=400)
        if User.objects.filter(email__iexact=email).exclude(pk=request.user.pk).exists():
            return JsonResponse({'success': False, 'message': 'This email is already registered.'}, status=400)

        request.user.first_name = data.get('first_name', request.user.first_name).strip()
        request.user.last_name = data.get('last_name', request.user.last_name).strip()
        request.user.email = email
        request.user.save()

        profile.phone = data.get('phone', profile.phone).strip()
        profile.address = data.get('address', profile.address).strip()
        profile.city = data.get('city', profile.city).strip()
        profile.state = data.get('state', profile.state).strip()
        profile.pincode = data.get('pincode', profile.pincode).strip()
        profile.save()

        return JsonResponse({
            'success': True,
            'message': 'Profile updated successfully.',
            'user': _user_data(request.user),
        })

    return JsonResponse({'error': 'Method not allowed'}, status=405)


def _user_data(user):
    """Serialize user data."""
    profile = getattr(user, 'profile', None)
    return {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'is_staff': user.is_staff or user.is_superuser,
        'profile': {
            'phone': profile.phone if profile else '',
            'address': profile.address if profile else '',
            'city': profile.city if profile else '',
            'state': profile.state if profile else '',
            'pincode': profile.pincode if profile else '',
        } if profile else None,
    }
