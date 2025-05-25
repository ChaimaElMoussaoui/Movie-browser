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
        ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
        : (item.profile_path ? `https://image.tmdb.org/t/p/w200${item.profile_path}` : "/assets/moview.png");
      return `
        <div class="result-card">
          <img src="${img}" alt="${title}" />
          <h3>${title}</h3>
          <p>Type: ${type}</p>
        </div>
      `;
    }).join("");
  } catch (err) {
    searchResultsSection.innerHTML = "<p>Fout bij het ophalen van resultaten.</p>";
    console.error(err);
  }
}

showSearchResults();