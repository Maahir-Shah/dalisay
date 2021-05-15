from django.shortcuts import render
from .models import *
import json
from django.http import JsonResponse
from .utils import cookieCart, guestOrder
import datetime
from operator import attrgetter

#Imports for PayU
from django.http import HttpResponse,HttpResponseRedirect
from django.template.loader import get_template
from django.template import Context, Template
import hashlib
from random import randint
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from django.template.context_processors import csrf

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
    categories = sorted(categories, key=attrgetter('title'))
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

    return JsonResponse('Order Complete', safe=False)

def process_payment(request):

    MERCHANT_KEY = "epTi4Mxn"
    SALT = "hlV2iVOd9M"
    PAYU_BASE_URL = "https://sandboxsecure.payu.in/_payment"
    # Live PAYU_BASE_URL = "https://secure.payu.in/_payment"

    action = ''
    posted={}
    # Merchant Key and Salt provided by PayU.
    if request.method == 'POST':
        for i in request.POST:
            posted[i]=request.POST[i]
        hash_object = hashlib.sha256(b'randint(0,20)')
        txnid=hash_object.hexdigest()[0:20]
        hashh = ''
        posted['txnid']=txnid
        hashSequence = "key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10"
        posted['key']=MERCHANT_KEY
        hash_string=''
        hashVarsSeq=hashSequence.split('|')
        for i in hashVarsSeq:
            try:
                hash_string+=str(posted[i])
            except Exception:
                hash_string+=''
            hash_string+='|'
        hash_string+=SALT
        hash_encoded = hash_string.encode()
        hashh=hashlib.sha512(hash_encoded).hexdigest().lower()
        print('Hash:', hashh, 'Hash_string:', hash_string)
        action = PAYU_BASE_URL
    return render(request, 'payment_details.html', {
        "posted":posted,
        "hashh":hashh,
        "MERCHANT_KEY":MERCHANT_KEY,
        "txnid":txnid,
        "hash_string":hash_string,
        "action":action
    })

@csrf_protect
@csrf_exempt
def payment_success(request):
    c = {}
    c.update(csrf(request))
    status=request.POST["status"]
    firstname=request.POST["firstname"]
    amount=request.POST["amount"]
    txnid=request.POST["txnid"]
    posted_hash=request.POST["hash"]
    key=request.POST["key"]
    productinfo=request.POST["productinfo"]
    email=request.POST["email"]
    salt="hlV2iVOd9M"
    retHashSeq = salt+'|'+status+'|||||||||||'+email+'|'+firstname+'|'+productinfo+'|'+amount+'|'+txnid+'|'+key
    hashh=hashlib.sha512(retHashSeq).hexdigest().lower()
    if(hashh !=posted_hash):
        print ("Invalid Transaction. Please try again")
    else:
    	print ("Thank You. Your order status is ", status)
    	print ("Your Transaction ID for this transaction is ",txnid)
    	print ("We have received a payment of Rs. ", amount ,". Your order will soon be shipped.")
    return render(request, 'success.html', {
        "txnid":txnid,
        "status":status,
        "amount":amount
        })

@csrf_protect
@csrf_exempt
def payment_failure(request):
    c = {}
    c.update(csrf(request))
    status=request.POST["status"]
    firstname=request.POST["firstname"]
    amount=request.POST["amount"]
    txnid=request.POST["txnid"]
    posted_hash=request.POST["hash"]
    key=request.POST["key"]
    productinfo=request.POST["productinfo"]
    email=request.POST["email"]
    salt=""
    retHashSeq = salt+'|'+status+'|||||||||||'+email+'|'+firstname+'|'+productinfo+'|'+amount+'|'+txnid+'|'+key
    hashh=hashlib.sha512(retHashSeq).hexdigest().lower()
    if(hashh !=posted_hash):
    	print ("Invalid Transaction. Please try again")
    else:
    	print ("Thank You. Your order status is ", status)
    	print ("Your Transaction ID for this transaction is ",txnid)
    	print ("We have received a payment of Rs. ", amount ,". Your order will soon be shipped.")
    return render(request, 'failure.html')