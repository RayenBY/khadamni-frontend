import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../store/AuthContext'
import api from '../services/api'
import Navbar from '../components/Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faComments } from '@fortawesome/free-solid-svg-icons'

function timeAgo(d) {
  if (!d) return ''
  const diff = Math.floor((Date.now() - new Date(d)) / 1000)
  if (diff < 60) return 'à l\'instant'
  if (diff < 3600) return `${Math.floor(diff / 60)} min`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  return `${Math.floor(diff / 86400)}j`
}

export default function Messages() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConversations()
    const interval = setInterval(fetchConversations, 15000)
    return () => clearInterval(interval)
  }, [])

  const fetchConversations = async () => {
    try {
      const res = await api.get('/conversations')
      setConversations(res.data.data.conversations || res.data.data || [])
    } catch {}
    finally { setLoading(false) }
  }

  const getOtherPerson = (conv) => {
    const isEmployer = user._id === conv.employer?._id || user.id === conv.employer?._id
    return isEmployer ? conv.worker : conv.employer
  }

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", minHeight: '100vh', background: 'var(--bg)' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
      <style>{`*, *::before, *::after { box-sizing: border-box; }`}</style>
      <Navbar />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '36px 24px 60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>{t('messages.title')}</h1>
            <p style={{ color: 'var(--text-faint)', fontSize: 14 }}>{t('messages.subtitle')}</p>
          </div>
          <div style={{ background: 'var(--border)', color: '#1a7a3c', borderRadius: 100, padding: '4px 12px', fontSize: 13, fontWeight: 700 }}>
            {t('messages.count', { count: conversations.length })}
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 16, padding: '18px 22px', display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'linear-gradient(90deg,var(--skeleton-1) 25%,var(--skeleton-2) 50%,var(--skeleton-1) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.2s infinite', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ height: 14, width: '40%', background: 'linear-gradient(90deg,var(--skeleton-1) 25%,var(--skeleton-2) 50%,var(--skeleton-1) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.2s infinite', borderRadius: 8, marginBottom: 8 }} />
                  <div style={{ height: 12, width: '70%', background: 'linear-gradient(90deg,var(--skeleton-1) 25%,var(--skeleton-2) 50%,var(--skeleton-1) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.2s infinite', borderRadius: 8 }} />
                </div>
                <style>{`@keyframes shimmer{to{background-position:-200% 0}}`}</style>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 20 }}>
            <div style={{ fontSize: 56, marginBottom: 16, color: 'var(--text-placeholder)' }}><FontAwesomeIcon icon={faComments} /></div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>{t('messages.emptyTitle')}</h3>
            <p style={{ color: 'var(--text-faint)', marginBottom: 24, fontSize: 14 }}>
              {user?.role === 'worker'
                ? t('messages.empty_worker')
                : t('messages.empty_employer')}
            </p>
            <button onClick={() => navigate('/offers')} style={{ background: '#1a7a3c', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 100, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>
              {t('messages.seeOffers')}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {conversations.map(conv => {
              const other = getOtherPerson(conv)
              const isClosed = conv.status === 'closed'
              return (
                <div key={conv._id} onClick={() => navigate(`/messages/${conv._id}`)}
                  style={{ background: 'var(--surface)', border: `1.5px solid ${isClosed ? 'var(--skeleton-1)' : 'var(--border)'}`, borderRadius: 16, padding: '18px 22px', cursor: 'pointer', transition: 'all 0.18s', display: 'flex', alignItems: 'center', gap: 14, opacity: isClosed ? 0.7 : 1 }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(26,122,60,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                  <div style={{ width: 46, height: 46, borderRadius: '50%', background: '#1a7a3c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                    {other?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{other?.name || 'Utilisateur'}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-placeholder)', flexShrink: 0 }}>{timeAgo(conv.lastMessageAt)}</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4 }}>
                      {conv.lastMessage || <em style={{ color: '#bbb' }}>{t('messages.noMessage')}</em>}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-placeholder)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t('messages.offerPrefix', { title: conv.offer?.title ?? '' })}
                      {isClosed && <span style={{ marginLeft: 8, background: 'var(--skeleton-1)', color: 'var(--text-faint)', padding: '2px 8px', borderRadius: 100, fontSize: 11, fontWeight: 600 }}>{t('messages.closed')}</span>}
                    </div>
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: 16, color: '#ccc' }} />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
