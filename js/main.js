import { fetchTrendingMovies } from './api.js';
import { renderCarousel } from './ui.js';

async function main() {
  const trendingMovies = await fetchTrendingMovies();
  renderCarousel(trendingMovies);
  setupCarousel(); 
}

main();

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

