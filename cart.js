let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartContainer = document.getElementById("cart-container");
const totalPriceEl = document.getElementById("total-price");

function renderCart() {
  cartContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.image}" width="100" />
      <p>${item.name}</p>
      <p>₹${item.price}</p>
      <button onclick="removeFromCart(${index})">Remove</button>
      <hr>
    `;
    cartContainer.appendChild(div);
    total += item.price;
  });

  totalPriceEl.textContent = total;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

renderCart();
