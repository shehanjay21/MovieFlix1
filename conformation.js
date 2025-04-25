document.addEventListener('DOMContentLoaded', function() {
    // Retrieve booking details from session storage
    const bookingDetails = JSON.parse(sessionStorage.getItem('bookingConfirmation'));

    // If no booking details found, redirect to home page
    if (!bookingDetails) {
        window.location.href = 'index.html';
        return;
    }

    // Display booking details
    displayBookingDetails(bookingDetails);

    // Set up button event listeners
    setupButtonInteractions();
});

/**
 * Displays the booking details on the confirmation page
 * @param {Object} bookingDetails - The booking information object
 */
function displayBookingDetails(bookingDetails) {
    // Update the DOM with booking details
    document.getElementById('booking-ref').textContent = bookingDetails.bookingReference || 'N/A';
    
    // Display movie information
    if (bookingDetails.order && bookingDetails.order.items && bookingDetails.order.items.length > 0) {
        const movieInfo = bookingDetails.order.items.map(item => 
            `${item.name} (${item.quantity} ticket${item.quantity > 1 ? 's' : ''})`
        ).join(', ');
        document.getElementById('movie-title').textContent = movieInfo;
    } else {
        document.getElementById('movie-title').textContent = 'N/A';
    }

    // Display the selected showtime
    if (bookingDetails.showtime) {
        document.getElementById('show-time').textContent = bookingDetails.showtime;
    } else {
        document.getElementById('show-time').textContent = 'Not specified';
    }

    // Display seats
    document.getElementById('seat-details').textContent = bookingDetails.seats || 'Not specified';

    // Display total paid
    if (bookingDetails.order && bookingDetails.order.total) {
        document.getElementById('total-paid').textContent = `$${bookingDetails.order.total.toFixed(2)}`;
    } else {
        document.getElementById('total-paid').textContent = 'N/A';
    }

    // Display customer email
    document.getElementById('customer-email').textContent = bookingDetails.customer.email || 'Not provided';
}

/**
 * Sets up all button interactions on the confirmation page
 */
function setupButtonInteractions() {
    // Print ticket button
    document.getElementById('print-ticket').addEventListener('click', function() {
        window.print();
    });

    // Back to home button
    document.getElementById('back-to-home').addEventListener('click', function() {
        // Clear the booking confirmation from session storage
        sessionStorage.removeItem('bookingConfirmation');
        window.location.href = 'index.html';
    });
}