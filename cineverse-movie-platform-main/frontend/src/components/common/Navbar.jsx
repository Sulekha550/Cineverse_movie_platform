import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { openSearch } from '../../redux/slices/searchSlice';
import { fetchFavorites } from '../../redux/slices/favoritesSlice';
import toast from 'react-hot-toast';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector(s => s.auth);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (user) dispatch(fetchFavorites());
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
    setMenuOpen(false);
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Movies', path: '/movies' },
    { label: 'TV Shows', path: '/tv' },
    { label: 'People', path: '/people' },
    { label: 'Search', path: '/search' },
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(10,10,15,0.97)' : 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
      transition: 'all 0.3s ease',
      padding: '0 24px',
    }}>
      <div style={{
        maxWidth: 1400, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 64,
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 28, letterSpacing: 3,
            background: 'linear-gradient(135deg, #e50914 0%, #ff6b35 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>CINEVERSE</span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }} className="desktop-nav">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} style={{
              padding: '6px 14px', borderRadius: 6,
              fontSize: 14, fontWeight: 500,
              color: location.pathname === link.path ? '#e50914' : 'rgba(255,255,255,0.75)',
              background: location.pathname === link.path ? 'rgba(229,9,20,0.1)' : 'transparent',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { if (location.pathname !== link.path) e.target.style.color = '#fff'; }}
              onMouseLeave={e => { if (location.pathname !== link.path) e.target.style.color = 'rgba(255,255,255,0.75)'; }}
            >{link.label}</Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Search icon */}
          <button
            onClick={() => navigate('/search')}
            style={{ padding: 8, borderRadius: 8, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)', fontSize: 16, transition: 'all 0.2s' }}
            title="Search"
          >🔍</button>

          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 12px', borderRadius: 8,
                  background: 'rgba(229,9,20,0.15)', border: '1px solid rgba(229,9,20,0.3)',
                  color: 'white', fontSize: 14, fontWeight: 600, transition: 'all 0.2s'
                }}
              >
                <span style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #e50914, #ff6b35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700
                }}>
                  {user.username?.[0]?.toUpperCase()}
                </span>
                {user.username}
              </button>

              {menuOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: '100%', marginTop: 8,
                  background: 'rgba(22,22,30,0.98)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, overflow: 'hidden', minWidth: 200,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(20px)',
                }}>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setMenuOpen(false)} style={{
                      display: 'block', padding: '12px 16px', fontSize: 14, color: '#f5c518',
                      borderBottom: '1px solid rgba(255,255,255,0.06)', fontWeight: 600
                    }}>⚡ Admin Panel</Link>
                  )}
                  <Link to="/favorites" onClick={() => setMenuOpen(false)} style={{
                    display: 'block', padding: '12px 16px', fontSize: 14, color: 'rgba(255,255,255,0.8)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)'
                  }}>❤️ Favorites</Link>
                  <Link to="/history" onClick={() => setMenuOpen(false)} style={{
                    display: 'block', padding: '12px 16px', fontSize: 14, color: 'rgba(255,255,255,0.8)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)'
                  }}>🕐 Watch History</Link>
                  <button onClick={handleLogout} style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '12px 16px', fontSize: 14, color: '#e50914', fontWeight: 600
                  }}>→ Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/login" className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }}>Login</Link>
              <Link to="/register" className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
