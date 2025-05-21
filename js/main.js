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

    // Optioneel: zoeken bij "Enter"
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

        if (isDarkMode) {
            document.documentElement.style.setProperty("--bg-color", "var(--bg-color-dark)");
            document.documentElement.style.setProperty("--text-color", "var(--text-color-dark)");
            document.documentElement.style.setProperty("--primary-color", "var(--primary-color-dark)");
            darkModeIcon.textContent = "dark_mode"; // Maan icoon
        } else {
            document.documentElement.style.setProperty("--bg-color", "var(--bg-color-light)");
            document.documentElement.style.setProperty("--text-color", "var(--text-color-light)");
            document.documentElement.style.setProperty("--primary-color", "var(--primary-color-light)");
            darkModeIcon.textContent = "light_mode"; // Zon icoon
        }
    });
});
