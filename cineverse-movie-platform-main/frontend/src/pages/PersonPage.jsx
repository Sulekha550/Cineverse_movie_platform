import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tmdbApi, getProfileUrl } from '../services/tmdb';
import MainLayout from '../layouts/MainLayout';
import MovieCard from '../components/movies/MovieCard';

export default function PersonPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await tmdbApi.getPersonDetails(id);
        setPerson(data);
      } catch {
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetch();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <MainLayout>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    </MainLayout>
  );

  if (!person) return null;

  const credits = person.combined_credits?.cast?.slice(0, 16) || [];
  const bio = person.biography || 'Biography not available.';
  const truncatedBio = bio.length > 400 ? bio.slice(0, 400) + '...' : bio;

  return (
    <MainLayout>
      <div className="container page-enter" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'flex-start', marginBottom: 48 }}>
          <div style={{ flexShrink: 0 }}>
            <img
              src={getProfileUrl(person.profile_path, 'h632')}
              alt={person.name}
              style={{
                width: 240, borderRadius: 12,
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
              onError={e => { e.target.style.display = 'none'; }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 280 }}>
            <h1 style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(32px, 5vw, 56px)',
              letterSpacing: 2, marginBottom: 8
            }}>{person.name}</h1>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
              {person.known_for_department && (
                <span style={{
                  padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                  background: 'rgba(229,9,20,0.15)', border: '1px solid var(--border-accent)',
                  color: 'var(--accent)'
                }}>{person.known_for_department}</span>
              )}
              {person.birthday && (
                <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                  🎂 {new Date(person.birthday).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              )}
              {person.place_of_birth && (
                <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                  📍 {person.place_of_birth}
                </span>
              )}
            </div>

            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 600 }}>
              {showMore ? bio : truncatedBio}
            </p>
            {bio.length > 400 && (
              <button
                onClick={() => setShowMore(!showMore)}
                style={{ color: 'var(--accent)', marginTop: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                {showMore ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        </div>

        {credits.length > 0 && (
          <section>
            <h2 className="section-title" style={{ marginBottom: 24 }}>Known For</h2>
            <div className="movies-grid">
              {credits.map(item => (
                <MovieCard key={`${item.id}-${item.credit_id}`} item={item} mediaType={item.media_type || 'movie'} showType />
              ))}
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
}
