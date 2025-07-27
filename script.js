// Import Firebase modules (only if you use module bundlers or ES modules environment)
// For a plain <script> tag, you already import in your HTML as modules, so no import here.

// Firebase config & initialization
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

// DOM elements
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const profilePicContainer = document.getElementById("profile-pic-container");
const profilePic = document.getElementById("profile-pic");
const userInfo = document.getElementById("user-info");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");

// Login handler
loginBtn.onclick = () => {
  signInWithPopup(auth, provider).catch(e => alert("Login failed: " + e.message));
};

// Logout handler
logoutBtn.onclick = () => {
  signOut(auth).catch(e => alert("Logout failed: " + e.message));
};

// Auth state listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";

    if (user.photoURL) {
      profilePic.src = user.photoURL;
    } else {
      profilePic.src = "./default-profile.png";
    }

    profilePicContainer.style.display = "inline-block";
    userInfo.textContent = "";
  } else {
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    profilePicContainer.style.display = "none";
    userInfo.textContent = "";
  }
});

// Search button click handler
searchButton.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query.length > 0) {
    window.location.href = `product.html?search=${encodeURIComponent(query)}`;
  }
});

// Settings panel toggle
settingsBtn.addEventListener("click", () => {
  const isOpen = settingsPanel.classList.toggle("open");
  settingsPanel.setAttribute("aria-hidden", (!isOpen).toString());
});

// Close settings panel when clicking outside
document.addEventListener("click", (e) => {
  if (
    !settingsPanel.contains(e.target) &&
    e.target !== settingsBtn &&
    settingsPanel.classList.contains("open")
  ) {
    settingsPanel.classList.remove("open");
    settingsPanel.setAttribute("aria-hidden", "true");
  }
  
});
