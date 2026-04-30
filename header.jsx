// Header — light, with shield, level, XP, streak
function GlobalHeader({ shared, mode, setMode, totalPct }) {
  const level = window.DA.getLevelInfo(shared.xp);
  return (
    <header className="header-sticky">
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
        <ShieldBadge percent={totalPct} size={46} />
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <div className="font-display gradient-neon" style={{ fontSize: 22, fontWeight: 700 }}>
              Defender's Ascent
            </div>
            <div className="num" style={{ fontSize: 11, color: 'var(--text-dim)', letterSpacing: '0.2em' }}>
              DIA 147
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 3, fontSize: 12, color: 'var(--text-muted)' }}>
            <span style={{ color: level.tier.color, fontWeight: 600 }}>{level.tier.name}</span>
            <span style={{ color: 'var(--text-dim)' }}>·</span>
            <span>{totalPct.toFixed(0)}% do edital</span>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="mode-toggle">
          <button className={`${mode === 'objetiva' ? 'active objetiva' : ''}`} onClick={() => setMode('objetiva')}>
            Objetiva
          </button>
          <button className={`${mode === 'discursiva' ? 'active discursiva' : ''}`} onClick={() => setMode('discursiva')}>
            Discursiva
          </button>
        </div>

        <div className="glass" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: 'var(--neon-violet)', fontSize: 14 }}>⚡</span>
          <span className="num" style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
            {shared.xp.toLocaleString('pt-BR')}
          </span>
          <span style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.1em' }}>XP</span>
        </div>

        <div className="glass" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 14 }}>🔥</span>
          <span className="num" style={{ fontSize: 14, fontWeight: 700, color: 'var(--neon-gold)' }}>{shared.streak}</span>
        </div>
      </div>
    </header>
  );
}

window.GlobalHeader = GlobalHeader;
