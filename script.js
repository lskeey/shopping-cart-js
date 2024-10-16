import products from "./products.js";

const cartContainer = document.getElementById("cart-container");
const cartIsEmpty = document.getElementById("empty-cart");
const productsContainer = document.getElementById("products-container");
const cartSummary = document.getElementById("cart-summary");
const actionBtnContainer = document.getElementById("action-btn-container");
const productsCards = document.getElementById("products-card-container");
const cartBtn = document.getElementById("cart-btn");
const cartCount = document.getElementById("cart-count");
const clearCartBtn = document.getElementById("clear-cart-btn");
const totalNumberOfItems = document.getElementById("total-items");
const cartSubTotal = document.getElementById("subtotal");
const cartTaxes = document.getElementById("taxes");
const cartTotal = document.getElementById("total");
let isCartShowing = false;

products.forEach(({ id, name, image, priceCents }) => {
  const priceDollars = (priceCents / 100).toFixed(2);
  productsCards.innerHTML += `
      <div class="product-card">
        <div class="product-image-container">
          <img src="${image}" alt="${name} image" class="product-image" />
        </div>
        <div class="product-info">
          <h2 class="product-name">${name}</h2>
          <p class="product-price">$${priceDollars}</p> 
        </div>
        <button 
          id="${id}" 
          class="btn add-to-cart-btn">Add to cart
        </button>
      </div>
    `;
});

class ShoppingCart {
  constructor() {
    this.items = [];
    this.total = 0;
    this.taxRate = 8.25;
  }

  addItem(id, products) {
    const product = products.find((item) => item.id === id);
    const { name, priceCents } = product;

    const priceDollars = (priceCents / 100).toFixed(2);

    this.items.push(product);

    const totalCountPerProduct = {};
    this.items.forEach((product) => {
      totalCountPerProduct[product.id] =
        (totalCountPerProduct[product.id] || 0) + 1;
    });

    const currentProductCount = totalCountPerProduct[product.id];
    const currentProductCountSpan = document.getElementById(
      `product-count-for-id${id}`
    );

    cartCount.innerText = currentProductCount;

    currentProductCount > 1
      ? (currentProductCountSpan.textContent = `${currentProductCount}x`)
      : (productsContainer.innerHTML += `
      <div id="product${id}" class="product">
        <p>
          <span class="product-count" id="product-count-for-id${id}">1x</span>${name}
        </p>
        <p>$${priceDollars}</p>
      </div>
      `);

    cartIsEmpty.style.display = "none";
    cartSummary.style.display = "flex";
    actionBtnContainer.style.display = "flex";
  }

  getCounts() {
    return this.items.length;
  }

  clearCart() {
    if (!this.items.length) {
      alert("Your shopping cart is already empty");
      return;
    }

    const isCartCleared = confirm(
      "Are you sure you want to clear all items from your shopping cart?"
    );

    if (isCartCleared) {
      cartCount.innerText = 0;
      cartIsEmpty.style.display = "flex";
      cartSummary.style.display = "none";
      actionBtnContainer.style.display = "none";

      this.items = [];
      this.total = 0;
      productsContainer.innerHTML = "";
      totalNumberOfItems.textContent = 0;
      cartSubTotal.textContent = 0;
      cartTaxes.textContent = 0;
      cartTotal.textContent = 0;
    }
  }

  calculateTaxes(amount) {
    return parseFloat(((this.taxRate / 100) * amount).toFixed(2));
  }

  calculateTotal() {
    const subTotal = this.items.reduce(
      (total, item) => total + item.priceCents / 100,
      0
    );
    const tax = this.calculateTaxes(subTotal);
    this.total = subTotal + tax;
    cartSubTotal.textContent = `$${subTotal.toFixed(2)}`;
    cartTaxes.textContent = `$${tax.toFixed(2)}`;
    cartTotal.textContent = `$${this.total.toFixed(2)}`;
    return this.total;
  }
}

const cart = new ShoppingCart();
const addToCartBtns = document.getElementsByClassName("add-to-cart-btn");

[...addToCartBtns].forEach((btn) => {
  btn.addEventListener("click", (event) => {
    cart.addItem(event.target.id, products);
    totalNumberOfItems.textContent = cart.getCounts();
    cart.calculateTotal();
  });
});

cartBtn.addEventListener("click", () => {
  isCartShowing = !isCartShowing;
  cartContainer.style.display = isCartShowing ? "block" : "none";
});

clearCartBtn.addEventListener("click", cart.clearCart.bind(cart));
