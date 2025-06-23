import { renderCarousel, renderSection } from './ui.js';
import {
  fetchTrendingMovies,
  fetchTrendingSeries,
  fetchAiringToday,
  fetchUpcomingMovies
} from './api.js';

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
const auth = getAuth();


onAuthStateChanged(auth, (user) => {
  if (user) {
    // Gebruiker is ingelogd
    // Je kunt hier favorieten ophalen of de UI aanpassen
    console.log("Ingelogd als:", user.email);
  } else {
    // Niet ingelogd: doorsturen naar login of andere actie
    window.location.href = "/views/login.html";
  }
});






function setLightMode(enabled) {
  const body = document.body;
  const icon = document.getElementById("dark-mode-icon");
  if (enabled) {
    body.classList.add("light-mode");
    if (icon) icon.textContent = "light_mode";
    localStorage.setItem("lightMode", "true");
  } else {
    body.classList.remove("light-mode");
    if (icon) icon.textContent = "dark_mode";
    localStorage.setItem("lightMode", "false");
  }
}

function initDarkModeToggle() {
  const darkBtn = document.getElementById("toggle-dark");

  // Set initial state from localStorage
  if (localStorage.getItem("lightMode") === "true") {
    setLightMode(true);
  } else {
    setLightMode(false);
  }

  // Add event listener if button exists
  if (darkBtn) {
    darkBtn.addEventListener("click", () => {
      const enabled = !document.body.classList.contains("light-mode");
      setLightMode(enabled);
    });
  }
}

// Zorg dat dit wordt uitgevoerd na DOM load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDarkModeToggle);
} else {
  initDarkModeToggle();
}

// --------- HOME PAGE FUNCTIONALITEIT ---------
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
    // Carousel elements not found, do nothing
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