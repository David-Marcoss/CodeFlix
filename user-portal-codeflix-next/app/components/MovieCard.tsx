import Image from 'next/image';

type MovieCardProps = {
  index: number;
};

export function MovieCard({index}: MovieCardProps) {
  return (
    <div
      key={index}
      className='group relative z-50 h-44 min-w-75 transform rounded-lg bg-linear-to-t from-transparent to-black transition duration-200 ease-in hover:scale-110'
    >
      <Image
        src={`/item_${index}.png`}
        preload
        alt={`Movie ${index}`}
        width={300}
        height={300}
        className='rounded-lg object-cover'
      />
    </div>
  );
}
