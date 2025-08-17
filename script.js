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

document.addEventListener("DOMContentLoaded", () => {

  // --- Auth state listener to update UI ---
  auth.onAuthStateChanged(user => {
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const userNameDisplay = document.getElementById("userName");
    const profilePic = document.getElementById("profile-pic");
    const profileDropdownPic = document.getElementById("profileDropdownPic");
    const profileDropdownName = document.getElementById("profileDropdownName");

    const photo = (user && user.photoURL) ? user.photoURL : "default-profile.png";
    const displayName = (user && user.displayName) ? user.displayName : "User";

    if (user) {
      if (loginBtn) loginBtn.style.display = "none";
      if (logoutBtn) logoutBtn.style.display = "inline-block";
      if (userNameDisplay) userNameDisplay.textContent = displayName;
      if (profilePic) profilePic.src = photo;
      if (profileDropdownPic) profileDropdownPic.src = photo;
      if (profileDropdownName) profileDropdownName.textContent = displayName;
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

  const accountBtn = document.getElementById("accountBtn");
  const profileDropdown = document.getElementById("profileDropdown");
  if (accountBtn && profileDropdown) {
    accountBtn.addEventListener("click", () => {
      profileDropdown.style.display = profileDropdown.style.display === "block" ? "none" : "block";
      const user = auth.currentUser;
      if (user) {
        const photo = user.photoURL || "default-profile.png";
        const name = user.displayName || "User";
        const profileDropdownPic = document.getElementById("profileDropdownPic");
        const profileDropdownName = document.getElementById("profileDropdownName");
        if (profileDropdownPic) profileDropdownPic.src = photo;
        if (profileDropdownName) profileDropdownName.textContent = name;
      }
    });
  }

  if (profileDropdown) {
    const profileDropdownObserver = new MutationObserver(() => {
      const user = auth.currentUser;
      if (!user) return;
      const photo = user.photoURL || "default-profile.png";
      const profileDropdownPic = document.getElementById("profileDropdownPic");
      if (profileDropdownPic) profileDropdownPic.src = photo;
    });
    profileDropdownObserver.observe(profileDropdown, { attributes: true, childList: true, subtree: true });
  }

  /* ============================
     CART LOGIC
     ============================ */
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function updateCartCountUI() {
    const count = cart.length;
    const cartCountSpan = document.getElementById("cart-count");
    if (cartCountSpan) cartCountSpan.textContent = count;

    const viewCartBtn = document.getElementById("view-cart-btn");
    if (viewCartBtn) {
      if (viewCartBtn.tagName.toLowerCase() === "a") {
        const innerSpan = viewCartBtn.querySelector("#cart-count");
        if (innerSpan) innerSpan.textContent = count;
        else viewCartBtn.textContent = `Cart(${count})`;
      } else {
        viewCartBtn.textContent = `Cart(${count})`;
      }
      if (!viewCartBtn.getAttribute("href")) viewCartBtn.setAttribute("href", "cart.html");
      viewCartBtn.addEventListener("click", (ev) => {
        if (viewCartBtn.tagName.toLowerCase() !== "a") {
          window.location.href = "cart.html";
        }
      });
    }
  }

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCountUI();
  }

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

  function addProductToCart(product, button) {
    if (!product) return;
    const id = product.id || product.title;
    const exists = cart.some(it => it.id === id || it.title === product.title);
    if (exists) {
      setButtonToRemove(button);
      saveCart();
      return;
    }
    cart.push({
      id: id,
      title: product.title || "",
      price: product.price || "",
      image: product.image || ""
    });
    saveCart();
    setButtonToRemove(button);
  }

  function removeProductFromCartById(idOrTitle, button) {
    if (!idOrTitle) return;
    cart = cart.filter(it => !(it.id === idOrTitle || it.title === idOrTitle));
    saveCart();
    setButtonToAdd(button);
  }

  function syncButtonsWithCart() {
    document.querySelectorAll(".product-card").forEach(card => {
      const btn = card.querySelector("button.add-to-cart-btn, button.remove-from-cart-btn");
      if (!btn) return;
      const prodId = card.dataset.id || btn.dataset.id || (card.querySelector("h3")?.innerText || "").trim();
      const inCart = cart.some(it => it.id === prodId || it.title === (card.querySelector("h3")?.innerText || "").trim());
      if (inCart) setButtonToRemove(btn);
      else setButtonToAdd(btn);
      if (!btn.dataset.id && card.dataset.id) btn.dataset.id = card.dataset.id;
    });
  }

  document.addEventListener("click", (e) => {
    const target = e.target;
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
    if (target && target.classList.contains("remove-from-cart-btn")) {
      const card = target.closest(".product-card");
      if (!card) return;
      const id = target.dataset.id || card.dataset.id || (card.querySelector("h3")?.innerText || "").trim();
      removeProductFromCartById(id, target);
      return;
    }
  });

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

      syncButtonsWithCart();
    }).catch(e => {
      console.error("Error loading products:", e);
    });
  }

  // Initial UI sync
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  updateCartCountUI();
  syncButtonsWithCart();

  // --- Search functionality with live filtering ---
  const searchInputEl = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search');

  if (searchInputEl) {
    searchInputEl.addEventListener('input', () => {
      const query = searchInputEl.value.toLowerCase();
      document.querySelectorAll('.product-card').forEach(card => {
        const title = card.querySelector('h3')?.innerText.toLowerCase() || '';
        card.style.display = title.includes(query) ? '' : 'none';
      });

      if (clearSearchBtn) clearSearchBtn.style.display = searchInputEl.value.length > 0 ? 'inline' : 'none';
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchInputEl.value = '';
      clearSearchBtn.style.display = 'none';
      searchInputEl.focus();
      document.querySelectorAll('.product-card').forEach(card => card.style.display = '');
    });
    clearSearchBtn.style.display = searchInputEl.value.length > 0 ? 'inline' : 'none';
  }

  const viewCartBtn = document.getElementById("view-cart-btn");
  if (viewCartBtn) {
    if (viewCartBtn.tagName.toLowerCase() === "a" && !viewCartBtn.getAttribute("href")) viewCartBtn.setAttribute("href", "cart.html");
    viewCartBtn.addEventListener("click", (e) => {
      if (viewCartBtn.tagName.toLowerCase() !== "a") {
        window.location.href = "cart.html";
      }
    });
  }

  // Category filter buttons
  const categoryButtons = document.querySelectorAll(".settings-button[data-category]");
  categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
      const selectedCategory = button.getAttribute("data-category");
      loadProducts(selectedCategory);
      if (settingsPanel) settingsPanel.classList.remove("open");
    });
  });

  // --- Service Worker registration ---
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(reg => console.log('Service Worker registered:', reg))
        .catch(err => console.log('Service Worker failed:', err));
    });
  }

}); // End DOMContentLoaded
