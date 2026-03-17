import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import * as d3 from 'd3'

export default function MapPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const containerRef = useRef(null)
  const svgRef = useRef(null)
  const [selected, setSelected] = useState([])
  const [hovered, setHovered] = useState(null)

  useEffect(() => {
  if (!svgRef.current || !containerRef.current) return

  fetch('/tunisia.geojson')
    .then(r => {
      console.log('Status:', r.status)
      return r.json()
    })
    .then(geojson => {
      console.log('Features count:', geojson.features?.length)
      console.log('First feature props:', geojson.features?.[0]?.properties)

      const svg = d3.select(svgRef.current)
      svg.selectAll('*').remove()

      const w = containerRef.current.clientWidth - 32
      const h = w * 1.62

      svg.attr('viewBox', `0 0 ${w} ${h}`)
        .attr('width', w)
        .attr('height', h)

      svg.append('rect')
        .attr('width', w).attr('height', h)
        .attr('fill', '#cce8f5').attr('rx', 10)

      const projection = d3.geoMercator()
        .fitExtent([[10, 10], [w - 10, h - 10]], geojson)

      const pathGenerator = d3.geoPath().projection(projection)

      const groups = svg.selectAll('g.gov-group')
        .data(geojson.features)
        .enter()
        .append('g')
        .attr('class', 'gov-group')
        .style('cursor', 'pointer')

      groups.append('path')
        .attr('class', 'gov-path')
        .attr('d', pathGenerator)
        .attr('fill', '#c8e6d0')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.2)
        .attr('stroke-linejoin', 'round')

      groups.append('text')
        .attr('transform', d => {
          const c = pathGenerator.centroid(d)
          return `translate(${c[0]},${c[1]})`
        })
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', w < 300 ? 5 : 6.5)
        .attr('font-weight', '700')
        .attr('font-family', 'Sora, sans-serif')
        .attr('fill', '#1a5c2a')
        .attr('pointer-events', 'none')
        .text(d => d.properties.NAME_1 || d.properties.shapeName || d.properties.name || '')

      groups
        .on('mouseenter', function(event, d) {
          const name = d.properties.NAME_1 || d.properties.shapeName || d.properties.name || ''
          setHovered(name)
        })
        .on('mouseleave', function() {
          setHovered(null)
        })
        .on('click', function(event, d) {
          const name = d.properties.NAME_1 || d.properties.shapeName || d.properties.name || ''
          setSelected(prev =>
            prev.includes(name) ? prev.filter(g => g !== name) : [...prev, name]
          )
        })
    })
    .catch(err => console.error('Fetch error:', err))
  }, [])

  // Update colors when selection/hover changes
  useEffect(() => {
    if (!svgRef.current) return
    d3.select(svgRef.current).selectAll('g.gov-group').each(function(d) {
      const name = d.properties.NAME_1 || d.properties.shapeName || d.properties.name || ''
      const isSelected = selected.includes(name)
      const isHovered = hovered === name
      d3.select(this).select('path')
        .attr('fill', isSelected ? '#1a7a3c' : isHovered ? '#8ecfa4' : '#c8e6d0')
      d3.select(this).select('text')
        .attr('fill', isSelected ? '#fff' : '#1a5c2a')
    })
  }, [selected, hovered])

  const toggle = (name) => setSelected(prev =>
    prev.includes(name) ? prev.filter(g => g !== name) : [...prev, name]
  )

  const handleConfirm = () => {
    sessionStorage.setItem('selectedGovernorates', JSON.stringify(selected))
    navigate('/offers')
  }

  const handleSkip = () => {
    sessionStorage.setItem('selectedGovernorates', JSON.stringify([]))
    navigate('/offers')
  }

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", minHeight: '100vh', background: '#f9fdf9' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        .gov-path { transition: fill 0.15s; }
        .pill-btn { padding: 7px 14px; border-radius: 100px; border: 1.5px solid #d4e8db; background: #fff; font-size: 12px; font-weight: 500; cursor: pointer; font-family: 'Sora', sans-serif; color: #333; transition: all 0.18s; white-space: nowrap; display: inline-flex; align-items: center; gap: 5px; }
        .pill-btn:hover { border-color: #1a7a3c; color: #1a7a3c; background: #f0faf4; }
        .pill-btn.active { background: #1a7a3c; color: #fff; border-color: #1a7a3c; }
        .btn-confirm { background: #1a7a3c; color: #fff; border: none; padding: 14px 36px; border-radius: 100px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: 'Sora', sans-serif; transition: background 0.2s, transform 0.15s; box-shadow: 0 4px 20px rgba(26,122,60,0.3); width: 100%; }
        .btn-confirm:hover:not(:disabled) { background: #145f2e; transform: translateY(-1px); }
        .btn-confirm:disabled { opacity: 0.45; cursor: not-allowed; }
        .btn-skip { background: transparent; color: #888; border: none; font-size: 13px; cursor: pointer; font-family: 'Sora', sans-serif; text-decoration: underline; }
        .btn-skip:hover { color: #333; }
        .map-layout { display: grid; grid-template-columns: 400px 1fr; gap: 32px; max-width: 1100px; margin: 0 auto; padding: 0 32px 60px; align-items: start; }
        @media (max-width: 860px) { .map-layout { grid-template-columns: 1fr; padding: 0 16px 48px; } }
      `}</style>

      {/* HEADER */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e8f5ee', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#1a7a3c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="17" height="17" viewBox="0 0 20 20" fill="none"><path d="M10 2L3 7v11h5v-5h4v5h5V7L10 2z" fill="white"/></svg>
          </div>
          <span style={{ fontSize: 17, fontWeight: 800, color: '#111' }}>Khadamni</span>
        </div>
        <div style={{ fontSize: 14, color: '#888' }}>Bonjour, <span style={{ color: '#1a7a3c', fontWeight: 600 }}>{user?.name?.split(' ')[0] || 'toi'}</span> 👋</div>
      </div>

      {/* TITLE */}
      <div style={{ textAlign: 'center', padding: '36px 24px 28px' }}>
        <div style={{ display: 'inline-block', background: '#e8f5ee', color: '#1a7a3c', padding: '5px 16px', borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>🗺️ Carte interactive</div>
        <h1 style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 800, color: '#0d1f14', marginBottom: 10 }}>Où cherches-tu du travail ?</h1>
        <p style={{ fontSize: 14, color: '#666', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>Clique sur un ou plusieurs gouvernorats sur la carte ou utilise les boutons ci-dessous.</p>
      </div>

      <div className="map-layout">
        {/* MAP */}
        <div ref={containerRef}>
          <div style={{ background: '#cce8f5', borderRadius: 20, border: '1.5px solid #b0d4e8', padding: '16px', position: 'relative' }}>
            <svg ref={svgRef} style={{ width: '100%', display: 'block' }} />
            {hovered && (
              <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', background: '#0d1f14', color: '#fff', padding: '7px 16px', borderRadius: 100, fontSize: 13, fontWeight: 600, pointerEvents: 'none', whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                {selected.includes(hovered) ? '✓ ' : '+ '}{hovered}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 10, flexWrap: 'wrap' }}>
            {[['#c8e6d0','Non sélectionné'],['#8ecfa4','Survolé'],['#1a7a3c','Sélectionné']].map(([bg, label]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#666' }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: bg }} />{label}
              </div>
            ))}
          </div>
        </div>

        {/* SIDEBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#fff', border: '1.5px solid #e8f5ee', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 2 }}>Sélectionnés</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#1a7a3c', lineHeight: 1 }}>
                {selected.length} <span style={{ fontSize: 13, color: '#888', fontWeight: 500 }}>gouvernorat{selected.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
            {selected.length > 0 && (
              <button onClick={() => setSelected([])} style={{ background: '#fff0f0', color: '#cc0000', border: 'none', padding: '6px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>
                Effacer tout
              </button>
            )}
          </div>

          {selected.length > 0 && (
            <div style={{ background: '#f0faf4', border: '1px solid #b8dfc8', borderRadius: 14, padding: '14px 16px' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#2d6a4a', marginBottom: 8 }}>Tes sélections :</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {selected.map(name => (
                  <span key={name} style={{ background: '#1a7a3c', color: '#fff', padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    {name}
                    <span onClick={() => toggle(name)} style={{ cursor: 'pointer', fontSize: 15, opacity: 0.8 }}>×</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div style={{ background: '#fff', border: '1.5px solid #e8f5ee', borderRadius: 16, padding: '16px 20px' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 12 }}>Tous les gouvernorats :</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['Tunis','Ariana','Ben Arous','Manouba','Nabeul','Zaghouan','Bizerte',
                'Béja','Jendouba','Kef','Siliana','Sousse','Monastir','Mahdia','Sfax',
                'Kairouan','Kasserine','Sidi Bouzid','Gafsa','Gabès','Tozeur','Kébili',
                'Médenine','Tataouine'].map(name => (
                <button key={name} className={`pill-btn ${selected.includes(name) ? 'active' : ''}`} onClick={() => toggle(name)}>
                    {selected.includes(name) && <span style={{ fontSize: 10 }}>✓</span>}
                    {name}
                </button>
                ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
            <button className="btn-confirm" onClick={handleConfirm} disabled={selected.length === 0}>
              {selected.length === 0
                ? 'Sélectionne au moins un gouvernorat'
                : `Voir les offres dans ${selected.length} gouvernorat${selected.length > 1 ? 's' : ''} →`}
            </button>
            <button className="btn-skip" onClick={handleSkip}>Passer → voir toutes les offres</button>
          </div>

          <div style={{ background: '#f0faf4', border: '1px solid #b8dfc8', borderRadius: 12, padding: '12px 14px', fontSize: 12, color: '#2d6a4a', lineHeight: 1.6 }}>
            💡 Ta sélection est sauvegardée pour cette session et appliquée automatiquement comme filtre.
          </div>
        </div>
      </div>
    </div>
  )
}