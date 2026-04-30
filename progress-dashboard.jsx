// ProgressDashboard + GavelBar
function ProgressDashboard({ state }) {
  const today = state.dailyLogs[state.dailyLogs.length - 1] || { hours: 0, questions: 0, reviews: 0 };
  const last7 = state.dailyLogs.slice(-7);
  const weekHours = last7.reduce((a, d) => a + d.hours, 0);
  const weekQ = last7.reduce((a, d) => a + d.questions, 0);

  const metrics = [
    {
      label: 'Horas hoje', value: today.hours.toFixed(1), goal: state.goals.dailyHours,
      unit: 'h', color: '#00e5ff', icon: <I.clock size={14} />,
      progress: Math.min(1, today.hours / state.goals.dailyHours),
    },
    {
      label: 'Horas na semana', value: weekHours.toFixed(1), goal: state.goals.weeklyHours,
      unit: 'h', color: '#b04aff', icon: <I.target size={14} />,
      progress: Math.min(1, weekHours / state.goals.weeklyHours),
    },
    {
      label: 'Questões hoje', value: today.questions, goal: state.goals.dailyQuestions,
      unit: '', color: '#00ff88', icon: <I.bolt size={14} />,
      progress: Math.min(1, today.questions / state.goals.dailyQuestions),
    },
    {
      label: 'Questões na semana', value: weekQ, goal: state.goals.weeklyQuestions,
      unit: '', color: '#ffc107', icon: <I.trophy size={14} />,
      progress: Math.min(1, weekQ / state.goals.weeklyQuestions),
    },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
      {metrics.map((m, i) => (
        <div key={i} className="glass anim-slide-up" style={{ padding: 16, animationDelay: `${i * 60}ms` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              <span style={{ color: m.color }}>{m.icon}</span>
              {m.label}
            </div>
            {m.progress >= 1 && (
              <div style={{ fontSize: 10, color: '#00ff88', fontWeight: 700, letterSpacing: '0.1em' }}>✓ META</div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 12 }}>
            <span className="num" style={{ fontSize: 32, fontWeight: 700, color: m.color, letterSpacing: '-0.02em' }}>{m.value}{m.unit}</span>
            <span className="num" style={{ fontSize: 13, color: 'var(--text-dim)' }}>/ {m.goal}{m.unit}</span>
          </div>
          <div style={{ position: 'relative', height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', inset: 0, width: `${m.progress * 100}%`,
              background: `linear-gradient(90deg, ${m.color}99, ${m.color})`,
              boxShadow: `0 0 10px ${m.color}80`,
              transition: 'width 600ms ease',
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function GavelBar({ state }) {
  const stats = window.DA.getTotalStats(state.subjects);
  return (
    <div className="glass" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
      <div style={{ color: 'var(--neon-gold)', display: 'flex' }}><I.gavel size={22} /></div>
      <div style={{ flex: 1, minWidth: 220 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11, letterSpacing: '0.15em', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
            RUMO À POSSE
          </span>
          <span className="num" style={{ fontSize: 11, color: 'var(--text-primary)' }}>{stats.percentage.toFixed(1)}%</span>
        </div>
        <div style={{ height: 10, background: 'rgba(255,255,255,0.06)', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
          <div style={{
            position: 'absolute', inset: 0, width: `${stats.percentage}%`,
            background: 'linear-gradient(90deg, #00ff88 0%, #00e5ff 40%, #b04aff 80%, #ff4fa0 100%)',
            boxShadow: '0 0 14px rgba(0,229,255,0.4)',
            transition: 'width 600ms ease',
          }} />
          {/* tick marks */}
          {[25, 50, 75].map(p => (
            <div key={p} style={{ position: 'absolute', left: `${p}%`, top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.15)' }} />
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.15em' }}>STREAK</div>
          <div className="num" style={{ fontSize: 20, fontWeight: 700, color: 'var(--neon-gold)' }}>🔥 {state.streak}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.15em' }}>SHIELDS</div>
          <div className="num" style={{ fontSize: 20, fontWeight: 700, color: 'var(--neon-gold)' }}>🛡 {state.shields}</div>
        </div>
      </div>
    </div>
  );
}

window.ProgressDashboard = ProgressDashboard;
window.GavelBar = GavelBar;
