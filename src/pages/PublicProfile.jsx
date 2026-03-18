import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import api from '../services/api'
import Navbar from '../components/Navbar'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion, faLocationDot, faStar, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'

const AVAILABILITY_KEYS = {
  available:     { tKey: 'publicProfile.avail_available', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  busy:          { tKey: 'publicProfile.avail_busy',      color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
  open_to_offers:{ tKey: 'publicProfile.avail_open',      color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
}

export default function PublicProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const { t } = useTranslation()

  const [profile, setProfile] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [myOffers, setMyOffers] = useState([])
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteForm, setInviteForm] = useState({ offerId: '', message: '' })
  const [inviting, setInviting] = useState(false)
  const [inviteSuccess, setInviteSuccess] = useState(false)
  const [inviteError, setInviteError] = useState('')

  const isSelf = currentUser && (currentUser._id === id || currentUser.id === id)
  const isEmployer = currentUser?.role === 'employer'

  useEffect(() => {
    if (isSelf) { navigate('/profile', { replace: true }); return }
    fetchProfile()
    if (isEmployer) fetchMyOffers()
  }, [id])

  const fetchProfile = async () => {
    try {
      const [profileRes, reviewsRes] = await Promise.all([
        api.get(`/users/${id}`),
        api.get(`/reviews/user/${id}`),
      ])
      setProfile(profileRes.data.data.user || profileRes.data.data)
      setReviews(reviewsRes.data.data.reviews || reviewsRes.data.data || [])
    } catch { setProfile(null) }
    finally { setLoading(false) }
  }

  const fetchMyOffers = async () => {
    try {
      const res = await api.get('/offers?limit=50')
      const all = res.data.data.offers || res.data.data || []
      setMyOffers(all.filter(o => o.employer?._id === currentUser._id || o.employer?._id === currentUser.id))
    } catch {}
  }

  const handleSendInvite = async () => {
    if (!inviteForm.offerId) { setInviteError(t('publicProfile.err_noOffer')); return }
    setInviting(true); setInviteError('')
    try {
      await api.post('/job-invites', { offerId: inviteForm.offerId, workerId: id, message: inviteForm.message })
      setInviteSuccess(true)
      setTimeout(() => { setShowInviteModal(false); setInviteSuccess(false) }, 2000)
    } catch (err) {
      setInviteError(err.response?.data?.message || t('publicProfile.err_send'))
    } finally { setInviting(false) }
  }

  if (loading) return (
    <div style={{ fontFamily: "'Sora', sans-serif" }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--text-faint)' }}>{t('common.loading')}</div>
    </div>
  )

  if (!profile) return (
    <div style={{ fontFamily: "'Sora', sans-serif" }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}><FontAwesomeIcon icon={faCircleQuestion} /></div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>{t('publicProfile.notFoundTitle')}</h2>
        <button onClick={() => navigate(-1)} style={{ marginTop: 20, background: '#1a7a3c', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 100, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>{t('publicProfile.back')}</button>
      </div>
    </div>
  )

  const avail = AVAILABILITY_KEYS[profile.availability] || AVAILABILITY_KEYS.available
  const avgRating = profile.rating?.toFixed(1) || 0

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", minHeight: '100vh', background: 'var(--bg)' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .modal { background: var(--surface); border-radius: 20px; padding: 32px; width: 100%; max-width: 460px; }
        .form-select { width: 100%; padding: 11px 14px; border-radius: 11px; border: 1.5px solid var(--border-2); font-size: 14px; font-family: 'Sora', sans-serif; color: var(--text); outline: none; background: var(--surface); cursor: pointer; }
        .form-select:focus { border-color: #1a7a3c; }
        textarea.form-input { width: 100%; padding: 11px 14px; border-radius: 11px; border: 1.5px solid var(--border-2); font-size: 14px; font-family: 'Sora', sans-serif; resize: vertical; outline: none; min-height: 90px; }
        textarea.form-input:focus { border-color: #1a7a3c; }
        @media (max-width: 768px) { .profile-grid { grid-template-columns: 1fr !important; } }
      `}</style>
      <Navbar />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '36px 24px 60px' }}>
        <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'start' }}>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 20, padding: 28, textAlign: 'center' }}>
              <div style={{ width: 76, height: 76, borderRadius: '50%', background: 'linear-gradient(135deg, #1a7a3c, #2d9a52)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: '#fff', margin: '0 auto 16px' }}>
                {profile.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>{profile.name}</div>
              {profile.jobTitle && <div style={{ fontSize: 13, color: 'var(--text-faint)', marginBottom: 10 }}>{profile.jobTitle}</div>}

              <span style={{ background: avail.bg, color: avail.color, border: `1px solid ${avail.border}`, padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 700 }}>
                {t(avail.tKey)}
              </span>

              {profile.rating > 0 && (
                <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12 }}>
                  <span style={{ color: '#f59e0b', fontSize: 18 }}><FontAwesomeIcon icon={faStar} /></span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#92400e' }}>{avgRating}</span>
                  <span style={{ fontSize: 12, color: '#92400e' }}>{t('publicProfile.reviewCount', { count: profile.totalReviews })}</span>
                </div>
              )}

              <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text-faint)' }}><FontAwesomeIcon icon={faLocationDot} style={{ marginRight: 6 }} />{profile.city}</div>
              <div style={{ marginTop: 4, fontSize: 12, color: 'var(--text-placeholder)' }}>
                {profile.role === 'worker' ? t('common.role_worker') : t('common.role_employer')}
                {profile.isVerified && <span style={{ marginLeft: 6, color: '#1a7a3c', fontWeight: 700 }}>{t('publicProfile.verified')}</span>}
              </div>

              {isEmployer && profile.role === 'worker' && (
                <button onClick={() => setShowInviteModal(true)} style={{ marginTop: 16, width: '100%', padding: '12px', borderRadius: 12, background: '#1a7a3c', color: '#fff', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif', boxShadow: '0 3px 12px rgba(26,122,60,0.25)' }}>
                  {t('publicProfile.inviteBtn')}
                </button>
              )}
              {currentUser && (
                <button onClick={() => navigate('/messages')} style={{ marginTop: 8, width: '100%', padding: '11px', borderRadius: 12, background: 'var(--surface)', color: 'var(--text-muted)', border: '1.5px solid var(--border-2)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>
                  {t('publicProfile.messagesBtn')}
                </button>
              )}
            </div>
          </div>

          {/* Main */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {profile.bio && (
              <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 18, padding: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>{t('publicProfile.aboutTitle')}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.8, margin: 0 }}>{profile.bio}</p>
              </div>
            )}

            {profile.skills?.length > 0 && (
              <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 18, padding: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>{t('publicProfile.skillsTitle')}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {profile.skills.map(s => (
                    <span key={s} style={{ background: 'var(--primary-light)', color: '#1a7a3c', border: '1px solid var(--border-3)', padding: '6px 16px', borderRadius: 100, fontSize: 13, fontWeight: 500 }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 18, padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>
                {t('publicProfile.reviewsTitle', { count: reviews.length })}
              </h3>
              {reviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '28px 24px', color: 'var(--text-placeholder)' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}><FontAwesomeIcon icon={faStar} /></div>
                  <p style={{ fontSize: 14 }}>{t('publicProfile.noReviews')}</p>
                </div>
              ) : reviews.map(rev => (
                <div key={rev._id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#1a7a3c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                      {rev.reviewer?.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{rev.reviewer?.name}</div>
                      <div style={{ display: 'flex', gap: 1 }}>
                        {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 12, color: s <= rev.rating ? '#f59e0b' : '#e0e0e0' }}><FontAwesomeIcon icon={faStar} /></span>)}
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showInviteModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowInviteModal(false)}>
          <div className="modal">
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>{t('publicProfile.modalTitle', { name: profile.name })}</h2>
            <p style={{ color: 'var(--text-faint)', fontSize: 14, marginBottom: 20 }}>{t('publicProfile.modalDesc')}</p>
            {inviteSuccess ? (
              <div style={{ textAlign: 'center', padding: '28px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>{t('publicProfile.inviteSent')}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1a7a3c' }}>{t('publicProfile.inviteSentTitle')}</div>
              </div>
            ) : (
              <>
                {inviteError && <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', color: '#cc0000', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 14 }}><FontAwesomeIcon icon={faTriangleExclamation} style={{ marginRight: 6 }} />{inviteError}</div>}
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>{t('publicProfile.offerLabel')}</label>
                  <select className="form-select" value={inviteForm.offerId} onChange={e => setInviteForm(p => ({ ...p, offerId: e.target.value }))}>
                    <option value="">{t('publicProfile.offerDefault')}</option>
                    {myOffers.filter(o => o.status === 'open').map(o => (
                      <option key={o._id} value={o._id}>{o.title}</option>
                    ))}
                  </select>
                  {myOffers.filter(o => o.status === 'open').length === 0 && (
                    <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 6 }}>{t('publicProfile.noOpenOffers')} <button onClick={() => navigate('/post-offer')} style={{ color: '#1a7a3c', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Sora, sans-serif', fontSize: 12, fontWeight: 600 }}>{t('publicProfile.publishOffer')}</button></div>
                  )}
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>{t('publicProfile.messageLabel')}</label>
                  <textarea className="form-input" placeholder={t('publicProfile.messagePlaceholder')} value={inviteForm.message} onChange={e => setInviteForm(p => ({ ...p, message: e.target.value }))} maxLength={300} />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setShowInviteModal(false)} style={{ flex: 1, padding: '13px', borderRadius: 12, border: '1.5px solid var(--border-2)', background: 'var(--surface)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Sora, sans-serif', color: 'var(--text-muted)' }}>{t('common.cancel')}</button>
                  <button onClick={handleSendInvite} disabled={inviting || !inviteForm.offerId} style={{ flex: 2, padding: '13px', borderRadius: 12, background: '#1a7a3c', color: '#fff', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif', opacity: (!inviteForm.offerId || inviting) ? 0.6 : 1 }}>
                    {inviting ? t('publicProfile.sending') : t('publicProfile.sendBtn')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
