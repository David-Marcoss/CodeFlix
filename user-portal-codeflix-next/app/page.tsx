import { Header } from './components/header';
import { MovieRow } from './components/MovieRow';
import { Banner } from './components/Banner';

export default function Home() {
  return (
    <main className='min-h-screen overflow-x-hidden bg-[#141414] font-sans'>
      <Header />

      <Banner />

      <MovieRow title='Recomendado para você' />
      <MovieRow title='Lançamentos' />
      <MovieRow title='Populares' />
      <MovieRow title='Séries' />
    </main>
  );
}
