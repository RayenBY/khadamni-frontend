import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../store/AuthContext'
import api from '../services/api'
import Navbar from '../components/Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBox,
  faBroom,
  faBullhorn,
  faCalendarDays,
  faCheck,
  faCircleCheck,
  faCoins,
  faComments,
  faEnvelope,
  faHourglassHalf,
  faLaptopCode,
  faLeaf,
  faLocationDot,
  faMagnifyingGlass,
  faMugSaucer,
  faPalette,
  faSeedling,
  faStar,
  faTruck,
  faUsers,
  faUtensils,
} from '@fortawesome/free-solid-svg-icons'

const CATEGORY_ICONS = { restaurant: faUtensils, café: faMugSaucer, jardinage: faLeaf, nettoyage: faBroom, agricole: faSeedling, livraison: faTruck, design: faPalette, informatique: faLaptopCode, événementiel: faStar, autre: faBox }

function Stat({ icon, val, label, color = '#1a7a3c', sub }) {
  return (
    <div style={{ background: '#fff', border: '1.5px solid #e8f5ee', borderRadius: 16, padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 46, height: 46, borderRadius: 13, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, color, lineHeight: 1 }}>{val ?? '—'}</div>
        <div style={{ fontSize: 12, color: '#888', marginTop: 3 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: '#bbb', marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
  )
}

function Tag({ children, color = '#1a7a3c', bg = '#f0faf4', border = '#b8dfc8' }) {
  return <span style={{ background: bg, color, border: `1px solid ${border}`, padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>{children}</span>
}

function EmptyState({ icon, title, sub, action, onAction }) {
  return (
    <div style={{ textAlign: 'center', padding: '52px 24px', background: '#fff', border: '1.5px solid #e8f5ee', borderRadius: 20 }}>
      <div style={{ fontSize: 48, marginBottom: 14 }}>{icon}</div>
      <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0d1f14', marginBottom: 8 }}>{title}</h3>
      <p style={{ color: '#aaa', fontSize: 14, marginBottom: action ? 22 : 0 }}>{sub}</p>
      {action && <button onClick={onAction} style={{ background: '#1a7a3c', color: '#fff', border: 'none', padding: '11px 26px', borderRadius: 100, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}>{action}</button>}
    </div>
  )
}

/* ─────────────── WORKER: Mes candidatures ─────────────── */
function ApplicationsList({ apps, navigate }) {
  const { t } = useTranslation()
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? apps : apps.filter(a => a.status === filter)
  const counts = { pending: apps.filter(a => a.status === 'pending').length, accepted: apps.filter(a => a.status === 'accepted').length, rejected: apps.filter(a => a.status === 'rejected').length }
  const formatDate = d => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : ''

  const APP_STATUS_LABELS = {
    pending: { label: t('dashboard.app_pending'), c: '#d97706', bg: '#fffbeb', b: '#fde68a' },
    accepted: { label: t('dashboard.app_accepted'), c: '#16a34a', bg: '#f0fdf4', b: '#bbf7d0' },
    rejected: { label: t('dashboard.app_rejected'), c: '#dc2626', bg: '#fef2f2', b: '#fecaca' }
  }

  const filterTabs = [
    ['all', t('dashboard.filter_all'), apps.length],
    ['pending', t('dashboard.filter_pending'), counts.pending],
    ['accepted', t('dashboard.filter_accepted'), counts.accepted],
    ['rejected', t('dashboard.filter_rejected'), counts.rejected],
  ]

  return (
    <div>
      {/* Mini filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
        {filterTabs.map(([k, l, n]) => (
          <button key={k} onClick={() => setFilter(k)} style={{ padding: '6px 14px', borderRadius: 100, border: `1.5px solid ${filter === k ? '#1a7a3c' : '#e0e0e0'}`, background: filter === k ? '#f0faf4' : '#fff', color: filter === k ? '#1a7a3c' : '#888', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}>
            {l} {n > 0 && <span style={{ marginLeft: 2, background: filter === k ? '#1a7a3c' : '#e8f5ee', color: filter === k ? '#fff' : '#888', padding: '1px 5px', borderRadius: 6, fontSize: 10 }}>{n}</span>}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FontAwesomeIcon icon={faBox} />}
          title={filter === 'all' ? t('dashboard.empty_apps_title') : t('dashboard.empty_apps_filter')}
          sub={filter === 'all' ? t('dashboard.empty_apps_desc') : ''}
          action={filter === 'all' ? t('dashboard.empty_apps_btn') : null}
          onAction={() => navigate('/offers')}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(app => {
            const st = APP_STATUS_LABELS[app.status] || APP_STATUS_LABELS.pending
            const offer = app.offer
            return (
              <div key={app._id} onClick={() => navigate(`/offers/${offer?._id}`)} style={{ background: '#fff', border: `1.5px solid ${st.b}`, borderRadius: 15, padding: '16px 20px', cursor: 'pointer', transition: 'box-shadow 0.18s', display: 'flex', alignItems: 'center', gap: 14 }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <div style={{ width: 40, height: 40, borderRadius: 11, background: '#f0faf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}><FontAwesomeIcon icon={CATEGORY_ICONS[offer?.category] || faBox} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0d1f14', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{offer?.title || 'Offre'}</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                    {offer?.location?.city && <span>{offer.location.city} · </span>}
                    {offer?.salary?.amount && <span>{offer.salary.amount} TND/{offer.salary.unit} · </span>}
                    {formatDate(app.createdAt)}
                  </div>
                  {offer?.requiredSkills?.length > 0 && (
                    <div style={{ display: 'flex', gap: 4, marginTop: 5, flexWrap: 'wrap' }}>
                      {offer.requiredSkills.slice(0, 3).map(s => <Tag key={s}><FontAwesomeIcon icon={faCheck} style={{ marginRight: 4 }} />{s}</Tag>)}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <span style={{ background: st.bg, color: st.c, border: `1px solid ${st.b}`, padding: '4px 11px', borderRadius: 100, fontSize: 12, fontWeight: 700 }}>{st.label}</span>
                  {app.status === 'accepted' && (
                    <button onClick={ev => { ev.stopPropagation(); navigate('/messages') }} style={{ background: '#1a7a3c', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: 100, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}>{t('dashboard.chatBtn')}</button>
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

/* ─────────────── WORKER: Invitations ─────────────── */
function InvitesList({ invites, onRespond, actionLoading, navigate }) {
  const { t } = useTranslation()
  const formatDate = d => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
  if (invites.length === 0) return (
    <EmptyState
      icon={<FontAwesomeIcon icon={faEnvelope} />}
      title={t('dashboard.empty_invites_title')}
      sub={t('dashboard.empty_invites_desc')}
      action={t('dashboard.empty_invites_btn')}
      onAction={() => navigate('/post-worker-profile')}
    />
  )
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {invites.map(inv => (
        <div key={inv._id} style={{ background: '#fff', border: '1.5px solid #e8f5ee', borderRadius: 16, padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#0d1f14' }}>{inv.offer?.title || 'Offre'}</span>
                {inv.status === 'pending' && <Tag color="#8b5cf6" bg="#f5f3ff" border="#ddd6fe">{t('dashboard.invite_new')}</Tag>}
              </div>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>
                {t('dashboard.invite_from', { name: inv.employer?.name })}
                {inv.offer?.salary && <span> · {inv.offer.salary.amount} TND/{inv.offer.salary.unit}</span>}
                {inv.offer?.location?.city && <span> · {inv.offer.location.city}</span>}
                <span> · {formatDate(inv.createdAt)}</span>
              </div>
              {inv.message && (
                <p style={{ fontSize: 13, color: '#555', background: '#f9fdf9', border: '1px solid #e8f5ee', borderRadius: 10, padding: '10px 14px', margin: 0, lineHeight: 1.65, fontStyle: 'italic' }}>
                  « {inv.message} »
                </p>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              {inv.status === 'pending' ? (
                <>
                  <button onClick={() => onRespond(inv._id, 'accepted')} disabled={!!actionLoading} style={{ padding: '9px 18px', borderRadius: 100, border: 'none', background: '#1a7a3c', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}>
                    {actionLoading === inv._id + 'accepted' ? '...' : t('dashboard.acceptBtn')}
                  </button>
                  <button onClick={() => onRespond(inv._id, 'declined')} disabled={!!actionLoading} style={{ padding: '9px 18px', borderRadius: 100, border: '1.5px solid #fecaca', background: '#fef2f2', color: '#dc2626', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}>
                    {t('dashboard.rejectBtn')}
                  </button>
                </>
              ) : (
                <span style={{ background: inv.status === 'accepted' ? '#f0fdf4' : '#fef2f2', color: inv.status === 'accepted' ? '#16a34a' : '#dc2626', border: `1px solid ${inv.status === 'accepted' ? '#bbf7d0' : '#fecaca'}`, padding: '5px 14px', borderRadius: 100, fontSize: 12, fontWeight: 700 }}>
                  {inv.status === 'accepted' ? t('dashboard.invite_accepted') : t('dashboard.invite_rejected')}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─────────────── WORKER: Offres de compétences ─────────────── */
function WorkerPostsList({ posts, onDelete, navigate }) {
  const { t } = useTranslation()
  const formatDate = d => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : ''

  const AVAIL_LABELS = {
    available: { label: t('common.avail_available'), c: '#16a34a', bg: '#f0fdf4', b: '#bbf7d0' },
    open_to_offers: { label: t('common.avail_open'), c: '#d97706', bg: '#fffbeb', b: '#fde68a' },
    busy: { label: t('common.avail_busy'), c: '#dc2626', bg: '#fef2f2', b: '#fecaca' },
  }

  if (posts.length === 0) return (
    <EmptyState
      icon={<FontAwesomeIcon icon={faStar} />}
      title={t('dashboard.empty_skills_title')}
      sub={t('dashboard.empty_skills_desc')}
      action={t('dashboard.empty_skills_btn')}
      onAction={() => navigate('/post-worker-profile')}
    />
  )
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
        <button onClick={() => navigate('/post-worker-profile')} style={{ background: '#1a7a3c', color: '#fff', border: 'none', padding: '9px 20px', borderRadius: 100, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora,sans-serif', boxShadow: '0 3px 12px rgba(26,122,60,0.22)' }}>
          {t('dashboard.addSkillsBtn')}
        </button>
      </div>
      {posts.map(post => {
        const av = AVAIL_LABELS[post.availability] || AVAIL_LABELS.available
        return (
          <div key={post._id} style={{ background: '#fff', border: '1.5px solid #e8f5ee', borderRadius: 16, padding: '20px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#f0faf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}><FontAwesomeIcon icon={CATEGORY_ICONS[post.category] || faBox} /></div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0d1f14', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{post.category} · {formatDate(post.createdAt)}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ background: av.bg, color: av.c, border: `1px solid ${av.b}`, padding: '4px 11px', borderRadius: 100, fontSize: 12, fontWeight: 700 }}>
                  {av.label}
                </span>
                <button onClick={() => navigate(`/post-worker-profile?edit=${post._id}`)} style={{ padding: '6px 14px', borderRadius: 100, border: '1.5px solid #d4e8db', background: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#555', fontFamily: 'Sora,sans-serif' }}>
                  {t('dashboard.editBtn')}
                </button>
                <button onClick={() => onDelete(post._id)} style={{ padding: '6px 12px', borderRadius: 100, border: '1px solid #fecaca', background: '#fef2f2', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#dc2626', fontFamily: 'Sora,sans-serif' }}>
                  {t('dashboard.deleteBtn')}
                </button>
              </div>
            </div>

            <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6, margin: '0 0 12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {post.description}
            </p>

            {/* Skills */}
            {post.skills?.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>{t('dashboard.skillsSection')}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {post.skills.map(s => (
                    <span key={s} style={{ background: '#f0faf4', color: '#1a7a3c', border: '1px solid #b8dfc8', padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600 }}><FontAwesomeIcon icon={faCheck} style={{ marginRight: 5 }} />{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Governorates */}
            {post.governorates?.length > 0 && (
              <div style={{ fontSize: 12, color: '#888' }}>{t('dashboard.skillsZones', { zones: post.governorates.join(', ') })}</div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─────────────── EMPLOYER: Mes offres d'emploi ─────────────── */
function EmployerOffersList({ offers, navigate, onClose, onDelete, actionLoading }) {
  const { t } = useTranslation()
  const formatDate = d => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : ''

  const OFFER_STATUS_LABELS = {
    open: { label: t('common.status_open'), c: '#16a34a', bg: '#f0fdf4', b: '#bbf7d0' },
    filled: { label: t('common.status_filled'), c: '#d97706', bg: '#fffbeb', b: '#fde68a' },
    closed: { label: t('common.status_closed'), c: '#dc2626', bg: '#fef2f2', b: '#fecaca' },
    completed: { label: t('common.status_completed'), c: '#6b7280', bg: '#f9fafb', b: '#e5e7eb' },
  }

  if (offers.length === 0) return (
    <EmptyState
      icon={<FontAwesomeIcon icon={faBox} />}
      title={t('dashboard.empty_offers_title')}
      sub={t('dashboard.empty_offers_desc')}
      action={t('dashboard.empty_offers_btn')}
      onAction={() => navigate('/post-offer')}
    />
  )
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {offers.map(offer => {
        const st = OFFER_STATUS_LABELS[offer.status] || OFFER_STATUS_LABELS.open
        return (
          <div key={offer._id} style={{ background: '#fff', border: '1.5px solid #e8f5ee', borderRadius: 16, padding: '20px 24px', transition: 'box-shadow 0.18s' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
          >
            {/* Top row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: '#f0faf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}><FontAwesomeIcon icon={CATEGORY_ICONS[offer.category] || faBox} /></div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0d1f14', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 3 }}>{offer.title}</div>
                  <div style={{ fontSize: 12, color: '#888', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    <span><FontAwesomeIcon icon={faLocationDot} style={{ marginRight: 4 }} />{offer.location?.city}</span>
                    <span><FontAwesomeIcon icon={faCoins} style={{ marginRight: 4 }} />{offer.salary?.amount} TND/{offer.salary?.unit}</span>
                    <span><FontAwesomeIcon icon={faCalendarDays} style={{ marginRight: 4 }} />{formatDate(offer.createdAt)}</span>
                    {offer.urgent && <span style={{ color: '#d97706', fontWeight: 700 }}>{t('common.urgent')}</span>}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ background: '#f0faf4', color: '#1a7a3c', border: '1px solid #b8dfc8', padding: '4px 11px', borderRadius: 100, fontSize: 12, fontWeight: 700 }}>
                  {t('dashboard.candidateCount', { count: offer.applicationsCount ?? 0 })}
                </span>
                <span style={{ background: st.bg, color: st.c, border: `1px solid ${st.b}`, padding: '4px 11px', borderRadius: 100, fontSize: 12, fontWeight: 700 }}>{st.label}</span>
              </div>
            </div>

            {/* Required skills */}
            {offer.requiredSkills?.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>{t('dashboard.reqSkills')}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {offer.requiredSkills.map(s => (
                    <span key={s} style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600 }}><FontAwesomeIcon icon={faCheck} style={{ marginRight: 4 }} />{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
              <button onClick={() => navigate(`/offers/${offer._id}`)} style={{ padding: '7px 16px', borderRadius: 100, border: 'none', background: '#1a7a3c', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}>
                {t('dashboard.viewManage', { count: offer.applicationsCount ?? 0 })}
              </button>
              {offer.status === 'open' && (
                <>
                  <button onClick={() => navigate(`/post-offer?edit=${offer._id}`)} style={{ padding: '7px 14px', borderRadius: 100, border: '1.5px solid #d4e8db', background: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#555', fontFamily: 'Sora,sans-serif' }}>
                    {t('dashboard.editBtn')}
                  </button>
                  <button onClick={() => onClose(offer._id)} disabled={!!actionLoading} style={{ padding: '7px 14px', borderRadius: 100, border: '1.5px solid #fde68a', background: '#fffbeb', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#d97706', fontFamily: 'Sora,sans-serif' }}>
                    {actionLoading === offer._id + 'close' ? '...' : t('dashboard.closeOfferBtn')}
                  </button>
                </>
              )}
              <button onClick={() => onDelete(offer._id)} disabled={!!actionLoading} style={{ padding: '7px 14px', borderRadius: 100, border: '1px solid #fecaca', background: '#fef2f2', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#dc2626', fontFamily: 'Sora,sans-serif' }}>
                {actionLoading === offer._id + 'del' ? '...' : t('dashboard.deleteOfferBtn')}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user } = useAuth()
  const isWorker = user?.role === 'worker'
  const isEmployer = user?.role === 'employer'

  const [applications, setApplications] = useState([])
  const [invites, setInvites] = useState([])
  const [workerPosts, setWorkerPosts] = useState([])
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  const [tab, setTab] = useState('applications')

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
        setApplications(appsRes.data.data.applications || appsRes.data.data || [])
        setInvites(invRes.data.data.invites || invRes.data.data || [])
        setWorkerPosts(postsRes.data.data.workerPosts || postsRes.data.data || [])
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
    if (!window.confirm(t('dashboard.confirmClose'))) return
    setActionLoading(id + 'close')
    try { await api.patch(`/offers/${id}/close`); fetchData() }
    catch {}
    finally { setActionLoading(null) }
  }

  const handleDeleteOffer = async (id) => {
    if (!window.confirm(t('dashboard.confirmDeleteOffer'))) return
    setActionLoading(id + 'del')
    try { await api.delete(`/offers/${id}`); fetchData() }
    catch {}
    finally { setActionLoading(null) }
  }

  const handleDeleteWorkerPost = async (id) => {
    if (!window.confirm(t('dashboard.confirmDeleteSkill'))) return
    try { await api.delete(`/worker-posts/${id}`); fetchData() }
    catch {}
  }

  /* Stats */
  const pendingApps = applications.filter(a => a.status === 'pending').length
  const acceptedApps = applications.filter(a => a.status === 'accepted').length
  const pendingInvites = invites.filter(i => i.status === 'pending').length
  const activeOffers = offers.filter(o => o.status === 'open').length
  const totalApplicants = offers.reduce((s, o) => s + (o.applicants?.length || 0), 0)
  const pendingApplicants = offers.filter(o => o.status === 'open').reduce((s, o) => s + (o.applicants?.length || 0), 0)

  /* Tab pill style */
  const tabBtn = (key, label, badge) => (
    <button onClick={() => setTab(key)} style={{ position: 'relative', padding: '9px 18px', borderRadius: 100, fontSize: 13, fontWeight: 700, cursor: 'pointer', border: `1.5px solid ${tab === key ? '#1a7a3c' : '#e0e0e0'}`, background: tab === key ? '#1a7a3c' : '#fff', color: tab === key ? '#fff' : '#666', fontFamily: 'Sora,sans-serif', transition: 'all 0.18s' }}>
      {label}
      {badge > 0 && <span style={{ position: 'absolute', top: -5, right: -5, width: 17, height: 17, borderRadius: '50%', background: '#dc2626', color: '#fff', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{badge}</span>}
    </button>
  )

  const availLabel = (key) => {
    if (key === 'available') return t('common.avail_available')
    if (key === 'busy') return t('common.avail_busy')
    if (key === 'open_to_offers') return t('common.avail_open')
    return key
  }

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", minHeight: '100vh', background: '#f9fdf9' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        @media (max-width: 640px) { .dash-grid { grid-template-columns: 1fr 1fr !important; } }
      `}</style>
      <Navbar />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px 60px' }}>

        {/* ── Role Banner ── */}
        <div style={{ background: 'linear-gradient(135deg, #0d1f14 0%, #1a7a3c 100%)', borderRadius: 20, padding: '28px 32px', marginBottom: 28, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#7ecf9a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
              {isWorker ? t('dashboard.workerBanner') : isEmployer ? t('dashboard.employerBanner') : t('dashboard.adminBanner')}
            </div>
            <h1 style={{ fontSize: 'clamp(20px,4vw,26px)', fontWeight: 800, margin: '0 0 6px' }}>
              {t('dashboard.hello', { name: user?.name?.split(' ')[0] })}
            </h1>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', opacity: 0.85, fontSize: 13 }}>
              <span><FontAwesomeIcon icon={faLocationDot} style={{ marginRight: 5 }} />{user?.city}</span>
              {isWorker && user?.availability && <span>· {availLabel(user.availability)}</span>}
              {isEmployer && <span>· <FontAwesomeIcon icon={faCoins} style={{ marginRight: 5 }} />{user?.tokens || 0} tokens</span>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {isEmployer && (
              <button onClick={() => navigate('/post-offer')} style={{ background: '#fff', color: '#1a7a3c', border: 'none', padding: '11px 22px', borderRadius: 100, fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'Sora,sans-serif', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
                {t('dashboard.postOffer')}
              </button>
            )}
            {isWorker && (
              <button onClick={() => navigate('/post-worker-profile')} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.35)', padding: '11px 20px', borderRadius: 100, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora,sans-serif', backdropFilter: 'blur(6px)' }}>
                {t('dashboard.manageSkills')}
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: '#aaa' }}>{t('common.loading')}</div>
        ) : (
          <>
            {/* ── Stats ── */}
            <div className="dash-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
              {isWorker ? (
                <>
                  <Stat icon={<FontAwesomeIcon icon={faHourglassHalf} />} val={pendingApps} label={t('dashboard.stat_pending')} color="#d97706" />
                  <Stat icon={<FontAwesomeIcon icon={faCircleCheck} />} val={acceptedApps} label={t('dashboard.stat_accepted')} color="#16a34a" />
                  <Stat icon={<FontAwesomeIcon icon={faEnvelope} />} val={pendingInvites} label={t('dashboard.stat_invitations')} color="#8b5cf6"
                    sub={pendingInvites > 0 ? t('dashboard.stat_invitations_sub', { count: pendingInvites }) : undefined} />
                  <Stat icon={<FontAwesomeIcon icon={faStar} />} val={workerPosts.length} label={t('dashboard.stat_posts')} color="#0ea5e9" />
                </>
              ) : (
                <>
                  <Stat icon={<FontAwesomeIcon icon={faBullhorn} />} val={activeOffers} label={t('dashboard.stat_activeOffers')} />
                  <Stat icon={<FontAwesomeIcon icon={faUsers} />} val={totalApplicants} label={t('dashboard.stat_candidates')} color="#8b5cf6"
                    sub={pendingApplicants > 0 ? t('dashboard.stat_candidates_sub', { count: pendingApplicants }) : undefined} />
                  <Stat icon={<FontAwesomeIcon icon={faBox} />} val={offers.length} label={t('dashboard.stat_published')} color="#0ea5e9" />
                  <Stat icon={<FontAwesomeIcon icon={faCoins} />} val={user?.tokens || 0} label={t('dashboard.stat_tokens')} color="#d97706"
                    sub={t('dashboard.stat_tokens_sub')} />
                </>
              )}
            </div>

            {/* ── WORKER TABS ── */}
            {isWorker && (
              <>
                <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                  {tabBtn('applications', t('dashboard.tab_applications'), pendingApps)}
                  {tabBtn('invites', t('dashboard.tab_invitations'), pendingInvites)}
                  {tabBtn('skills', t('dashboard.tab_skills'), 0)}
                </div>

                {/* What you can do on this tab */}
                <div style={{ marginBottom: 16, padding: '10px 16px', background: '#fff', border: '1px solid #e8f5ee', borderRadius: 12, fontSize: 12, color: '#888', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {tab === 'applications' && <><span>{t('dashboard.info_apps')}</span><span>·</span><span>{t('dashboard.info_apps2')}</span></>}
                  {tab === 'invites' && <><span>{t('dashboard.info_invites')}</span><span>·</span><span>{t('dashboard.info_invites2')}</span></>}
                  {tab === 'skills' && <><span>{t('dashboard.info_skills')}</span><span>·</span><span>{t('dashboard.info_skills2')}</span><span>·</span><span>{t('dashboard.info_skills3')}</span></>}
                </div>

                {tab === 'applications' && <ApplicationsList apps={applications} navigate={navigate} />}
                {tab === 'invites' && <InvitesList invites={invites} onRespond={handleInviteRespond} actionLoading={actionLoading} navigate={navigate} />}
                {tab === 'skills' && <WorkerPostsList posts={workerPosts} onDelete={handleDeleteWorkerPost} navigate={navigate} />}
              </>
            )}

            {/* ── EMPLOYER SECTIONS ── */}
            {isEmployer && (
              <>
                {/* What employer can do */}
                <div style={{ marginBottom: 20, padding: '14px 20px', background: '#fff', border: '1.5px solid #e8f5ee', borderRadius: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0d1f14', marginBottom: 8 }}>{t('dashboard.canDo')}</div>
                  <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                    {[
                      { icon: faBox, text: t('dashboard.canDo_1'), action: () => navigate('/post-offer') },
                      { icon: faUsers, text: t('dashboard.canDo_2'), action: () => {} },
                      { icon: faMagnifyingGlass, text: t('dashboard.canDo_3'), action: () => navigate('/workers') },
                      { icon: faComments, text: t('dashboard.canDo_4'), action: () => navigate('/messages') },
                    ].map(item => (
                      <button key={item.text} onClick={item.action} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 14px', borderRadius: 100, border: '1.5px solid #e8f5ee', background: '#fafafa', fontSize: 12, fontWeight: 600, color: '#555', cursor: 'pointer', fontFamily: 'Sora,sans-serif', transition: 'all 0.18s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#1a7a3c'; e.currentTarget.style.color = '#1a7a3c'; e.currentTarget.style.background = '#f0faf4' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8f5ee'; e.currentTarget.style.color = '#555'; e.currentTarget.style.background = '#fafafa' }}
                      >
                        <span><FontAwesomeIcon icon={item.icon} /></span> {item.text}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0d1f14', margin: 0 }}>{t('dashboard.myOffersTitle')}</h2>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => navigate('/workers')} style={{ padding: '8px 16px', borderRadius: 100, border: '1.5px solid #b8dfc8', background: '#f0faf4', fontSize: 12, fontWeight: 600, color: '#1a7a3c', cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}>
                      {t('dashboard.findTalents')}
                    </button>
                    <button onClick={() => navigate('/post-offer')} style={{ padding: '8px 16px', borderRadius: 100, border: 'none', background: '#1a7a3c', fontSize: 12, fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}>
                      {t('dashboard.newOffer')}
                    </button>
                  </div>
                </div>

                <EmployerOffersList
                  offers={offers}
                  navigate={navigate}
                  onClose={handleCloseOffer}
                  onDelete={handleDeleteOffer}
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
