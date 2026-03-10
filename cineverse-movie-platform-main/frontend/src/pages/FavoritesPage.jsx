import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchFavorites } from '../redux/slices/favoritesSlice';
import MainLayout from '../layouts/MainLayout';
import MovieCard from '../components/movies/MovieCard';
import { SkeletonGrid } from '../components/common/SkeletonCard';

export default function FavoritesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);
  const { items, loading } = useSelector(s => s.favorites);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    dispatch(fetchFavorites());
  }, [user]);

  // Convert favorites to movie card format
  const movieItems = items.map(fav => ({
    id: parseInt(fav.tmdbId),
    title: fav.title,
    name: fav.title,
    poster_path: fav.posterPath,
    release_date: fav.releaseDate,
    first_air_date: fav.releaseDate,
    vote_average: fav.rating,
    media_type: fav.mediaType,
    overview: fav.overview,
  }));

  return (
    <MainLayout>
      <div className="container page-enter" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div className="section-header" style={{ marginBottom: 32 }}>
          <h1 className="section-title" style={{ fontSize: 36 }}>My Favorites</h1>
          <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            {items.length} {items.length === 1 ? 'title' : 'titles'}
          </span>
        </div>

        {loading ? (
          <SkeletonGrid count={8} />
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>❤️</div>
            <h3 style={{ color: 'var(--text-secondary)', fontWeight: 400, marginBottom: 8 }}>
              No favorites yet
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
              Browse movies and TV shows and heart the ones you love
            </p>
            <button className="btn-primary" onClick={() => navigate('/movies')}>
              Browse Movies
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
