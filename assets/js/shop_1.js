// Set time of expiry for cookies
var now = new Date();
var time = now.getTime();
var expireTime = time + 1000*1814400; // Set expiry of cookies to 3 weeks
now.setTime(expireTime);

// Set other variables needed
var csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
const shopping_cart_item_template = $('#shopping_cart_item_template').html();

$(document).ready(function() {
    addToCartFunction ();
    expandToggle();
})

// Function to update cart items on clicking on the 'Add to Cart' button or adding via the shopping cart
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

// Function to show the popup that informs the user that the item has been added to cart
$(document).ready(function(){
    $(".show_add_to_cart_popup").click(function(){
      $(".add_to_cart_popup_message").fadeIn();
      $(".add_to_cart_popup_message").fadeOut(2000);
    });
  });
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

// Function to Update Order Note after typing
    var order_note = document.getElementById('order_note');
    function changeValue() {
        let note = $('#shopping_cart_display #order_note').val().trim();
        cart['order_note'] = note;
        document.cookie = "cart =" + JSON.stringify(cart) + ';domain=;expires='+now.toGMTString()+';path=/';
    }
    order_note.onchange = changeValue;
    order_note.onblur = changeValue;

// Function to add product to cart
function updateUserCart(productId, action) {
    if (action =='add') { // If the item is being added
        if (cart[productId] == undefined) { // If the cart does not have the corresponding productid
            cart[productId] = {'quantity': 1};
        }
        else { // If the cart already has the productid
            cart[productId]['quantity'] +=1; // increment quantity by 1
        }
    }

    if (action =='remove') { // If the item is being removed
        cart[productId]['quantity'] -=1; // decrease quantity by 1

        if (cart[productId]['quantity'] <=0) { // If the item quantity is zero
            delete cart[productId];
        }
    }

    if (action =='delete') {
        delete cart[productId];
    }

    document.cookie = "cart =" + JSON.stringify(cart) + ';domain=;expires='+now.toGMTString()+';path=/';
    getUserCartInfo();
}

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

        $("#order_note")[0]['value'] == data['order']['note'];
        $('#shopping_cart_item_hamper_price').html(data['order']['hamper_price']);

        if (data['order']['total'] < 1500) {
            $('#shopping_cart_item_delivery_price').html(80);
        }
        else {
            $('#shopping_cart_item_delivery_price').html(0);
        }
        $('#shopping_cart_order_total').html(data['order']['total_with_delivery']);
        $('#shopping_cart_number_of_items').html(data['order']['number_of_items']);
        
        addToCartFunction ();
        expandToggle();
    })
}

// Function to Update Hamper Choice from cart
    let hamper = document.getElementById('hamper_checkbox');

    function changeHamperValue() {
        let choice = $('#shopping_cart_display #hamper_checkbox').prop("checked");
        cart['hamper'] = choice;
        document.cookie = "cart =" + JSON.stringify(cart) + ';domain=;expires='+now.toGMTString()+';path=/';
        
        getUserCartInfo()
    }
    hamper.onchange = changeHamperValue;
    hamper.onblur = changeHamperValue;