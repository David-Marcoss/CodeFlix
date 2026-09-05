import Image from 'next/image';
import { Movie } from '../types/movie.interface';
import { Link, Play, Plus } from 'lucide-react';

type MovieCardProps = {
  movie: Movie;
};

export function MovieInfo({ movie }: MovieCardProps) {
  return (
    <div className='absolute -top-20 left-0 z-20 hidden h-[550px] w-[450px] flex-col gap-4 rounded-xl bg-[#1d1d1d] group-hover:flex'>
      <div className='h-[60%] w-full rounded-tl-xl rounded-tr-xl'>
        <video
          autoPlay
          loop
          muted
          className='h-full w-full rounded-tl-xl rounded-tr-xl object-cover opacity-50 transition duration-1000 ease-in-out'
          poster={movie.bannerFileURL}
          src={movie.videoFileURL}
        />
      </div>

      <div className='flex flex-col gap-4 p-2'>
        <div className='flex justify-between'>
          <h3 className='text-start text-xl font-extrabold'>{movie.title}</h3>

          <div className='flex gap-1'>
            <button className='flex h-10 w-10 items-center justify-center rounded-full border border-gray-600 bg-gray-900 hover:h-11 hover:w-11'>
              <Plus className='text-center text-white' />
            </button>
          </div>
        </div>

        <div className='flex gap-2'>
          {movie.genres.map((g) => (
            <div key={g} className='flex items-center justify-center gap-2'>
              <span className='h-2 w-2 rounded-full bg-red-600' />
              <span>{g}</span>
            </div>
          ))}
        </div>

        <p className='text-md line-clamp-3 text-gray-300'>
          {movie.description}
        </p>

        <div className='mb-4 flex w-full'>
          <a
            href={`/movie/watch/${movie.id}`}
            className='mx-4 flex w-full items-center justify-center gap-2 rounded-xl border-gray-600 bg-white p-2 hover:bg-gray-200'
          >
            <Play className='text-center text-black' />
            <span className='font-bold text-black'>Assistir</span>
          </a>
        </div>
      </div>
    </div>
  );
}
