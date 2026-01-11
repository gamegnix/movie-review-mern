import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Fetch all movies from API
export const fetchMovies = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    // Return empty array on error
    return [];
  }
};

// Fetch single movie by ID
export const fetchMovieById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie:", error);
    return null;
  }
};
