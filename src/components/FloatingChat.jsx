import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import api from '../services/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments, faXmark, faChevronRight } from '@fortawesome/free-solid-svg-icons'

function timeAgo(d) {
  if (!d) return ''
  const diff = Math.floor((Date.now() - new Date(d)) / 1000)
  if (diff < 60) return 'maintenant'
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  return `${Math.floor(diff / 86400)}j`
}

export default function FloatingChat() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [conversations, setConversations] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const panelRef = useRef(null)

  const hidden = ['/login', '/register'].includes(location.pathname) ||
    location.pathname.startsWith('/messages/')

  useEffect(() => {
    if (!user) return
    fetchConversations()
    const interval = setInterval(fetchConversations, 20000)
    return () => clearInterval(interval)
  }, [user])

  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const fetchConversations = async () => {
    try {
      const res = await api.get('/conversations')
      const convs = res.data.data.conversations || res.data.data || []
      const sorted = [...convs].sort((a, b) =>
        new Date(b.lastMessageAt || b.createdAt) - new Date(a.lastMessageAt || a.createdAt)
      )
      setConversations(sorted.slice(0, 8))

      // Count conversations that have a lastMessage but user hasn't opened recently
      // We use conversations with lastMessage set as a proxy for "has messages"
      // Real unread = conversations where last message sender is NOT the current user
      // We can approximate this by counting convs with lastMessage
      const withMessages = sorted.filter(c => c.lastMessage && c.status !== 'closed')
      setUnreadCount(withMessages.length)
    } catch {}
  }

  // When user opens a conversation, reduce unread count
  const handleOpenConv = (convId) => {
    navigate(`/messages/${convId}`)
    setOpen(false)
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const getOther = (conv) => {
    const isEmp = user._id === conv.employer?._id || user.id === conv.employer?._id
    return isEmp ? conv.worker : conv.employer
  }

  if (!user || hidden) return null

  return (
    <>
      <style>{`
        .float-chat-panel {
          position: fixed; bottom: 80px; right: 20px; width: 320px;
          max-height: 480px; background: var(--surface);
          border: 1.5px solid var(--border-3); border-radius: 20px;
          box-shadow: 0 12px 48px rgba(0,0,0,0.18); z-index: 998;
          display: flex; flex-direction: column; overflow: hidden;
          font-family: 'Sora', sans-serif;
          animation: fcSlideUp 0.22s ease;
        }
        @keyframes fcSlideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .float-chat-btn {
          position: fixed; bottom: 20px; right: 20px;
          width: 52px; height: 52px; border-radius: 50%;
          background: #1a7a3c; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 20px rgba(26,122,60,0.4); z-index: 998;
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .float-chat-btn:hover { transform: scale(1.08); box-shadow: 0 6px 28px rgba(26,122,60,0.5); }
        .fc-conv-item {
          display: flex; align-items: center; gap: 10px;
          padding: 11px 16px; cursor: pointer;
          transition: background 0.15s; border-bottom: 1px solid var(--border);
        }
        .fc-conv-item:hover { background: var(--primary-light); }
        .fc-conv-item:last-child { border-bottom: none; }
        @media (max-width: 480px) {
          .float-chat-panel { width: calc(100vw - 24px); right: 12px; }
          .float-chat-btn { bottom: 16px; right: 16px; width: 46px; height: 46px; }
        }
      `}</style>

      <button className="float-chat-btn" onClick={() => setOpen(v => !v)}>
        {open
          ? <FontAwesomeIcon icon={faXmark} style={{ fontSize: 20, color: '#fff' }} />
          : <FontAwesomeIcon icon={faComments} style={{ fontSize: 20, color: '#fff' }} />
        }
        {/* Show unread count badge — only when panel is closed and there are unread */}
        {!open && unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: -3, right: -3,
            minWidth: 18, height: 18, borderRadius: 9,
            background: '#dc2626', color: '#fff',
            fontSize: 10, fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid #fff', padding: '0 4px',
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="float-chat-panel" ref={panelRef}>
          {/* Header */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1a7a3c' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FontAwesomeIcon icon={faComments} style={{ color: '#fff', fontSize: 16 }} />
              <span style={{ fontWeight: 700, fontSize: 15, color: '#fff', fontFamily: 'Sora, sans-serif' }}>Messages</span>
              {unreadCount > 0 && (
                <span style={{ background: '#dc2626', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 100 }}>
                  {unreadCount}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => { navigate('/messages'); setOpen(false) }}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 100, padding: '4px 10px', fontSize: 11, fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>
                Voir tout
              </button>
              <button onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', fontSize: 16, padding: '0 4px' }}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          </div>

          {/* List */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {conversations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--text-placeholder)' }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>💬</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Aucune conversation</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>Postule à une offre pour commencer</div>
              </div>
            ) : (
              conversations.map(conv => {
                const other = getOther(conv)
                const isClosed = conv.status === 'closed'
                return (
                  <div key={conv._id} className="fc-conv-item" onClick={() => handleOpenConv(conv._id)}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: isClosed ? '#888' : '#1a7a3c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                      {other?.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {other?.name || 'Utilisateur'}
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--text-placeholder)', flexShrink: 0, marginLeft: 6 }}>
                          {timeAgo(conv.lastMessageAt || conv.createdAt)}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1 }}>
                        {conv.lastMessage || <em>Démarrer la conversation</em>}
                      </div>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: 12, color: 'var(--text-placeholder)', flexShrink: 0 }} />
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </>
  )
}