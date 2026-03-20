import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import api from '../services/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'

function timeAgo(d) {
  if (!d) return ''
  const diff = Math.floor((Date.now() - new Date(d)) / 1000)
  if (diff < 60) return 'à l\'instant'
  if (diff < 3600) return `${Math.floor(diff / 60)}min`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  return `${Math.floor(diff / 86400)}j`
}

const NOTIF_ICONS = {
  new_application: '📋',
  application_accepted: '🎉',
  application_rejected: '❌',
  new_job_invite: '💌',
  job_invite_accepted: '✅',
  job_invite_declined: '🚫',
  new_message: '💬',
  job_completed: '🏁',
  new_review: '⭐',
}

export default function NotificationBell() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [notifs, setNotifs] = useState([])
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(false)
  const dropRef = useRef(null)

  useEffect(() => {
    if (!user) return
    fetchNotifs()
    const interval = setInterval(fetchNotifs, 30000)
    return () => clearInterval(interval)
  }, [user])

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const fetchNotifs = async () => {
    try {
      const res = await api.get('/notifications')
      setNotifs(res.data.data.notifs || [])
      setUnread(res.data.data.unread || 0)
    } catch {}
  }

  const handleOpen = () => {
    setOpen(v => !v)
    if (!open && unread > 0) {
      // Mark all as read when opening
      api.put('/notifications/read-all').then(() => {
        setUnread(0)
        setNotifs(prev => prev.map(n => ({ ...n, read: true })))
      }).catch(() => {})
    }
  }

  const handleClick = (notif) => {
    if (notif.link) navigate(notif.link)
    setOpen(false)
    if (!notif.read) {
      api.put(`/notifications/${notif._id}/read`).catch(() => {})
    }
  }

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    await api.delete(`/notifications/${id}`).catch(() => {})
    setNotifs(prev => prev.filter(n => n._id !== id))
  }

  if (!user) return null

  return (
    <div style={{ position: 'relative' }} ref={dropRef}>
      <style>{`
        .notif-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 16px;
          cursor: pointer;
          border-bottom: 1px solid var(--border);
          transition: background 0.15s;
          position: relative;
        }
        .notif-item:hover { background: var(--primary-light); }
        .notif-item:last-child { border-bottom: none; }
        .notif-item.unread { background: var(--primary-light); }
        .notif-delete {
          position: absolute;
          top: 8px;
          right: 8px;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-placeholder);
          font-size: 14px;
          padding: 2px 4px;
          border-radius: 4px;
          opacity: 0;
          transition: opacity 0.15s;
        }
        .notif-item:hover .notif-delete { opacity: 1; }
        .notif-delete:hover { color: #dc2626; background: #fef2f2; }
      `}</style>

      {/* Bell button */}
      <button onClick={handleOpen} style={{
        background: open ? 'var(--primary-light)' : 'none',
        border: `1.5px solid ${open ? 'var(--border-3)' : 'var(--border)'}`,
        borderRadius: 100,
        width: 34, height: 34,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        color: open ? '#1a7a3c' : 'var(--text-faint)',
        position: 'relative',
        transition: 'all 0.18s',
        flexShrink: 0,
      }}>
        <FontAwesomeIcon icon={faBell} style={{ fontSize: 15 }} />
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: -4, right: -4,
            minWidth: 16, height: 16, borderRadius: 8,
            background: '#dc2626', color: '#fff',
            fontSize: 9, fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid var(--nav-bg)',
            padding: '0 3px',
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 10px)',
          right: 0,
          width: 340,
          maxHeight: 420,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
          zIndex: 100,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Sora, sans-serif',
        }}>
          {/* Header */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Notifications</span>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {unread > 0 && (
                <span style={{ background: '#dc2626', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 100 }}>
                  {unread} nouvelle{unread > 1 ? 's' : ''}
                </span>
              )}
              {notifs.length > 0 && (
                <button onClick={() => { api.put('/notifications/read-all'); setUnread(0); setNotifs(p => p.map(n => ({ ...n, read: true }))) }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#1a7a3c', fontWeight: 600, fontFamily: 'Sora, sans-serif', padding: '2px 6px' }}>
                  Tout lire
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {notifs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--text-placeholder)' }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>🔔</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Aucune notification</div>
              </div>
            ) : (
              notifs.map(notif => (
                <div key={notif._id} className={`notif-item ${!notif.read ? 'unread' : ''}`}
                  onClick={() => handleClick(notif)}
                >
                  {/* Unread dot */}
                  {!notif.read && (
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#1a7a3c', flexShrink: 0, marginTop: 5 }} />
                  )}
                  {notif.read && <div style={{ width: 7, flexShrink: 0 }} />}

                  <div style={{ fontSize: 20, flexShrink: 0, lineHeight: 1.3 }}>
                    {NOTIF_ICONS[notif.type] || '🔔'}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: notif.read ? 500 : 700, color: 'var(--text)', lineHeight: 1.4 }}>
                      {notif.title}
                    </div>
                    {notif.body && (
                      <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 2, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {notif.body}
                      </div>
                    )}
                    <div style={{ fontSize: 11, color: 'var(--text-placeholder)', marginTop: 3 }}>
                      {timeAgo(notif.createdAt)}
                    </div>
                  </div>

                  <button className="notif-delete" onClick={(e) => handleDelete(e, notif._id)}>
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}