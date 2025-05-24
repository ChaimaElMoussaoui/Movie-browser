// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEzeSYFcKDlZr_1Nmy6wEtx28FsNPaw2A",
  authDomain: "movie-browser-4a574.firebaseapp.com",
  projectId: "movie-browser-4a574",
  storageBucket: "movie-browser-4a574.appspot.com",
  messagingSenderId: "1082106301666",
  appId: "1:1082106301666:web:32ba29920923ac662d62bb",
  measurementId: "G-270PZD4QCK",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

function showMessage(message, divId) {
  var messageDiv = document.getElementById(divId);
  if (!messageDiv) return;
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = "1";
  setTimeout(() => {
    messageDiv.style.opacity = 0;
  }, 5000);
}

// Registration logic
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const username = document.getElementById("username").value.trim();

    if (password !== confirmPassword) {
      showMessage("Passwords do not match.", "signUpMessage");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: email,
        username: username,
      });
      showMessage("Account created successfully! Redirecting...", "signUpMessage");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        showMessage("Email already in use.", "signUpMessage");
      } else {
        showMessage("Registration failed: " + error.message, "signUpMessage");
      }
    }
  });
}

// Login logic
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      showMessage("Login successful! Redirecting...", "signInMessage");
      setTimeout(() => {
        window.location.href = "/views/index.html";
      }, 1500);
    } catch (error) {
      if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
        showMessage("Invalid email or password.", "signInMessage");
      } else {
        showMessage("Login failed: " + error.message, "signInMessage");
      }
    }
  });
}

onAuthStateChanged(auth, (user) => {
  window.auth = auth;
  const area = document.getElementById('profileArea');
  const loginLink = document.getElementById('login-link');
  if (!area) return;
  if (user) {
    const imgUrl = user.photoURL || '/assets/default.png';
    area.innerHTML = `<img src="${imgUrl}" alt="profile" class="profile-pic">`;
    if (loginLink) loginLink.style.display = "none";
  } else {
    area.innerHTML = '';
    if (loginLink) loginLink.style.display = "";
  }
});

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "/views/login.html";
    return;
  }
  const userDoc = await getDoc(doc(db, "users", user.uid));
  const userData = userDoc.exists() ? userDoc.data() : {};

  // Show favorites
  const favoriteList = document.getElementById("favoriteList");
  (userData.favorites || []).forEach(fav => {
    const li = document.createElement("li");
    li.textContent = fav; // You can fetch movie/show details if needed
    favoriteList.appendChild(li);
  });

  // Show reviews
  const reviewList = document.getElementById("reviewList");
  (userData.reviews || []).forEach(review => {
    const li = document.createElement("li");
    li.textContent = `${review.movieId}: "${review.reviewText}" (${review.rating}/5)`;
    reviewList.appendChild(li);
  });
});