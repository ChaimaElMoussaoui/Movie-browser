const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNGYzYzVkNWIzY2UxMmVlMmQxYTlhMzMzOTIyOGI2MSIsIm5iZiI6MTc0NzY1MjU5Ni4zNjcsInN1YiI6IjY4MmIwZmY0MmQ4NDFkNmE2MTJmNzQ0YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.QtKOTI1A4IpFhGSu43xvDN7crsp4Wu6pNQkxfankrcc';
const BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchTrendingMovies() {
  try {
    const response = await fetch(`${BASE_URL}/trending/movie/day?language=en-US`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return [];
  }
}