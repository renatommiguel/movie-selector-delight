
import React from 'react';
import { Movie } from '../types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Check, Calendar, Star, Search } from 'lucide-react';
import { format } from 'date-fns';

interface MovieDetailProps {
  movie: Movie;
  onClose: () => void;
  onToggleWatched: (id: string) => void;
  onResetWatched: (id: string) => void;
}

const MovieDetail: React.FC<MovieDetailProps> = ({ movie, onClose, onToggleWatched, onResetWatched }) => {
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);

  const handleMarkWatched = () => {
    onToggleWatched(movie.id);
  };

  const handleOpenUnwatchDialog = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmUnwatch = () => {
    onResetWatched(movie.id);
    setConfirmDialogOpen(false);
  };

  const openIMDB = () => {
    window.open(`https://www.imdb.com/find/?q=${encodeURIComponent(movie.title)}`, '_blank');
  };

  const openGoogleSearch = () => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(movie.title + " movie")}`, '_blank');
  };

  const getFormattedDate = (dateString?: string) => {
    if (!dateString) return 'Never watched';
    return format(new Date(dateString), 'PPpp'); // Format: Apr 29, 2023, 5:32 PM
  };

  return (
    <>
      <Card className="w-full max-w-lg mx-auto fade-in">
        <CardHeader className="relative pb-0">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{movie.title}</h2>
              <div className="flex items-center mt-1 gap-2">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{movie.rating.toFixed(1)}</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <span className="sr-only">Close</span>
              <div className="h-6 w-6 text-muted-foreground hover:text-foreground">✕</div>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="aspect-[2/3] overflow-hidden rounded-md mb-4">
            <img 
              src={movie.imageUrl} 
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Watch Status</h3>
              <div className="flex items-center gap-2">
                {movie.watched ? (
                  <>
                    <Badge variant="default" className="bg-green-600">
                      <Check className="h-3 w-3 mr-1" /> Watched <span className="ml-1">({movie.watchedCount})</span>
                    </Badge>
                    <span className="text-sm text-muted-foreground">Last: {getFormattedDate(movie.lastWatchedAt)}</span>
                  </>
                ) : (
                  <Badge variant="outline">Not watched</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <div className="flex gap-3 w-full">
            <Button 
              variant={movie.watched ? "outline" : "default"} 
              onClick={handleMarkWatched}
              className="flex-1"
            >
              {movie.watched ? `Mark Watched Again (+${movie.watchedCount + 1})` : "Mark as Watched"}
            </Button>
            {movie.watched && (
              <Button 
                variant="destructive"
                onClick={handleOpenUnwatchDialog}
                className="flex-1"
              >
                Reset Watch Status
              </Button>
            )}
          </div>
          <div className="flex gap-3 w-full">
            <Button variant="secondary" className="flex-1" onClick={openIMDB}>
              <Search className="h-4 w-4 mr-2" /> Search on IMDB
            </Button>
            <Button variant="secondary" className="flex-1" onClick={openGoogleSearch}>
              <Search className="h-4 w-4 mr-2" /> Google Search
            </Button>
          </div>
        </CardFooter>
      </Card>

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the watched status for "{movie.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmUnwatch}>Yes, reset</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MovieDetail;
