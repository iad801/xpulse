// Function to handle adding/removing from wishlist
function handleWishlistButtonClick(button) {
    var card = button.parentNode;
    var price = parseFloat(card.getAttribute("data-price"));
    var budgetAmount = getBudgetAmountFromCookie();
    var currentTotal = calculateCurrentTotal();
    var remainingBudget = budgetAmount - currentTotal;

    if (button.classList.contains("added")) {
        // Remove from wishlist
        remainingBudget += price;
        currentTotal -= price;
        removeItemFromWishlist(button);
    } else {
        // Add to wishlist
        if (remainingBudget >= price) {
            remainingBudget -= price;
            currentTotal += price;
            addItemToWishlist(button);
        } else {
            var overBudgetAmount = price - remainingBudget;
            showCustomAlert(overBudgetAmount, remainingBudget, currentTotal);
            return;
        }
    }

    updateBudgetAmountInCookie(remainingBudget + currentTotal);
}

// Function to show custom alert popup
function showCustomAlert(overBudgetAmount, remainingBudget, currentTotal) {
    var alertPopup = document.getElementById('custom-alert');
    var alertMessage = document.getElementById('alert-message');
    var alertBudget = document.getElementById('alert-budget');
    var alertTotal = document.getElementById('alert-total');

    alertMessage.textContent = `You are ${overBudgetAmount.toFixed(2)} over your budget. Please remove a skin.`;
    alertBudget.textContent = `Remaining Budget: ${remainingBudget.toFixed(2)}`;
    alertTotal.textContent = `Current Total: ${currentTotal.toFixed(2)}`;

    alertPopup.classList.remove('hidden');

    var okButton = document.getElementById('alert-ok-button');
    okButton.addEventListener('click', function() {
        alertPopup.classList.add('hidden');
    });
}

// Function to calculate the current total value of items in the wishlist
function calculateCurrentTotal() {
    var total = 0;
    document.querySelectorAll('.wishlist-button.added').forEach(function(button) {
        var card = button.parentNode;
        var price = parseFloat(card.getAttribute("data-price"));
        total += price;
    });
    return total;
}

// Function to add item to wishlist
function addItemToWishlist(button) {
    var card = button.parentNode;
    button.classList.add("added");
    button.textContent = "Remove from wishlist";
    saveCardToCookie(card.outerHTML);
}

// Function to remove item from wishlist
function removeItemFromWishlist(button) {
    var card = button.parentNode;
    button.classList.remove("added");
    button.textContent = "Add to wishlist";
    removeCardFromCookie(card.outerHTML);
}

// Function to update budget amount in cookie
function updateBudgetAmountInCookie(amount) {
    document.cookie = "budgetAmount=" + amount + ";path=/";
}

function saveCardToCookie(card) {
    var wishlistCards = getWishlistCardsFromCookie();
    wishlistCards.push(card);
    document.cookie = "wishlistCards=" + encodeURIComponent(JSON.stringify(wishlistCards)) + ";path=/";
}

// Function to remove card from cookie
function removeCardFromCookie(card) {
    var wishlistCards = getWishlistCardsFromCookie();
    wishlistCards = wishlistCards.filter(function(storedCard) {
        return storedCard !== card;
    });
    document.cookie = "wishlistCards=" + encodeURIComponent(JSON.stringify(wishlistCards)) + ";path=/";
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

// Function to retrieve wishlist cards from cookie
function getWishlistCardsFromCookie() {
    var name = "wishlistCards=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookieArray = decodedCookie.split(';');
    for(var i = 0; i < cookieArray.length; i++) {
        var cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
            return JSON.parse(decodeURIComponent(cookie.substring(name.length)));
        }
    }
    return [];
}

// Function to handle wishlist button click
var wishlistButtons = document.querySelectorAll('.wishlist-button');
wishlistButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        handleWishlistButtonClick(this);
    });
});