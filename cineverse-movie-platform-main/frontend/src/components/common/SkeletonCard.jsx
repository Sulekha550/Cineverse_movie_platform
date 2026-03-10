export default function SkeletonCard() {
  return (
    <div style={{ borderRadius: 10, overflow: 'hidden', background: 'var(--bg-card)' }}>
      <div className="skeleton" style={{ aspectRatio: '2/3', width: '100%' }} />
      <div style={{ padding: '10px 12px 12px' }}>
        <div className="skeleton" style={{ height: 14, width: '80%', marginBottom: 6, borderRadius: 4 }} />
        <div className="skeleton" style={{ height: 12, width: '40%', borderRadius: 4 }} />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 10 }) {
  return (
    <div className="movies-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
