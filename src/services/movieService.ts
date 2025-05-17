
import { Movie } from '../types';

// This is a temporary mock function
// In a real implementation, this would be replaced with an actual API call
export const fetchMovies = async (): Promise<Movie[]> => {
  console.log('Fetching movies...');
  
  // Create 100 mock movies for initial development
  const mockMovies: Movie[] = Array.from({ length: 100 }, (_, i) => ({
    id: `movie-${i + 1}`,
    title: `Movie ${i + 1}`,
    rating: parseFloat((Math.random() * 5 + 5).toFixed(1)), // Ratings between 5.0 and 10.0
    imageUrl: `https://picsum.photos/seed/${i + 1}/300/450`, // Placeholder images
    watched: false,
    watchedCount: 0
  }));

  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => resolve(mockMovies), 800);
  });
};

// In a real implementation, this would interact with a backend
export const saveMovieState = (movies: Movie[]): void => {
  localStorage.setItem('movies', JSON.stringify(movies));
};

// Get saved movies from local storage
export const getSavedMovies = (): Movie[] | null => {
  const saved = localStorage.getItem('movies');
  return saved ? JSON.parse(saved) : null;
};
