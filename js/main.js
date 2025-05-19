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


import { fetchPopularMovies } from './api.js';
import { renderMovies } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    fetchPopularMovies().then(movies => {
        renderMovies(movies);
    });
});
