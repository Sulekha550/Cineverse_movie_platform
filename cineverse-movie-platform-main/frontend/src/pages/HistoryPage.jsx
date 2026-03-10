import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchHistory, clearHistory } from '../redux/slices/historySlice';
import MainLayout from '../layouts/MainLayout';
import MovieCard from '../components/movies/MovieCard';
import toast from 'react-hot-toast';

export default function HistoryPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);
  const { items, loading } = useSelector(s => s.history);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    dispatch(fetchHistory());
  }, [user]);

  const handleClear = async () => {
    if (!window.confirm('Clear all watch history?')) return;
    await dispatch(clearHistory());
    toast.success('History cleared');
  };

  const movieItems = items.map(h => ({
    id: parseInt(h.tmdbId),
    title: h.title,
    name: h.title,
    poster_path: h.posterPath,
    release_date: h.releaseDate,
    first_air_date: h.releaseDate,
    vote_average: h.rating,
    media_type: h.mediaType,
  }));

  return (
    <MainLayout>
      <div className="container page-enter" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div className="section-header" style={{ marginBottom: 32 }}>
          <h1 className="section-title" style={{ fontSize: 36 }}>Watch History</h1>
          {items.length > 0 && (
            <button onClick={handleClear} style={{
              fontSize: 13, fontWeight: 600, color: 'var(--accent)',
              padding: '6px 14px', borderRadius: 6,
              border: '1px solid var(--border-accent)',
              background: 'var(--accent-dim)',
              cursor: 'pointer', transition: 'all 0.2s',
            }}>🗑 Clear All</button>
          )}
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🕐</div>
            <h3 style={{ color: 'var(--text-secondary)', fontWeight: 400, marginBottom: 8 }}>
              No watch history yet
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
              Movies you view will appear here automatically
            </p>
            <button className="btn-primary" onClick={() => navigate('/')}>
              Explore Movies
            </button>
          </div>
        ) : (
          <div className="movies-grid">
            {movieItems.map(item => (
              <MovieCard key={item.id} item={item} mediaType={item.media_type} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
