// Quick Log — supports retroactive date entry. Pomodoro modal preserved.
function QuickLogFAB({ onLog, onOpenPomodoro }) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [h, setH] = React.useState(1);
  const [q, setQ] = React.useState(20);
  const [r, setR] = React.useState(5);
  const today = new Date().toISOString().slice(0, 10);
  const isRetro = date !== today;

  return (
    <div className="fab">
      {open && (
        <div className="glass-strong anim-slide-up" style={{ padding: 18, marginBottom: 12, width: 290, borderRadius: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
              REGISTRO RÁPIDO
            </div>
            {isRetro && (
              <div style={{ fontSize: 9, color: '#a14e0c', background: 'rgba(255,122,26,0.12)', padding: '2px 6px', borderRadius: 4, fontWeight: 700, letterSpacing: '0.1em' }}>
                RETROATIVO
              </div>
            )}
          </div>

          {/* Date — retroactive entry */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>DIA</div>
            <div style={{ display: 'flex', gap: 5 }}>
              <input className="input-base" type="date" value={date} max={today}
                onChange={e => setDate(e.target.value)} style={{ flex: 1 }} />
              <button className="btn-ghost" onClick={() => setDate(today)} title="Hoje">Hoje</button>
            </div>
          </div>

          {[
            { label: 'Horas', val: h, set: setH, step: 0.25, max: 12, color: '#00b8d4' },
            { label: 'Questões', val: q, set: setQ, step: 5, max: 200, color: '#00c46a' },
            { label: 'Revisões', val: r, set: setR, step: 1, max: 100, color: '#8b3dff' },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>{f.label}</span>
                <span className="num" style={{ color: f.color, fontWeight: 700 }}>{f.val}</span>
              </div>
              <div style={{ display: 'flex', gap: 5 }}>
                <button className="btn-ghost" onClick={() => f.set(Math.max(0, f.val - f.step))} style={{ padding: '4px 8px' }}><I.minus size={11} /></button>
                <input type="range" min="0" max={f.max} step={f.step} value={f.val}
                  onChange={e => f.set(parseFloat(e.target.value))}
                  style={{ flex: 1, accentColor: f.color }} />
                <button className="btn-ghost" onClick={() => f.set(Math.min(f.max, f.val + f.step))} style={{ padding: '4px 8px' }}><I.plusSm size={11} /></button>
              </div>
            </div>
          ))}
          <button className="btn-neon" style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => { onLog(date, h, q, r); setOpen(false); }}>
            <I.check size={14} stroke={2.5} /> Registrar {isRetro ? 'no dia ' + new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : ''}
          </button>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
        <button onClick={onOpenPomodoro} title="Modo Blindado"
          style={{
            width: 50, height: 50, borderRadius: 14,
            background: 'rgba(139,61,255,0.1)',
            border: '1px solid rgba(139,61,255,0.4)',
            color: '#5a1fa0', cursor: 'pointer',
            display: 'grid', placeItems: 'center',
            boxShadow: '0 4px 14px rgba(139,61,255,0.2)',
          }}>
          <I.shield size={20} />
        </button>
        <button onClick={() => setOpen(o => !o)}
          style={{
            width: 58, height: 58, borderRadius: 18,
            background: 'linear-gradient(135deg, #00b8d4, #8b3dff)',
            border: 'none', color: 'white', cursor: 'pointer',
            display: 'grid', placeItems: 'center',
            boxShadow: '0 8px 24px rgba(0,184,212,0.35), 0 0 0 1px rgba(255,255,255,0.3) inset',
            transition: 'transform 200ms cubic-bezier(0.2,0.8,0.2,1)',
            transform: open ? 'rotate(45deg) scale(1.05)' : 'none',
          }}>
          <I.plus size={24} stroke={2.5} />
        </button>
      </div>
    </div>
  );
}

// Pomodoro
const POMODORO_OPTIONS = [
  { mins: 25, xp: 50, label: 'Foco Padrão' },
  { mins: 45, xp: 100, label: 'Sessão Profunda' },
  { mins: 90, xp: 200, label: 'Modo Blindado' },
];

function PomodoroModal({ open, onClose, subjects, onCompleteSession }) {
  const [phase, setPhase] = React.useState('pick');
  const [mins, setMins] = React.useState(45);
  const [subjectId, setSubjectId] = React.useState(subjects[0]?.id || '');
  const [secsLeft, setSecsLeft] = React.useState(45 * 60);
  const [paused, setPaused] = React.useState(false);
  const totalSecs = mins * 60;

  React.useEffect(() => {
    if (phase !== 'running' || paused) return;
    if (secsLeft <= 0) { setPhase('done'); window.celebrateVictory(); return; }
    const t = setTimeout(() => setSecsLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, paused, secsLeft]);

  const start = () => { setSecsLeft(mins * 60); setPaused(false); setPhase('running'); };
  const finish = () => {
    const opt = POMODORO_OPTIONS.find(o => o.mins === mins);
    onCompleteSession({ minutes: mins, xp: opt.xp, subjectId });
    setPhase('pick'); onClose();
  };

  if (!open) return null;
  const progress = 1 - secsLeft / totalSecs;
  const r = 110, c = 2 * Math.PI * r;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 90,
      background: 'rgba(12,13,18,0.5)', backdropFilter: 'blur(8px)',
      display: 'grid', placeItems: 'center', padding: 24,
    }} onClick={onClose}>
      <div className="glass-strong anim-slide-up" onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 440, padding: 24, borderRadius: 18, position: 'relative' }}>
        <button onClick={onClose} className="btn-ghost" style={{ position: 'absolute', top: 12, right: 12 }}>
          <I.close size={14} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.25em', color: 'var(--neon-violet)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
            MODO BLINDADO
          </div>
          <div className="font-display gradient-neon" style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>
            Sessão de foco
          </div>
        </div>

        {phase === 'pick' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
              {POMODORO_OPTIONS.map(o => (
                <button key={o.mins} onClick={() => setMins(o.mins)}
                  style={{
                    padding: '12px 6px', borderRadius: 10, cursor: 'pointer',
                    background: mins === o.mins ? 'rgba(0,184,212,0.1)' : 'white',
                    border: `1px solid ${mins === o.mins ? 'rgba(0,184,212,0.5)' : 'rgba(12,13,18,0.08)'}`,
                    boxShadow: mins === o.mins ? '0 0 12px rgba(0,217,255,0.3)' : 'none',
                    color: 'var(--text-primary)', textAlign: 'center',
                  }}>
                  <div className="num" style={{ fontSize: 20, fontWeight: 700, color: mins === o.mins ? '#00b8d4' : 'var(--text-primary)' }}>{o.mins}<span style={{ fontSize: 11, opacity: 0.6 }}>min</span></div>
                  <div style={{ fontSize: 9.5, color: 'var(--text-muted)', marginTop: 2 }}>{o.label}</div>
                  <div className="num" style={{ fontSize: 10, color: '#a14e0c', marginTop: 3, fontWeight: 700 }}>+{o.xp} XP</div>
                </button>
              ))}
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 5, fontWeight: 600 }}>DISCIPLINA</div>
              <select value={subjectId} onChange={e => setSubjectId(e.target.value)} className="input-base" style={{ width: '100%' }}>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <button onClick={start} className="btn-neon" style={{ width: '100%', justifyContent: 'center', padding: '11px 20px', fontSize: 13 }}>
              <I.play size={11} /> Iniciar — +{POMODORO_OPTIONS.find(o => o.mins === mins).xp} XP
            </button>
          </>
        )}
        {phase === 'running' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', width: 260, height: 260, margin: '0 auto' }}>
              <svg viewBox="0 0 260 260" width={260} height={260}>
                <circle cx="130" cy="130" r={r} fill="none" stroke="rgba(12,13,18,0.06)" strokeWidth="4" />
                <circle cx="130" cy="130" r={r} fill="none" stroke="#00b8d4" strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={c} strokeDashoffset={c * progress} transform="rotate(-90 130 130)"
                  style={{ filter: 'drop-shadow(0 0 6px rgba(0,217,255,0.5))', transition: 'stroke-dashoffset 1s linear' }} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
                <div className="num" style={{ fontSize: 50, fontWeight: 700, letterSpacing: '-0.02em' }}>
                  {String(Math.floor(secsLeft/60)).padStart(2,'0')}<span style={{ color: 'var(--text-dim)' }}>:</span>{String(secsLeft%60).padStart(2,'0')}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
              <button className="btn-ghost" onClick={() => setPaused(p => !p)}>{paused ? <I.play size={12} /> : <I.pause size={12} />} {paused ? 'Continuar' : 'Pausar'}</button>
              <button className="btn-ghost" onClick={() => { setPhase('pick'); }}>Abortar</button>
            </div>
          </div>
        )}
        {phase === 'done' && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: 44, marginBottom: 8 }}>🛡</div>
            <div className="font-display gradient-neon" style={{ fontSize: 22, fontWeight: 700 }}>Sessão concluída!</div>
            <button onClick={finish} className="btn-neon" style={{ marginTop: 16 }}>Coletar +{POMODORO_OPTIONS.find(o => o.mins === mins).xp} XP</button>
          </div>
        )}
      </div>
    </div>
  );
}

window.QuickLogFAB = QuickLogFAB;
window.PomodoroModal = PomodoroModal;
