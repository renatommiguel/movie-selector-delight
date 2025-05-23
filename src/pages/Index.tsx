
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import MovieGrid from '../components/MovieGrid';
import RandomMovieButton from '../components/RandomMovieButton';
import MovieFilters from '../components/MovieFilters';
import MovieDetail from '../components/MovieDetail';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { fetchMovies, saveMovieState, getSavedMovies } from '../services/movieService';
import { Movie } from '../types';
import { useToast } from "@/hooks/use-toast";

const Index: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showWatched, setShowWatched] = useState<boolean>(false);
  const [highlightedMovieId, setHighlightedMovieId] = useState<string | null>(null);
  const [choosing, setChoosing] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const { toast } = useToast();

  // Load movies on mount
  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        // Try to get saved movies from local storage first
        const savedMovies = getSavedMovies();
        
        if (savedMovies) {
          // Ensure all movies have the new properties
          const updatedMovies = savedMovies.map(movie => ({
            ...movie,
            watchedCount: movie.watchedCount || (movie.watched ? 1 : 0),
            lastWatchedAt: movie.lastWatchedAt || (movie.watched ? new Date().toISOString() : undefined)
          }));
          setMovies(updatedMovies);
          saveMovieState(updatedMovies);
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
      const updatedMovies = prevMovies.map(movie => {
        if (movie.id === id) {
          const wasWatched = movie.watched;
          return { 
            ...movie, 
            watched: true,
            watchedCount: movie.watchedCount + 1,
            lastWatchedAt: new Date().toISOString()
          };
        }
        return movie;
      });
      
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
    
    // Update selected movie if it's the one being toggled
    if (selectedMovie && selectedMovie.id === id) {
      setSelectedMovie(prev => {
        if (!prev) return null;
        return {
          ...prev,
          watched: true,
          watchedCount: prev.watchedCount + 1,
          lastWatchedAt: new Date().toISOString()
        };
      });
    }
  };

  // Reset watched status for a movie
  const handleResetWatched = (id: string) => {
    setMovies(prevMovies => {
      const updatedMovies = prevMovies.map(movie => 
        movie.id === id 
          ? { ...movie, watched: false, watchedCount: 0, lastWatchedAt: undefined }
          : movie
      );
      
      // Save updated state to localStorage
      saveMovieState(updatedMovies);
      
      return updatedMovies;
    });

    // Show toast notification
    toast({
      title: "Status Reset",
      description: "Movie watched status has been reset.",
      duration: 2000,
    });
    
    // Update selected movie if it's the one being reset
    if (selectedMovie && selectedMovie.id === id) {
      setSelectedMovie(prev => {
        if (!prev) return null;
        return {
          ...prev,
          watched: false,
          watchedCount: 0,
          lastWatchedAt: undefined
        };
      });
    }
  };

  // Handle movie selection
  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  // Choose a random movie
  const handleChooseRandom = () => {
    // Get unwatched movies
    const unwatchedMovies = movies.filter(m => !m.watched);
    
    if (unwatchedMovies.length === 0) {
      toast({
        title: "No unwatched movies",
        description: "You've watched all the movies! Reset some to continue.",
        variant: "destructive",
      });
      return;
    }

    setChoosing(true);

    // Create animation effect by cycling through multiple movies
    let iterations = 0;
    const maxIterations = 20;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * unwatchedMovies.length);
      setHighlightedMovieId(unwatchedMovies[randomIndex].id);
      
      iterations++;
      if (iterations >= maxIterations) {
        clearInterval(interval);
        setChoosing(false);
        
        // Final selection
        const finalIndex = Math.floor(Math.random() * unwatchedMovies.length);
        const selectedMovie = unwatchedMovies[finalIndex];
        setHighlightedMovieId(selectedMovie.id);
        
        // Scroll the selected movie into view
        const element = document.getElementById(`movie-${selectedMovie.id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // Show selected movie detail
        setSelectedMovie(selectedMovie);
        
        toast({
          title: "Movie Selected!",
          description: `We've picked "${selectedMovie.title}" (${selectedMovie.rating}/10) for you.`,
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
            onMovieClick={handleMovieClick}
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
      
      <Dialog open={!!selectedMovie} onOpenChange={(open) => !open && setSelectedMovie(null)}>
        <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-lg">
          {selectedMovie && (
            <MovieDetail 
              movie={selectedMovie} 
              onClose={() => setSelectedMovie(null)}
              onToggleWatched={handleToggleWatched}
              onResetWatched={handleResetWatched}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <footer className="py-6 border-t border-border">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Movie Roulette &copy; 2023</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
