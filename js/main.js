import { renderCarousel, renderSection } from './ui.js';
import {
  fetchTrendingMovies,
  fetchTrendingSeries,
  fetchAiringToday,
  fetchUpcomingMovies
} from './api.js';

// Firebase imports voor authentication
import { auth } from '../auth/firebase-auth.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

// Start de app meteen - films laden zonder te wachten op authentication
async function main() {
  try {
    console.log('Loading homepage content...');
    
    const trendingMovies = await fetchTrendingMovies();
    console.log('Trending movies loaded:', trendingMovies);
    renderCarousel(trendingMovies);
    setupCarousel(); 
    
    await initHomepage();
    console.log('Homepage loaded successfully');
  } catch (error) {
    console.error('Error loading homepage:', error);
  }
}

// Start de app meteen
main();

// Authentication handler - draait parallel met de app
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Gebruiker is ingelogd
    console.log("Ingelogd als:", user.email);
    updateNavbar(user);
  } else {
    // Niet ingelogd - update navbar maar laat homepage werken
    updateNavbar(null);
    
    // Alleen doorsturen naar login als we op een beveiligde pagina zijn
    const currentPage = window.location.pathname;
    if (currentPage.includes('/profile.html') || currentPage.includes('/favorites.html')) {
      window.location.href = "/views/login.html";
    }
  }
});

// Functie om de navigatie bij te werken gebaseerd op inlog status
function updateNavbar(user) {
  const profileArea = document.getElementById('profileArea');
  const loginLink = document.getElementById('login-link');
  
  if (user) {
    // Gebruiker is ingelogd - toon simpele profiel icoon
    if (profileArea) {
      profileArea.innerHTML = `
        <a href="/views/profile.html">
          <img src="${user.photoURL || '/assets/default.png'}" alt="Profile" class="profile-pic">
        </a>
      `;
    }
    if (loginLink) loginLink.style.display = "none";
  } else {
    // Gebruiker is niet ingelogd - toon login link
    if (profileArea) profileArea.innerHTML = "";
    if (loginLink) loginLink.style.display = "";
  }
}

async function initHomepage() {
  const trendingSeries = await fetchTrendingSeries();
  renderSection(trendingSeries, 'Trending Series', '#trending-series');

  const airingToday = await fetchAiringToday();
  renderSection(airingToday, 'Airing Today', '#airing-today');

  const upcomingMovies = await fetchUpcomingMovies();
  renderSection(upcomingMovies, 'Upcoming Movies', '#upcoming-movies');
}


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

function setupCarousel() {
  const carousel = document.querySelector('.carousel');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const scrollAmount = 220;

  if (!carousel || !nextBtn || !prevBtn) {
    console.error("Carousel elements not found");
    return;
  }

  nextBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  prevBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });
}

document.addEventListener("DOMContentLoaded", () => {
    const darkModeButton = document.getElementById("toggle-dark");
    const darkModeIcon = document.getElementById("dark-mode-icon");
    let isDarkMode = true;

    darkModeButton.addEventListener("click", () => {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle("light-mode", !isDarkMode);

        if (isDarkMode) {
            darkModeIcon.textContent = "dark_mode"; 
        } else {
            darkModeIcon.textContent = "light_mode";
        }
    });
});
