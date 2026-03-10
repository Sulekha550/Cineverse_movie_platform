import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPeople } from '../redux/slices/moviesSlice';
import MainLayout from '../layouts/MainLayout';
import MovieCard from '../components/movies/MovieCard';
import { SkeletonGrid } from '../components/common/SkeletonCard';
import { useInfiniteScroll } from '../hooks';

export default function PeoplePage() {
  const dispatch = useDispatch();
  const { people } = useSelector(s => s.movies);
  const { items, loading, page, total_pages } = people;
  const hasMore = page < total_pages;

  useEffect(() => {
    if (items.length === 0) dispatch(fetchPeople({ page: 1 }));
  }, []);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) dispatch(fetchPeople({ page: page + 1 }));
  }, [loading, hasMore, page, dispatch]);

  const lastRef = useInfiniteScroll(loadMore, hasMore, loading);

  return (
    <MainLayout>
      <div className="container page-enter" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div className="section-header" style={{ marginBottom: 32 }}>
          <h1 className="section-title" style={{ fontSize: 36 }}>Popular People</h1>
          <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>{items.length} loaded</span>
        </div>

        {items.length === 0 && loading ? (
          <SkeletonGrid count={20} />
        ) : (
          <>
            <div className="movies-grid">
              {items.map((item, i) => (
                <div key={item.id} ref={i === items.length - 1 ? lastRef : null}>
                  <MovieCard item={item} mediaType="person" />
                </div>
              ))}
            </div>
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                <div className="spinner" />
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
