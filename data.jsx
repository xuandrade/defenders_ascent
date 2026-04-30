// Mock study state — supports objetiva + discursiva modes (separate localStorage keys)

const mkTopic = (id, name, partial = 0) => {
  const flags = ['lei', 'doutrina', 'juris', 'questoes', 'revisao'];
  const t = { id, name, lei: false, doutrina: false, juris: false, questoes: false, revisao: false };
  for (let i = 0; i < partial; i++) t[flags[i]] = true;
  return t;
};

const INITIAL_SUBJECTS_OBJ = [
  { id: 'const', name: 'Direito Constitucional', shortName: 'Const', weight: 5,
    topics: [
      mkTopic('c1', 'Teoria geral da constituição', 5),
      mkTopic('c2', 'Direitos fundamentais', 5),
      mkTopic('c3', 'Organização do Estado', 4),
      mkTopic('c4', 'Poder Judiciário', 3),
      mkTopic('c5', 'Controle de constitucionalidade', 2),
      mkTopic('c6', 'Ordem econômica e social', 1),
    ] },
  { id: 'penal', name: 'Direito Penal', shortName: 'Penal', weight: 4,
    topics: [
      mkTopic('p1', 'Teoria geral do crime', 5),
      mkTopic('p2', 'Princípios do direito penal', 4),
      mkTopic('p3', 'Crimes contra a pessoa', 4),
      mkTopic('p4', 'Crimes contra o patrimônio', 3),
      mkTopic('p5', 'Lei de drogas', 2),
      mkTopic('p6', 'Execução penal', 3),
    ] },
  { id: 'proc-penal', name: 'Processo Penal', shortName: 'P. Penal', weight: 4,
    topics: [
      mkTopic('pp1', 'Inquérito policial', 5),
      mkTopic('pp2', 'Ação penal', 4),
      mkTopic('pp3', 'Prisões e medidas cautelares', 3),
      mkTopic('pp4', 'Provas', 2),
      mkTopic('pp5', 'Recursos', 1),
      mkTopic('pp6', 'Júri', 0),
    ] },
  { id: 'civil', name: 'Direito Civil', shortName: 'Civil', weight: 4,
    topics: [
      mkTopic('cv1', 'Parte geral', 5),
      mkTopic('cv2', 'Obrigações', 4),
      mkTopic('cv3', 'Contratos', 3),
      mkTopic('cv4', 'Família', 4),
      mkTopic('cv5', 'Sucessões', 2),
    ] },
  { id: 'proc-civ', name: 'Processo Civil', shortName: 'P. Civil', weight: 3,
    topics: [
      mkTopic('pc1', 'Jurisdição e competência', 4),
      mkTopic('pc2', 'Procedimento comum', 3),
      mkTopic('pc3', 'Tutelas provisórias', 2),
      mkTopic('pc4', 'Recursos', 1),
    ] },
  { id: 'def', name: 'Princípios e Atribuições da Defensoria', shortName: 'Defensoria', weight: 5,
    topics: [
      mkTopic('d1', 'LC 80/94', 5),
      mkTopic('d2', 'Autonomia da DP', 5),
      mkTopic('d3', 'Atribuições institucionais', 4),
      mkTopic('d4', 'Defensoria e direitos humanos', 3),
    ] },
  { id: 'dh', name: 'Direitos Humanos', shortName: 'DH', weight: 3,
    topics: [
      mkTopic('dh1', 'Sistema universal', 3),
      mkTopic('dh2', 'Sistema interamericano', 2),
      mkTopic('dh3', 'Convenções específicas', 1),
    ] },
];

function genDailyLogs() {
  const logs = [];
  const today = new Date();
  for (let i = 119; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const dow = d.getDay();
    const base = dow === 0 || dow === 6 ? 2 : 4;
    const variance = Math.sin(i * 0.31) * 1.5 + Math.cos(i * 0.17) * 1.2;
    const skip = (i % 11 === 3) || (i % 17 === 5);
    const hours = skip ? 0 : Math.max(0, Math.min(8, base + variance + (Math.random() - 0.5)));
    const questions = skip ? 0 : Math.round(20 + Math.random() * 60);
    const reviews = skip ? 0 : Math.round(5 + Math.random() * 25);
    logs.push({
      date: d.toISOString().slice(0, 10),
      hours: Math.round(hours * 10) / 10,
      questions, reviews,
    });
  }
  return logs;
}

// Shared state (cross-mode): streak, dailyLogs, goals, pet/xp, concursos
const INITIAL_SHARED = {
  streak: 23,
  shields: 4,
  dailyLogs: genDailyLogs(),
  goals: { dailyHours: 4, weeklyHours: 28, dailyQuestions: 40, weeklyQuestions: 250 },
  xp: 4280,
  achievements: ['week_streak', 'first_mastered'],
  petStage: 2, // 0..6 — egg → mature
  concursos: [
    { id: 'dpe-rj', name: 'DPE RJ', date: '2026-07-12', startedAt: '2026-01-15' },
    { id: 'dpe-sp', name: 'DPE SP', date: '2026-09-28', startedAt: '2026-02-01' },
    { id: 'dpe-mg', name: 'DPE MG', date: '2026-11-15', startedAt: '2026-03-10' },
  ],
};

// Objetiva-mode state (subjects + heatmap)
const INITIAL_OBJETIVA = {
  subjects: INITIAL_SUBJECTS_OBJ,
  heatmap: (() => {
    const h = {};
    INITIAL_SUBJECTS_OBJ.forEach((s, si) => {
      s.topics.forEach((t, ti) => {
        const checks = ['lei','doutrina','juris','questoes','revisao'].filter(f => t[f]).length;
        let state = 'unseen';
        if (checks === 5) state = 'mastered';
        else if (checks >= 2) state = 'studied';
        const daysAgo = (si * 3 + ti * 2) % 14;
        const d = new Date(); d.setDate(d.getDate() - daysAgo);
        h[t.id] = { state, lastUpdated: d.toISOString() };
      });
    });
    return h;
  })(),
};

// Discursiva-mode state (empty by default — user adds subjects)
const INITIAL_DISCURSIVA = {
  subjects: [
    // seed with one example so empty state is illustrative
  ],
};

// ========= Utilities =========
function getSubjectCompletionObj(subject) {
  const total = subject.topics.length * 5;
  if (total === 0) return 0;
  let checks = 0;
  subject.topics.forEach(t => {
    ['lei','doutrina','juris','questoes','revisao'].forEach(f => { if (t[f]) checks++; });
  });
  return (checks / total) * 100;
}
function getSubjectCompletionDisc(subject) {
  const total = subject.topics.length * 3;
  if (total === 0) return 0;
  let checks = 0;
  subject.topics.forEach(t => {
    ['estudado','grifado','questoes'].forEach(f => { if (t[f]) checks++; });
  });
  return (checks / total) * 100;
}
function getTotalStatsObj(subjects) {
  let total = 0, checks = 0;
  subjects.forEach(s => {
    total += s.topics.length * 5;
    s.topics.forEach(t => {
      ['lei','doutrina','juris','questoes','revisao'].forEach(f => { if (t[f]) checks++; });
    });
  });
  return { total, checks, percentage: total === 0 ? 0 : (checks / total) * 100 };
}
function getTotalStatsDisc(subjects) {
  let total = 0, checks = 0;
  subjects.forEach(s => {
    total += s.topics.length * 3;
    s.topics.forEach(t => {
      ['estudado','grifado','questoes'].forEach(f => { if (t[f]) checks++; });
    });
  });
  return { total, checks, percentage: total === 0 ? 0 : (checks / total) * 100 };
}

function getLevelInfo(xp) {
  const tiers = [
    { min: 0, max: 499, name: 'Aspirante', color: '#7a7a8c' },
    { min: 500, max: 1499, name: 'Estagiária', color: '#00b8d4' },
    { min: 1500, max: 3499, name: 'Advogada', color: '#00c46a' },
    { min: 3500, max: 6999, name: 'Defensora', color: '#f59e0b' },
    { min: 7000, max: 12999, name: 'Defensora Pública', color: '#8b3dff' },
    { min: 13000, max: Infinity, name: 'Defensora Plena', color: '#ff3d8a' },
  ];
  const tier = tiers.find(t => xp >= t.min && xp <= t.max) || tiers[0];
  const next = tiers[tiers.indexOf(tier) + 1];
  return { tier, next, progress: next ? (xp - tier.min) / (next.min - tier.min) : 1, toNext: next ? next.min - xp : 0 };
}

function daysUntil(iso) {
  if (!iso) return null;
  const now = new Date(); now.setHours(0,0,0,0);
  const then = new Date(iso); then.setHours(0,0,0,0);
  return Math.round((then - now) / (1000 * 60 * 60 * 24));
}

// Pet stage from XP
function getPetStage(xp) {
  if (xp < 500) return 0;       // egg
  if (xp < 1500) return 1;      // crack
  if (xp < 3500) return 2;      // baby
  if (xp < 7000) return 3;      // child
  if (xp < 13000) return 4;     // teen
  if (xp < 25000) return 5;     // adult
  return 6;                      // ascended
}

window.DA = {
  INITIAL_SHARED, INITIAL_OBJETIVA, INITIAL_DISCURSIVA,
  getSubjectCompletionObj, getSubjectCompletionDisc,
  getTotalStatsObj, getTotalStatsDisc,
  getLevelInfo, daysUntil, getPetStage,
};
