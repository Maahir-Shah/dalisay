from django.shortcuts import render
from .models import *
import json
from django.http import JsonResponse
from .utils import cookieCart, guestOrder
import datetime

# Create your views here.

def home(request):
    try:
        cart = json.loads(request.COOKIES['cart'])
    except:
        cart = {}
    cart_details = cookieCart(cart)
    order_items = cart_details['order_items']
    order = cart_details['order']

    return render(request, 'home.html', {
        'order_items': order_items,
        'order': order
    })

def about(request):
    try:
        cart = json.loads(request.COOKIES['cart'])
    except:
        cart = {}
    cart_details = cookieCart(cart)
    order_items = cart_details['order_items']
    order = cart_details['order']
    
    return render(request, 'about.html', {
        'order_items': order_items,
        'order': order
    })

def products(request):
    categories = Category.objects.all()
    products = Product.objects.all()

    try:
        cart = json.loads(request.COOKIES['cart'])
    except:
        cart = {}
    cart_details = cookieCart(cart)
    order_items = cart_details['order_items']
    order = cart_details['order']

    return render(request, 'products.html', {
        'products': products,
        'categories': categories,
        'order_items': order_items,
        'order': order
        })

def contact(request):
    try:
        cart = json.loads(request.COOKIES['cart'])
    except:
        cart = {}
    cart_details = cookieCart(cart)
    order_items = cart_details['order_items']
    order = cart_details['order']

    return render(request, 'contact.html', {
        'order_items': order_items,
        'order': order
    })

def update_cart(request):
    data = json.loads(request.body)
    cart = data['cart']
    cart_details = cookieCart(cart)
    
    order_items = cart_details['order_items']
    order = cart_details['order']
    deleted_items = cart_details['deleted_items']
    send_data = {'order_items': order_items, 'order': order, 'deleted_items': deleted_items}
    return JsonResponse(send_data, safe=False)

def checkout(request):
    try:
        cart = json.loads(request.COOKIES['cart'])
    except:
        cart = {}
    cart_details = cookieCart(cart)
    order_items = cart_details['order_items']
    order = cart_details['order']

    return render(request, 'checkout.html', {
        'order_items': order_items,
        'order': order
    })

def process_order(request):
    transaction_id = datetime.datetime.now().timestamp()

    # Obtaining the Delivery form data
    data = json.loads(request.body)

    name = data['delivery_details']['name']
    email = data['delivery_details']['email']
    phone_number = data['delivery_details']['phone_number']
    address = data['delivery_details']['address']
    city = data['delivery_details']['city']
    postal_code = data['delivery_details']['postal_code']

    # Obtaining the Order cart data
    try:
        cart = json.loads(request.COOKIES['cart'])
    except:
        cart = {}
    cart_details = cookieCart(cart)
    
    order_items = cart_details['order_items']
    order_details = cart_details['order']

    hamper_price = order_details['hamper_price'] 
    if hamper_price == '':
        hamper_price = 0
    # Creating a customer object
    customer, created = Customer.objects.get_or_create (
        email = email
    )
    customer.name = name
    customer.save()

    # Creating a new order object
    order = Order.objects.create (
        customer = customer,
        complete = False,
        transaction_id = transaction_id,
        total = order_details['total'],
        number_of_items = order_details['number_of_items'],
        note = order_details['note'],
        hamper = order_details['hamper'],
        hamper_price = hamper_price,
        payment_complete = False
    )
    
    item_list = ''

    # Creating new OrderItem objects for each item, and creating a list of items for Order object
    for item in order_items:
        product = Product.objects.get(id=item['product']['id'])

        order_item = OrderItem.objects.create (
            product = product,
            order = order,
            quantity = item['quantity']
        )

        item_product = str(product.name)
        item_category = str(product.category)
        item_quantity = str(item['quantity'])
        item_entry = item_product + " (" + item_category + ', Quantity: ' + item_quantity + ")\n"
        item_list += item_entry
    
    order.items = item_list
    if order.total == data['cart_total']:
        order.payment_complete = True
    order.save()
    
    # Creating a new DeliveryDetails object
    delivery = DeliveryDetails.objects.create (
        customer = customer,
        name = customer.name,
        email = customer.email,
        phone_number = phone_number,
        address = address,
        city = city,
        postal_code = postal_code,
        order = order
    )

    return JsonResponse('Payment Complete', safe=False)