
import { getUserFavorites } from "./favorites.js";
import { getUserReviews } from "./reviews.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

// Importeer Firebase modules vanuit je bestaande CDN (let op: geen node imports!)
import { updateProfile, sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-storage.js";
import { getFirestore, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { app } from "/auth/firebase-auth.js"; // Zorg dat je app exported in firebase-auth.js!

const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);
// Stel deze variabele in met al je films (bijvoorbeeld via een fetch)
const movies = window.allMovies || []; // Zorg dat dit een array van {id, title} is!

function renderProfile(user, movies) {
  const container = document.getElementById("profileContainer");
  container.innerHTML = ""; // Leegmaken

  const title = document.createElement("h1");
  title.textContent = `Welkom, ${user.displayName || user.email || "Gebruiker"}!`;
  container.appendChild(title);

  // Favorieten
  const favSection = document.createElement("section");
  favSection.innerHTML = "<h2>Favoriete Films</h2>";
  const favList = document.createElement("ul");
  favSection.appendChild(favList);
  container.appendChild(favSection);

  // Reviews
  const revSection = document.createElement("section");
  revSection.innerHTML = "<h2>Jouw Reviews</h2>";
  const revList = document.createElement("ul");
  revSection.appendChild(revList);
  container.appendChild(revSection);

  // Favorieten ophalen en tonen
  getUserFavorites(user.uid).then(favorites => {
    favList.innerHTML = "";
    if (!favorites || favorites.length === 0) {
      favList.innerHTML = "<li>Je hebt nog geen favoriete films.</li>";
    } else {
      favorites.forEach(movieId => {
        const movie = movies.find(m => m.id === movieId);
        const li = document.createElement("li");
        li.textContent = movie ? movie.title : "Onbekende film";
        favList.appendChild(li);
      });
    }
  });

  // Reviews ophalen en tonen
  getUserReviews(user.uid).then(reviews => {
    revList.innerHTML = "";
    if (!reviews || Object.keys(reviews).length === 0) {
      revList.innerHTML = "<li>Je hebt nog geen reviews geschreven.</li>";
    } else {
      Object.entries(reviews).forEach(([movieId, review]) => {
        const movie = movies.find(m => m.id === movieId);
        const li = document.createElement("li");
        li.innerHTML = `<b>${movie ? movie.title : "Onbekende film"}:</b> ${review}`;
        revList.appendChild(li);
      });
    }
  });
}

// Auth check en profiel renderen
onAuthStateChanged(getAuth(app), user => {
  if (user) {
    renderProfile(user, movies);
  } else {
    // Niet ingelogd, stuur naar login
    window.location.href = "/views/login.html";
  }
});


// === PROFIEL FOTO UPLOAD ===
const avatarInput = document.getElementById("profilePicInput");
const avatarImg = document.getElementById("profilePic");
avatarInput?.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const user = auth.currentUser;
  if (!user) return alert("Niet ingelogd!");

  // Upload naar Firebase Storage
  const storageRef = ref(storage, `profilePics/${user.uid}/avatar.jpg`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  // Update Auth profiel (photoURL)
  await updateProfile(user, { photoURL: url });

  // Update ook je Firestore profiel data als je daar een photoURL veld wilt gebruiken:
  const userRef = doc(db, "users", user.uid);
  await updateDoc(userRef, { photoURL: url });

  // Toon direct op pagina
  avatarImg.src = url;
});

// === NAAM WIJZIGEN ===
const saveBtn = document.querySelector(".save-profile");
const nameEl = document.getElementById("profileNaam");
saveBtn?.addEventListener("click", async (e) => {
  e.preventDefault();
  const user = auth.currentUser;
  if (!user) return;
  const newName = nameEl.value.trim();
  if (newName && newName !== user.displayName) {
    await updateProfile(user, { displayName: newName });
    // Ook in Firestore bijwerken
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { username: newName });
    alert("Naam bijgewerkt!");
  }
});

// === EMAIL VERIFICATIE ===
document.addEventListener("click", function(e) {
  if (e.target && e.target.id === "resendVerification") {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      sendEmailVerification(user).then(() => {
        alert("Verificatie-email verstuurd!");
      });
    }

  }

});