function showLoginError(input, message) {
  input.style.border = "2px solid red";
  input.style.backgroundColor = "#fff0f0";

  let oldError = input.nextElementSibling;
  if (oldError && oldError.className === "login-error") {
    oldError.remove();
  }

  let error = document.createElement("span");
  error.className = "login-error";
  error.style.display = "block";
  error.style.color = "red";
  error.style.fontSize = "13px";
  error.textContent = message;
  input.parentNode.insertBefore(error, input.nextSibling);
}

function clearLoginError(input) {
  input.style.border = "";
  input.style.backgroundColor = "";
  let error = input.nextElementSibling;
  if (error && error.className === "login-error") {
    error.remove();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  let form = document.getElementById("universalLoginForm");
  let emailInput = document.getElementById("loginEmail");
  let passwordInput = document.getElementById("loginPassword");
  let roleInput = document.getElementById("loginRole");

  if (!form) return;

  let inputs = form.querySelectorAll("input");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("input", function () {
      clearLoginError(this);
    });
  }

  roleInput.addEventListener("change", function () {
    clearLoginError(roleInput);
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    let valid = true;
    let email = emailInput.value.trim();
    let password = passwordInput.value;
    let role = roleInput.value;
    let emailText = email.toLowerCase();

    clearLoginError(emailInput);
    clearLoginError(passwordInput);

    if (email === "" ||
        email.indexOf("@") === -1 ||
        email.indexOf(" ") !== -1 ||
        email.indexOf(".") === -1 ||
        emailText.indexOf(".edu") === -1) {
      showLoginError(emailInput, "Enter a valid campus email ending in .edu.");
      valid = false;
    }

    if (password === "") {
      showLoginError(passwordInput, "Password is required.");
      valid = false;
    } else if (password.length < 8) {
      showLoginError(passwordInput, "Password must be at least 8 characters.");
      valid = false;
    } else if (password.length > 128) {
      showLoginError(passwordInput, "Password cannot be more than 128 characters.");
      valid = false;
    }

    let allowedRoles = ["buyer", "seller", "moderator", "admin"];
    if (allowedRoles.indexOf(role) === -1) {
      showLoginError(roleInput, "Select a valid role.");
      valid = false;
    } else {
      clearLoginError(roleInput);
    }

    if (!valid) {
      alert("Please correct the highlighted login information.");
      return;
    }

    let name = email.split("@")[0];
    name = name.replace(/[._-]/g, " ");
    name = name.replace(/\b\w/g, function (letter) {
      return letter.toUpperCase();
    });

    let user = {
      id: "USR-" + Math.floor(100 + Math.random() * 900),
      name: name,
      email: email,
      role: role,
      status: "active"
    };
    localStorage.setItem("ag_currentUser", JSON.stringify(user));

    if (role === "seller") {
      window.location.href = "../../sellers/view/manage-listings.html";
    } else if (role === "moderator") {
      window.location.href = "../../moderators/view/reported-listings.html";
    } else if (role === "admin") {
      window.location.href = "../../admin/view/user-management.html";
    } else {
      window.location.href = "../../buyers/view/search.html";
    }
  });
});
