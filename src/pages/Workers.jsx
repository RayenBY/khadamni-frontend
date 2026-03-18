import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import api from '../services/api'
import Navbar from '../components/Navbar'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight, faBox, faBroom, faLaptopCode, faLeaf, faLocationDot, faMagnifyingGlass, faMugSaucer, faPalette, faSeedling, faStar, faTruck, faUtensils } from '@fortawesome/free-solid-svg-icons'

const CATEGORIES = ['restaurant', 'café', 'jardinage', 'nettoyage', 'agricole', 'livraison', 'design', 'informatique', 'événementiel', 'autre']
const CATEGORY_ICONS = { restaurant: faUtensils, café: faMugSaucer, jardinage: faLeaf, nettoyage: faBroom, agricole: faSeedling, livraison: faTruck, design: faPalette, informatique: faLaptopCode, événementiel: faStar, autre: faBox }
const AVAILABILITY_KEYS = { available: { tKey: 'common.avail_available', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' }, busy: { tKey: 'common.avail_busy', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' }, open_to_offers: { tKey: 'common.avail_open', color: '#d97706', bg: '#fffbeb', border: '#fde68a' } }
const CITIES = ['Tunis', 'Sfax', 'Sousse', 'Monastir', 'Bizerte', 'Nabeul', 'Ariana', 'Ben Arous', 'Manouba', 'Zaghouan', 'Béja', 'Jendouba', 'Kef', 'Siliana', 'Kairouan', 'Kasserine', 'Sidi Bouzid', 'Mahdia', 'Gafsa', 'Tozeur', 'Kébili', 'Gabès', 'Médenine', 'Tataouine']

function WorkerCard({ post, onView }) {
  const { t } = useTranslation()
  const avail = AVAILABILITY_KEYS[post.availability] || AVAILABILITY_KEYS.available
  const w = post.worker
  return (
    <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 18, padding: 22, cursor: 'pointer', transition: 'transform 0.18s, box-shadow 0.18s, border-color 0.18s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(26,122,60,0.1)'; e.currentTarget.style.borderColor = 'var(--border-3)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = 'var(--border)' }}
      onClick={() => onView(w?._id)}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #1a7a3c, #2d9a52)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
          {w?.name?.[0]?.toUpperCase() || '?'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w?.name}</div>
          {w?.jobTitle && <div style={{ fontSize: 13, color: 'var(--text-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.jobTitle}</div>}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
            {w?.rating > 0 && (
              <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 600 }}><FontAwesomeIcon icon={faStar} style={{ marginRight: 4 }} />{w.rating.toFixed(1)}</span>
            )}
            <span style={{ background: avail.bg, color: avail.color, border: `1px solid ${avail.border}`, padding: '2px 8px', borderRadius: 100, fontSize: 11, fontWeight: 700 }}>{t(avail.tKey)}</span>
          </div>
        </div>
      </div>

      <div style={{ fontSize: 12, fontWeight: 700, color: CATEGORY_ICONS[post.category] ? '#1a7a3c' : '#6b7280', marginBottom: 6 }}>
        <FontAwesomeIcon icon={CATEGORY_ICONS[post.category] || faBox} style={{ marginRight: 6 }} /> {post.category}
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{post.title}</div>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 14 }}>
        {post.description}
      </p>

      {post.skills?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
          {post.skills.slice(0, 4).map(s => (
            <span key={s} style={{ background: 'var(--primary-light)', color: '#1a7a3c', border: '1px solid var(--border-3)', padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 500 }}>{s}</span>
          ))}
          {post.skills.length > 4 && <span style={{ fontSize: 11, color: 'var(--text-placeholder)' }}>+{post.skills.length - 4}</span>}
        </div>
      )}

      {post.governorates?.length > 0 && (
        <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>
          <FontAwesomeIcon icon={faLocationDot} style={{ marginRight: 6 }} /> {post.governorates.slice(0, 3).join(', ')}{post.governorates.length > 3 ? '...' : ''}
        </div>
      )}
    </div>
  )
}

export default function Workers() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t } = useTranslation()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [filters, setFilters] = useState({ category: '', governorate: '', availability: '', page: 1 })
  const [search, setSearch] = useState('')

  useEffect(() => { fetchPosts() }, [filters])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.category) params.append('category', filters.category)
      if (filters.governorate) params.append('governorate', filters.governorate)
      if (filters.availability) params.append('availability', filters.availability)
      params.append('page', filters.page)
      params.append('limit', 12)
      const res = await api.get(`/worker-posts?${params}`)
      setPosts(res.data.data.workerPosts || res.data.data || [])
      if (res.data.pagination) setPagination(res.data.pagination)
    } catch {}
    finally { setLoading(false) }
  }

  const updateFilter = (key, val) => setFilters(p => ({ ...p, [key]: val, page: 1 }))

  const filteredPosts = search
    ? posts.filter(p => p.title?.toLowerCase().includes(search.toLowerCase()) || p.worker?.name?.toLowerCase().includes(search.toLowerCase()) || p.skills?.some(s => s.toLowerCase().includes(search.toLowerCase())))
    : posts

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", minHeight: '100vh', background: 'var(--bg)' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        .filter-select { padding: 8px 14px; border-radius: 100px; border: 1.5px solid var(--border-2); background: var(--surface); font-size: 13px; font-weight: 500; cursor: pointer; font-family: 'Sora', sans-serif; color: var(--text-2); outline: none; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 30px; }
        .filter-select:focus, .filter-select.active { border-color: #1a7a3c; }
        .filter-select.active { background-color: var(--primary-light); color: #1a7a3c; }
        .search-input { padding: 10px 16px 10px 40px; border-radius: 100px; border: 1.5px solid var(--border-2); background: var(--surface); font-size: 14px; font-family: 'Sora', sans-serif; color: var(--text-2); outline: none; transition: border-color 0.18s; width: 100%; max-width: 320px; }
        .search-input:focus { border-color: #1a7a3c; }
        .workers-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .page-btn { width: 36px; height: 36px; border-radius: 10px; border: 1.5px solid var(--border-2); background: var(--surface); font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Sora', sans-serif; color: var(--text-2); display: flex; align-items: center; justify-content: center; transition: all 0.18s; }
        .page-btn:hover { border-color: #1a7a3c; color: #1a7a3c; }
        .page-btn.active { background: #1a7a3c; color: #fff; border-color: #1a7a3c; }
        .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .skeleton { background: linear-gradient(90deg,var(--skeleton-1) 25%,var(--skeleton-2) 50%,var(--skeleton-1) 75%); background-size: 200% 100%; animation: shimmer 1.2s infinite; border-radius: 10px; }
        @keyframes shimmer { to { background-position: -200% 0; } }
        @media (max-width: 1024px) { .workers-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .workers-grid { grid-template-columns: 1fr; } }
      `}</style>

      <Navbar />

      <div style={{ background: 'linear-gradient(135deg, #0d1f14 0%, #1a7a3c 100%)', padding: '40px 40px 48px', color: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#7ecf9a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>{t('workers.tag')}</div>
              <h1 style={{ fontSize: 'clamp(22px,4vw,34px)', fontWeight: 800, marginBottom: 8 }}>{t('workers.title')}</h1>
              <p style={{ color: '#9dc9ac', fontSize: 15 }}>
                {pagination.total > 0 ? t('workers.count', { count: pagination.total }) : ''}
              </p>
            </div>
            {user?.role === 'worker' && (
              <button onClick={() => navigate('/post-worker-profile')} style={{ background: '#fff', color: '#1a7a3c', border: 'none', padding: '12px 24px', borderRadius: 100, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
                {t('workers.publishProfile')}
              </button>
            )}
          </div>

          <div style={{ position: 'relative', maxWidth: 480 }}>
            <FontAwesomeIcon icon={faMagnifyingGlass} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.4, color: '#333' }} />
            <input className="search-input" style={{ maxWidth: '100%' }} placeholder={t('workers.searchPlaceholder')} value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 16 }}>
            <select className={`filter-select ${filters.category ? 'active' : ''}`} value={filters.category} onChange={e => updateFilter('category', e.target.value)}>
              <option value="">{t('workers.allCategories')}</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className={`filter-select ${filters.governorate ? 'active' : ''}`} value={filters.governorate} onChange={e => updateFilter('governorate', e.target.value)}>
              <option value="">{t('workers.allCities')}</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className={`filter-select ${filters.availability ? 'active' : ''}`} value={filters.availability} onChange={e => updateFilter('availability', e.target.value)}>
              <option value="">{t('workers.allAvailabilities')}</option>
              <option value="available">{t('workers.avail_available')}</option>
              <option value="open_to_offers">{t('workers.avail_open')}</option>
            </select>
            {(filters.category || filters.governorate || filters.availability) && (
              <button onClick={() => setFilters({ category: '', governorate: '', availability: '', page: 1 })} style={{ background: '#fff0f0', color: '#cc0000', border: '1px solid #ffcccc', padding: '8px 16px', borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>
                {t('workers.clearFilters')}
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 40px 60px' }}>
        {loading ? (
          <div className="workers-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 18, padding: 22 }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                  <div className="skeleton" style={{ width: 48, height: 48, borderRadius: '50%' }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ height: 14, width: '60%', marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 11, width: '40%' }} />
                  </div>
                </div>
                <div className="skeleton" style={{ height: 11, marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 11, width: '75%', marginBottom: 14 }} />
                <div style={{ display: 'flex', gap: 6 }}>
                  {[...Array(3)].map((_, j) => <div key={j} className="skeleton" style={{ height: 22, width: 64, borderRadius: 100 }} />)}
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '72px 24px' }}>
            <div style={{ fontSize: 52, marginBottom: 14, color: 'var(--text-placeholder)' }}><FontAwesomeIcon icon={faMagnifyingGlass} /></div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>{t('workers.emptyTitle')}</h3>
            <p style={{ color: 'var(--text-faint)', fontSize: 14 }}>{t('workers.emptyDesc')}</p>
          </div>
        ) : (
          <>
            <div className="workers-grid">
              {filteredPosts.map(post => (
                <WorkerCard key={post._id} post={post} onView={id => navigate(`/user/${id}`)} />
              ))}
            </div>
            {pagination.pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 40 }}>
                <button className="page-btn" disabled={filters.page === 1} onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))}><FontAwesomeIcon icon={faArrowLeft} /></button>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === pagination.pages || Math.abs(p - filters.page) <= 1)
                  .reduce((acc, p, i, arr) => { if (i > 0 && p - arr[i-1] > 1) acc.push('...'); acc.push(p); return acc }, [])
                  .map((p, i) => p === '...'
                    ? <span key={i} style={{ color: 'var(--text-placeholder)', fontSize: 14 }}>...</span>
                    : <button key={p} className={`page-btn ${filters.page === p ? 'active' : ''}`} onClick={() => setFilters(prev => ({ ...prev, page: p }))}>{p}</button>
                  )
                }
                <button className="page-btn" disabled={filters.page === pagination.pages} onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))}><FontAwesomeIcon icon={faArrowRight} /></button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
