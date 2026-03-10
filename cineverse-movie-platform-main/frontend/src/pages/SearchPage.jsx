import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { performSearch, setQuery, clearResults } from '../redux/slices/searchSlice';
import MainLayout from '../layouts/MainLayout';
import MovieCard from '../components/movies/MovieCard';
import { SkeletonGrid } from '../components/common/SkeletonCard';
import { useDebounce, useInfiniteScroll } from '../hooks';

const MEDIA_TYPES = ['All', 'Movie', 'TV', 'Person'];

export default function SearchPage() {
  const dispatch = useDispatch();
  const { query, results, loading, page, total_pages } = useSelector(s => s.search);
  const inputRef = useRef(null);
  const hasMore = page < total_pages;

  useEffect(() => {
    inputRef.current?.focus();
    return () => { dispatch(clearResults()); };
  }, []);

  const doSearch = useCallback((q) => {
    if (q.trim()) {
      dispatch(performSearch({ query: q, page: 1 }));
    } else {
      dispatch(clearResults());
    }
  }, [dispatch]);

  const debouncedSearch = useDebounce(doSearch, 500);

  const handleInput = (e) => {
    const val = e.target.value;
    dispatch(setQuery(val));
    debouncedSearch(val);
  };

  const loadMore = useCallback(() => {
    if (!loading && hasMore && query.trim()) {
      dispatch(performSearch({ query, page: page + 1 }));
    }
  }, [loading, hasMore, query, page, dispatch]);

  const lastRef = useInfiniteScroll(loadMore, hasMore, loading);

  // Filter out items without images for cleaner display
  const validResults = results.filter(r => r.poster_path || r.profile_path || r.backdrop_path);

  return (
    <MainLayout>
      <div className="container page-enter" style={{ paddingTop: 40, paddingBottom: 60 }}>
        {/* Search header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(36px, 6vw, 64px)', letterSpacing: 3, marginBottom: 8
          }}>DISCOVER</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Search movies, TV shows, and people</p>
        </div>

        {/* Search input */}
        <div style={{ maxWidth: 700, margin: '0 auto 40px', position: 'relative' }}>
          <span style={{
            position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)',
            fontSize: 20, color: 'var(--text-muted)', pointerEvents: 'none'
          }}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInput}
            placeholder="Search for movies, shows, people..."
            className="form-input"
            style={{
              paddingLeft: 52, paddingRight: 20,
              fontSize: 16, padding: '16px 20px 16px 52px',
              background: 'var(--bg-secondary)',
              border: '2px solid rgba(255,255,255,0.08)',
              borderRadius: 50,
              boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
            }}
          />
          {loading && (
            <div style={{
              position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)'
            }}>
              <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
            </div>
          )}
        </div>

        {/* Results */}
        {!query && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎬</div>
            <h3 style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>
              Start typing to search our entire library
            </h3>
          </div>
        )}

        {query && results.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>😞</div>
            <h3 style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>
              No results found for "{query}"
            </h3>
            <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>Try a different search term</p>
          </div>
        )}

        {results.length > 0 && (
          <>
            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                Found <strong style={{ color: 'white' }}>{results.length}</strong> results for "{query}"
              </span>
            </div>

            <div className="movies-grid">
              {results.map((item, i) => (
                <div key={`${item.id}-${i}`} ref={i === results.length - 1 ? lastRef : null}>
                  <MovieCard item={item} mediaType={item.media_type || 'movie'} showType />
                </div>
              ))}
            </div>
          </>
        )}

        {loading && results.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
            <div className="spinner" />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
