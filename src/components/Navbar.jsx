import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import { useTheme } from '../store/ThemeContext'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import logo from '../assets/images/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faCheck, faChevronDown, faCoins, faMoon, faSun, faXmark } from '@fortawesome/free-solid-svg-icons'
import NotificationBell from './NotificationBell'

const FONT = "https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap"

const LANGS = [
  { code: 'fr', label: 'Français',  flag: 'fr' },
  { code: 'en', label: 'English',   flag: 'gb' },
  { code: 'ar', label: 'العربية',   flag: 'tn' },
]

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, refreshUser } = useAuth()
  const { isDark, toggle: toggleTheme } = useTheme()
  const { t, i18n } = useTranslation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  const currentLang = LANGS.find(l => l.code === i18n.language) || LANGS[0]

  useEffect(() => {
    if (user) refreshUser?.()
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/')
    setDropdownOpen(false)
  }

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/')

  const navLink = (to, label) => (
    <Link to={to} style={{
      color: isActive(to) ? '#1a7a3c' : 'var(--text-2)',
      textDecoration: 'none',
      fontSize: 14,
      fontWeight: isActive(to) ? 700 : 500,
      padding: '5px 0',
      borderBottom: `2px solid ${isActive(to) ? '#1a7a3c' : 'transparent'}`,
      transition: 'color 0.18s',
      fontFamily: "'Sora', sans-serif",
    }}
      onMouseEnter={e => { if (!isActive(to)) e.currentTarget.style.color = '#1a7a3c' }}
      onMouseLeave={e => { if (!isActive(to)) e.currentTarget.style.color = 'var(--text-2)' }}
    >
      {label}
    </Link>
  )

  const dropdownItems = [
    { label: t('nav.myProfile'), path: '/profile' },
    { label: t('nav.dashboard'), path: '/dashboard' },
    { label: t('nav.messages'), path: '/messages' },
    ...(user?.role === 'employer' ? [{ label: t('nav.postOffer'), path: '/post-offer' }] : []),
    ...(user?.role === 'worker'   ? [{ label: t('nav.mySkills'), path: '/post-worker-profile' }] : []),
    ...(user?.role === 'admin'    ? [{ label: t('nav.admin'), path: '/admin' }] : []),
  ]

  const roleLabel = user?.role === 'worker' ? t('common.role_worker') : user?.role === 'employer' ? t('common.role_employer') : t('common.role_admin')

  return (
    <>
      <link href={FONT} rel="stylesheet" />
      <style>{`
        .dd-item:hover { background: var(--primary-light) !important; color: #1a7a3c !important; }
        .mob-link { display: block; padding: 11px 16px; border-radius: 10px; color: var(--text-2); text-decoration: none; font-size: 14px; font-weight: 500; font-family: 'Sora',sans-serif; transition: background .18s, color .18s; }
        .mob-link:hover, .mob-link.active { background: var(--primary-light); color: #1a7a3c; }
        .ham { display: none; background: none; border: none; cursor: pointer; padding: 4px; }
        .mob-menu { display: none; position: fixed; top: 64px; left: 0; right: 0; background: var(--surface); border-bottom: 1px solid var(--border); padding: 12px 20px 16px; flex-direction: column; gap: 2px; z-index: 99; box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
        .mob-menu.open { display: flex; }
        .lang-dd-item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 9px 14px; background: none; border: none; cursor: pointer; font-family: 'Sora',sans-serif; font-size: 13px; color: var(--text-2); transition: background .15s; text-align: left; }
        .lang-dd-item:hover { background: var(--primary-light); }
        .theme-toggle { background: none; border: 1.5px solid var(--border); border-radius: 100px; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .18s; color: var(--text-faint); }
        .theme-toggle:hover { border-color: #1a7a3c; color: #1a7a3c; background: var(--primary-light); }
        .token-badge { display: flex; align-items: center; gap: 5px; background: var(--primary-light); border: 1.5px solid var(--border-3); border-radius: 100px; padding: 5px 12px; font-size: 12px; font-weight: 700; color: #1a7a3c; white-space: nowrap; }
        @media (max-width: 680px) {
          .nav-center { display: none !important; }
          .nav-right  { display: none !important; }
          .ham        { display: block !important; }
          .token-badge { display: none !important; }
        }
      `}</style>

      {(dropdownOpen || menuOpen || langOpen) && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 89 }}
          onClick={() => { setDropdownOpen(false); setMenuOpen(false); setLangOpen(false) }} />
      )}

      <nav style={{
        position: 'sticky', top: 0, zIndex: 90,
        background: 'var(--nav-bg)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)', height: 64,
        display: 'flex', alignItems: 'center',
        fontFamily: "'Sora', sans-serif",
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: 1200, margin: '0 auto', padding: '0 28px' }}>

          <Link to={user ? '/dashboard' : '/'} style={{ textDecoration: 'none', flexShrink: 0 }}>
            <img src={logo} alt="Khadamni" style={{ height: 38, display: 'block', filter: isDark ? 'brightness(0) invert(1)' : 'none' }} />
          </Link>

          <div className="nav-center" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {navLink('/offers', t('nav.offers'))}
            {navLink('/workers', t('nav.talents'))}
          </div>

          <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

            {/* Token balance */}
            {user && (
              <div className="token-badge">
                <FontAwesomeIcon icon={faCoins} style={{ fontSize: 12 }} />
                {user.tokens ?? 0}
              </div>
            )}

            {/* Notification bell */}
            {user && <NotificationBell />}

            {/* Dark mode toggle */}
            <button className="theme-toggle" onClick={toggleTheme} title={isDark ? 'Light mode' : 'Dark mode'}>
              {isDark
                ? <FontAwesomeIcon icon={faSun} style={{ fontSize: 16 }} />
                : <FontAwesomeIcon icon={faMoon} style={{ fontSize: 16 }} />
              }
            </button>

            {/* Language switcher */}
            <div style={{ position: 'relative', marginRight: 6 }}>
              <button onClick={() => setLangOpen(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px 5px 6px', borderRadius: 100, border: `1.5px solid ${langOpen ? '#b8dfc8' : 'var(--border)'}`, background: langOpen ? 'var(--primary-light)' : 'var(--surface)', cursor: 'pointer', fontFamily: 'Sora,sans-serif', transition: 'all .18s' }}>
                <span className={`fi fi-${currentLang.flag}`} style={{ width: 24, height: 24, borderRadius: '50%', backgroundSize: 'cover', display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-faint)' }}>{currentLang.code.toUpperCase()}</span>
                <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: 11, transform: langOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s', flexShrink: 0, color: 'var(--text-faint)' }} />
              </button>
              {langOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.15)', minWidth: 160, overflow: 'hidden', zIndex: 100 }}>
                  {LANGS.map(l => (
                    <button key={l.code} className="lang-dd-item" onClick={() => { i18n.changeLanguage(l.code); setLangOpen(false) }}>
                      <span className={`fi fi-${l.flag}`} style={{ width: 26, height: 26, borderRadius: '50%', backgroundSize: 'cover', display: 'inline-block', flexShrink: 0 }} />
                      <span style={{ flex: 1 }}>{l.label}</span>
                      {i18n.language === l.code && <span style={{ color: '#1a7a3c', fontWeight: 700, fontSize: 14 }}><FontAwesomeIcon icon={faCheck} /></span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <div style={{ position: 'relative' }}>
                <button onClick={() => setDropdownOpen(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 12px 5px 6px', borderRadius: 100, border: `1.5px solid ${dropdownOpen ? '#b8dfc8' : 'var(--border)'}`, background: dropdownOpen ? 'var(--primary-light)' : 'var(--surface)', cursor: 'pointer', fontFamily: 'Sora,sans-serif', transition: 'all .18s' }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#1a7a3c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                    {user.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name?.split(' ')[0]}
                  </span>
                  <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: 11, transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s', flexShrink: 0, color: 'var(--text-faint)' }} />
                </button>

                {dropdownOpen && (
                  <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.15)', minWidth: 210, overflow: 'hidden', zIndex: 100 }}>
                    <div style={{ padding: '13px 16px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{user.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-placeholder)', marginTop: 2 }}>
                        {roleLabel} · {user.city}
                      </div>
                      <div style={{ fontSize: 11, color: '#1a7a3c', fontWeight: 600, marginTop: 3 }}>
                        <FontAwesomeIcon icon={faCoins} style={{ marginRight: 4 }} />{user.tokens ?? 0} tokens
                      </div>
                    </div>
                    {dropdownItems.map(item => (
                      <button key={item.path} className="dd-item" onClick={() => { navigate(item.path); setDropdownOpen(false) }}
                        style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text-2)', fontFamily: 'Sora,sans-serif' }}>
                        {item.label}
                      </button>
                    ))}
                    <div style={{ borderTop: '1px solid var(--border)' }}>
                      <button className="dd-item" onClick={handleLogout}
                        style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#e53e3e', fontFamily: 'Sora,sans-serif' }}>
                        {t('nav.logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button onClick={() => navigate('/login')} style={{ background: 'none', color: 'var(--text-2)', border: '1.5px solid var(--border-2)', padding: '8px 18px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}>
                  {t('common.login')}
                </button>
                <button onClick={() => navigate('/register')} style={{ background: '#1a7a3c', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 100, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora,sans-serif', boxShadow: '0 3px 12px rgba(26,122,60,.25)' }}>
                  {t('common.register')}
                </button>
              </>
            )}
          </div>

          <button className="ham" onClick={() => setMenuOpen(v => !v)}>
            <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} style={{ fontSize: 22, color: '#1a7a3c' }} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mob-menu ${menuOpen ? 'open' : ''}`}>
        <Link to="/offers" className={`mob-link ${isActive('/offers') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>{t('nav.offers')}</Link>
        <Link to="/workers" className={`mob-link ${isActive('/workers') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>{t('nav.talents')}</Link>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', fontSize: 13, fontWeight: 700, color: '#1a7a3c' }}>
            <FontAwesomeIcon icon={faCoins} />
            {user.tokens ?? 0} tokens
          </div>
        )}
        <div style={{ display: 'flex', gap: 6, padding: '8px 0', alignItems: 'center' }}>
          {LANGS.map(l => (
            <button key={l.code} onClick={() => { i18n.changeLanguage(l.code); setMenuOpen(false) }}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 100, border: `1.5px solid ${i18n.language === l.code ? '#1a7a3c' : 'var(--border)'}`, background: i18n.language === l.code ? 'var(--primary-light)' : 'var(--surface)', cursor: 'pointer', fontFamily: 'Sora,sans-serif', fontSize: 12, fontWeight: 700, color: i18n.language === l.code ? '#1a7a3c' : 'var(--text-faint)', transition: 'all .15s' }}>
              <span className={`fi fi-${l.flag}`} style={{ width: 18, height: 18, borderRadius: '50%', backgroundSize: 'cover', display: 'inline-block' }} />
              <span>{l.code.toUpperCase()}</span>
            </button>
          ))}
          <button className="theme-toggle" onClick={toggleTheme} style={{ marginLeft: 'auto' }}>
            {isDark
              ? <FontAwesomeIcon icon={faSun} style={{ fontSize: 15 }} />
              : <FontAwesomeIcon icon={faMoon} style={{ fontSize: 15 }} />
            }
          </button>
        </div>
        {user ? (
          <>
            <div style={{ height: 1, background: 'var(--border)', margin: '6px 0' }} />
            {dropdownItems.map(item => (
              <Link key={item.path} to={item.path} className={`mob-link ${isActive(item.path) ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>{item.label}</Link>
            ))}
            <div style={{ height: 1, background: 'var(--border)', margin: '6px 0' }} />
            <button onClick={() => { handleLogout(); setMenuOpen(false) }} style={{ textAlign: 'left', padding: '11px 16px', borderRadius: 10, color: '#e53e3e', background: 'none', border: 'none', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}>
              {t('nav.logout')}
            </button>
          </>
        ) : (
          <>
            <div style={{ height: 1, background: 'var(--border)', margin: '6px 0' }} />
            <Link to="/login" className="mob-link" onClick={() => setMenuOpen(false)}>{t('common.login')}</Link>
            <Link to="/register" className="mob-link" onClick={() => setMenuOpen(false)}>{t('common.register')}</Link>
          </>
        )}
      </div>
    </>
  )
}