// GavelBar (rumo à posse) — light
function GavelBar({ percentage, streak, shields }) {
  return (
    <div className="glass" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
      <div style={{ color: 'var(--neon-gold)', display: 'flex' }}><I.gavel size={20} /></div>
      <div style={{ flex: 1, minWidth: 220 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11, letterSpacing: '0.15em', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
            RUMO À POSSE
          </span>
          <span className="num" style={{ fontSize: 11, color: 'var(--text-primary)', fontWeight: 600 }}>{percentage.toFixed(1)}%</span>
        </div>
        <div style={{ height: 9, background: 'rgba(12,13,18,0.06)', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
          <div style={{
            position: 'absolute', inset: 0, width: `${percentage}%`,
            background: 'linear-gradient(90deg, #00c46a 0%, #00b8d4 40%, #8b3dff 80%, #ff3d8a 100%)',
            boxShadow: '0 0 12px rgba(0,184,212,0.4)',
            transition: 'width 600ms ease',
          }} />
          {[25, 50, 75].map(p => (
            <div key={p} style={{ position: 'absolute', left: `${p}%`, top: 0, bottom: 0, width: 1, background: 'rgba(12,13,18,0.12)' }} />
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 14 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 9, color: 'var(--text-dim)', letterSpacing: '0.15em', fontWeight: 600 }}>STREAK</div>
          <div className="num" style={{ fontSize: 18, fontWeight: 700, color: 'var(--neon-gold)' }}>🔥 {streak}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 9, color: 'var(--text-dim)', letterSpacing: '0.15em', fontWeight: 600 }}>SHIELDS</div>
          <div className="num" style={{ fontSize: 18, fontWeight: 700, color: 'var(--neon-gold)' }}>🛡 {shields}</div>
        </div>
      </div>
    </div>
  );
}

window.GavelBar = GavelBar;
