import { fetchMultiSearch } from './api.js';

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name) || "";
}

const searchResultsSection = document.getElementById('search-results');
const query = getQueryParam('q');

async function showSearchResults() {
  if (!query) {
    searchResultsSection.innerHTML = "<p>Geen zoekterm opgegeven.</p>";
    return;
  }
  searchResultsSection.innerHTML = "<p>Zoeken...</p>";
  try {
    const results = await fetchMultiSearch(query);
    if (!results || results.length === 0) {
      searchResultsSection.innerHTML = "<p>Geen resultaten gevonden.</p>";
      return;
    }
    searchResultsSection.innerHTML = results.map(item => {
      const title = item.title || item.name || "Onbekend";
      const type = item.media_type || "onbekend";
      const img = item.poster_path
        ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
        : (item.profile_path ? `https://image.tmdb.org/t/p/w300${item.profile_path}` : "/assets/moview.png");
      const year = (item.release_date || item.first_air_date || '').slice(0, 4) || '';
      const rating = item.vote_average ? item.vote_average.toFixed(1) : '';
      return `
        <div class="movie-card">
          <span class="movie-label">${type.charAt(0).toUpperCase() + type.slice(1)}</span>
          <img src="${img}" alt="${title}" />
          <h3>${title}</h3>
          <div class="movie-meta">
            ${rating ? `<span class="star">&#11088;</span> ${rating}` : ''}
            ${year ? `<span class="year">${year}</span>` : ''}
          </div>
        </div>
      `;
    }).join("");
  } catch (err) {
    searchResultsSection.innerHTML = "<p>Fout bij het ophalen van resultaten.</p>";
    console.error(err);
  }
}

showSearchResults();

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('searchInput');

if (searchForm) {
  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (!query) {
      searchResultsSection.innerHTML = '<p style="color:#ffdd57;font-weight:700;">Voer een zoekterm in</p>';
      return;
    }
    window.location.href = `/views/search.html?q=${encodeURIComponent(query)}`;
  });
}


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