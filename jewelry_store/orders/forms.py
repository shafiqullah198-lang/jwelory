from django import forms


class CheckoutForm(forms.Form):
    full_name = forms.CharField(max_length=200, widget=forms.TextInput(attrs={
        'class': 'form-input', 'placeholder': 'Full Name'
    }))
    email = forms.EmailField(widget=forms.EmailInput(attrs={
        'class': 'form-input', 'placeholder': 'Email Address'
    }))
    phone = forms.CharField(max_length=15, widget=forms.TextInput(attrs={
        'class': 'form-input', 'placeholder': 'Phone Number'
    }))
    address = forms.CharField(widget=forms.Textarea(attrs={
        'class': 'form-input', 'placeholder': 'Full Address', 'rows': 3
    }))
    city = forms.CharField(max_length=100, widget=forms.TextInput(attrs={
        'class': 'form-input', 'placeholder': 'City'
    }))
    state = forms.CharField(max_length=100, widget=forms.TextInput(attrs={
        'class': 'form-input', 'placeholder': 'State'
    }))
    pincode = forms.CharField(max_length=10, widget=forms.TextInput(attrs={
        'class': 'form-input', 'placeholder': 'PIN Code'
    }))
    notes = forms.CharField(required=False, widget=forms.Textarea(attrs={
        'class': 'form-input', 'placeholder': 'Order Notes (optional)', 'rows': 2
    }))
