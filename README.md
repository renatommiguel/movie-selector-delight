
# Movie Selector Delight

A web application that lets you browse movies and randomly select one to watch. Mark movies as watched, keep track of your watch history, and discover new films to enjoy.

## Features

- Browse a collection of 100 movies
- Randomly select movies from your unwatched collection
- Mark movies as watched/unwatched with timestamps
- Track how many times you've watched each movie
- View detailed movie information with links to IMDB and Google search

## Hosting on GitHub Pages

This project is configured to be hosted on GitHub Pages using GitHub Actions for automated deployment.

### Setup Instructions

1. Create a new repository on GitHub
2. Push this code to your repository
3. Go to repository Settings > Pages
4. Under "Build and deployment", select "GitHub Actions" as the source
5. The site will be automatically deployed when you push to the main branch

### Manual Deployment

To deploy manually:

1. Run `npm run build`
2. The built files will be in the `dist` directory
3. These files can be hosted on any static hosting service

## Development

```
npm install
npm run dev
```

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
