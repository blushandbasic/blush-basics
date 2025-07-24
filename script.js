/* Basic Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
}

#hero {
  background-image: url('images/hero-image.jpg');
  background-size: cover;
  text-align: center;
  color: white;
  padding: 100px 20px;
}

#hero h1 {
  font-size: 3rem;
}

#categories {
  display: flex;
  justify-content: space-around;
  margin: 50px 0;
}

.category {
  position: relative;
  width: 200px;
  height: 200px;
  overflow: hidden;
  cursor: pointer;
}

.category img {
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease-in-out;
}

.category-info {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  opacity: 0;
  transition: opacity 0.3s;
}

.category:hover img {
  transform: scale(1.1);
}

.category:hover .category-info {
  opacity: 1;
}

.btn {
  padding: 10px 20px;
  background-color: #d63384;
  color: white;
  text-decoration: none;
  font-weight: bold;
  border-radius: 5px;
}
