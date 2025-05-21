const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNGYzYzVkNWIzY2UxMmVlMmQxYTlhMzMzOTIyOGI2MSIsIm5iZiI6MTc0NzY1MjU5Ni4zNjcsInN1YiI6IjY4MmIwZmY0MmQ4NDFkNmE2MTJmNzQ0YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.QtKOTI1A4IpFhGSu43xvDN7crsp4Wu6pNQkxfankrcc';
const BASE_URL = 'https://api.themoviedb.org/3';

const headers = {
  accept: 'application/json',
  Authorization: `Bearer ${API_KEY}`
};

// Trending Movies
export async function fetchTrendingMovies() {
  return fetchFromApi(`/trending/movie/week`);
}

// Popular Movies
export async function fetchPopularMovies(page = 1) {
  return fetchFromApi(`/movie/popular?page=${page}`);
}

// All Movies via Discover 
export async function fetchAllMovies(page = 1) {
  return fetchFromApi(`/discover/movie?page=${page}&language=en-US&sort_by=popularity.desc`);
}

// Movie Details by ID
export async function fetchMovieDetails(movieId) {
  return fetchFromApi(`/movie/${movieId}`);
}

// Search Movies
export async function searchMovies(query, page = 1) {
  return fetchFromApi(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`);
}


async function fetchFromApi(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, { headers });
    const data = await response.json();
    return data.results || data;
  } catch (err) {
    console.error(`API error (${endpoint}):`, err);
    return [];
  }
}
