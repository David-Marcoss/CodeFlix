import { Header } from './components/header';
import { MovieRow } from './components/MovieRow';
import { Banner } from './components/Banner';
import { getMovieById } from './services/movie.service';

export default async function Home() {
  const bannerMovie = await getMovieById("103");

  return (
    <main className='min-h-screen overflow-x-hidden bg-[#141414] font-sans'>
      <Header />

      <Banner bannerMovie={bannerMovie} />

      <MovieRow title='Recomendado para você' />
      <MovieRow title='Lançamentos' />
      <MovieRow title='Populares' />
      <MovieRow title='Séries' />
    </main>
  );
}
