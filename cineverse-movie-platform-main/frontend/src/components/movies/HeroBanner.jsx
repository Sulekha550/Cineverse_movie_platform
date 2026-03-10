import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getBackdropUrl } from '../../services/tmdb';

export default function HeroBanner({ items = [] }) {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const featured = items.slice(0, 5);

  useEffect(() => {
    if (featured.length <= 1) return;
    const timer = setInterval(() => setCurrent(c => (c + 1) % featured.length), 6000);
    return () => clearInterval(timer);
  }, [featured.length]);

  if (!featured.length) return null;

  const item = featured[current];
  const type = item.media_type || 'movie';
  const title = item.title || item.name || '';
  const backdrop = getBackdropUrl(item.backdrop_path);
  const rating = item.vote_average?.toFixed(1);
  const year = (item.release_date || item.first_air_date || '').split('-')[0];

  const handleExplore = () => {
    navigate(type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`);
  };

  return (
    <div style={{
      position: 'relative',
      height: '85vh', minHeight: 500, maxHeight: 750,
      overflow: 'hidden',
      marginBottom: 48,
    }}>
      {/* Background */}
      <div key={current} style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${backdrop})`,
        backgroundSize: 'cover', backgroundPosition: 'center top',
        animation: 'heroFadeIn 0.8s ease',
      }} />

      {/* Gradient overlays */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to right, rgba(10,10,15,0.95) 30%, rgba(10,10,15,0.4) 70%, transparent 100%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(10,10,15,1) 0%, transparent 40%)',
      }} />

      {/* Content */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
        padding: '0 48px', maxWidth: 1400, margin: '0 auto',
      }}>
        <div style={{ maxWidth: 600, animation: 'slideUp 0.6s ease' }}>
          {/* Type badge */}
          <div style={{ marginBottom: 12 }}>
            <span style={{
              padding: '4px 12px', borderRadius: 4,
              background: 'rgba(229,9,20,0.9)', fontSize: 11, fontWeight: 700,
              letterSpacing: 2, textTransform: 'uppercase',
            }}>
              {type === 'tv' ? '📺 TV Series' : '🎬 Movie'}
            </span>
          </div>

          <h1 style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(36px, 6vw, 72px)',
            letterSpacing: 2, lineHeight: 1,
            marginBottom: 16,
            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
          }}>{title}</h1>

          {/* Meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            {rating && (
              <span style={{ color: '#f5c518', fontWeight: 700, fontSize: 15 }}>★ {rating}</span>
            )}
            {year && (
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>{year}</span>
            )}
          </div>

          {item.overview && (
            <p style={{
              color: 'rgba(255,255,255,0.7)', fontSize: 15, lineHeight: 1.7,
              marginBottom: 28, maxWidth: 480,
              display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
            }}>
              {item.overview}
            </p>
          )}

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn-primary" onClick={handleExplore} style={{ fontSize: 15, padding: '12px 28px' }}>
              ▶ Explore
            </button>
            <button className="btn-secondary" onClick={handleExplore} style={{ fontSize: 15, padding: '12px 28px' }}>
              ℹ More Info
            </button>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div style={{
        position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 8,
      }}>
        {featured.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: i === current ? 28 : 8, height: 8,
              borderRadius: 4, border: 'none',
              background: i === current ? 'var(--accent)' : 'rgba(255,255,255,0.3)',
              transition: 'all 0.3s ease', cursor: 'pointer', padding: 0,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes heroFadeIn { from { opacity: 0; transform: scale(1.05); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
