import { Header } from '../components/header';
import { MovieCard } from '../components/MovieCard';
import { SearchMovies } from '../services/movie.service';

type SearchParams = {
  search: string;
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Await the searchParams promise
  const resolvedSearchParams = await searchParams;

  const search = resolvedSearchParams.search; // "shoes"

  const movies = await SearchMovies(search, { _per_page: 100 });

  return (
    <main className='min-h-screen overflow-x-hidden bg-[#141414] font-sans text-white'>
      <Header />

      <div className='mx-auto w-full max-w-480 px-4 pt-32 pb-16 sm:px-8 lg:px-10 xl:px-4'>
        <div className='mb-10 flex flex-wrap items-baseline gap-x-2 gap-y-1 border-b border-white/10 pb-5'>
          <h1 className='text-xl font-medium tracking-tight text-gray-200 sm:text-2xl'>
            Resultados para a busca:
          </h1>
          <h1 className='text-xl font-semibold break-all text-red-500 sm:text-2xl'>
            {search}
          </h1>
        </div>
        
        {movies.length > 0 ? (<div className='flex flex-wrap items-start gap-4'>
          {movies.map((movie, index) => (
            <MovieCard key={index} movie={movie} index={index} />
          ))}
        </div>): (<div className='flex items-center justify-center text-5xl'>Nenhum título encontrado</div>)}

        
      </div>
    </main>
  );
}
