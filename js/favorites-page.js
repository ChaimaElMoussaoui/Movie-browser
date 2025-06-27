import { auth } from '../auth/firebase-auth.js';
import { getUserFavorites, removeUserFavorite } from './favorites.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNGYzYzVkNWIzY2UxMmVlMmQxYTlhMzMzOTIyOGI2MSIsIm5iZiI6MTc0NzY1MjU5Ni4zNjcsInN1YiI6IjY4MmIwZmY0MmQ4NDFkNmE2MTJmNzQ0YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.QtKOTI1A4IpFhGSu43xvDN7crsp4Wu6pNQkxfankrcc';
const BASE_URL = 'https://api.themoviedb.org/3';
const headers = {
  accept: 'application/json',
  Authorization: `Bearer ${API_KEY}`
};

// Wacht tot gebruiker is ingelogd en laad dan favorieten
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("Ingelogd als:", user.email);
    updateNavbar(user);
    await loadFavorites(user.uid);
  } else {
    // Niet ingelogd - doorsturen naar login
    alert('Je moet ingelogd zijn om je favorieten te bekijken!');
    window.location.href = '/views/login.html';
  }
});

// Update navbar like in main.js
function updateNavbar(user) {
  const profileArea = document.getElementById('profileArea');
  const loginLink = document.getElementById('login-link');
  
  if (user) {
    if (profileArea) {
      profileArea.innerHTML = `
        <a href="/views/profile.html">
          <img src="${user.photoURL || '/assets/default.png'}" alt="Profile" class="profile-pic">
        </a>
      `;
    }
    if (loginLink) loginLink.style.display = "none";
    //login link gaat weg als je bent ingelogd daarna zie je pf icon
  } else {
    // als je niet bent ingelogd dan zie je de login link en niks anders 
    if (profileArea) profileArea.innerHTML = "";
    if (loginLink) loginLink.style.display = "";
  }
}

// Laad favorieten van de gebruiker
async function loadFavorites(userId) {
  const loadingMessage = document.getElementById('loading-message');// Laad bericht
  const favoritesContainer = document.getElementById('favorites-container');// Container voor favorieten
  const noFavoritesMessage = document.getElementById('no-favorites');// Bericht als er geen favorieten zijn
  
  try {
    // probeer favo op te halen.
    const favorites = await getUserFavorites(userId); //haal favo op van database
    
    //geen favo dan krijgt berichten
    if (favorites.length === 0) {
      loadingMessage.style.display = 'none';
      noFavoritesMessage.style.display = 'block';
      return;
    }
    
    // Als er wel favo zijn 
    renderFavorites(favorites); //roep functie om favo op pagina te ztten
    loadingMessage.style.display = 'none';
    favoritesContainer.style.display = 'grid'; // favo tonen in grid layout
    
    //als er fout is en error toont
  } catch (error) {
    console.error('Fout bij laden favorieten:', error);
    loadingMessage.textContent = 'Fout bij laden van favorieten.';
  }
}

//toon favo lijst in pagina
function renderFavorites(favorites) {
  const container = document.getElementById('favorites-container'); //haaalt containter op waar favo in moeten
  
  container.innerHTML = favorites.map(favorite => `
    <div class="favorite-item" data-id="${favorite.id}">
      <img src="https://image.tmdb.org/t/p/w300${favorite.poster_path}" alt="${favorite.title}" />
      <div class="favorite-info">
        <h3>${favorite.title}</h3>
        <p>Toegevoegd: ${new Date(favorite.addedAt).toLocaleDateString('nl-NL')}</p>
        <div class="favorite-actions">
          <a href="/views/detail.html?id=${favorite.id}" class="details-btn">Details</a>
          <button class="remove-btn" data-movie-id="${favorite.id}">
            <span class="material-icons">delete</span>
            Verwijderen
          </button>
        </div>
      </div>
    </div>
  `).join('');
  //maaakt html van elk favo en zet in container
  
  // Add event listeners for remove buttons
  container.querySelectorAll('.remove-btn').forEach(button => {
    button.addEventListener('click', async (e) => {
      //als op verwijder wordt geklikt
      const movieId = parseInt(e.target.closest('.remove-btn').dataset.movieId);//haal id van film op
      
      if (confirm('Weet je zeker dat je deze film uit je favorieten wilt verwijderen?')) {
        // Bevestig verwijderen
        try {
          await removeUserFavorite(movieId);// verwijder favo uit database
          await loadFavorites(auth.currentUser.uid);// Herlaad favo
        } catch (error) {
          //als er fout is
          console.error('Fout bij verwijderen favoriet:', error);
          alert('Er ging iets fout bij het verwijderen van de favoriet.');
        }
      }
    });
  });
}