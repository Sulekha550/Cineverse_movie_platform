import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [validationError, setValidationError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, user } = useSelector(s => s.auth);

  useEffect(() => {
    if (user) navigate('/');
    return () => dispatch(clearError());
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setValidationError('Passwords do not match');
      return;
    }
    setValidationError('');
    const result = await dispatch(register({ username: form.username, email: form.email, password: form.password }));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Account created! Welcome to CineVerse 🎬');
      navigate('/');
    }
  };

  const displayError = validationError || error;

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', padding: 24,
      backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(229,9,20,0.08) 0%, transparent 70%)',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link to="/" style={{
            fontFamily: 'Bebas Neue, sans-serif', fontSize: 36, letterSpacing: 4,
            background: 'linear-gradient(135deg, #e50914 0%, #ff6b35 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>CINEVERSE</Link>
          <h2 style={{ marginTop: 12, fontWeight: 400, color: 'var(--text-secondary)' }}>Create your account</h2>
        </div>

        <div style={{
          background: 'var(--bg-secondary)', borderRadius: 16,
          padding: 32, border: '1px solid var(--border)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}>
          {displayError && (
            <div style={{
              background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.3)',
              borderRadius: 8, padding: '12px 16px', marginBottom: 20,
              color: 'var(--accent)', fontSize: 14,
            }}>{displayError}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text" required minLength={3}
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                className="form-input"
                placeholder="cinefan"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="form-input"
                placeholder="your@email.com"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password" required minLength={6}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="form-input"
                placeholder="Min 6 characters"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password" required
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                className="form-input"
                placeholder="Repeat password"
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
              style={{ width: '100%', justifyContent: 'center', padding: 14, fontSize: 16, marginTop: 8 }}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, color: 'var(--text-muted)', fontSize: 14 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
