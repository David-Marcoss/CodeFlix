import Image from 'next/image';

type MovieCardProps = {
  id: number;
};

export function MovieCard({id}: MovieCardProps) {
  return (
    <div
      className='group relative z-20 h-44 min-w-75 transform rounded-lg bg-linear-to-t from-transparent to-black transition duration-200 ease-in hover:scale-110'
    >
      <Image
        src={`/item_${id}.png`}
        preload
        alt={`Movie ${id}`}
        width={300}
        height={300}
        className='rounded-lg object-cover'
      />
    </div>
  );
}
