import { getUserFavorites } from "./favorites.js";
import { getUserReviews } from "./reviews.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

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
const auth = getAuth();
onAuthStateChanged(auth, user => {
  if (user) {
    renderProfile(user, movies);
  } else {
    // Niet ingelogd, stuur naar login
    window.location.href = "/views/login.html";
  }
});