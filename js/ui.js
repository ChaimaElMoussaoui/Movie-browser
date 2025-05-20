export function renderMovies(movies) {
    const container = document.querySelector('#movie-container');
    container.innerHTML = '';

    if (!Array.isArray(movies) || movies.length === 0) {
        container.innerHTML = '<p>Geen films gevonden of er is een fout opgetreden.</p>';
        return;
    }

    movies.forEach(movie => {
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie-card');
        movieEl.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>${movie.overview.substring(0, 100)}...</p>
        `;
        container.appendChild(movieEl);
    });
}

export function renderCarousel(movies) {
  const carousel = document.getElementById('carousel');
  carousel.innerHTML = '';

  movies.forEach(movie => {
    const card = document.createElement('div');
    card.classList.add('carousel-card');

    card.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
      <div class="info">
        <strong>${movie.title}</strong><br/>
        ⭐ ${movie.vote_average.toFixed(1)}
      </div>
    `;

    carousel.appendChild(card);
  });
}
