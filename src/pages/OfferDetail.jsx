import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../store/AuthContext'
import api from '../services/api'
import Navbar from '../components/Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox, faBriefcase, faCalendar, faCheck, faCircleUser, faClock, faMagnifyingGlass, faMoneyBillWave, faTriangleExclamation, faTrophy } from '@fortawesome/free-solid-svg-icons'

const CATEGORY_ICONS = {
  restaurant: faBriefcase,
  café: faBriefcase,
  jardinage: faBriefcase,
  nettoyage: faBriefcase,
  agricole: faBriefcase,
  livraison: faBriefcase,
  design: faBriefcase,
  informatique: faBriefcase,
  événementiel: faBriefcase,
  autre: faBox,
}
const CATEGORY_COLORS = { restaurant: '#ff6b35', café: '#8b5cf6', jardinage: '#16a34a', nettoyage: '#0ea5e9', agricole: '#84cc16', livraison: '#f59e0b', design: '#ec4899', informatique: '#3b82f6', événementiel: '#f97316', autre: '#6b7280' }
const STATUS_LABELS = {
  open: { labelKey: 'common.status_open', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  filled: { labelKey: 'common.status_filled', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  closed: { labelKey: 'common.status_closed', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
  completed: { labelKey: 'common.status_completed', color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb' }
}

export default function OfferDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [offer, setOffer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [applyMessage, setApplyMessage] = useState('')
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [applyError, setApplyError] = useState('')
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [applications, setApplications] = useState([])
  const [loadingApps, setLoadingApps] = useState(false)
  const [actionLoading, setActionLoading] = useState(null)

  const isOwner = user && offer && (user._id === offer.employer?._id || user.id === offer.employer?._id)
  const isWorker = user?.role === 'worker'

  useEffect(() => { fetchOffer() }, [id])
  useEffect(() => { if (isOwner) fetchApplications() }, [isOwner])

  const fetchOffer = async () => {
    try {
      const res = await api.get(`/offers/${id}`)
      setOffer(res.data.data.offer || res.data.data)
    } catch { setError(true) }
    finally { setLoading(false) }
  }

  const fetchApplications = async () => {
    setLoadingApps(true)
    try {
      const res = await api.get(`/applications/offer/${id}`)
      setApplications(res.data.data.applications || res.data.data || [])
    } catch {}
    finally { setLoadingApps(false) }
  }

  const handleApply = async () => {
    setApplying(true); setApplyError('')
    try {
      await api.post(`/applications/offer/${id}`, { message: applyMessage })
      setApplied(true); setShowApplyModal(false)
    } catch (err) { setApplyError(err.response?.data?.message || 'Erreur lors de la candidature') }
    finally { setApplying(false) }
  }

  const handleAction = async (appId, action) => {
    setActionLoading(appId + action)
    try { await api.patch(`/applications/${appId}/${action}`); fetchApplications(); fetchOffer() }
    catch {}
    finally { setActionLoading(null) }
  }

  const handleDelete = async () => {
    if (!window.confirm(t('offerDetail.confirmDelete'))) return
    try { await api.delete(`/offers/${id}`); navigate('/dashboard') } catch {}
  }

  const handleClose = async () => {
    if (!window.confirm(t('offerDetail.confirmClose'))) return
    try { await api.patch(`/offers/${id}/close`); fetchOffer() } catch {}
  }

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'

  if (loading) return (
    <div style={{ fontFamily: "'Sora', sans-serif" }}>
      <Navbar />
      <div style={{ maxWidth: 800, margin: '60px auto', padding: '0 24px' }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{ height: i === 0 ? 40 : 20, background: 'linear-gradient(90deg,var(--skeleton-1) 25%,var(--skeleton-2) 50%,var(--skeleton-1) 75%)', backgroundSize: '200% 100%', borderRadius: 8, marginBottom: 16, animation: 'shimmer 1.2s infinite' }} />
        ))}
        <style>{`@keyframes shimmer{to{background-position:-200% 0}}`}</style>
      </div>
    </div>
  )

  if (error) return (
    <div style={{ fontFamily: "'Sora', sans-serif" }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ fontSize: 48, marginBottom: 16, color: 'var(--text-placeholder)' }}><FontAwesomeIcon icon={faMagnifyingGlass} /></div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>{t('offerDetail.notFoundTitle')}</h2>
        <p style={{ color: 'var(--text-faint)', marginBottom: 24 }}>{t('offerDetail.notFoundDesc')}</p>
        <button onClick={() => navigate('/offers')} style={{ background: '#1a7a3c', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 100, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>
          {t('offerDetail.seeAllOffers')}
        </button>
      </div>
    </div>
  )

  const catColor = CATEGORY_COLORS[offer.category] || '#6b7280'
  const catIcon = CATEGORY_ICONS[offer.category] || faBox
  const status = STATUS_LABELS[offer.status] || STATUS_LABELS.open

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", minHeight: '100vh', background: 'var(--bg)' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        .apply-btn { background: #1a7a3c; color: #fff; border: none; padding: 14px 36px; border-radius: 100px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: 'Sora', sans-serif; transition: background 0.2s, transform 0.15s; box-shadow: 0 4px 20px rgba(26,122,60,0.3); }
        .apply-btn:hover:not(:disabled) { background: #145f2e; transform: translateY(-1px); }
        .apply-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .action-btn { padding: 8px 18px; border-radius: 100px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'Sora', sans-serif; border: none; transition: all 0.18s; }
        .accept-btn { background: #f0fdf4; color: #16a34a; border: 1.5px solid #bbf7d0; }
        .accept-btn:hover:not(:disabled) { background: #16a34a; color: #fff; }
        .reject-btn { background: #fef2f2; color: #dc2626; border: 1.5px solid #fecaca; }
        .reject-btn:hover:not(:disabled) { background: #dc2626; color: #fff; }
        .icon-btn { padding: 8px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Sora', sans-serif; transition: all 0.18s; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .modal { background: var(--surface); border-radius: 20px; padding: 32px; width: 100%; max-width: 480px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
        .textarea { width: 100%; padding: 12px 16px; border-radius: 12px; border: 1.5px solid var(--border-2); font-size: 14px; font-family: 'Sora', sans-serif; resize: vertical; outline: none; transition: border-color 0.2s; }
        .textarea:focus { border-color: #1a7a3c; box-shadow: 0 0 0 3px rgba(26,122,60,0.08); }
        @media (max-width: 768px) { .detail-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <Navbar />

      {/* Breadcrumb */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '12px 32px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-faint)' }}>
          <Link to="/offers" style={{ color: '#1a7a3c', textDecoration: 'none', fontWeight: 600 }}>{t('offerDetail.breadcrumb')}</Link>
          <span>›</span>
          <span style={{ color: 'var(--text-muted)' }}>{offer.title}</span>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px 60px' }}>
        <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>

          {/* Main content */}
          <div>
            {/* Header card */}
            <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 20, padding: 28, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: `${catColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}><FontAwesomeIcon icon={catIcon} style={{ color: catColor }} /></div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: catColor, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{offer.category}</div>
                    <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', margin: 0, lineHeight: 1.3 }}>{offer.title}</h1>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                  <span style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}`, padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 700 }}>
                    {t(status.labelKey)}
                  </span>
                  {offer.urgent && (
                    <span style={{ background: '#fff3e0', color: '#e65100', border: '1px solid #ffcc80', padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 700 }}>{t('common.urgent')}</span>
                  )}
                </div>
              </div>

              {/* Key details */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
                <span style={{ background: 'var(--primary-light)', color: '#1a7a3c', border: '1px solid var(--border-3)', padding: '6px 14px', borderRadius: 100, fontSize: 13, fontWeight: 700 }}>
                  <FontAwesomeIcon icon={faMoneyBillWave} style={{ marginRight: 6 }} /> {offer.salary?.amount} TND / {offer.salary?.unit}
                </span>
                <span style={{ background: 'var(--border)', color: 'var(--text-2)', border: '1px solid #e5e5e5', padding: '6px 14px', borderRadius: 100, fontSize: 13 }}>
                  <FontAwesomeIcon icon={faCircleUser} style={{ marginRight: 6 }} /> {offer.location?.city}
                </span>
                <span style={{ background: 'var(--border)', color: 'var(--text-2)', border: '1px solid #e5e5e5', padding: '6px 14px', borderRadius: 100, fontSize: 13 }}>
                  <FontAwesomeIcon icon={faClock} style={{ marginRight: 6 }} /> {offer.duration}
                </span>
                <span style={{ background: 'var(--border)', color: 'var(--text-2)', border: '1px solid #e5e5e5', padding: '6px 14px', borderRadius: 100, fontSize: 13 }}>
                  <FontAwesomeIcon icon={faCalendar} style={{ marginRight: 6 }} /> Début : {formatDate(offer.startDate)}
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>{t('offerDetail.descriptionTitle')}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.8, whiteSpace: 'pre-wrap', margin: 0 }}>{offer.description}</p>
              </div>

              {/* Address */}
              {offer.location?.address && (
                <div style={{ marginTop: 16, padding: '12px 16px', background: '#f5fbf7', border: '1px solid #c8e6d0', borderRadius: 12 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t('offerDetail.addressLabel')} <strong style={{ color: 'var(--text)' }}>{offer.location.address}</strong></span>
                </div>
              )}

              {/* Required skills */}
              {offer.requiredSkills?.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>{t('offerDetail.skillsTitle')}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {offer.requiredSkills.map(s => (
                      <span key={s} style={{ background: 'var(--primary-light)', color: '#1a7a3c', border: '1.5px solid var(--border-3)', padding: '6px 16px', borderRadius: 100, fontSize: 13, fontWeight: 600 }}>
                        <FontAwesomeIcon icon={faCheck} style={{ marginRight: 6 }} /> {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Employer actions */}
            {isOwner && (
              <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 20, padding: 24, marginBottom: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>{t('offerDetail.manageTitle')}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  <button className="icon-btn" onClick={() => navigate(`/post-offer?edit=${id}`)} style={{ background: '#f0faf4', color: '#1a7a3c', border: '1.5px solid #b8dfc8' }}>
                    {t('offerDetail.editBtn')}
                  </button>
                  {offer.status === 'open' && (
                    <button className="icon-btn" onClick={handleClose} style={{ background: '#fffbeb', color: '#d97706', border: '1.5px solid #fde68a' }}>
                      {t('offerDetail.closeBtn')}
                    </button>
                  )}
                  <button className="icon-btn" onClick={handleDelete} style={{ background: '#fef2f2', color: '#dc2626', border: '1.5px solid #fecaca' }}>
                    {t('offerDetail.deleteBtn')}
                  </button>
                </div>
              </div>
            )}

            {/* Applicants section (employer owner) */}
            {isOwner && (
              <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 20, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
                    {t('offerDetail.applicantsTitle')}
                    {applications.length > 0 && (
                      <span style={{ marginLeft: 8, background: '#1a7a3c', color: '#fff', fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 100 }}>{applications.length}</span>
                    )}
                  </h3>
                  <button onClick={fetchApplications} style={{ background: 'none', border: '1px solid var(--border-2)', padding: '6px 14px', borderRadius: 100, cursor: 'pointer', fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Sora, sans-serif' }}>
                    {t('offerDetail.refresh')}
                  </button>
                </div>
                {loadingApps ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-faint)', padding: 24 }}>{t('common.loading')}</div>
                ) : applications.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px 24px', color: 'var(--text-faint)' }}>
                    <div style={{ fontSize: 36, marginBottom: 10 }}><FontAwesomeIcon icon={faCircleUser} /></div>
                    <p style={{ fontSize: 14 }}>{t('offerDetail.noApplicants')}</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {applications.map(app => (
                      <div key={app._id} style={{ background: app.status === 'accepted' ? '#f0fdf4' : app.status === 'rejected' ? '#fef2f2' : 'var(--bg)', border: `1.5px solid ${app.status === 'accepted' ? '#bbf7d0' : app.status === 'rejected' ? '#fecaca' : 'var(--border)'}`, borderRadius: 14, padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#1a7a3c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                              {app.worker?.name?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div>
                              <button onClick={() => navigate(`/user/${app.worker?._id}`)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 14, fontWeight: 700, color: 'var(--text)', fontFamily: 'Sora, sans-serif' }}>
                                {app.worker?.name || 'Candidat'}
                              </button>
                              <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 2 }}>
                                {app.status === 'accepted' ? t('offerDetail.accepted') : app.status === 'rejected' ? t('offerDetail.rejected') : t('offerDetail.pending')}
                              </div>
                            </div>
                          </div>
                          {app.status === 'pending' && (
                            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                              <button className="action-btn accept-btn" onClick={() => handleAction(app._id, 'accept')} disabled={!!actionLoading}>
                                {actionLoading === app._id + 'accept' ? '...' : t('offerDetail.acceptBtn')}
                              </button>
                              <button className="action-btn reject-btn" onClick={() => handleAction(app._id, 'reject')} disabled={!!actionLoading}>
                                {actionLoading === app._id + 'reject' ? '...' : t('offerDetail.rejectBtn')}
                              </button>
                            </div>
                          )}
                        </div>
                        {app.message && (
                          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 10, padding: '10px 14px', background: 'rgba(0,0,0,0.03)', borderRadius: 10, margin: '10px 0 0', lineHeight: 1.6 }}>
                            "{app.message}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Apply button (worker) */}
            {isWorker && offer.status === 'open' && (
              <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 20, padding: 24, textAlign: 'center' }}>
                {applied ? (
                  <div>
                    <div style={{ fontSize: 40, marginBottom: 10 }}><FontAwesomeIcon icon={faTrophy} /></div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1a7a3c', marginBottom: 6 }}>{t('offerDetail.appliedTitle')}</div>
                    <p style={{ fontSize: 13, color: 'var(--text-faint)' }}>{t('offerDetail.appliedDesc')}</p>
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: 28, marginBottom: 10 }}><FontAwesomeIcon icon={faBriefcase} /></div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{t('offerDetail.applyTitle')}</h3>
                    <p style={{ fontSize: 13, color: 'var(--text-faint)', marginBottom: 20, lineHeight: 1.6 }}>{t('offerDetail.applyDesc')}</p>
                    <button className="apply-btn" style={{ width: '100%' }} onClick={() => user ? setShowApplyModal(true) : navigate('/login')}>
                      {t('offerDetail.applyBtn')}
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Employer info */}
            <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 20, padding: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>{t('offerDetail.publishedBy')}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', background: '#1a7a3c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                  {offer.employer?.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{offer.employer?.name || 'Employeur'}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-faint)' }}>{offer.employer?.city}</div>
                </div>
              </div>
              <button onClick={() => navigate(`/user/${offer.employer?._id}`)} style={{ width: '100%', padding: '10px', borderRadius: 12, border: '1.5px solid var(--border-2)', background: 'var(--surface)', fontSize: 13, fontWeight: 600, color: '#1a7a3c', cursor: 'pointer', fontFamily: 'Sora, sans-serif', transition: 'all 0.18s' }}>
                {t('offerDetail.viewProfile')}
              </button>
            </div>

            {/* Details card */}
            <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 20, padding: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>{t('offerDetail.infoTitle')}</h3>
              {[
                { labelKey: 'offerDetail.infoSalary', value: t('offerDetail.salaryFormat', { amount: offer.salary?.amount, unit: offer.salary?.unit }) },
                { labelKey: 'offerDetail.infoDuration', value: offer.duration },
                { labelKey: 'offerDetail.infoStart', value: formatDate(offer.startDate) },
                { labelKey: 'offerDetail.infoCity', value: offer.location?.city },
                { labelKey: 'offerDetail.infoApplicants', value: t('offerDetail.applicantCount', { count: offer.applicationsCount ?? 0 }) },
              ].map(({ labelKey, value }) => (
                <div key={labelKey} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12, fontSize: 13 }}>
                  <span style={{ color: 'var(--text-faint)' }}>{t(labelKey)}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text)', textAlign: 'right' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Apply modal */}
      {showApplyModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowApplyModal(false)}>
          <div className="modal">
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>{t('offerDetail.modalTitle')}</h2>
            <p style={{ color: 'var(--text-faint)', fontSize: 14, marginBottom: 20 }}>{t('offerDetail.modalDesc')}</p>
            {applyError && <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', color: '#cc0000', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 14 }}><FontAwesomeIcon icon={faTriangleExclamation} style={{ marginRight: 6 }} />{applyError}</div>}
            <textarea
              className="textarea"
              rows={4}
              placeholder={t('offerDetail.messagePlaceholder')}
              value={applyMessage}
              onChange={e => setApplyMessage(e.target.value)}
              maxLength={300}
            />
            <div style={{ fontSize: 12, color: 'var(--text-placeholder)', textAlign: 'right', marginTop: 4, marginBottom: 20 }}>{t('offerDetail.charCount', { count: applyMessage.length })}</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowApplyModal(false)} style={{ flex: 1, padding: '13px', borderRadius: 12, border: '1.5px solid var(--border-2)', background: 'var(--surface)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Sora, sans-serif', color: 'var(--text-muted)' }}>
                Annuler
              </button>
              <button className="apply-btn" style={{ flex: 2 }} onClick={handleApply} disabled={applying}>
                {applying ? t('offerDetail.sending') : t('offerDetail.sendApplication')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
