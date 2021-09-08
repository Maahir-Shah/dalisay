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
    path('process_payment/', views.process_payment, name= 'process_payment'),
    path('payment_success', views.payment_success, name= 'payment_success'),
    path('payment_failure', views.payment_failure, name= 'payment_failure'),
    path('policies/terms_and_conditions/', views.terms_and_conditions, name= 'terms_and_conditions'),
    path('policies/privacy_policy/', views.privacy_policy, name= 'privacy_policy'),
    path('policies/delivery_returns_refunds_policy/', views.delivery_returns_refunds_policy, name= 'delivery_returns_refunds_policy'),
    path('.well-known/pki-validation/53AB5CD43CADE420AC41ECB9400C0DF9.txt/', views.ssl_validation, name= 'ssl_validation'),
    path('payment_success_page', views.payment_success_page, name= 'payment_success_page'),
    path('payment_failure_page', views.payment_failure_page, name= 'payment_failure_page'),
    ]
    