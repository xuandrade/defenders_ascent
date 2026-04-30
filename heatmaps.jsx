// SubjectDonuts + smaller heatmaps
function SubjectDonuts({ subjects, mode = 'objetiva' }) {
  const colors = ['#00b8d4', '#8b3dff', '#00c46a', '#f59e0b', '#ff3d8a', '#00b8d4', '#8b3dff'];
  const compute = mode === 'discursiva' ? window.DA.getSubjectCompletionDisc : window.DA.getSubjectCompletionObj;
  return (
    <div className="glass" style={{ padding: 16 }}>
      <div style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: 14, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
        CONCLUSÃO POR DISCIPLINA
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 14 }}>
        {subjects.map((s, i) => {
          const pct = compute(s);
          const color = colors[i % colors.length];
          return (
            <div key={s.id} style={{ textAlign: 'center', animation: `donut-in 500ms ${i * 80}ms ease-out both` }}>
              <div style={{ position: 'relative', width: 84, height: 84, margin: '0 auto' }}>
                <svg viewBox="0 0 100 100" width={84} height={84} className="donut-ring">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(12,13,18,0.06)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="8"
                    strokeDasharray={`${(pct / 100) * 264} 264`} strokeLinecap="round"
                    style={{ filter: `drop-shadow(0 0 4px ${color}80)`, transition: 'stroke-dasharray 600ms ease' }} />
                </svg>
                <div className="num" style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 16, fontWeight: 700, color }}>
                  {Math.round(pct)}<span style={{ fontSize: 9, opacity: 0.7 }}>%</span>
                </div>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, minHeight: 26, lineHeight: 1.2 }}>
                {s.shortName || s.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function buildHeat(logs, field, weeks = 14) {
  const today = new Date();
  const daysBack = weeks * 7;
  const start = new Date(today); start.setDate(start.getDate() - daysBack + 1);
  const map = new Map(logs.map(l => [l.date, l]));
  const cells = [];
  for (let i = 0; i < daysBack; i++) {
    const d = new Date(start); d.setDate(start.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const log = map.get(iso);
    cells.push({ date: iso, value: log ? log[field] : 0 });
  }
  return cells;
}

function HeatmapCard({ logs, title, field, color, glow, label, unit }) {
  const weeks = 18;
  const cells = buildHeat(logs, field, weeks);
  const values = cells.map(c => c.value);
  const max = Math.max(1, ...values);
  const total = values.reduce((a, v) => a + v, 0);
  const active = values.filter(v => v > 0).length;

  const cellStyle = (v) => {
    if (v === 0) return { bg: 'rgba(12,13,18,0.04)', border: 'rgba(12,13,18,0.05)' };
    const t = Math.min(1, v / max);
    return {
      bg: `color-mix(in oklab, ${color} ${20 + t * 70}%, white)`,
      border: `color-mix(in oklab, ${color} ${50 + t * 40}%, transparent)`,
    };
  };

  return (
    <div className="glass" style={{ padding: 14 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
            {title}
          </div>
          <div className="font-display" style={{ fontSize: 16, fontWeight: 700, marginTop: 2 }}>
            <span className="num" style={{ color }}>{total.toFixed(field === 'hours' ? 1 : 0)}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 6, fontWeight: 400 }}>{label} · {active}d</span>
          </div>
        </div>
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: `repeat(${weeks}, 12px)`,
        gridAutoFlow: 'column', gridTemplateRows: 'repeat(7, 12px)',
        gap: 3, justifyContent: 'center',
      }}>
        {cells.map((c, i) => {
          const { bg, border } = cellStyle(c.value);
          return (
            <div key={i} className="heat-cell"
              style={{ background: bg, border: `1px solid ${border}` }}
              title={`${c.date}: ${c.value.toFixed(field === 'hours' ? 1 : 0)}${unit}`} />
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 9, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, letterSpacing: '0.1em' }}>
        <span>{weeks} SEMANAS</span>
        <span style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          menos
          {[0.15, 0.4, 0.7, 0.95].map((t, i) => (
            <div key={i} style={{
              width: 7, height: 7, borderRadius: 2,
              background: `color-mix(in oklab, ${color} ${20 + t * 70}%, white)`,
            }} />
          ))}
          mais
        </span>
      </div>
    </div>
  );
}

function StudyHeatmap({ logs }) { return <HeatmapCard logs={logs} title="HEATMAP DE ESTUDO" field="hours" color="#00b8d4" label="horas" unit="h" glow="#00d9ff" />; }
function FlashcardHeatmap({ logs }) { return <HeatmapCard logs={logs} title="QUESTÕES / FLASHCARDS" field="questions" color="#8b3dff" label="questões" unit="" glow="#b04aff" />; }

window.SubjectDonuts = SubjectDonuts;
window.StudyHeatmap = StudyHeatmap;
window.FlashcardHeatmap = FlashcardHeatmap;
