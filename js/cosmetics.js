// Function to handle adding/removing from wishlist
function handleWishlistButtonClick(button) {
    var card = button.parentNode;
    var price = parseFloat(card.getAttribute("data-price"));
    var budgetAmount = getBudgetAmountFromCookie();

    if (button.classList.contains("added")) {
        // Remove from wishlist
        budgetAmount += price;
        removeItemFromWishlist(button);
    } else {
        // Add to wishlist
        if (budgetAmount >= price) {
            budgetAmount -= price;
            addItemToWishlist(button);
        } else {
            alert("Insufficient budget amount!");
            return;
        }
    }

    updateBudgetAmountInCookie(budgetAmount);
}

// Function to add item to wishlist
function addItemToWishlist(button) {
    var card = button.parentNode;
    button.classList.add("added");
    button.textContent = "Remove from wishlist";
    var cardHTML = card.outerHTML;
    saveCardToCookie(cardHTML);
}

// Function to remove item from wishlist
function removeItemFromWishlist(button) {
    button.classList.remove("added");
    button.textContent = "Add to wishlist";
    // Remove image from cookie
    removeCardFromCookie();
}

// Function to update budget amount in cookie
function updateBudgetAmountInCookie(amount) {
    document.cookie = "budgetAmount=" + amount + ";path=/";
}

function saveCardToCookie(card) {
    var cardHTML = card.outerHTML;
    document.cookie = "wishlistCard=" + encodeURIComponent(cardHTML) + ";path=/";
}

// Function to remove entire cosmetic card from cookie
function removeCardFromCookie() {
    document.cookie = "wishlistCard=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// Function to retrieve budget amount from cookie
function getBudgetAmountFromCookie() {
    var name = "budgetAmount=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookieArray = decodedCookie.split(';');
    for(var i = 0; i < cookieArray.length; i++) {
        var cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
            return parseFloat(cookie.substring(name.length));
        }
    }
    return 0;
}

// Function to handle wishlist button click
var wishlistButtons = document.querySelectorAll('.wishlist-button');
wishlistButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        handleWishlistButtonClick(this);
    });
});