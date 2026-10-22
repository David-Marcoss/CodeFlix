import { Header } from '@/app/components/header';
import Player from '@/app/components/Player';
import { getMovieById } from '@/app/services/movie.service';

type Params = {
  id: string;
};

export default async function SearchPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const movie = await getMovieById(id);

  return movie ? (
    <Player movie={movie} />
  ) : (
    <main className='min-h-screen overflow-x-hidden bg-[#141414] font-sans text-white'>
      <Header />

      <div className='mx-auto w-full max-w-480 px-4 pt-32 pb-16 sm:px-8 lg:px-10 xl:px-4'>
        <div className='flex items-center justify-center text-5xl'>
          Filme não encontrado !!
        </div>
      </div>
    </main>
  );
}
