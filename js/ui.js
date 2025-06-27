
// UI functions for rendering movies and sections - NO favorite buttons on homepage

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
        const isMovie = movie.title !== undefined;
        const title = movie.title || movie.name;
        movieEl.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <p>${movie.overview ? movie.overview.substring(0, 100) + '...' : 'Geen beschrijving beschikbaar.'}</p>
                <div class="movie-actions">
                    <a href="detail.html?id=${movie.id}&type=${isMovie ? 'movie' : 'tv'}" class="details-btn">Details</a>
                </div>
            </div>
        `;
        container.appendChild(movieEl);
    });
}

export function renderCarousel(movies) {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;
  carousel.innerHTML = movies.map(movie => `
    <div class="carousel-item" data-id="${movie.id}">
      <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}" />
      <div class="carousel-content">
        <div class="carousel-title">${movie.title}</div>
      </div>
    </div>
  `).join('');

  carousel.querySelectorAll('.carousel-item').forEach(item => {
    item.addEventListener('click', () => {
      const id = item.getAttribute('data-id');
      const movie = movies.find(m => m.id == id);
      const isMovie = movie.title !== undefined;
      window.location.href = `detail.html?id=${id}&type=${isMovie ? 'movie' : 'tv'}`;
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
        <div class="section-item" data-id="${item.id}">
          <img src="https://image.tmdb.org/t/p/w300${item.poster_path}" alt="${item.name || item.title}" />
          <div class="section-content">
            <h4>${item.name || item.title}</h4>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  
  // Add click handlers for items
  container.querySelectorAll('.section-item').forEach(item => {
    item.addEventListener('click', () => {
      const id = item.getAttribute('data-id');
      const isMovie = items.find(i => i.id == id).title !== undefined;
      window.location.href = `detail.html?id=${id}&type=${isMovie ? 'movie' : 'tv'}`;
    });
  });
}
