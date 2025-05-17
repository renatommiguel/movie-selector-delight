
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 md:px-8 border-b border-border">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 text-transparent bg-clip-text">
            Movie Roulette
          </h1>
        </div>
        <p className="text-muted-foreground text-sm md:text-base mt-2 md:mt-0">
          Discover your next movie to watch
        </p>
      </div>
    </header>
  );
};

export default Header;
