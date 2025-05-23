
import React from 'react';
import { Movie } from '../types';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  onToggleWatched: (id: string) => void;
  highlighted?: boolean;
  onClick: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onToggleWatched, highlighted = false, onClick }) => {
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking the watch button
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onClick(movie);
  };
  
  return (
    <div 
      id={`movie-${movie.id}`}
      className={`relative rounded-lg overflow-hidden transition-all duration-300 h-full cursor-pointer
        ${highlighted ? 'ring-4 ring-primary scale-105 shadow-lg shadow-primary/30' : 'hover:scale-102 hover:shadow-md'}`}
      onClick={handleCardClick}
    >
      <div className="aspect-[2/3] bg-muted relative">
        <img 
          src={movie.imageUrl} 
          alt={movie.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {movie.watched && (
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground p-1 rounded-bl-lg">
            <Check className="h-4 w-4" />
            {movie.watchedCount > 1 && (
              <span className="text-xs font-bold ml-1">{movie.watchedCount}</span>
            )}
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="font-bold text-white truncate">{movie.title}</h3>
          <div className="flex justify-between items-center mt-1">
            <Badge variant={getRatingBadgeVariant(movie.rating)} className="text-xs">
              {movie.rating.toFixed(1)}
            </Badge>
            <Button 
              variant={movie.watched ? "outline" : "secondary"} 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggleWatched(movie.id);
              }}
              className="text-xs h-7"
            >
              {movie.watched ? `Watched (${movie.watchedCount})` : 'Mark Watched'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const getRatingBadgeVariant = (rating: number): "default" | "destructive" | "outline" | "secondary" | "primary" => {
  if (rating >= 8.5) return "primary";
  if (rating >= 7) return "default";
  if (rating >= 5.5) return "secondary";
  if (rating >= 4) return "outline";
  return "destructive";
};

export default MovieCard;
