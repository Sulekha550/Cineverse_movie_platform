import { useDispatch, useSelector } from 'react-redux';
import { closeTrailer } from '../../redux/slices/uiSlice';
import { useLockBodyScroll } from '../../hooks';

export default function TrailerModal() {
  const dispatch = useDispatch();
  const { trailerModal } = useSelector(s => s.ui);
  const { isOpen, trailerKey, title } = trailerModal;

  useLockBodyScroll(isOpen);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={() => dispatch(closeTrailer())}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '90vw', maxWidth: 900,
          background: 'var(--bg-secondary)',
          borderRadius: 16,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.8)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2 }}>
              Official Trailer
            </div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, letterSpacing: 1 }}>
              {title}
            </div>
          </div>
          <button
            onClick={() => dispatch(closeTrailer())}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(229,9,20,0.15)', border: '1px solid rgba(229,9,20,0.3)',
              color: 'white', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
          >✕</button>
        </div>

        {/* Video */}
        <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000' }}>
          {trailerKey ? (
            <iframe
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
              title={`${title} Trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-secondary)', gap: 12,
            }}>
              <span style={{ fontSize: 48 }}>🎬</span>
              <div style={{ fontSize: 16, fontWeight: 500 }}>Trailer for this movie is currently unavailable.</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Check back later or search on YouTube</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
