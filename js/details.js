import { fetchMovieDetails} from './api.js';

const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNGYzYzVkNWIzY2UxMmVlMmQxYTlhMzMzOTIyOGI2MSIsIm5iZiI6MTc0NzY1MjU5Ni4zNjcsInN1YiI6IjY4MmIwZmY0MmQ4NDFkNmE2MTJmNzQ0YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.QtKOTI1A4IpFhGSu43xvDN7crsp4Wu6pNQkxfankrcc';
const BASE_URL = 'https://api.themoviedb.org/3';
const headers = {
  accept: 'application/json',
  Authorization: `Bearer ${API_KEY}`
};

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

if (movieId) {
  showDetails(movieId);
}

async function showDetails(id) {

  const movie = await fetchMovieDetails(id);


  const cast = await fetchCast(id);


  const trailerKey = await fetchTrailerKey(id);

 document.getElementById('details-hero').innerHTML = `
    <div class="hero-container">
      <div class="poster-col">
        <img src="https://image.tmdb.org/t/p/w400${movie.poster_path}" alt="${movie.title}" class="hero-poster"/>
        <div class="rating-block">
          <span class="star">⭐</span> ${movie.vote_average} <span class="votes">(${movie.vote_count})</span>
        </div>
        <div class="info-block">
          <div>Age: ${movie.adult ? '18+' : 'PG'}</div>
          <div>Runtime: ${Math.floor(movie.runtime/60)}h ${movie.runtime%60}m</div>
        </div>
        <div class="genres-block">
          ${movie.genres.map(g => `<span class="genre">${g.name}</span>`).join('')}
        </div>
      </div>
      <div class="info-col">
        <h1>${movie.title}</h1>
        <div class="year">${movie.release_date}</div>
        <div class="overview">${movie.overview}</div>
        <div id="trailer-section"></div>
        <div id="reviews-section"></div>
      </div>
    </div>
  `;


  const trailerSection = document.getElementById('trailer-section');
  
  if (movie.videos && movie.videos.results && movie.videos.results.length > 0) {
    const trailerKey = movie.videos.results[0].key;
    trailerSection.innerHTML = `
      <h2>Trailer</h2>
      <div class="trailer-block">
        <iframe width="100%" height="400" src="https://www.youtube.com/embed/${trailerKey}" frameborder="0" allowfullscreen></iframe>
      </div>
    `;
  } else {
    trailerSection.innerHTML = `<h2>Trailer</h2><p>No trailer available.</p>`;
  }

  
async function fetchTrailerKey(movieId) {
  const res = await fetch(`${BASE_URL}/movie/${movieId}/videos`, { headers });
  const data = await res.json();
  const trailer = data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  return trailer ? trailer.key : null;
}


document.getElementById('backButton').addEventListener('click', () => {
  window.history.back();
});

  document.getElementById('cast-section').innerHTML = `
    <h2>Cast</h2>
    <div class="cast-carousel-wrapper">

      <div class="cast-carousel" id="cast-carousel">
        ${cast.map(actor => `
          <div class="cast-card">
            <img src="${actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : '/img/user.png'}" alt="${actor.name}" />
            <span class="actor-name">${actor.name}</span>
            <span class="character">${actor.character || ''}</span>
          </div>
        `).join('')}
      </div>
      
    </div>
  `;

  setupCastCarousel();


  document.getElementById('trailer-section').innerHTML = trailerKey
    ? `
      <div class="trailer-block">
        <iframe width="100%" height="360" src="https://www.youtube.com/embed/${trailerKey}" 
          frameborder="0" allowfullscreen></iframe>
      </div>`
    : '';
}


async function fetchCast(movieId) {
  const res = await fetch(`${BASE_URL}/movie/${movieId}/credits`, { headers });
  const data = await res.json();
 
  return data.cast.slice(0, 15);
}

function setupCastCarousel() {
  const carousel = document.getElementById('cast-carousel');
  const leftBtn = document.querySelector('.carousel-btn.left');
  const rightBtn = document.querySelector('.carousel-btn.right');
  if (!carousel || !leftBtn || !rightBtn) return;
  rightBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: 320, behavior: 'smooth' });
  });
  leftBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: -320, behavior: 'smooth' });
  });
}

import { fetchMovieReviews } from './api.js';

async function showReviews(movieId) {
  const reviews = await fetchMovieReviews(movieId);
  const reviewsDiv = document.getElementById('reviews-section');
  if (reviews.length === 0) {
    reviewsDiv.innerHTML = "<p>Geen reviews gevonden.</p>";
    return;
  }
  reviewsDiv.innerHTML = reviews.map(r => `
    <div class="review">
      <strong>${r.author}</strong><br/>
      <span class="review-content">${r.content.slice(0, 350)}${r.content.length > 350 ? "..." : ""}</span>
    </div>
  `).join('');
}


showReviews(movieId);