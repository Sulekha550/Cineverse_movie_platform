import { Link } from 'react-router-dom';
import MovieCard from './MovieCard';
import { SkeletonGrid } from '../common/SkeletonCard';

export default function MovieSection({ title, items, loading, seeAllLink, mediaType = 'movie', showType = false }) {
  if (!loading && (!items || items.length === 0)) return null;

  return (
    <section style={{ marginBottom: 48 }}>
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        {seeAllLink && (
          <Link to={seeAllLink} style={{
            fontSize: 13, fontWeight: 600, color: 'var(--accent)',
            padding: '6px 14px', borderRadius: 6,
            border: '1px solid var(--border-accent)',
            transition: 'all 0.2s',
            background: 'var(--accent-dim)',
          }}>See All →</Link>
        )}
      </div>

      {loading ? (
        <SkeletonGrid count={6} />
      ) : (
        <div className="movies-grid">
          {items.slice(0, 20).map(item => (
            <MovieCard key={item.id} item={item} mediaType={mediaType} showType={showType} />
          ))}
        </div>
      )}
    </section>
  );
}
