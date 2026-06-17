from django import forms
from .models import ContactMessage


class ContactForm(forms.ModelForm):
    class Meta:
        model = ContactMessage
        fields = ('name', 'email', 'subject', 'message')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field_name, field in self.fields.items():
            field.widget.attrs.update({'class': 'form-input'})
        self.fields['name'].widget.attrs['placeholder'] = 'Your Name'
        self.fields['email'].widget.attrs['placeholder'] = 'Your Email'
        self.fields['subject'].widget.attrs['placeholder'] = 'Subject'
        self.fields['message'].widget = forms.Textarea(attrs={
            'class': 'form-input', 'placeholder': 'Your Message', 'rows': 5
        })


class NewsletterForm(forms.Form):
    email = forms.EmailField(widget=forms.EmailInput(attrs={
        'class': 'newsletter-input',
        'placeholder': 'Enter your email address',
    }))
