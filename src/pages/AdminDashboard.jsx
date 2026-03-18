import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../services/api'
import Navbar from '../components/Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBriefcase, faBuilding, faCircleCheck, faClipboardList, faStar, faUser, faUsers } from '@fortawesome/free-solid-svg-icons'

function StatCard({ icon, value, label, color = '#1a7a3c' }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 16, padding: '22px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 50, height: 50, borderRadius: 14, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>{value?.toLocaleString() ?? '—'}</div>
        <div style={{ fontSize: 13, color: 'var(--text-faint)', marginTop: 3 }}>{label}</div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [offers, setOffers] = useState([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [loadingOffers, setLoadingOffers] = useState(false)
  const [tab, setTab] = useState('stats')
  const [actionLoading, setActionLoading] = useState(null)
  const [userFilters, setUserFilters] = useState({ role: '', isVerified: '' })

  useEffect(() => { fetchStats() }, [])
  useEffect(() => { if (tab === 'users') fetchUsers() }, [tab, userFilters])
  useEffect(() => { if (tab === 'offers') fetchOffers() }, [tab])

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats')
      setStats(res.data.data || res.data)
    } catch {}
    finally { setLoadingStats(false) }
  }

  const fetchUsers = async () => {
    setLoadingUsers(true)
    try {
      const params = new URLSearchParams()
      if (userFilters.role) params.append('role', userFilters.role)
      if (userFilters.isVerified) params.append('isVerified', userFilters.isVerified)
      params.append('limit', 20)
      const res = await api.get(`/admin/users?${params}`)
      setUsers(res.data.data.users || res.data.data || [])
    } catch {}
    finally { setLoadingUsers(false) }
  }

  const fetchOffers = async () => {
    setLoadingOffers(true)
    try {
      const res = await api.get('/admin/offers?limit=20')
      setOffers(res.data.data.offers || res.data.data || [])
    } catch {}
    finally { setLoadingOffers(false) }
  }

  const handleVerify = async (userId) => {
    setActionLoading(userId + 'verify')
    try { await api.patch(`/admin/users/${userId}/verify`); fetchUsers() }
    catch {}
    finally { setActionLoading(null) }
  }

  const handleBan = async (userId, currentlyActive) => {
    const action = currentlyActive ? 'ban' : 'unban'
    if (!window.confirm(currentlyActive ? t('admin.confirmBan') : t('admin.confirmUnban'))) return
    setActionLoading(userId + action)
    try { await api.patch(`/admin/users/${userId}/${action}`); fetchUsers() }
    catch {}
    finally { setActionLoading(null) }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm(t('admin.confirmDeleteUser'))) return
    setActionLoading(userId + 'del')
    try { await api.delete(`/admin/users/${userId}`); fetchUsers() }
    catch {}
    finally { setActionLoading(null) }
  }

  const handleCloseOffer = async (offerId) => {
    try { await api.patch(`/admin/offers/${offerId}/close`); fetchOffers() } catch {}
  }

  const handleDeleteOffer = async (offerId) => {
    if (!window.confirm(t('admin.confirmDeleteOffer'))) return
    try { await api.delete(`/admin/offers/${offerId}`); fetchOffers() } catch {}
  }

  const formatDate = d => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

  const statusLabel = (status) => {
    if (status === 'open') return t('common.status_open')
    if (status === 'filled') return t('common.status_filled')
    if (status === 'closed') return t('common.status_closed')
    if (status === 'completed') return t('common.status_completed')
    return status
  }

  const roleLabel = (role) => {
    if (role === 'worker') return t('common.role_worker')
    if (role === 'employer') return t('common.role_employer')
    if (role === 'admin') return t('common.role_admin')
    return role
  }

  const tabStyle = (key) => ({ padding: '10px 22px', borderRadius: 100, fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none', fontFamily: 'Sora, sans-serif', transition: 'all 0.18s', background: tab === key ? '#1a7a3c' : 'transparent', color: tab === key ? '#fff' : 'var(--text-muted)' })

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", minHeight: '100vh', background: 'var(--bg)' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 12px 16px; font-size: 12px; fontWeight: 700; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid var(--skeleton-1); background: var(--bg); }
        td { padding: 13px 16px; font-size: 13px; color: var(--text-2); border-bottom: 1px solid var(--border); vertical-align: middle; }
        tr:hover td { background: var(--bg); }
        .action-btn { padding: 5px 12px; border-radius: 100px; font-size: 11px; font-weight: 700; cursor: pointer; font-family: 'Sora', sans-serif; border: none; transition: all 0.15s; }
        .filter-select { padding: 8px 12px; border-radius: 100px; border: 1.5px solid var(--border-2); background: var(--surface); font-size: 13px; font-family: 'Sora', sans-serif; color: var(--text-2); outline: none; cursor: pointer; }
        .filter-select:focus { border-color: #1a7a3c; }
      `}</style>
      <Navbar />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 24px 60px' }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'inline-block', background: '#fff0f0', color: '#dc2626', border: '1px solid #fecaca', padding: '4px 14px', borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
            {t('admin.tag')}
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>{t('admin.title')}</h1>
          <p style={{ color: 'var(--text-faint)', fontSize: 14 }}>{t('admin.subtitle')}</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 28, background: 'var(--border)', padding: 6, borderRadius: 100, width: 'fit-content' }}>
          {[
            { key: 'stats', label: t('admin.tab_stats') },
            { key: 'users', label: t('admin.tab_users') },
            { key: 'offers', label: t('admin.tab_offers') },
          ].map(item => (
            <button key={item.key} style={tabStyle(item.key)} onClick={() => setTab(item.key)}>{item.label}</button>
          ))}
        </div>

        {/* Stats tab */}
        {tab === 'stats' && (
          loadingStats ? <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-faint)' }}>{t('common.loading')}</div> :
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
              <StatCard icon={<FontAwesomeIcon icon={faUsers} />} value={stats?.totalUsers} label={t('admin.stat_users')} />
              <StatCard icon={<FontAwesomeIcon icon={faBriefcase} />} value={stats?.totalWorkers} label={t('admin.stat_workers')} color="#8b5cf6" />
              <StatCard icon={<FontAwesomeIcon icon={faBuilding} />} value={stats?.totalEmployers} label={t('admin.stat_employers')} color="#0ea5e9" />
              <StatCard icon={<FontAwesomeIcon icon={faClipboardList} />} value={stats?.totalOffers} label={t('admin.stat_offers')} color="#16a34a" />
              <StatCard icon={<FontAwesomeIcon icon={faCircleCheck} />} value={stats?.openOffers} label={t('admin.stat_openOffers')} color="#1a7a3c" />
              <StatCard icon={<FontAwesomeIcon icon={faUser} />} value={stats?.totalApplications} label={t('admin.stat_applications')} color="#f59e0b" />
              <StatCard icon={<FontAwesomeIcon icon={faStar} />} value={stats?.totalReviews} label={t('admin.stat_reviews')} color="#ec4899" />
            </div>

            {/* Recent offers */}
            {stats?.recentOffers?.length > 0 && (
              <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 18, overflow: 'hidden', marginBottom: 20 }}>
                <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--skeleton-1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', margin: 0 }}>{t('admin.recentOffers')}</h3>
                  <button onClick={() => setTab('offers')} style={{ background: 'none', border: '1px solid var(--border-2)', padding: '6px 14px', borderRadius: 100, fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>{t('common.seeAll')}</button>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>{t('admin.col_title')}</th>
                      <th>{t('admin.col_category')}</th>
                      <th>{t('admin.col_city')}</th>
                      <th>{t('admin.col_status')}</th>
                      <th>{t('admin.col_date')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOffers.map(o => (
                      <tr key={o._id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/offers/${o._id}`)}>
                        <td style={{ fontWeight: 600, color: 'var(--text)' }}>{o.title}</td>
                        <td>{o.category}</td>
                        <td>{o.location?.city}</td>
                        <td>
                          <span style={{ background: o.status === 'open' ? '#f0fdf4' : '#f9fafb', color: o.status === 'open' ? '#16a34a' : '#888', border: `1px solid ${o.status === 'open' ? '#bbf7d0' : '#e5e7eb'}`, padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700 }}>
                            {statusLabel(o.status)}
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-faint)' }}>{formatDate(o.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Recent users */}
            {stats?.recentUsers?.length > 0 && (
              <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 18, overflow: 'hidden' }}>
                <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--skeleton-1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', margin: 0 }}>{t('admin.recentUsers')}</h3>
                  <button onClick={() => setTab('users')} style={{ background: 'none', border: '1px solid var(--border-2)', padding: '6px 14px', borderRadius: 100, fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>{t('common.seeAll')}</button>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>{t('admin.col_name')}</th>
                      <th>{t('admin.col_role')}</th>
                      <th>{t('admin.col_city')}</th>
                      <th>{t('admin.col_verified')}</th>
                      <th>{t('admin.col_date')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentUsers.map(u => (
                      <tr key={u._id}>
                        <td style={{ fontWeight: 600, color: 'var(--text)' }}>{u.name}</td>
                        <td>{roleLabel(u.role)}</td>
                        <td>{u.city}</td>
                        <td>{u.isVerified ? <span style={{ color: '#16a34a', fontWeight: 700 }}><FontAwesomeIcon icon={faCircleCheck} /></span> : <span style={{ color: 'var(--text-placeholder)' }}>—</span>}</td>
                        <td style={{ color: 'var(--text-faint)' }}>{formatDate(u.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Users tab */}
        {tab === 'users' && (
          <div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
              <select className="filter-select" value={userFilters.role} onChange={e => setUserFilters(p => ({ ...p, role: e.target.value }))}>
                <option value="">{t('admin.filter_allRoles')}</option>
                <option value="worker">{t('admin.filter_worker')}</option>
                <option value="employer">{t('admin.filter_employer')}</option>
              </select>
              <select className="filter-select" value={userFilters.isVerified} onChange={e => setUserFilters(p => ({ ...p, isVerified: e.target.value }))}>
                <option value="">{t('admin.filter_all')}</option>
                <option value="true">{t('admin.filter_verified')}</option>
                <option value="false">{t('admin.filter_unverified')}</option>
              </select>
            </div>
            <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 18, overflow: 'hidden' }}>
              {loadingUsers ? <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-faint)' }}>{t('common.loading')}</div> : (
                <table>
                  <thead>
                    <tr>
                      <th>{t('admin.col_name')}</th>
                      <th>{t('admin.col_role')}</th>
                      <th>{t('admin.col_city')}</th>
                      <th>{t('admin.col_tokens')}</th>
                      <th>{t('admin.col_status')}</th>
                      <th>{t('admin.col_actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text)' }}>{u.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>+216 {u.phone}</div>
                        </td>
                        <td>
                          <span style={{ background: u.role === 'worker' ? '#f0faf4' : u.role === 'employer' ? '#eff6ff' : '#fef3c7', color: u.role === 'worker' ? '#1a7a3c' : u.role === 'employer' ? '#2563eb' : '#d97706', padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700 }}>
                            {roleLabel(u.role)}
                          </span>
                        </td>
                        <td>{u.city}</td>
                        <td>{u.tokens || 0}</td>
                        <td>
                          {!u.isActive ? <span style={{ color: '#dc2626', fontWeight: 700, fontSize: 12 }}>{t('common.banned')}</span>
                          : u.isVerified ? <span style={{ color: '#16a34a', fontWeight: 700, fontSize: 12 }}>{t('common.verified')}</span>
                          : <span style={{ color: 'var(--text-faint)', fontSize: 12 }}>{t('common.notVerified')}</span>}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            {!u.isVerified && u.isActive && (
                              <button className="action-btn" onClick={() => handleVerify(u._id)} disabled={!!actionLoading} style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>
                                {actionLoading === u._id + 'verify' ? '...' : t('admin.verifyBtn')}
                              </button>
                            )}
                            <button className="action-btn" onClick={() => handleBan(u._id, u.isActive)} disabled={!!actionLoading} style={{ background: u.isActive ? '#fffbeb' : '#f0fdf4', color: u.isActive ? '#d97706' : '#16a34a', border: `1px solid ${u.isActive ? '#fde68a' : '#bbf7d0'}` }}>
                              {actionLoading ? '...' : u.isActive ? t('admin.banBtn') : t('admin.unbanBtn')}
                            </button>
                            <button className="action-btn" onClick={() => handleDeleteUser(u._id)} disabled={!!actionLoading} style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                              {actionLoading === u._id + 'del' ? '...' : t('admin.deleteBtn')}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Offers tab */}
        {tab === 'offers' && (
          <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 18, overflow: 'hidden' }}>
            {loadingOffers ? <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-faint)' }}>{t('common.loading')}</div> : (
              <table>
                <thead>
                  <tr>
                    <th>{t('admin.col_title')}</th>
                    <th>{t('admin.col_employer')}</th>
                    <th>{t('admin.col_city')}</th>
                    <th>{t('admin.col_status')}</th>
                    <th>{t('admin.col_date')}</th>
                    <th>{t('admin.col_actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map(o => (
                    <tr key={o._id}>
                      <td style={{ fontWeight: 600, color: 'var(--text)', cursor: 'pointer' }} onClick={() => navigate(`/offers/${o._id}`)}>{o.title}</td>
                      <td>{o.employer?.name || '—'}</td>
                      <td>{o.location?.city}</td>
                      <td>
                        <span style={{ background: o.status === 'open' ? '#f0fdf4' : '#f9fafb', color: o.status === 'open' ? '#16a34a' : '#888', border: `1px solid ${o.status === 'open' ? '#bbf7d0' : '#e5e7eb'}`, padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700 }}>
                          {statusLabel(o.status)}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-faint)' }}>{formatDate(o.createdAt)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 5 }}>
                          {o.status === 'open' && (
                            <button className="action-btn" onClick={() => handleCloseOffer(o._id)} style={{ background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' }}>{t('admin.closeOfferBtn')}</button>
                          )}
                          <button className="action-btn" onClick={() => handleDeleteOffer(o._id)} style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>{t('admin.deleteBtn')}</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
