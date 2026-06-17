from functools import wraps
from django.http import JsonResponse


def staff_required(view_func):
    """Decorator that requires user to be authenticated staff or superuser."""
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({
                'success': False,
                'authenticated': False,
                'message': 'Please login to access this page.'
            }, status=401)
        if not (request.user.is_staff or request.user.is_superuser):
            return JsonResponse({
                'success': False,
                'authenticated': True,
                'message': 'You are not allowed to access admin panel.'
            }, status=403)
        return view_func(request, *args, **kwargs)
    return wrapper
