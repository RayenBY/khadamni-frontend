import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../store/AuthContext'
import api from '../services/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight, faBox, faBroom, faCheck, faClock, faLaptopCode, faLeaf, faLocationDot, faMagnifyingGlass, faMapLocationDot, faMoneyBillWave, faMugSaucer, faPalette, faSeedling, faStar, faTruck, faUtensils, faXmark } from '@fortawesome/free-solid-svg-icons'

const CATEGORIES = ['restaurant', 'café', 'jardinage', 'nettoyage', 'agricole', 'livraison', 'design', 'informatique', 'événementiel', 'autre']
const CITIES = ['Tunis', 'Sfax', 'Sousse', 'Monastir', 'Bizerte', 'Nabeul', 'Ariana', 'Ben Arous', 'Manouba', 'Zaghouan', 'Béja', 'Jendouba', 'Kef', 'Siliana', 'Kairouan', 'Kasserine', 'Sidi Bouzid', 'Mahdia', 'Gafsa', 'Tozeur', 'Kébili', 'Gabès', 'Médenine', 'Tataouine']

const CATEGORY_ICONS = {
  restaurant: faUtensils, café: faMugSaucer, jardinage: faLeaf, nettoyage: faBroom,
  agricole: faSeedling, livraison: faTruck, design: faPalette, informatique: faLaptopCode,
  événementiel: faStar, autre: faBox,
}

const CATEGORY_COLORS = {
  restaurant: '#ff6b35', café: '#8b5cf6', jardinage: '#16a34a', nettoyage: '#0ea5e9',
  agricole: '#84cc16', livraison: '#f59e0b', design: '#ec4899', informatique: '#3b82f6',
  événementiel: '#f97316', autre: '#6b7280'
}

function OfferCard({ offer, onClick }) {
  const { t } = useTranslation()
  const categoryColor = CATEGORY_COLORS[offer.category] || '#6b7280'
  const categoryIcon = CATEGORY_ICONS[offer.category] || faBox
  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000)
    if (diff < 3600) return `${Math.floor(diff / 60)}min`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`
    return `${Math.floor(diff / 86400)}j`
  }

  return (
    <div className="offer-card" onClick={() => onClick(offer._id)}>
      {offer.urgent && (
        <div className="urgent-badge">{t('common.urgent')}</div>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `${categoryColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
            <FontAwesomeIcon icon={categoryIcon} style={{ color: categoryColor }} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: categoryColor, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>
              {offer.category}
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3, margin: 0 }}>
              {offer.title}
            </h3>
          </div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-placeholder)', whiteSpace: 'nowrap', marginLeft: 8, marginTop: 2 }}>
          {timeAgo(offer.createdAt)}
        </div>
      </div>

      <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {offer.description}
      </p>

      {offer.requiredSkills?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
          {offer.requiredSkills.slice(0, 3).map(s => (
            <span key={s} style={{ background: 'var(--primary-light)', color: '#1a7a3c', border: '1px solid var(--border-3)', padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600 }}><FontAwesomeIcon icon={faCheck} style={{ marginRight: 6 }} />{s}</span>
          ))}
          {offer.requiredSkills.length > 3 && <span style={{ fontSize: 11, color: 'var(--text-placeholder)', alignSelf: 'center' }}>+{offer.requiredSkills.length - 3}</span>}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ background: 'var(--primary-light)', color: '#1a7a3c', border: '1px solid var(--border-3)', padding: '4px 10px', borderRadius: 100, fontSize: 12, fontWeight: 600 }}>
            <FontAwesomeIcon icon={faMoneyBillWave} style={{ marginRight: 6 }} /> {offer.salary?.amount} TND/{offer.salary?.unit}
          </span>
          <span style={{ background: 'var(--border)', color: 'var(--text-muted)', border: '1px solid #e5e5e5', padding: '4px 10px', borderRadius: 100, fontSize: 12 }}>
            <FontAwesomeIcon icon={faLocationDot} style={{ marginRight: 6 }} /> {offer.location?.city}
          </span>
          <span style={{ background: 'var(--border)', color: 'var(--text-muted)', border: '1px solid #e5e5e5', padding: '4px 10px', borderRadius: 100, fontSize: 12 }}>
            <FontAwesomeIcon icon={faClock} style={{ marginRight: 6 }} /> {offer.duration}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {offer.employer?.avatar ? (
            <img src={offer.employer.avatar} alt="" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#1a7a3c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>
              {offer.employer?.name?.[0] || '?'}
            </div>
          )}
          <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>{offer.employer?.name}</span>
        </div>
      </div>

      <div className="card-apply-btn">
        {t('offers.viewOffer')}
      </div>
    </div>
  )
}

export default function Offers() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t } = useTranslation()

  const savedGovs = JSON.parse(sessionStorage.getItem('selectedGovernorates') || '[]')

  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [filters, setFilters] = useState({
    city: savedGovs[0] || '',
    category: '',
    urgent: '',
    search: '',
    skill: '',
    page: 1,
  })
  const [selectedCities, setSelectedCities] = useState(savedGovs)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const fetchOffers = async (f) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (f.category) params.append('category', f.category)
      if (f.city) params.append('city', f.city)
      if (f.urgent) params.append('urgent', f.urgent)
      if (f.search) params.append('search', f.search)
      if (f.skill) params.append('skill', f.skill)
      params.append('page', f.page)
      params.append('limit', 12)
      const res = await api.get(`/offers?${params}`)
      setOffers(res.data.data.offers)
      setPagination(res.data.pagination)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOffers(filters)
  }, [filters])

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const clearFilters = () => {
    setSelectedCities([])
    setFilters({ city: '', category: '', urgent: '', search: '', skill: '', page: 1 })
  }

  const activeFiltersCount = [filters.category, filters.city, filters.urgent, filters.skill].filter(Boolean).length

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", minHeight: '100vh', background: 'var(--bg)' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        .offer-card {
          background: var(--surface);
          border: 1.5px solid #e8f0ec;
          border-radius: 18px;
          padding: 20px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
          position: relative;
          overflow: hidden;
        }
        .offer-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 36px rgba(26,122,60,0.1);
          border-color: var(--border-3);
        }
        .offer-card:hover .card-apply-btn { opacity: 1; transform: translateY(0); }
        .card-apply-btn {
          margin-top: 14px;
          background: #1a7a3c;
          color: #fff;
          text-align: center;
          padding: 10px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 0.2s, transform 0.2s;
        }
        .urgent-badge {
          position: absolute;
          top: 14px;
          right: 14px;
          background: #fff3e0;
          color: #e65100;
          border: 1px solid #ffcc80;
          padding: 3px 10px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
        }
        .filter-btn {
          padding: 8px 16px;
          border-radius: 100px;
          border: 1.5px solid var(--border-2);
          background: var(--surface);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          color: var(--text-2);
          transition: all 0.18s;
          white-space: nowrap;
        }
        .filter-btn:hover { border-color: #1a7a3c; color: #1a7a3c; background: var(--primary-light); }
        .filter-btn.active { background: #1a7a3c; color: #fff; border-color: #1a7a3c; }
        .filter-select {
          padding: 9px 14px;
          border-radius: 100px;
          border: 1.5px solid var(--border-2);
          background: var(--surface);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          color: var(--text-2);
          outline: none;
          transition: border-color 0.18s;
          appearance: none;
          padding-right: 32px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
        }
        .filter-select:focus { border-color: #1a7a3c; }
        .filter-select.active { border-color: #1a7a3c; color: #1a7a3c; background-color: var(--primary-light); }
        .search-input {
          padding: 10px 16px 10px 40px;
          border-radius: 100px;
          border: 1.5px solid var(--border-2);
          background: var(--surface);
          font-size: 14px;
          font-family: 'Sora', sans-serif;
          color: var(--text-2);
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
          width: 100%;
        }
        .search-input:focus { border-color: #1a7a3c; box-shadow: 0 0 0 3px rgba(26,122,60,0.1); }
        .search-input::placeholder { color: var(--text-placeholder); }
        .offers-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .page-btn {
          width: 36px; height: 36px; border-radius: 10px;
          border: 1.5px solid var(--border-2); background: var(--surface);
          font-size: 14px; font-weight: 600; cursor: pointer;
          font-family: 'Sora', sans-serif; color: var(--text-2);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.18s;
        }
        .page-btn:hover { border-color: #1a7a3c; color: #1a7a3c; background: var(--primary-light); }
        .page-btn.active { background: #1a7a3c; color: #fff; border-color: #1a7a3c; }
        .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .skeleton {
          background: linear-gradient(90deg, var(--skeleton-1) 25%, var(--skeleton-2) 50%, var(--skeleton-1) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.2s infinite;
          border-radius: 10px;
        }
        @keyframes shimmer { to { background-position: -200% 0; } }
        .nav-inner { padding: 0 40px; }
        @media (max-width: 1024px) { .offers-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) {
          .offers-grid { grid-template-columns: 1fr; }
          .nav-inner { padding: 0 16px; }
          .filters-bar { flex-wrap: wrap; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="nav-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#1a7a3c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FontAwesomeIcon icon={faMapLocationDot} style={{ fontSize: 17, color: 'white' }} />
            </div>
            <span style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)' }}>Khadamni</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => navigate('/map')} style={{ background: 'var(--primary-light)', color: '#1a7a3c', border: '1px solid var(--border-3)', padding: '7px 14px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>
              <FontAwesomeIcon icon={faMapLocationDot} style={{ marginRight: 6 }} />Carte
            </button>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#1a7a3c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', cursor: 'pointer' }}
                  onClick={() => navigate('/profile')}>
                  {user.name?.[0] || '?'}
                </div>
              </div>
            ) : (
              <button onClick={() => navigate('/login')} style={{ background: '#1a7a3c', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 100, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>
                Se connecter
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* PAGE HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #0d1f14 0%, #1a7a3c 100%)', padding: '40px 40px 48px', color: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, marginBottom: 8 }}>
                {t('offers.title')}
              </h1>
              <p style={{ color: '#9dc9ac', fontSize: 15 }}>
                {pagination.total > 0 ? t('offers.count', { count: pagination.total }) : t('offers.searching')}
                {savedGovs.length > 0 && ` ${t('offers.filteredBy', { count: savedGovs.length })}`}
              </p>
            </div>
            {user?.role === 'employer' && (
              <button onClick={() => navigate('/post-offer')} style={{ background: '#fff', color: '#1a7a3c', border: 'none', padding: '12px 24px', borderRadius: 100, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
                {t('offers.postOffer')}
              </button>
            )}
          </div>

          {/* Search bar */}
          <div style={{ marginTop: 24, position: 'relative', maxWidth: 520 }}>
            <FontAwesomeIcon icon={faMagnifyingGlass} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.4, color: '#333' }} />
            <input
              className="search-input"
              placeholder={t('offers.searchPlaceholder')}
              value={filters.search}
              onChange={e => updateFilter('search', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 40px 60px' }}>

        {/* FILTERS BAR */}
        <div className="filters-bar" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
          <select className={`filter-select ${filters.category ? 'active' : ''}`} value={filters.category} onChange={e => updateFilter('category', e.target.value)}>
            <option value="">{t('offers.allCategories')}</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select className={`filter-select ${filters.city ? 'active' : ''}`} value={filters.city} onChange={e => updateFilter('city', e.target.value)}>
            <option value="">{t('offers.allCities')}</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <button className={`filter-btn ${filters.urgent === 'true' ? 'active' : ''}`} onClick={() => updateFilter('urgent', filters.urgent === 'true' ? '' : 'true')}>
            {t('offers.urgentOnly')}
          </button>

          {/* Skill filter */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              className={`filter-select ${filters.skill ? 'active' : ''}`}
              style={{ paddingLeft: 14, paddingRight: filters.skill ? 30 : 14, borderRadius: 100, minWidth: 160 }}
              placeholder={t('offers.skillPlaceholder')}
              value={filters.skill}
              onChange={e => updateFilter('skill', e.target.value)}
            />
            {filters.skill && (
              <button onClick={() => updateFilter('skill', '')} style={{ position: 'absolute', right: 10, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)', fontSize: 16, lineHeight: 1, padding: 0 }}><FontAwesomeIcon icon={faXmark} /></button>
            )}
          </div>

          {activeFiltersCount > 0 && (
            <button onClick={clearFilters} style={{ background: '#fff0f0', color: '#cc0000', border: '1px solid #ffcccc', padding: '8px 16px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>
              {t('offers.clearFilters', { count: activeFiltersCount })}
            </button>
          )}

          {savedGovs.length > 0 && (
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#1a7a3c', background: 'var(--primary-light)', border: '1px solid var(--border-3)', padding: '6px 14px', borderRadius: 100 }}>
              {t('offers.mapFilter', { count: savedGovs.length })}
            </div>
          )}
        </div>

        {/* OFFERS GRID */}
        {loading ? (
          <div className="offers-grid">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} style={{ background: 'var(--surface)', border: '1.5px solid #e8f0ec', borderRadius: 18, padding: 20 }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                  <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ height: 10, width: '40%', marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 14, width: '80%' }} />
                  </div>
                </div>
                <div className="skeleton" style={{ height: 10, marginBottom: 6 }} />
                <div className="skeleton" style={{ height: 10, width: '70%', marginBottom: 16 }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <div className="skeleton" style={{ height: 26, width: 80, borderRadius: 100 }} />
                  <div className="skeleton" style={{ height: 26, width: 70, borderRadius: 100 }} />
                </div>
              </div>
            ))}
          </div>
        ) : offers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: 56, marginBottom: 16, color: 'var(--text-placeholder)' }}><FontAwesomeIcon icon={faMagnifyingGlass} /></div>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>{t('offers.emptyTitle')}</h3>
            <p style={{ color: 'var(--text-faint)', fontSize: 15, marginBottom: 24 }}>{t('offers.emptyDesc')}</p>
            <button onClick={clearFilters} style={{ background: '#1a7a3c', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 100, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>
              {t('offers.seeAllOffers')}
            </button>
          </div>
        ) : (
          <div className="offers-grid">
            {offers.map(offer => (
              <OfferCard key={offer._id} offer={offer} onClick={(id) => navigate(`/offers/${id}`)} />
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {pagination.pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 40 }}>
            <button className="page-btn" disabled={filters.page === 1} onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))}><FontAwesomeIcon icon={faArrowLeft} /></button>
            {Array.from({ length: pagination.pages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === pagination.pages || Math.abs(p - filters.page) <= 1)
              .reduce((acc, p, i, arr) => {
                if (i > 0 && p - arr[i - 1] > 1) acc.push('...')
                acc.push(p)
                return acc
              }, [])
              .map((p, i) => p === '...'
                ? <span key={i} style={{ color: 'var(--text-placeholder)', fontSize: 14 }}>...</span>
                : <button key={p} className={`page-btn ${filters.page === p ? 'active' : ''}`} onClick={() => setFilters(prev => ({ ...prev, page: p }))}>{p}</button>
              )
            }
            <button className="page-btn" disabled={filters.page === pagination.pages} onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))}><FontAwesomeIcon icon={faArrowRight} /></button>
          </div>
        )}
      </div>
    </div>
  )
}
