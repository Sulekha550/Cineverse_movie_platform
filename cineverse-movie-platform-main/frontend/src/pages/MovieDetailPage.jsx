import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { tmdbApi, getPosterUrl, getBackdropUrl, getProfileUrl } from '../services/tmdb';
import { addFavorite, removeFavorite } from '../redux/slices/favoritesSlice';
import { addToHistory } from '../redux/slices/historySlice';
import { openTrailer } from '../redux/slices/uiSlice';
import MainLayout from '../layouts/MainLayout';
import MovieCard from '../components/movies/MovieCard';
import toast from 'react-hot-toast';

export default function MovieDetailPage({ isTV = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const { items: favorites } = useSelector(s => s.favorites);

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = isTV ? await tmdbApi.getTVDetails(id) : await tmdbApi.getMovieDetails(id);
        setMovie(data);

        // Add to history if logged in
        if (user) {
          dispatch(addToHistory({
            tmdbId: String(data.id),
            mediaType: isTV ? 'tv' : 'movie',
            title: data.title || data.name,
            posterPath: data.poster_path || '',
            releaseDate: data.release_date || data.first_air_date || '',
            rating: data.vote_average || 0
          }));
        }
      } catch (err) {
        setError('Failed to load details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
    window.scrollTo(0, 0);
  }, [id, isTV]);

  if (loading) return (
    <MainLayout>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    </MainLayout>
  );

  if (error || !movie) return (
    <MainLayout>
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>😔</div>
        <h2 style={{ marginBottom: 8 }}>{error || 'Movie not found'}</h2>
        <button className="btn-primary" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    </MainLayout>
  );

  const title = movie.title || movie.name || 'Unknown';
  const backdrop = getBackdropUrl(movie.backdrop_path);
  const poster = getPosterUrl(movie.poster_path, 'w500');
  const trailerVideo = movie.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube')
    || movie.videos?.results?.find(v => v.site === 'YouTube');
  const cast = movie.credits?.cast?.slice(0, 12) || [];
  const similar = movie.similar?.results?.slice(0, 8) || [];
  const genres = movie.genres || [];
  const rating = movie.vote_average?.toFixed(1);
  const year = (movie.release_date || movie.first_air_date || '').split('-')[0];
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : '';
  const isFav = favorites.some(f => f.tmdbId === String(movie.id));

  const handleFavorite = () => {
    if (!user) return toast.error('Please login');
    if (isFav) {
      dispatch(removeFavorite(String(movie.id)));
      toast.success('Removed from favorites');
    } else {
      dispatch(addFavorite({
        tmdbId: String(movie.id), mediaType: isTV ? 'tv' : 'movie',
        title, posterPath: movie.poster_path || '',
        releaseDate: movie.release_date || movie.first_air_date || '',
        rating: movie.vote_average || 0, overview: movie.overview || ''
      }));
      toast.success('Added to favorites ❤️');
    }
  };

  const handleTrailer = () => {
    dispatch(openTrailer({ trailerKey: trailerVideo?.key || null, title }));
    if (user) {
      dispatch(addToHistory({
        tmdbId: String(movie.id), mediaType: isTV ? 'tv' : 'movie',
        title, posterPath: movie.poster_path || '',
        releaseDate: movie.release_date || movie.first_air_date || '',
        rating: movie.vote_average || 0
      }));
    }
  };

  return (
    <MainLayout>
      {/* Backdrop */}
      <div style={{ position: 'relative', height: '70vh', minHeight: 400, overflow: 'hidden' }}>
        {!imgError ? (
          <img
            src={backdrop}
            alt={title}
            onError={() => setImgError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }} />
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, var(--bg-primary) 15%, rgba(10,10,15,0.5) 60%, rgba(10,10,15,0.2) 100%)'
        }} />
      </div>

      <div className="container" style={{ marginTop: -200, position: 'relative', zIndex: 1, paddingBottom: 60 }}>
        <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* Poster */}
          <div style={{ flexShrink: 0, width: 220 }}>
            <img
              src={poster}
              alt={title}
              onError={e => { e.target.src = ''; }}
              style={{
                width: '100%', borderRadius: 12,
                boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            />
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 280, paddingTop: 120 }}>
            <h1 style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: 2,
              lineHeight: 1, marginBottom: 12
            }}>{title}</h1>

            {/* Meta row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 16 }}>
              {rating && (
                <span style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  color: '#f5c518', fontWeight: 700, fontSize: 16
                }}>★ {rating}</span>
              )}
              {year && <span style={{ color: 'var(--text-secondary)' }}>{year}</span>}
              {runtime && <span style={{ color: 'var(--text-secondary)' }}>⏱ {runtime}</span>}
              {movie.status && (
                <span style={{
                  padding: '2px 10px', borderRadius: 4, fontSize: 11, fontWeight: 700,
                  background: movie.status === 'Released' ? 'rgba(40,200,40,0.15)' : 'rgba(229,9,20,0.15)',
                  color: movie.status === 'Released' ? '#40c040' : 'var(--accent)',
                  border: `1px solid ${movie.status === 'Released' ? 'rgba(40,200,40,0.3)' : 'var(--border-accent)'}`
                }}>
                  {movie.status}
                </span>
              )}
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                {genres.map(g => (
                  <span key={g.id} style={{
                    padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                    background: 'rgba(255,255,255,0.07)', border: '1px solid var(--border)',
                    color: 'var(--text-secondary)'
                  }}>{g.name}</span>
                ))}
              </div>
            )}

            {/* Overview */}
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 28, maxWidth: 600 }}>
              {movie.overview || 'Description not available.'}
            </p>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="btn-primary" onClick={handleTrailer} style={{ fontSize: 15, padding: '12px 28px' }}>
                ▶ Watch Trailer
              </button>
              <button
                onClick={handleFavorite}
                style={{
                  padding: '12px 24px', borderRadius: 8, fontSize: 15, fontWeight: 600,
                  background: isFav ? 'rgba(229,9,20,0.2)' : 'rgba(255,255,255,0.08)',
                  border: `1px solid ${isFav ? 'var(--border-accent)' : 'var(--border)'}`,
                  color: isFav ? 'var(--accent)' : 'white',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {isFav ? '❤️ In Favorites' : '🤍 Add to Favorites'}
              </button>
            </div>
          </div>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <section style={{ marginTop: 48 }}>
            <h2 className="section-title" style={{ marginBottom: 20 }}>Cast</h2>
            <div className="scroll-row">
              {cast.map(person => (
                <div
                  key={person.id}
                  onClick={() => navigate(`/person/${person.id}`)}
                  style={{
                    flexShrink: 0, width: 100, cursor: 'pointer',
                    transition: 'transform 0.2s',
                    textAlign: 'center',
                  }}
                >
                  <div style={{
                    width: 80, height: 80, borderRadius: '50%', overflow: 'hidden',
                    margin: '0 auto 8px', background: 'var(--bg-card)',
                    border: '2px solid var(--border)',
                  }}>
                    <img
                      src={getProfileUrl(person.profile_path)}
                      alt={person.name}
                      onError={e => { e.target.style.display = 'none'; }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                    {person.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                    {person.character}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar */}
        {similar.length > 0 && (
          <section style={{ marginTop: 48 }}>
            <h2 className="section-title" style={{ marginBottom: 20 }}>Similar {isTV ? 'Shows' : 'Movies'}</h2>
            <div className="movies-grid">
              {similar.map(item => (
                <MovieCard key={item.id} item={item} mediaType={isTV ? 'tv' : 'movie'} />
              ))}
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
}
