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
      if (error.code === "auth/wrong-password") {
        showMessage("Wachtwoord onjuist", "signInMessage");
      } else if (error.code === "auth/user-not-found") {
        showMessage("Gebruiker niet gevonden", "signInMessage");
      } else {
        showMessage("Login mislukt: " + error.message, "signInMessage");
      }
    }
  });
}

const logoutLink = document.getElementById('logout-link');
if (logoutLink) {
  logoutLink.addEventListener('click', async (e) => {
    e.preventDefault();
    await signOut(auth);
    window.location.href = "/views/index.html";
  });
}

onAuthStateChanged(auth, async (user) => {
  const area = document.getElementById('profileArea');
  if (user) {
    if (logoutLink) logoutLink.style.display = "";
    const imgUrl = user.photoURL || '/assets/default.png';
    if (area) {
      area.innerHTML = `<img src="${imgUrl}" alt="profile" class="profile-pic">`;
    }

    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.exists() ? userDoc.data() : {};
    

    const favoriteList = document.getElementById("favoriteList");
    favoriteList.innerHTML = "";
    (userData.favorites || []).forEach(fav => {
      const li = document.createElement("li");
      li.textContent = fav; 
      favoriteList.appendChild(li);
    });
 
    const reviewList = document.getElementById("reviewList");
    reviewList.innerHTML = "";
    (userData.reviews || []).forEach(review => {
      const li = document.createElement("li");
      li.textContent = `${review.movieId}: "${review.reviewText}" (${review.rating}/5)`;
      reviewList.appendChild(li);
    });
  } else {
    if (area) area.innerHTML = '';
    if (logoutLink) logoutLink.style.display = "none";
    window.location.href = "/views/login.html";
  }
});