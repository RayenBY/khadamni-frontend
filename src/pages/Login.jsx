import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ phone: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      login(res.data.data.user, res.data.data.token)
      const role = res.data.data.user.role
      if (role === 'admin') navigate('/admin')
      else navigate('/map')
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", minHeight: '100vh', display: 'flex' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        .auth-input {
          width: 100%; padding: 14px 16px; border-radius: 12px;
          border: 1.5px solid #d4e8db; font-size: 15px;
          font-family: 'Sora', sans-serif; color: #111;
          outline: none; transition: border-color 0.2s, box-shadow 0.2s;
          background: #fff;
        }
        .auth-input:focus { border-color: #1a7a3c; box-shadow: 0 0 0 4px rgba(26,122,60,0.1); }
        .auth-input::placeholder { color: #aaa; }
        .btn-submit {
          width: 100%; padding: 15px; border-radius: 12px;
          background: #1a7a3c; color: #fff; border: none;
          font-size: 16px; font-weight: 700; cursor: pointer;
          font-family: 'Sora', sans-serif;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(26,122,60,0.3);
        }
        .btn-submit:hover:not(:disabled) { background: #145f2e; transform: translateY(-1px); box-shadow: 0 6px 24px rgba(26,122,60,0.35); }
        .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
        .left-panel {
          flex: 1; background: linear-gradient(145deg, #0d1f14 0%, #1a7a3c 100%);
          display: flex; flex-direction: column; justify-content: center;
          padding: 60px; color: #fff; position: relative; overflow: hidden;
        }
        .left-panel::before {
          content: ''; position: absolute; top: -100px; right: -100px;
          width: 400px; height: 400px; border-radius: 50%;
          background: rgba(255,255,255,0.04);
        }
        .left-panel::after {
          content: ''; position: absolute; bottom: -80px; left: -80px;
          width: 300px; height: 300px; border-radius: 50%;
          background: rgba(255,255,255,0.03);
        }
        .right-panel {
          flex: 1; display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          padding: 60px 40px; background: #fff;
        }
        .form-box { width: 100%; max-width: 420px; }
        .divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; }
        .divider-line { flex: 1; height: 1px; background: #e8e8e8; }
        .social-btn {
          width: 100%; padding: 13px; border-radius: 12px;
          border: 1.5px solid #e0e0e0; background: #fff;
          font-size: 14px; font-weight: 600; cursor: pointer;
          font-family: 'Sora', sans-serif; color: #333;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: border-color 0.2s, background 0.2s;
        }
        .social-btn:hover { border-color: #1a7a3c; background: #f9fdf9; }
        .pass-wrapper { position: relative; }
        .pass-toggle {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: #888;
          font-size: 18px; padding: 0; line-height: 1;
        }
        .error-box {
          background: #fff0f0; border: 1px solid #ffcccc;
          color: #cc0000; padding: 12px 16px; border-radius: 10px;
          font-size: 14px; margin-bottom: 16px;
        }
        @media (max-width: 768px) {
          .left-panel { display: none; }
          .right-panel { padding: 40px 24px; }
        }
      `}</style>

      {/* LEFT PANEL */}
      <div className="left-panel">
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 60 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L3 7v11h5v-5h4v5h5V7L10 2z" fill="white"/>
            </svg>
          </div>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>Khadamni</span>
        </Link>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#7ecf9a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
            Bienvenue
          </div>
          <h2 style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
            Connecte-toi<br />à ton compte
          </h2>
          <p style={{ color: '#9dc9ac', fontSize: 16, lineHeight: 1.7, maxWidth: 360, marginBottom: 48 }}>
            Des milliers d'opportunités t'attendent. Retrouve tes offres, candidatures et notifications.
          </p>

          {/* Testimonial */}
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: '24px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ color: '#e0f0e8', fontSize: 15, lineHeight: 1.7, marginBottom: 16, fontStyle: 'italic' }}>
              "J'ai trouvé un job à Sfax en moins de 48h grâce à Khadamni. Incroyable!"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#1a7a3c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700 }}>M</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Mohamed T.</div>
                <div style={{ color: '#7ecf9a', fontSize: 13 }}>Travailleur · Sfax</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        {/* Mobile logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'none', alignItems: 'center', gap: 8, marginBottom: 32, alignSelf: 'flex-start' }} className="mobile-logo">
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#1a7a3c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L3 7v11h5v-5h4v5h5V7L10 2z" fill="white"/>
            </svg>
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#111' }}>Khadamni</span>
        </Link>

        <div className="form-box">
          <h1 style={{ fontSize: 30, fontWeight: 800, color: '#0d1f14', marginBottom: 8 }}>Connexion</h1>
          <p style={{ color: '#888', fontSize: 15, marginBottom: 32 }}>
            Pas encore inscrit ?{' '}
            <Link to="/register" style={{ color: '#1a7a3c', fontWeight: 600, textDecoration: 'none' }}>Créer un compte</Link>
          </p>

          {error && <div className="error-box">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#333', display: 'block', marginBottom: 8 }}>Numéro de téléphone</label>
              <input
                className="auth-input"
                type="tel"
                name="phone"
                placeholder="12345678"
                value={form.phone}
                onChange={handleChange}
                maxLength={8}
                required
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Mot de passe</label>
                <a href="#" style={{ fontSize: 13, color: '#1a7a3c', textDecoration: 'none', fontWeight: 600 }}>Oublié ?</a>
              </div>
              <div className="pass-wrapper">
                <input
                  className="auth-input"
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  style={{ paddingRight: 48 }}
                />
                <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button className="btn-submit" type="submit" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? 'Connexion...' : 'Se connecter →'}
            </button>
          </form>

          <div className="divider">
            <div className="divider-line" />
            <span style={{ fontSize: 13, color: '#aaa', whiteSpace: 'nowrap' }}>ou continuer avec</span>
            <div className="divider-line" />
          </div>

          <button className="social-btn">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continuer avec Google
          </button>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#aaa', marginTop: 32, lineHeight: 1.6 }}>
            En continuant, tu acceptes nos{' '}
            <a href="#" style={{ color: '#1a7a3c', textDecoration: 'none' }}>Conditions d'utilisation</a>{' '}
            et notre{' '}
            <a href="#" style={{ color: '#1a7a3c', textDecoration: 'none' }}>Politique de confidentialité</a>.
          </p>
        </div>
      </div>
    </div>
  )
}