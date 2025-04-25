document.addEventListener('DOMContentLoaded', function() {
    // Load order summary when page loads
    loadOrderSummary();
    
    // Back to cart button
    document.getElementById('back-to-cart').addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    // Form submission handler
    const paymentForm = document.getElementById('payment-form');
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form first
        if (!validateForm()) {
            return false;
        }

        // Process payment if validation passes
        processPayment();
    });

    // Clear errors when user starts typing
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', function() {
            this.style.borderColor = '#ddd';
            const errorElement = this.nextElementSibling;
            if (errorElement && errorElement.classList.contains('error-message')) {
                errorElement.remove();
            }
        });
    });
});

function loadOrderSummary() {
    const order = JSON.parse(sessionStorage.getItem('currentOrder'));
    if (order) {
        updateOrderDisplay(order);
    } else {
        // No order found, redirect back to index
        window.location.href = 'index.html';
    }
}

function updateOrderDisplay(order) {
    const orderItemsContainer = document.getElementById('order-items');
    orderItemsContainer.innerHTML = '';
    
    let subtotal = 0;
    
    order.items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        const totalPrice = item.quantity * item.price;
        subtotal += totalPrice;
        
        itemElement.innerHTML = `
            <span class="item-name">${item.name} × ${item.quantity}</span>
            <span class="item-price">$${totalPrice.toFixed(2)}</span>
        `;
        orderItemsContainer.appendChild(itemElement);
    });
    
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    
    document.getElementById('order-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('order-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('order-total').textContent = `$${total.toFixed(2)}`;
    
    // Store the calculated total in the order object
    order.total = total;
    sessionStorage.setItem('currentOrder', JSON.stringify(order));
}

function validateForm() {
    clearErrors();
    let isValid = true;
    
    // Validate name
    const fullName = document.getElementById('full-name').value.trim();
    if (fullName === '') {
        showError('full-name', 'Please enter your full name');
        isValid = false;
    }
    
    // Validate email
    const email = document.getElementById('email').value.trim();
    if (email === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate phone
    const phone = document.getElementById('phone').value.trim();
    if (phone === '' || !/^[\d\s\-()+]{10,}$/.test(phone)) {
        showError('phone', 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Validate card name
    const cardName = document.getElementById('card-name').value.trim();
    if (cardName === '') {
        showError('card-name', 'Please enter the name on card');
        isValid = false;
    }
    
    // Validate card number
    const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
    if (cardNumber === '' || !/^\d{13,16}$/.test(cardNumber)) {
        showError('card-number', 'Please enter a valid card number (13-16 digits)');
        isValid = false;
    }
    
    // Validate expiry date
    const expiryDate = document.getElementById('expiry-date').value.trim();
    if (expiryDate === '' || !/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiryDate)) {
        showError('expiry-date', 'Please enter a valid expiry date (MM/YY)');
        isValid = false;
    }
    
    // Validate CVV
    const cvv = document.getElementById('cvv').value.trim();
    if (cvv === '' || !/^\d{3,4}$/.test(cvv)) {
        showError('cvv', 'Please enter a valid CVV (3-4 digits)');
        isValid = false;
    }
    
    return isValid;
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    field.style.borderColor = 'red';
    
    let errorElement = field.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('error-message')) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = 'red';
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.marginTop = '5px';
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
    
    errorElement.textContent = message;
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('input, select').forEach(el => {
        el.style.borderColor = '#ddd';
    });
}

function processPayment() {
    // Get form data
    const formData = new FormData(document.getElementById('payment-form'));
    const order = JSON.parse(sessionStorage.getItem('currentOrder'));

    // Get the selected showtime from the first item
    const showtime = order.items[0].showtime || generateRandomShowtime();

    // Generate booking details
    const bookingDetails = {
        bookingReference: generateBookingReference(),
        order: order,
        showtime: showtime,
        seats: getSelectedSeats(),
        customer: {
            name: formData.get('full-name'),
            email: formData.get('email'),
            phone: formData.get('phone')
        },
        payment: {
            method: 'Credit Card',
            last4: document.getElementById('card-number').value.slice(-4)
        }
    };

    // Store booking details for confirmation page
    sessionStorage.setItem('bookingConfirmation', JSON.stringify(bookingDetails));
    sessionStorage.setItem('customerEmail', formData.get('email'));

    // Redirect to confirmation page
    window.location.href = 'confirmation.html';
}

function generateBookingReference() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function generateRandomShowtime() {
    const days = ['Today', 'Tomorrow'];
    const times = ['11:00 AM', '2:30 PM', '5:00 PM', '7:30 PM', '10:00 PM'];
    const randomDay = days[Math.floor(Math.random() * days.length)];
    const randomTime = times[Math.floor(Math.random() * times.length)];
    return `${randomDay} at ${randomTime}`;
}

function getSelectedSeats() {
    const order = JSON.parse(sessionStorage.getItem('currentOrder'));
    const seatPreference = document.getElementById('seat-preference').value;
    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    const numSeats = order.items.reduce((total, item) => total + item.quantity, 0);
    const seats = [];
    
    // Generate seats based on preference
    for (let i = 0; i < numSeats; i++) {
        let row, number;
        
        if (seatPreference === 'front') {
            row = rows[Math.floor(Math.random() * 2)]; // A or B
            number = Math.floor(Math.random() * 5) + 1; // 1-5
        } else if (seatPreference === 'middle') {
            row = rows[Math.floor(Math.random() * 2) + 2]; // C or D
            number = Math.floor(Math.random() * 10) + 1; // 1-10
        } else if (seatPreference === 'back') {
            row = rows[Math.floor(Math.random() * 2) + 4]; // E or F
            number = Math.floor(Math.random() * 10) + 1; // 1-10
        } else if (seatPreference === 'aisle') {
            row = rows[Math.floor(Math.random() * rows.length)];
            number = Math.random() > 0.5 ? 1 : 10; // 1 or 10
        } else if (seatPreference === 'center') {
            row = rows[Math.floor(Math.random() * rows.length)];
            number = Math.floor(Math.random() * 3) + 5; // 5-7
        } else { // any
            row = rows[Math.floor(Math.random() * rows.length)];
            number = Math.floor(Math.random() * 10) + 1; // 1-10
        }
        
        seats.push(`${row}${number}`);
    }
    
    return seats.join(', ');
}