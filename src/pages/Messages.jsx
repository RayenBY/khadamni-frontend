import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../store/AuthContext'
import api from '../services/api'
import Navbar from '../components/Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faComments, faLockOpen, faLock } from '@fortawesome/free-solid-svg-icons'

function timeAgo(d) {
  if (!d) return ''
  const diff = Math.floor((Date.now() - new Date(d)) / 1000)
  if (diff < 60) return 'à l\'instant'
  if (diff < 3600) return `${Math.floor(diff / 60)} min`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  return `${Math.floor(diff / 86400)}j`
}

function ConvItem({ conv, other, navigate }) {
  const isClosed = conv.status === 'closed'
  return (
    <div
      onClick={() => navigate(`/messages/${conv._id}`)}
      style={{
        background: 'var(--surface)',
        border: `1.5px solid ${isClosed ? 'var(--border)' : 'var(--border-3)'}`,
        borderRadius: 16, padding: '18px 22px', cursor: 'pointer',
        transition: 'all 0.18s', display: 'flex', alignItems: 'center', gap: 14,
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(26,122,60,0.08)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <div style={{
        width: 46, height: 46, borderRadius: '50%',
        background: isClosed ? '#888' : '#1a7a3c',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, fontWeight: 700, color: '#fff', flexShrink: 0,
      }}>
        {other?.name?.[0]?.toUpperCase() || '?'}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {other?.name || 'Utilisateur'}
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-placeholder)', flexShrink: 0 }}>
            {timeAgo(conv.lastMessageAt || conv.createdAt)}
          </span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4 }}>
          {conv.lastMessage || <em style={{ color: 'var(--text-placeholder)' }}>Démarrer la conversation</em>}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-placeholder)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {conv.offer?.title ? `📋 ${conv.offer.title}` : ''}
        </div>
      </div>
      <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: 16, color: 'var(--text-placeholder)' }} />
    </div>
  )
}

function EmptyTab({ tab, navigate, role }) {
  return (
    <div style={{ textAlign: 'center', padding: '64px 24px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 20 }}>
      <div style={{ fontSize: 52, marginBottom: 16, color: 'var(--text-placeholder)' }}>
        <FontAwesomeIcon icon={tab === 'active' ? faComments : faLock} />
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
        {tab === 'active' ? 'Aucune conversation active' : 'Aucune conversation terminée'}
      </h3>
      <p style={{ color: 'var(--text-faint)', marginBottom: 24, fontSize: 14 }}>
        {tab === 'active'
          ? role === 'worker'
            ? 'Postule à des offres pour démarrer une conversation'
            : 'Accepte un candidat pour ouvrir une conversation'
          : 'Les jobs terminés apparaîtront ici'
        }
      </p>
      {tab === 'active' && (
        <button onClick={() => navigate('/offers')} style={{ background: '#1a7a3c', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 100, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>
          Voir les offres
        </button>
      )}
    </div>
  )
}

export default function Messages() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('active')

  useEffect(() => {
    fetchConversations()
    const interval = setInterval(fetchConversations, 15000)
    return () => clearInterval(interval)
  }, [])

  const fetchConversations = async () => {
    try {
      const res = await api.get('/conversations')
      const convs = res.data.data.conversations || res.data.data || []
      const sorted = [...convs].sort((a, b) =>
        new Date(b.lastMessageAt || b.createdAt) - new Date(a.lastMessageAt || a.createdAt)
      )
      setConversations(sorted)
    } catch {}
    finally { setLoading(false) }
  }

  const getOther = (conv) => {
    const isEmp = user._id === conv.employer?._id || user.id === conv.employer?._id
    return isEmp ? conv.worker : conv.employer
  }

  const active = conversations.filter(c => c.status !== 'closed')
  const closed = conversations.filter(c => c.status === 'closed')
  const displayed = tab === 'active' ? active : closed

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", minHeight: '100vh', background: 'var(--bg)' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes shimmer { to { background-position: -200% 0; } }
        .msg-tab { padding: 9px 20px; border-radius: 100px; font-size: 13px; font-weight: 700; cursor: pointer; border: 1.5px solid var(--border-2); background: var(--surface); color: var(--text-faint); font-family: 'Sora', sans-serif; transition: all 0.18s; display: flex; align-items: center; gap: 7px; }
        .msg-tab:hover { border-color: #1a7a3c; color: #1a7a3c; background: var(--primary-light); }
        .msg-tab.active { background: #1a7a3c; color: #fff; border-color: #1a7a3c; }
        .msg-tab .badge { background: rgba(255,255,255,0.25); color: #fff; padding: 1px 6px; border-radius: 100px; font-size: 11px; font-weight: 800; }
        .msg-tab:not(.active) .badge { background: var(--border); color: var(--text-faint); }
      `}</style>
      <Navbar />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '36px 24px 60px' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>Messages</h1>
          <p style={{ color: 'var(--text-faint)', fontSize: 14 }}>
            {active.length} conversation{active.length !== 1 ? 's' : ''} active{active.length !== 1 ? 's' : ''}
            {closed.length > 0 && ` · ${closed.length} terminée${closed.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          <button className={`msg-tab ${tab === 'active' ? 'active' : ''}`} onClick={() => setTab('active')}>
            <FontAwesomeIcon icon={faLockOpen} style={{ fontSize: 13 }} />
            Actives
            <span className="badge">{active.length}</span>
          </button>
          <button className={`msg-tab ${tab === 'closed' ? 'active' : ''}`} onClick={() => setTab('closed')}>
            <FontAwesomeIcon icon={faLock} style={{ fontSize: 13 }} />
            Terminées
            <span className="badge">{closed.length}</span>
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 16, padding: '18px 22px', display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'linear-gradient(90deg,var(--skeleton-1) 25%,var(--skeleton-2) 50%,var(--skeleton-1) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.2s infinite', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ height: 14, width: '40%', background: 'linear-gradient(90deg,var(--skeleton-1) 25%,var(--skeleton-2) 50%,var(--skeleton-1) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.2s infinite', borderRadius: 8, marginBottom: 8 }} />
                  <div style={{ height: 12, width: '70%', background: 'linear-gradient(90deg,var(--skeleton-1) 25%,var(--skeleton-2) 50%,var(--skeleton-1) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.2s infinite', borderRadius: 8 }} />
                </div>
              </div>
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <EmptyTab tab={tab} navigate={navigate} role={user?.role} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {displayed.map(conv => (
              <ConvItem key={conv._id} conv={conv} other={getOther(conv)} navigate={navigate} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}