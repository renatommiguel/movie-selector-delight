
export interface Movie {
  id: string;
  title: string;
  rating: number;
  imageUrl: string;
  watched: boolean;
  watchedCount: number;
  lastWatchedAt?: string; // ISO date string
}
