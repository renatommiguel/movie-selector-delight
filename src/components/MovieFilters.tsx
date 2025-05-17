
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface MovieFiltersProps {
  showWatched: boolean;
  setShowWatched: (show: boolean) => void;
  totalMovies: number;
  watchedCount: number;
}

const MovieFilters: React.FC<MovieFiltersProps> = ({
  showWatched,
  setShowWatched,
  totalMovies,
  watchedCount
}) => {
  return (
    <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
      <div className="flex gap-2">
        <Button
          variant={showWatched ? "outline" : "secondary"}
          size="sm"
          onClick={() => setShowWatched(false)}
          className={showWatched ? "" : "bg-secondary text-secondary-foreground"}
        >
          All Movies
          <span className="ml-2 text-xs bg-muted text-muted-foreground rounded-full px-2 py-0.5">
            {totalMovies}
          </span>
        </Button>
        <Button
          variant={!showWatched ? "outline" : "secondary"}
          size="sm"
          onClick={() => setShowWatched(true)}
          className={!showWatched ? "" : "bg-secondary text-secondary-foreground"}
        >
          <Check className="w-4 h-4 mr-1" />
          Watched
          <span className="ml-2 text-xs bg-muted text-muted-foreground rounded-full px-2 py-0.5">
            {watchedCount}
          </span>
        </Button>
      </div>
      <div className="text-sm text-muted-foreground">
        {watchedCount} of {totalMovies} movies watched ({Math.round((watchedCount / totalMovies) * 100)}%)
      </div>
    </div>
  );
};

export default MovieFilters;
