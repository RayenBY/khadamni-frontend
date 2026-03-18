import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../store/AuthContext'
import api from '../services/api'
import Navbar from '../components/Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCheck, faStar } from '@fortawesome/free-solid-svg-icons'

export default function Chat() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user } = useAuth()

  const [conversation, setConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [closing, setClosing] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [reviewTarget, setReviewTarget] = useState(null)
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewSuccess, setReviewSuccess] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    fetchConversation()
    const interval = setInterval(fetchConversation, 8000)
    return () => clearInterval(interval)
  }, [id])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const fetchConversation = async () => {
    try {
      const res = await api.get(`/conversations/${id}`)
      const data = res.data.data
      setConversation(data.conversation || data)
      setMessages(data.messages || [])
    } catch {}
    finally { setLoading(false) }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!text.trim() || sending) return
    setSending(true)
    const newMsg = { _id: Date.now(), sender: { _id: user._id || user.id }, text: text.trim(), createdAt: new Date().toISOString(), optimistic: true }
    setMessages(prev => [...prev, newMsg])
    const toSend = text.trim()
    setText('')
    try { await api.post(`/conversations/${id}/messages`, { text: toSend }); fetchConversation() }
    catch { setMessages(prev => prev.filter(m => !m.optimistic)) }
    finally { setSending(false) }
  }

  const handleClose = async () => {
    if (!window.confirm(t('chat.confirmClose'))) return
    setClosing(true)
    try { await api.put(`/conversations/${id}/close`); fetchConversation() }
    catch {}
    finally { setClosing(false) }
  }

  const handleSubmitReview = async () => {
    if (!reviewTarget || !reviewForm.comment.trim()) return
    setSubmittingReview(true)
    try {
      await api.post('/reviews', { reviewee: reviewTarget, offer: conversation?.offer?._id || conversation?.offer, rating: reviewForm.rating, comment: reviewForm.comment })
      setReviewSuccess(true)
      setTimeout(() => { setShowReviewModal(false); setReviewSuccess(false) }, 2000)
    } catch {}
    finally { setSubmittingReview(false) }
  }

  const isMe = (senderId) => senderId === user._id || senderId === user.id
  const isClosed = conversation?.status === 'closed'
  const isEmployer = user._id === conversation?.employer?._id || user.id === conversation?.employer?._id
  const otherUser = isEmployer ? conversation?.worker : conversation?.employer

  const formatTime = (d) => d ? new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) : ''

  const conv = conversation

  if (loading) return (
    <div style={{ fontFamily: "'Sora', sans-serif" }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--text-faint)' }}>{t('common.loading')}</div>
    </div>
  )

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        .msg-input { flex: 1; padding: 13px 18px; border-radius: 100px; border: 1.5px solid var(--border-2); font-size: 14px; font-family: 'Sora', sans-serif; outline: none; background: var(--surface); color: var(--text); transition: border-color 0.2s; }
        .msg-input:focus { border-color: #1a7a3c; }
        .send-btn { padding: 13px 22px; border-radius: 100px; background: #1a7a3c; color: #fff; border: none; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'Sora', sans-serif; transition: background 0.2s; }
        .send-btn:hover:not(:disabled) { background: #145f2e; }
        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .modal { background: var(--surface); border-radius: 20px; padding: 32px; width: 100%; max-width: 440px; }
        textarea.msg-textarea { width: 100%; padding: 11px 14px; border-radius: 11px; border: 1.5px solid var(--border-2); font-size: 14px; font-family: 'Sora', sans-serif; resize: vertical; outline: none; min-height: 90px; background: var(--surface); color: var(--text); }
        textarea.msg-textarea:focus { border-color: #1a7a3c; }
      `}</style>
      <Navbar />

      {/* Chat container */}
      <div style={{ maxWidth: 760, width: '100%', margin: '0 auto', flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 24px 0' }}>

        {/* Chat header */}
        <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 18, padding: '16px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => navigate('/messages')} style={{ background: 'none', border: '1px solid var(--border-2)', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 16 }}><FontAwesomeIcon icon={faArrowLeft} /></button>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#1a7a3c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
              {otherUser?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', cursor: 'pointer' }} onClick={() => navigate(`/user/${otherUser?._id}`)}>
                {otherUser?.name}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{t('chat.offerPrefix', { title: conv?.offer?.title ?? t('chat.offerFallback') })}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {isClosed && (
              <span style={{ background: 'var(--skeleton-1)', color: 'var(--text-faint)', padding: '5px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600 }}>{t('chat.closed')}</span>
            )}
            {!isClosed && isEmployer && (
              <button onClick={handleClose} disabled={closing} style={{ padding: '7px 14px', borderRadius: 100, background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>
                {closing ? '...' : t('chat.closeBtn')}
              </button>
            )}
            {isClosed && (
              <button onClick={() => { setReviewTarget(otherUser?._id); setShowReviewModal(true) }} style={{ padding: '7px 14px', borderRadius: 100, background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>
                {t('chat.reviewBtn')}
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 16, minHeight: 300, maxHeight: 'calc(100vh - 300px)' }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 24px', color: 'var(--text-placeholder)' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{t('chat.emptyChat')}</div>
              <p style={{ fontSize: 14 }}>{t('chat.emptyChatTitle')}</p>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => {
                const myMsg = isMe(msg.sender?._id || msg.sender)
                const prevMsg = i > 0 ? messages[i - 1] : null
                const isNewDay = !prevMsg || formatDate(msg.createdAt) !== formatDate(prevMsg?.createdAt)
                return (
                  <div key={msg._id}>
                    {isNewDay && (
                      <div style={{ textAlign: 'center', margin: '12px 0' }}>
                        <span style={{ background: 'var(--skeleton-1)', color: 'var(--text-faint)', padding: '4px 14px', borderRadius: 100, fontSize: 12 }}>{formatDate(msg.createdAt)}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: myMsg ? 'flex-end' : 'flex-start' }}>
                      <div style={{ maxWidth: '72%' }}>
                        <div style={{ background: myMsg ? '#1a7a3c' : 'var(--surface)', color: myMsg ? '#fff' : 'var(--text)', borderRadius: myMsg ? '18px 18px 4px 18px' : '18px 18px 18px 4px', padding: '11px 16px', border: myMsg ? 'none' : '1.5px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', fontSize: 14, lineHeight: 1.6 }}>
                          {msg.text}
                        </div>
                        <div style={{ fontSize: 11, color: '#bbb', marginTop: 3, textAlign: myMsg ? 'right' : 'left', paddingLeft: myMsg ? 0 : 4, paddingRight: myMsg ? 4 : 0 }}>
                          {formatTime(msg.createdAt)}{msg.optimistic && <><span> </span><FontAwesomeIcon icon={faCheck} /></>}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Message input */}
        <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 18, padding: '14px 18px', marginBottom: 24 }}>
          {isClosed ? (
            <div style={{ textAlign: 'center', color: 'var(--text-placeholder)', fontSize: 14 }}>
              {t('chat.closedNotice')}
            </div>
          ) : (
            <form onSubmit={handleSend} style={{ display: 'flex', gap: 10 }}>
              <input
                ref={inputRef}
                className="msg-input"
                placeholder={t('chat.inputPlaceholder')}
                value={text}
                onChange={e => setText(e.target.value)}
                maxLength={1000}
                autoFocus
              />
              <button type="submit" className="send-btn" disabled={!text.trim() || sending}>
                {sending ? t('chat.sending') : t('chat.sendBtn')}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Review modal */}
      {showReviewModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowReviewModal(false)}>
          <div className="modal">
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>{t('chat.reviewTitle')}</h2>
            <p style={{ color: 'var(--text-faint)', fontSize: 14, marginBottom: 20 }}>{t('chat.reviewDesc', { name: otherUser?.name })}</p>
            {reviewSuccess ? (
              <div style={{ textAlign: 'center', padding: '28px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>{t('chat.reviewSent')}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1a7a3c' }}>{t('chat.reviewSentTitle')}</div>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 10 }}>{t('chat.ratingLabel')}</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[1,2,3,4,5].map(s => (
                      <button key={s} type="button" onClick={() => setReviewForm(p => ({ ...p, rating: s }))}
                        style={{ width: 40, height: 40, borderRadius: 10, border: `2px solid ${reviewForm.rating >= s ? '#f59e0b' : 'var(--border-2)'}`, background: reviewForm.rating >= s ? '#fffbeb' : 'var(--surface)', fontSize: 20, cursor: 'pointer', transition: 'all 0.15s' }}>
                        <FontAwesomeIcon icon={faStar} />
                      </button>
                    ))}
                    <span style={{ marginLeft: 8, fontSize: 14, fontWeight: 700, color: 'var(--text)', alignSelf: 'center' }}>{t('chat.ratingValue', { value: reviewForm.rating })}</span>
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 8 }}>{t('chat.commentLabel')}</div>
                  <textarea className="msg-textarea" placeholder={t('chat.commentPlaceholder')} value={reviewForm.comment} onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))} maxLength={500} />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setShowReviewModal(false)} style={{ flex: 1, padding: '13px', borderRadius: 12, border: '1.5px solid var(--border-2)', background: 'var(--surface)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Sora, sans-serif', color: 'var(--text-muted)' }}>{t('chat.cancelBtn')}</button>
                  <button onClick={handleSubmitReview} disabled={submittingReview || !reviewForm.comment.trim()} style={{ flex: 2, padding: '13px', borderRadius: 12, background: '#1a7a3c', color: '#fff', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif', opacity: submittingReview || !reviewForm.comment.trim() ? 0.6 : 1 }}>
                    {submittingReview ? t('chat.publishing') : t('chat.publishBtn')}
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
