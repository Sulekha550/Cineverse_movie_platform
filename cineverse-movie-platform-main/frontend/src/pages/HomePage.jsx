import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MainLayout from '../layouts/MainLayout';
import HeroBanner from '../components/movies/HeroBanner';
import MovieSection from '../components/movies/MovieSection';
import {
  fetchTrending, fetchPopularMovies, fetchTopRated, fetchPopularTV, fetchPeople
} from '../redux/slices/moviesSlice';

export default function HomePage() {
  const dispatch = useDispatch();
  const { trending, popular, topRated, tvShows, people } = useSelector(s => s.movies);

  useEffect(() => {
    dispatch(fetchTrending({ page: 1 }));
    dispatch(fetchPopularMovies({ page: 1 }));
    dispatch(fetchTopRated({ page: 1 }));
    dispatch(fetchPopularTV({ page: 1 }));
    dispatch(fetchPeople({ page: 1 }));
  }, [dispatch]);

  return (
    <MainLayout>
      <HeroBanner items={trending.items} />
      <div className="container page-enter">
        <MovieSection
          title="Trending Now"
          items={trending.items}
          loading={trending.loading}
          seeAllLink="/trending"
          showType
        />
        <MovieSection
          title="Popular Movies"
          items={popular.items}
          loading={popular.loading}
          seeAllLink="/movies"
          mediaType="movie"
        />
        <MovieSection
          title="Top Rated"
          items={topRated.items}
          loading={topRated.loading}
          seeAllLink="/movies?sort=top_rated"
          mediaType="movie"
        />
        <MovieSection
          title="TV Shows"
          items={tvShows.items}
          loading={tvShows.loading}
          seeAllLink="/tv"
          mediaType="tv"
        />
        <MovieSection
          title="Popular People"
          items={people.items}
          loading={people.loading}
          seeAllLink="/people"
          mediaType="person"
        />
      </div>
    </MainLayout>
  );
}
