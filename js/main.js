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


// --- Navbar login/profiel
const auth = getAuth();
function updateNavbar(user) {
  const profileArea = document.getElementById('profileArea');
  const logoutLink = document.getElementById('logout-link');
  if (user) {
    if (profileArea) profileArea.innerHTML = `<span class="material-icons">account_circle</span>`;
    if (logoutLink) logoutLink.style.display = "";
  } else {
    if (profileArea) profileArea.innerHTML = "";
    if (logoutLink) logoutLink.style.display = "none";
  }
}
onAuthStateChanged(auth, user => { updateNavbar(user); });

const logoutLink = document.getElementById('logout-link');
if (logoutLink) {
  logoutLink.addEventListener('click', async (e) => {
    e.preventDefault();
    await signOut(auth);
    window.location.href = "/views/index.html";
  });
}

// Zoek functionaliteit
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("searchInput");

if (searchForm && searchInput) {
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      window.location.href = `/views/search.html?q=${encodeURIComponent(query)}`;
    }
  });
}

// Carousel functionaliteit
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






// Dark mode toggle
const toggleDark = document.getElementById("toggle-dark");
const darkModeIcon = document.getElementById("dark-mode-icon");

function setDarkMode(active) {
  document.body.classList.toggle("dark-mode", active);
  if (darkModeIcon) darkModeIcon.textContent = active ? "light_mode" : "dark_mode";
  localStorage.setItem("darkMode", active ? "1" : "0");
}
const darkPref = localStorage.getItem("darkMode");
if (darkPref === "1") setDarkMode(true);

if (toggleDark) {
  toggleDark.addEventListener("click", () => {
    const isActive = document.body.classList.contains("dark-mode");
    setDarkMode(!isActive);
  });
}

