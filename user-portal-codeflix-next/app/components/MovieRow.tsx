import { MovieCard } from './MovieCard';

type MovieRowProps = {
  title: string;
};

export function MovieRow({ title }: MovieRowProps) {
  return (
    <div className='my-10 px-8'>
      <h2 className='mb-5 text-2xl font-bold'>{title}</h2>

      <div className='flex scrollbar-none items-start gap-4 overflow-x-scroll py-6'>
        {[1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map((i) => (
          <MovieCard key={i} index={i} />
        ))}
      </div>
    </div>
  );
}
