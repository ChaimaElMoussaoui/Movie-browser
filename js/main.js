import { renderCarousel, renderSection } from './ui.js';
import {
  fetchTrendingMovies,
  fetchTrendingSeries,
  fetchAiringToday,
  fetchUpcomingMovies
} from './api.js';





async function main() {
  const trendingMovies = await fetchTrendingMovies();
  renderCarousel(trendingMovies);
  setupCarousel(); 
  initHomepage();
}

main();

async function initHomepage() {
  const trendingMovies = await fetchTrendingMovies();
  renderCarousel(trendingMovies);

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
  const nextBtn = document.querySelector('.next');
  const prevBtn = document.querySelector('.prev');
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


import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

const auth = getAuth();

function updateNavbar(user) {
  const profileArea = document.getElementById('profileArea');
  const logoutLink = document.getElementById('logout-link');
  
  if (user) {
    // Toon profielicoon/link
    if (profileArea) {
      profileArea.innerHTML = `<span class="material-icons">account_circle</span>`;
    }
    if (logoutLink) logoutLink.style.display = "";
  } else {
    if (profileArea) profileArea.innerHTML = "";
    if (logoutLink) logoutLink.style.display = "none";
  }
}

// Auth-status checken en updates in navbar
onAuthStateChanged(auth, user => {
  updateNavbar(user);
});

// Logout werkt direct
const logoutLink = document.getElementById('logout-link');
if (logoutLink) {
  logoutLink.addEventListener('click', async (e) => {
    e.preventDefault();
    await signOut(auth);
    window.location.href = "/views/index.html";
  });
}