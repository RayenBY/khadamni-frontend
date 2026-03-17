import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const CITIES = ['Tunis', 'Sfax', 'Sousse', 'Monastir', 'Bizerte', 'Nabeul', 'Autre']

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', phone: '', password: '', role: '', city: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const selectRole = (role) => setForm({ ...form, role })
  const selectCity = (city) => setForm({ ...form, city })

  const nextStep = () => {
    setError('')
    if (step === 1) {
      if (!form.role) return setError('Choisis un rôle pour continuer.')
      setStep(2)
    } else if (step === 2) {
      if (!form.name || !form.phone || !form.password) return setError('Remplis tous les champs.')
      if (form.phone.length !== 8) return setError('Le numéro doit contenir 8 chiffres.')
      if (form.password.length < 6) return setError('Le mot de passe doit contenir au moins 6 caractères.')
      setStep(3)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.city) return setError('Choisis ta ville.')
    setError('')
    setLoading(true)
    try {
      await api.post('/auth/register', form)
      const res = await api.post('/auth/login', { phone: form.phone, password: form.password })
      login(res.data.data.user, res.data.data.token)
      navigate('/map')
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription')
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
          outline: none; transition: border-color 0.2s, box-shadow 0.2s; background: #fff;
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
        .btn-submit:hover:not(:disabled) { background: #145f2e; transform: translateY(-1px); }
        .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
        .btn-back {
          width: 100%; padding: 14px; border-radius: 12px;
          background: #fff; color: #555; border: 1.5px solid #ddd;
          font-size: 15px; font-weight: 600; cursor: pointer;
          font-family: 'Sora', sans-serif; transition: border-color 0.2s, background 0.2s;
        }
        .btn-back:hover { border-color: #1a7a3c; background: #f9fdf9; color: #1a7a3c; }
        .left-panel {
          flex: 1; background: linear-gradient(145deg, #0d1f14 0%, #1a7a3c 100%);
          display: flex; flex-direction: column; justify-content: center;
          padding: 60px; color: #fff; position: relative; overflow: hidden;
        }
        .left-panel::before {
          content: ''; position: absolute; top: -100px; right: -100px;
          width: 400px; height: 400px; border-radius: 50%; background: rgba(255,255,255,0.04);
        }
        .right-panel {
          flex: 1; display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          padding: 60px 40px; background: #fff; overflow-y: auto;
        }
        .form-box { width: 100%; max-width: 440px; }
        .role-card {
          padding: 20px; border-radius: 14px; border: 2px solid #e0e0e0;
          cursor: pointer; transition: all 0.2s; text-align: center;
          flex: 1;
        }
        .role-card:hover { border-color: #1a7a3c; background: #f9fdf9; }
        .role-card.selected { border-color: #1a7a3c; background: #f0faf4; }
        .city-pill {
          padding: 10px 18px; border-radius: 100px;
          border: 1.5px solid #d4e8db; background: #fff;
          font-size: 14px; font-weight: 500; cursor: pointer;
          font-family: 'Sora', sans-serif; color: #333;
          transition: all 0.2s; white-space: nowrap;
        }
        .city-pill:hover { border-color: #1a7a3c; color: #1a7a3c; background: #f9fdf9; }
        .city-pill.selected { border-color: #1a7a3c; background: #1a7a3c; color: #fff; }
        .step-dot {
          width: 10px; height: 10px; border-radius: 50%;
          background: rgba(255,255,255,0.3); transition: all 0.3s;
        }
        .step-dot.active { background: #fff; width: 28px; border-radius: 5px; }
        .progress-bar {
          height: 4px; border-radius: 2px; background: rgba(255,255,255,0.15);
          margin-bottom: 48px; overflow: hidden;
        }
        .progress-fill {
          height: 100%; background: #7ecf9a; border-radius: 2px;
          transition: width 0.4s ease;
        }
        .error-box {
          background: #fff0f0; border: 1px solid #ffcccc;
          color: #cc0000; padding: 12px 16px; border-radius: 10px;
          font-size: 14px; margin-bottom: 16px;
        }
        .pass-wrapper { position: relative; }
        .pass-toggle {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: #888; font-size: 18px;
        }
        @media (max-width: 768px) {
          .left-panel { display: none; }
          .right-panel { padding: 40px 24px; }
        }
      `}</style>

      {/* LEFT PANEL */}
      <div className="left-panel">
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L3 7v11h5v-5h4v5h5V7L10 2z" fill="white"/>
            </svg>
          </div>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>Khadamni</span>
        </Link>

        {/* Step indicators */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[1,2,3].map(s => (
            <div key={s} className={`step-dot ${step >= s ? 'active' : ''}`} />
          ))}
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(step / 3) * 100}%` }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#7ecf9a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
            Étape {step} sur 3
          </div>
          <h2 style={{ fontSize: 38, fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
            {step === 1 && <>Quel est<br />ton rôle ?</>}
            {step === 2 && <>Tes<br />informations</>}
            {step === 3 && <>Ta<br />localisation</>}
          </h2>
          <p style={{ color: '#9dc9ac', fontSize: 16, lineHeight: 1.7, maxWidth: 340 }}>
            {step === 1 && "Employeur ou travailleur ? Ton expérience sera personnalisée selon ton rôle."}
            {step === 2 && "Ces informations permettront aux autres utilisateurs de te trouver et de te contacter."}
            {step === 3 && "Ta ville nous aide à te proposer des opportunités proches de chez toi."}
          </p>

          {/* Step icons */}
          <div style={{ marginTop: 48, display: 'flex', gap: 16 }}>
            {[
              { icon: '👤', label: 'Ton rôle', done: step > 1 },
              { icon: '📝', label: 'Tes infos', done: step > 2 },
              { icon: '📍', label: 'Ta ville', done: false },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                opacity: step === i + 1 ? 1 : step > i + 1 ? 0.7 : 0.35,
                transition: 'opacity 0.3s'
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: step > i + 1 ? '#1a7a3c' : 'rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: step > i + 1 ? 16 : 18,
                  border: step === i + 1 ? '2px solid rgba(255,255,255,0.5)' : 'none',
                  transition: 'all 0.3s'
                }}>
                  {step > i + 1 ? '✓' : item.icon}
                </div>
                <span style={{ fontSize: 13, color: '#c8e6d0', fontWeight: 500 }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        <div className="form-box">
          {/* Mobile logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#1a7a3c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L3 7v11h5v-5h4v5h5V7L10 2z" fill="white"/>
              </svg>
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#111' }}>Khadamni</span>
          </Link>

          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0d1f14', marginBottom: 6 }}>Créer un compte</h1>
          <p style={{ color: '#888', fontSize: 15, marginBottom: 32 }}>
            Déjà inscrit ?{' '}
            <Link to="/login" style={{ color: '#1a7a3c', fontWeight: 600, textDecoration: 'none' }}>Se connecter</Link>
          </p>

          {error && <div className="error-box">⚠️ {error}</div>}

          {/* STEP 1 — Role */}
          {step === 1 && (
            <div>
              <p style={{ fontSize: 15, color: '#555', marginBottom: 20, lineHeight: 1.6 }}>
                Choisis ton rôle sur la plateforme. Tu pourras le changer plus tard depuis ton profil.
              </p>
              <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
                <div className={`role-card ${form.role === 'employer' ? 'selected' : ''}`} onClick={() => selectRole('employer')}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>🏢</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#0d1f14', marginBottom: 6 }}>Employeur</div>
                  <div style={{ fontSize: 13, color: '#888', lineHeight: 1.5 }}>Je publie des offres et recrute des talents</div>
                  {form.role === 'employer' && (
                    <div style={{ marginTop: 12, display: 'inline-block', background: '#1a7a3c', color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 100 }}>✓ Sélectionné</div>
                  )}
                </div>
                <div className={`role-card ${form.role === 'worker' ? 'selected' : ''}`} onClick={() => selectRole('worker')}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>💼</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#0d1f14', marginBottom: 6 }}>Travailleur</div>
                  <div style={{ fontSize: 13, color: '#888', lineHeight: 1.5 }}>Je cherche des opportunités de travail</div>
                  {form.role === 'worker' && (
                    <div style={{ marginTop: 12, display: 'inline-block', background: '#1a7a3c', color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 100 }}>✓ Sélectionné</div>
                  )}
                </div>
              </div>
              <button className="btn-submit" onClick={nextStep}>Continuer →</button>
            </div>
          )}

          {/* STEP 2 — Info */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#333', display: 'block', marginBottom: 8 }}>Nom complet</label>
                <input className="auth-input" type="text" name="name" placeholder="Rayen Ben Ali" value={form.name} onChange={handleChange} required />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#333', display: 'block', marginBottom: 8 }}>Numéro de téléphone</label>
                <input className="auth-input" type="tel" name="phone" placeholder="12345678" value={form.phone} onChange={handleChange} maxLength={8} required />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#333', display: 'block', marginBottom: 8 }}>Mot de passe</label>
                <div className="pass-wrapper">
                  <input
                    className="auth-input" type={showPass ? 'text' : 'password'}
                    name="password" placeholder="Minimum 6 caractères"
                    value={form.password} onChange={handleChange}
                    required style={{ paddingRight: 48 }}
                  />
                  <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button className="btn-back" onClick={() => setStep(1)}>← Retour</button>
                <button className="btn-submit" onClick={nextStep}>Continuer →</button>
              </div>
            </div>
          )}

          {/* STEP 3 — City */}
          {step === 3 && (
            <form onSubmit={handleSubmit}>
              <p style={{ fontSize: 15, color: '#555', marginBottom: 20, lineHeight: 1.6 }}>
                Sélectionne ta ville principale. Tu pourras choisir plusieurs gouvernorats après la connexion.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 32 }}>
                {CITIES.map(city => (
                  <button
                    key={city} type="button"
                    className={`city-pill ${form.city === city ? 'selected' : ''}`}
                    onClick={() => selectCity(city)}
                  >
                    {city}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" className="btn-back" onClick={() => setStep(2)}>← Retour</button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? 'Création...' : "Créer mon compte 🎉"}
                </button>
              </div>
            </form>
          )}

          <p style={{ textAlign: 'center', fontSize: 13, color: '#aaa', marginTop: 32, lineHeight: 1.6 }}>
            En t'inscrivant, tu acceptes nos{' '}
            <a href="#" style={{ color: '#1a7a3c', textDecoration: 'none' }}>Conditions d'utilisation</a>.
          </p>
        </div>
      </div>
    </div>
  )
}