import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../store/AuthContext'
import api from '../services/api'
import Navbar from '../components/Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox, faBriefcase, faPlus, faTriangleExclamation, faTrophy, faXmark } from '@fortawesome/free-solid-svg-icons'

const CATEGORIES = ['restaurant', 'café', 'jardinage', 'nettoyage', 'agricole', 'livraison', 'design', 'informatique', 'événementiel', 'autre']
const CITIES = ['Tunis', 'Sfax', 'Sousse', 'Monastir', 'Bizerte', 'Nabeul', 'Autre']
const SALARY_UNITS = ['heure', 'jour', 'semaine', 'forfait']
const CATEGORY_ICONS = { restaurant: faBriefcase, café: faBriefcase, jardinage: faBriefcase, nettoyage: faBriefcase, agricole: faBriefcase, livraison: faBriefcase, design: faBriefcase, informatique: faBriefcase, événementiel: faBriefcase, autre: faBox }

const EMPTY_FORM = { title: '', category: '', description: '', 'location.city': '', 'location.address': '', 'salary.amount': '', 'salary.unit': 'jour', duration: '', startDate: new Date().toISOString().split('T')[0], urgent: false, requiredSkills: [] }

export default function PostOffer() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')
  const { user } = useAuth()
  const { t } = useTranslation()

  const [form, setForm] = useState(EMPTY_FORM)
  const [skillInput, setSkillInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetchingEdit, setFetchingEdit] = useState(!!editId)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (editId) {
      api.get(`/offers/${editId}`).then(res => {
        const o = res.data.data.offer || res.data.data
        setForm({
          title: o.title || '',
          category: o.category || '',
          description: o.description || '',
          'location.city': o.location?.city || '',
          'location.address': o.location?.address || '',
          'salary.amount': o.salary?.amount || '',
          'salary.unit': o.salary?.unit || 'jour',
          duration: o.duration || '',
          startDate: o.startDate ? new Date(o.startDate).toISOString().split('T')[0] : '',
          urgent: o.urgent || false,
          requiredSkills: o.requiredSkills || [],
        })
      }).catch(() => setError(t('postOffer.loadError')))
      .finally(() => setFetchingEdit(false))
    }
  }, [editId])

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError(''); setLoading(true)
    const payload = {
      title: form.title,
      category: form.category,
      description: form.description,
      location: { city: form['location.city'], address: form['location.address'] },
      salary: { amount: Number(form['salary.amount']), unit: form['salary.unit'] },
      duration: form.duration,
      startDate: form.startDate,
      urgent: form.urgent,
      requiredSkills: form.requiredSkills,
    }
    try {
      if (editId) {
        await api.put(`/offers/${editId}`, payload)
        navigate(`/offers/${editId}`)
      } else {
        const res = await api.post('/offers', payload)
        const newId = res.data.data.offer?._id || res.data.data?._id
        setSuccess(true)
        setTimeout(() => navigate(newId ? `/offers/${newId}` : '/dashboard'), 1500)
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la publication.")
    } finally { setLoading(false) }
  }

  const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid var(--border-2)', fontSize: 14, fontFamily: 'Sora, sans-serif', color: 'var(--text)', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', background: 'var(--surface)' }
  const inputFocus = { borderColor: '#1a7a3c', boxShadow: '0 0 0 3px rgba(26,122,60,0.08)' }
  const labelStyle = { fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 7 }

  if (fetchingEdit) return (
    <div style={{ fontFamily: "'Sora', sans-serif" }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--text-faint)' }}>{t('common.loading')}</div>
    </div>
  )

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", minHeight: '100vh', background: 'var(--bg)' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        .form-input { ${Object.entries(inputStyle).map(([k,v])=>`${k.replace(/([A-Z])/g,'-$1').toLowerCase()}:${v}`).join(';')} }
        .form-input:focus { border-color: #1a7a3c; box-shadow: 0 0 0 3px rgba(26,122,60,0.08); }
        .form-input::placeholder { color: var(--text-placeholder); }
        .form-select { width: 100%; padding: 12px 16px; border-radius: 12px; border: 1.5px solid var(--border-2); font-size: 14px; font-family: 'Sora', sans-serif; color: var(--text); outline: none; background: var(--surface); cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; }
        .form-select:focus { border-color: #1a7a3c; }
        .category-card { padding: 14px 16px; border-radius: 14px; border: 2px solid #e0e0e0; cursor: pointer; transition: all 0.18s; text-align: center; }
        .category-card:hover { border-color: #1a7a3c; background: var(--bg); }
        .category-card.selected { border-color: #1a7a3c; background: var(--primary-light); }
        .submit-btn { width: 100%; padding: 16px; border-radius: 14px; background: #1a7a3c; color: #fff; border: none; font-size: 16px; font-weight: 700; cursor: pointer; font-family: 'Sora', sans-serif; transition: background 0.2s, transform 0.15s; box-shadow: 0 4px 20px rgba(26,122,60,0.3); }
        .submit-btn:hover:not(:disabled) { background: #145f2e; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        textarea.form-input { resize: vertical; min-height: 120px; }
      `}</style>

      <Navbar />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px 60px' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'inline-block', background: 'var(--border)', color: '#1a7a3c', padding: '5px 14px', borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 14 }}>
            {editId ? t('postOffer.editBadge') : t('postOffer.createBadge')}
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>
            {editId ? t('postOffer.editTitle') : t('postOffer.createTitle')}
          </h1>
          <p style={{ color: 'var(--text-faint)', fontSize: 15 }}>
            {editId ? t('postOffer.editSubtitle') : t('postOffer.createSubtitle')}
          </p>
          {!editId && (
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, fontSize: 13 }}>
              <span style={{ color: '#92400e' }}>{t('postOffer.tokenNotice', { count: user?.tokens || 0 })}</span>
            </div>
          )}
        </div>

        {error && (
          <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', color: '#cc0000', padding: '12px 16px', borderRadius: 12, fontSize: 14, marginBottom: 24 }}>
            <FontAwesomeIcon icon={faTriangleExclamation} style={{ marginRight: 6 }} />{error}
          </div>
        )}

        {success ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 20 }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}><FontAwesomeIcon icon={faTrophy} /></div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>{t('postOffer.successTitle')}</h2>
            <p style={{ color: 'var(--text-faint)' }}>{t('postOffer.successRedirect')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 20, padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Title */}
            <div>
              <label style={labelStyle}>{t('postOffer.titleLabel')}</label>
              <input className="form-input" name="title" placeholder={t('postOffer.titlePlaceholder')} value={form.title} onChange={handleChange} required maxLength={100} />
            </div>

            {/* Category */}
            <div>
              <label style={labelStyle}>{t('postOffer.categoryLabel')}</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
                {CATEGORIES.map(cat => (
                  <div key={cat} className={`category-card ${form.category === cat ? 'selected' : ''}`} onClick={() => setForm(p => ({ ...p, category: cat }))}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}><FontAwesomeIcon icon={CATEGORY_ICONS[cat]} /></div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: form.category === cat ? '#1a7a3c' : 'var(--text-muted)' }}>{cat}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>{t('postOffer.descLabel')}</label>
              <textarea className="form-input" name="description" placeholder={t('postOffer.descPlaceholder')} value={form.description} onChange={handleChange} required maxLength={1000} />
              <div style={{ fontSize: 12, color: 'var(--text-placeholder)', textAlign: 'right', marginTop: 4 }}>{t('postOffer.charCount', { count: form.description.length })}</div>
            </div>

            {/* Location */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>{t('postOffer.cityLabel')}</label>
                <select className="form-select" name="location.city" value={form['location.city']} onChange={handleChange} required>
                  <option value="">{t('postOffer.cityDefault')}</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>{t('postOffer.addressLabel')}</label>
                <input className="form-input" name="location.address" placeholder={t('postOffer.addressPlaceholder')} value={form['location.address']} onChange={handleChange} required />
              </div>
            </div>

            {/* Salary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>{t('postOffer.salaryLabel')}</label>
                <input className="form-input" name="salary.amount" type="number" placeholder={t('postOffer.salaryPlaceholder')} min={0} value={form['salary.amount']} onChange={handleChange} required />
              </div>
              <div>
                <label style={labelStyle}>{t('postOffer.unitLabel')}</label>
                <select className="form-select" name="salary.unit" value={form['salary.unit']} onChange={handleChange} required>
                  {SALARY_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            {/* Duration + Start date */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>{t('postOffer.durationLabel')}</label>
                <input className="form-input" name="duration" placeholder={t('postOffer.durationPlaceholder')} value={form.duration} onChange={handleChange} required />
              </div>
              <div>
                <label style={labelStyle}>{t('postOffer.startDateLabel')}</label>
                <input className="form-input" name="startDate" type="date" value={form.startDate} onChange={handleChange} required min={new Date().toISOString().split('T')[0]} />
              </div>
            </div>

            {/* Required skills */}
            <div>
              <label style={labelStyle}>{t('postOffer.skillsLabel')} <span style={{ fontSize: 12, color: 'var(--text-placeholder)', fontWeight: 400 }}>{t('postOffer.skillsOptional')}</span></label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <input
                  className="form-input"
                  style={{ flex: 1 }}
                  placeholder={t('postOffer.skillsPlaceholder')}
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const s = skillInput.trim()
                      if (s && !form.requiredSkills.includes(s)) setForm(p => ({ ...p, requiredSkills: [...p.requiredSkills, s] }))
                      setSkillInput('')
                    }
                  }}
                />
                <button type="button"
                  onClick={() => {
                    const s = skillInput.trim()
                    if (s && !form.requiredSkills.includes(s)) setForm(p => ({ ...p, requiredSkills: [...p.requiredSkills, s] }))
                    setSkillInput('')
                  }}
                  style={{ padding: '12px 18px', borderRadius: 12, border: '1.5px solid var(--border-2)', background: 'var(--surface)', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#1a7a3c', fontFamily: 'Sora, sans-serif', whiteSpace: 'nowrap' }}>
                  <FontAwesomeIcon icon={faPlus} style={{ marginRight: 6 }} />{t('postOffer.addSkill')}
                </button>
              </div>
              {form.requiredSkills.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {form.requiredSkills.map(s => (
                    <span key={s} style={{ background: 'var(--primary-light)', color: '#1a7a3c', border: '1px solid var(--border-3)', padding: '6px 12px', borderRadius: 100, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                      {s}
                      <button type="button" onClick={() => setForm(p => ({ ...p, requiredSkills: p.requiredSkills.filter(x => x !== s) }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)', fontSize: 16, padding: 0, lineHeight: 1 }}><FontAwesomeIcon icon={faXmark} /></button>
                    </span>
                  ))}
                </div>
              )}
              {form.requiredSkills.length === 0 && (
                <p style={{ fontSize: 12, color: '#bbb', margin: 0 }}>{t('postOffer.skillsHint')}</p>
              )}
            </div>

            {/* Urgent toggle */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: '14px 18px', border: `2px solid ${form.urgent ? '#f59e0b' : '#e0e0e0'}`, borderRadius: 14, background: form.urgent ? '#fffbeb' : 'var(--surface)', transition: 'all 0.2s' }}>
              <input type="checkbox" name="urgent" checked={form.urgent} onChange={handleChange} style={{ width: 18, height: 18, accentColor: '#f59e0b', cursor: 'pointer' }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{t('postOffer.urgentLabel')}</div>
                <div style={{ fontSize: 13, color: 'var(--text-faint)', marginTop: 2 }}>{t('postOffer.urgentDesc')}</div>
              </div>
            </label>

            {/* Submit */}
            <button type="submit" className="submit-btn" disabled={loading || !form.title || !form.category || !form['location.city'] || !form['salary.amount']}>
              {loading ? t('postOffer.savingBtn') : editId ? t('postOffer.saveBtn') : t('postOffer.publishBtn')}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
