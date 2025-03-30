document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    document.getElementById('general-filter').addEventListener('input', filterTable);
});

const apiUrl = "https://phase-1-singlpage-app-project.onrender.com/serviceProviders";

function fetchData() {
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (Array.isArray(data)) populateTable(data);
            else console.error("Data format incorrect or empty");
        })
        .catch(error => console.error("Fetch error:", error));
}

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
                <button onclick="viewProfile(${service.id})">View Profile</button>
                <button onclick="contactServiceProvider('${service.contact}', '${service.email}')">Contact</button>
                <button onclick="bookService('${service.companyName}')">Book</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function viewProfile(serviceId) {
    fetch(`${apiUrl}/${serviceId}`)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            showCustomPopup(`
                <strong>Company:</strong> ${data.companyName}<br>
                <strong>Services:</strong> ${data.description}<br>
                <strong>Rating:</strong> ${data.rating}<br>
                <strong>Contact:</strong> ${data.contact}<br>
                <strong>Email:</strong> ${data.email}<br>
                <strong>Website:</strong> ${data.website}
            `);
        })
        .catch(error => console.error('Error fetching service details:', error));
}

function contactServiceProvider(contact, email) {
    showCustomPopup(`<strong>Contact:</strong> ${contact}<br><strong>Email:</strong> ${email}`);
}

function bookService(companyName) {
    document.getElementById('booking-title').textContent = `Book ${companyName}`;
    document.getElementById('booking-popup').style.display = 'block';
}

function closeBookingForm() {
    document.getElementById('booking-popup').style.display = 'none';
}

function submitBooking(event) {
    event.preventDefault();
    document.getElementById('name').value = '';
    document.getElementById('contact').value = '';
    document.getElementById('date').value = '';
    closeBookingForm();
    displayNotification('Booking successful! We will contact you soon.');
}

function displayNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.classList.add('notification');
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function filterTable() {
    const filterValue = document.getElementById('general-filter').value.toLowerCase();
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const filteredData = data.filter(service => {
                return service.companyName.toLowerCase().includes(filterValue) ||
                       service.description.toLowerCase().includes(filterValue) ||
                       service.location.toLowerCase().includes(filterValue);
            });
            populateTable(filteredData);
        })
        .catch(error => console.error("Error filtering data:", error));
}

function showCustomPopup(message) {
    const popupContainer = document.getElementById('custom-popup-container');
    popupContainer.innerHTML = `<div class='custom-popup'><p>${message}</p><button onclick="closeCustomPopup()">Close</button></div>`;
    popupContainer.style.display = 'flex';
}

function closeCustomPopup() {
    document.getElementById('custom-popup-container').style.display = 'none';
}
