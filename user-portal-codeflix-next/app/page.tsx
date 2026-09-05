import { Header } from './components/header';
import { MovieRow } from './components/MovieRow';
import { Banner } from './components/Banner';
import { getMovieById, getMoviesByGenre } from './services/movie.service';

export default async function Home() {
  const bannerMovie = await getMovieById('103');
  const genres = ['Action', 'Drama', 'Comedy', 'Animation', 'Adventure'];

  const moviesByGenre = await Promise.all(
    genres.map(async (genre) => {
      const movies = await getMoviesByGenre(genre, {_per_page: 10});
      return {
        genre,
        movies,
      };
    })
  );

  console.log('Movies by genre:', moviesByGenre);

  return (
    <main className='min-h-screen overflow-x-hidden bg-[#141414] font-sans'>
      <Header />

      <Banner bannerMovie={bannerMovie} />

      {moviesByGenre.map(({ genre, movies }) => (
        <MovieRow key={genre} title={genre} movies={movies} />
      ))}
    </main>
  );
}
