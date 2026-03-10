import Navbar from '../components/common/Navbar';
import TrailerModal from '../components/trailer/TrailerModal';

export default function MainLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />
      <main style={{ paddingTop: 64 }}>
        {children}
      </main>
      <TrailerModal />
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '32px 24px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: 13,
        marginTop: 60,
      }}>
        <div style={{
          fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, letterSpacing: 3,
          background: 'linear-gradient(135deg, #e50914 0%, #ff6b35 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 8,
        }}>CINEVERSE</div>
        <div>Powered by TMDB • Built with MERN Stack</div>
        <div style={{ marginTop: 4 }}>© {new Date().getFullYear()} CineVerse. All rights reserved.</div>
      </footer>
    </div>
  );
}
