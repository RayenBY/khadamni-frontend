import { useNavigate, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../store/AuthContext'
import { useTheme } from '../store/ThemeContext'
import logo from '../assets/images/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faCheck, faChevronDown, faMoon, faStar, faSun, faXmark } from '@fortawesome/free-solid-svg-icons'

const LANGS = [
  { code: 'fr', label: 'Français', flag: 'fr' },
  { code: 'en', label: 'English',  flag: 'gb' },
  { code: 'ar', label: 'العربية',  flag: 'tn' },
]

export default function Welcome() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const { t, i18n } = useTranslation()
  const { isDark, toggle: toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  const currentLang = LANGS.find(l => l.code === i18n.language) || LANGS[0]

  // Redirect authenticated users away from the landing page
  if (token) return <Navigate to="/dashboard" replace />

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('animate-in')
        })
      },
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", background: 'var(--surface)', overflowX: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap" rel="stylesheet" />

      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .reveal.animate-in { opacity: 1; transform: translateY(0); }
        .reveal.d1 { transition-delay: 0.1s; }
        .reveal.d2 { transition-delay: 0.2s; }
        .reveal.d3 { transition-delay: 0.3s; }
        .btn-primary {
          background: #1a7a3c; color: #fff; border: none;
          padding: 15px 36px; border-radius: 100px;
          font-size: 15px; font-weight: 600; cursor: pointer;
          font-family: 'Sora', sans-serif;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(26,122,60,0.28);
          white-space: nowrap;
        }
        .btn-primary:hover { background: #145f2e; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(26,122,60,0.35); }
        .btn-outline {
          background: transparent; color: #1a7a3c; border: 2px solid #1a7a3c;
          padding: 13px 36px; border-radius: 100px;
          font-size: 15px; font-weight: 600; cursor: pointer;
          font-family: 'Sora', sans-serif;
          transition: background 0.2s, transform 0.15s; white-space: nowrap;
        }
        .btn-outline:hover { background: var(--primary-light); transform: translateY(-2px); }
        .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(0,0,0,0.1); }
        .tag {
          display: inline-block; background: var(--border); color: #1a7a3c;
          padding: 6px 16px; border-radius: 100px;
          font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
        }
        .nav-link { color: var(--text-2); text-decoration: none; font-size: 15px; font-weight: 500; transition: color 0.2s; }
        .nav-link:hover { color: #1a7a3c; }
        .img-cover { width: 100%; height: 100%; object-fit: cover; display: block; }
        .governorate-pill {
          background: #e8f5ee; color: #1a7a3c; border: 1px solid #b8dfc8;
          padding: 7px 16px; border-radius: 100px; font-size: 13px; font-weight: 500;
          display: inline-block; margin: 4px;
          transition: background 0.2s, transform 0.15s, color 0.2s; cursor: pointer;
        }
        .governorate-pill:hover { background: #1a7a3c; color: #fff; transform: scale(1.05); }
        .check-item { display: flex; align-items: center; gap: 10px; font-size: 15px; margin-bottom: 10px; }

        .hero-section {
          display: grid; grid-template-columns: 1fr 1fr;
          min-height: 100vh; padding-top: 68px;
        }
        .hero-left { padding: 80px 48px 80px 72px; }
        .hero-title { font-size: 58px; font-weight: 800; line-height: 1.1; color: var(--text); margin-top: 20px; margin-bottom: 20px; }
        .hero-img-grid {
          display: grid; grid-template-rows: 1fr 1fr; grid-template-columns: 1fr 1fr;
          gap: 8px; padding: 76px 32px 8px 0; height: 100vh;
        }
        .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; max-width: 1100px; margin: 0 auto; }
        .roles-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; max-width: 1100px; margin: 0 auto; }
        .stats-row { display: flex; gap: 40px; margin-top: 52px; flex-wrap: wrap; }
        .stat-divider { width: 1px; background: #e0e0e0; }
        .nav-links-desktop { display: flex; gap: 32px; }
        .nav-btns-desktop { display: flex; gap: 12px; }
        .hamburger { display: none; background: none; border: none; cursor: pointer; padding: 4px; }
        .mobile-menu {
          display: none; position: fixed; top: 68px; left: 0; right: 0;
          background: var(--surface); border-bottom: 1px solid var(--border);
          padding: 20px 24px; flex-direction: column; gap: 16px;
          z-index: 99; box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }
        .mobile-menu.open { display: flex; }
        .section-pad { padding: 100px 60px; }
        .section-title { font-size: 40px; }
        .cta-title { font-size: 48px; }
        .footer-inner { display: flex; justify-content: space-between; align-items: center; }
        .hero-btns { display: flex; gap: 14px; flex-wrap: wrap; }

        @media (max-width: 900px) {
          .nav-links-desktop { display: none; }
          .nav-btns-desktop { display: none; }
          .hamburger { display: block; }
          .hero-section { grid-template-columns: 1fr; min-height: auto; }
          .hero-left { padding: 40px 24px; order: 1; }
          .hero-title { font-size: 36px; }
          .hero-img-grid { height: 300px; padding: 8px; order: 0; }
          .stats-row { gap: 20px; margin-top: 32px; }
          .stat-divider { display: none; }
          .section-pad { padding: 64px 24px !important; }
          .section-title { font-size: 30px !important; }
          .steps-grid { grid-template-columns: 1fr; }
          .roles-grid { grid-template-columns: 1fr; }
          .hero-btns { flex-direction: column; }
          .hero-btns .btn-primary, .hero-btns .btn-outline { width: 100%; text-align: center; }
          .cta-title { font-size: 30px !important; }
          .footer-inner { flex-direction: column; gap: 12px; text-align: center; }
          .nav-inner { padding: 0 20px !important; }
        }

        @media (max-width: 480px) {
          .hero-title { font-size: 28px; }
          .hero-img-grid { height: 240px; }
        }
        .lang-dd-item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 9px 14px; background: none; border: none; cursor: pointer; font-family: 'Sora',sans-serif; font-size: 13px; color: var(--text-2); transition: background .15s; text-align: left; }
        .lang-dd-item:hover { background: var(--primary-light); }
      `}</style>

      {langOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 98 }} onClick={() => setLangOpen(false)} />
      )}

      {/* NAVBAR */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'var(--nav-bg)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)', height: '68px',
        display: 'flex', alignItems: 'center',
      }}>
        <div className="nav-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 60px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Khadamni" style={{ height: 40, display: 'block', filter: isDark ? 'brightness(0) invert(1)' : 'none' }} />
          </div>
          <div className="nav-btns-desktop" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Dark mode toggle */}
            <button onClick={toggleTheme} style={{ background: 'none', border: '1.5px solid var(--border-2)', borderRadius: 100, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-faint)', transition: 'all .18s', flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#1a7a3c'; e.currentTarget.style.color = '#1a7a3c' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.color = 'var(--text-faint)' }}>
              {isDark
                ? <FontAwesomeIcon icon={faSun} style={{ fontSize: 16 }} />
                : <FontAwesomeIcon icon={faMoon} style={{ fontSize: 16 }} />
              }
            </button>
            {/* Language dropdown */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setLangOpen(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px 5px 6px', borderRadius: 100, border: `1.5px solid ${langOpen ? 'var(--border-3)' : 'var(--border-2)'}`, background: langOpen ? 'var(--primary-light)' : 'var(--surface)', cursor: 'pointer', fontFamily: 'Sora,sans-serif', transition: 'all .18s' }}>
                <span className={`fi fi-${currentLang.flag}`} style={{ width: 22, height: 22, borderRadius: '50%', backgroundSize: 'cover', display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{currentLang.code.toUpperCase()}</span>
                <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: 11, transform: langOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s', flexShrink: 0, color: '#999' }} />
              </button>
              {langOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.1)', minWidth: 160, overflow: 'hidden', zIndex: 101 }}>
                  {LANGS.map(l => (
                    <button key={l.code} className="lang-dd-item" onClick={() => { i18n.changeLanguage(l.code); setLangOpen(false) }}>
                      <span className={`fi fi-${l.flag}`} style={{ width: 24, height: 24, borderRadius: '50%', backgroundSize: 'cover', display: 'inline-block', flexShrink: 0 }} />
                      <span style={{ flex: 1 }}>{l.label}</span>
                      {i18n.language === l.code && <span style={{ color: '#1a7a3c', fontWeight: 700, fontSize: 14 }}><FontAwesomeIcon icon={faCheck} /></span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="btn-outline" style={{ padding: '10px 22px', fontSize: '14px' }} onClick={() => navigate('/login')}>{t('common.login')}</button>
            <button className="btn-primary" style={{ padding: '10px 22px', fontSize: '14px' }} onClick={() => navigate('/register')}>{t('common.register')}</button>
          </div>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} style={{ fontSize: 24, color: '#1a7a3c' }} />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {LANGS.map(l => (
            <button key={l.code} onClick={() => { i18n.changeLanguage(l.code); setMenuOpen(false) }}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 100, border: `1.5px solid ${i18n.language === l.code ? '#1a7a3c' : 'var(--border-2)'}`, background: i18n.language === l.code ? 'var(--primary-light)' : 'var(--surface)', cursor: 'pointer', fontFamily: 'Sora,sans-serif', fontSize: 12, fontWeight: 700, color: i18n.language === l.code ? '#1a7a3c' : 'var(--text-muted)', transition: 'all .15s' }}>
              <span className={`fi fi-${l.flag}`} style={{ width: 18, height: 18, borderRadius: '50%', backgroundSize: 'cover', display: 'inline-block' }} />
              <span>{l.code.toUpperCase()}</span>
            </button>
          ))}
          <button onClick={toggleTheme} style={{ background: 'none', border: '1.5px solid var(--border-2)', borderRadius: 100, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-faint)', flexShrink: 0 }}>
            {isDark
              ? <FontAwesomeIcon icon={faSun} style={{ fontSize: 16 }} />
              : <FontAwesomeIcon icon={faMoon} style={{ fontSize: 16 }} />
            }
          </button>
        </div>
        <button className="btn-outline" style={{ marginTop: 8 }} onClick={() => navigate('/login')}>{t('common.login')}</button>
        <button className="btn-primary" onClick={() => navigate('/register')}>{t('common.register')}</button>
      </div>

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-img-grid">
          <div style={{ borderRadius: '20px', overflow: 'hidden', gridRow: '1 / 3', position: 'relative' }}>
            <img className="img-cover" src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80" alt="worker" />
            <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, background: 'var(--surface)', borderRadius: 14, padding: '12px 16px' }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>Ahmed B.</div>
              <div style={{ fontSize: 12, color: '#1a7a3c', marginTop: 2 }}><FontAwesomeIcon icon={faStar} style={{ marginRight: 4 }} />4.9 · Informatique · Tunis</div>
            </div>
          </div>
          <div style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <img className="img-cover" src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&q=80" alt="handshake" />
          </div>
          <div style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <img className="img-cover" src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80" alt="tunisia" />
          </div>
        </div>
        <div className="hero-left">
          <div className="reveal"><span className="tag">{t('welcome.heroTag')}</span></div>
          <h1 className="reveal d1 hero-title">
            {t('welcome.heroTitle1')}<br />
            <span style={{ color: '#1a7a3c' }}>{t('welcome.heroTitle2')}</span>
          </h1>
          <p className="reveal d2" style={{ fontSize: '17px', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '440px', marginBottom: '36px' }}>
            {t('welcome.heroSubtitle')}
          </p>
          <div className="reveal d3 hero-btns">
            <button className="btn-primary" onClick={() => navigate('/register')}>{t('welcome.startFree')}</button>
            <button className="btn-outline" onClick={() => navigate('/login')}>{t('common.login')}</button>
          </div>
          <div className="reveal stats-row">
            <div>
              <div style={{ fontSize: '40px', fontWeight: 800, color: '#1a7a3c', lineHeight: 1 }}>2.4K+</div>
              <div style={{ color: 'var(--text-faint)', fontSize: '13px', marginTop: '4px' }}>{t('welcome.stats_offers')}</div>
            </div>
            <div className="stat-divider" />
            <div>
              <div style={{ fontSize: '40px', fontWeight: 800, color: '#1a7a3c', lineHeight: 1 }}>8K+</div>
              <div style={{ color: 'var(--text-faint)', fontSize: '13px', marginTop: '4px' }}>{t('welcome.stats_workers')}</div>
            </div>
            <div className="stat-divider" />
            <div>
              <div style={{ fontSize: '40px', fontWeight: 800, color: '#1a7a3c', lineHeight: 1 }}>24</div>
              <div style={{ color: 'var(--text-faint)', fontSize: '13px', marginTop: '4px' }}>{t('welcome.stats_regions')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="section-pad" style={{ background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span className="tag reveal">{t('welcome.howTag')}</span>
          <h2 className="reveal d1 section-title" style={{ fontWeight: 800, color: 'var(--text)', marginTop: '16px' }}>{t('welcome.howTitle')}</h2>
        </div>
        <div className="steps-grid">
          {[
            { step: '01', title: t('welcome.step1_title'), desc: t('welcome.step1_desc'), img: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80' },
            { step: '02', title: t('welcome.step2_title'), desc: t('welcome.step2_desc'), img: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&q=80' },
            { step: '03', title: t('welcome.step3_title'), desc: t('welcome.step3_desc'), img: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=400&q=80' },
          ].map((item, i) => (
            <div key={i} className={`reveal d${i} card-hover`} style={{ background: 'var(--surface)', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <div style={{ height: '190px', overflow: 'hidden' }}>
                <img className="img-cover" src={item.img} alt={item.title} />
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#1a7a3c', letterSpacing: '0.1em', marginBottom: '8px' }}>{`${t('welcome.step')} ${item.step}`}</div>
                <div style={{ fontSize: '19px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>{item.title}</div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GOVERNORATES */}
      <section className="section-pad" style={{ background: 'var(--surface)' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
          <span className="tag reveal">{t('welcome.coverageTag')}</span>
          <h2 className="reveal d1 section-title" style={{ fontWeight: 800, color: 'var(--text)', margin: '16px 0 14px' }}>{t('welcome.coverageTitle')}</h2>
          <p className="reveal d2" style={{ fontSize: '16px', color: 'var(--text-muted)', marginBottom: '40px', lineHeight: 1.7 }}>
            {t('welcome.coverageDesc')}
          </p>
          <div className="reveal">
            {['Tunis','Sfax','Sousse','Monastir','Bizerte','Nabeul','Ariana','Ben Arous',
              'Manouba','Zaghouan','Béja','Jendouba','Kef','Siliana','Kairouan',
              'Kasserine','Sidi Bouzid','Mahdia','Gafsa','Tozeur','Kebili','Gabès','Médenine','Tataouine'
            ].map((gov) => (
              <span key={gov} className="governorate-pill">{gov}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section id="jobs" className="section-pad" style={{ background: 'var(--bg)' }}>
        <div className="roles-grid">
          <div className="reveal card-hover" style={{ background: '#0d1f14', borderRadius: '28px', overflow: 'hidden', color: '#fff' }}>
            <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
              <img className="img-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80" alt="employer" style={{ filter: 'brightness(0.55)' }} />
              <div style={{ position: 'absolute', top: 20, left: 20 }}>
                <span style={{ background: '#1a7a3c', color: '#fff', padding: '5px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600 }}>{t('welcome.employerTag')}</span>
              </div>
            </div>
            <div style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '14px' }}>{t('welcome.employerTitle')}</h3>
              <p style={{ color: '#9dc9ac', lineHeight: 1.7, marginBottom: '20px', fontSize: 15 }}>
                {t('welcome.employerDesc')}
              </p>
              {[t('welcome.employer_f1'), t('welcome.employer_f2'), t('welcome.employer_f3'), t('welcome.employer_f4')].map(f => (
                <div key={f} className="check-item"><span style={{ color: '#4caf73', fontSize: 18 }}><FontAwesomeIcon icon={faCheck} /></span><span style={{ color: '#c8e6d0', fontSize: 14 }}>{f}</span></div>
              ))}
              <button className="btn-primary" onClick={() => navigate('/register')} style={{ width: '100%', marginTop: '24px', textAlign: 'center' }}>{t('welcome.employerCta')}</button>
            </div>
          </div>
          <div className="reveal d1 card-hover" style={{ background: 'var(--surface)', borderRadius: '28px', overflow: 'hidden', border: '2px solid #1a7a3c' }}>
            <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
              <img className="img-cover" src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80" alt="worker" style={{ filter: 'brightness(0.7)' }} />
              <div style={{ position: 'absolute', top: 20, left: 20 }}>
                <span style={{ background: 'var(--surface)', color: '#1a7a3c', padding: '5px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600 }}>{t('welcome.workerTag')}</span>
              </div>
            </div>
            <div style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text)', marginBottom: '14px' }}>{t('welcome.workerTitle')}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '20px', fontSize: 15 }}>
                {t('welcome.workerDesc')}
              </p>
              {[t('welcome.worker_f1'), t('welcome.worker_f2'), t('welcome.worker_f3'), t('welcome.worker_f4')].map(f => (
                <div key={f} className="check-item"><span style={{ color: '#1a7a3c', fontSize: 18 }}><FontAwesomeIcon icon={faCheck} /></span><span style={{ color: 'var(--text-2)', fontSize: 14 }}>{f}</span></div>
              ))}
              <button className="btn-primary" onClick={() => navigate('/register')} style={{ width: '100%', marginTop: '24px', textAlign: 'center' }}>{t('welcome.workerCta')}</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #0d1f14 0%, #1a7a3c 100%)', color: '#fff' }}>
        <h2 className="reveal cta-title" style={{ fontWeight: 800, marginBottom: '18px' }}>{t('welcome.ctaTitle')}</h2>
        <p className="reveal d1" style={{ fontSize: '17px', color: '#9dc9ac', maxWidth: '460px', margin: '0 auto 40px' }}>
          {t('welcome.ctaDesc')}
        </p>
        <button className="reveal d2" onClick={() => navigate('/register')} style={{
          background: 'var(--surface)', color: '#1a7a3c', border: 'none',
          padding: '18px 44px', borderRadius: 100, fontSize: 16, fontWeight: 700,
          cursor: 'pointer', fontFamily: 'Sora, sans-serif',
          boxShadow: '0 4px 24px rgba(0,0,0,0.2)', transition: 'transform 0.15s', display: 'inline-block'
        }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          {t('welcome.ctaBtn')}
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '36px 60px', background: '#0a1a10' }}>
        <div className="footer-inner">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Khadamni" style={{ height: 30, display: 'block', filter: 'brightness(0) invert(1)' }} />
          </div>
          <div style={{ color: '#5a8a6a', fontSize: 13 }}>{t('welcome.footer')}</div>
        </div>
      </footer>
    </div>
  )
}
