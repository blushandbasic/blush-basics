// Firebase config (replace with your actual config)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  // ... rest of config
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Auth state change UI update
auth.onAuthStateChanged(user => {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userNameDisplay = document.getElementById("userName");
  const profilePic = document.getElementById("profile-pic");

  // Settings panel profile elements
  const profileDropdownPic = document.getElementById("profileDropdownPic");
  const profileDropdownName = document.getElementById("profileDropdownName");

  if (user) {
    if (loginBtn) loginBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
    if (userNameDisplay) userNameDisplay.textContent = user.displayName || "Logged In";
    if (profilePic && user.photoURL) profilePic.src = user.photoURL;

    // Update settings panel profile
    if (profileDropdownPic && user.photoURL) {
      profileDropdownPic.src = user.photoURL;
    }
    if (profileDropdownName) {
      profileDropdownName.textContent = user.displayName || "My Account";
    }
  } else {
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (userNameDisplay) userNameDisplay.textContent = "";
    if (profilePic) profilePic.src = "default-profile.png";

    // Reset settings panel profile
    if (profileDropdownPic) {
      profileDropdownPic.src = "default-profile.png";
    }
    if (profileDropdownName) {
      profileDropdownName.textContent = "";
    }
  }
});

// Login
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  });
}

// Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => auth.signOut());
}

// Profile Logout (from inside settings panel)
const profileLogoutBtn = document.getElementById("profileLogoutBtn");
if (profileLogoutBtn) {
  profileLogoutBtn.addEventListener("click", () => {
    auth.signOut();
    const profileDropdown = document.getElementById("profileDropdown");
    if (profileDropdown) profileDropdown.style.display = "none";
  });
}

// Settings Panel Toggle
const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");
if (settingsBtn && settingsPanel) {
  settingsBtn.addEventListener("click", () => {
    settingsPanel.classList.toggle("open");
  });
}

// Toggle profile dropdown inside settings
const accountBtn = document.getElementById("accountBtn");
const profileDropdown = document.getElementById("profileDropdown");

if (accountBtn && profileDropdown) {
  accountBtn.addEventListener("click", () => {
    const isVisible = profileDropdown.style.display === "block";
    profileDropdown.style.display = isVisible ? "none" : "block";
  });
}

// Cart Logic
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(product) {
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Item added to cart!");
}

// Listen for Add to Cart clicks
document.addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("add-to-cart-btn")) {
    const productCard = e.target.closest(".product-card");
    if (!productCard) return;

    const titleEl = productCard.querySelector("h3");
    const priceEl = productCard.querySelector(".price");
    const imgEl = productCard.querySelector("img");

    if (titleEl && priceEl && imgEl) {
      const product = {
        title: titleEl.innerText,
        price: priceEl.innerText,
        image: imgEl.src,
      };
      addToCart(product);
    }
  }
});

// View Cart button logic
const viewCartBtn = document.getElementById("view-cart-btn");
if (viewCartBtn) {
  viewCartBtn.addEventListener("click", () => {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    if (cartItems.length === 0) {
      alert("Cart is empty!");
    } else {
      let cartList = "Your Cart:\n\n";
      cartItems.forEach((item, i) => {
        cartList += `${i + 1}. ${item.title} - ${item.price}\n`;
      });
      alert(cartList);
    }
  });
}

// Load and display all products
function loadProducts(filterCategory = null) {
  const productContainer = document.getElementById("product-list");
  if (!productContainer) return;

  productContainer.innerHTML = "";
  db.collection("products").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const data = doc.data();

      if (filterCategory && data.category !== filterCategory) return;

      const productCard = document.createElement("div");
      productCard.classList.add("product-card");

      productCard.innerHTML = `
        <img src="${data.image}" alt="${data.title}" />
        <h3>${data.title}</h3>
        <p class="price">${data.price}</p>
        <button class="buy-now-btn">Buy Now</button>
        <button class="add-to-cart-btn">Add to Cart</button>
      `;

      productContainer.appendChild(productCard);
    });
  });
}

loadProducts();

// Link settings panel category buttons to filter products
const categoryButtons = document.querySelectorAll(".settings-button[data-category]");
categoryButtons.forEach(button => {
  button.addEventListener("click", () => {
    const selectedCategory = button.getAttribute("data-category");
    loadProducts(selectedCategory);
    settingsPanel.classList.remove("open");
  });
});
