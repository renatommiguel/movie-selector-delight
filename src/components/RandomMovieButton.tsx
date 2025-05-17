
import React from 'react';
import { Button } from "@/components/ui/button";
import { Shuffle } from 'lucide-react';

interface RandomMovieButtonProps {
  onClick: () => void;
  loading?: boolean;
  className?: string;
}

const RandomMovieButton: React.FC<RandomMovieButtonProps> = ({ onClick, loading = false, className = '' }) => {
  return (
    <Button 
      variant="default" 
      size="lg" 
      onClick={onClick}
      disabled={loading}
      className={`relative px-8 py-6 group ${className}`}
    >
      <Shuffle className="w-5 h-5 mr-2 group-hover:rotate-45 transition-transform" />
      <span className="text-lg">Choose Random Movie</span>
      {loading && (
        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center rounded-md">
          <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      )}
    </Button>
  );
};

export default RandomMovieButton;
