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
      
      // Only make movie and TV show cards clickable, not person cards
      const isClickable = type === 'movie' || type === 'tv';
      const clickableClass = isClickable ? 'clickable' : '';
      const dataAttributes = isClickable ? `data-id="${item.id}" data-type="${type}"` : '';
      
      return `
        <div class="movie-card ${clickableClass}" ${dataAttributes}>
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
    
    // Add click event listeners to clickable cards
    document.querySelectorAll('.movie-card.clickable').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        const type = card.getAttribute('data-type');
        window.location.href = `detail.html?id=${id}&type=${type}`;
      });
    });
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