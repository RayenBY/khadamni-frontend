import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import api from '../services/api'
import Navbar from '../components/Navbar'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox, faBriefcase, faCheck, faPenToSquare, faPlus, faTrash, faTriangleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons'

const CATEGORIES = ['restaurant', 'café', 'jardinage', 'nettoyage', 'agricole', 'livraison', 'design', 'informatique', 'événementiel', 'autre']
const CATEGORY_ICONS = { restaurant: faBriefcase, café: faBriefcase, jardinage: faBriefcase, nettoyage: faBriefcase, agricole: faBriefcase, livraison: faBriefcase, design: faBriefcase, informatique: faBriefcase, événementiel: faBriefcase, autre: faBox }
const GOVS = ['Tunis','Ariana','Ben Arous','Manouba','Nabeul','Zaghouan','Bizerte','Béja','Jendouba','Kef','Siliana','Sousse','Monastir','Mahdia','Sfax','Kairouan','Kasserine','Sidi Bouzid','Gafsa','Gabès','Tozeur','Kébili','Médenine','Tataouine']

export default function PostWorkerProfile() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const urlEditId = searchParams.get('edit')
  const { user } = useAuth()
  const { t } = useTranslation()

  const [myPosts, setMyPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(!!urlEditId)
  const [editId, setEditId] = useState(urlEditId || null)
  const [form, setForm] = useState({ title: '', category: '', description: '', skills: [], governorates: [], availability: 'available' })
  const [skillInput, setSkillInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => { fetchMyPosts() }, [])

  useEffect(() => {
    if (urlEditId && myPosts.length > 0) {
      const post = myPosts.find(p => p._id === urlEditId)
      if (post) openEdit(post)
    }
  }, [urlEditId, myPosts])

  const fetchMyPosts = async () => {
    try {
      const res = await api.get('/worker-posts/my')
      setMyPosts(res.data.data.workerPosts || res.data.data || [])
    } catch {}
    finally { setLoading(false) }
  }

  const openNew = () => {
    setEditId(null)
    setForm({ title: '', category: '', description: '', skills: [], governorates: [], availability: 'available' })
    setSkillInput('')
    setError('')
    setShowForm(true)
  }

  const openEdit = (post) => {
    setEditId(post._id)
    setForm({ title: post.title, category: post.category, description: post.description, skills: post.skills || [], governorates: post.governorates || [], availability: post.availability || 'available' })
    setSkillInput('')
    setError('')
    setShowForm(true)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true); setError('')
    try {
      if (editId) {
        await api.put(`/worker-posts/${editId}`, form)
      } else {
        await api.post('/worker-posts', form)
      }
      setSuccess(true)
      setShowForm(false)
      fetchMyPosts()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la publication.')
    } finally { setSubmitting(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm(t('workerProfile.confirmDelete'))) return
    try { await api.delete(`/worker-posts/${id}`); fetchMyPosts() } catch {}
  }

  const addSkill = () => {
    const s = skillInput.trim()
    if (s && !form.skills.includes(s)) setForm(p => ({ ...p, skills: [...p.skills, s] }))
    setSkillInput('')
  }

  const toggleGov = (g) => setForm(p => ({ ...p, governorates: p.governorates.includes(g) ? p.governorates.filter(x => x !== g) : [...p.governorates, g] }))

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", minHeight: '100vh', background: 'var(--bg)' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        .form-input { width: 100%; padding: 11px 14px; border-radius: 11px; border: 1.5px solid var(--border-2); font-size: 14px; font-family: 'Sora', sans-serif; color: var(--text); outline: none; background: var(--surface); transition: border-color 0.2s; }
        .form-input:focus { border-color: #1a7a3c; box-shadow: 0 0 0 3px rgba(26,122,60,0.08); }
        .form-select { width: 100%; padding: 11px 14px; border-radius: 11px; border: 1.5px solid var(--border-2); font-size: 14px; font-family: 'Sora', sans-serif; color: var(--text); outline: none; background: var(--surface); cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; }
        .form-select:focus { border-color: #1a7a3c; }
        .cat-card { padding: 12px 14px; border-radius: 13px; border: 2px solid #e0e0e0; cursor: pointer; transition: all 0.18s; text-align: center; }
        .cat-card:hover { border-color: #1a7a3c; background: var(--bg); }
        .cat-card.selected { border-color: #1a7a3c; background: var(--primary-light); }
        .gov-pill { padding: 7px 14px; border-radius: 100px; border: 1.5px solid var(--border-2); background: var(--surface); font-size: 12px; font-weight: 500; cursor: pointer; font-family: 'Sora', sans-serif; color: var(--text-2); transition: all 0.18s; }
        .gov-pill:hover { border-color: #1a7a3c; color: #1a7a3c; }
        .gov-pill.selected { border-color: #1a7a3c; background: #1a7a3c; color: #fff; }
        .submit-btn { width: 100%; padding: 14px; border-radius: 13px; background: #1a7a3c; color: #fff; border: none; font-size: 15px; font-weight: 700; cursor: pointer; font-family: 'Sora', sans-serif; transition: background 0.2s; }
        .submit-btn:hover:not(:disabled) { background: #145f2e; }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        textarea.form-input { resize: vertical; min-height: 100px; }
      `}</style>
      <Navbar />

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '36px 24px 60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>{t('workerProfile.title')}</h1>
            <p style={{ color: 'var(--text-faint)', fontSize: 14 }}>{t('workerProfile.subtitle')}</p>
          </div>
          {!showForm && (
            <button onClick={openNew} style={{ background: '#1a7a3c', color: '#fff', border: 'none', padding: '12px 22px', borderRadius: 100, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif', boxShadow: '0 4px 16px rgba(26,122,60,0.25)' }}>
              {t('workerProfile.createBtn')}
            </button>
          )}
        </div>

        {success && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '12px 16px', borderRadius: 12, fontSize: 14, fontWeight: 600, marginBottom: 20 }}>
            {editId ? t('workerProfile.updatedAlert') : t('workerProfile.publishedAlert')}
          </div>
        )}

        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: '#92400e', marginBottom: 24 }}>
          {t('workerProfile.tokenNotice', { count: user?.tokens || 0 })}
        </div>

        {showForm && (
          <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 20, padding: 28, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', margin: 0 }}>{editId ? t('workerProfile.editFormTitle') : t('workerProfile.createFormTitle')}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)', fontSize: 20 }}><FontAwesomeIcon icon={faXmark} /></button>
            </div>
            {error && <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', color: '#cc0000', padding: '11px 14px', borderRadius: 10, fontSize: 13, marginBottom: 18 }}><FontAwesomeIcon icon={faTriangleExclamation} style={{ marginRight: 6 }} />{error}</div>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>{t('workerProfile.titleLabel')}</label>
                <input className="form-input" placeholder={t('workerProfile.titlePlaceholder')} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 8 }}>{t('workerProfile.categoryLabel')}</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                  {CATEGORIES.map(cat => (
                    <div key={cat} className={`cat-card ${form.category === cat ? 'selected' : ''}`} onClick={() => setForm(p => ({ ...p, category: cat }))}>
                      <div style={{ fontSize: 20, marginBottom: 3 }}><FontAwesomeIcon icon={CATEGORY_ICONS[cat]} /></div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: form.category === cat ? '#1a7a3c' : 'var(--text-muted)' }}>{cat}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>{t('workerProfile.descLabel')}</label>
                <textarea className="form-input" placeholder={t('workerProfile.descPlaceholder')} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required maxLength={500} />
                <div style={{ fontSize: 12, color: 'var(--text-placeholder)', textAlign: 'right', marginTop: 3 }}>{t('workerProfile.charCount', { count: form.description.length })}</div>
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>{t('workerProfile.skillsLabel')}</label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input className="form-input" style={{ flex: 1 }} placeholder={t('workerProfile.skillsPlaceholder')} value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
                  <button type="button" onClick={addSkill} style={{ padding: '11px 16px', borderRadius: 11, border: '1.5px solid var(--border-2)', background: 'var(--surface)', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#1a7a3c', fontFamily: 'Sora, sans-serif' }}><FontAwesomeIcon icon={faPlus} /></button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {form.skills.map(s => (
                    <span key={s} style={{ background: 'var(--primary-light)', color: '#1a7a3c', border: '1px solid var(--border-3)', padding: '4px 12px', borderRadius: 100, fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                      {s} <button type="button" onClick={() => setForm(p => ({ ...p, skills: p.skills.filter(x => x !== s) }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)', fontSize: 14, padding: 0 }}><FontAwesomeIcon icon={faXmark} /></button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 8 }}>{t('workerProfile.zonesLabel')}</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {GOVS.map(g => (
                    <button key={g} type="button" className={`gov-pill ${form.governorates.includes(g) ? 'selected' : ''}`} onClick={() => toggleGov(g)}>
                      {form.governorates.includes(g) && <span style={{ fontSize: 10 }}><FontAwesomeIcon icon={faCheck} /> </span>}{g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>{t('workerProfile.availLabel')}</label>
                <select className="form-select" value={form.availability} onChange={e => setForm(p => ({ ...p, availability: e.target.value }))}>
                  <option value="available">{t('workerProfile.avail_available')}</option>
                  <option value="open_to_offers">{t('workerProfile.avail_open')}</option>
                  <option value="busy">{t('workerProfile.avail_busy')}</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '13px', borderRadius: 12, border: '1.5px solid var(--border-2)', background: 'var(--surface)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Sora, sans-serif', color: 'var(--text-muted)' }}>{t('workerProfile.cancelBtn')}</button>
                <button type="submit" className="submit-btn" style={{ flex: 2 }} disabled={submitting || !form.title || !form.category || !form.description}>
                  {submitting ? t('workerProfile.updatingBtn') : editId ? t('workerProfile.updateBtn') : t('workerProfile.publishBtn')}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-faint)' }}>{t('common.loading')}</div>
        ) : myPosts.length === 0 && !showForm ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 20 }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>{t('workerProfile.emptyIcon')}</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>{t('workerProfile.emptyTitle')}</h3>
            <p style={{ color: 'var(--text-faint)', marginBottom: 24, fontSize: 14 }}>{t('workerProfile.emptyDesc')}</p>
            <button onClick={openNew} style={{ background: '#1a7a3c', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 100, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>
              {t('workerProfile.emptyBtn')}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {myPosts.map(post => (
              <div key={post._id} style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 16, padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 18 }}><FontAwesomeIcon icon={CATEGORY_ICONS[post.category] || faBox} /></span>
                      <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{post.title}</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 10px' }}>{post.description}</p>
                    {post.skills?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {post.skills.map(s => (
                          <span key={s} style={{ background: 'var(--primary-light)', color: '#1a7a3c', border: '1px solid var(--border-3)', padding: '3px 10px', borderRadius: 100, fontSize: 11 }}>{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button onClick={() => openEdit(post)} style={{ padding: '7px 14px', borderRadius: 100, border: '1.5px solid var(--border-2)', background: 'var(--surface)', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: 'var(--text-muted)', fontFamily: 'Sora, sans-serif' }}><FontAwesomeIcon icon={faPenToSquare} /></button>
                    <button onClick={() => handleDelete(post._id)} style={{ padding: '7px 14px', borderRadius: 100, border: '1.5px solid #fecaca', background: '#fef2f2', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#dc2626', fontFamily: 'Sora, sans-serif' }}><FontAwesomeIcon icon={faTrash} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
