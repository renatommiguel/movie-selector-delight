
import React from 'react';
import { Movie } from '../types';
import MovieCard from './MovieCard';

interface MovieGridProps {
  movies: Movie[];
  onToggleWatched: (id: string) => void;
  highlightedMovieId?: string | null;
  onMovieClick: (movie: Movie) => void;
}

const MovieGrid: React.FC<MovieGridProps> = ({ 
  movies, 
  onToggleWatched,
  highlightedMovieId,
  onMovieClick
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {movies.map(movie => (
        <div key={movie.id} className="h-full">
          <MovieCard 
            movie={movie} 
            onToggleWatched={onToggleWatched}
            highlighted={highlightedMovieId === movie.id}
            onClick={onMovieClick}
          />
        </div>
      ))}
    </div>
  );
};

export default MovieGrid;
