// campusXchange - Cart & Checkout System Controller
// Plain Vanilla JavaScript - Separation of Concerns

function getCart() {
  try {
    return JSON.parse(localStorage.getItem("ag_cart")) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("ag_cart", JSON.stringify(cart));
  updateCartBadge();
  renderCart();
}

function updateCartBadge() {
  const cart = getCart();
  const totalCount = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  document.querySelectorAll(".cart-count-badge, #cartCountBadge, .cart-badge").forEach(badge => {
    badge.textContent = totalCount;
  });
}

function getListings() {
  try {
    return JSON.parse(localStorage.getItem("ag_listings")) || [];
  } catch (e) {
    return [];
  }
}

function saveListings(listings) {
  localStorage.setItem("ag_listings", JSON.stringify(listings));
}

function getPurchases() {
  try {
    return JSON.parse(localStorage.getItem("ag_purchases")) || [];
  } catch (e) {
    return [];
  }
}

function savePurchases(purchases) {
  localStorage.setItem("ag_purchases", JSON.stringify(purchases));
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("ag_currentUser")) || {
      id: "USR-101",
      name: "Emma Watson",
      email: "emma.watson@campus.edu",
      role: "buyer"
    };
  } catch (e) {
    return {
      id: "USR-101",
      name: "Emma Watson",
      email: "emma.watson@campus.edu",
      role: "buyer"
    };
  }
}

function showToast(msg, type = "info") {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3500);
}

function updateItemQuantity(listingId, delta) {
  const cart = getCart();
  const item = cart.find(c => c.id === listingId);
  if (!item) return;

  item.qty = (item.qty || 1) + delta;
  if (item.qty <= 0) {
    removeItemFromCart(listingId);
    return;
  }

  saveCart(cart);
}

function removeItemFromCart(listingId) {
  let cart = getCart();
  cart = cart.filter(c => c.id !== listingId);
  saveCart(cart);
  showToast("Item removed from cart.", "info");
}

function clearCart() {
  localStorage.removeItem("ag_cart");
  updateCartBadge();
  renderCart();
  showToast("Cart cleared.", "info");
}

function renderCart() {
  const cart = getCart();
  const emptySection = document.getElementById("cartEmptySection");
  const contentSection = document.getElementById("cartContentSection");
  const receiptSection = document.getElementById("orderReceiptSection");

  if (receiptSection && !receiptSection.classList.contains("hidden")) {
    // If showing receipt after checkout, leave it
    return;
  }

  if (cart.length === 0) {
    if (contentSection) contentSection.classList.add("hidden");
    if (emptySection) emptySection.classList.remove("hidden");
    updateCartBadge();
    return;
  }

  if (emptySection) emptySection.classList.add("hidden");
  if (contentSection) contentSection.classList.remove("hidden");

  const tbody = document.getElementById("cartTableBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  let subtotal = 0;

  cart.forEach(item => {
    const qty = item.qty || 1;
    const lineTotal = item.price * qty;
    subtotal += lineTotal;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div class="cart-item-info">
          <div class="cart-item-icon">${item.photo || '📦'}</div>
          <div>
            <strong>${item.title}</strong>
            <div class="metric-sub">${item.category} • Pickup: ${item.location || 'Campus Center'}</div>
          </div>
        </div>
      </td>
      <td><strong>$${item.price.toLocaleString()}</strong></td>
      <td>
        <div class="qty-control">
          <button class="qty-btn btn-qty-minus" data-id="${item.id}">-</button>
          <span class="qty-val">${qty}</span>
          <button class="qty-btn btn-qty-plus" data-id="${item.id}">+</button>
        </div>
      </td>
      <td><strong>$${lineTotal.toLocaleString()}</strong></td>
      <td>
        <button class="btn-remove-item" data-id="${item.id}">✕ Remove</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Attach button listeners
  tbody.querySelectorAll(".btn-qty-minus").forEach(btn => {
    btn.addEventListener("click", () => updateItemQuantity(btn.dataset.id, -1));
  });

  tbody.querySelectorAll(".btn-qty-plus").forEach(btn => {
    btn.addEventListener("click", () => updateItemQuantity(btn.dataset.id, 1));
  });

  tbody.querySelectorAll(".btn-remove-item").forEach(btn => {
    btn.addEventListener("click", () => removeItemFromCart(btn.dataset.id));
  });

  // Calculate fees
  const reserveFee = Math.round(subtotal * 0.035);
  const total = subtotal + reserveFee;

  const subtotalEl = document.getElementById("cartSubtotalVal");
  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toLocaleString()}`;

  const feeEl = document.getElementById("cartReserveFeeVal");
  if (feeEl) feeEl.textContent = `$${reserveFee.toLocaleString()}`;

  const totalEl = document.getElementById("cartTotalVal");
  if (totalEl) totalEl.textContent = `$${total.toLocaleString()}`;

  updateCartBadge();
}

function handleCheckoutSubmit(e) {
  e.preventDefault();

  const cart = getCart();
  if (cart.length === 0) {
    showToast("Your cart is empty!", "info");
    return;
  }

  const nameInput = document.getElementById("checkoutName");
  const studentIdInput = document.getElementById("checkoutStudentId");
  const emailInput = document.getElementById("checkoutEmail");
  const locationSelect = document.getElementById("checkoutLocation");
  const payMethodSelect = document.getElementById("checkoutPaymentMethod");
  const notesInput = document.getElementById("checkoutNotes");

  const buyerName = nameInput ? nameInput.value.trim() : "Emma Watson";
  const studentId = studentIdInput ? studentIdInput.value.trim() : "STU-88214";
  const buyerEmail = emailInput ? emailInput.value.trim() : "emma.watson@campus.edu";
  const pickupLoc = locationSelect ? locationSelect.value : "Student Union Lobby";
  const payMethod = payMethodSelect ? payMethodSelect.value : "Cash on In-Person Handover";
  const notes = notesInput ? notesInput.value.trim() : "";

  const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
  const orderDate = new Date().toISOString().split("T")[0];

  // 1. Record purchases in ag_purchases
  const purchases = getPurchases();
  const listings = getListings();

  let orderTotal = 0;

  cart.forEach(item => {
    const qty = item.qty || 1;
    const lineTotal = item.price * qty;
    orderTotal += lineTotal;

    // Mark listing as sold in inventory
    const originalListing = listings.find(l => l.id === item.id);
    if (originalListing) {
      originalListing.status = "sold";
    }

    purchases.unshift({
      id: orderId,
      buyerId: getCurrentUser().id || "USR-101",
      listingId: item.id,
      title: item.title,
      price: item.price,
      quantity: qty,
      sellerName: item.sellerName || "Campus Seller",
      pickupLocation: pickupLoc,
      paymentMethod: payMethod,
      studentId: studentId,
      date: orderDate,
      serialNo: `SN-CX-${Math.floor(10000 + Math.random() * 90000)}`,
      status: "Reserved for Campus Pickup"
    });
  });

  saveListings(listings);
  savePurchases(purchases);

  // Clear cart
  localStorage.removeItem("ag_cart");
  updateCartBadge();

  // Show Order Receipt
  const contentSection = document.getElementById("cartContentSection");
  const receiptSection = document.getElementById("orderReceiptSection");

  if (contentSection) contentSection.classList.add("hidden");
  if (receiptSection) {
    receiptSection.classList.remove("hidden");

    const orderIdEl = document.getElementById("receiptOrderId");
    if (orderIdEl) orderIdEl.textContent = orderId;

    const orderAmountEl = document.getElementById("receiptOrderAmount");
    if (orderAmountEl) orderAmountEl.textContent = `$${orderTotal.toLocaleString()}`;

    const orderLocationEl = document.getElementById("receiptOrderLocation");
    if (orderLocationEl) orderLocationEl.textContent = pickupLoc;

    const orderPayEl = document.getElementById("receiptPaymentMethod");
    if (orderPayEl) orderPayEl.textContent = payMethod;
  }

  showToast(`Order #${orderId} confirmed successfully!`, "success");
}

document.addEventListener("DOMContentLoaded", () => {
  renderCart();

  // Auto-fill buyer profile
  const user = getCurrentUser();
  const nameInput = document.getElementById("checkoutName");
  if (nameInput && user.name) nameInput.value = user.name;

  const emailInput = document.getElementById("checkoutEmail");
  if (emailInput && user.email) emailInput.value = user.email;

  const checkoutForm = document.getElementById("checkoutForm");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", handleCheckoutSubmit);
  }

  const clearBtn = document.getElementById("clearCartBtn");
  if (clearBtn) {
    clearBtn.addEventListener("click", clearCart);
  }
});
