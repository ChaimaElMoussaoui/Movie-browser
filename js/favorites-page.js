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
  } else {
    if (profileArea) profileArea.innerHTML = "";
    if (loginLink) loginLink.style.display = "";
  }
}

async function loadFavorites(userId) {
  const loadingMessage = document.getElementById('loading-message');
  const favoritesContainer = document.getElementById('favorites-container');
  const noFavoritesMessage = document.getElementById('no-favorites');
  
  try {
    // Haal favorieten op (nu als objecten met meer info)
    const favorites = await getUserFavorites(userId);
    
    if (favorites.length === 0) {
      loadingMessage.style.display = 'none';
      noFavoritesMessage.style.display = 'block';
      return;
    }
    
    // Render favorieten
    renderFavorites(favorites);
    loadingMessage.style.display = 'none';
    favoritesContainer.style.display = 'grid';
    
  } catch (error) {
    console.error('Fout bij laden favorieten:', error);
    loadingMessage.textContent = 'Fout bij laden van favorieten.';
  }
}

function renderFavorites(favorites) {
  const container = document.getElementById('favorites-container');
  
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
  
  // Add event listeners for remove buttons
  container.querySelectorAll('.remove-btn').forEach(button => {
    button.addEventListener('click', async (e) => {
      const movieId = parseInt(e.target.closest('.remove-btn').dataset.movieId);
      
      if (confirm('Weet je zeker dat je deze film uit je favorieten wilt verwijderen?')) {
        try {
          await removeUserFavorite(movieId);
          // Reload favorites
          await loadFavorites(auth.currentUser.uid);
        } catch (error) {
          console.error('Fout bij verwijderen favoriet:', error);
          alert('Er ging iets fout bij het verwijderen van de favoriet.');
        }
      }
    });
  });
}