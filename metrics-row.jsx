// 4 metric cards full-width
function MetricsRow({ shared, setShared }) {
  const today = shared.dailyLogs[shared.dailyLogs.length - 1] || { hours: 0, questions: 0, reviews: 0 };
  const last7 = shared.dailyLogs.slice(-7);
  const weekHours = last7.reduce((a, d) => a + d.hours, 0);
  const weekQ = last7.reduce((a, d) => a + d.questions, 0);

  const metrics = [
    { label: 'Horas hoje', value: today.hours.toFixed(1), goal: shared.goals.dailyHours, unit: 'h', color: '#00b8d4', glow: '#00d9ff', icon: <I.clock size={14} /> },
    { label: 'Horas semana', value: weekHours.toFixed(1), goal: shared.goals.weeklyHours, unit: 'h', color: '#8b3dff', glow: '#b04aff', icon: <I.target size={14} /> },
    { label: 'Questões hoje', value: today.questions, goal: shared.goals.dailyQuestions, unit: '', color: '#00c46a', glow: '#00ff88', icon: <I.bolt size={14} /> },
    { label: 'Questões semana', value: weekQ, goal: shared.goals.weeklyQuestions, unit: '', color: '#f59e0b', glow: '#ffc107', icon: <I.trophy size={14} /> },
  ];

  return (
    <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(4, 1fr)' }} className="metrics-row">
      {metrics.map((m, i) => {
        const progress = Math.min(1, parseFloat(m.value) / m.goal);
        return (
          <div key={i} className="glass anim-slide-up" style={{
            padding: 16, animationDelay: `${i * 60}ms`,
            boxShadow: progress >= 1
              ? `0 0 0 1px ${m.color}66, 0 0 24px ${m.glow}44, 0 1px 2px rgba(12,13,18,0.04)` : undefined,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--text-muted)', fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
                <span style={{ color: m.color, filter: `drop-shadow(0 0 4px ${m.glow})` }}>{m.icon}</span>
                {m.label}
              </div>
              {progress >= 1 && <div style={{ fontSize: 9, color: m.color, fontWeight: 700, letterSpacing: '0.1em', textShadow: `0 0 6px ${m.glow}` }}>✓ META</div>}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 10 }}>
              <span className="num" style={{ fontSize: 28, fontWeight: 700, color: m.color, letterSpacing: '-0.02em', textShadow: `0 0 10px ${m.glow}66` }}>{m.value}{m.unit}</span>
              <span className="num" style={{ fontSize: 12, color: 'var(--text-dim)' }}>/ {m.goal}{m.unit}</span>
            </div>
            <div style={{ height: 5, background: 'rgba(12,13,18,0.06)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${progress * 100}%`,
                background: `linear-gradient(90deg, ${m.color}, ${m.glow})`,
                boxShadow: `0 0 10px ${m.glow}, 0 0 4px ${m.glow}`,
                transition: 'width 600ms ease',
              }} />
            </div>
          </div>
        );
      })}
      <style>{`@media (max-width: 900px) { .metrics-row { grid-template-columns: repeat(2, 1fr) !important; } }`}</style>
    </div>
  );
}

function ConcursoDonuts({ concursos, setConcursos }) {
  const [editing, setEditing] = React.useState(null);
  const update = (id, patch) => setConcursos(arr => arr.map(c => c.id === id ? { ...c, ...patch } : c));
  const add = () => {
    const id = `c-${Date.now()}`;
    const date = new Date(); date.setDate(date.getDate() + 90);
    setConcursos(arr => [...arr, { id, name: 'Novo concurso', date: date.toISOString().slice(0,10), startedAt: new Date().toISOString().slice(0,10) }]);
    setEditing(id);
  };
  const remove = (id) => setConcursos(arr => arr.filter(c => c.id !== id));
  const editingC = concursos.find(c => c.id === editing);

  return (
    <div className="glass anim-slide-up" style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ fontSize: 10.5, letterSpacing: '0.18em', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, textTransform: 'uppercase' }}>
          Tempo até a Prova
        </div>
        <button className="btn-ghost" onClick={add} style={{ padding: '4px 8px' }}><I.plus size={11} stroke={2.5} /> novo</button>
      </div>
      {editingC && (
        <div style={{ display: 'grid', gap: 8, padding: 12, background: 'rgba(0,184,212,0.05)', borderRadius: 10, marginBottom: 14, border: '1px solid rgba(0,184,212,0.25)' }}>
          <input className="input-base" placeholder="Nome do concurso" value={editingC.name}
            autoFocus onKeyDown={e => { if (e.key === 'Enter') setEditing(null); }}
            onChange={e => update(editingC.id, { name: e.target.value })} />
          <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <div style={{ color: 'var(--text-dim)', fontSize: 10, marginBottom: 2 }}>Data da prova</div>
              <input className="input-base" type="date" value={editingC.date}
                onChange={e => update(editingC.id, { date: e.target.value })} style={{ width: '100%' }} />
            </div>
            <div>
              <div style={{ color: 'var(--text-dim)', fontSize: 10, marginBottom: 2 }}>Início</div>
              <input className="input-base" type="date" value={editingC.startedAt || ''}
                onChange={e => update(editingC.id, { startedAt: e.target.value })} style={{ width: '100%' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn-neon" onClick={() => setEditing(null)} style={{ flex: 1, justifyContent: 'center' }}>OK</button>
            <button className="btn-ghost" onClick={() => { remove(editingC.id); setEditing(null); }} style={{ color: '#ff3d8a' }}><I.close size={11} /> Remover</button>
          </div>
        </div>
      )}
      <div style={{
        display: 'grid', gap: 12, flex: 1,
        gridTemplateColumns: concursos.length > 1 ? 'repeat(2, 1fr)' : '1fr',
      }}>
        {concursos.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, padding: 20 }}>
            Nenhum concurso. Clique em + novo.
          </div>
        )}
        {concursos.map(c => <ConcursoDonutItem key={c.id} c={c} onEdit={() => setEditing(c.id)} />)}
      </div>
    </div>
  );
}

function ConcursoDonutItem({ c, onEdit }) {
  const days = window.DA.daysUntil(c.date);
  const startedAt = c.startedAt ? new Date(c.startedAt) : new Date();
  const target = c.date ? new Date(c.date) : new Date();
  const totalDays = Math.max(1, Math.round((target - startedAt) / 86400000));
  const elapsed = Math.max(0, totalDays - (days || 0));
  const remainingPct = 1 - Math.min(1, elapsed / totalDays);
  let color = '#00b8d4', glow = '#00d9ff';
  if (days !== null && days < 30) { color = '#ff3d8a'; glow = '#ff4fa0'; }
  else if (days !== null && days < 60) { color = '#f59e0b'; glow = '#ffc107'; }

  return (
    <div onClick={onEdit} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer',
      padding: 12, borderRadius: 12,
      background: `radial-gradient(ellipse at 50% 0%, ${color}10, transparent 70%)`,
      border: `1px solid ${color}25`,
      transition: 'all 180ms ease',
    }}>
      <div style={{ position: 'relative', width: 92, height: 92 }}>
        <svg viewBox="0 0 92 92" width={92} height={92} className="donut-ring">
          <circle cx="46" cy="46" r="36" fill="none" stroke="rgba(12,13,18,0.06)" strokeWidth="9" />
          <circle cx="46" cy="46" r="36" fill="none" stroke={color} strokeWidth="9"
            strokeDasharray={`${remainingPct * 226.2} 226.2`} strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${glow}) drop-shadow(0 0 2px ${glow})`, transition: 'stroke-dasharray 600ms ease' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
          <div>
            <div className="num" style={{ fontSize: 22, fontWeight: 700, color, letterSpacing: '-0.02em', lineHeight: 1, textShadow: `0 0 8px ${glow}88` }}>{days ?? '—'}</div>
            <div style={{ fontSize: 8, color: 'var(--text-dim)', letterSpacing: '0.15em', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>DIAS</div>
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center', minWidth: 0, width: '100%' }}>
        <div className="font-display" style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>
          {c.date ? new Date(c.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: '2-digit' }) : 'sem data'}
        </div>
      </div>
    </div>
  );
}

window.MetricsRow = MetricsRow;
window.ConcursoDonuts = ConcursoDonuts;
