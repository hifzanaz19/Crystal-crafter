// Login Modal Controls
function closeLoginModal() {
  document.getElementById("loginModal").style.display = "none";
}

function handleLogin(username, password) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.username === username && user.password === password) {
    localStorage.setItem("isLoggedIn", "true");
    alert("Login successful!");
    closeLoginModal();
    updateAuthUI();
  } else {
    alert("Invalid credentials!");
  }
}

// Auth: Login, Signup, Logout
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.username === username && user.password === password) {
    localStorage.setItem("isLoggedIn", "true");
    alert("Login successful!");
    window.location.href = "index.html";
  } else {
    alert("Wrong credentials!");
  }
}

function signup() {
  const username = document.getElementById("newUsername").value;
  const password = document.getElementById("newPassword").value;

  if (!username || !password) {
    alert("Please fill in all fields.");
    return;
  }

  localStorage.setItem("user", JSON.stringify({ username, password }));
  alert("Account created! You can now log in.");
  window.location.href = "login.html";
}

function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("user");
  alert("Logged out.");
  updateAuthUI();
}

// Update UI Based on Auth
function updateAuthUI() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const loginLink = document.getElementById("loginLink");
  const logoutLink = document.getElementById("logoutLink");

  if (loginLink && logoutLink) {
    loginLink.style.display = isLoggedIn ? "none" : "inline";
    logoutLink.style.display = isLoggedIn ? "inline" : "none";
  }
}

// Add to Cart
function addToCart(productName, price, image) {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (isLoggedIn !== "true") {
    alert("Please log in to add items to the cart.");
    window.location.href = "login.html";
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({ name: productName, price: price, image: image });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${productName} added to cart!`);
}

// Submit Order
function submitOrder() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const user = JSON.parse(localStorage.getItem("user"));
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (isLoggedIn !== "true") {
    alert("Please log in to place order.");
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  fetch("http://localhost:5000/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: user.username,
      items: cart,
      date: new Date().toISOString()
    })
  })
    .then(res => res.json())
    .then(data => {
      alert("Order submitted successfully!");
      localStorage.removeItem("cart");
      window.location.href = "index.html";
    })
    .catch(err => {
      console.error("Order submission failed", err);
      alert("Failed to submit order. Try again.");
    });
}

// Render Products
const products = [
  { name: "Glass Bangle Set", price: 499, image: "images/bangle.jpg", category: "bangles" },
  { name: "Crystal Showpiece", price: 1099, image: "images/decorative.jpg", category: "decorative" },
  { name: "Glass Vase", price: 899, image: "images/vase.jpg", category: "vases" },
  { name: "Decorative Lamp", price: 1299, image: "images/lamp.jpg", category: "lamps" }
];

function renderProducts(filter) {
  const container = document.getElementById("product-container");
  if (!container) return;

  container.innerHTML = "";
  const filtered = products.filter(p => p.category === filter);
  filtered.forEach(product => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>₹${product.price}</p>
      <button onclick="addToCart('${product.name}', ${product.price}, '${product.image}')">Add to Cart</button>
    `;
    container.appendChild(div);
  });
}

// Render Cart Page
function renderCart() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const cartContainer = document.getElementById("cart-items");
  const totalPriceElement = document.getElementById("total-price");

  if (!cartContainer || !totalPriceElement) return;

  cartContainer.innerHTML = "";
  let total = 0;

  cartItems.forEach((item, index) => {
    total += item.price;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div>
        <h3>${item.name}</h3>
        <p>₹${item.price}</p>
        <button onclick="removeFromCart(${index})">Remove</button>
      </div>
    `;
    cartContainer.appendChild(div);
  });

  totalPriceElement.textContent = `Total: ₹${total}`;
}

function removeFromCart(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// On Page Load
window.onload = function () {
  updateAuthUI();
  if (window.location.pathname.includes("cart.html")) {
    renderCart();
  }
};