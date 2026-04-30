// Main app
const { useState, useEffect } = React;

// Achievement toast
function AchievementToast({ kind, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 4200); return () => clearTimeout(t); }, []);
  const A = {
    week_streak: { title: '7 dias seguidos', sub: 'Uma semana inteira encadeada', icon: '🔥', color: '#f59e0b' },
    marathon: { title: 'Maratonista', sub: 'Sessão de 90 min completa', icon: '🛡', color: '#8b3dff' },
    first_mastered: { title: 'Primeiro tema dominado', sub: 'Um tópico conquistado', icon: '⚡', color: '#00b8d4' },
    half_edital: { title: 'Meio edital', sub: '50% dos tópicos dominados', icon: '🏆', color: '#00c46a' },
    pet_evolved: { title: 'Sua companheira evoluiu!', sub: 'Volte para conhecê-la', icon: '✨', color: '#ff3d8a' },
  };
  const a = A[kind] || A.first_mastered;
  return (
    <div className="glass-strong toast-achievement" style={{
      position: 'fixed', top: 80, right: 20, zIndex: 80,
      padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
      maxWidth: 320, borderRadius: 14, boxShadow: `0 12px 36px rgba(12,13,18,0.18), 0 0 0 1px ${a.color}50`,
    }}>
      <div style={{
        width: 42, height: 42, borderRadius: 10,
        background: `radial-gradient(circle, ${a.color}30, transparent)`,
        display: 'grid', placeItems: 'center', fontSize: 22,
      }}>{a.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 9, letterSpacing: '0.2em', color: a.color, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
          CONQUISTA DESBLOQUEADA
        </div>
        <div className="font-display" style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>{a.title}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.sub}</div>
      </div>
    </div>
  );
}

// Storage helpers (separate keys per mode — never overwrite each other)
const KEYS = {
  shared: 'da_v3_shared',
  obj: 'da_v3_objetiva',
  disc: 'da_v3_discursiva',
  meta: 'da_v3_meta',
};
function loadKey(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) { return fallback; }
}
function saveKey(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
}

const DEFAULTS = /*EDITMODE-BEGIN*/{
  "showSplash": false,
  "view": "dashboard",
  "mode": "objetiva"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweaks] = useTweaks(DEFAULTS);

  // Independent state slices, persisted under separate keys
  const [shared, setShared] = useState(() => loadKey(KEYS.shared, window.DA.INITIAL_SHARED));
  const [objState, setObjState] = useState(() => loadKey(KEYS.obj, window.DA.INITIAL_OBJETIVA));
  const [discState, setDiscState] = useState(() => loadKey(KEYS.disc, window.DA.INITIAL_DISCURSIVA));
  const [meta, setMeta] = useState(() => loadKey(KEYS.meta, { mode: tweaks.mode }));

  useEffect(() => saveKey(KEYS.shared, shared), [shared]);
  useEffect(() => saveKey(KEYS.obj, objState), [objState]);
  useEffect(() => saveKey(KEYS.disc, discState), [discState]);
  useEffect(() => saveKey(KEYS.meta, meta), [meta]);

  const mode = tweaks.mode;
  // FIX: useTweaks expects (key, value) — was being called with ({ mode: m })
  const setMode = (m) => { setTweaks('mode', m); setMeta(mt => ({ ...mt, mode: m })); };

  const [showSplash, setShowSplash] = useState(tweaks.showSplash);
  const [pomodoroOpen, setPomodoroOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [prevPetStage, setPrevPetStage] = useState(window.DA.getPetStage(shared.xp));

  // Watch for pet evolution
  useEffect(() => {
    const stage = window.DA.getPetStage(shared.xp);
    if (stage > prevPetStage) {
      setPrevPetStage(stage);
      pushToast('pet_evolved');
      window.celebrateVictory();
    }
  }, [shared.xp]);

  const pushToast = (kind) => setToasts(t => [...t, { id: Math.random(), kind }]);

  const handleLog = (date, h, q, r) => {
    setShared(s => {
      const logs = [...s.dailyLogs];
      const idx = logs.findIndex(l => l.date === date);
      if (idx >= 0) {
        logs[idx] = { ...logs[idx], hours: logs[idx].hours + h, questions: logs[idx].questions + q, reviews: logs[idx].reviews + r };
      } else {
        logs.push({ date, hours: h, questions: q, reviews: r });
        logs.sort((a, b) => a.date.localeCompare(b.date));
      }
      const xpGain = Math.round(h * 30 + q * 1.5 + r * 2);
      return { ...s, dailyLogs: logs, xp: s.xp + xpGain };
    });
    window.celebrateVictory();
  };

  const handleSession = ({ minutes, xp, subjectId }) => {
    setShared(s => ({ ...s, xp: s.xp + xp }));
    if (minutes === 90) pushToast('marathon');
    window.celebrateVictory();
  };

  const handleMaster = () => {
    setShared(s => ({ ...s, xp: s.xp + 25 }));
    if (!shared.achievements.includes('first_mastered')) {
      pushToast('first_mastered');
      setShared(s => ({ ...s, achievements: [...s.achievements, 'first_mastered'] }));
    }
  };

  const setHeatmap = (updater) => {
    setObjState(o => ({ ...o, heatmap: typeof updater === 'function' ? updater(o.heatmap) : updater }));
  };

  const setConcursos = (updater) => {
    setShared(s => ({ ...s, concursos: typeof updater === 'function' ? updater(s.concursos) : updater }));
  };

  if (showSplash) {
    // FIX: setTweaks signature
    return <SplashScreen onEnter={() => { setShowSplash(false); setTweaks('showSplash', false); }} />;
  }

  // Active subjects depending on mode
  const activeSubjects = mode === 'objetiva' ? objState.subjects : discState.subjects;
  const totalStats = mode === 'objetiva' ? window.DA.getTotalStatsObj(objState.subjects) : window.DA.getTotalStatsDisc(discState.subjects);

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div className="aurora" />
      <div className="dot-grid" />

      <GlobalHeader shared={shared} mode={mode} setMode={setMode} totalPct={totalStats.percentage} />

      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '20px 24px 120px', position: 'relative' }}>
        {/* Greeting + Concurso donuts side-by-side */}
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1fr)', marginBottom: 16 }} className="greeting-row">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <div className="font-display" style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>
                  Boa tarde, <span className="gradient-neon">Defensora</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
                  {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })} ·
                  {' '}<span style={{ fontWeight: 600, color: mode === 'objetiva' ? '#00b8d4' : '#ff3d8a', textShadow: `0 0 8px ${mode === 'objetiva' ? '#00d9ff66' : '#ff4fa066'}` }}>
                    Modo {mode === 'objetiva' ? 'Objetiva' : 'Discursiva'}
                  </span>
                </div>
              </div>
              <button className="btn-neon" onClick={() => setPomodoroOpen(true)}>
                <I.shield size={13} /> Modo Blindado
              </button>
            </div>
            <PetCompanion xp={shared.xp} />
          </div>
          <ConcursoDonuts concursos={shared.concursos} setConcursos={setConcursos} />
        </div>

        {/* Gavel bar (shared) */}
        <section style={{ marginBottom: 16 }}>
          <GavelBar percentage={totalStats.percentage} streak={shared.streak} shields={shared.shields} />
        </section>

        {/* 4 metrics horizontal */}
        <section style={{ marginBottom: 16 }}>
          <MetricsRow shared={shared} setShared={setShared} />
        </section>

        <style>{`@media (max-width: 900px) { .greeting-row { grid-template-columns: 1fr !important; } }`}</style>

        {/* Heatmaps (smaller, right after horizontal row) */}
        <div className="dual-grid" style={{ display: 'grid', gap: 14, marginBottom: 16 }}>
          <StudyHeatmap logs={shared.dailyLogs} />
          <FlashcardHeatmap logs={shared.dailyLogs} />
        </div>

        {/* Mode-specific: SyllabusMatrix (isolated per mode) */}
        <section style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 12 }}>
            <div className="font-display" style={{ fontSize: 18, fontWeight: 700 }}>
              Matriz do Edital
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em', fontWeight: 600 }}>
              · {mode === 'objetiva' ? 'OBJETIVA' : 'DISCURSIVA'}
            </div>
          </div>
          {mode === 'objetiva'
            ? <SyllabusMatrixObjetiva state={objState} setState={setObjState} onMaster={handleMaster} />
            : <SyllabusMatrixDiscursiva state={discState} setState={setDiscState} />}
        </section>

        {/* Donuts per discipline (above heatmap) */}
        {activeSubjects.length > 0 && (
          <section style={{ marginBottom: 16 }}>
            <SubjectDonuts subjects={activeSubjects} mode={mode} />
          </section>
        )}

        {/* Edital heatmap — only for objetiva (it uses heatmap state) */}
        {mode === 'objetiva' && (
          <section style={{ marginBottom: 16 }}>
            <EditalHeatmap subjects={objState.subjects} heatmap={objState.heatmap} setHeatmap={setHeatmap} onMaster={handleMaster} />
          </section>
        )}
      </main>

      <QuickLogFAB onLog={handleLog} onOpenPomodoro={() => setPomodoroOpen(true)} />
      <PomodoroModal open={pomodoroOpen} onClose={() => setPomodoroOpen(false)}
        subjects={activeSubjects.length ? activeSubjects : objState.subjects} onCompleteSession={handleSession} />

      {toasts.map(t => (
        <AchievementToast key={t.id} kind={t.kind} onDone={() => setToasts(ts => ts.filter(x => x.id !== t.id))} />
      ))}

      <TweaksPanel title="Tweaks · Defender's Ascent">
        {/* FIX: TweakSection expects `label`, not `title`. TweakRadio/TweakToggle expect (label, value, onChange). */}
        <TweakSection label="Modo">
          <TweakRadio label="Fase" value={tweaks.mode}
            options={[{ value: 'objetiva', label: 'Objetiva' }, { value: 'discursiva', label: 'Discursiva' }]}
            onChange={(v) => { setTweaks('mode', v); setMeta(m => ({ ...m, mode: v })); }} />
          <TweakToggle label="Mostrar Splash" value={tweaks.showSplash}
            onChange={(v) => setTweaks('showSplash', v)} />
        </TweakSection>
        <TweakSection label="Celebrações">
          <TweakButton label="✨ Confete leve" onClick={() => window.celebrateLight()} />
          <TweakButton label="🎉 Confete meta" onClick={() => window.celebrateHighEnergy()} />
          <TweakButton label="🏆 Confete vitória" onClick={() => window.celebrateVictory()} />
          <TweakButton label="🎖 Toast: Maratonista" onClick={() => pushToast('marathon')} />
          <TweakButton label="🛡 Modo Blindado" onClick={() => setPomodoroOpen(true)} />
        </TweakSection>
        <TweakSection label="XP / Pet sandbox">
          <TweakButton label="+250 XP" onClick={() => setShared(s => ({ ...s, xp: s.xp + 250 }))} />
          <TweakButton label="+2500 XP" onClick={() => setShared(s => ({ ...s, xp: s.xp + 2500 }))} />
          <TweakButton label="Reset Pet (XP=0)" onClick={() => { setShared(s => ({ ...s, xp: 0 })); setPrevPetStage(0); }} />
          <TweakButton label="Pet final (XP=25k)" onClick={() => setShared(s => ({ ...s, xp: 25000 }))} />
        </TweakSection>
        <TweakSection label="Limpar dados">
          <TweakButton label="Reset Objetiva" onClick={() => { setObjState(window.DA.INITIAL_OBJETIVA); }} />
          <TweakButton label="Reset Discursiva" onClick={() => { setDiscState(window.DA.INITIAL_DISCURSIVA); }} />
        </TweakSection>
      </TweaksPanel>

      <div id="confetti-root" />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
