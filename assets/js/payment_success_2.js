// Set time of expiry for cookies
var now = new Date();
var time = now.getTime();
var expireTime = time + 1000*1814400; // Set expiry of cookies to 3 weeks
now.setTime(expireTime);

// Set other variables needed
$(document).ready(function() {
    expandToggle();
    resetCookies();
})

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

function resetCookies() {
    cart = {'order_note': '', 'hamper': false}
    document.cookie = "cart =" + JSON.stringify(cart) + ';domain=;expires='+now.toGMTString()+';path=/';
    document.cookie = 'dd =' + ';domain=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
}
