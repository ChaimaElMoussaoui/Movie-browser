import { fetchMovieDetails, fetchSeriesDetails, fetchMovieReviews } from './api.js';
import { addUserFavorite, removeUserFavorite, isMovieFavorite } from './favorites.js';
import { auth } from '../auth/firebase-auth.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNGYzYzVkNWIzY2UxMmVlMmQxYTlhMzMzOTIyOGI2MSIsIm5iZiI6MTc0NzY1MjU5Ni4zNjcsInN1YiI6IjY4MmIwZmY0MmQ4NDFkNmE2MTJmNzQ0YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.QtKOTI1A4IpFhGSu43xvDN7crsp4Wu6pNQkxfankrcc';
const BASE_URL = 'https://api.themoviedb.org/3';
const headers = {
  accept: 'application/json',
  Authorization: `Bearer ${API_KEY}`
};

const urlParams = new URLSearchParams(window.location.search);
const contentId = urlParams.get('id');
const contentType = urlParams.get('type') || 'movie'; // Default to movie if no type specified
let currentContent = null;

// Auth state management
onAuthStateChanged(auth, (user) => {
  updateNavbar(user);
  if (currentContent) {
    updateFavoriteButton(currentContent);
  }
});

// Update navbar
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

// Search form functionality
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('searchInput');

if (searchForm) {
  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;
    window.location.href = `/views/search.html?q=${encodeURIComponent(query)}`;
  });
}

// Dark mode toggle
document.addEventListener("DOMContentLoaded", () => {
  const darkModeButton = document.getElementById("toggle-dark");
  const darkModeIcon = document.getElementById("dark-mode-icon");
  let isDarkMode = true;

  if (darkModeButton) {
    darkModeButton.addEventListener("click", () => {
      isDarkMode = !isDarkMode;
      document.body.classList.toggle("light-mode", !isDarkMode);

      if (isDarkMode) {
        darkModeIcon.textContent = "dark_mode"; 
      } else {
        darkModeIcon.textContent = "light_mode";
      }
    });
  }
});

if (contentId) {
  showDetails(contentId, contentType);
} else {
  console.error('No content ID found in URL');
  document.getElementById('details-hero').innerHTML = `
    <div class="error-message">
      <h2>No Content Found</h2>
      <p>No movie or TV show ID was provided. Please go back and select a movie or TV show.</p>
      <button onclick="window.location.href='/views/index.html'" class="back-btn">Go to Homepage</button>
    </div>
  `;
}

async function showDetails(id, type = 'movie') {
  try {
    let content;
    
    // Fetch details based on content type  
    if (type === 'tv') {
      content = await fetchSeriesDetails(id);
    } else {
      content = await fetchMovieDetails(id);
    }
    
    if (!content || !content.id) {
      throw new Error('No content found with ID: ' + id);
    }
    
    currentContent = content;
    
    const cast = await fetchCast(id, type);
    const trailerKey = await fetchTrailerKey(id, type);

    // Determine title and date fields based on content type
    const title = content.title || content.name;
    const releaseDate = content.release_date || content.first_air_date;
    const runtime = type === 'tv' 
      ? `${content.number_of_seasons} seizoen${content.number_of_seasons !== 1 ? 's' : ''}, ${content.number_of_episodes} afleveringen` 
      : content.runtime ? `${Math.floor(content.runtime/60)}h ${content.runtime%60}m` : 'Onbekend';

    document.getElementById('details-hero').innerHTML = `
      <div class="hero-container">
        <div class="poster-col">
          <img src="https://image.tmdb.org/t/p/w400${content.poster_path}" alt="${title}" class="hero-poster"/>
          <div class="rating-block">
            <span class="star">⭐</span> ${content.vote_average.toFixed(1)} <span class="votes">(${content.vote_count})</span>
          </div>
          <div class="info-block">
            <div>Age: ${content.adult ? '18+' : 'PG'}</div>
            <div>${type === 'tv' ? 'Seasons/Episodes' : 'Runtime'}: ${runtime}</div>
            ${type === 'tv' && content.status ? `<div>Status: ${content.status}</div>` : ''}
          </div>
          <div class="genres-block">
            ${content.genres ? content.genres.map(g => `<span class="genre">${g.name}</span>`).join('') : ''}
          </div>
        </div>
        <div class="info-col">
          <h1>${title}</h1>
          <div class="year">${releaseDate ? new Date(releaseDate).getFullYear() : 'Onbekend'}</div>
          <div class="overview">${content.overview || 'Geen beschrijving beschikbaar.'}</div>
          <div class="movie-actions">
            <button id="favoriteBtn" class="favorite-btn-detail" data-content-id="${content.id}" data-content-type="${type}">
              <span class="material-icons">favorite_border</span>
              <span class="btn-text">Toevoegen aan favorieten</span>
            </button>
          </div>
        </div>
      </div>
    `;

    // Update favorite button based on current state
    updateFavoriteButton(content);
    
    // Setup favorite button functionality
    setupFavoriteButton();
    
    // Setup trailer section
    const trailerSection = document.getElementById('trailer-section');
  if (trailerKey) {
    trailerSection.innerHTML = `
      <h2>Trailer</h2>
      <div class="trailer-block">
        <iframe width="100%" height="400" src="https://www.youtube.com/embed/${trailerKey}" frameborder="0" allowfullscreen></iframe>
      </div>
    `;
  } else {
    trailerSection.innerHTML = `<h2>Trailer</h2><p>Geen trailer beschikbaar.</p>`;
  }

  // Setup cast section
  document.getElementById('cast-section').innerHTML = `
    <h2>Cast</h2>
    <div class="cast-carousel-wrapper">
      <div class="cast-carousel" id="cast-carousel">
        ${cast.map(actor => `
          <div class="cast-card">
            <img src="${actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : '/assets/default.png'}" alt="${actor.name}" />
            <span class="actor-name">${actor.name}</span>
            <span class="character">${actor.character || ''}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  setupCastCarousel();
  
  // Show reviews
  showReviews(id, type);
  
  } catch (error) {
    console.error('Error loading details:', error);
    const heroContainer = document.getElementById('details-hero');
    if (heroContainer) {
      heroContainer.innerHTML = `
        <div class="error-message">
          <h2>Error loading content</h2>
          <p>Unable to load details for this ${type === 'tv' ? 'TV show' : 'movie'}. Please try again later.</p>
          <button onclick="window.history.back()" class="back-btn">Go Back</button>
        </div>
      `;
    }
  }
}



async function fetchTrailerKey(contentId, type = 'movie') {
  const endpoint = type === 'tv' ? 'tv' : 'movie';
  const res = await fetch(`${BASE_URL}/${endpoint}/${contentId}/videos`, { headers });
  const data = await res.json();
  const trailer = data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  return trailer ? trailer.key : null;
}

async function fetchCast(contentId, type = 'movie') {
  const endpoint = type === 'tv' ? 'tv' : 'movie';
  const res = await fetch(`${BASE_URL}/${endpoint}/${contentId}/credits`, { headers });
  const data = await res.json();
  return data.cast.slice(0, 15);
}

function setupCastCarousel() {
  const carousel = document.getElementById('cast-carousel');
  if (!carousel) return;
  
  // Optional: Add scroll buttons if they exist
  const leftBtn = document.querySelector('.carousel-btn.left');
  const rightBtn = document.querySelector('.carousel-btn.right');
  
  if (leftBtn && rightBtn) {
    rightBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: 320, behavior: 'smooth' });
    });
    leftBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: -320, behavior: 'smooth' });
    });
  }
}

// Back button functionality
document.addEventListener('DOMContentLoaded', () => {
  const backButton = document.getElementById('backButton');
  if (backButton) {
    backButton.addEventListener('click', () => {
      window.history.back();
    });
  }
});

async function showReviews(contentId, type = 'movie') {
  // Only movies have reviews in TMDB API, TV shows don't have a reviews endpoint
  if (type === 'tv') {
    const reviewsDiv = document.getElementById('reviews-section');
    reviewsDiv.innerHTML = "<h2>Reviews</h2><p>Reviews zijn niet beschikbaar voor TV-series.</p>";
    return;
  }
  
  const reviews = await fetchMovieReviews(contentId);
  const reviewsDiv = document.getElementById('reviews-section');
  
  if (reviews.length === 0) {
    reviewsDiv.innerHTML = "<h2>Reviews</h2><p>Geen reviews gevonden.</p>";
    return;
  }
  
  reviewsDiv.innerHTML = `
    <h2>Reviews</h2>
    ${reviews.slice(0, 3).map(r => `
      <div class="review">
        <strong>${r.author}</strong><br/>
        <span class="review-content">${r.content.slice(0, 400)}${r.content.length > 400 ? "..." : ""}</span>
      </div>
    `).join('')}
  `;
}





//update favo btn gebaseerd op gebruikers favos
async function updateFavoriteButton(content) {
  const favoriteBtn = document.getElementById('favoriteBtn');
  if (!favoriteBtn || !auth.currentUser) return;
  
  try {
    const isFavorite = await isMovieFavorite(parseInt(content.id));
    const icon = favoriteBtn.querySelector('.material-icons');
    const text = favoriteBtn.querySelector('.btn-text');
    
    if (isFavorite) {
      icon.textContent = 'favorite';
      text.textContent = 'Verwijderen uit favorieten';
      favoriteBtn.classList.add('is-favorite');
    } else {
      icon.textContent = 'favorite_border';
      text.textContent = 'Toevoegen aan favorieten';
      favoriteBtn.classList.remove('is-favorite');
    }
  } catch (error) {
    console.error('Error updating favorite button:', error);
  }
}

// Instellen van favo knop functionaliteit
function setupFavoriteButton() {
  const favoriteBtn = document.getElementById('favoriteBtn');
  if (!favoriteBtn) return;
  
  favoriteBtn.addEventListener('click', async () => {
    // Controleer of gebruiker ingelogd is
    if (!auth.currentUser) {
      alert('Je moet ingelogd zijn om favorieten toe te voegen!');
      window.location.href = '/views/login.html';
      return;
    }
    
    // Controleer of er content data beschikbaar is
    if (!currentContent) return;
    
    try {
      const contentId = parseInt(currentContent.id);
      const isFavorite = await isMovieFavorite(contentId);
      
      // Als het al een favo is, verwijder het
      if (isFavorite) {
        await removeUserFavorite(contentId);
      } else {
        // Anders voeg toe aan favo met film info
        const contentData = {
          title: currentContent.title || currentContent.name,
          poster_path: currentContent.poster_path
        };
        await addUserFavorite(contentId, contentData);
      }
      
      // Werk de knop weergave bij
      updateFavoriteButton(currentContent);
      
    } catch (error) {
      console.error('Fout bij het wijzigen van favoriet:', error);
      alert('Er ging iets fout bij het bijwerken van je favorieten.');
    }
  });
}