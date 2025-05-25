
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
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;
  carousel.innerHTML = movies.map(movie => `
    <div class="carousel-item" data-id="${movie.id}">
      <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}" />
      <div class="carousel-title">${movie.title}</div>
    </div>
  `).join('');

  // Voeg click events toe
  carousel.querySelectorAll('.carousel-item').forEach(item => {
    item.addEventListener('click', () => {
      const id = item.getAttribute('data-id');
      window.location.href = `detail.html?id=${id}`;
    });
  });
}


export function renderSection(items, title, containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) {
    console.error(`Container ${containerSelector} niet gevonden`);
    return;
  }

  container.innerHTML = `
    <h2>${title}</h2>
    <div class="section-grid">
      ${items.map(item => `
        <div class="section-item">
          <img src="https://image.tmdb.org/t/p/w300${item.poster_path}" alt="${item.name || item.title}" />
          <h4>${item.name || item.title}</h4>
        </div>
      `).join('')}
    </div>
  `;
}
