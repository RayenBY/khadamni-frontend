import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../store/AuthContext'
import api from '../services/api'
import Navbar from '../components/Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBox, faBroom, faBullhorn, faCalendarDays, faCheck, faCircleCheck,
  faCoins, faComments, faEnvelope, faHourglassHalf, faLaptopCode, faLeaf,
  faLocationDot, faMagnifyingGlass, faMugSaucer, faPalette, faSeedling,
  faStar, faTruck, faUsers, faUtensils, faTimes, faXmark,
} from '@fortawesome/free-solid-svg-icons'

const CATEGORY_ICONS = {
  restaurant: faUtensils, café: faMugSaucer, jardinage: faLeaf, nettoyage: faBroom,
  agricole: faSeedling, livraison: faTruck, design: faPalette, informatique: faLaptopCode,
  événementiel: faStar, autre: faBox
}

/* ─── Rating Modal ─── */
function RatingModal({ target, offerId, offerTitle, onClose, onSuccess }) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (rating === 0) return setError('Choisis une note')
    if (!comment.trim()) return setError('Laisse un commentaire')
    setLoading(true)
    try {
      await api.post('/reviews', { revieweeId: target._id, offerId, rating, comment })
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'var(--surface)', borderRadius: 20, padding: '32px', maxWidth: 440, width: '100%', fontFamily: 'Sora, sans-serif', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)', fontSize: 18 }}>
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>Laisser un avis</h3>
        <p style={{ fontSize: 13, color: 'var(--text-faint)', marginBottom: 24 }}>
          Pour <strong>{target?.name}</strong> · {offerTitle}
        </p>

        {/* Stars */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, justifyContent: 'center' }}>
          {[1, 2, 3, 4, 5].map(s => (
            <button key={s}
              onClick={() => setRating(s)}
              onMouseEnter={() => setHovered(s)}
              onMouseLeave={() => setHovered(0)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 36, color: s <= (hovered || rating) ? '#f59e0b' : '#e5e7eb', transition: 'color 0.15s, transform 0.1s', transform: s <= (hovered || rating) ? 'scale(1.15)' : 'scale(1)' }}
            >★</button>
          ))}
        </div>
        {rating > 0 && (
          <div style={{ textAlign: 'center', fontSize: 13, color: '#f59e0b', fontWeight: 700, marginBottom: 16 }}>
            {['', 'Très mauvais', 'Mauvais', 'Correct', 'Bien', 'Excellent'][rating]}
          </div>
        )}

        {/* Comment */}
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Décris ton expérience de travail avec cette personne..."
          style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid var(--border-2)', background: 'var(--input-bg)', fontSize: 13, fontFamily: 'Sora, sans-serif', color: 'var(--text)', outline: 'none', resize: 'vertical', minHeight: 90, lineHeight: 1.6 }}
        />

        {error && <div style={{ color: '#dc2626', fontSize: 13, marginTop: 8 }}>{error}</div>}

        <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', marginTop: 16, padding: '13px', borderRadius: 12, background: '#1a7a3c', color: '#fff', border: 'none', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Envoi...' : 'Publier l\'avis ⭐'}
        </button>
      </div>
    </div>
  )
}

function Stat({ icon, val, label, color = '#1a7a3c', sub }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 16, padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 46, height: 46, borderRadius: 13, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, color, lineHeight: 1 }}>{val ?? '—'}</div>
        <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 3 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: 'var(--text-placeholder)', marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
  )
}

function Tag({ children, color = '#1a7a3c', bg = '#f0faf4', border = '#b8dfc8' }) {
  return <span style={{ background: bg, color, border: `1px solid ${border}`, padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>{children}</span>
}

function EmptyState({ icon, title, sub, action, onAction }) {
  return (
    <div style={{ textAlign: 'center', padding: '52px 24px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 20 }}>
      <div style={{ fontSize: 48, marginBottom: 14 }}>{icon}</div>
      <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>{title}</h3>
      <p style={{ color: 'var(--text-faint)', fontSize: 14, marginBottom: action ? 22 : 0 }}>{sub}</p>
      {action && <button onClick={onAction} style={{ background: '#1a7a3c', color: '#fff', border: 'none', padding: '11px 26px', borderRadius: 100, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}>{action}</button>}
    </div>
  )
}

/* ─── WORKER: Applications + accepted job invites merged ─── */
function ApplicationsList({ apps, acceptedInvites, navigate, onRate }) {
  const { t } = useTranslation()
  const [filter, setFilter] = useState('all')
  const formatDate = d => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : ''

  // Merge applications + accepted invites into one list
  const allItems = [
    ...apps.map(a => ({ ...a, _source: 'application' })),
    ...acceptedInvites.map(inv => ({
      _id: inv._id,
      _source: 'invite',
      status: 'accepted',
      offer: inv.offer,
      createdAt: inv.createdAt,
      conversationId: inv.conversationId,
    }))
  ]

  const filtered = filter === 'all' ? allItems : allItems.filter(a => a.status === filter)
  const counts = {
    pending: allItems.filter(a => a.status === 'pending').length,
    accepted: allItems.filter(a => a.status === 'accepted').length,
    rejected: allItems.filter(a => a.status === 'rejected').length,
  }

  const APP_STATUS_LABELS = {
    pending: { label: t('dashboard.app_pending') || 'En attente', c: '#d97706', bg: '#fffbeb', b: '#fde68a' },
    accepted: { label: t('dashboard.app_accepted') || 'Accepté', c: '#16a34a', bg: '#f0fdf4', b: '#bbf7d0' },
    rejected: { label: t('dashboard.app_rejected') || 'Refusé', c: '#dc2626', bg: '#fef2f2', b: '#fecaca' },
  }

  const filterTabs = [
    ['all', t('dashboard.filter_all') || 'Tous', allItems.length],
    ['pending', t('dashboard.filter_pending') || 'En attente', counts.pending],
    ['accepted', t('dashboard.filter_accepted') || 'Acceptés', counts.accepted],
    ['rejected', t('dashboard.filter_rejected') || 'Refusés', counts.rejected],
  ]

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
        {filterTabs.map(([k, l, n]) => (
          <button key={k} onClick={() => setFilter(k)} style={{ padding: '6px 14px', borderRadius: 100, border: `1.5px solid ${filter === k ? '#1a7a3c' : 'var(--border-2)'}`, background: filter === k ? '#f0faf4' : 'var(--surface)', color: filter === k ? '#1a7a3c' : 'var(--text-faint)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}>
            {l} {n > 0 && <span style={{ marginLeft: 2, background: filter === k ? '#1a7a3c' : 'var(--border)', color: filter === k ? '#fff' : 'var(--text-faint)', padding: '1px 5px', borderRadius: 6, fontSize: 10 }}>{n}</span>}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FontAwesomeIcon icon={faBox} />}
          title={filter === 'all' ? (t('dashboard.empty_apps_title') || 'Aucune candidature') : 'Aucun résultat'}
          sub={filter === 'all' ? (t('dashboard.empty_apps_desc') || 'Postule à des offres') : ''}
          action={filter === 'all' ? (t('dashboard.empty_apps_btn') || 'Voir les offres') : null}
          onAction={() => navigate('/offers')}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(app => {
            const st = APP_STATUS_LABELS[app.status] || APP_STATUS_LABELS.pending
            const offer = app.offer
            const isInvite = app._source === 'invite'
            return (
              <div key={app._id} style={{ background: 'var(--surface)', border: `1.5px solid ${st.b}`, borderRadius: 15, padding: '16px 20px', cursor: 'pointer', transition: 'box-shadow 0.18s', display: 'flex', alignItems: 'center', gap: 14 }}
                onClick={() => navigate(`/offers/${offer?._id}`)}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <div style={{ width: 40, height: 40, borderRadius: 11, background: '#f0faf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                  <FontAwesomeIcon icon={CATEGORY_ICONS[offer?.category] || faBox} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{offer?.title || 'Offre'}</div>
                    {isInvite && <span style={{ background: '#f5f3ff', color: '#8b5cf6', border: '1px solid #ddd6fe', padding: '2px 8px', borderRadius: 100, fontSize: 10, fontWeight: 700, flexShrink: 0 }}>Invitation</span>}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 2 }}>
                    {offer?.location?.city && <span>{offer.location.city} · </span>}
                    {offer?.salary?.amount && <span>{offer.salary.amount} TND/{offer.salary.unit} · </span>}
                    {formatDate(app.createdAt)}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <span style={{ background: st.bg, color: st.c, border: `1px solid ${st.b}`, padding: '4px 11px', borderRadius: 100, fontSize: 12, fontWeight: 700 }}>{st.label}</span>
                  {app.status === 'accepted' && (
                    <button onClick={ev => { ev.stopPropagation(); navigate('/messages') }}
                      style={{ background: '#1a7a3c', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: 100, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}>
                      Chat
                    </button>
                  )}
                  {app.status === 'accepted' && offer?.status === 'completed' && (
                    <button onClick={ev => { ev.stopPropagation(); onRate(offer, app) }}
                      style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: 100, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}>
                      ⭐ Noter
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ─── WORKER: Invitations ─── */
function InvitesList({ invites, onRespond, actionLoading, navigate }) {
  const { t } = useTranslation()
  const formatDate = d => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
  if (invites.length === 0) return (
    <EmptyState
      icon={<FontAwesomeIcon icon={faEnvelope} />}
      title={t('dashboard.empty_invites_title') || 'Aucune invitation'}
      sub={t('dashboard.empty_invites_desc') || 'Les employeurs peuvent t\'inviter directement'}
      action={t('dashboard.empty_invites_btn') || 'Créer mon profil'}
      onAction={() => navigate('/post-worker-profile')}
    />
  )
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {invites.map(inv => (
        <div key={inv._id} style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 16, padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{inv.offer?.title || 'Offre'}</span>
                {inv.status === 'pending' && <Tag color="#8b5cf6" bg="#f5f3ff" border="#ddd6fe">Nouveau</Tag>}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-faint)', marginBottom: 6 }}>
                De {inv.employer?.name}
                {inv.offer?.salary && <span> · {inv.offer.salary.amount} TND/{inv.offer.salary.unit}</span>}
                {inv.offer?.location?.city && <span> · {inv.offer.location.city}</span>}
                <span> · {formatDate(inv.createdAt)}</span>
              </div>
              {inv.message && (
                <p style={{ fontSize: 13, color: 'var(--text-muted)', background: 'var(--primary-light)', border: '1px solid var(--border-3)', borderRadius: 10, padding: '10px 14px', margin: 0, lineHeight: 1.65, fontStyle: 'italic' }}>
                  « {inv.message} »
                </p>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              {inv.status === 'pending' ? (
                <>
                  <button onClick={() => onRespond(inv._id, 'accepted')} disabled={!!actionLoading} style={{ padding: '9px 18px', borderRadius: 100, border: 'none', background: '#1a7a3c', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}>
                    {actionLoading === inv._id + 'accepted' ? '...' : 'Accepter'}
                  </button>
                  <button onClick={() => onRespond(inv._id, 'declined')} disabled={!!actionLoading} style={{ padding: '9px 18px', borderRadius: 100, border: '1.5px solid #fecaca', background: '#fef2f2', color: '#dc2626', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}>
                    Refuser
                  </button>
                </>
              ) : (
                <span style={{ background: inv.status === 'accepted' ? '#f0fdf4' : '#fef2f2', color: inv.status === 'accepted' ? '#16a34a' : '#dc2626', border: `1px solid ${inv.status === 'accepted' ? '#bbf7d0' : '#fecaca'}`, padding: '5px 14px', borderRadius: 100, fontSize: 12, fontWeight: 700 }}>
                  {inv.status === 'accepted' ? 'Acceptée' : 'Refusée'}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── WORKER: Posts ─── */
function WorkerPostsList({ posts, onDelete, navigate }) {
  const { t } = useTranslation()
  const formatDate = d => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
  const AVAIL_LABELS = {
    available: { label: 'Disponible', c: '#16a34a', bg: '#f0fdf4', b: '#bbf7d0' },
    open_to_offers: { label: 'Ouvert aux offres', c: '#d97706', bg: '#fffbeb', b: '#fde68a' },
    busy: { label: 'Occupé', c: '#dc2626', bg: '#fef2f2', b: '#fecaca' },
  }
  if (posts.length === 0) return (
    <EmptyState
      icon={<FontAwesomeIcon icon={faStar} />}
      title="Aucun post de compétences"
      sub="Montre ce que tu sais faire pour être trouvé par les employeurs"
      action="Créer mon profil"
      onAction={() => navigate('/post-worker-profile')}
    />
  )
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
        <button onClick={() => navigate('/post-worker-profile')} style={{ background: '#1a7a3c', color: '#fff', border: 'none', padding: '9px 20px', borderRadius: 100, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora,sans-serif', boxShadow: '0 3px 12px rgba(26,122,60,0.22)' }}>
          + Ajouter
        </button>
      </div>
      {posts.map(post => {
        const av = AVAIL_LABELS[post.availability] || AVAIL_LABELS.available
        return (
          <div key={post._id} style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 16, padding: '20px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#f0faf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                  <FontAwesomeIcon icon={CATEGORY_ICONS[post.category] || faBox} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 2 }}>{post.category} · {formatDate(post.createdAt)}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ background: av.bg, color: av.c, border: `1px solid ${av.b}`, padding: '4px 11px', borderRadius: 100, fontSize: 12, fontWeight: 700 }}>{av.label}</span>
                <button onClick={() => navigate(`/post-worker-profile?edit=${post._id}`)} style={{ padding: '6px 14px', borderRadius: 100, border: '1.5px solid var(--border-2)', background: 'var(--surface)', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: 'var(--text-muted)', fontFamily: 'Sora,sans-serif' }}>Modifier</button>
                <button onClick={() => onDelete(post._id)} style={{ padding: '6px 12px', borderRadius: 100, border: '1px solid #fecaca', background: '#fef2f2', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#dc2626', fontFamily: 'Sora,sans-serif' }}>Supprimer</button>
              </div>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.description}</p>
            {post.skills?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {post.skills.map(s => (
                  <span key={s} style={{ background: '#f0faf4', color: '#1a7a3c', border: '1px solid #b8dfc8', padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600 }}>
                    <FontAwesomeIcon icon={faCheck} style={{ marginRight: 5 }} />{s}
                  </span>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─── EMPLOYER: Offers ─── */
function EmployerOffersList({ offers, navigate, onClose, onDelete, onRate, actionLoading }) {
  const { t } = useTranslation()
  const formatDate = d => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
  const OFFER_STATUS = {
    open: { label: 'Ouvert', c: '#16a34a', bg: '#f0fdf4', b: '#bbf7d0' },
    filled: { label: 'Pourvu', c: '#d97706', bg: '#fffbeb', b: '#fde68a' },
    closed: { label: 'Fermé', c: '#dc2626', bg: '#fef2f2', b: '#fecaca' },
    completed: { label: 'Terminé', c: '#6b7280', bg: '#f9fafb', b: '#e5e7eb' },
  }
  if (offers.length === 0) return (
    <EmptyState
      icon={<FontAwesomeIcon icon={faBox} />}
      title="Aucune offre publiée"
      sub="Publie ta première offre d'emploi"
      action="Publier une offre"
      onAction={() => navigate('/post-offer')}
    />
  )
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {offers.map(offer => {
        const st = OFFER_STATUS[offer.status] || OFFER_STATUS.open
        return (
          <div key={offer._id} style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 16, padding: '20px 24px', transition: 'box-shadow 0.18s' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: '#f0faf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                  <FontAwesomeIcon icon={CATEGORY_ICONS[offer.category] || faBox} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 3 }}>{offer.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-faint)', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    <span><FontAwesomeIcon icon={faLocationDot} style={{ marginRight: 4 }} />{offer.location?.city}</span>
                    <span><FontAwesomeIcon icon={faCoins} style={{ marginRight: 4 }} />{offer.salary?.amount} TND/{offer.salary?.unit}</span>
                    <span><FontAwesomeIcon icon={faCalendarDays} style={{ marginRight: 4 }} />{formatDate(offer.createdAt)}</span>
                    {offer.urgent && <span style={{ color: '#d97706', fontWeight: 700 }}>⚡ Urgent</span>}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ background: '#f0faf4', color: '#1a7a3c', border: '1px solid #b8dfc8', padding: '4px 11px', borderRadius: 100, fontSize: 12, fontWeight: 700 }}>
                  {offer.applicationsCount ?? 0} candidat{(offer.applicationsCount ?? 0) !== 1 ? 's' : ''}
                </span>
                <span style={{ background: st.bg, color: st.c, border: `1px solid ${st.b}`, padding: '4px 11px', borderRadius: 100, fontSize: 12, fontWeight: 700 }}>{st.label}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              <button onClick={() => navigate(`/offers/${offer._id}`)} style={{ padding: '7px 16px', borderRadius: 100, border: 'none', background: '#1a7a3c', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}>
                Voir & gérer
              </button>
              {offer.status === 'open' && (
                <>
                  <button onClick={() => navigate(`/post-offer?edit=${offer._id}`)} style={{ padding: '7px 14px', borderRadius: 100, border: '1.5px solid var(--border-2)', background: 'var(--surface)', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: 'var(--text-muted)', fontFamily: 'Sora,sans-serif' }}>
                    Modifier
                  </button>
                  <button onClick={() => onClose(offer._id)} disabled={!!actionLoading} style={{ padding: '7px 14px', borderRadius: 100, border: '1.5px solid #fde68a', background: '#fffbeb', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#d97706', fontFamily: 'Sora,sans-serif' }}>
                    {actionLoading === offer._id + 'close' ? '...' : 'Fermer'}
                  </button>
                </>
              )}
              {/* Rate accepted worker when job completed */}
              {offer.status === 'completed' && offer.acceptedWorker && (
                <button onClick={() => onRate(offer)} style={{ padding: '7px 14px', borderRadius: 100, border: 'none', background: '#f59e0b', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}>
                  ⭐ Noter le travailleur
                </button>
              )}
              <button onClick={() => onDelete(offer._id)} disabled={!!actionLoading} style={{ padding: '7px 14px', borderRadius: 100, border: '1px solid #fecaca', background: '#fef2f2', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#dc2626', fontFamily: 'Sora,sans-serif' }}>
                {actionLoading === offer._id + 'del' ? '...' : 'Supprimer'}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════ MAIN ═══════════════════════════════════ */
export default function Dashboard() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user } = useAuth()
  const isWorker = user?.role === 'worker'
  const isEmployer = user?.role === 'employer'

  const [applications, setApplications] = useState([])
  const [acceptedInvites, setAcceptedInvites] = useState([])
  const [invites, setInvites] = useState([])
  const [workerPosts, setWorkerPosts] = useState([])
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  const [tab, setTab] = useState('applications')

  // Rating modal state
  const [ratingModal, setRatingModal] = useState(null)
  // { target: userObj, offerId, offerTitle }

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      if (isWorker) {
        const [appsRes, invRes, postsRes] = await Promise.all([
          api.get('/applications/my'),
          api.get('/job-invites/my'),
          api.get('/worker-posts/my'),
        ])
        const apps = appsRes.data.data.applications || appsRes.data.data || []
        const allInvites = invRes.data.data.invites || invRes.data.data || []
        setApplications(apps)
        setInvites(allInvites)
        // Accepted invites go into the applications tab
        setAcceptedInvites(allInvites.filter(i => i.status === 'accepted'))
        setWorkerPosts(postsRes.data.data.posts || postsRes.data.data || [])
      } else if (isEmployer) {
        const res = await api.get('/offers?limit=50')
        const all = res.data.data.offers || res.data.data || []
        setOffers(all.filter(o => String(o.employer?._id || o.employer) === String(user._id || user.id)))
      }
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleInviteRespond = async (id, status) => {
    setActionLoading(id + status)
    try { await api.put(`/job-invites/${id}/respond`, { status }); fetchData() }
    catch {}
    finally { setActionLoading(null) }
  }

  const handleCloseOffer = async (id) => {
    if (!window.confirm('Fermer cette offre ?')) return
    setActionLoading(id + 'close')
    try { await api.patch(`/offers/${id}/close`); fetchData() }
    catch {}
    finally { setActionLoading(null) }
  }

  const handleDeleteOffer = async (id) => {
    if (!window.confirm('Supprimer cette offre ?')) return
    setActionLoading(id + 'del')
    try { await api.delete(`/offers/${id}`); fetchData() }
    catch {}
    finally { setActionLoading(null) }
  }

  const handleDeleteWorkerPost = async (id) => {
    if (!window.confirm('Supprimer ce post ?')) return
    try { await api.delete(`/worker-posts/${id}`); fetchData() }
    catch {}
  }

  // Worker wants to rate employer (or vice versa) after job completed
  const handleWorkerRate = (offer, app) => {
    // Worker rates the employer
    setRatingModal({
      target: offer.employer,
      offerId: offer._id,
      offerTitle: offer.title,
    })
  }

  // Employer rates accepted worker
  const handleEmployerRate = async (offer) => {
    if (!offer.acceptedWorker) return
    try {
      const res = await api.get(`/users/${offer.acceptedWorker}`)
      const worker = res.data.data.user
      setRatingModal({ target: worker, offerId: offer._id, offerTitle: offer.title })
    } catch {}
  }

  /* Stats */
  const pendingApps = applications.filter(a => a.status === 'pending').length
  const acceptedApps = applications.filter(a => a.status === 'accepted').length + acceptedInvites.length
  const pendingInvites = invites.filter(i => i.status === 'pending').length
  const activeOffers = offers.filter(o => o.status === 'open').length
  const totalApplicants = offers.reduce((s, o) => s + (o.applicants?.length || 0), 0)
  const pendingApplicants = offers.filter(o => o.status === 'open').reduce((s, o) => s + (o.applicants?.length || 0), 0)

  const tabBtn = (key, label, badge) => (
    <button onClick={() => setTab(key)} style={{ position: 'relative', padding: '9px 18px', borderRadius: 100, fontSize: 13, fontWeight: 700, cursor: 'pointer', border: `1.5px solid ${tab === key ? '#1a7a3c' : 'var(--border-2)'}`, background: tab === key ? '#1a7a3c' : 'var(--surface)', color: tab === key ? '#fff' : 'var(--text-faint)', fontFamily: 'Sora,sans-serif', transition: 'all 0.18s' }}>
      {label}
      {badge > 0 && <span style={{ position: 'absolute', top: -5, right: -5, width: 17, height: 17, borderRadius: '50%', background: '#dc2626', color: '#fff', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{badge}</span>}
    </button>
  )

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", minHeight: '100vh', background: 'var(--bg)' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
      <style>{`*, *::before, *::after { box-sizing: border-box; } @media (max-width: 640px) { .dash-grid { grid-template-columns: 1fr 1fr !important; } }`}</style>

      <Navbar />

      {/* Rating Modal */}
      {ratingModal && (
        <RatingModal
          target={ratingModal.target}
          offerId={ratingModal.offerId}
          offerTitle={ratingModal.offerTitle}
          onClose={() => setRatingModal(null)}
          onSuccess={() => { setRatingModal(null); fetchData() }}
        />
      )}

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px 60px' }}>

        {/* Banner */}
        <div style={{ background: 'linear-gradient(135deg, #0d1f14 0%, #1a7a3c 100%)', borderRadius: 20, padding: '28px 32px', marginBottom: 28, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#7ecf9a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
              {isWorker ? 'Espace Travailleur' : isEmployer ? 'Espace Employeur' : 'Espace Admin'}
            </div>
            <h1 style={{ fontSize: 'clamp(20px,4vw,26px)', fontWeight: 800, margin: '0 0 6px' }}>
              Bonjour, {user?.name?.split(' ')[0]} 👋
            </h1>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', opacity: 0.85, fontSize: 13 }}>
              <span><FontAwesomeIcon icon={faLocationDot} style={{ marginRight: 5 }} />{user?.city}</span>
              <span>· <FontAwesomeIcon icon={faCoins} style={{ marginRight: 5 }} />{user?.tokens || 0} tokens</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {isEmployer && (
              <button onClick={() => navigate('/post-offer')} style={{ background: '#fff', color: '#1a7a3c', border: 'none', padding: '11px 22px', borderRadius: 100, fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'Sora,sans-serif', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
                + Publier une offre
              </button>
            )}
            {isWorker && (
              <button onClick={() => navigate('/post-worker-profile')} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.35)', padding: '11px 20px', borderRadius: 100, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}>
                Gérer mes compétences
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-faint)' }}>Chargement...</div>
        ) : (
          <>
            {/* Stats */}
            <div className="dash-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
              {isWorker ? (
                <>
                  <Stat icon={<FontAwesomeIcon icon={faHourglassHalf} />} val={pendingApps} label="En attente" color="#d97706" />
                  <Stat icon={<FontAwesomeIcon icon={faCircleCheck} />} val={acceptedApps} label="Acceptés" color="#16a34a" />
                  <Stat icon={<FontAwesomeIcon icon={faEnvelope} />} val={pendingInvites} label="Invitations" color="#8b5cf6" sub={pendingInvites > 0 ? `${pendingInvites} nouvelle${pendingInvites > 1 ? 's' : ''}` : undefined} />
                  <Stat icon={<FontAwesomeIcon icon={faStar} />} val={workerPosts.length} label="Posts actifs" color="#0ea5e9" />
                </>
              ) : (
                <>
                  <Stat icon={<FontAwesomeIcon icon={faBullhorn} />} val={activeOffers} label="Offres actives" />
                  <Stat icon={<FontAwesomeIcon icon={faUsers} />} val={totalApplicants} label="Candidats" color="#8b5cf6" sub={pendingApplicants > 0 ? `${pendingApplicants} en attente` : undefined} />
                  <Stat icon={<FontAwesomeIcon icon={faBox} />} val={offers.length} label="Publiées" color="#0ea5e9" />
                  <Stat icon={<FontAwesomeIcon icon={faCoins} />} val={user?.tokens || 0} label="Tokens" color="#d97706" sub="1 token = 1 offre" />
                </>
              )}
            </div>

            {/* Worker tabs */}
            {isWorker && (
              <>
                <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                  {tabBtn('applications', 'Candidatures & Jobs', pendingApps)}
                  {tabBtn('invites', 'Invitations', pendingInvites)}
                  {tabBtn('skills', 'Mes compétences', 0)}
                </div>
                {tab === 'applications' && <ApplicationsList apps={applications} acceptedInvites={acceptedInvites} navigate={navigate} onRate={handleWorkerRate} />}
                {tab === 'invites' && <InvitesList invites={invites} onRespond={handleInviteRespond} actionLoading={actionLoading} navigate={navigate} />}
                {tab === 'skills' && <WorkerPostsList posts={workerPosts} onDelete={handleDeleteWorkerPost} navigate={navigate} />}
              </>
            )}

            {/* Employer sections */}
            {isEmployer && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', margin: 0 }}>Mes offres d'emploi</h2>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => navigate('/workers')} style={{ padding: '8px 16px', borderRadius: 100, border: '1.5px solid var(--border-3)', background: 'var(--primary-light)', fontSize: 12, fontWeight: 600, color: '#1a7a3c', cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}>
                      Trouver des talents
                    </button>
                    <button onClick={() => navigate('/post-offer')} style={{ padding: '8px 16px', borderRadius: 100, border: 'none', background: '#1a7a3c', fontSize: 12, fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}>
                      + Nouvelle offre
                    </button>
                  </div>
                </div>
                <EmployerOffersList
                  offers={offers}
                  navigate={navigate}
                  onClose={handleCloseOffer}
                  onDelete={handleDeleteOffer}
                  onRate={handleEmployerRate}
                  actionLoading={actionLoading}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}