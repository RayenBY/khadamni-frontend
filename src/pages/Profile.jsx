import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../store/AuthContext'
import api from '../services/api'
import Navbar from '../components/Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCoins, faLightbulb, faLocationDot, faStar, faTriangleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons'

const CITIES = ['Tunis', 'Sfax', 'Sousse', 'Monastir', 'Bizerte', 'Nabeul', 'Autre']
const GOVS = ['Tunis','Ariana','Ben Arous','Manouba','Nabeul','Zaghouan','Bizerte','Béja','Jendouba','Kef','Siliana','Sousse','Monastir','Mahdia','Sfax','Kairouan','Kasserine','Sidi Bouzid','Gafsa','Gabès','Tozeur','Kébili','Médenine','Tataouine']
const AVAIL = { available: { c: '#16a34a', bg: '#f0fdf4', b: '#bbf7d0' }, open_to_offers: { c: '#d97706', bg: '#fffbeb', b: '#fde68a' }, busy: { c: '#dc2626', bg: '#fef2f2', b: '#fecaca' } }

const labelCls = { fontSize: 13, fontWeight: 700, color: '#444', display: 'block', marginBottom: 6 }

function SectionBlock({ title, subtitle, children, accent = '#1a7a3c' }) {
  return (
    <div style={{ background: '#fff', border: '1.5px solid #e8f5ee', borderRadius: 18, overflow: 'hidden', marginBottom: 0 }}>
      <div style={{ padding: '18px 24px', borderBottom: '1px solid #f0f0f0', background: '#fafaf8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 4, height: 22, borderRadius: 4, background: accent }} />
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#0d1f14' }}>{title}</div>
            {subtitle && <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>{subtitle}</div>}
          </div>
        </div>
      </div>
      <div style={{ padding: '22px 24px' }}>{children}</div>
    </div>
  )
}

function InfoRow({ label, value, notSetLabel }) {
  return (
    <div style={{ paddingBottom: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{value || <span style={{ color: '#ccc' }}>{notSetLabel}</span>}</div>
    </div>
  )
}

export default function Profile() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user: authUser, login } = useAuth()
  const isWorker = authUser?.role === 'worker'
  const isEmployer = authUser?.role === 'employer'

  const [profile, setProfile] = useState(null)
  const [reviews, setReviews] = useState([])
  const [editSection, setEditSection] = useState(null) // 'basic' | 'availability' | 'skills' | 'zones'
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [form, setForm] = useState({})
  const [skillInput, setSkillInput] = useState('')

  useEffect(() => { fetchProfile() }, [])

  const fetchProfile = async () => {
    try {
      const uid = authUser._id || authUser.id
      const [pRes, rRes] = await Promise.all([
        api.get('/auth/me'),
        api.get(`/reviews/user/${uid}`),
      ])
      const u = pRes.data.data.user || pRes.data.data
      setProfile(u)
      resetForm(u)
      setReviews(rRes.data.data.reviews || rRes.data.data || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const resetForm = (u) => setForm({
    name: u.name || '',
    bio: u.bio || '',
    city: u.city || '',
    jobTitle: u.jobTitle || '',
    availability: u.availability || 'available',
    skills: u.skills || [],
    governorates: u.governorates || [],
  })

  const handleSave = async () => {
    setSaving(true); setSaveError(''); setSaveSuccess(false)
    try {
      const res = await api.put('/users/me', form)
      const updated = res.data.data.user || res.data.data
      setProfile(updated)
      login(updated, localStorage.getItem('token'))
      setSaveSuccess(true)
      setEditSection(null)
      setTimeout(() => setSaveSuccess(false), 4000)
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Erreur lors de la sauvegarde.')
    } finally { setSaving(false) }
  }

  const handleCancel = () => { if (profile) resetForm(profile); setEditSection(null); setSaveError('') }

  const addSkill = (s) => {
    const trimmed = (s || skillInput).trim()
    if (trimmed && !form.skills.includes(trimmed)) setForm(p => ({ ...p, skills: [...p.skills, trimmed] }))
    setSkillInput('')
  }
  const removeSkill = (s) => setForm(p => ({ ...p, skills: p.skills.filter(x => x !== s) }))
  const toggleGov = (g) => setForm(p => ({ ...p, governorates: p.governorates.includes(g) ? p.governorates.filter(x => x !== g) : [...p.governorates, g] }))

  const avail = profile ? (AVAIL[profile.availability] || AVAIL.available) : AVAIL.available

  const availLabel = (key) => {
    if (key === 'available') return t('profile.avail_available')
    if (key === 'open_to_offers') return t('profile.avail_open')
    if (key === 'busy') return t('profile.avail_busy')
    return key
  }

  const availDesc = (key) => {
    if (key === 'available') return t('profile.avail_available_desc')
    if (key === 'open_to_offers') return t('profile.avail_open_desc')
    if (key === 'busy') return t('profile.avail_busy_desc')
    return ''
  }

  const AVAIL_OPTIONS = [
    { v: 'available', l: t('profile.avail_available'), desc: t('profile.avail_available_desc') },
    { v: 'open_to_offers', l: t('profile.avail_open'), desc: t('profile.avail_open_desc') },
    { v: 'busy', l: t('profile.avail_busy'), desc: t('profile.avail_busy_desc') },
  ]

  const EditActions = ({ section }) => section === editSection ? (
    <div style={{ display: 'flex', gap: 8 }}>
      <button onClick={handleCancel} style={{ padding: '7px 16px', borderRadius: 100, border: '1.5px solid #e0e0e0', background: '#fff', fontSize: 12, fontWeight: 600, color: '#888', cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}>{t('profile.cancelBtn')}</button>
      <button onClick={handleSave} disabled={saving} style={{ padding: '7px 18px', borderRadius: 100, border: 'none', background: '#1a7a3c', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora,sans-serif', opacity: saving ? 0.7 : 1 }}>
        {saving ? t('common.saving') : t('profile.saveBtn')}
      </button>
    </div>
  ) : (
    <button onClick={() => { if (profile) resetForm(profile); setEditSection(section) }} style={{ padding: '7px 14px', borderRadius: 100, border: '1.5px solid #d4e8db', background: '#fff', fontSize: 12, fontWeight: 600, color: '#555', cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}>
      {t('profile.editBtn')}
    </button>
  )

  if (loading) return <div style={{ fontFamily: "'Sora',sans-serif" }}><Navbar /><div style={{ textAlign: 'center', padding: '80px 24px', color: '#aaa' }}>{t('common.loading')}</div></div>

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", minHeight: '100vh', background: '#f9fdf9' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        .form-inp { width:100%; padding:11px 14px; border-radius:11px; border:1.5px solid #d4e8db; font-size:14px; font-family:'Sora',sans-serif; color:#111; outline:none; background:#fff; transition:border-color .2s,box-shadow .2s; }
        .form-inp:focus { border-color:#1a7a3c; box-shadow:0 0 0 3px rgba(26,122,60,.08); }
        .form-inp::placeholder { color:#bbb; }
        .form-sel { width:100%; padding:11px 14px; border-radius:11px; border:1.5px solid #d4e8db; font-size:14px; font-family:'Sora',sans-serif; color:#111; outline:none; background:#fff; cursor:pointer; appearance:none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 12px center; }
        .form-sel:focus { border-color:#1a7a3c; }
        textarea.form-inp { resize:vertical; min-height:90px; }
        .gov-pill { padding:7px 14px; border-radius:100px; border:1.5px solid #e0e0e0; font-size:12px; font-weight:600; cursor:pointer; transition:all .18s; background:#fff; color:#555; }
        .gov-pill.sel { border-color:#1a7a3c; background:#f0faf4; color:#1a7a3c; }
        .skill-tag { background:#f0faf4; color:#1a7a3c; border:1px solid #b8dfc8; padding:5px 12px; border-radius:100px; font-size:12px; display:flex; align-items:center; gap:5px; }
        @media (max-width:768px) { .profile-layout { grid-template-columns:1fr !important; } }
      `}</style>
      <Navbar />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '36px 24px 60px' }}>

        {/* Alerts */}
        {saveSuccess && <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '12px 18px', borderRadius: 12, marginBottom: 20, fontSize: 14, fontWeight: 600 }}>{t('profile.savedAlert')}</div>}
        {saveError && <div style={{ background: '#fff0f0', border: '1px solid #fecaca', color: '#cc0000', padding: '12px 18px', borderRadius: 12, marginBottom: 20, fontSize: 14 }}><FontAwesomeIcon icon={faTriangleExclamation} style={{ marginRight: 6 }} />{saveError}</div>}

        <div className="profile-layout" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'start' }}>

          {/* ── LEFT SIDEBAR ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Avatar card */}
            <div style={{ background: '#fff', border: '1.5px solid #e8f5ee', borderRadius: 18, padding: '28px 22px', textAlign: 'center' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: isWorker ? 'linear-gradient(135deg,#1a7a3c,#2d9a52)' : 'linear-gradient(135deg,#1a4a7a,#2463a5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: '#fff', margin: '0 auto 16px' }}>
                {profile?.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#0d1f14' }}>{profile?.name}</div>
              {profile?.jobTitle && <div style={{ fontSize: 12, color: '#888', marginTop: 3 }}>{profile.jobTitle}</div>}

              <div style={{ margin: '12px 0', padding: '8px', background: isWorker ? '#f0faf4' : '#eff6ff', border: `1px solid ${isWorker ? '#b8dfc8' : '#bfdbfe'}`, borderRadius: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: isWorker ? '#1a7a3c' : '#2563eb', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {isWorker ? t('profile.role_worker') : isEmployer ? t('profile.role_employer') : t('profile.role_admin')}
                </div>
                {profile?.isVerified && <div style={{ fontSize: 11, color: '#16a34a', fontWeight: 700, marginTop: 2 }}>{t('profile.verified')}</div>}
              </div>

              {isWorker && (
                <span style={{ background: avail.bg, color: avail.c, border: `1px solid ${avail.b}`, padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 700, display: 'inline-block', marginBottom: 10 }}>
                  {availLabel(profile?.availability)}
                </span>
              )}

              {profile?.rating > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginBottom: 8 }}>
                  <span style={{ color: '#f59e0b', fontSize: 16 }}><FontAwesomeIcon icon={faStar} /></span>
                  <span style={{ fontWeight: 700, color: '#111', fontSize: 14 }}>{profile.rating.toFixed(1)}</span>
                  <span style={{ fontSize: 12, color: '#888' }}>{t('profile.reviewCount', { count: reviews.length })}</span>
                </div>
              )}

              <div style={{ fontSize: 12, color: '#888' }}><FontAwesomeIcon icon={faLocationDot} style={{ marginRight: 6 }} />{profile?.city}</div>
              <div style={{ marginTop: 10, padding: '8px 12px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, fontSize: 13 }}>
                <FontAwesomeIcon icon={faCoins} style={{ marginRight: 6 }} /><strong style={{ color: '#d97706' }}>{profile?.tokens || 0}</strong> tokens
              </div>
            </div>

            {/* Role capabilities */}
            <div style={{ background: '#fff', border: '1.5px solid #e8f5ee', borderRadius: 16, padding: '18px 18px' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                {t('profile.canModify')}
              </div>
              {(isWorker ? [
                t('profile.can_basic'),
                t('profile.can_avail'),
                t('profile.can_skills'),
                t('profile.can_zones'),
              ] : [
                t('profile.can_employer_basic'),
                t('profile.can_employer_company'),
              ]).map((label) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderBottom: '1px solid #f5f5f5', fontSize: 13, color: '#555' }}>
                  {label}
                </div>
              ))}
            </div>

            {/* Nav links */}
            <div style={{ background: '#fff', border: '1.5px solid #e8f5ee', borderRadius: 14, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { l: t('profile.link_dashboard'), p: '/dashboard' },
                { l: t('profile.link_messages'), p: '/messages' },
                { l: t('profile.link_offers'), p: '/offers' },
              ].map(({ l, p }) => (
                <button key={p} onClick={() => navigate(p)} style={{ textAlign: 'left', padding: '9px 10px', borderRadius: 9, border: 'none', background: 'none', fontSize: 13, color: '#555', cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f0faf4'; e.currentTarget.style.color = '#1a7a3c' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#555' }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* ── RIGHT CONTENT ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* 1. Infos de base */}
            <SectionBlock
              title={t('profile.section_basic')}
              subtitle={isWorker ? t('profile.section_basic_sub_worker') : t('profile.section_basic_sub_employer')}
            >
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                <EditActions section="basic" />
              </div>
              {editSection === 'basic' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={labelCls}>{t('profile.label_name')}</label>
                      <input className="form-inp" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder={t('profile.placeholder_name')} />
                    </div>
                    <div>
                      <label style={labelCls}>{isWorker ? t('profile.label_title_worker') : t('profile.label_title_employer')}</label>
                      <input className="form-inp" value={form.jobTitle} onChange={e => setForm(p => ({ ...p, jobTitle: e.target.value }))} placeholder={isWorker ? t('profile.placeholder_title_worker') : t('profile.placeholder_title_employer')} />
                    </div>
                  </div>
                  <div>
                    <label style={labelCls}>{t('profile.label_city')}</label>
                    <select className="form-sel" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))}>
                      <option value="">{t('profile.city_default')}</option>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelCls}>
                      {isWorker ? t('profile.label_bio_worker') : t('profile.label_bio_employer')}
                      <span style={{ color: '#aaa', fontWeight: 400, marginLeft: 4 }}>{t('profile.bio_max')}</span>
                    </label>
                    <textarea className="form-inp" value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} maxLength={300}
                      placeholder={isWorker ? t('profile.placeholder_bio_worker') : t('profile.placeholder_bio_employer')} />
                    <div style={{ textAlign: 'right', fontSize: 11, color: '#ccc', marginTop: 3 }}>{t('profile.charCount', { count: form.bio?.length ?? 0 })}</div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <InfoRow label={t('common.name')} value={profile?.name} notSetLabel={t('common.notSet')} />
                  <InfoRow label={t('profile.info_phone')} value={profile?.phone ? `+216 ${profile.phone}` : null} notSetLabel={t('common.notSet')} />
                  <InfoRow label={isWorker ? t('profile.info_title_worker') : t('profile.info_title_employer')} value={profile?.jobTitle} notSetLabel={t('common.notSet')} />
                  <InfoRow label={t('common.city')} value={profile?.city} notSetLabel={t('common.notSet')} />
                  {profile?.bio && <div style={{ gridColumn: '1 / -1' }}><InfoRow label={isWorker ? t('profile.info_bio_worker') : t('profile.info_bio_employer')} value={profile.bio} notSetLabel={t('common.notSet')} /></div>}
                </div>
              )}
            </SectionBlock>

            {/* 2. WORKER ONLY: Disponibilité */}
            {isWorker && (
              <SectionBlock title={t('profile.section_avail')} subtitle={t('profile.section_avail_sub')} accent="#16a34a">
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                  <EditActions section="availability" />
                </div>
                {editSection === 'availability' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {AVAIL_OPTIONS.map(opt => (
                      <label key={opt.v} onClick={() => setForm(p => ({ ...p, availability: opt.v }))} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 13, border: `2px solid ${form.availability === opt.v ? AVAIL[opt.v].b : '#e0e0e0'}`, background: form.availability === opt.v ? AVAIL[opt.v].bg : '#fff', cursor: 'pointer', transition: 'all .18s' }}>
                        <input type="radio" name="availability" value={opt.v} checked={form.availability === opt.v} onChange={() => {}} style={{ accentColor: AVAIL[opt.v].c, width: 16, height: 16 }} />
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#0d1f14' }}>{opt.l}</div>
                          <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{opt.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ background: avail.bg, color: avail.c, border: `1.5px solid ${avail.b}`, padding: '7px 18px', borderRadius: 100, fontSize: 14, fontWeight: 700 }}>{availLabel(profile?.availability)}</span>
                    <span style={{ fontSize: 13, color: '#888' }}>{availDesc(profile?.availability)}</span>
                  </div>
                )}
              </SectionBlock>
            )}

            {/* 3. WORKER ONLY: Compétences */}
            {isWorker && (
              <SectionBlock title={t('profile.section_skills')} subtitle={t('profile.section_skills_sub')} accent="#8b5cf6">
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                  <EditActions section="skills" />
                </div>
                {editSection === 'skills' ? (
                  <div>
                    <label style={labelCls}>{t('profile.skillLabel')}</label>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                      <input className="form-inp" style={{ flex: 1 }} placeholder={t('profile.skillPlaceholder')}
                        value={skillInput} onChange={e => setSkillInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
                      <button type="button" onClick={() => addSkill()} style={{ padding: '11px 18px', borderRadius: 11, border: '1.5px solid #d4e8db', background: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', color: '#1a7a3c', fontFamily: 'Sora,sans-serif', whiteSpace: 'nowrap' }}>
                        {t('profile.addSkill')}
                      </button>
                    </div>
                    {/* Suggestions */}
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, color: '#aaa', marginBottom: 6 }}>{t('profile.suggestions')}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {['Excel', 'Word', 'Permis B', 'Service client', 'Caisse', 'Cuisine', 'Jardinage', 'Nettoyage', 'Conduite', 'Anglais'].map(s => !form.skills.includes(s) && (
                          <button key={s} type="button" onClick={() => addSkill(s)} style={{ padding: '5px 12px', borderRadius: 100, border: '1px solid #e8f5ee', background: '#f9fdf9', fontSize: 11, cursor: 'pointer', color: '#888', fontFamily: 'Sora,sans-serif' }}>
                            + {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    {form.skills.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {form.skills.map(s => (
                          <span key={s} className="skill-tag">
                            <FontAwesomeIcon icon={faCheck} style={{ marginRight: 4 }} />{s}
                            <button type="button" onClick={() => removeSkill(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 16, padding: 0, lineHeight: 1 }}><FontAwesomeIcon icon={faXmark} /></button>
                          </span>
                        ))}
                      </div>
                    )}
                    {form.skills.length === 0 && <p style={{ color: '#ccc', fontSize: 13 }}>{t('profile.noSkills')}</p>}
                  </div>
                ) : (
                  <>
                    {(profile?.skills?.length || 0) === 0 ? (
                      <div style={{ textAlign: 'center', padding: '20px 0', color: '#ccc' }}>
                        <div style={{ fontSize: 28, marginBottom: 8 }}>{t('profile.empty_skills')}</div>
                        <p style={{ fontSize: 13 }}>{t('profile.empty_skills_title')}<br/><span style={{ color: '#1a7a3c', cursor: 'pointer', fontWeight: 700 }} onClick={() => { resetForm(profile); setEditSection('skills') }}>{t('profile.empty_skills_desc')}</span></p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {profile.skills.map(s => (
                          <span key={s} style={{ background: '#f0faf4', color: '#1a7a3c', border: '1px solid #b8dfc8', padding: '6px 16px', borderRadius: 100, fontSize: 13, fontWeight: 600 }}><FontAwesomeIcon icon={faCheck} style={{ marginRight: 5 }} />{s}</span>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </SectionBlock>
            )}

            {/* 4. WORKER ONLY: Zones d'intervention */}
            {isWorker && (
              <SectionBlock title={t('profile.section_zones')} subtitle={t('profile.section_zones_sub')} accent="#0ea5e9">
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                  <EditActions section="zones" />
                </div>
                {editSection === 'zones' ? (
                  <div>
                    <div style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>{t('profile.zones_counter', { count: form.governorates?.length ?? 0 })}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {GOVS.map(g => (
                        <button key={g} type="button" className={`gov-pill ${form.governorates.includes(g) ? 'sel' : ''}`} onClick={() => toggleGov(g)}>
                          {form.governorates.includes(g) ? <><FontAwesomeIcon icon={faCheck} style={{ marginRight: 4 }} /></> : null}{g}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {(profile?.governorates?.length || 0) === 0 ? (
                      <div style={{ textAlign: 'center', padding: '20px 0', color: '#ccc' }}>
                        <div style={{ fontSize: 28, marginBottom: 8 }}>{t('profile.empty_zones')}</div>
                        <p style={{ fontSize: 13 }}>{t('profile.empty_zones_title')}<br/><span style={{ color: '#1a7a3c', cursor: 'pointer', fontWeight: 700 }} onClick={() => { resetForm(profile); setEditSection('zones') }}>{t('profile.empty_zones_desc')}</span></p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {profile.governorates.map(g => (
                          <span key={g} style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '5px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600 }}><FontAwesomeIcon icon={faLocationDot} style={{ marginRight: 5 }} />{g}</span>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </SectionBlock>
            )}

            {/* 5. EMPLOYER ONLY: Company info hint */}
            {isEmployer && (
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 14, padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 20 }}><FontAwesomeIcon icon={faLightbulb} /></span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1e40af', marginBottom: 4 }}>{t('profile.employer_tip_title')}</div>
                  <div style={{ fontSize: 12, color: '#3b82f6', lineHeight: 1.6 }}>
                    {t('profile.employer_tip_desc')}
                  </div>
                </div>
              </div>
            )}

            {/* 6. Avis reçus */}
            <SectionBlock title={t('profile.section_reviews')} subtitle={t('profile.section_reviews_sub', { count: reviews.length })} accent="#f59e0b">
              {reviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: '#ccc' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{t('profile.empty_reviews')}</div>
                  <p style={{ fontSize: 13 }}>{t('profile.empty_reviews_title')} {t('profile.empty_reviews_desc')}</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {reviews.map((rev, i) => (
                    <div key={rev._id} style={{ paddingBottom: 14, borderBottom: i < reviews.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1a7a3c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                          {rev.reviewer?.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>{rev.reviewer?.name}</span>
                          <div style={{ display: 'flex', gap: 1 }}>
                            {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 13, color: s <= rev.rating ? '#f59e0b' : '#e8e8e8' }}><FontAwesomeIcon icon={faStar} /></span>)}
                          </div>
                        </div>
                      </div>
                      <p style={{ fontSize: 13, color: '#555', lineHeight: 1.65, margin: 0 }}>{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </SectionBlock>

          </div>
        </div>
      </div>
    </div>
  )
}
