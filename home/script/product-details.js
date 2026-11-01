// campusXchange - Dynamic Product Details Page Controller
// Plain Vanilla JavaScript - Separation of Concerns

function getListings() {
  try {
    return JSON.parse(localStorage.getItem("ag_listings")) || [];
  } catch (e) {
    return [];
  }
}

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
}

function updateCartBadge() {
  const cart = getCart();
  const totalCount = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  document.querySelectorAll(".cart-count-badge, #cartCountBadge, .cart-badge").forEach(badge => {
    badge.textContent = totalCount;
  });
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

function addToCart(listingId) {
  const listings = getListings();
  const item = listings.find(l => l.id === listingId);
  if (!item) return;

  const cart = getCart();
  const existing = cart.find(c => c.id === listingId);
  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    cart.push({
      id: item.id,
      title: item.title,
      price: item.price,
      category: item.category,
      condition: item.condition,
      photo: (item.photos && item.photos[0]) ? item.photos[0] : "📦",
      sellerName: item.sellerName,
      location: item.location || "North Campus Union",
      qty: 1
    });
  }
  saveCart(cart);
  showToast(`Added "${item.title}" to Cart!`, "success");
}

function initProductDetails() {
  updateCartBadge();

  const params = new URLSearchParams(window.location.search);
  const listingId = params.get("id");

  const notFoundSection = document.getElementById("productNotFound");
  const detailSection = document.getElementById("productDetailContent");

  if (!listingId) {
    if (detailSection) detailSection.classList.add("hidden");
    if (notFoundSection) notFoundSection.classList.remove("hidden");
    return;
  }

  const listings = getListings();
  const item = listings.find(l => l.id === listingId);

  if (!item) {
    if (detailSection) detailSection.classList.add("hidden");
    if (notFoundSection) notFoundSection.classList.remove("hidden");
    return;
  }

  if (notFoundSection) notFoundSection.classList.add("hidden");
  if (detailSection) detailSection.classList.remove("hidden");

  // Populate Breadcrumb & Title
  const crumbEl = document.getElementById("crumbItemTitle");
  if (crumbEl) crumbEl.textContent = item.title;

  document.title = `campusXchange | ${item.title}`;

  const titleEl = document.getElementById("detailTitle");
  if (titleEl) titleEl.textContent = item.title;

  const priceEl = document.getElementById("detailPrice");
  if (priceEl) priceEl.textContent = `$${item.price.toLocaleString()}`;

  const descEl = document.getElementById("detailDesc");
  if (descEl) descEl.textContent = item.description;

  const categoryEl = document.getElementById("detailCategory");
  if (categoryEl) categoryEl.textContent = item.category;

  const conditionEl = document.getElementById("detailCondition");
  if (conditionEl) {
    conditionEl.textContent = item.condition;
    let condClass = "condition-tested";
    if (item.condition.includes("Factory")) condClass = "condition-factory";
    else if (item.condition.includes("Refurbished")) condClass = "condition-refurbished";
    else if (item.condition.includes("Surplus")) condClass = "condition-surplus";
    conditionEl.className = `condition-badge ${condClass}`;
  }

  // Seller info
  const sellerNameEl = document.getElementById("detailSellerName");
  if (sellerNameEl) sellerNameEl.textContent = item.sellerName;

  const sellerRatingEl = document.getElementById("detailSellerRating");
  if (sellerRatingEl) sellerRatingEl.textContent = `★ ${item.sellerRating || 5.0} Campus Rating`;

  const pickupLocationEl = document.getElementById("detailPickupLocation");
  if (pickupLocationEl) pickupLocationEl.textContent = item.location || "North Quad / Student Union";

  // Gallery
  const mainPhotoEl = document.getElementById("detailMainPhotoIcon");
  const thumbsContainer = document.getElementById("detailThumbnails");
  const photoBadgeEl = document.getElementById("detailPhotoBadge");

  const photos = (item.photos && item.photos.length > 0) ? item.photos : ["📦"];
  if (mainPhotoEl) mainPhotoEl.textContent = photos[0];
  if (photoBadgeEl) photoBadgeEl.textContent = `📷 1 of ${photos.length} Photos`;

  if (thumbsContainer) {
    thumbsContainer.innerHTML = "";
    photos.forEach((photo, idx) => {
      const btn = document.createElement("button");
      btn.className = `thumb-btn ${idx === 0 ? 'active' : ''}`;
      btn.textContent = photo;
      btn.title = `View photo ${idx + 1}`;
      btn.addEventListener("click", () => {
        if (mainPhotoEl) mainPhotoEl.textContent = photo;
        if (photoBadgeEl) photoBadgeEl.textContent = `📷 ${idx + 1} of ${photos.length} Photos`;
        thumbsContainer.querySelectorAll(".thumb-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      });
      thumbsContainer.appendChild(btn);
    });
  }

  // Specs Table
  const specIdEl = document.getElementById("specItemId");
  if (specIdEl) specIdEl.textContent = item.id;

  const specCatEl = document.getElementById("specCategory");
  if (specCatEl) specCatEl.textContent = item.category;

  const specCondEl = document.getElementById("specCondition");
  if (specCondEl) specCondEl.textContent = item.condition;

  const specLocEl = document.getElementById("specLocation");
  if (specLocEl) specLocEl.textContent = item.location || "On-Campus Peer Meetup";

  const specStatusEl = document.getElementById("specStatus");
  if (specStatusEl) specStatusEl.textContent = item.status === "active" ? "Available for Purchase" : "Reserved / Sold";

  // Actions
  const addToCartBtn = document.getElementById("detailAddToCartBtn");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      addToCart(item.id);
    });
  }

  const buyNowBtn = document.getElementById("detailBuyNowBtn");
  if (buyNowBtn) {
    buyNowBtn.addEventListener("click", (e) => {
      e.preventDefault();
      addToCart(item.id);
      window.location.href = "cart.html";
    });
  }

  const msgSellerBtn = document.getElementById("detailMessageBtn");
  if (msgSellerBtn) {
    msgSellerBtn.href = `buyers/view/messages.html?listingId=${item.id}`;
  }
}

document.addEventListener("DOMContentLoaded", initProductDetails);
