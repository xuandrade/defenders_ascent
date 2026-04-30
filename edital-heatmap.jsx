// EditalHeatmap — orange for unseen now (per request)
function EditalHeatmap({ subjects, heatmap, setHeatmap, onMaster }) {
  const [openId, setOpenId] = React.useState(null);
  const allTopics = subjects.flatMap(s => s.topics.map(t => ({ ...t, subjectId: s.id })));
  const masteredCount = allTopics.filter(t => heatmap[t.id]?.state === 'mastered').length;
  const studiedCount = allTopics.filter(t => heatmap[t.id]?.state === 'studied').length;
  const overallPct = allTopics.length ? (masteredCount / allTopics.length) * 100 : 0;

  const setSt = (topicId, newState) => {
    setHeatmap(h => ({ ...h, [topicId]: { state: newState, lastUpdated: new Date().toISOString() } }));
    setOpenId(null);
    if (newState === 'mastered') onMaster && onMaster();
  };

  return (
    <div className="glass" style={{ padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
            DOMINÂNCIA POR TÓPICO
          </div>
          <div className="font-display" style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>
            Heatmap do Edital
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <Legend color="rgba(255,122,26,0.18)" border="rgba(255,122,26,0.5)" label="Não visto" />
          <Legend color="rgba(0,184,212,0.18)" border="rgba(0,184,212,0.5)" label="Estudado" />
          <Legend color="rgba(0,196,106,0.22)" border="rgba(0,196,106,0.6)" label="Dominado" glow />
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 10.5, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
          <span>{masteredCount} dominados · {studiedCount} estudados · {allTopics.length - masteredCount - studiedCount} não vistos</span>
          <span className="num" style={{ color: 'var(--neon-green)', fontWeight: 700 }}>{overallPct.toFixed(1)}%</span>
        </div>
        <div style={{ height: 5, background: 'rgba(12,13,18,0.06)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${overallPct}%`, background: 'linear-gradient(90deg, #00b8d4, #00c46a)', boxShadow: '0 0 8px rgba(0,196,106,0.35)' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gap: 14 }}>
        {subjects.map(s => (
          <div key={s.id}>
            <div style={{ fontSize: 12, color: 'var(--text-primary)', marginBottom: 6, fontWeight: 600 }}>
              {s.name}
              <span className="num" style={{ marginLeft: 8, color: 'var(--text-dim)', fontWeight: 400, fontSize: 10 }}>
                {s.topics.filter(t => heatmap[t.id]?.state === 'mastered').length}/{s.topics.length}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(82px, 1fr))', gap: 5 }}>
              {s.topics.map(t => {
                const entry = heatmap[t.id] || { state: 'unseen' };
                const style = {
                  unseen: { background: 'rgba(255,122,26,0.13)', border: '1px solid rgba(255,122,26,0.45)', color: '#a14e0c' },
                  studied: { background: 'rgba(0,184,212,0.13)', border: '1px solid rgba(0,184,212,0.5)', color: '#005566' },
                  mastered: { background: 'rgba(0,196,106,0.18)', border: '1px solid rgba(0,196,106,0.6)', boxShadow: '0 0 8px rgba(0,196,106,0.25)', color: '#005a30' },
                }[entry.state];
                return (
                  <div key={t.id} style={{ position: 'relative' }}>
                    <button onClick={() => setOpenId(openId === t.id ? null : t.id)}
                      style={{
                        width: '100%', minHeight: 42, padding: '6px 8px',
                        borderRadius: 7, cursor: 'pointer',
                        fontSize: 10, lineHeight: 1.2, textAlign: 'left',
                        ...style,
                      }} title={t.name}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {t.name}
                      </div>
                    </button>
                    {openId === t.id && (
                      <div className="glass-strong anim-slide-up" style={{
                        position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 10,
                        padding: 4, borderRadius: 8, display: 'grid', gap: 2, minWidth: 130,
                      }}>
                        {[
                          { k: 'unseen', label: 'Não visto', color: '#a14e0c' },
                          { k: 'studied', label: 'Estudado', color: '#005566' },
                          { k: 'mastered', label: 'Dominado', color: '#005a30' },
                        ].map(opt => (
                          <button key={opt.k} onClick={() => setSt(t.id, opt.k)}
                            style={{
                              padding: '6px 10px', fontSize: 11, textAlign: 'left',
                              borderRadius: 6, cursor: 'pointer',
                              background: entry.state === opt.k ? 'rgba(12,13,18,0.05)' : 'transparent',
                              border: 'none', color: opt.color, fontWeight: 600,
                            }}>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Legend({ color, border, label, glow }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
      <div style={{ width: 10, height: 10, borderRadius: 2, background: color, border: `1px solid ${border}`, boxShadow: glow ? '0 0 5px rgba(0,196,106,0.3)' : 'none' }} />
      {label}
    </div>
  );
}

window.EditalHeatmap = EditalHeatmap;
