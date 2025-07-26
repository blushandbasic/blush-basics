<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Blush & Basics</title>
  <link rel="icon" type="image/png" href="./logo.png" />
  <link rel="stylesheet" href="style.css" />
</head>
<body>

<header>
  <div id="logo-text-container">
    <img src="./logo.png" alt="Blush & Basics Logo" id="logo" />
    <span id="site-name">Blush & Basics</span>
  </div>

  <div id="search-container">
    <input type="text" id="search-input" placeholder="Search products..." />
    <button id="search-button">Search</button>
  </div>

  <div class="auth-buttons">
    <button id="loginBtn">Login</button>
    <button id="logoutBtn" style="display:none;">Logout</button>
    <div id="profile-pic-container" style="display:none;">
      <img id="profile-pic" src="" alt="Profile" />
    </div>
    <button id="settingsBtn">☰</button>
  </div>
</header>

<section id="hero">
  <div id="banner">
    <div class="banner-images">
      <img src="./banner1.png" alt="Banner 1" />
      <img src="./banner2.png" alt="Banner 2" />
      <img src="./banner3.png" alt="Banner 3" />
      <img src="./banner4.png" alt="Banner 4" />
      <img src="./banner5.png" alt="Banner 5" />
      <img src="./banner1.png" alt="Repeat 1" />
      <img src="./banner2.png" alt="Repeat 2" />
    </div>
  </div>

  <div class="hero-content">
    <h1 id="hero-welcome" style="color: #b62d71;">Welcome to Blush & Basics</h1>
    <p style="color: #b62d71;">Your one-stop for beauty💄, skincare🧴🧼, and fashion essentials🩰</p>
    <a href="product.html" id="shop-now-btn" class="btn-primary">Shop Now</a>
  </div>
</section>

<section id="categories">
  <h2 id="categories-heading">Browse Categories</h2>
  <div class="category">
    <a href="product.html?category=skincare">
      <img src="./skincare.jpg" alt="Skincare" />
      <div class="category-info">Skincare</div>
    </a>
  </div>
  <div class="category">
    <a href="product.html?category=makeup">
      <img src="./makeup.jpg" alt="Makeup" />
      <div class="category-info">Makeup</div>
    </a>
  </div>
  <div class="category">
    <a href="product.html?category=clothing">
      <img src="./clothing.jpg" alt="Clothing" />
      <div class="category-info">Clothing</div>
    </a>
  </div>
  <div class="category">
    <a href="product.html?category=accessories">
      <img src="./accessories.jpg" alt="Accessories" />
      <div class="category-info">Accessories</div>
    </a>
  </div>
</section>

<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
  import { getAuth, signInWithPopup, signOut, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

  const firebaseConfig = {
    apiKey: "AIzaSyCY0SCWTEzv1S7l-JGUfz2itgSZQ4Tewds",
    authDomain: "blush-andbasics.firebaseapp.com",
    projectId: "blush-andbasics",
    storageBucket: "blush-andbasics.appspot.com",
    messagingSenderId: "1045987661646",
    appId: "1:1045987661646:web:fde8e488cbd67b4de4b01f",
    measurementId: "G-KVRKCDYZS4"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const profilePicContainer = document.getElementById("profile-pic-container");
  const profilePic = document.getElementById("profile-pic");

  loginBtn.onclick = () => signInWithPopup(auth, provider).catch(e => alert("Login failed: " + e.message));
  logoutBtn.onclick = () => signOut(auth).catch(e => alert("Logout failed: " + e.message));

  onAuthStateChanged(auth, user => {
    if(user) {
      loginBtn.style.display = "none";
      logoutBtn.style.display = "inline-block";

      profilePic.src = user.photoURL || "./default-profile.png";
      profilePicContainer.style.display = "inline-block";
    } else {
      loginBtn.style.display = "inline-block";
      logoutBtn.style.display = "none";
      profilePicContainer.style.display = "none";
    }
  });

  document.getElementById("search-button").addEventListener("click", () => {
    const query = document.getElementById("search-input").value.trim();
    if(query.length > 0) {
      window.location.href = `product.html?search=${encodeURIComponent(query)}`;
    }
  });
</script>

</body>
</html>
