alert("JavaScript is running!");
const SEED_LISTINGS = [
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

const SEED_THREADS = [
  {
    id: "TH-101",
    listingId: "LIST-101",
    listingTitle: "MacBook Pro 14\" M2",
    sellerId: "USR-102",
    sellerName: "Alex Rivera",
    buyerName: "Emma Watson",
    messages: [
      {
        sender: "buyer",
        text: "Hi Alex! Is the MacBook still available for campus pickup at the student union?",
        time: "10:14 AM"
      },
      {
        sender: "seller",
        text: "Yes Emma! I can meet between classes today by the library or campus center.",
        time: "10:16 AM"
      }
    ]
  }
];

const SEED_PURCHASES = [
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
];

function initDatabase() {
  const currentListings = localStorage.getItem("ag_listings");
  if (!currentListings || currentListings.includes("Vortex-7")) {
    localStorage.setItem("ag_listings", JSON.stringify(SEED_LISTINGS));
  }
  const currentMessages = localStorage.getItem("ag_messages");
  if (!currentMessages || currentMessages.includes("Lyra")) {
    localStorage.setItem("ag_messages", JSON.stringify(SEED_THREADS));
  }
  const currentPurchases = localStorage.getItem("ag_purchases");
  if (!currentPurchases || currentPurchases.includes("Chamber")) {
    localStorage.setItem("ag_purchases", JSON.stringify(SEED_PURCHASES));
  }
}

function getListings() {
  try {
    return JSON.parse(localStorage.getItem("ag_listings")) || SEED_LISTINGS;
  } catch (e) {
    return SEED_LISTINGS;
  }
}

function saveListings(listings) {
  localStorage.setItem("ag_listings", JSON.stringify(listings));
}

function getPurchases() {
  try {
    return JSON.parse(localStorage.getItem("ag_purchases")) || SEED_PURCHASES;
  } catch (e) {
    return SEED_PURCHASES;
  }
}

function savePurchases(purchases) {
  localStorage.setItem("ag_purchases", JSON.stringify(purchases));
}

function getThreads() {
  try {
    return JSON.parse(localStorage.getItem("ag_messages")) || SEED_THREADS;
  } catch (e) {
    return SEED_THREADS;
  }
}

function saveThreads(threads) {
  localStorage.setItem("ag_messages", JSON.stringify(threads));
}

function showToast(message, type = "info") {
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
  }, 3200);
}

// 1. Controller: Search & Discovery (search.html)
function initSearchView() {
  const grid = document.getElementById("listingsGrid");
  const searchInput = document.getElementById("searchKeywordInput");
  const categoryFilter = document.getElementById("categoryFilterSelect");
  const conditionFilter = document.getElementById("conditionFilterSelect");
  const minPriceInput = document.getElementById("minPriceInput");
  const maxPriceInput = document.getElementById("maxPriceInput");
  const sortSelect = document.getElementById("sortSelect");
  const resetBtn = document.getElementById("resetSearchBtn");
  const countEl = document.getElementById("resultsCountDisplay");

  if (!grid) return;

  function render() {
    const allListings = getListings();
    const activeListings = allListings.filter(item => item.status === "active");

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
    } else if (sortVal === "oldest") {
      filtered.sort((a, b) => a.createdAt - b.createdAt);
    } else if (sortVal === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortVal === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    }

    if (countEl) countEl.textContent = filtered.length;

    grid.innerHTML = "";

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state-card">
          <div class="photo-gallery-icon">📦</div>
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
        <div class="photo-gallery-box">
          <span class="photo-gallery-icon">${primaryPhoto}</span>
          <span class="photo-count-badge">📷 ${photoCount} / 5 Photos</span>
        </div>
        <h3 class="listing-title">${item.title}</h3>
        <p class="listing-desc">${item.description}</p>
        
        <div class="seller-meta-row">
          <div class="seller-info">
            <span>Seller: <strong>${item.sellerName}</strong></span>
            <span class="seller-rating">★ ${item.sellerRating || 5.0}</span>
          </div>
          <div class="listing-title">$${item.price.toLocaleString()}</div>
        </div>

        <div class="card-actions-row">
          <button class="btn-chat add-cart-btn" data-id="${item.id}">+ Cart</button>
          <button class="btn-chat buy-item-btn" data-id="${item.id}">Buy Item</button>
          <button class="btn-rate chat-btn" data-id="${item.id}">Message</button>
          <button class="btn-report report-btn" data-id="${item.id}">Flag</button>
        </div>
      `;

      card.addEventListener("click", (e) => {
        if (e.target.closest("button") || e.target.closest("a")) return;
        window.location.href = `../../product-details.html?id=${item.id}`;
      });

      grid.appendChild(card);
    });

    grid.querySelectorAll(".add-cart-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        addCartItem(btn.dataset.id);
      });
    });

    grid.querySelectorAll(".buy-item-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        purchaseListing(btn.dataset.id);
      });
    });

    grid.querySelectorAll(".chat-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        openChatForListing(btn.dataset.id);
      });
    });

    grid.querySelectorAll(".report-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        openReportModal(btn.dataset.id);
      });
    });
  }

  function purchaseListing(id) {
    const listings = getListings();
    const item = listings.find(l => l.id === id);
    if (!item) return;

    item.status = "sold";
    saveListings(listings);

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
      status: "Order Placed - Campus Pickup Pending"
    });
    savePurchases(purchases);

    showToast(`Acquired ${item.title}! Serial: ${newSerial}. Saved to My Purchases.`, "success");
    render();
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

// 2. Controller: Buyer Purchases Ledger (purchases.html)
function initPurchasesView() {
  const container = document.getElementById("purchasesListContainer");
  const countEl = document.getElementById("purchasesCountDisplay");
  const searchInput = document.getElementById("purchaseSearchInput");
  const refreshBtn = document.getElementById("refreshPurchasesBtn");

  if (!container) return;

  function renderPurchases() {
    const purchases = getPurchases();
    const query = (searchInput ? searchInput.value.toLowerCase().trim() : "");

    const filtered = purchases.filter(p => {
      return p.title.toLowerCase().includes(query) ||
             p.id.toLowerCase().includes(query) ||
             p.serialNo.toLowerCase().includes(query);
    });

    if (countEl) countEl.textContent = filtered.length;

    container.innerHTML = "";

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state-card">
          <div class="photo-gallery-icon">🛍️</div>
          <h3 class="listing-title">No Purchased Items Yet</h3>
          <p class="listing-desc">Explore the campus marketplace to find great student gear.</p>
          <br>
          <a href="search.html" class="btn-primary">Browse Marketplace</a>
        </div>
      `;
      return;
    }

    filtered.forEach(p => {
      const card = document.createElement("article");
      card.className = "listing-card";

      card.innerHTML = `
        <div class="card-top-row">
          <span class="condition-badge condition-factory">PURCHASED ITEM</span>
          <span class="filter-label">${p.date}</span>
        </div>
        <div class="photo-gallery-box">
          <span class="photo-gallery-icon">📦</span>
          <span class="photo-count-badge">${p.serialNo}</span>
        </div>
        <h3 class="listing-title">${p.title}</h3>
        <p class="listing-desc">Order Receipt: <strong>${p.id}</strong> | Serial Number: <strong>${p.serialNo}</strong></p>
        
        <div class="seller-meta-row">
          <div>
            <span>Seller: <strong>${p.sellerName}</strong></span>
            <div class="metric-sub">${p.status}</div>
          </div>
          <div class="listing-title">$${p.price.toLocaleString()}</div>
        </div>

        <div class="card-actions-row">
          <button class="btn-chat rate-purchased-btn" data-seller="${p.sellerName}">Rate &amp; Review Seller</button>
        </div>
      `;

      container.appendChild(card);
    });

    container.querySelectorAll(".rate-purchased-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        showToast(`Seller ${btn.dataset.seller} given 5-Star Positive Rating!`, "success");
      });
    });
  }

  if (searchInput) searchInput.addEventListener("input", renderPurchases);
  if (refreshBtn) refreshBtn.addEventListener("click", renderPurchases);

  renderPurchases();
}

// 3. Controller: In-App Messaging (messages.html)
function initMessagesView() {
  const threadsContainer = document.getElementById("threadsListContainer");
  const chatMessagesBox = document.getElementById("chatMessagesBox");
  const partnerNameEl = document.getElementById("chatPartnerName");
  const itemContextEl = document.getElementById("chatItemContext");
  const messageInput = document.getElementById("chatMessageInput");
  const sendBtn = document.getElementById("sendMessageBtn");

  if (!threadsContainer) return;

  const urlParams = new URLSearchParams(window.location.search);
  let activeThreadId = urlParams.get("threadId");

  function renderThreads() {
    const threads = getThreads();
    threadsContainer.innerHTML = "";

    if (threads.length === 0) {
      threadsContainer.innerHTML = `<div class="thread-item">No active conversations.</div>`;
      return;
    }

    if (!activeThreadId) {
      activeThreadId = threads[0].id;
    }

    threads.forEach(t => {
      const item = document.createElement("div");
      item.className = `thread-item ${t.id === activeThreadId ? "active" : ""}`;
      item.dataset.id = t.id;

      const lastMsg = t.messages.length > 0 ? t.messages[t.messages.length - 1].text : "No messages";

      item.innerHTML = `
        <div class="thread-partner">Seller: ${t.sellerName}</div>
        <div class="thread-listing">📌 ${t.listingTitle}</div>
        <div class="thread-preview">${lastMsg}</div>
      `;

      item.addEventListener("click", () => {
        activeThreadId = t.id;
        renderThreads();
        renderChat();
      });

      threadsContainer.appendChild(item);
    });
  }

  function renderChat() {
    const threads = getThreads();
    const thread = threads.find(t => t.id === activeThreadId);

    if (!thread) return;

    if (partnerNameEl) partnerNameEl.textContent = thread.sellerName;
    if (itemContextEl) itemContextEl.textContent = `Item: ${thread.listingTitle} (Direct In-App Communication)`;

    if (chatMessagesBox) {
      chatMessagesBox.innerHTML = "";
      thread.messages.forEach(m => {
        const bubble = document.createElement("div");
        bubble.className = `message-bubble ${m.sender === "buyer" ? "bubble-sent" : "bubble-received"}`;
        bubble.innerHTML = `
          <div>${m.text}</div>
          <div class="message-time">${m.time}</div>
        `;
        chatMessagesBox.appendChild(bubble);
      });
      chatMessagesBox.scrollTop = chatMessagesBox.scrollHeight;
    }
  }

  function sendMessage() {
    if (!messageInput) return;
    const text = messageInput.value.trim();
    if (!text) return;

    const threads = getThreads();
    const thread = threads.find(t => t.id === activeThreadId);
    if (!thread) return;

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    thread.messages.push({
      sender: "buyer",
      text: text,
      time: nowStr
    });

    saveThreads(threads);
    messageInput.value = "";
    renderChat();
    renderThreads();

    setTimeout(() => {
      thread.messages.push({
        sender: "seller",
        text: `Thanks for the message! I can meet you at the campus union today.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      saveThreads(threads);
      renderChat();
      renderThreads();
    }, 1200);
  }

  if (sendBtn) sendBtn.addEventListener("click", sendMessage);
  if (messageInput) {
    messageInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendMessage();
    });
  }

  renderThreads();
  renderChat();
}

function openChatForListing(listingId) {
  const listings = getListings();
  const listing = listings.find(l => l.id === listingId);
  if (!listing) return;

  const threads = getThreads();
  let thread = threads.find(t => t.listingId === listingId);

  if (!thread) {
    thread = {
      id: `TH-${Date.now()}`,
      listingId: listing.id,
      listingTitle: listing.title,
      sellerId: listing.sellerId,
      sellerName: listing.sellerName,
      buyerName: "Emma Watson",
      messages: [
        {
          sender: "buyer",
          text: `Hi! Inquiring regarding ${listing.title} on campus.`,
          time: "Just now"
        }
      ]
    };
    threads.unshift(thread);
    saveThreads(threads);
  }

  window.location.href = `messages.html?threadId=${thread.id}`;
}

// 4. Controller: Buyer Registration (register.html)
function initBuyerRegistration() {
  const form = document.getElementById("buyerRegisterForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("regBuyerName").value.trim();
    const email = document.getElementById("regBuyerEmail").value.trim();

    let users = [];
    try {
      users = JSON.parse(localStorage.getItem("ag_users")) || [];
    } catch (err) {}

    const newUser = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name: name,
      email: email,
      role: "buyer",
      status: "active",
      violations: 0,
      joined: new Date().toISOString().split("T")[0]
    };

    users.push(newUser);
    localStorage.setItem("ag_users", JSON.stringify(users));
    localStorage.setItem("ag_currentUser", JSON.stringify(newUser));

    showToast(`Welcome ${name}! Student Buyer registered. Opening Search Portal...`, "success");
    setTimeout(() => {
      window.location.href = "search.html";
    }, 1000);
  });
}

function openReportModal(listingId) {
  let reports = [];
  try {
    reports = JSON.parse(localStorage.getItem("ag_reports")) || [];
  } catch (e) {}

  const listings = getListings();
  const listing = listings.find(l => l.id === listingId);

  reports.push({
    id: `REP-${Math.floor(100 + Math.random() * 900)}`,
    listingId: listingId,
    listingTitle: listing ? listing.title : "Reported Listing",
    sellerId: listing ? listing.sellerId : "USR-102",
    sellerName: listing ? listing.sellerName : "Alex Rivera",
    reporter: "Student Flag",
    reason: "Suspected Counterfeit / Fake Specs",
    details: "Flagged for review by campus safety moderator.",
    date: new Date().toLocaleDateString(),
    status: "Pending Review"
  });

  localStorage.setItem("ag_reports", JSON.stringify(reports));
  showToast(`Listing ${listingId} flagged for moderator review.`, "info");
}

function addCartItem(listingId) {
  const listings = getListings();
  const item = listings.find(l => l.id === listingId);
  if (!item) return;

  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem("ag_cart")) || [];
  } catch (e) {}

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

  localStorage.setItem("ag_cart", JSON.stringify(cart));
  updateCartBadge();
  showToast(`Added "${item.title}" to Cart!`, "success");
}

function updateCartBadge() {
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem("ag_cart")) || [];
  } catch (e) {}
  const totalCount = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  document.querySelectorAll(".cart-count-badge, #cartCountBadge, .cart-badge").forEach(badge => {
    badge.textContent = totalCount;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initDatabase();
  updateCartBadge();
  initSearchView();
  initPurchasesView();
  initMessagesView();
  initBuyerRegistration();
});
