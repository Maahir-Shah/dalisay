import json
from .models import *

# Function to get the items from the cart cookie, and set the order items, order quantity, and the order total

def cookieCart(cart):
    if cart != {}:
        items = [] # Items added in the cart
        cart_quantity = 0 # Total number of items in the cart
        cart_total_price = 0 # Total price of items in the cart
        deleted_items = []
        for i in cart:
            try:
                product = Product.objects.get(id=i) # Get the product details from its id
                product_total = (product.price * cart[i]['quantity']) # Find the cost of the item
                
                # Increment the quantity of items in the cart
                cart_quantity += cart[i]['quantity']

                # Add to the price of all items in the cart
                cart_total_price += product_total

                # Input details of the item
                item = {
                    'product': {
                        'id': product.id,
                        'name': product.name,
                        'category': str(product.category),
                        'description': product.description,
                        'price': product.price,
                        'vegan': product.vegan,
                        'gluten_free': product.gluten_free,
                        'customizable': product.customizable
                    },
                    'quantity': cart[i]['quantity'],
                    'get_item_total': product_total
                }

                # Add details of the item to the dictionary with all items in the cart
                items.append(item)
            
            except:
                if i == 'order_note':
                    pass
                elif i == 'hamper':
                    pass
                else:
                    deleted_items.append(i)

        hamper_choice = cart['hamper']
        if hamper_choice:
            if cart_quantity <= 4:
                hamper_price =200 # Change prices
            elif 4 < cart_quantity <= 8:
                hamper_price =400
            else:
                hamper_price =600
        else:
            hamper_price = ''

        if hamper_price == '':
            cart_total_price += 0
        else:
            cart_total_price += hamper_price # Change prices
        order_note = cart['order_note']

        # Consider Delivery
        if cart_total_price < 1500:
            delivery = 80
        else:
            delivery = 0
        
        cart_total_price_with_delivery = cart_total_price + delivery
        # Pass the cart total price and total quantity into the order model
        order = {'number_of_items': cart_quantity, 'total': cart_total_price, 'note': order_note, 'hamper': hamper_choice, 'hamper_price': hamper_price, 'total_with_delivery': cart_total_price_with_delivery}
    else:
        items = []
        order = {}
        deleted_items = []

    return {'order_items': items, 'order': order, 'deleted_items': deleted_items}

def guestOrder(request, data):
    return ''