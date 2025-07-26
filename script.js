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
const userInfo = document.getElementById("user-info");

loginBtn.onclick = () => {
  signInWithPopup(auth, provider).catch(e => alert("Login failed: " + e.message));
};

logoutBtn.onclick = () => {
  signOut(auth).catch(e => alert("Logout failed: " + e.message));
};

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

// Search button click
document.getElementById('search-button').addEventListener('click', () => {
  const query = document.getElementById('search-input').value.trim();
  if (query.length > 0) {
    window.location.href = `product.html?search=${encodeURIComponent(query)}`;
  }
});
