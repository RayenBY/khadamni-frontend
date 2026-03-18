import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../store/AuthContext'
import api from '../services/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBriefcase, faBuilding, faEye, faEyeSlash, faFileLines, faHouse, faLocationDot, faTriangleExclamation, faUser, faCheck } from '@fortawesome/free-solid-svg-icons'

const CITIES = ['Tunis', 'Sfax', 'Sousse', 'Monastir', 'Bizerte', 'Nabeul', 'Autre']

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { t } = useTranslation()
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
      if (!form.role) return setError(t('auth.err_role'))
      setStep(2)
    } else if (step === 2) {
      if (!form.name || !form.phone || !form.password) return setError(t('auth.err_fields'))
      if (form.phone.length !== 8) return setError(t('auth.err_phone'))
      if (form.password.length < 6) return setError(t('auth.err_password'))
      setStep(3)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.city) return setError(t('auth.err_city'))
    setError('')
    setLoading(true)
    try {
      await api.post('/auth/register', form)
      const res = await api.post('/auth/login', { phone: form.phone, password: form.password })
      login(res.data.data.user, res.data.data.token)
      navigate('/map')
    } catch (err) {
      setError(err.response?.data?.message || t('auth.err_register'))
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
          border: 1.5px solid var(--border-2); font-size: 15px;
          font-family: 'Sora', sans-serif; color: var(--text);
          outline: none; transition: border-color 0.2s, box-shadow 0.2s; background: var(--surface);
        }
        .auth-input:focus { border-color: #1a7a3c; box-shadow: 0 0 0 4px rgba(26,122,60,0.1); }
        .auth-input::placeholder { color: var(--text-placeholder); }
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
          background: var(--surface); color: var(--text-muted); border: 1.5px solid #ddd;
          font-size: 15px; font-weight: 600; cursor: pointer;
          font-family: 'Sora', sans-serif; transition: border-color 0.2s, background 0.2s;
        }
        .btn-back:hover { border-color: #1a7a3c; background: var(--bg); color: #1a7a3c; }
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
          padding: 60px 40px; background: var(--surface); overflow-y: auto;
        }
        .form-box { width: 100%; max-width: 440px; }
        .role-card {
          padding: 20px; border-radius: 14px; border: 2px solid #e0e0e0;
          cursor: pointer; transition: all 0.2s; text-align: center;
          flex: 1;
        }
        .role-card:hover { border-color: #1a7a3c; background: var(--bg); }
        .role-card.selected { border-color: #1a7a3c; background: var(--primary-light); }
        .city-pill {
          padding: 10px 18px; border-radius: 100px;
          border: 1.5px solid var(--border-2); background: var(--surface);
          font-size: 14px; font-weight: 500; cursor: pointer;
          font-family: 'Sora', sans-serif; color: var(--text-2);
          transition: all 0.2s; white-space: nowrap;
        }
        .city-pill:hover { border-color: #1a7a3c; color: #1a7a3c; background: var(--bg); }
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
          background: none; border: none; cursor: pointer; color: var(--text-faint); font-size: 18px;
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
            <FontAwesomeIcon icon={faHouse} style={{ fontSize: 22, color: 'white' }} />
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
            {t('auth.step_of', { step })}
          </div>
          <h2 style={{ fontSize: 38, fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
            {step === 1 && t('auth.step1Heading')}
            {step === 2 && t('auth.step2Heading')}
            {step === 3 && t('auth.step3Heading')}
          </h2>
          <p style={{ color: '#9dc9ac', fontSize: 16, lineHeight: 1.7, maxWidth: 340 }}>
            {step === 1 && t('auth.step1Subtitle')}
            {step === 2 && t('auth.step2Subtitle')}
            {step === 3 && t('auth.step3Subtitle')}
          </p>

          {/* Step icons */}
          <div style={{ marginTop: 48, display: 'flex', gap: 16 }}>
            {[
              { icon: faUser, label: t('auth.stepLabel1'), done: step > 1 },
              { icon: faFileLines, label: t('auth.stepLabel2'), done: step > 2 },
              { icon: faLocationDot, label: t('auth.stepLabel3'), done: false },
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
                  {step > i + 1 ? <FontAwesomeIcon icon={faCheck} style={{ fontSize: 16 }} /> : <FontAwesomeIcon icon={item.icon} style={{ fontSize: 16 }} />}
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
              <FontAwesomeIcon icon={faHouse} style={{ fontSize: 18, color: 'white' }} />
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>Khadamni</span>
          </Link>

          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>{t('auth.registerTitle')}</h1>
          <p style={{ color: 'var(--text-faint)', fontSize: 15, marginBottom: 32 }}>
            {t('auth.alreadyHaveAccount')}{' '}
            <Link to="/login" style={{ color: '#1a7a3c', fontWeight: 600, textDecoration: 'none' }}>{t('common.login')}</Link>
          </p>

          {error && <div className="error-box"><FontAwesomeIcon icon={faTriangleExclamation} style={{ marginRight: 6 }} />{error}</div>}

          {/* STEP 1 — Role */}
          {step === 1 && (
            <div>
              <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
                {t('auth.chooseRole')}
              </p>
              <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
                <div className={`role-card ${form.role === 'employer' ? 'selected' : ''}`} onClick={() => selectRole('employer')}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}><FontAwesomeIcon icon={faBuilding} /></div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{t('auth.employerCard')}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-faint)', lineHeight: 1.5 }}>{t('auth.employerCardDesc')}</div>
                  {form.role === 'employer' && (
                    <div style={{ marginTop: 12, display: 'inline-block', background: '#1a7a3c', color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 100 }}>{t('auth.selected')}</div>
                  )}
                </div>
                <div className={`role-card ${form.role === 'worker' ? 'selected' : ''}`} onClick={() => selectRole('worker')}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}><FontAwesomeIcon icon={faBriefcase} /></div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{t('auth.workerCard')}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-faint)', lineHeight: 1.5 }}>{t('auth.workerCardDesc')}</div>
                  {form.role === 'worker' && (
                    <div style={{ marginTop: 12, display: 'inline-block', background: '#1a7a3c', color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 100 }}>{t('auth.selected')}</div>
                  )}
                </div>
              </div>
              <button className="btn-submit" onClick={nextStep}>{t('auth.continue')}</button>
            </div>
          )}

          {/* STEP 2 — Info */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 8 }}>{t('auth.fullName')}</label>
                <input className="auth-input" type="text" name="name" placeholder={t('auth.fullNamePlaceholder')} value={form.name} onChange={handleChange} required />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 8 }}>{t('auth.phone')}</label>
                <input className="auth-input" type="tel" name="phone" placeholder={t('auth.phonePlaceholder')} value={form.phone} onChange={handleChange} maxLength={8} required />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 8 }}>{t('auth.password')}</label>
                <div className="pass-wrapper">
                  <input
                    className="auth-input" type={showPass ? 'text' : 'password'}
                    name="password" placeholder={t('auth.minPassword')}
                    value={form.password} onChange={handleChange}
                    required style={{ paddingRight: 48 }}
                  />
                  <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                    <FontAwesomeIcon icon={showPass ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button className="btn-back" onClick={() => setStep(1)}>{t('auth.backBtn')}</button>
                <button className="btn-submit" onClick={nextStep}>{t('auth.continue')}</button>
              </div>
            </div>
          )}

          {/* STEP 3 — City */}
          {step === 3 && (
            <form onSubmit={handleSubmit}>
              <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
                {t('auth.selectCity')}
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
                <button type="button" className="btn-back" onClick={() => setStep(2)}>{t('auth.backBtn')}</button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? t('auth.creating') : t('auth.createBtn')}
                </button>
              </div>
            </form>
          )}

          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-placeholder)', marginTop: 32, lineHeight: 1.6 }}>
            {t('auth.termsAgree')}{' '}
            <a href="#" style={{ color: '#1a7a3c', textDecoration: 'none' }}>{t('auth.termsLink')}</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
