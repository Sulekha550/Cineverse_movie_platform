import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPopularMovies, fetchTopRated, fetchPopularTV } from '../redux/slices/moviesSlice';
import MainLayout from '../layouts/MainLayout';
import MovieCard from '../components/movies/MovieCard';
import { SkeletonGrid } from '../components/common/SkeletonCard';
import { useInfiniteScroll } from '../hooks';

export default function MoviesPage({ type = 'movie' }) {
  const dispatch = useDispatch();
  const isTV = type === 'tv';
  const section = isTV ? 'tvShows' : 'popular';
  const { items, loading, page, total_pages } = useSelector(s => s.movies[section]);
  const hasMore = page < total_pages;

  useEffect(() => {
    if (items.length === 0) {
      if (isTV) dispatch(fetchPopularTV({ page: 1 }));
      else dispatch(fetchPopularMovies({ page: 1 }));
    }
  }, [type]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      if (isTV) dispatch(fetchPopularTV({ page: page + 1 }));
      else dispatch(fetchPopularMovies({ page: page + 1 }));
    }
  }, [loading, hasMore, page, isTV, dispatch]);

  const lastRef = useInfiniteScroll(loadMore, hasMore, loading);

  const title = isTV ? 'TV Shows' : 'Popular Movies';

  return (
    <MainLayout>
      <div className="container page-enter" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <div className="section-header" style={{ marginBottom: 32 }}>
          <h1 className="section-title" style={{ fontSize: 36 }}>{title}</h1>
          <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>{items.length} titles loaded</span>
        </div>

        {items.length === 0 && loading ? (
          <SkeletonGrid count={20} />
        ) : (
          <>
            <div className="movies-grid">
              {items.map((item, i) => (
                <div key={item.id} ref={i === items.length - 1 ? lastRef : null}>
                  <MovieCard item={item} mediaType={isTV ? 'tv' : 'movie'} />
                </div>
              ))}
            </div>

            {loading && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                <div className="spinner" />
              </div>
            )}

            {!hasMore && items.length > 0 && (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                You've seen it all! ✨
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
