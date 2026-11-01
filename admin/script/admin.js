/**
 * CAMPUSXCHANGE - ADMIN OPERATIONS & GOVERNANCE LOGIC
 * Strict Vanilla JavaScript with Zero External Libraries
 */

const SEED_USERS = [
  {
    id: "USR-101",
    name: "Emma Watson",
    email: "emma.watson@campus.edu",
    role: "buyer",
    status: "active",
    violations: 0,
    joined: "2026-01-14"
  },
  {
    id: "USR-102",
    name: "Alex Rivera",
    email: "alex.rivera@campus.edu",
    role: "seller",
    status: "active",
    violations: 0,
    joined: "2026-02-01"
  },
  {
    id: "USR-103",
    name: "Officer Taylor",
    email: "taylor.moderator@campus.edu",
    role: "moderator",
    status: "active",
    violations: 0,
    joined: "2025-11-20"
  },
  {
    id: "USR-104",
    name: "Dean Johnson",
    email: "admin.dean@campus.edu",
    role: "admin",
    status: "active",
    violations: 0,
    joined: "2025-08-01"
  },
  {
    id: "USR-105",
    name: "Marcus Vance",
    email: "marcus.vance@campus.edu",
    role: "seller",
    status: "suspended",
    violations: 2,
    joined: "2026-08-19"
  },
  {
    id: "USR-106",
    name: "Sarah Chen",
    email: "sarah.chen@campus.edu",
    role: "buyer",
    status: "active",
    violations: 0,
    joined: "2026-05-12"
  },
  {
    id: "USR-107",
    name: "Spam Bot Account",
    email: "spam.promo@fake-mail.org",
    role: "seller",
    status: "banned",
    violations: 5,
    joined: "2026-09-02"
  }
];

function initAdminStorage() {
  const currentUsers = localStorage.getItem("ag_users");
  if (!currentUsers || currentUsers.includes("Lyra Vance")) {
    localStorage.setItem("ag_users", JSON.stringify(SEED_USERS));
  }
  if (!localStorage.getItem("ag_commission")) {
    localStorage.setItem("ag_commission", "2.5");
  }
  if (!localStorage.getItem("ag_maintenance")) {
    localStorage.setItem("ag_maintenance", "false");
  }
}

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem("ag_users")) || SEED_USERS;
  } catch (e) {
    return SEED_USERS;
  }
}

function saveUsers(users) {
  localStorage.setItem("ag_users", JSON.stringify(users));
}

function getListings() {
  try {
    return JSON.parse(localStorage.getItem("ag_listings")) || [];
  } catch (e) {
    return [];
  }
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
  }, 3500);
}

// 1. Controller: Operations Telemetry & Platform Modification
function initOperationsGovernanceView() {
  const metricTotalUsers = document.getElementById("metricTotalUsers");
  const metricActiveUsers = document.getElementById("metricActiveUsers");
  const metricSuspendedUsers = document.getElementById("metricSuspendedUsers");
  const metricTotalListings = document.getElementById("metricTotalListings");

  const commissionInput = document.getElementById("commissionRangeInput");
  const commissionDisplay = document.getElementById("commissionDisplayVal");
  const saveCommissionBtn = document.getElementById("saveCommissionBtn");

  const maintenanceStateText = document.getElementById("maintenanceStateText");
  const toggleMaintenanceBtn = document.getElementById("toggleMaintenanceBtn");

  function updateMetrics() {
    const users = getUsers();
    const listings = getListings();

    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === "active").length;
    const suspendedUsers = users.filter(u => u.status === "suspended" || u.status === "banned").length;

    if (metricTotalUsers) metricTotalUsers.textContent = totalUsers.toLocaleString();
    if (metricActiveUsers) metricActiveUsers.textContent = activeUsers.toLocaleString();
    if (metricSuspendedUsers) metricSuspendedUsers.textContent = suspendedUsers.toLocaleString();
    if (metricTotalListings) metricTotalListings.textContent = listings.length.toLocaleString();
  }

  // Campus Protocol Fee / Commission Modification
  const savedCommission = localStorage.getItem("ag_commission") || "2.5";
  if (commissionInput && commissionDisplay) {
    commissionInput.value = savedCommission;
    commissionDisplay.textContent = `${Number(savedCommission).toFixed(1)}%`;

    commissionInput.addEventListener("input", () => {
      commissionDisplay.textContent = `${Number(commissionInput.value).toFixed(1)}%`;
    });
  }

  if (saveCommissionBtn && commissionInput) {
    saveCommissionBtn.addEventListener("click", () => {
      const val = commissionInput.value;
      localStorage.setItem("ag_commission", val);
      showToast(`Campus marketplace fee rate updated to ${val}%`, "success");
    });
  }

  // Maintenance Lockdown State
  function renderMaintenanceState() {
    const isMaintenance = localStorage.getItem("ag_maintenance") === "true";
    if (maintenanceStateText) {
      maintenanceStateText.textContent = isMaintenance ? "MAINTENANCE LOCKDOWN ACTIVE" : "NORMAL OPERATIONS";
    }
  }

  if (toggleMaintenanceBtn) {
    toggleMaintenanceBtn.addEventListener("click", () => {
      const current = localStorage.getItem("ag_maintenance") === "true";
      const next = !current;
      localStorage.setItem("ag_maintenance", next ? "true" : "false");
      renderMaintenanceState();
      showToast(
        next ? "Platform set to MAINTENANCE MODE" : "Platform restored to NORMAL OPERATIONS",
        next ? "info" : "success"
      );
    });
  }

  renderMaintenanceState();
  updateMetrics();
}

// 2. Controller: User Accounts Directory & Modifying Roles/Status
function initUserManagementView() {
  const tbody = document.getElementById("usersTbody");
  const searchInput = document.getElementById("searchUserInput");
  const roleFilter = document.getElementById("filterUserRole");
  const statusFilter = document.getElementById("filterUserStatus");

  const suspendModal = document.getElementById("suspendModal");
  const closeSuspendBtn = document.getElementById("closeSuspendModalBtn");
  const suspendTargetName = document.getElementById("suspendTargetName");
  const suspendReasonInput = document.getElementById("suspendReasonInput");
  const confirmSuspendBtn = document.getElementById("confirmSuspendBtn");

  let currentPendingSuspendId = null;

  if (!tbody) return;

  function renderUsers() {
    const users = getUsers();
    const query = (searchInput ? searchInput.value.toLowerCase().trim() : "");
    const roleVal = (roleFilter ? roleFilter.value : "all");
    const statusVal = (statusFilter ? statusFilter.value : "all");

    const filtered = users.filter(u => {
      const matchSearch = u.name.toLowerCase().includes(query) ||
                          u.email.toLowerCase().includes(query) ||
                          u.id.toLowerCase().includes(query);
      const matchRole = roleVal === "all" || u.role === roleVal;
      const matchStatus = statusVal === "all" || u.status === statusVal;
      return matchSearch && matchRole && matchStatus;
    });

    tbody.innerHTML = "";

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7">Zero users match query criteria.</td>
        </tr>
      `;
      return;
    }

    filtered.forEach(user => {
      const tr = document.createElement("tr");

      let roleBadgeClass = "role-buyer";
      if (user.role === "seller") roleBadgeClass = "role-seller";
      else if (user.role === "moderator") roleBadgeClass = "role-moderator";
      else if (user.role === "admin") roleBadgeClass = "role-admin";

      let statusPillClass = "status-active";
      if (user.status === "suspended") statusPillClass = "status-suspended";
      else if (user.status === "banned") statusPillClass = "status-banned";

      const violationsCount = user.violations !== undefined ? user.violations : 0;

      let actionButtons = "";
      if (user.status === "active") {
        actionButtons = `
          <button class="btn-action-suspend suspend-btn" data-id="${user.id}" data-name="${user.name}">Suspend</button>
          <button class="btn-action-ban ban-btn" data-id="${user.id}">Ban</button>
        `;
      } else {
        actionButtons = `
          <button class="btn-action-reinstate reinstate-btn" data-id="${user.id}">Reinstate</button>
        `;
      }

      tr.innerHTML = `
        <td><strong>${user.id}</strong></td>
        <td>
          <div><strong>${user.name}</strong></div>
          <div class="metric-sub">${user.email}</div>
        </td>
        <td><span class="role-badge ${roleBadgeClass}">${user.role}</span></td>
        <td><strong>${violationsCount}</strong> Infractions</td>
        <td>${user.joined || "2026-01-01"}</td>
        <td><span class="user-status-pill ${statusPillClass}">${user.status}</span></td>
        <td>${actionButtons}</td>
      `;

      tbody.appendChild(tr);
    });

    tbody.querySelectorAll(".suspend-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        openSuspendModal(btn.dataset.id, btn.dataset.name);
      });
    });

    tbody.querySelectorAll(".ban-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        updateUserStatus(btn.dataset.id, "banned");
      });
    });

    tbody.querySelectorAll(".reinstate-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        updateUserStatus(btn.dataset.id, "active");
      });
    });
  }

  function updateUserStatus(id, newStatus) {
    const users = getUsers();
    const target = users.find(u => u.id === id);
    if (target) {
      target.status = newStatus;
      if (newStatus === "banned") {
        target.violations = (target.violations || 0) + 1;
      }
      saveUsers(users);
      showToast(`User ${target.name} (${id}) status set to ${newStatus.toUpperCase()}`, "info");
      renderUsers();
      initOperationsGovernanceView();
    }
  }

  function openSuspendModal(id, name) {
    currentPendingSuspendId = id;
    if (suspendTargetName) suspendTargetName.textContent = `${name} (${id})`;
    if (suspendReasonInput) suspendReasonInput.value = "";
    if (suspendModal) suspendModal.classList.add("open");
  }

  function closeSuspendModal() {
    if (suspendModal) suspendModal.classList.remove("open");
    currentPendingSuspendId = null;
  }

  if (closeSuspendBtn) {
    closeSuspendBtn.addEventListener("click", closeSuspendModal);
  }

  if (confirmSuspendBtn) {
    confirmSuspendBtn.addEventListener("click", () => {
      if (!currentPendingSuspendId) return;
      const users = getUsers();
      const target = users.find(u => u.id === currentPendingSuspendId);
      if (target) {
        target.status = "suspended";
        target.violations = (target.violations || 0) + 1;
        saveUsers(users);
        const reason = suspendReasonInput ? suspendReasonInput.value.trim() : "Policy infraction";
        showToast(`User ${target.name} suspended. Reason: ${reason || "Policy infraction"}`, "info");
        closeSuspendModal();
        renderUsers();
        initOperationsGovernanceView();
      }
    });
  }

  if (searchInput) searchInput.addEventListener("input", renderUsers);
  if (roleFilter) roleFilter.addEventListener("change", renderUsers);
  if (statusFilter) statusFilter.addEventListener("change", renderUsers);

  renderUsers();
}

// 3. Controller: Administrator Registration (admin/view/register.html)
function initAdminRegistration() {
  const form = document.getElementById("adminRegisterForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("regAdminName").value.trim();
    const email = document.getElementById("regAdminEmail").value.trim();
    const passkey = document.getElementById("regAdminPasskey").value.trim();

    if (passkey !== "CAMPUS-ROOT-2026" && passkey.length < 6) {
      showToast("Security Key invalid. Minimum 6 characters required.", "info");
      return;
    }

    const users = getUsers();
    const newAdmin = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name: name,
      email: email,
      role: "admin",
      status: "active",
      violations: 0,
      joined: new Date().toISOString().split("T")[0]
    };

    users.push(newAdmin);
    saveUsers(users);
    localStorage.setItem("ag_currentUser", JSON.stringify(newAdmin));

    showToast(`Administrator account created for ${name}! Opening Admin Portal...`, "success");
    setTimeout(() => {
      window.location.href = "user-management.html";
    }, 1000);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initAdminStorage();
  initOperationsGovernanceView();
  initUserManagementView();
  initAdminRegistration();
});
