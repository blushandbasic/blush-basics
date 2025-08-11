// --- Firebase Initialization (replace with your actual config) ---
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// --- Auth state listener to update UI ---
auth.onAuthStateChanged(user => {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userNameDisplay = document.getElementById("userName");
  const profilePic = document.getElementById("profile-pic");

  const profileDropdownPic = document.getElementById("profileDropdownPic");
  const profileDropdownName = document.getElementById("profileDropdownName");

  if (user) {
    if (loginBtn) loginBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
    if (userNameDisplay) userNameDisplay.textContent = user.displayName || "Logged In";
    if (profilePic && user.photoURL) profilePic.src = user.photoURL;
    if (profileDropdownPic && user.photoURL) profileDropdownPic.src = user.photoURL;
    if (profileDropdownName) profileDropdownName.textContent = user.displayName || "My Account";
  } else {
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (userNameDisplay) userNameDisplay.textContent = "";
    if (profilePic) profilePic.src = "default-profile.png";
    if (profileDropdownPic) profileDropdownPic.src = "default-profile.png";
    if (profileDropdownName) profileDropdownName.textContent = "";
  }
});

// --- Login button ---
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(e => alert("Login failed: " + e.message));
  });
}

// --- Logout button ---
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => auth.signOut());
}

// --- Profile Logout inside settings panel ---
const profileLogoutBtn = document.getElementById("profileLogoutBtn");
if (profileLogoutBtn) {
  profileLogoutBtn.addEventListener("click", () => {
    auth.signOut();
    const profileDropdown = document.getElementById("profileDropdown");
    if (profileDropdown) profileDropdown.style.display = "none";
  });
}

// --- Settings panel toggle ---
const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");
if (settingsBtn && settingsPanel) {
  settingsBtn.addEventListener("click", () => {
    settingsPanel.classList.toggle("open");
  });
}

// --- Profile dropdown toggle inside settings ---
const accountBtn = document.getElementById("accountBtn");
const profileDropdown = document.getElementById("profileDropdown");
if (accountBtn && profileDropdown) {
  accountBtn.addEventListener("click", () => {
    profileDropdown.style.display = profileDropdown.style.display === "block" ? "none" : "block";
  });
}

/* ============================
   CART LOGIC (robust version)
   ============================ */

// read cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* Update cart UI in navbar and any cart-count spans */
function updateCartCountUI() {
  const count = cart.length;
  // update element with id cart-count (span)
  const cartCountSpan = document.getElementById("cart-count");
  if (cartCountSpan) {
    cartCountSpan.textContent = count;
  }
  // update view-cart-btn text if present
  const viewCartBtn = document.getElementById("view-cart-btn");
  if (viewCartBtn) {
    // preserve href if it's an <a>
    if (viewCartBtn.tagName.toLowerCase() === "a") {
      // If viewCartBtn has a child span with id cart-count, leave it and only update that span.
      const innerSpan = viewCartBtn.querySelector("#cart-count");
      if (innerSpan) {
        innerSpan.textContent = count;
      } else {
        viewCartBtn.textContent = `Cart(${count})`;
      }
    } else {
      viewCartBtn.textContent = `Cart(${count})`;
    }
    // Ensure clicking always navigates to cart page
    if (!viewCartBtn.getAttribute("href")) viewCartBtn.setAttribute("href", "cart.html");
    // Also add fallback click handler
    viewCartBtn.addEventListener("click", (ev) => {
      // If it's a button, use location
      if (viewCartBtn.tagName.toLowerCase() !== "a") {
        window.location.href = "cart.html";
      }
    });
  }
}

/* Save and update UI */
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCountUI();
}

/* helper - set button visual state */
function setButtonToRemove(btn) {
  if (!btn) return;
  btn.classList.remove("add-to-cart-btn");
  btn.classList.add("remove-from-cart-btn");
  btn.textContent = "Remove from Cart";
}
function setButtonToAdd(btn) {
  if (!btn) return;
  btn.classList.remove("remove-from-cart-btn");
  btn.classList.add("add-to-cart-btn");
  btn.textContent = "Add to Cart";
}

/* Add product if not present. Product must include id (preferred), title, price, image */
function addProductToCart(product, button) {
  if (!product) return;
  const id = product.id || product.title;
  const exists = cart.some(it => it.id === id || it.title === product.title);
  if (exists) {
    // Already there — ensure UI shows Remove
    setButtonToRemove(button);
    saveCart();
    return;
  }
  const productToStore = {
    id: id,
    title: product.title || "",
    price: product.price || "",
    image: product.image || ""
  };
  cart.push(productToStore);
  saveCart();
  setButtonToRemove(button);
}

/* Remove product by id or title */
function removeProductFromCartById(idOrTitle, button) {
  if (!idOrTitle) return;
  cart = cart.filter(it => !(it.id === idOrTitle || it.title === idOrTitle));
  saveCart();
  setButtonToAdd(button);
}

/* Synchronize all product-card buttons on the page with current cart */
function syncButtonsWithCart() {
  document.querySelectorAll(".product-card").forEach(card => {
    const btn = card.querySelector("button.add-to-cart-btn, button.remove-from-cart-btn");
    if (!btn) return;
    const prodId = card.dataset.id || btn.dataset.id || (card.querySelector("h3")?.innerText || "").trim();
    const inCart = cart.some(it => it.id === prodId || it.title === (card.querySelector("h3")?.innerText || "").trim());
    if (inCart) setButtonToRemove(btn);
    else setButtonToAdd(btn);
    // ensure data-id exists on button for robust identification
    if (!btn.dataset.id && card.dataset.id) btn.dataset.id = card.dataset.id;
  });
}

/* Event delegation for Add / Remove buttons */
document.addEventListener("click", (e) => {
  const target = e.target;
  // Add to cart
  if (target && target.classList.contains("add-to-cart-btn")) {
    const card = target.closest(".product-card");
    if (!card) return;
    const id = target.dataset.id || card.dataset.id || (card.querySelector("h3")?.innerText || "").trim();
    const title = card.querySelector("h3") ? card.querySelector("h3").innerText.trim() : "";
    const price = card.querySelector(".price") ? card.querySelector(".price").innerText.trim() : "";
    const image = card.querySelector("img") ? card.querySelector("img").src : "";
    addProductToCart({ id, title, price, image }, target);
    return;
  }
  // Remove from cart
  if (target && target.classList.contains("remove-from-cart-btn")) {
    const card = target.closest(".product-card");
    if (!card) return;
    const id = target.dataset.id || card.dataset.id || (card.querySelector("h3")?.innerText || "").trim();
    removeProductFromCartById(id, target);
    return;
  }
});

/* --- Ensure buttons are correct after Firestore product load --- */
/* Load products from Firestore (keeps your original behavior but ensures data-id + sync) */
function loadProducts(filterCategory = null) {
  const productContainer = document.getElementById("product-list");
  if (!productContainer) return;

  productContainer.innerHTML = "";

  db.collection("products").get().then(querySnapshot => {
    querySnapshot.forEach(doc => {
      const data = doc.data();
      if (filterCategory && data.category !== filterCategory) return;

      const prodId = doc.id;
      const inCart = cart.some(item => item.id === prodId || item.title === data.title);

      const productCard = document.createElement("div");
      productCard.classList.add("product-card");
      productCard.dataset.id = prodId;

      productCard.innerHTML = `
        <img src="${data.image}" alt="${data.title}" />
        <h3>${data.title}</h3>
        <p class="price">${data.price}</p>
        <button class="buy-now-btn">Buy Now</button>
        <button data-id="${prodId}" class="${inCart ? 'remove-from-cart-btn' : 'add-to-cart-btn'}">
          ${inCart ? 'Remove from Cart' : 'Add to Cart'}
        </button>
      `;

      productContainer.appendChild(productCard);
    });

    // after rendering all products, sync buttons
    syncButtonsWithCart();
  }).catch(e => {
    console.error("Error loading products:", e);
  });
}

/* Initial UI sync on DOM ready */
document.addEventListener("DOMContentLoaded", () => {
  // ensure cart UI reflects localStorage
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  updateCartCountUI();

  // if product list exists on DOM already, sync buttons (if products were rendered server-side)
  syncButtonsWithCart();

  // Search input handlers
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search');

  if (searchInput && clearSearchBtn) {
    // Show clear button only if input has value
    searchInput.addEventListener('input', () => {
      clearSearchBtn.style.display = searchInput.value.length > 0 ? 'inline' : 'none';
    });

    // Clear input and hide clear button on click
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearSearchBtn.style.display = 'none';
      searchInput.focus();
    });

    // Initialize clear button display on page load
    clearSearchBtn.style.display = searchInput.value.length > 0 ? 'inline' : 'none';
  }
});


/* Redirect cart button to cart.html (fallback) */
const viewCartBtn = document.getElementById("view-cart-btn");
if (viewCartBtn) {
  // ensure it has an href so a normal click works
  if (viewCartBtn.tagName.toLowerCase() === "a" && !viewCartBtn.getAttribute("href")) viewCartBtn.setAttribute("href", "cart.html");
  viewCartBtn.addEventListener("click", (e) => {
    if (viewCartBtn.tagName.toLowerCase() !== "a") {
      window.location.href = "cart.html";
    }
  });
}

/* Category filter buttons (existing code preserved) */
const categoryButtons = document.querySelectorAll(".settings-button[data-category]");
categoryButtons.forEach(button => {
  button.addEventListener("click", () => {
    const selectedCategory = button.getAttribute("data-category");
    loadProducts(selectedCategory);
    if (settingsPanel) settingsPanel.classList.remove("open");
  });
});
