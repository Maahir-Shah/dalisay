from django.urls import path

from . import views

urlpatterns = [
    path('', views.home, name = 'homepage'),
    path('home/', views.home, name = 'homepage'),
    path('about/', views.about, name= 'about'),
    path('products/', views.products, name= 'products'),
    path('update_cart/', views.update_cart, name= 'update_cart'),
    path('contact/', views.contact, name= 'contact'),
    path('checkout/', views.checkout, name= 'checkout'),
    path('process_order/', views.process_order, name= 'process_order'),
    path('send_contact_form/', views.send_contact_form, name= 'contact_form'),
    path('process_payment/', views.process_payment, name= 'process_payment'),
    path('payment_success/', views.payment_success, name= 'payment_success'),
    path('payment_failure/', views.payment_failure, name= 'payment_failure'),

    ]
    