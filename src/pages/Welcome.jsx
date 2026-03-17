import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Welcome() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

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
    <div style={{ fontFamily: "'Sora', sans-serif", background: '#fff', overflowX: 'hidden' }}>
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
        .btn-outline:hover { background: #f0faf4; transform: translateY(-2px); }
        .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(0,0,0,0.1); }
        .tag {
          display: inline-block; background: #e8f5ee; color: #1a7a3c;
          padding: 6px 16px; border-radius: 100px;
          font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
        }
        .nav-link { color: #333; text-decoration: none; font-size: 15px; font-weight: 500; transition: color 0.2s; }
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
        .hero-title { font-size: 58px; font-weight: 800; line-height: 1.1; color: #0d1f14; margin-top: 20px; margin-bottom: 20px; }
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
          background: #fff; border-bottom: 1px solid #e8f5ee;
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
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.93)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e8f5ee', height: '68px',
        display: 'flex', alignItems: 'center',
      }}>
        <div className="nav-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#1a7a3c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L3 7v11h5v-5h4v5h5V7L10 2z" fill="white"/>
              </svg>
            </div>
            <span style={{ fontSize: 20, fontWeight: 800, color: '#111' }}>Khadamni</span>
          </div>
          <div className="nav-links-desktop">
            <a href="#how" className="nav-link">Comment ça marche</a>
            <a href="#jobs" className="nav-link">Offres</a>
            <a href="#talents" className="nav-link">Talents</a>
          </div>
          <div className="nav-btns-desktop">
            <button className="btn-outline" style={{ padding: '10px 22px', fontSize: '14px' }} onClick={() => navigate('/login')}>Se connecter</button>
            <button className="btn-primary" style={{ padding: '10px 22px', fontSize: '14px' }} onClick={() => navigate('/register')}>S'inscrire</button>
          </div>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a7a3c" strokeWidth="2.5" strokeLinecap="round">
              {menuOpen
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
              }
            </svg>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <a href="#how" className="nav-link" onClick={() => setMenuOpen(false)}>Comment ça marche</a>
        <a href="#jobs" className="nav-link" onClick={() => setMenuOpen(false)}>Offres</a>
        <a href="#talents" className="nav-link" onClick={() => setMenuOpen(false)}>Talents</a>
        <button className="btn-outline" style={{ marginTop: 8 }} onClick={() => navigate('/login')}>Se connecter</button>
        <button className="btn-primary" onClick={() => navigate('/register')}>S'inscrire</button>
      </div>

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-img-grid">
          <div style={{ borderRadius: '20px', overflow: 'hidden', gridRow: '1 / 3', position: 'relative' }}>
            <img className="img-cover" src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80" alt="worker" />
            <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, background: 'rgba(255,255,255,0.95)', borderRadius: 14, padding: '12px 16px' }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#0d1f14' }}>Ahmed B.</div>
              <div style={{ fontSize: 12, color: '#1a7a3c', marginTop: 2 }}>⭐ 4.9 · Informatique · Tunis</div>
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
          <div className="reveal"><span className="tag">🇹🇳 Plateforme #1 en Tunisie</span></div>
          <h1 className="reveal d1 hero-title">
            Trouve un job.<br />
            <span style={{ color: '#1a7a3c' }}>Recrute un talent.</span>
          </h1>
          <p className="reveal d2" style={{ fontSize: '17px', color: '#555', lineHeight: 1.7, maxWidth: '440px', marginBottom: '36px' }}>
            Khadamni connecte employeurs et travailleurs à travers les 24 gouvernorats de la Tunisie. Simple, rapide, local.
          </p>
          <div className="reveal d3 hero-btns">
            <button className="btn-primary" onClick={() => navigate('/register')}>Commencer gratuitement →</button>
            <button className="btn-outline" onClick={() => navigate('/login')}>Se connecter</button>
          </div>
          <div className="reveal stats-row">
            <div>
              <div style={{ fontSize: '40px', fontWeight: 800, color: '#1a7a3c', lineHeight: 1 }}>2.4K+</div>
              <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>Offres publiées</div>
            </div>
            <div className="stat-divider" />
            <div>
              <div style={{ fontSize: '40px', fontWeight: 800, color: '#1a7a3c', lineHeight: 1 }}>8K+</div>
              <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>Travailleurs actifs</div>
            </div>
            <div className="stat-divider" />
            <div>
              <div style={{ fontSize: '40px', fontWeight: 800, color: '#1a7a3c', lineHeight: 1 }}>24</div>
              <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>Gouvernorats</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="section-pad" style={{ background: '#f9fdf9' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span className="tag reveal">Comment ça marche</span>
          <h2 className="reveal d1 section-title" style={{ fontWeight: 800, color: '#0d1f14', marginTop: '16px' }}>Simple comme bonjour</h2>
        </div>
        <div className="steps-grid">
          {[
            { step: '01', title: 'Crée ton compte', desc: "Inscris-toi en tant qu'employeur ou travailleur en moins de 2 minutes.", img: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80' },
            { step: '02', title: 'Choisis ton gouvernorat', desc: 'Sélectionne ta région sur la carte interactive de la Tunisie.', img: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&q=80' },
            { step: '03', title: 'Connecte-toi', desc: "Poste une offre ou postule directement. C'est aussi simple que ça.", img: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=400&q=80' },
          ].map((item, i) => (
            <div key={i} className={`reveal d${i} card-hover`} style={{ background: '#fff', borderRadius: '24px', overflow: 'hidden', border: '1px solid #e8f5ee' }}>
              <div style={{ height: '190px', overflow: 'hidden' }}>
                <img className="img-cover" src={item.img} alt={item.title} />
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#1a7a3c', letterSpacing: '0.1em', marginBottom: '8px' }}>ÉTAPE {item.step}</div>
                <div style={{ fontSize: '19px', fontWeight: 700, color: '#0d1f14', marginBottom: '8px' }}>{item.title}</div>
                <div style={{ fontSize: '14px', color: '#666', lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GOVERNORATES */}
      <section className="section-pad" style={{ background: '#fff' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
          <span className="tag reveal">Couverture nationale</span>
          <h2 className="reveal d1 section-title" style={{ fontWeight: 800, color: '#0d1f14', margin: '16px 0 14px' }}>Partout en Tunisie</h2>
          <p className="reveal d2" style={{ fontSize: '16px', color: '#666', marginBottom: '40px', lineHeight: 1.7 }}>
            Des offres disponibles dans les 24 gouvernorats. Filtre par région et trouve ce qui est proche de toi.
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
      <section id="jobs" className="section-pad" style={{ background: '#f9fdf9' }}>
        <div className="roles-grid">
          <div className="reveal card-hover" style={{ background: '#0d1f14', borderRadius: '28px', overflow: 'hidden', color: '#fff' }}>
            <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
              <img className="img-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80" alt="employer" style={{ filter: 'brightness(0.55)' }} />
              <div style={{ position: 'absolute', top: 20, left: 20 }}>
                <span style={{ background: '#1a7a3c', color: '#fff', padding: '5px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600 }}>Employeur</span>
              </div>
            </div>
            <div style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '14px' }}>Tu recrutes ?</h3>
              <p style={{ color: '#9dc9ac', lineHeight: 1.7, marginBottom: '20px', fontSize: 15 }}>
                Publie tes offres, reçois des candidatures et trouve le bon profil parmi des milliers de travailleurs tunisiens.
              </p>
              {['Publie une offre en 2 min','Filtre par gouvernorat','Accepte ou refuse des candidats','Notifications en temps réel'].map(f => (
                <div key={f} className="check-item"><span style={{ color: '#4caf73', fontSize: 18 }}>✓</span><span style={{ color: '#c8e6d0', fontSize: 14 }}>{f}</span></div>
              ))}
              <button className="btn-primary" onClick={() => navigate('/register')} style={{ width: '100%', marginTop: '24px', textAlign: 'center' }}>Recruter maintenant →</button>
            </div>
          </div>
          <div className="reveal d1 card-hover" style={{ background: '#fff', borderRadius: '28px', overflow: 'hidden', border: '2px solid #1a7a3c' }}>
            <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
              <img className="img-cover" src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80" alt="worker" style={{ filter: 'brightness(0.7)' }} />
              <div style={{ position: 'absolute', top: 20, left: 20 }}>
                <span style={{ background: '#fff', color: '#1a7a3c', padding: '5px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600 }}>Travailleur</span>
              </div>
            </div>
            <div style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#0d1f14', marginBottom: '14px' }}>Tu cherches un job ?</h3>
              <p style={{ color: '#555', lineHeight: 1.7, marginBottom: '20px', fontSize: 15 }}>
                Crée ton profil, montre tes compétences et postule aux offres près de chez toi en quelques clics.
              </p>
              {['Profil complet et visible','Postule en 1 clic','Reçois des notifications','Avis et évaluations'].map(f => (
                <div key={f} className="check-item"><span style={{ color: '#1a7a3c', fontSize: 18 }}>✓</span><span style={{ color: '#444', fontSize: 14 }}>{f}</span></div>
              ))}
              <button className="btn-primary" onClick={() => navigate('/register')} style={{ width: '100%', marginTop: '24px', textAlign: 'center' }}>Trouver un job →</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #0d1f14 0%, #1a7a3c 100%)', color: '#fff' }}>
        <h2 className="reveal cta-title" style={{ fontWeight: 800, marginBottom: '18px' }}>Prêt à commencer ?</h2>
        <p className="reveal d1" style={{ fontSize: '17px', color: '#9dc9ac', maxWidth: '460px', margin: '0 auto 40px' }}>
          Rejoins des milliers de Tunisiens qui utilisent Khadamni pour trouver et offrir du travail.
        </p>
        <button className="reveal d2" onClick={() => navigate('/register')} style={{
          background: '#fff', color: '#1a7a3c', border: 'none',
          padding: '18px 44px', borderRadius: 100, fontSize: 16, fontWeight: 700,
          cursor: 'pointer', fontFamily: 'Sora, sans-serif',
          boxShadow: '0 4px 24px rgba(0,0,0,0.2)', transition: 'transform 0.15s', display: 'inline-block'
        }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          Créer mon compte gratuitement
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '36px 60px', background: '#0a1a10' }}>
        <div className="footer-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: '#1a7a3c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L3 7v11h5v-5h4v5h5V7L10 2z" fill="white"/>
              </svg>
            </div>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>Khadamni</span>
          </div>
          <div style={{ color: '#5a8a6a', fontSize: 13 }}>© 2026 Khadamni · Tunisie · Tous droits réservés</div>
        </div>
      </footer>
    </div>
  )
}