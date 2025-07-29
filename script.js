// Firebase config (keep your actual config here)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  // ... rest of config
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Update UI on auth change
auth.onAuthStateChanged(user => {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userNameDisplay = document.getElementById("userName");
  const profilePic = document.getElementById("profile-pic");

  if (user) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    if (userNameDisplay) {
      userNameDisplay.textContent = user.displayName || "Logged In";
    }
    if (profilePic && user.photoURL) {
      profilePic.src = user.photoURL;
    }
  } else {
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    if (userNameDisplay) {
      userNameDisplay.textContent = "";
    }
    if (profilePic) {
      profilePic.src = "default-profile.png"; // fallback image
    }
  }
});

// Login
document.getElementById("loginBtn").addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  auth.signOut();
});

// ========== Settings Panel ==========
const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");

settingsBtn.addEventListener("click", () => {
  settingsPanel.classList.toggle("open");
});

// ========== Cart Logic ==========
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(product) {
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Item added to cart!");
}

// Attach add-to-cart click listener
document.addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("add-to-cart-btn")) {
    const productCard = e.target.closest(".product-card");
    const title = productCard.querySelector("h3").innerText;
    const price = productCard.querySelector(".price").innerText;
    const image = productCard.querySelector("img").src;

    const product = { title, price, image };
    addToCart(product);
  }
});

// View Cart button
const viewCartBtn = document.getElementById("view-cart-btn");
if (viewCartBtn) {
  viewCartBtn.addEventListener("click", () => {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    let cartList = "Your Cart:\n\n";
    cartItems.forEach((item, index) => {
      cartList += `${index + 1}. ${item.title} - ${item.price}\n`;
    });
    alert(cartList || "Cart is empty!");
  });
}
