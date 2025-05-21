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
  setupSearch();
  initHomepage();
}

main();

async function initHomepage() {
  const trendingMovies = await fetchTrendingMovies();
  renderCarousel(trendingMovies); // Jouw bestaande functie

  const trendingSeries = await fetchTrendingSeries();
  renderSection(trendingSeries, 'Trending Series', '#trending-series');

  const airingToday = await fetchAiringToday();
  renderSection(airingToday, 'Airing Today', '#airing-today');

  const upcomingMovies = await fetchUpcomingMovies();
  renderSection(upcomingMovies, 'Upcoming Movies', '#upcoming-movies');
}

function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');

  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', async () => {
      const query = searchInput.value.trim();
      if (query) {
        const results = await searchMovies(query);
        renderCarousel(results);
      }
    });

    searchInput.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
          const results = await searchMovies(query);
          renderCarousel(results);
        }
      }
    });
  }
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