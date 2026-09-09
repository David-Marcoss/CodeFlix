import Image from 'next/image';
import { Movie } from '../types/movie.interface';
import { MovieInfo } from './MovieInfo';

type MovieCardProps = {
  movie: Movie;
  index: number
};

export function MovieCard({ movie, index }: MovieCardProps) {
  return (
    <div className='group relative'>
      <div className='relative z-10 min-w-75 transform rounded-lg bg-linear-to-t from-transparent to-black'>
        <Image
          src={movie.thumbFileURL}
          preload
          alt={`Movie ${movie.id}`}
          width={300}
          height={300}
          className='rounded-lg object-cover'
        />
      </div>

      <MovieInfo movie={movie} index={index}/>
    </div>
  );
}
