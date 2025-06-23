// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  arrayUnion
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";


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
export const auth = getAuth(app);
const db = getFirestore(app);

function showMessage(message, divId) {
  const messageDiv = document.getElementById(divId);
  if (!messageDiv) return;
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = "1";
  setTimeout(() => {
    messageDiv.style.opacity = 0;
  }, 5000);
}


// REGISTRATION
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
        favorites: [],
        reviews: [],
        joined: new Date().toISOString().split("T")[0]
      });
      showMessage("Account created successfully! Redirecting...", "signUpMessage");
      setTimeout(() => {
        window.location.href = "/views/profile.html";
      }, 2000);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        showMessage("An account already exists with this email address.", "signUpMessage");
      } else {
        showMessage("Registration failed: " + error.message, "signUpMessage");
      }
    }
  });
}

// LOGIN
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
        window.location.href = "/views/profile.html";
      }, 1000);
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        showMessage("Incorrect password.", "signInMessage");
      } else if (error.code === "auth/user-not-found") {
        showMessage("User not found.", "signInMessage");
      } else {
        showMessage("Login failed: " + error.message, "signInMessage");
      }
    }
  });
}

// LOGOUT
const logoutLink = document.getElementById('logout-link');
if (logoutLink) {
  logoutLink.addEventListener('click', async (e) => {
    e.preventDefault();
    await signOut(auth);
    window.location.href = "/views/index.html";
  });
}

// AUTH STATE & PROFIEL
onAuthStateChanged(auth, async (user) => {
  const area = document.getElementById('profileArea');
  if (user) {
    // Navbar profielicoon
    if (logoutLink) logoutLink.style.display = "";
    const imgUrl = user.photoURL || '/assets/default.png';
    if (area) {
      area.innerHTML = `<img src="${imgUrl}" alt="profile" class="profile-pic">`;
    }

    // Profielpagina vullen
    if (window.location.pathname.endsWith("/profile.html")) {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};

      // Welkom-bericht
      const welcome = document.getElementById("welcomeMessage");
      if (welcome && userData.username) {
        welcome.textContent = `Hi, ${userData.username}`;
      }

      // E-mail, naam, joined invullen
      if (document.getElementById("profileEmail")) {
        document.getElementById("profileEmail").value = userData.email || "";
      }
      if (document.getElementById("profileNaam")) {
        document.getElementById("profileNaam").value = userData.username || "";
      }
      if (document.getElementById("profileJoined")) {
        document.getElementById("profileJoined").value = userData.joined || "";
      }
      if (document.getElementById("profilePic")) {
        document.getElementById("profilePic").src = imgUrl;
      }

      // Favorieten
      const favoriteList = document.getElementById("favoriteList");
      if (favoriteList) {
        favoriteList.innerHTML = "";
        (userData.favorites || []).forEach(fav => {
          const li = document.createElement("li");
          li.textContent = fav; 
          favoriteList.appendChild(li);
        });
        if ((userData.favorites || []).length === 0) {
          favoriteList.innerHTML = "<li>No favorites yet.</li>";
        }
      }

      // Reviews
      const reviewList = document.getElementById("reviewList");
      if (reviewList) {
        reviewList.innerHTML = "";
        (userData.reviews || []).forEach(review => {
          const li = document.createElement("li");
          li.textContent = `${review.movieId}: "${review.reviewText}" (${review.rating || ""}/5)`;
          reviewList.appendChild(li);
        });
        if ((userData.reviews || []).length === 0) {
          reviewList.innerHTML = "<li>No reviews yet.</li>";
        }
      }
    }
  } else {
    // Uitloggen of niet ingelogd
    if (area) area.innerHTML = '';
    if (logoutLink) logoutLink.style.display = "none";
    if (window.location.pathname.endsWith("/profile.html")) {
      window.location.href = "/views/login.html";
    }
  }
});




// FAVORIET TOEVOEGEN: alleen als ingelogd
export async function addFavorite(movieId) {
  const user = auth.currentUser;
  if (!user) {
    alert("Log eerst in om favorieten toe te voegen!");
    window.location.href = "/views/login.html";
    return;
  }
  const userRef = doc(db, "users", user.uid);
  await updateDoc(userRef, {
    favorites: arrayUnion(movieId)
  });
  alert("Toegevoegd aan favorieten!");
}

// ====== PROFIELFOTO UPLOADEN & NAAM WIJZIGEN ======


// === Naam wijzigen (en opslaan in Firestore) ===
const saveBtn = document.querySelector(".save-profile");
const nameEl = document.getElementById("profileNaam");
if (saveBtn && nameEl) {
  saveBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;
    const newName = nameEl.value.trim();
    if (newName && newName !== user.displayName) {
      await updateProfile(user, { displayName: newName });
      await updateDoc(doc(db, "users", user.uid), { username: newName });
      alert("Naam bijgewerkt!");
    }
  });
}

// === Email verificatie opnieuw sturen ===
document.addEventListener("click", function(e) {
  if (e.target && e.target.id === "resendVerification") {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      user.sendEmailVerification().then(() => {
        alert("Verificatie-email verstuurd!");
      });
    }
  }
});


export { app };