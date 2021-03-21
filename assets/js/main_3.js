// Set time of expiry for cookies
var now = new Date();
var time = now.getTime();
var expireTime = time + 1000*1814400; // Set expiry of cookies to 3 weeks
now.setTime(expireTime);

// Remove Loader screen on loading
$(window).on("load", function () {
  $(".loader").fadeOut("slow");
})

// Function to change the active nav on the navbar
    // id of each nav is the same as the basename of the href
    $(document).ready(function() {
        const x = location.pathname;
        if (x==='/' || x==='/home/') { // if it is the homepage
          $('#home').addClass('active');
          navbar_visible_on_scroll();
          // Function to go to the top when refreshing the page
          // Taken from 'https://stackoverflow.com/questions/3664381/force-page-scroll-position-to-top-at-page-refresh-in-html'
          $(window).on('beforeunload', function(){
            $(window).scrollTop(0,0);
         });
        }
        else {
          const page = '#'+x.slice(1,-1);
          $(page).addClass('active')
          $('.navbar').addClass("navbar-show");
          $('.navbar-brand').removeClass("invisible");
        }
    });

// Function to make the navbar appear after scroll
function navbar_visible_on_scroll() {
  // scroll functions
  $(window).scroll(function(e) {
    // add/remove class to navbar when scrolling to hide/show
    var scroll = $(window).scrollTop();
    if (scroll >= 50) {
        $('.navbar').addClass("navbar-show");
        $('.navbar-brand').removeClass("invisible");
    } else {
        $('.navbar').removeClass("navbar-show");
        $('.navbar-brand').addClass("invisible");
    }

  });
};
  
// Function for animation of the product cards in the 'products' page
// Taken from 'https://cssanimation.rocks/scroll-animations/''
    // Detect request animation frame
    var scroll = window.requestAnimationFrame ||
    // IE Fallback
    function(callback){ window.setTimeout(callback, 1000/60)};
    var elementsToShow = document.querySelectorAll('.show-on-scroll'); 
  
    function loop() {
      Array.prototype.forEach.call(elementsToShow, function(element){
      if (isElementInViewport(element)) {
      element.classList.add('is-visible');
      } else {
      element.classList.remove('is-visible');
      }
      });
  
      scroll(loop);
    }
  
    // Call the loop for the first time
    loop();
  
    // Helper function from: http://stackoverflow.com/a/7557433/274826
    function isElementInViewport(el) {
      // special bonus for those using jQuery
      if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
      }
      var rect = el.getBoundingClientRect();
      return (
      (rect.top <= 0
      && rect.bottom >= 0)
      ||
      (rect.bottom >= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.top <= (window.innerHeight || document.documentElement.clientHeight))
      ||
      (rect.top >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight))
      );
    }

/*// Function to maintain collapse state of shopping cart
var shopping_cart = document.getElementById('shopping_cart_toggle')
shopping_cart.addEventListener('click', function() {
  if(!$("#shopping_cart_display").hasClass('show')){
    localStorage.setItem('shopping_cart', 'shown');
  }
  else {
    localStorage.setItem('shopping_cart', 'hidden');
  }
});

$(document).ready(function() {
  var shopping_cart_status = localStorage.getItem('shopping_cart');
  if (shopping_cart_status == 'shown') {
    $("#shopping_cart_display").removeClass('collapse');
  }
  else {
    $("#shopping_cart_display").addClass('collapse');
  }
});
*/

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
}

var cart = JSON.parse(getCookie('cart'))

if (cart == undefined) {
    cart = {'order_note': '', 'hamper': false}
    document.cookie = "cart =" + JSON.stringify(cart) + ';domain=;expires='+now.toGMTString()+';path=/';
}

