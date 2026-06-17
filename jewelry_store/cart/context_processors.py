from .models import Cart


def cart_context(request):
    """Make cart count available in all templates."""
    cart_count = 0
    cart_total = 0
    if request.user.is_authenticated:
        try:
            cart = Cart.objects.get(user=request.user)
            cart_count = cart.total_items
            cart_total = cart.total
        except Cart.DoesNotExist:
            pass
    else:
        session_key = request.session.session_key
        if session_key:
            try:
                cart = Cart.objects.get(session_key=session_key)
                cart_count = cart.total_items
                cart_total = cart.total
            except Cart.DoesNotExist:
                pass
    return {
        'cart_count': cart_count,
        'cart_total': cart_total,
    }
