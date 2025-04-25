document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    mobileMenuToggle.addEventListener('click', function () {
        mainNav.classList.toggle('active');
    });

    // Ticket quantity controls
    document.querySelectorAll('.increment').forEach(button => {
        button.addEventListener('click', function () {
            const input = this.previousElementSibling;
            if (parseInt(input.value) < parseInt(input.max)) {
                input.value = parseInt(input.value) + 1;
                updateCart();
            }
        });
    });

    document.querySelectorAll('.decrement').forEach(button => {
        button.addEventListener('click', function () {
            const input = this.nextElementSibling;
            if (parseInt(input.value) > parseInt(input.min)) {
                input.value = parseInt(input.value) - 1;
                updateCart();
            }
        });
    });

    document.querySelectorAll('.ticket-qty').forEach(input => {
        input.addEventListener('change', function () {
            if (this.value < this.min) this.value = this.min;
            if (this.value > this.max) this.value = this.max;
            updateCart();
        });
    });

    // Cart functionality
    function updateCart() {
        const cartItems = document.getElementById('cart-items');
        cartItems.innerHTML = '';

        let subtotal = 0;

        document.querySelectorAll('.movie-card').forEach(card => {
            const qty = parseInt(card.querySelector('.ticket-qty').value);
            if (qty > 0) {
                const movieTitle = card.querySelector('h3').textContent;
                const showtimeSelect = card.querySelector('.time-selector');
                const showtimeText = showtimeSelect.options[showtimeSelect.selectedIndex].text;
                const priceText = card.querySelector('.price').textContent;
                const price = parseFloat(priceText.replace('$', ''));
                const total = qty * price;

                subtotal += total;

                const row = document.createElement('tr');
                row.className = 'cart-item';
                row.innerHTML = `
                    <td>${movieTitle}</td>
                    <td class="showtime-cell">${showtimeText}</td>
                    <td>${qty}</td>
                    <td>${priceText}</td>
                    <td>$${total.toFixed(2)}</td>
                `;
                cartItems.appendChild(row);
            }
        });

        // Update totals
        const tax = subtotal * 0.08;
        const grandTotal = subtotal + tax;

        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('total').textContent = `$${grandTotal.toFixed(2)}`;

        // Save to session storage
        saveCurrentOrder();
    }

    // Save favorite functionality
    document.getElementById('save-favorite').addEventListener('click', function () {
        const favorites = {};

        document.querySelectorAll('.movie-card').forEach(card => {
            const movieTitle = card.querySelector('h3').textContent;
            const qty = parseInt(card.querySelector('.ticket-qty').value, 10);
            if (qty > 0) {
                favorites[movieTitle] = qty;
            }
        });

        localStorage.setItem('movieFavorites', JSON.stringify(favorites));
        alert('Booking saved as favorite!');
    });

    // Apply favorite functionality
    document.getElementById('apply-favorite').addEventListener('click', function () {
        const favorites = JSON.parse(localStorage.getItem('movieFavorites'));

        if (!favorites) {
            alert('No favorites found!');
            return;
        }

        document.querySelectorAll('.movie-card').forEach(card => {
            const movieTitle = card.querySelector('h3').textContent;
            if (favorites[movieTitle]) {
                card.querySelector('.ticket-qty').value = favorites[movieTitle];
            } else {
                card.querySelector('.ticket-qty').value = 0;
            }
        });

        updateCart();
        alert('Favorite booking applied!');
    });

    // Checkout button
   
    document.getElementById('checkout-btn').addEventListener('click', function() {
        const total = parseFloat(document.getElementById('total').textContent.replace('$', ''));
        if (total > 0) {
            // Get selected showtime (you'll need to track this in your UI)
            const selectedShowtime = getSelectedShowtime();
            
            // Get selected seats (you'll need to implement seat selection)
            const selectedSeats = getSelectedSeats();

            // Prepare order data
            const order = {
                items: [],
                subtotal: parseFloat(document.getElementById('subtotal').textContent.replace('$', '')),
                tax: parseFloat(document.getElementById('tax').textContent.replace('$', '')),
                total: total
            };

            // Get all items in the cart
            document.querySelectorAll('.movie-card').forEach(card => {
                const qty = parseInt(card.querySelector('.ticket-qty').value);
                if (qty > 0) {
                    const movieTitle = card.querySelector('h3').textContent;
                    const priceText = card.querySelector('.price').textContent;
                    const price = parseFloat(priceText.replace('$', ''));
                    const showtimeSelect = card.querySelector('.time-selector');
                    const showtime = showtimeSelect.options[showtimeSelect.selectedIndex].text;

                    order.items.push({
                        name: movieTitle,
                        quantity: qty,
                        price: price,
                        showtime: showtime
                    });
                }
            });

            // Save to session storage
            sessionStorage.setItem('currentOrder', JSON.stringify(order));
            sessionStorage.setItem('selectedShowtime', selectedShowtime);
            sessionStorage.setItem('selectedSeats', selectedSeats);

            // Redirect to checkout page
            window.location.href = 'checkout.html';
        } else {
            alert('Please add tickets to your cart first!');
        }
    });

    // Helper function to get selected showtime
    function getSelectedShowtime() {
        // Implement this based on your UI
        // For now, return the first selected showtime
        const firstSelected = document.querySelector('.time-selector option:checked');
        return firstSelected ? firstSelected.text : 'Not specified';
    }

    // Helper function to get selected seats
    function getSelectedSeats() {
        // Implement this when you add seat selection
        return 'A1, A2'; // Placeholder
    }
});