
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import MovieGrid from '../components/MovieGrid';
import RandomMovieButton from '../components/RandomMovieButton';
import MovieFilters from '../components/MovieFilters';
import { fetchMovies, saveMovieState, getSavedMovies } from '../services/movieService';
import { Movie } from '../types';
import { useToast } from "@/components/ui/use-toast";

const Index: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showWatched, setShowWatched] = useState<boolean>(false);
  const [highlightedMovieId, setHighlightedMovieId] = useState<string | null>(null);
  const [choosing, setChoosing] = useState<boolean>(false);
  const { toast } = useToast();

  // Load movies on mount
  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        // Try to get saved movies from local storage first
        const savedMovies = getSavedMovies();
        
        if (savedMovies) {
          setMovies(savedMovies);
        } else {
          // If no saved movies, fetch new ones
          const fetchedMovies = await fetchMovies();
          setMovies(fetchedMovies);
          saveMovieState(fetchedMovies);
        }
      } catch (error) {
        console.error('Failed to load movies:', error);
        toast({
          title: "Error",
          description: "Failed to load movies. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  // Filter movies based on showWatched state
  useEffect(() => {
    setFilteredMovies(
      showWatched 
        ? movies.filter(movie => movie.watched)
        : movies
    );
  }, [movies, showWatched]);

  // Toggle watched status for a movie
  const handleToggleWatched = (id: string) => {
    setMovies(prevMovies => {
      const updatedMovies = prevMovies.map(movie => 
        movie.id === id ? { ...movie, watched: !movie.watched } : movie
      );
      
      // Save updated state to localStorage
      saveMovieState(updatedMovies);
      
      return updatedMovies;
    });

    // Show toast notification
    toast({
      title: "Status Updated",
      description: "Movie watched status has been updated.",
      duration: 2000,
    });
  };

  // Choose a random movie
  const handleChooseRandom = () => {
    if (filteredMovies.length === 0) {
      toast({
        title: "No movies available",
        description: showWatched 
          ? "You haven't marked any movies as watched yet."
          : "There are no movies to choose from.",
        variant: "destructive",
      });
      return;
    }

    setChoosing(true);

    // Create animation effect by cycling through multiple movies
    let iterations = 0;
    const maxIterations = 20;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * filteredMovies.length);
      setHighlightedMovieId(filteredMovies[randomIndex].id);
      
      iterations++;
      if (iterations >= maxIterations) {
        clearInterval(interval);
        setChoosing(false);
        
        // Final selection
        const finalIndex = Math.floor(Math.random() * filteredMovies.length);
        const selectedMovie = filteredMovies[finalIndex];
        setHighlightedMovieId(selectedMovie.id);
        
        // Scroll the selected movie into view
        const element = document.getElementById(`movie-${selectedMovie.id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        toast({
          title: "Movie Selected!",
          description: `How about watching "${selectedMovie.title}" (${selectedMovie.rating}/10)?`,
        });
      }
    }, 100);
  };

  const watchedCount = movies.filter(m => m.watched).length;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Can't decide what to watch?
          </h2>
          <RandomMovieButton 
            onClick={handleChooseRandom} 
            loading={choosing || loading}
            className="mb-8"
          />
          
          {!loading && (
            <MovieFilters 
              showWatched={showWatched}
              setShowWatched={setShowWatched}
              totalMovies={movies.length}
              watchedCount={watchedCount}
            />
          )}
        </div>
        
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : filteredMovies.length > 0 ? (
          <MovieGrid 
            movies={filteredMovies} 
            onToggleWatched={handleToggleWatched}
            highlightedMovieId={highlightedMovieId}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {showWatched
                ? "You haven't marked any movies as watched yet."
                : "No movies found."
              }
            </p>
          </div>
        )}
      </main>
      
      <footer className="py-6 border-t border-border">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Movie Roulette &copy; 2023</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
