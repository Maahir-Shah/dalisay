from django.shortcuts import render
from .models import *
import json
from django.http import JsonResponse
from .utils import cookieCart, process_order
import datetime
from operator import add, attrgetter

#Imports for Email
from django.core.mail import EmailMessage
from django.conf import settings
from django.template.loader import render_to_string

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

def terms_and_conditions(request):

    return render(request, 'terms_conditions.html')

def privacy_policy(request):

    return render(request, 'privacy_policy.html')

def delivery_returns_refunds_policy(request):

    return render(request, 'delivery_returns_refunds_policy.html')

def ssl_validation(request):

    return render(request, '53AB5CD43CADE420AC41ECB9400C0DF9.txt')
    
def process_payment(request):

    MERCHANT_KEY = "epTi4Mxn"
    SALT = "hlV2iVOd9M"
    # Test
    PAYU_BASE_URL = "https://sandboxsecure.payu.in/_payment"
    # Live 
    # PAYU_BASE_URL = "https://secure.payu.in/_payment"

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

    #Verifying payment transaction
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
    retHashEnc = retHashSeq.encode()
    hashh=hashlib.sha512(retHashEnc).hexdigest().lower()
    if(hashh !=posted_hash):
        print ("Invalid Transaction. Please try again")
    else:
    	print ("Thank You. Your order status is ", status)
    	print ("Your Transaction ID for this transaction is ",txnid)
    	print ("We have received a payment of Rs. ", amount ,". Your order will soon be shipped.")

    return render(request, 'success.html')

def payment_success_page(request):

    txnid = int(datetime.datetime.now().timestamp())
    try:
        cart = json.loads(request.COOKIES['cart'])
    except:
        cart = {}
    
    cart_details = cookieCart(cart)
    order_items = cart_details['order_items']
    order = cart_details['order']

    data = json.loads(request.COOKIES['dd'])

    delivery_details = {
    'name': data['name'],
    'email': data['email'],
    'phone_number': data['phone_number'],
    'address': data['address'],
    'city': data['city'],
    'postal_code': data['postal_code']
    }

    amount = data['amount']
    order_creation = process_order(txnid, delivery_details, cart_details, amount)

    email_template = render_to_string('confirmation_email_template.html', {
        'order_items': order_items,
        'order': order,
        'delivery_details': delivery_details,
        'txnid': txnid,
        'amount': amount
    })

    email = EmailMessage(
        'Dalisay | Order Confirmation',
        email_template,
        settings.EMAIL_HOST_USER,
        [delivery_details['email']],
    )

    email.content_subtype = "html"
    email.fail_silently = False
    email.send()

    new_order_email_template = render_to_string('new_order_email_template.html', {
        'order_items': order_items,
        'order': order,
        'delivery_details': delivery_details,
        'txnid': txnid,
        'amount': amount
    })

    new_order_email = EmailMessage(
        'Dalisay | New Order',
        new_order_email_template,
        settings.EMAIL_HOST_USER,
        ['sangeeta@dalisay.co.in']#, 'karishma@dalisay.co.in'],
    )

    new_order_email.content_subtype = "html"
    new_order_email.fail_silently = False
    new_order_email.send()

    return render(request, 'payment_success.html', {
        'order_items': order_items,
        'order': order,
        'delivery_details': delivery_details,
        'txnid': txnid,
        'amount': amount
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
    retHashEnc = retHashSeq.encode()
    hashh=hashlib.sha512(retHashEnc).hexdigest().lower()
    if(hashh !=posted_hash):
    	print ("Invalid Transaction. Please try again")
    else:
    	print ("Thank You. Your order status is ", status)
    	print ("Your Transaction ID for this transaction is ",txnid)
    	print ("We have received a payment of Rs. ", amount ,". Your order will soon be shipped.")
    return render(request, 'failure.html')

def payment_failure_page(request):
    return render(request, 'payment_failure.html')

def email(request):
    txnid = datetime.datetime.now().timestamp()
    try:
        cart = json.loads(request.COOKIES['cart'])
    except:
        cart = {}
    
    cart_details = cookieCart(cart)
    order_items = cart_details['order_items']
    order = cart_details['order']

    data = json.loads(request.COOKIES['dd'])

    delivery_details = {
    'name': data['name'],
    'email': data['email'],
    'phone_number': data['phone_number'],
    'address': data['address'],
    'city': data['city'],
    'postal_code': data['postal_code']
    }

    amount = data['amount']

    email_template = render_to_string('confirmation_email_template.html', {
        'order_items': order_items,
        'order': order,
        'delivery_details': delivery_details,
        'txnid': txnid,
        'amount': amount
    })

    email = EmailMessage(
        'Dalisay | Order Confirmation',
        email_template,
        settings.EMAIL_HOST_USER,
        [delivery_details['email']],
    )

    email.content_subtype = "html"
    email.fail_silently = False
    email.send()

    new_order_email_template = render_to_string('new_order_email_template.html', {
        'order_items': order_items,
        'order': order,
        'delivery_details': delivery_details,
        'txnid': txnid,
        'amount': amount
    })

    new_order_email = EmailMessage(
        'Dalisay | New Order',
        new_order_email_template,
        settings.EMAIL_HOST_USER,
        ['sangeeta@dalisay.co.in', 'karishma@dalisay.co.in'],
    )

    new_order_email.content_subtype = "html"
    new_order_email.fail_silently = False
    new_order_email.send()

    return render(request, 'confirmation_email_template.html', {
        'order_items': order_items,
        'order': order,
        'delivery_details': delivery_details,
        'txnid': txnid,
        'amount': amount
    })