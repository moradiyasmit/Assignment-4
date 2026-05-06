// EmailJS Details
const PUBLIC_KEY = "2n1Vv08rGpWwewE6G"; 
const SERVICE_ID = "service_smit12";  
const TEMPLATE_ID = "template_smit12"; 

const serviceData = [
    { id: 1, name: "Dry Cleaning", price: 200 },
    { id: 2, name: "Wash & Fold", price: 100 },
    { id: 3, name: "Ironing", price: 30 },
    { id: 4, name: "Stain Removal", price: 500 },
    { id: 5, name: "Leather & Suede Cleaning", price: 999 },
    { id: 6, name: "Wedding Dress Cleaning", price: 2800 }
];

// LocalStorage logic 
let cart = JSON.parse(localStorage.getItem('laundryCart')) || [];
// Initialize app (runs when page loads)
function init() {
    emailjs.init(PUBLIC_KEY); //EmailJS initialize
    renderServices();// show services
    renderCart(); // show cart data
}

function renderServices() {
    const grid = document.getElementById('services-grid');
    grid.innerHTML = serviceData.map(s => `
        <div class="service-card">
            <span>${s.name} - ₹${s.price}</span>
            <button onclick="addToCart(${s.id})">Add Item</button>
        </div>
    `).join('');
}

// Add selected service to cart
function addToCart(id) {
    const item = serviceData.find(s => s.id === id);
    cart.push(item);
    updateApp();
}

// Remove item from cart using index
function removeFromCart(index) {
    cart.splice(index, 1);
    updateApp();
}

// Save cart data and re-render UI
function updateApp() {
    localStorage.setItem('laundryCart', JSON.stringify(cart));
    renderCart();
}
// Display cart items and calculate the total
function renderCart() {
    const tbody = document.getElementById('cart-items');
    const totalEl = document.getElementById('total-val');
    
    if (cart.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center">No items added</td></tr>';
    } else {
        tbody.innerHTML = cart.map((item, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>₹${item.price}</td>
                <td><button class="rm-btn" onclick="removeFromCart(${index})">Remove Item</button></td>
            </tr>
        `).join('');
    }
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    totalEl.innerText = total;
}

// Form Submission
document.getElementById('laundry-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = document.getElementById('send-btn');
    btn.innerText = "Booking...";

const servicesList = cart.map(item => item.name).join(", ");
document.getElementById('services-input').value = servicesList;

// calculate amount
const total = cart.reduce((sum, item) => sum + item.price, 0);
document.getElementById('total-input').value = total;

// send email using emailjs
    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, this)
        .then(() => {
            document.getElementById('msg-status').innerHTML = "Email has been send successfully";
            cart = [];
            updateApp();
            this.reset();
            btn.innerText = "Book now";
        }, (err) => {
            alert("Email failed: " + JSON.stringify(err));
            btn.innerText = "Book now";
        });
});

window.onload = init;