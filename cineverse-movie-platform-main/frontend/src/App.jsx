import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Lazy load pages for performance
const HomePage = lazy(() => import('./pages/HomePage'));
const MoviesPage = lazy(() => import('./pages/MoviesPage'));
const MovieDetailPage = lazy(() => import('./pages/MovieDetailPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const PeoplePage = lazy(() => import('./pages/PeoplePage'));
const PersonPage = lazy(() => import('./pages/PersonPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));

function PageLoader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: 'var(--bg-primary)'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: 'Bebas Neue, sans-serif', fontSize: 32, letterSpacing: 4,
          background: 'linear-gradient(135deg, #e50914 0%, #ff6b35 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 20
        }}>CINEVERSE</div>
        <div className="spinner" style={{ margin: '0 auto' }} />
      </div>
    </div>
  );
}

function PrivateRoute({ children }) {
  const { user } = useSelector(s => s.auth);
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user } = useSelector(s => s.auth);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies" element={<MoviesPage type="movie" />} />
        <Route path="/tv" element={<MoviesPage type="tv" />} />
        <Route path="/movie/:id" element={<MovieDetailPage isTV={false} />} />
        <Route path="/tv/:id" element={<MovieDetailPage isTV={true} />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/people" element={<PeoplePage />} />
        <Route path="/person/:id" element={<PersonPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/favorites" element={<PrivateRoute><FavoritesPage /></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute><HistoryPage /></PrivateRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        <Route path="*" element={
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 16 }}>
            <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 80, color: 'var(--accent)' }}>404</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Page not found</p>
            <a href="/" className="btn-primary">Go Home</a>
          </div>
        } />
      </Routes>
    </Suspense>
  );
}
