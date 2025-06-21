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

const darkBtn = document.getElementById("toggle-dark");
const icon = document.getElementById("dark-mode-icon");
const body = document.body;

function setLightMode(enabled) {
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

if (darkBtn) {
  darkBtn.addEventListener("click", () => {
    const enabled = !body.classList.contains("light-mode");
    setLightMode(enabled);
  });
}

// Bij laden: lightmode uit localStorage toepassen
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("lightMode") === "true") {
    setLightMode(true);
  }
});