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


// All Movies via Discover 
export async function fetchAllMovies(page = 1) {
  return fetchFromApi(`/discover/movie?page=${page}&language=en-US&sort_by=popularity.desc`);
}

// Movie Details by ID
export async function fetchMovieDetails(movieId) {
  return fetchFromApi(`/movie/${movieId}`);
}


// Upcoming Movies
export async function fetchUpcomingMovies(page = 1) {
  return fetchFromApi(`/movie/upcoming?page=${page}&language=en-US`);
}

// Trending TV Shows
export async function fetchTrendingSeries() {
  return fetchFromApi(`/trending/tv/week`);
}

// Airing Today TV Shows
export async function fetchAiringToday() {
  return fetchFromApi(`/tv/airing_today`);
}

// TV Series Details by ID
export async function fetchSeriesDetails(seriesId) {
  return fetchFromApi(`/tv/${seriesId}`);
}
 
// TV Series cast
export async function fetchMovieCredits(movieId) {
  return fetchFromApi(`/movie/${movieId}/credits`);
}

// movie reviews
export async function fetchMovieReviews(movieId) {
  return fetchFromApi(`/movie/${movieId}/reviews`);
}

// Search for Movies, TV Shows, and People
export async function fetchMultiSearch(query, page = 1) {
  const endpoint = `/search/multi?query=${encodeURIComponent(query)}&page=${page}&language=nl-NL&include_adult=false`;
  return fetchFromApi(endpoint);
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

