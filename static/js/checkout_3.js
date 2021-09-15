// Set time of expiry for cookies
var now = new Date();
var time = now.getTime();
var expireTime = time + 1000*1814400; // Set expiry of cookies to 3 weeks
now.setTime(expireTime);

// Remove Loader screen on loading
$(window).on("load", function () {
    $(".loader").fadeOut("slow");
})

// Set other variables needed
var csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
const shopping_cart_item_template = $('#shopping_cart_item_template').html();
$(document).ready(function() {
    addToCartFunction ();
    expandToggle();
})

// Function to update cart items on clicking on the 'Add to Cart' button
function addToCartFunction () {
    var add_to_cart_buttons = document.getElementsByClassName('update_cart')

    for (var i=0; i<add_to_cart_buttons.length; i++) {
        try {
            add_to_cart_buttons[i].removeEventListener('click',updateCart);
        }
        catch(err) {
            //pass
        }
        add_to_cart_buttons[i].addEventListener('click',updateCart);
    }
}

function updateCart() {
    var productId = $(this).data()['product'];
    var action = $(this).data()['action'];

    updateUserCart(productId, action);
}

// Function to expand the products in the category on products page
function expandToggle() {
    var expand_buttons = document.getElementsByClassName('expand_products_toggle')
    for (var i=0; i<expand_buttons.length; i++) {
        expand_buttons[i].removeEventListener('click', collapseData);
        expand_buttons[i].addEventListener('click', collapseData);
    }
}

function collapseData() {
    var button_category = $(this);
    var grandparent = button_category[0].closest('.compress_info');
    var child_main = $(grandparent).find('#product_details').first();
    if (child_main[0].classList.contains('collapse')) {
    child_main[0].classList.remove('collapse');
    }
    else {
    child_main[0].classList.add('collapse');
    }
}
  
// Function to create cart cookies
function getCookie(name) {
        // Split cookie string and get all individual name=value pairs in an array
        var cookieArr = document.cookie.split(';');

        // Loop through the array elements
        for(var i=0; i<cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=")

        // Removing whitespace at the beginning of the cookie name, and compare it with the given string
        if (name==cookiePair[0].trim()) {
            // decode the cookie value and return
            return decodeURIComponent(cookiePair[1])
        }
        }

        // Return null if not found
        return null;
    };

var cart = JSON.parse(getCookie('cart'));

if (cart == undefined) {
    cart = {'order_note': '', 'hamper': false};
    document.cookie = "cart =" + JSON.stringify(cart) + ';domain=;expires='+now.toGMTString()+';path=/';
};

// Function to add product to cart
function updateUserCart(productId, action) {
    if (action =='add') { // If the item is being added
        if (cart[productId] == undefined) { // If the cart does not have the corresponding productid
            cart[productId] = {'quantity': 1};
        }
        else { // If the cart already has the productid
            cart[productId]['quantity'] +=1; // increment quantity by 1
        };
    };

    if (action =='remove') { // If the item is being removed
        cart[productId]['quantity'] -=1; // decrease quantity by 1

        if (cart[productId]['quantity'] <=0) { // If the item quantity is zero
            delete cart[productId];
        };
    };

    if (action =='delete') {
        delete cart[productId];
    };

    document.cookie = "cart =" + JSON.stringify(cart) + ';domain=;expires='+now.toGMTString()+';path=/';
    getUserCartInfo();
};

function getUserCartInfo() {
    cart_cookie = JSON.parse(getCookie('cart'));

    fetch('/update_cart/', {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
            mode: 'same-origin'
        },
        body:JSON.stringify({
            'cart': cart_cookie
        })
    })
    .then((response) => response.json())
    .then((data) => {
        var shopping_cart_items = document.getElementById('shopping_cart_items')
        for (var i=0; i<data['deleted_items'].length; i++) {
            delete cart_cookie[data['deleted_items'][i]];
            document.cookie = "cart =" + JSON.stringify(cart_cookie) + ';domain=;expires='+now.toGMTString()+';path=/';
        }
        while (shopping_cart_items.lastElementChild) {
            shopping_cart_items.removeChild(shopping_cart_items.lastElementChild);
          }
        for (i=0; i<data['order_items'].length; i++) {
            var template = $(shopping_cart_item_template).clone();
            var product = data['order_items'][i]
            var product_id = product['product']['id']
            $(template).find('#shopping_cart_item_name').html(product['product']['name']);
            $(template).find('#shopping_cart_item_category').html(product['product']['category']);
            $(template).find('#shopping_cart_item_description').html(product['product']['description']);
            $(template).find('#shopping_cart_item_quantity').html(product['quantity']);
            $(template).find('#shopping_cart_item_total').html(product['get_item_total']);
            var change_el = $(template).find('.shopping_cart_item_change_details');
            for (x=0;x<change_el.length; x++) {
                $(change_el[x]).data('product', product_id);
            }
            
            if (product['product']['vegan']==false) {
                var vegan_template = $(template).find('#shopping_cart_item_vegan');
                vegan_template[0].style.display = "none";
            }

            if (product['product']['gluten_free']==false) {

                var gf_template = $(template).find('#shopping_cart_item_gluten_free');
                gf_template[0].style.display = "none";
            }

            if (product['product']['customizable']==false) {
                var cust_template = $(template).find('#shopping_cart_item_customizable');
                cust_template[0].style.display = "none";
            }

            $('#shopping_cart_items').append(template);
        }

        $('#shopping_cart_item_hamper_price').html(data['order']['hamper_price']);
        if (data['order']['total'] < 2500) {
            $('#shopping_cart_item_delivery_price').html(200);
        }
        else {
            $('#shopping_cart_item_delivery_price').html(0);
        }
        $('#shopping_cart_order_total').html(data['order']['total_with_delivery']);
        $('#shopping_cart_number_of_items').html(data['order']['number_of_items']);
        $('#checkout_total_price').html(data['order']['total_with_delivery']);

        addToCartFunction ();
        expandToggle();
    })
}

// Functions for validating the Delivery Form
// Verify the Full Name
let delivery_form_name = document.getElementById('delivery_form_name')
delivery_form_name.addEventListener('change', function() {
    let name = $('#delivery_form_name').val().trim();
    if (name==null || name=="" || !/^[A-Za-z\s]+$/.test(name)){
        $('#verification_name').removeClass('fa-check');
        $('#verification_name').addClass('fa-times');
        $('#warning_name').removeClass('hidden');
    }
    else {
        $('#verification_name').removeClass('fa-times');
        $('#verification_name').addClass('fa-check');
        $('#warning_name').addClass('hidden');
    }
});

// Verify email address
let delivery_form_email = document.getElementById('delivery_form_email')
delivery_form_email.addEventListener('change', function() {
    if (delivery_form_email.validity.typeMismatch) {
        $('#verification_email').removeClass('fa-check');
        $('#verification_email').addClass('fa-times');
        $('#warning_email').removeClass('hidden');
    }
    else {
        $('#verification_email').removeClass('fa-times');
        $('#verification_email').addClass('fa-check');
        $('#warning_email').addClass('hidden');
    }
});

// Verify Phone Number
let delivery_form_phone = document.getElementById('delivery_form_phone')
delivery_form_phone.addEventListener('change', function() {
    let phone = $('#delivery_form_phone').val().trim();
    if (phone.length!==10) {
        $('#verification_phone').removeClass('fa-check');
        $('#verification_phone').addClass('fa-times');
        $('#warning_phone').removeClass('hidden');
    }
    else {
        $('#verification_phone').removeClass('fa-times');
        $('#verification_phone').addClass('fa-check');
        $('#warning_phone').addClass('hidden');
    }
});

// Verify the Delivery Address
let delivery_form_address = document.getElementById('delivery_form_address')
delivery_form_address.addEventListener('change', function() {
    let address = $('#delivery_form_address').val().trim();
    if (address==null || address=="") {
        $('#verification_address').removeClass('fa-check');
        $('#verification_address').addClass('fa-times');
        $('#warning_address').removeClass('hidden');
    }
    else {
        $('#verification_address').removeClass('fa-times');
        $('#verification_address').addClass('fa-check');
        $('#warning_address').addClass('hidden');
    }
});

// Verify the City Name
let delivery_form_city = document.getElementById('delivery_form_city')
delivery_form_city.addEventListener('change', function() {
    let city = $('#delivery_form_city').val().trim();
    if (city==null || city=="" || !/^[A-Za-z\s]+$/.test(city)){
        $('#verification_city').removeClass('fa-check');
        $('#verification_city').addClass('fa-times');
        $('#warning_city').removeClass('hidden');
    }
    else {
        $('#verification_city').removeClass('fa-times');
        $('#verification_city').addClass('fa-check');
        $('#warning_city').addClass('hidden');
    }
});

// Verify Postal Code
let delivery_form_postal = document.getElementById('delivery_form_postal')
delivery_form_postal.addEventListener('change', function() {
    let postal_code = $('#delivery_form_postal').val().trim();
    if (postal_code.length!==6) {
        $('#verification_postal').removeClass('fa-check');
        $('#verification_postal').addClass('fa-times');
        $('#warning_postal').removeClass('hidden');
    }
    else {
        $('#verification_postal').removeClass('fa-times');
        $('#verification_postal').addClass('fa-check');
        $('#warning_postal').addClass('hidden');
    }
});

// Function to send Order + Delivery details to Backend
let checkout_button = document.getElementById('delivery_form_submit');

checkout_button.onclick = function() {
    if ($('#verification_name').hasClass('fa-check') && $('#verification_email').hasClass('fa-check') && $('#verification_phone').hasClass('fa-check') && $('#verification_address').hasClass('fa-check') && $('#verification_city').hasClass('fa-check') && $('#verification_postal').hasClass('fa-check')) {
        processCheckout();
    }
}

function processCheckout() {
    cart_cookie = JSON.parse(getCookie('cart'));

    fetch('/update_cart/', {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
            mode: 'same-origin'
        },
        body:JSON.stringify({
            'cart': cart_cookie
        })
    })
    .then((response) => response.json())
    .then((data) => {
        document.cookie = "cart =" + JSON.stringify(cart_cookie) + ';domain=;expires='+now.toGMTString()+';path=/';
        checkout_price = data['order']['total_with_delivery'];
        submitData();
    })
}

function submitData() {
    let form = document.getElementById('delivery_form');
    let UserDeliveryDetails = {
        'name': form.name.value,
        'email': form.email.value,
        'phone_number': form.phone_number.value,
        'address': form.address.value,
        'city': form.city.value,
        'postal_code': form.postal_code.value,
        'amount': checkout_price.toFixed(2)
    }

    document.cookie = "dd=" + JSON.stringify(UserDeliveryDetails) + ';domain=;expires='+now.toGMTString()+';path=/';

    proceedToPayment();
}

function proceedToPayment() {
    let form = document.getElementById('delivery_form');
    let payment_details_form = document.getElementById('payment_details_form');
    var name = form.name.value;
    let firstname = name.split(" ")[0]
    checkout_price = checkout_price.toFixed(2) // Convert to Float

    payment_details_form.firstname.value = firstname
    payment_details_form.email.value = form.email.value
    payment_details_form.phone.value = form.phone_number.value
    payment_details_form.amount.value = checkout_price // type should be float
    payment_details_form.productinfo.value = 'Food items added to cart'
    payment_details_form.surl.value = 'https://dalisay.co.in/payment_success' // http://127.0.0.1:8000/payment_success
    payment_details_form.furl.value = 'https://dalisay.co.in/payment_failure' // http://127.0.0.1:8000/payment_failure
    payment_details_form.service_provider.value = 'payu_paisa' // Change if needed

    payment_details_form.submit();
}