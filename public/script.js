document.addEventListener('DOMContentLoaded', () => {
    fetchData();

    // Add event listener for general filter
    document.getElementById('general-filter').addEventListener('input', filterTable);
});

// API URL
const apiUrl = 'http://localhost:3000/serviceProviders';

// Function to fetch and display data
function fetchData() {
    console.log("fetchData called");
    fetch(apiUrl)
        .then(response => {
            console.log("fetch response:", response);
            if (!response.ok) {
                console.log("Response not ok");
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("fetch data:", data);
            if (data && Array.isArray(data)) {
                populateTable(data);
            } else {
                console.error("Data is not in the correct format or is empty");
                console.log("Returned data:", data);
            }
        })
        .catch(error => {
            console.error("fetch error:", error);
        });
}

// Function to populate the table
function populateTable(serviceProviders) {
    const tableBody = document.getElementById('serviceTable');
    tableBody.innerHTML = '';

    serviceProviders.forEach(service => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${service.id}</td>
            <td>${service.companyName}</td>
            <td>${service.description}</td>
            <td>${service.location}</td>
            <td>${service.availability}</td>
            <td>
                <button class="view-profile-btn" onclick="viewProfile(${service.id})">View Profile</button>
                <button class="contact-btn" onclick="contactServiceProvider('${service.contact}', '${service.email}')">Contact</button>
                <button class="book-btn" onclick="bookService('${service.companyName}')">Book</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to view service provider profile
function viewProfile(serviceId) {
    console.log("viewProfile called. serviceId:", serviceId);
    fetch(`${apiUrl}/${serviceId}`)
        .then(response => {
            console.log("profile fetch response:", response);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("profile fetch data:", data);
            showCustomPopup(`
                Company: ${data.companyName}<br>
                Services: ${data.description}<br>
                Rating: ${data.rating}<br>
                Contact: ${data.contact}<br>
                Email: ${data.email}<br>
                Website: ${data.website}
            `);
        })
        .catch(error => console.error('Error fetching service details:', error));
}

function contactServiceProvider(contact, email) {
    showCustomPopup(`Contact: ${contact}<br>Email: ${email}`);
}

function bookService(companyName) {
    document.getElementById('booking-title').textContent = `Book ${companyName}`;
    document.getElementById('booking-popup').style.display = 'block';
}

function submitBooking(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const contact = document.getElementById('contact').value;
    const date = document.getElementById('date').value;

    console.log("Name:", name, "Contact:", contact, "Date:", date);

    // Clear form fields
    document.getElementById('name').value = '';
    document.getElementById('contact').value = '';
    document.getElementById('date').value = '';

    // Close the booking form
    closeBookingForm();

    // Display the notification message at the center of the viewport
    displayNotification('Booking successful! We will contact you soon.');
}

function displayNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.classList.add('notification');
    document.body.appendChild(notification);

    notification.style.position = 'absolute';
    notification.style.top = `${window.scrollY + (window.innerHeight - notification.offsetHeight) / 2}px`;
    notification.style.left = `${window.scrollX + (window.innerWidth - notification.offsetWidth) / 2}px`;

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function closeBookingForm() {
    document.getElementById('booking-popup').style.display = 'none';
}

function filterTable() {
    const filterValue = document.getElementById('general-filter').value.toLowerCase();
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const filteredData = data.filter(service => {
                const companyName = service.companyName.toLowerCase();
                const description = service.description.toLowerCase();
                const location = service.location.toLowerCase();

                return companyName.includes(filterValue) ||
                       description.includes(filterValue) ||
                       location.includes(filterValue);
            });
            populateTable(filteredData);
        })
        .catch(error => console.error("Error filtering data:", error));
}

function showCustomPopup(message) {
    const popupContainer = document.getElementById('custom-popup-container');
    const popup = document.createElement('div');
    popup.classList.add('custom-popup');
    popup.innerHTML = `
        <p>${message}</p>
        <button onclick="closeCustomPopup()">Close</button>
    `;
    popupContainer.appendChild(popup);
    popupContainer.style.display = 'flex'; // Show the popup
}

function closeCustomPopup() {
    const popupContainer = document.getElementById('custom-popup-container');
    popupContainer.innerHTML = ''; // Clear the popup
    popupContainer.style.display = 'none'; // Hide the container
}
