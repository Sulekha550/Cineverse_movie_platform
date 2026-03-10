import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { adminApi, moviesApi } from '../services/tmdb';
import MainLayout from '../layouts/MainLayout';
import toast from 'react-hot-toast';

const TABS = ['Dashboard', 'Users', 'Movies', 'Add Movie'];

export default function AdminPage() {
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [movieForm, setMovieForm] = useState({
    title: '', posterUrl: '', description: '', tmdbId: '',
    releaseDate: '', trailerUrl: '', genre: '', category: 'movie'
  });
  const [editMovie, setEditMovie] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    loadStats();
  }, [user]);

  useEffect(() => {
    if (activeTab === 'Users') loadUsers();
    if (activeTab === 'Movies') loadMovies();
  }, [activeTab]);

  const loadStats = async () => {
    try {
      const { data } = await adminApi.getStats();
      setStats(data);
    } catch {}
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.getUsers();
      setUsers(data.users);
    } catch {} finally { setLoading(false); }
  };

  const loadMovies = async () => {
    setLoading(true);
    try {
      const { data } = await moviesApi.getAll();
      setMovies(data.movies);
    } catch {} finally { setLoading(false); }
  };

  const handleBan = async (userId, isBanned) => {
    try {
      await adminApi.banUser(userId, { isBanned: !isBanned });
      setUsers(users.map(u => u._id === userId ? { ...u, isBanned: !isBanned } : u));
      toast.success(isBanned ? 'User unbanned' : 'User banned');
    } catch { toast.error('Action failed'); }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    try {
      await adminApi.deleteUser(userId);
      setUsers(users.filter(u => u._id !== userId));
      toast.success('User deleted');
    } catch { toast.error('Failed to delete user'); }
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      const genreArr = movieForm.genre.split(',').map(g => g.trim()).filter(Boolean);
      if (editMovie) {
        await moviesApi.update(editMovie._id, { ...movieForm, genre: genreArr });
        toast.success('Movie updated');
        setEditMovie(null);
      } else {
        await moviesApi.create({ ...movieForm, genre: genreArr });
        toast.success('Movie added');
      }
      setMovieForm({ title: '', posterUrl: '', description: '', tmdbId: '', releaseDate: '', trailerUrl: '', genre: '', category: 'movie' });
      loadMovies();
      setActiveTab('Movies');
    } catch { toast.error('Failed to save movie'); }
  };

  const handleDeleteMovie = async (id) => {
    if (!window.confirm('Delete this movie?')) return;
    try {
      await moviesApi.delete(id);
      setMovies(movies.filter(m => m._id !== id));
      toast.success('Movie deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const startEdit = (movie) => {
    setEditMovie(movie);
    setMovieForm({
      title: movie.title, posterUrl: movie.posterUrl, description: movie.description,
      tmdbId: movie.tmdbId || '', releaseDate: movie.releaseDate, trailerUrl: movie.trailerUrl,
      genre: movie.genre?.join(', ') || '', category: movie.category
    });
    setActiveTab('Add Movie');
  };

  return (
    <MainLayout>
      <div className="container page-enter" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <div style={{ marginBottom: 32 }}>
          <span style={{
            fontFamily: 'Bebas Neue, sans-serif', fontSize: 12, letterSpacing: 4,
            color: 'var(--accent)', textTransform: 'uppercase'
          }}>Admin</span>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 42, letterSpacing: 2, marginTop: 4 }}>
            Control Panel
          </h1>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 32, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '10px 20px', fontSize: 14, fontWeight: 600,
              color: activeTab === tab ? 'var(--accent)' : 'var(--text-secondary)',
              borderBottom: `2px solid ${activeTab === tab ? 'var(--accent)' : 'transparent'}`,
              marginBottom: -1, transition: 'all 0.2s', cursor: 'pointer',
            }}>{tab}</button>
          ))}
        </div>

        {/* Dashboard */}
        {activeTab === 'Dashboard' && (
          <div>
            {stats && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
                  {[
                    { label: 'Total Users', value: stats.stats?.totalUsers || 0, icon: '👥', color: '#4a90d9' },
                    { label: 'Custom Movies', value: stats.stats?.totalMovies || 0, icon: '🎬', color: '#e50914' },
                    { label: 'Total Favorites', value: stats.stats?.totalFavorites || 0, icon: '❤️', color: '#e91e63' },
                  ].map(stat => (
                    <div key={stat.label} style={{
                      background: 'var(--bg-secondary)', borderRadius: 12, padding: 24,
                      border: '1px solid var(--border)',
                    }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>{stat.icon}</div>
                      <div style={{ fontSize: 32, fontFamily: 'Bebas Neue', letterSpacing: 1, color: stat.color }}>
                        {stat.value.toLocaleString()}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                {stats.recentUsers?.length > 0 && (
                  <div>
                    <h3 style={{ marginBottom: 16, fontFamily: 'Bebas Neue', fontSize: 22, letterSpacing: 1 }}>Recent Users</h3>
                    <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
                      {stats.recentUsers.map((u, i) => (
                        <div key={u._id} style={{
                          display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px',
                          borderBottom: i < stats.recentUsers.length - 1 ? '1px solid var(--border)' : 'none',
                        }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #e50914, #ff6b35)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 14, fontWeight: 700, flexShrink: 0
                          }}>{u.username?.[0]?.toUpperCase()}</div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>{u.username}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{u.email}</div>
                          </div>
                          <span style={{
                            marginLeft: 'auto', fontSize: 11, padding: '2px 8px', borderRadius: 4,
                            background: u.role === 'admin' ? 'rgba(245,197,24,0.15)' : 'rgba(255,255,255,0.06)',
                            color: u.role === 'admin' ? '#f5c518' : 'var(--text-muted)', fontWeight: 700
                          }}>{u.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Users */}
        {activeTab === 'Users' && (
          <div>
            <h3 style={{ marginBottom: 20, fontFamily: 'Bebas Neue', fontSize: 26, letterSpacing: 1 }}>
              All Users ({users.length})
            </h3>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>
            ) : (
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
                {users.map((u, i) => (
                  <div key={u._id} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 20px',
                    borderBottom: i < users.length - 1 ? '1px solid var(--border)' : 'none',
                    flexWrap: 'wrap', gap: 12,
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                      background: u.isBanned ? 'rgba(229,9,20,0.3)' : 'linear-gradient(135deg, #e50914, #ff6b35)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 700
                    }}>{u.username?.[0]?.toUpperCase()}</div>

                    <div style={{ flex: 1, minWidth: 150 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                        {u.username}
                        {u.role === 'admin' && (
                          <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 3, background: 'rgba(245,197,24,0.15)', color: '#f5c518', fontWeight: 700 }}>ADMIN</span>
                        )}
                        {u.isBanned && (
                          <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 3, background: 'rgba(229,9,20,0.15)', color: 'var(--accent)', fontWeight: 700 }}>BANNED</span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{u.email}</div>
                    </div>

                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </div>

                    {u._id !== user._id && u.role !== 'admin' && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => handleBan(u._id, u.isBanned)}
                          style={{
                            padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                            background: u.isBanned ? 'rgba(40,200,40,0.15)' : 'rgba(229,9,20,0.15)',
                            border: `1px solid ${u.isBanned ? 'rgba(40,200,40,0.3)' : 'var(--border-accent)'}`,
                            color: u.isBanned ? '#40c040' : 'var(--accent)',
                            cursor: 'pointer',
                          }}
                        >{u.isBanned ? 'Unban' : 'Ban'}</button>
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          style={{
                            padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                            background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.2)',
                            color: 'var(--accent)', cursor: 'pointer',
                          }}
                        >Delete</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Movies list */}
        {activeTab === 'Movies' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'Bebas Neue', fontSize: 26, letterSpacing: 1 }}>Custom Movies ({movies.length})</h3>
              <button className="btn-primary" onClick={() => { setEditMovie(null); setActiveTab('Add Movie'); }}>
                + Add Movie
              </button>
            </div>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>
            ) : movies.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                No custom movies. Add one to get started.
              </div>
            ) : (
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
                {movies.map((movie, i) => (
                  <div key={movie._id} style={{
                    display: 'flex', alignItems: 'center', gap: 16, padding: '12px 20px',
                    borderBottom: i < movies.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <div style={{
                      width: 40, height: 56, borderRadius: 4, overflow: 'hidden',
                      background: 'var(--bg-hover)', flexShrink: 0,
                    }}>
                      {movie.posterUrl && <img src={movie.posterUrl} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{movie.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {movie.category} • {movie.releaseDate || 'No date'} • {movie.genre?.join(', ') || 'No genres'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => startEdit(movie)} style={{
                        padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                        background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border)',
                        color: 'white', cursor: 'pointer',
                      }}>Edit</button>
                      <button onClick={() => handleDeleteMovie(movie._id)} style={{
                        padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                        background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.2)',
                        color: 'var(--accent)', cursor: 'pointer',
                      }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add/Edit Movie */}
        {activeTab === 'Add Movie' && (
          <div style={{ maxWidth: 640 }}>
            <h3 style={{ marginBottom: 24, fontFamily: 'Bebas Neue', fontSize: 26, letterSpacing: 1 }}>
              {editMovie ? `Edit: ${editMovie.title}` : 'Add New Movie'}
            </h3>

            <div style={{ background: 'var(--bg-secondary)', borderRadius: 16, padding: 28, border: '1px solid var(--border)' }}>
              <form onSubmit={handleAddMovie}>
                {[
                  { key: 'title', label: 'Movie Title', required: true, placeholder: 'e.g. The Dark Knight' },
                  { key: 'posterUrl', label: 'Poster Image URL', placeholder: 'https://...' },
                  { key: 'tmdbId', label: 'TMDB ID (optional)', placeholder: 'e.g. 155' },
                  { key: 'releaseDate', label: 'Release Date', placeholder: 'YYYY-MM-DD' },
                  { key: 'trailerUrl', label: 'YouTube Trailer Key', placeholder: 'YouTube video ID (e.g. EXeTwQWrcwY)' },
                  { key: 'genre', label: 'Genres (comma separated)', placeholder: 'Action, Drama, Sci-Fi' },
                ].map(field => (
                  <div key={field.key} className="form-group">
                    <label className="form-label">{field.label}</label>
                    <input
                      type="text"
                      required={field.required}
                      value={movieForm[field.key]}
                      onChange={e => setMovieForm({ ...movieForm, [field.key]: e.target.value })}
                      className="form-input"
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    value={movieForm.description}
                    onChange={e => setMovieForm({ ...movieForm, description: e.target.value })}
                    className="form-input"
                    rows={4}
                    placeholder="Movie description..."
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={movieForm.category}
                    onChange={e => setMovieForm({ ...movieForm, category: e.target.value })}
                    className="form-input"
                  >
                    <option value="movie">Movie</option>
                    <option value="tv">TV</option>
                    <option value="trending">Trending</option>
                    <option value="popular">Popular</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                    {editMovie ? '💾 Save Changes' : '+ Add Movie'}
                  </button>
                  {editMovie && (
                    <button type="button" className="btn-secondary" onClick={() => { setEditMovie(null); setActiveTab('Movies'); }}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
