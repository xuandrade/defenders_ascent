// Tamagotchi pet — evolves with XP. Pure SVG, hand-drawn-feeling.
function PetCompanion({ xp, compact = false }) {
  const stage = window.DA.getPetStage(xp);
  const STAGES = [
    { name: 'Ovinho', sub: 'Esperando o primeiro estudo' },
    { name: 'Rachando', sub: 'Algo está prestes a nascer' },
    { name: 'Filhotinho', sub: 'Acabou de eclodir' },
    { name: 'Crescendo', sub: 'Já reconhece os livros' },
    { name: 'Aprendiz', sub: 'Já carrega seu próprio caderno' },
    { name: 'Defensorinha', sub: 'Pronta pra acompanhar a posse' },
    { name: 'Lendária', sub: 'Atingiu a forma final' },
  ];
  const info = STAGES[stage];
  const size = compact ? 80 : 130;
  const animation = stage === 0 ? 'pet-egg-shake 3.6s ease-in-out infinite'
                  : stage === 1 ? 'pet-wiggle 2.2s ease-in-out infinite'
                  : 'pet-bob 2.6s ease-in-out infinite';

  return (
    <div className="glass" style={{
      padding: compact ? 12 : 18, display: 'flex', alignItems: 'center', gap: compact ? 12 : 18,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* sparkles around the egg/pet */}
      {stage <= 1 && [
        { x: '14%', y: '20%', d: 0 },
        { x: '82%', y: '30%', d: 0.7 },
        { x: '20%', y: '78%', d: 1.4 },
        { x: '88%', y: '70%', d: 2.1 },
      ].map((s, i) => (
        <div key={i} style={{
          position: 'absolute', left: s.x, top: s.y, width: 14, height: 14, pointerEvents: 'none',
          animation: `sparkle-twinkle 2.6s ease-in-out ${s.d}s infinite`,
        }}>
          <svg viewBox="0 0 14 14" width="14" height="14">
            <path d="M7 0 L8 5 L13 6 L8 7 L7 13 L6 7 L1 6 L6 5 Z" fill="#f59e0b" style={{ filter: 'drop-shadow(0 0 3px #ffc107)' }} />
          </svg>
        </div>
      ))}

      <div style={{
        width: size, height: size, position: 'relative', flexShrink: 0,
        animation,
        filter: stage === 0 ? 'drop-shadow(0 0 12px rgba(255,79,160,0.45)) drop-shadow(0 0 24px rgba(245,158,11,0.3))' : 'none',
      }}>
        <PetSvg stage={stage} size={size} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--neon-violet)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
          COMPANHEIRA · NÍVEL {stage + 1}/7
        </div>
        <div className="font-display" style={{ fontSize: compact ? 16 : 20, fontWeight: 700, marginTop: 2, color: 'var(--text-primary)' }}>
          {info.name}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
          {info.sub}
        </div>
        {/* Evolution progress */}
        <PetEvolutionBar xp={xp} stage={stage} />
      </div>
    </div>
  );
}

function PetEvolutionBar({ xp, stage }) {
  const thresholds = [0, 500, 1500, 3500, 7000, 13000, 25000];
  const cur = thresholds[stage];
  const next = thresholds[stage + 1] || cur;
  const progress = next === cur ? 1 : (xp - cur) / (next - cur);

  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', marginBottom: 4 }}>
        <span className="num">{xp.toLocaleString('pt-BR')} XP</span>
        {stage < 6 && <span className="num">{(next - xp).toLocaleString('pt-BR')} XP até evoluir</span>}
        {stage >= 6 && <span style={{ color: 'var(--neon-pink)' }}>★ FORMA FINAL</span>}
      </div>
      <div style={{ height: 6, background: 'rgba(12,13,18,0.06)', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
        <div style={{
          height: '100%', width: `${progress * 100}%`,
          background: 'linear-gradient(90deg, #8b3dff, #ff3d8a, #f59e0b)',
          boxShadow: '0 0 8px rgba(139,61,255,0.4)',
          transition: 'width 600ms ease',
        }} />
        {/* stage tick marks */}
        {[0,1,2,3,4,5,6].map(i => (
          <div key={i} style={{
            position: 'absolute', left: `${(i/6)*100}%`, top: 0, bottom: 0, width: 2,
            background: i <= stage ? 'rgba(255,255,255,0.7)' : 'rgba(12,13,18,0.1)',
          }} />
        ))}
      </div>
    </div>
  );
}

function PetSvg({ stage, size = 130 }) {
  // 6 evolutions: egg → crack → baby → child → teen → adult → ascended
  const VB = 100;
  const violet = '#8b3dff', cyan = '#00b8d4', pink = '#ff3d8a', gold = '#f59e0b', cream = '#fff5e8';

  return (
    <svg viewBox={`0 0 ${VB} ${VB}`} width={size} height={size}>
      <defs>
        <radialGradient id="pet-glow">
          <stop offset="0%" stopColor="rgba(139,61,255,0.35)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id="pet-egg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#fff5fb" />
          <stop offset="100%" stopColor="#ffd9ec" />
        </linearGradient>
        <linearGradient id="pet-body" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#c89dff" />
          <stop offset="100%" stopColor="#8b3dff" />
        </linearGradient>
        <linearGradient id="pet-final" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor={cyan}><animate attributeName="stop-color" values={`${cyan};${violet};${pink};${gold};${cyan}`} dur="6s" repeatCount="indefinite" /></stop>
          <stop offset="100%" stopColor={pink}><animate attributeName="stop-color" values={`${pink};${gold};${cyan};${violet};${pink}`} dur="6s" repeatCount="indefinite" /></stop>
        </linearGradient>
      </defs>

      {/* Glow */}
      <circle cx="50" cy="55" r="42" fill="url(#pet-glow)" />

      {/* Stage 0: egg — sleeping baby with blush, glow, hearts */}
      {stage === 0 && (
        <>
          {/* warm aura */}
          <ellipse cx="50" cy="58" rx="36" ry="42" fill="rgba(255,79,160,0.08)">
            <animate attributeName="rx" values="36;38;36" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="ry" values="42;44;42" dur="2.4s" repeatCount="indefinite" />
          </ellipse>
          {/* shadow */}
          <ellipse cx="50" cy="92" rx="22" ry="2.5" fill="rgba(12,13,18,0.12)" />
          {/* egg body with breathing */}
          <g style={{ transformOrigin: '50px 60px', animation: 'pet-glow-pulse 2.4s ease-in-out infinite' }}>
            <ellipse cx="50" cy="58" rx="26" ry="32" fill="url(#pet-egg)" stroke={pink} strokeWidth="1.8">
              <animate attributeName="rx" values="26;26.6;26" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="ry" values="32;31.4;32" dur="2.4s" repeatCount="indefinite" />
            </ellipse>
            {/* spots — soft, varied */}
            <circle cx="40" cy="48" r="3.5" fill={violet} opacity="0.45" />
            <circle cx="60" cy="55" r="3" fill={cyan} opacity="0.5" />
            <circle cx="46" cy="74" r="2.5" fill={gold} opacity="0.55" />
            <circle cx="62" cy="78" r="2" fill={pink} opacity="0.5" />
            <circle cx="36" cy="64" r="1.8" fill={cyan} opacity="0.4" />
            {/* highlight shine */}
            <ellipse cx="42" cy="42" rx="6" ry="9" fill="white" opacity="0.55" transform="rotate(-20 42 42)" />
            <ellipse cx="40" cy="38" rx="2" ry="4" fill="white" opacity="0.85" transform="rotate(-20 40 38)" />
            {/* sleepy eyes (closed, lashes) */}
            <path d="M40 56 Q43 54 46 56" fill="none" stroke="#1a1a2e" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M54 56 Q57 54 60 56" fill="none" stroke="#1a1a2e" strokeWidth="1.6" strokeLinecap="round" />
            {/* lashes */}
            <line x1="41" y1="55" x2="40" y2="53" stroke="#1a1a2e" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="55" y1="55" x2="54" y2="53" stroke="#1a1a2e" strokeWidth="1.2" strokeLinecap="round" />
            {/* blush */}
            <ellipse cx="38" cy="64" rx="3.5" ry="2.3" fill={pink} opacity="0.5" />
            <ellipse cx="62" cy="64" rx="3.5" ry="2.3" fill={pink} opacity="0.5" />
            {/* tiny smile */}
            <path d="M46 68 Q50 71 54 68" fill="none" stroke="#1a1a2e" strokeWidth="1.4" strokeLinecap="round" />
          </g>
          {/* floating sleep "z"s */}
          <g>
            <text x="74" y="32" fontSize="9" fontWeight="700" fill={violet} opacity="0">
              z
              <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" />
              <animate attributeName="y" values="36;26;22" dur="3s" repeatCount="indefinite" />
            </text>
            <text x="80" y="22" fontSize="7" fontWeight="700" fill={cyan} opacity="0">
              z
              <animate attributeName="opacity" values="0;1;0" dur="3s" begin="0.7s" repeatCount="indefinite" />
              <animate attributeName="y" values="26;16;12" dur="3s" begin="0.7s" repeatCount="indefinite" />
            </text>
          </g>
          {/* tiny floating heart */}
          <g transform="translate(20 25)">
            <path d="M0 2 C0 0 -2 -2 -4 0 C-6 2 -4 5 0 8 C4 5 6 2 4 0 C2 -2 0 0 0 2 Z"
                  fill={pink} opacity="0">
              <animate attributeName="opacity" values="0;0.8;0" dur="2.6s" begin="0.3s" repeatCount="indefinite" />
            </path>
            <animateTransform attributeName="transform" type="translate"
              values="20 25; 20 15; 20 25" dur="2.6s" begin="0.3s" repeatCount="indefinite" />
          </g>
          {/* corner sparkles */}
          <path d="M76 50 L78 54 L82 56 L78 58 L76 62 L74 58 L70 56 L74 54 Z" fill={gold} opacity="0.85">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" from="0 76 56" to="360 76 56" dur="6s" repeatCount="indefinite" />
          </path>
          <path d="M22 78 L23 80 L25 81 L23 82 L22 84 L21 82 L19 81 L21 80 Z" fill={cyan} opacity="0.7">
            <animate attributeName="opacity" values="0.2;0.9;0.2" dur="2.2s" begin="0.5s" repeatCount="indefinite" />
          </path>
        </>
      )}

      {/* Stage 1: cracking */}
      {stage === 1 && (
        <>
          <ellipse cx="50" cy="58" rx="26" ry="32" fill="url(#pet-egg)" stroke={pink} strokeWidth="1.5" />
          {/* crack */}
          <path d="M35 45 L42 50 L38 55 L46 60 L40 66" fill="none" stroke={violet} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M58 42 L62 48 L58 52" fill="none" stroke={violet} strokeWidth="2" strokeLinecap="round" />
          {/* peeking eye */}
          <circle cx="50" cy="55" r="3" fill="#1a1a2e">
            <animate attributeName="r" values="3;1;3" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="51" cy="54" r="0.8" fill="white" />
        </>
      )}

      {/* Stage 2: baby — round blob with tiny ears */}
      {stage >= 2 && stage <= 5 && (
        <>
          {/* shadow */}
          <ellipse cx="50" cy={stage === 2 ? 84 : 88} rx={stage === 2 ? 18 : 22} ry="3" fill="rgba(12,13,18,0.1)" />
          {/* body */}
          <ellipse
            cx="50"
            cy={stage === 2 ? 64 : stage === 3 ? 60 : stage === 4 ? 58 : 54}
            rx={stage === 2 ? 22 : stage === 3 ? 24 : stage === 4 ? 25 : 26}
            ry={stage === 2 ? 20 : stage === 3 ? 24 : stage === 4 ? 28 : 32}
            fill={stage === 5 ? 'url(#pet-body)' : '#d3b3ff'}
            stroke={violet} strokeWidth="1.5"
          />
          {/* ears */}
          {stage >= 3 && (
            <>
              <path d={`M32 ${stage === 3 ? 42 : 36} L28 ${stage === 3 ? 30 : 22} L40 ${stage === 3 ? 38 : 32} Z`}
                    fill="#d3b3ff" stroke={violet} strokeWidth="1.5" strokeLinejoin="round" />
              <path d={`M68 ${stage === 3 ? 42 : 36} L72 ${stage === 3 ? 30 : 22} L60 ${stage === 3 ? 38 : 32} Z`}
                    fill="#d3b3ff" stroke={violet} strokeWidth="1.5" strokeLinejoin="round" />
              {/* inner ear */}
              <path d={`M33 ${stage === 3 ? 40 : 34} L31 ${stage === 3 ? 33 : 27} L38 ${stage === 3 ? 38 : 32} Z`} fill={pink} opacity="0.5" />
              <path d={`M67 ${stage === 3 ? 40 : 34} L69 ${stage === 3 ? 33 : 27} L62 ${stage === 3 ? 38 : 32} Z`} fill={pink} opacity="0.5" />
            </>
          )}
          {/* eyes */}
          <g>
            <ellipse cx="42" cy={stage === 2 ? 60 : stage === 3 ? 56 : stage === 4 ? 53 : 48} rx="3.5" ry="4.5" fill="#1a1a2e" />
            <ellipse cx="58" cy={stage === 2 ? 60 : stage === 3 ? 56 : stage === 4 ? 53 : 48} rx="3.5" ry="4.5" fill="#1a1a2e" />
            <circle cx="43" cy={stage === 2 ? 58.5 : stage === 3 ? 54.5 : stage === 4 ? 51.5 : 46.5} r="1.2" fill="white" />
            <circle cx="59" cy={stage === 2 ? 58.5 : stage === 3 ? 54.5 : stage === 4 ? 51.5 : 46.5} r="1.2" fill="white" />
          </g>
          {/* blush */}
          <ellipse cx="36" cy={stage === 2 ? 67 : stage === 3 ? 63 : stage === 4 ? 60 : 55} rx="3" ry="2" fill={pink} opacity="0.4" />
          <ellipse cx="64" cy={stage === 2 ? 67 : stage === 3 ? 63 : stage === 4 ? 60 : 55} rx="3" ry="2" fill={pink} opacity="0.4" />
          {/* mouth */}
          <path d={`M46 ${stage === 2 ? 68 : stage === 3 ? 64 : stage === 4 ? 61 : 56} Q50 ${stage === 2 ? 71 : stage === 3 ? 67 : stage === 4 ? 64 : 59} 54 ${stage === 2 ? 68 : stage === 3 ? 64 : stage === 4 ? 61 : 56}`}
                fill="none" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" />
          {/* accessories per stage */}
          {stage >= 4 && (
            // tiny book
            <g transform={`translate(38 ${stage === 4 ? 76 : 72})`}>
              <rect x="0" y="0" width="24" height="14" rx="2" fill={cyan} stroke="#005566" strokeWidth="1" />
              <line x1="12" y1="2" x2="12" y2="12" stroke="#005566" strokeWidth="0.8" />
              <line x1="3" y1="6" x2="9" y2="6" stroke="white" strokeWidth="0.6" />
              <line x1="3" y1="9" x2="9" y2="9" stroke="white" strokeWidth="0.6" />
              <line x1="15" y1="6" x2="21" y2="6" stroke="white" strokeWidth="0.6" />
              <line x1="15" y1="9" x2="21" y2="9" stroke="white" strokeWidth="0.6" />
            </g>
          )}
          {stage >= 5 && (
            // tiny shield necklace
            <g transform="translate(50 70)">
              <path d="M0 0 L6 2 L6 6 C6 9 3 11 0 12 C-3 11 -6 9 -6 6 L-6 2 Z"
                    fill={gold} stroke="#7a4a00" strokeWidth="0.8" strokeLinejoin="round" />
              <text x="0" y="9" textAnchor="middle" fontSize="6" fontWeight="700" fill="#7a4a00">DA</text>
            </g>
          )}
        </>
      )}

      {/* Stage 6: ascended — rainbow body with crown */}
      {stage === 6 && (
        <>
          <ellipse cx="50" cy="92" rx="22" ry="3" fill="rgba(12,13,18,0.1)" />
          {/* aura */}
          <circle cx="50" cy="55" r="44" fill="none" stroke="url(#pet-final)" strokeWidth="1" strokeDasharray="3 4" opacity="0.6">
            <animateTransform attributeName="transform" type="rotate" from="0 50 55" to="360 50 55" dur="20s" repeatCount="indefinite" />
          </circle>
          <ellipse cx="50" cy="56" rx="26" ry="32" fill="url(#pet-final)" stroke="white" strokeWidth="1.5" />
          {/* ears */}
          <path d="M32 36 L26 18 L42 32 Z" fill="url(#pet-final)" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M68 36 L74 18 L58 32 Z" fill="url(#pet-final)" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
          {/* crown */}
          <path d="M40 22 L44 14 L50 20 L56 14 L60 22 L60 26 L40 26 Z" fill={gold} stroke="#7a4a00" strokeWidth="1" strokeLinejoin="round" />
          <circle cx="50" cy="18" r="2" fill={pink} />
          {/* eyes */}
          <ellipse cx="42" cy="50" rx="3.5" ry="4.5" fill="white" />
          <ellipse cx="58" cy="50" rx="3.5" ry="4.5" fill="white" />
          <circle cx="42" cy="51" r="2" fill="#1a1a2e" />
          <circle cx="58" cy="51" r="2" fill="#1a1a2e" />
          <circle cx="43" cy="50" r="0.8" fill="white" />
          <circle cx="59" cy="50" r="0.8" fill="white" />
          {/* mouth */}
          <path d="M44 60 Q50 65 56 60" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          {/* blush */}
          <ellipse cx="34" cy="58" rx="3" ry="2" fill="white" opacity="0.5" />
          <ellipse cx="66" cy="58" rx="3" ry="2" fill="white" opacity="0.5" />
        </>
      )}
    </svg>
  );
}

window.PetCompanion = PetCompanion;
window.PetSvg = PetSvg;
