/**
 * CAMPUSXCHANGE - PORTAL & HOME MARKETPLACE LOGIC
 * Strict Vanilla JavaScript with Zero External Libraries
 */

// Global Seed Listings Database for campusXchange
const DEFAULT_LISTINGS = [
  {
    id: "LIST-101",
    title: "MacBook Pro 14\" M2 (16GB RAM / 512GB SSD)",
    category: "Laptops & Computers",
    condition: "Field Tested",
    price: 1150,
    description: "Excellent condition, battery health 96%. Includes original MagSafe charger and protective sleeve.",
    photos: ["💻", "🔌", "🎒"],
    sellerId: "USR-102",
    sellerName: "Alex Rivera",
    sellerRating: 4.9,
    status: "active",
    createdAt: 1718000000000
  },
  {
    id: "LIST-102",
    title: "Texas Instruments TI-Nspire CX II CAS Calculator",
    category: "Calculators & Math",
    condition: "Factory Sealed / Calibrated",
    price: 135,
    description: "Color graphing calculator required for advanced calculus and engineering courses. Complete with charging cable.",
    photos: ["📱", "🔋", "📐"],
    sellerId: "USR-102",
    sellerName: "Alex Rivera",
    sellerRating: 4.9,
    status: "active",
    createdAt: 1718100000000
  },
  {
    id: "LIST-103",
    title: "iPad Air 5th Gen (64GB WiFi + Apple Pencil 2)",
    category: "Tablets & E-Readers",
    condition: "Refurbished Core",
    price: 490,
    description: "Perfect for lecture notes and digital textbooks. Screen protector installed, zero scratches.",
    photos: ["📱", "✏️", "🔌"],
    sellerId: "USR-102",
    sellerName: "Alex Rivera",
    sellerRating: 4.9,
    status: "active",
    createdAt: 1718200000000
  },
  {
    id: "LIST-104",
    title: "Sony WH-1000XM5 Noise-Cancelling Headphones",
    category: "Audio & Accessories",
    condition: "Field Tested",
    price: 240,
    description: "Industry-leading noise cancellation, ideal for quiet campus library study sessions. Original case included.",
    photos: ["🎧", "📦", "🔌"],
    sellerId: "USR-106",
    sellerName: "Sarah Chen",
    sellerRating: 4.8,
    status: "active",
    createdAt: 1718300000000
  },
  {
    id: "LIST-105",
    title: "Segway Ninebot Max Campus Electric Scooter",
    category: "Campus Transit",
    condition: "Field Tested",
    price: 395,
    description: "25-mile range per charge, pneumatic tires for campus paths. Includes heavy-duty U-lock.",
    photos: ["🛴", "🔒", "⚡"],
    sellerId: "USR-102",
    sellerName: "Alex Rivera",
    sellerRating: 4.9,
    status: "sold",
    createdAt: 1718400000000
  },
  {
    id: "LIST-106",
    title: "Arduino & Raspberry Pi Robotics Lab Kit",
    category: "Engineering & Lab Gear",
    condition: "Factory Sealed / Calibrated",
    price: 110,
    description: "Full starter kit with sensors, breadboards, motors, and jumper wires for EE & CS lab coursework.",
    photos: ["🤖", "⚙️", "🔋", "💡"],
    sellerId: "USR-105",
    sellerName: "Marcus Vance",
    sellerRating: 4.6,
    status: "active",
    createdAt: 1718500000000
  }
];

// Demo Users for Instant 1-Click Role Switching
const DEMO_USERS = {
  buyer: {
    id: "USR-101",
    name: "Emma Watson",
    email: "emma.watson@campus.edu",
    role: "buyer",
    portalUrl: "buyers/view/search.html"
  },
  seller: {
    id: "USR-102",
    name: "Alex Rivera",
    email: "alex.rivera@campus.edu",
    role: "seller",
    portalUrl: "sellers/view/manage-listings.html"
  },
  moderator: {
    id: "USR-103",
    name: "Officer Taylor",
    email: "taylor.moderator@campus.edu",
    role: "moderator",
    portalUrl: "moderators/view/reported-listings.html"
  },
  admin: {
    id: "USR-104",
    name: "Dean Johnson",
    email: "admin.dean@campus.edu",
    role: "admin",
    portalUrl: "admin/view/user-management.html"
  }
};

function initStorage() {
  const currentListings = localStorage.getItem("ag_listings");
  // If listings not present or containing old sci-fi items, seed with campus tech
  if (!currentListings || currentListings.includes("Vortex-7")) {
    localStorage.setItem("ag_listings", JSON.stringify(DEFAULT_LISTINGS));
  }

  const currentPurchases = localStorage.getItem("ag_purchases");
  if (!currentPurchases || currentPurchases.includes("Chamber")) {
    localStorage.setItem("ag_purchases", JSON.stringify([
      {
        id: "ORD-901",
        buyerId: "USR-101",
        listingId: "LIST-105",
        title: "Segway Ninebot Max Campus Electric Scooter",
        price: 395,
        sellerName: "Alex Rivera",
        date: "2026-10-10",
        serialNo: "SN-CX-77312",
        status: "Picked Up & Verified on Campus"
      }
    ]));
  }

  const currentUser = localStorage.getItem("ag_currentUser");
  if (!currentUser || currentUser.includes("Lyra Vance")) {
    localStorage.setItem("ag_currentUser", JSON.stringify(DEMO_USERS.buyer));
  }
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("ag_currentUser"));
  } catch (e) {
    return null;
  }
}

function setCurrentUser(user) {
  if (user) {
    localStorage.setItem("ag_currentUser", JSON.stringify(user));
  } else {
    localStorage.removeItem("ag_currentUser");
  }
  updateAuthUI();
}

function getListings() {
  try {
    return JSON.parse(localStorage.getItem("ag_listings")) || DEFAULT_LISTINGS;
  } catch (e) {
    return DEFAULT_LISTINGS;
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

function showToast(message, type = "success") {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span>✓</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3500);
}

// Global Auth Header Controller
function updateAuthUI() {
  const user = getCurrentUser();
  const userNameEl = document.getElementById("currentUserName");
  const userRoleEl = document.getElementById("currentUserRole");
  const portalBtn = document.getElementById("portalJumpBtn");
  const signInOutBtn = document.getElementById("authActionBtn");

  if (user) {
    if (userNameEl) userNameEl.textContent = user.name;
    if (userRoleEl) {
      userRoleEl.textContent = user.role.toUpperCase();
      userRoleEl.className = `role-badge role-${user.role.toLowerCase()}`;
    }
    if (portalBtn) {
      portalBtn.classList.remove("hidden");
      let url = "buyers/view/search.html";
      if (user.role === "seller") url = "sellers/view/manage-listings.html";
      else if (user.role === "moderator") url = "moderators/view/reported-listings.html";
      else if (user.role === "admin") url = "admin/view/user-management.html";
      portalBtn.setAttribute("href", url);
      portalBtn.textContent = `Open ${user.role} Portal →`;
    }
    if (signInOutBtn) {
      signInOutBtn.textContent = "Sign Out";
      signInOutBtn.onclick = (e) => {
        e.preventDefault();
        setCurrentUser(null);
        showToast("Signed out of campus session.", "info");
      };
    }
  } else {
    if (userNameEl) userNameEl.textContent = "Guest Student";
    if (userRoleEl) {
      userRoleEl.textContent = "GUEST";
      userRoleEl.className = "role-badge";
    }
    if (portalBtn) portalBtn.classList.add("hidden");
    if (signInOutBtn) {
      signInOutBtn.textContent = "Universal Login";
      signInOutBtn.onclick = () => {
        window.location.href = "login.html";
      };
    }
  }
}

// Controller: Home Page Listing Marketplace
let activePurchaseListingId = null;

function initHomeMarketplace() {
  const grid = document.getElementById("homeListingsGrid");
  const searchInput = document.getElementById("homeSearchInput");
  const categoryFilter = document.getElementById("homeCategoryFilter");
  const conditionFilter = document.getElementById("homeConditionFilter");
  const minPriceInput = document.getElementById("homeMinPrice");
  const maxPriceInput = document.getElementById("homeMaxPrice");
  const sortSelect = document.getElementById("homeSortSelect");
  const resetBtn = document.getElementById("homeResetBtn");
  const resultsCountEl = document.getElementById("homeResultsCount");

  if (!grid) return;

  function render() {
    const listings = getListings();
    const activeListings = listings.filter(l => l.status === "active");

    const query = (searchInput ? searchInput.value.toLowerCase().trim() : "");
    const catVal = (categoryFilter ? categoryFilter.value : "all");
    const condVal = (conditionFilter ? conditionFilter.value : "all");
    const minP = minPriceInput && minPriceInput.value ? Number(minPriceInput.value) : 0;
    const maxP = maxPriceInput && maxPriceInput.value ? Number(maxPriceInput.value) : Infinity;
    const sortVal = (sortSelect ? sortSelect.value : "newest");

    let filtered = activeListings.filter(item => {
      const matchKeyword = item.title.toLowerCase().includes(query) ||
                           item.description.toLowerCase().includes(query);
      const matchCat = catVal === "all" || item.category === catVal;
      const matchCond = condVal === "all" || item.condition === condVal;
      const matchPrice = item.price >= minP && item.price <= maxP;
      return matchKeyword && matchCat && matchCond && matchPrice;
    });

    if (sortVal === "newest") {
      filtered.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sortVal === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortVal === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    }

    if (resultsCountEl) resultsCountEl.textContent = filtered.length;

    grid.innerHTML = "";

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state-card">
          <div class="photo-icon">📦</div>
          <h3 class="listing-title">No Active Campus Listings Found</h3>
          <p class="listing-desc">Try clearing keyword filters or adjusting price range.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement("article");
      card.className = "listing-card";

      let condClass = "condition-tested";
      if (item.condition.includes("Factory")) condClass = "condition-factory";
      else if (item.condition.includes("Refurbished")) condClass = "condition-refurbished";
      else if (item.condition.includes("Surplus")) condClass = "condition-surplus";

      const photoCount = item.photos ? item.photos.length : 1;
      const primaryPhoto = (item.photos && item.photos[0]) ? item.photos[0] : "📦";

      card.innerHTML = `
        <div class="card-top-row">
          <span class="condition-badge ${condClass}">${item.condition}</span>
          <span class="filter-label">${item.category}</span>
        </div>
        <div class="photo-box">
          <span class="photo-icon">${primaryPhoto}</span>
          <span class="photo-count-badge">📷 ${photoCount} / 5 Photos</span>
        </div>
        <h3 class="listing-title">${item.title}</h3>
        <p class="listing-desc">${item.description}</p>
        
        <div class="seller-meta-row">
          <div>
            <span>Seller: <strong>${item.sellerName}</strong></span>
            <span class="seller-rating"> ★ ${item.sellerRating || 5.0}</span>
          </div>
          <div class="price-display"><span class="price-symbol">$</span>${item.price.toLocaleString()}</div>
        </div>

        <div class="card-actions-row">
          <button class="btn-add-cart add-cart-btn" data-id="${item.id}">+ Cart</button>
          <button class="btn-buy buy-now-btn" data-id="${item.id}">Buy Now</button>
          <a href="buyers/view/messages.html?listingId=${item.id}" class="btn-msg">Message</a>
        </div>
      `;

      // Make whole card clickable to open dynamic product details
      card.addEventListener("click", (e) => {
        if (e.target.closest("button") || e.target.closest("a")) return;
        window.location.href = `product-details.html?id=${item.id}`;
      });

      grid.appendChild(card);
    });

    // Attach Cart Action Listeners
    grid.querySelectorAll(".add-cart-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        addToCart(btn.dataset.id);
      });
    });

    // Attach Buy Action Listeners
    grid.querySelectorAll(".buy-now-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        handlePurchaseInitiation(btn.dataset.id);
      });
    });

    grid.querySelectorAll(".btn-msg").forEach(link => {
      link.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    });
  }

  function resetFilters() {
    if (searchInput) searchInput.value = "";
    if (categoryFilter) categoryFilter.value = "all";
    if (conditionFilter) conditionFilter.value = "all";
    if (minPriceInput) minPriceInput.value = "";
    if (maxPriceInput) maxPriceInput.value = "";
    if (sortSelect) sortSelect.value = "newest";
    render();
  }

  if (searchInput) searchInput.addEventListener("input", render);
  if (categoryFilter) categoryFilter.addEventListener("change", render);
  if (conditionFilter) conditionFilter.addEventListener("change", render);
  if (minPriceInput) minPriceInput.addEventListener("input", render);
  if (maxPriceInput) maxPriceInput.addEventListener("input", render);
  if (sortSelect) sortSelect.addEventListener("change", render);
  if (resetBtn) resetBtn.addEventListener("click", resetFilters);

  render();
}

// Purchase Transaction Handler
function handlePurchaseInitiation(listingId) {
  let user = getCurrentUser();
  if (!user || user.role !== "buyer") {
    user = DEMO_USERS.buyer;
    setCurrentUser(user);
    showToast("Active session set to Buyer (Emma Watson) for purchase.", "info");
  }

  activePurchaseListingId = listingId;
  const listings = getListings();
  const item = listings.find(l => l.id === listingId);
  if (!item) return;

  const modal = document.getElementById("purchaseModal");
  const modalItemTitle = document.getElementById("purchaseModalTitle");
  const modalItemPrice = document.getElementById("purchaseModalPrice");
  const modalSellerName = document.getElementById("purchaseModalSeller");

  if (modalItemTitle) modalItemTitle.textContent = item.title;
  if (modalItemPrice) modalItemPrice.textContent = `$${item.price.toLocaleString()}`;
  if (modalSellerName) modalSellerName.textContent = item.sellerName;

  if (modal) modal.classList.add("open");
}

function initPurchaseModal() {
  const modal = document.getElementById("purchaseModal");
  const closeBtn = document.getElementById("closePurchaseModalBtn");
  const confirmBtn = document.getElementById("confirmPurchaseBtn");

  if (!modal) return;

  if (closeBtn) {
    closeBtn.addEventListener("click", () => modal.classList.remove("open"));
  }

  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      if (!activePurchaseListingId) return;

      const listings = getListings();
      const item = listings.find(l => l.id === activePurchaseListingId);
      if (!item) return;

      // 1. Mark listing as SOLD (immediately excluded from search)
      item.status = "sold";
      saveListings(listings);

      // 2. Add to ag_purchases (for Buyer's purchase history)
      const purchases = getPurchases();
      const newSerial = `SN-CX-${Math.floor(10000 + Math.random() * 90000)}`;
      purchases.unshift({
        id: `ORD-${Math.floor(100 + Math.random() * 900)}`,
        buyerId: "USR-101",
        listingId: item.id,
        title: item.title,
        price: item.price,
        sellerName: item.sellerName,
        date: new Date().toLocaleDateString(),
        serialNo: newSerial,
        status: "Confirmed - Campus Pickup Scheduled"
      });
      savePurchases(purchases);

      modal.classList.remove("open");
      showToast(`Purchase Confirmed! Serial: ${newSerial}. Saved to My Purchases.`, "success");

      initHomeMarketplace();
    });
  }
}

// Controller: Universal Role Login Form & Fast Track
function initUniversalLogin() {
  const form = document.getElementById("universalLoginForm");
  const roleSelect = document.getElementById("loginRoleSelect");
  const emailInput = document.getElementById("loginEmailInput");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const role = roleSelect ? roleSelect.value : "buyer";
      const email = emailInput ? emailInput.value.trim() : "student@campus.edu";
      const targetUser = DEMO_USERS[role] || {
        id: `USR-${Math.floor(100 + Math.random() * 900)}`,
        name: email.split('@')[0],
        email: email,
        role: role,
        portalUrl: DEMO_USERS[role] ? DEMO_USERS[role].portalUrl : "buyers/view/search.html"
      };

      setCurrentUser(targetUser);
      showToast(`Signed in as ${targetUser.name} (${role.toUpperCase()})! Opening portal...`, "success");
      setTimeout(() => {
        window.location.href = targetUser.portalUrl;
      }, 700);
    });
  }

  document.querySelectorAll(".fast-login-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const role = btn.dataset.role;
      if (DEMO_USERS[role]) {
        setCurrentUser(DEMO_USERS[role]);
        showToast(`Signed in as ${DEMO_USERS[role].name} (${role.toUpperCase()})! Opening portal...`, "success");
        setTimeout(() => {
          window.location.href = DEMO_USERS[role].portalUrl;
        }, 700);
      }
    });
  });
}

// Global Cart System Helpers
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

function updateCartBadge() {
  const cart = getCart();
  const totalCount = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  document.querySelectorAll(".cart-count-badge, #cartCountBadge, .cart-badge").forEach(badge => {
    badge.textContent = totalCount;
  });
}

function initDemoSwitchers() {
  document.querySelectorAll(".demo-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const role = btn.dataset.role;
      if (DEMO_USERS[role]) {
        setCurrentUser(DEMO_USERS[role]);
        showToast(`Switched active session to ${DEMO_USERS[role].name} (${role.toUpperCase()})`, "success");
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initStorage();
  updateAuthUI();
  updateCartBadge();
  initDemoSwitchers();
  initHomeMarketplace();
  initPurchaseModal();
  initUniversalLogin();
});
