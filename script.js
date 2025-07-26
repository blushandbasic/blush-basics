/* Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Body & general */
body {
  font-family: Arial, sans-serif;
  background-color: #fdb8e2;
  color: #333;
}

/* Header */
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
}

/* Container for logo, site name, and search form */
#logo-text-container {
  display: flex;
  align-items: center;
  gap: 15px; /* space between logo, text & search */
}

#logo {
  height: 60px;
  width: 60px;
  border-radius: 50%;
}

#site-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: black;
  font-family: 'Georgia', serif;
  user-select: none;
}

/* Search container - input + button */
#search-container {
  display: flex;
  align-items: center;
  margin-left: 15px; /* space from logo/site name */
}

/* Search input styling */
#search-input {
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 30px 0 0 30px;
  outline: none;
  width: 300px; /* long bar */
  background-color: white;
  box-shadow: 0 0 5px rgba(182, 45, 113, 0.4);
  transition: box-shadow 0.3s ease;
}

#search-input:focus {
  box-shadow: 0 0 8px rgba(182, 45, 113, 0.8);
}

/* Search button styling */
#search-button {
  background-color: #fdb8e2;
  border: none;
  padding: 10px 25px;
  font-size: 1rem;
  color: #333;
  font-weight: bold;
  border-radius: 0 30px 30px 0;
  cursor: pointer;
  box-shadow: 0 0 5px rgba(182, 45, 113, 0.4);
  transition: background-color 0.3s ease;
}

#search-button:hover {
  background-color: #e69ccf;
}

/* Auth Buttons */
.auth-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
}

.auth-buttons button {
  background-color: #b62d71;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
}

#settingsBtn {
  font-size: 20px;
  background: none;
  border: none;
  color: #b62d71;
  cursor: pointer;
}

/* Settings Panel Styles */
#settingsPanel {
  position: fixed;
  top: 0;
  right: -280px; /* hidden by default */
  width: 280px;
  height: 100vh;
  background-color: #fff0f5;
  box-shadow: -3px 0 10px rgba(182, 45, 113, 0.3);
  padding: 20px;
  box-sizing: border-box;
  transition: right 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 9999;
}

#settingsPanel.open {
  right: 0;
}

.settings-section {
  margin-bottom: 30px;
}

.settings-section h3 {
  color: #b62d71;
  font-weight: bold;
  margin-bottom: 15px;
  font-size: 1.2rem;
  user-select: none;
}

.settings-button {
  display: block;
  width: 100%;
  background-color: #b62d71;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 15px;
  margin-bottom: 12px;
  font-size: 1rem;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.25s ease;
  user-select: none;
}

.settings-button:hover {
  background-color: #9a235b;
}

/* Category buttons container to indent sub-buttons */
.category-buttons {
  margin-left: 12px;
}

.category-buttons .settings-button {
  background-color: #d68bb3;
  font-size: 0.95rem;
}

.category-buttons .settings-button:hover {
  background-color: #c575a3;
}

/* Replace down arrow text style */
.arrow-text {
  font-weight: bold;
  margin-left: 6px;
  font-size: 1rem;
  user-select: none;
}

/* Contact Us button at bottom */
#contactBtn {
  background-color: #b62d71;
  color: white;
  border-radius: 25px;
  padding: 12px 15px;
  font-size: 1rem;
  cursor: pointer;
  user-select: none;
  border: none;
  width: 100%;
  margin-top: auto;
  box-shadow: 0 2px 8px rgba(182, 45, 113, 0.3);
  transition: background-color 0.25s ease;
}

#contactBtn:hover {
  background-color: #9a235b;
}

/* Hero Section */
#hero {
  text-align: center;
  padding: 40px 20px;
  background: #fff0f5;
}

/* Banner */
#banner {
  overflow: hidden;
  width: 100%;
}

.banner-images {
  display: flex;
  animation: scrollBanner 30s linear infinite;
}

.banner-images img {
  width: 100vw;
  max-width: 100%;
}

@keyframes scrollBanner {
  0% { transform: translateX(0); }
  100% { transform: translateX(-200%); }
}

/* Hero Content */
.hero-content {
  margin-top: 20px;
}

#shop-now-btn {
  background-color: #b62d71;
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  text-decoration: none;
  display: inline-block;
  margin-top: 15px;
}

/* Categories Section */
#categories {
  padding: 40px 20px;
  text-align: center;
  background-color: #fff0f5;
}

#categories-heading {
  font-size: 2rem;
  margin-bottom: 30px;
  color: #b62d71;
}

.category {
  display: inline-block;
  margin: 10px;
  width: 150px;
  cursor: pointer;
  transition: transform 0.3s ease;
  vertical-align: top;
}

.category a {
  color: inherit;
  text-decoration: none;
}

.category img {
  width: 100%;
  height: auto;
  border-radius: 15px;
}

.category-info {
  margin-top: 10px;
  font-weight: bold;
  color: #b62d71;
}

.category:hover {
  transform: scale(1.05);
}

/* Profile pic next to logout */
#profile-pic-container {
  display: inline-block;
}

#profile-pic {
  height: 34px;
  width: 34px;
  border-radius: 50%;
  object-fit: cover;
  vertical-align: middle;
}
