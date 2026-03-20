import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../store/AuthContext'
import api from '../services/api'
import Navbar from '../components/Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft, faArrowRight, faBox, faBroom, faClock, faLaptopCode,
  faLeaf, faLocationDot, faMagnifyingGlass, faMugSaucer, faPalette,
  faSeedling, faStar, faTruck, faUtensils, faXmark, faBolt,
  faTableCells, faBars, faMoneyBillWave, faCheck
} from '@fortawesome/free-solid-svg-icons'

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

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000)
  if (diff < 3600) return `${Math.floor(diff / 60)}min`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  return `${Math.floor(diff / 86400)}j`
}

function OfferCard({ offer, onClick, listView }) {
  const categoryColor = CATEGORY_COLORS[offer.category] || '#6b7280'
  const categoryIcon = CATEGORY_ICONS[offer.category] || faBox

  if (listView) {
    return (
      <div className="offer-card offer-list-item" onClick={() => onClick(offer._id)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
          <div style={{ width: 42, height: 42, borderRadius: 11, background: `${categoryColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FontAwesomeIcon icon={categoryIcon} style={{ color: categoryColor, fontSize: 18 }} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: categoryColor, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{offer.category}</div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{offer.title}</h3>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, flexWrap: 'wrap' }}>
          <span style={{ background: 'var(--primary-light)', color: '#1a7a3c', border: '1px solid var(--border-3)', padding: '4px 10px', borderRadius: 100, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
            <FontAwesomeIcon icon={faMoneyBillWave} style={{ marginRight: 5 }} />{offer.salary?.amount} TND/{offer.salary?.unit}
          </span>
          <span style={{ background: 'var(--border)', color: 'var(--text-muted)', padding: '4px 10px', borderRadius: 100, fontSize: 12, whiteSpace: 'nowrap' }}>
            <FontAwesomeIcon icon={faLocationDot} style={{ marginRight: 5 }} />{offer.location?.city}
          </span>
          <span style={{ background: 'var(--border)', color: 'var(--text-muted)', padding: '4px 10px', borderRadius: 100, fontSize: 12, whiteSpace: 'nowrap' }}>
            <FontAwesomeIcon icon={faClock} style={{ marginRight: 5 }} />{offer.duration}
          </span>
          {offer.urgent && <span className="urgent-badge" style={{ position: 'static' }}>⚡ Urgent</span>}
          <span style={{ fontSize: 11, color: 'var(--text-placeholder)', whiteSpace: 'nowrap' }}>{timeAgo(offer.createdAt)}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="offer-card" onClick={() => onClick(offer._id)}>
      {offer.urgent && <div className="urgent-badge">⚡ Urgent</div>}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `${categoryColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FontAwesomeIcon icon={categoryIcon} style={{ color: categoryColor, fontSize: 20 }} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: categoryColor, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>{offer.category}</div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3, margin: 0 }}>{offer.title}</h3>
          </div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-placeholder)', whiteSpace: 'nowrap', marginLeft: 8, marginTop: 2 }}>{timeAgo(offer.createdAt)}</div>
      </div>

      <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {offer.description}
      </p>

      {offer.requiredSkills?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
          {offer.requiredSkills.slice(0, 3).map(s => (
            <span key={s} style={{ background: 'var(--primary-light)', color: '#1a7a3c', border: '1px solid var(--border-3)', padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600 }}>
              <FontAwesomeIcon icon={faCheck} style={{ marginRight: 5 }} />{s}
            </span>
          ))}
          {offer.requiredSkills.length > 3 && <span style={{ fontSize: 11, color: 'var(--text-placeholder)', alignSelf: 'center' }}>+{offer.requiredSkills.length - 3}</span>}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ background: 'var(--primary-light)', color: '#1a7a3c', border: '1px solid var(--border-3)', padding: '4px 10px', borderRadius: 100, fontSize: 12, fontWeight: 600 }}>
            <FontAwesomeIcon icon={faMoneyBillWave} style={{ marginRight: 5 }} />{offer.salary?.amount} TND/{offer.salary?.unit}
          </span>
          <span style={{ background: 'var(--border)', color: 'var(--text-muted)', padding: '4px 10px', borderRadius: 100, fontSize: 12 }}>
            <FontAwesomeIcon icon={faLocationDot} style={{ marginRight: 5 }} />{offer.location?.city}
          </span>
          <span style={{ background: 'var(--border)', color: 'var(--text-muted)', padding: '4px 10px', borderRadius: 100, fontSize: 12 }}>
            <FontAwesomeIcon icon={faClock} style={{ marginRight: 5 }} />{offer.duration}
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
      <div className="card-apply-btn">Voir l'offre →</div>
    </div>
  )
}

function SkeletonCard({ listView }) {
  if (listView) {
    return (
      <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 14, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div className="skeleton" style={{ width: 42, height: 42, borderRadius: 11, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ height: 10, width: '30%', marginBottom: 7 }} />
          <div className="skeleton" style={{ height: 14, width: '60%' }} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="skeleton" style={{ height: 26, width: 90, borderRadius: 100 }} />
          <div className="skeleton" style={{ height: 26, width: 70, borderRadius: 100 }} />
        </div>
      </div>
    )
  }
  return (
    <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 18, padding: 20 }}>
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
  )
}

export default function Offers() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t } = useTranslation()

  const savedGovs = JSON.parse(sessionStorage.getItem('selectedGovernorates') || '[]')

  const [urgentOffers, setUrgentOffers] = useState([])
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [urgentLoading, setUrgentLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [filters, setFilters] = useState({
    city: savedGovs[0] || '',
    category: '',
    search: '',
    skill: '',
    page: 1,
  })
  const [listView, setListView] = useState(() => localStorage.getItem('offersListView') === 'true')

  // Fetch urgent offers separately (non-paginated, max 6)
  useEffect(() => {
    const fetchUrgent = async () => {
      setUrgentLoading(true)
      try {
        const params = new URLSearchParams({ urgent: 'true', limit: 6, page: 1 })
        if (filters.city) params.append('city', filters.city)
        if (filters.category) params.append('category', filters.category)
        const res = await api.get(`/offers?${params}`)
        setUrgentOffers(res.data.data.offers)
      } catch (err) { console.error(err) }
      finally { setUrgentLoading(false) }
    }
    fetchUrgent()
  }, [filters.city, filters.category])

  // Fetch normal (non-urgent) offers with pagination
  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (filters.category) params.append('category', filters.category)
        if (filters.city) params.append('city', filters.city)
        if (filters.search) params.append('search', filters.search)
        if (filters.skill) params.append('skill', filters.skill)
        params.append('urgent', 'false')
        params.append('page', filters.page)
        params.append('limit', 10)
        const res = await api.get(`/offers?${params}`)
        setOffers(res.data.data.offers)
        setPagination(res.data.pagination)
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    fetchOffers()
  }, [filters])

  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value, page: 1 }))

  const clearFilters = () => setFilters({ city: '', category: '', search: '', skill: '', page: 1 })

  const toggleListView = (val) => {
    setListView(val)
    localStorage.setItem('offersListView', val)
  }

  const activeFiltersCount = [filters.category, filters.city, filters.skill].filter(Boolean).length

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", minHeight: '100vh', background: 'var(--bg)' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        .offer-card {
          background: var(--surface); border: 1.5px solid var(--border);
          border-radius: 18px; padding: 20px; cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; position: relative; overflow: hidden;
        }
        .offer-card:hover { transform: translateY(-3px); box-shadow: 0 12px 36px rgba(26,122,60,0.1); border-color: var(--border-3); }
        .offer-card:hover .card-apply-btn { opacity: 1; transform: translateY(0); }
        .offer-list-item { border-radius: 14px !important; padding: 14px 20px !important; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
        .offer-list-item:hover { transform: translateX(4px) !important; }
        .card-apply-btn { margin-top: 14px; background: #1a7a3c; color: #fff; text-align: center; padding: 10px; border-radius: 10px; font-size: 13px; font-weight: 700; opacity: 0; transform: translateY(4px); transition: opacity 0.2s, transform 0.2s; }
        .urgent-badge { position: absolute; top: 14px; right: 14px; background: #fff3e0; color: #e65100; border: 1px solid #ffcc80; padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 700; }
        .filter-btn { padding: 8px 16px; border-radius: 100px; border: 1.5px solid var(--border-2); background: var(--surface); font-size: 13px; font-weight: 500; cursor: pointer; font-family: 'Sora', sans-serif; color: var(--text-2); transition: all 0.18s; white-space: nowrap; }
        .filter-btn:hover { border-color: #1a7a3c; color: #1a7a3c; background: var(--primary-light); }
        .filter-btn.active { background: #1a7a3c; color: #fff; border-color: #1a7a3c; }
        .filter-select { padding: 9px 32px 9px 14px; border-radius: 100px; border: 1.5px solid var(--border-2); background: var(--surface); font-size: 13px; font-weight: 500; cursor: pointer; font-family: 'Sora', sans-serif; color: var(--text-2); outline: none; transition: border-color 0.18s; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; }
        .filter-select:focus { border-color: #1a7a3c; }
        .filter-select.active { border-color: #1a7a3c; color: #1a7a3c; background-color: var(--primary-light); }
        .search-input { padding: 10px 16px 10px 40px; border-radius: 100px; border: 1.5px solid var(--border-2); background: var(--surface); font-size: 14px; font-family: 'Sora', sans-serif; color: var(--text-2); outline: none; transition: border-color 0.18s, box-shadow 0.18s; width: 100%; }
        .search-input:focus { border-color: #1a7a3c; box-shadow: 0 0 0 3px rgba(26,122,60,0.1); }
        .search-input::placeholder { color: var(--text-placeholder); }
        .offers-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .offers-list { display: flex; flex-direction: column; gap: 10px; }
        .urgent-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .page-btn { width: 36px; height: 36px; border-radius: 10px; border: 1.5px solid var(--border-2); background: var(--surface); font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Sora', sans-serif; color: var(--text-2); display: flex; align-items: center; justify-content: center; transition: all 0.18s; }
        .page-btn:hover { border-color: #1a7a3c; color: #1a7a3c; background: var(--primary-light); }
        .page-btn.active { background: #1a7a3c; color: #fff; border-color: #1a7a3c; }
        .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .skeleton { background: linear-gradient(90deg, var(--skeleton-1) 25%, var(--skeleton-2) 50%, var(--skeleton-1) 75%); background-size: 200% 100%; animation: shimmer 1.2s infinite; border-radius: 10px; }
        @keyframes shimmer { to { background-position: -200% 0; } }
        .view-toggle-btn { width: 34px; height: 34px; border-radius: 9px; border: 1.5px solid var(--border-2); background: var(--surface); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.18s; color: var(--text-faint); }
        .view-toggle-btn.active { background: #1a7a3c; border-color: #1a7a3c; color: #fff; }
        .view-toggle-btn:hover:not(.active) { border-color: #1a7a3c; color: #1a7a3c; }
        .section-divider { display: flex; align-items: center; gap: 14px; margin: 36px 0 24px; }
        .section-divider-line { flex: 1; height: 1px; background: var(--border); }
        @media (max-width: 1024px) { .offers-grid { grid-template-columns: repeat(2, 1fr); } .urgent-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .offers-grid { grid-template-columns: 1fr; } .urgent-grid { grid-template-columns: 1fr; } }
      `}</style>

      <Navbar />

      {/* PAGE HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #0d1f14 0%, #1a7a3c 100%)', padding: '36px 40px 44px', color: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 'clamp(22px, 4vw, 34px)', fontWeight: 800, marginBottom: 6 }}>
                {t('offers.title') || 'Offres d\'emploi'}
              </h1>
              <p style={{ color: '#9dc9ac', fontSize: 14 }}>
                {pagination.total > 0 ? `${pagination.total} offre${pagination.total > 1 ? 's' : ''} disponible${pagination.total > 1 ? 's' : ''}` : 'Chargement...'}
                {savedGovs.length > 0 && ` · ${savedGovs.length} gouvernorat${savedGovs.length > 1 ? 's' : ''} sélectionné${savedGovs.length > 1 ? 's' : ''}`}
              </p>
            </div>
            {user?.role === 'employer' && (
              <button onClick={() => navigate('/post-offer')} style={{ background: '#fff', color: '#1a7a3c', border: 'none', padding: '11px 22px', borderRadius: 100, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
                + Publier une offre
              </button>
            )}
          </div>
          {/* Search */}
          <div style={{ marginTop: 20, position: 'relative', maxWidth: 500 }}>
            <FontAwesomeIcon icon={faMagnifyingGlass} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.4, color: '#fff' }} />
            <input className="search-input" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}
              placeholder="Rechercher une offre..."
              value={filters.search}
              onChange={e => updateFilter('search', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 40px 60px' }}>

        {/* FILTERS BAR */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
          <select className={`filter-select ${filters.category ? 'active' : ''}`} value={filters.category} onChange={e => updateFilter('category', e.target.value)}>
            <option value="">Toutes catégories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select className={`filter-select ${filters.city ? 'active' : ''}`} value={filters.city} onChange={e => updateFilter('city', e.target.value)}>
            <option value="">Tous les gouvernorats</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input className={`filter-select ${filters.skill ? 'active' : ''}`}
              style={{ paddingLeft: 14, paddingRight: filters.skill ? 30 : 14, borderRadius: 100, minWidth: 150 }}
              placeholder="Compétence..."
              value={filters.skill}
              onChange={e => updateFilter('skill', e.target.value)}
            />
            {filters.skill && (
              <button onClick={() => updateFilter('skill', '')} style={{ position: 'absolute', right: 10, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)', fontSize: 16, padding: 0 }}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            )}
          </div>

          {activeFiltersCount > 0 && (
            <button onClick={clearFilters} style={{ background: '#fff0f0', color: '#cc0000', border: '1px solid #ffcccc', padding: '8px 14px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>
              × Effacer ({activeFiltersCount})
            </button>
          )}

          {savedGovs.length > 0 && (
            <div style={{ fontSize: 13, color: '#1a7a3c', background: 'var(--primary-light)', border: '1px solid var(--border-3)', padding: '6px 12px', borderRadius: 100 }}>
              🗺️ {savedGovs.length} gouvernorat{savedGovs.length > 1 ? 's' : ''}
            </div>
          )}

          {/* Grid/List toggle */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            <button className={`view-toggle-btn ${!listView ? 'active' : ''}`} onClick={() => toggleListView(false)} title="Vue grille">
              <FontAwesomeIcon icon={faTableCells} style={{ fontSize: 14 }} />
            </button>
            <button className={`view-toggle-btn ${listView ? 'active' : ''}`} onClick={() => toggleListView(true)} title="Vue liste">
              <FontAwesomeIcon icon={faBars} style={{ fontSize: 14 }} />
            </button>
          </div>
        </div>

        {/* URGENT SECTION */}
        {(urgentLoading || urgentOffers.length > 0) && (
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ background: '#fff3e0', border: '1px solid #ffcc80', borderRadius: 10, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 7 }}>
                <FontAwesomeIcon icon={faBolt} style={{ color: '#e65100', fontSize: 13 }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#e65100' }}>Offres urgentes</span>
              </div>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>
            {urgentLoading ? (
              <div className="urgent-grid">
                {Array(3).fill(0).map((_, i) => <SkeletonCard key={i} listView={false} />)}
              </div>
            ) : (
              <div className={listView ? 'offers-list' : 'urgent-grid'}>
                {urgentOffers.map(offer => (
                  <OfferCard key={offer._id} offer={offer} onClick={id => navigate(`/offers/${id}`)} listView={listView} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* NORMAL OFFERS SECTION */}
        <div className="section-divider">
          <div className="section-divider-line" />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-faint)', whiteSpace: 'nowrap' }}>
            Toutes les offres {pagination.total > 0 ? `(${pagination.total})` : ''}
          </span>
          <div className="section-divider-line" />
        </div>

        {loading ? (
          <div className={listView ? 'offers-list' : 'offers-grid'}>
            {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} listView={listView} />)}
          </div>
        ) : offers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 24px' }}>
            <FontAwesomeIcon icon={faMagnifyingGlass} style={{ fontSize: 48, color: 'var(--text-placeholder)', marginBottom: 16 }} />
            <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Aucune offre trouvée</h3>
            <p style={{ color: 'var(--text-faint)', fontSize: 14, marginBottom: 22 }}>Essaie de modifier tes filtres.</p>
            <button onClick={clearFilters} style={{ background: '#1a7a3c', color: '#fff', border: 'none', padding: '11px 26px', borderRadius: 100, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>
              Voir toutes les offres
            </button>
          </div>
        ) : (
          <div className={listView ? 'offers-list' : 'offers-grid'}>
            {offers.map(offer => (
              <OfferCard key={offer._id} offer={offer} onClick={id => navigate(`/offers/${id}`)} listView={listView} />
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {pagination.pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 36 }}>
            <button className="page-btn" disabled={filters.page === 1} onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
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
            <button className="page-btn" disabled={filters.page === pagination.pages} onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))}>
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}