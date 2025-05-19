
const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNGYzYzVkNWIzY2UxMmVlMmQxYTlhMzMzOTIyOGI2MSIsIm5iZiI6MTc0NzY1MjU5Ni4zNjcsInN1YiI6IjY4MmIwZmY0MmQ4NDFkNmE2MTJmNzQ0YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.QtKOTI1A4IpFhGSu43xvDN7crsp4Wu6pNQkxfankrcc';
const BASE_URL = 'https://api.themoviedb.org/3/trending/movie/day?language=en-US';

export async function fetchPopularMovies() {
    try {
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        return [];
    }
}
