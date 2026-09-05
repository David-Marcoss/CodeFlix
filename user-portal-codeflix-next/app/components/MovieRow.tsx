import { Movie } from '../types/movie.interface';
import { MovieCard } from './MovieCard';

type MovieRowProps = {
  title: string;
  movies: Movie[];
};

export function MovieRow({ title, movies }: MovieRowProps) {
  return (
    <div className='my-10 px-8'>
      <h2 className='mb-5 text-2xl font-bold'>{title}</h2>

      <div className='flex scrollbar-none items-start gap-4 overflow-x-scroll py-6'>
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie}  />
        ))}
      </div>
    </div>
  );
}
