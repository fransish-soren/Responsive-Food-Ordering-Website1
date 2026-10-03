// ===== Food Menu Data =====
const menuData = [
    { id: 1, name: "Margherita Pizza", category: "pizza", price: 12.99, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400", desc: "Fresh tomato sauce, mozzarella & basil" },
    { id: 2, name: "Pepperoni Pizza", category: "pizza", price: 14.99, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400", desc: "Classic pepperoni with cheese topping" },
    { id: 3, name: "Classic Burger", category: "burger", price: 9.99, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400", desc: "Beef patty, lettuce, tomato & special sauce" },
    { id: 4, name: "Cheese Burger", category: "burger", price: 10.99, image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400", desc: "Double cheese with caramelized onions" },
    { id: 5, name: "Creamy Pasta", category: "pasta", price: 11.99, image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400", desc: "Cream sauce, mushroom & parmesan" },
    { id: 6, name: "Spicy Arrabbiata", category: "pasta", price: 10.49, image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400", desc: "Tomato & chili sauce, fresh herbs" },
    { id: 7, name: "Chocolate Cake", category: "dessert", price: 7.99, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400", desc: "Rich dark chocolate & ganache" },
    { id: 8, name: "Vanilla Ice Cream", category: "dessert", price: 5.99, image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400", desc: "Creamy vanilla with fresh fruits" }
];

// ===== Cart State =====
let cart = [];
let totalPrice = 0;

// ===== DOM Elements =====
const menuContainer = document.getElementById("menuContainer");
const tabBtns = document.querySelectorAll(".tab-btn");
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const cartBtn = document.getElementById("cartBtn");
const cartSidebar = document.getElementById("cartSidebar");
const closeCart = document.getElementById("closeCart");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const navbar = document.getElementById("navbar");

// ===== Render Menu Function =====
function renderMenu(category = "all") {
    menuContainer.innerHTML = "";
    const filtered = category === "all" ? menuData : menuData.filter(item => item.category === category);
    
    filtered.forEach(item => {
        const card = document.createElement("div");
        card.className = "menu-card";
        card.innerHTML = `
            <div class="menu-card-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="menu-card-content">
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
                <div class="menu-card-bottom">
                    <span class="price">$${item.price.toFixed(2)}</span>
                    <button class="add-to-cart" data-id="${item.id}">Add to Cart</button>
                </div>
            </div>
        `;
        menuContainer.appendChild(card);
    });

    // Attach add-to-cart listeners
    document.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = parseInt(e.target.dataset.id);
            addToCart(id);
        });
    });
}

// ===== Tab Filter =====
tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        tabBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderMenu(btn.dataset.category);
    });
});

// ===== Mobile Menu Toggle =====
menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
});

// ===== Cart Functions =====
function addToCart(id) {
    const item = menuData.find(i => i.id === id);
    if (!item) return;

    const existing = cart.find(c => c.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    updateCart();
    openCart();
}

function removeFromCart(id) {
    cart = cart.filter(c => c.id !== id);
    updateCart();
}

function changeQty(id, delta) {
    const item = cart.find(c => c.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) removeFromCart(id);
        else updateCart();
    }
}

function updateCart() {
    // Count
    const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
    cartCount.textContent = totalQty;

    // Total price
    totalPrice = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;

    // Render items
    if (cart.length === 0) {
        cartItems.innerHTML = `<p class="empty-cart">Your cart is empty</p>`;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" class="cart-item-img" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${(item.price * item.qty).toFixed(2)}</p>
                    <div class="cart-item-qty">
                        <button onclick="changeQty(${item.id}, -1)">−</button>
                        <span>${item.qty}</span>
                        <button onclick="changeQty(${item.id}, 1)">+</button>
                    </div>
                </div>
            </div>
        `).join("");
    }
}

function openCart() {
    cartSidebar.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeCartSidebar() {
    cartSidebar.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
}

cartBtn.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartSidebar);
overlay.addEventListener("click", closeCartSidebar);

// ===== Navbar Scroll Effect =====
window.addEventListener("scroll", () => {
    if (window.scrollY > 80) {
        navbar.style.background = "rgba(255,255,255,0.98)";
        navbar.style.boxShadow = "0 4px 30px rgba(0,0,0,0.12)";
    } else {
        navbar.style.background = "rgba(255,255,255,0.95)";
        navbar.style.boxShadow = "0 2px 20px rgba(0,0,0,0.08)";
    }
});

// ===== Smooth close mobile menu on link click =====
document.querySelectorAll(".mobile-menu a").forEach(link => {
    link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
    });
});

// ===== Initialize =====
renderMenu();