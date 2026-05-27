import { useState, useRef, useEffect } from "react";

const PREMIUM_CODE = "1415";

const AI_LINKS = {
suno: "https://suno.com",
midjourney: "https://midjourney.com",
dalle: "https://chat.openai.com",
runway: "https://runwayml.com",
stablediff: "https://stablediffusionweb.com",
chatgpt: "https://chat.openai.com",
claude: "https://claude.ai",
gemini: "https://gemini.google.com",
};

const AI_NAMES = {
suno: "Suno",
midjourney: "Midjourney",
dalle: "DALL-E",
runway: "Runway",
stablediff: "Stable Diffusion",
chatgpt: "ChatGPT",
claude: "Claude",
gemini: "Gemini",
};

const ALL_EXAMPLES = [
"Crée une image futuriste d'une ville la nuit",
"Génère un portrait photoréaliste d'une femme mystérieuse",
"Crée une illustration cyberpunk d'un samouraï",
"Génère une image de forêt enchantée avec des fées",
"Crée un paysage de montagne au coucher de soleil",
"Génère une image abstraite avec des formes géométriques colorées",
"Crée une illustration de dragon crachant du feu",
"Génère une photo réaliste d'une voiture de sport sur une route déserte",
"Crée une image de ville sous-marine futuriste",
"Génère un portrait d'un guerrier viking en armure",
"Crée une illustration minimaliste d'un chat noir",
"Génère une image de galaxie avec des nébuleuses colorées",
"Crée un tableau style impressionniste d'un jardin fleuri",
"Génère une image de robot humanoïde dans un laboratoire",
"Compose une chanson trap mélancolique sur la réussite",
"Crée une musique lo-fi relaxante pour travailler",
"Génère une chanson R&B romantique en français",
"Compose une musique épique pour un jeu vidéo",
"Crée un beat hip-hop old school avec des samples jazz",
"Génère une chanson pop énergique pour une pub",
"Compose une musique ambiante pour méditer",
"Crée une chanson drill sombre sur la vie urbaine",
"Génère une bande originale de film d'action",
"Compose une chanson acoustique folk mélancolique",
"Crée une musique électronique house pour une boîte de nuit",
"Génère un générique de podcast motivationnel",
"Génère une vidéo de paysage cinématographique 4K",
"Crée une vidéo de voyage en time-lapse à Tokyo",
"Génère un clip vidéo artistique pour une chanson trap",
"Crée une vidéo de logo animé pour une startup",
"Génère une vidéo de coucher de soleil sur l'océan",
"Crée une animation 3D d'une voiture de luxe",
"Génère une vidéo de nature avec des animaux sauvages",
"Crée un teaser cinématique pour un film d'action",
"Écris un post LinkedIn qui attire des clients",
"Rédige un email de vente persuasif pour une offre SaaS",
"Écris un script TikTok viral sur la finance",
"Génère un thread Twitter sur l'entrepreneuriat",
"Rédige une description produit pour une montre de luxe",
"Écris un article de blog SEO sur le marketing digital",
"Génère une bio Instagram percutante pour un coach",
"Rédige un pitch de 60 secondes pour une startup IA",
"Écris une lettre de motivation pour un poste de designer",
"Génère un plan de contenu pour 30 jours sur Instagram",
"Rédige un communiqué de presse pour un lancement produit",
"Écris un script YouTube de 10 minutes sur la crypto",
"Crée un pitch deck pour une startup dans la healthtech",
"Génère une analyse SWOT pour une marque de vêtements",
"Rédige un business plan pour un restaurant végétarien",
"Crée une stratégie de lancement pour une application mobile",
"Génère des personas clients pour une marque de luxe",
"Crée un logo minimaliste pour une agence créative",
"Génère un logo moderne pour une startup tech",
"Crée une identité visuelle pour une marque de café",
"Génère un logo animé pour une chaîne YouTube gaming",
"Génère une landing page moderne en HTML CSS",
"Crée un composant React de tableau de bord analytique",
"Génère un script Python pour analyser des données CSV",
"Crée une API REST en Node.js pour une app de todo",
];

const getRandomExamples = () => {
const shuffled = [...ALL_EXAMPLES].sort(() => Math.random() - 0.5);
return shuffled.slice(0, 5);
};

const parseOutput = (text) => {
const promptMatch = text.match(/\[PROMPT\]([\s\S]*?)\[\/PROMPT\]/);
const optimisedMatch = text.match(/\[PROMPT_OPTIMISE\]([\s\S]*?)\[\/PROMPT_OPTIMISE\]/);
const recoMatch = text.match(/\[RECOMMANDATION\]([\s\S]*?)\[\/RECOMMANDATION\]/);
const questionsMatch = text.match(/\[QUESTIONS\]([\s\S]*?)\[\/QUESTIONS\]/);
const scoreMatch = text.match(/\[SCORE\]([\s\S]*?)\[\/SCORE\]/);

let questions = [];
if (questionsMatch) {
const raw = questionsMatch[1].trim();
const qBlocks = raw.split(/\n\n+/).filter(b => b.trim().match(/^Q\d/i));
questions = qBlocks.map(block => {
const lines = block.trim().split("\n").map(l => l.replace(/\*\*/g, "").trim()).filter(l => l);
const question = lines[0].replace(/^Q\d+[:.]\s*/i, "").trim();
const options = lines.slice(1)
.filter(l => l.match(/^[A-C][:.]/i))
.map(l => ({ key: l.charAt(0).toUpperCase(), text: l.slice(2).trim() }));
return { question, options };
}).filter(q => q.options.length > 0);
}

let score = null;
if (scoreMatch) {
const raw = scoreMatch[1].trim();
const noteStdMatch = raw.match(/NOTE_STANDARD:\s*(\d+)/i) || raw.match(/NOTE:\s*(\d+)/i);
const noteOptMatch = raw.match(/NOTE_OPTIMISE:\s*(\d+)/i);
const clarte = raw.match(/CLARTE:\s*(\d+)/i);
const precision = raw.match(/PRECISION:\s*(\d+)/i);
const richesse = raw.match(/RICHESSE:\s*(\d+)/i);
const originalite = raw.match(/ORIGINALITE:\s*(\d+)/i);
const coherence = raw.match(/COHERENCE:\s*(\d+)/i);
const structure = raw.match(/STRUCTURE:\s*(\d+)/i);
const syntaxeIa = raw.match(/SYNTAXE_IA:\s*(\d+)/i);
const parametres = raw.match(/PARAMETRES:\s*(\d+)/i);
const vocabulaire = raw.match(/VOCABULAIRE:\s*(\d+)/i);
const completude = raw.match(/COMPLETUDE:\s*(\d+)/i);
const conseil1 = raw.match(/CONSEIL_1:\s*(.+)/i);
const conseil2 = raw.match(/CONSEIL_2:\s*(.+)/i);
const conseil3 = raw.match(/CONSEIL_3:\s*(.+)/i);

const qualite = {
clarte: clarte ? parseInt(clarte[1]) : null,
precision: precision ? parseInt(precision[1]) : null,
richesse: richesse ? parseInt(richesse[1]) : null,
originalite: originalite ? parseInt(originalite[1]) : null,
coherence: coherence ? parseInt(coherence[1]) : null,
};
const technique = {
structure: structure ? parseInt(structure[1]) : null,
syntaxe_ia: syntaxeIa ? parseInt(syntaxeIa[1]) : null,
parametres: parametres ? parseInt(parametres[1]) : null,
vocabulaire: vocabulaire ? parseInt(vocabulaire[1]) : null,
completude: completude ? parseInt(completude[1]) : null,
};

const allVals = [...Object.values(qualite), ...Object.values(technique)].filter(v => v !== null);
const moyenneReelle = allVals.length > 0 ? Math.round(allVals.reduce((a, b) => a + b, 0) / allVals.length) : null;

if (noteStdMatch) {
score = {
noteStandard: moyenneReelle || parseInt(noteStdMatch[1]),
noteOptimise: noteOptMatch ? parseInt(noteOptMatch[1]) : null,
qualite,
technique,
conseils: [
conseil1 ? conseil1[1].trim() : null,
conseil2 ? conseil2[1].trim() : null,
conseil3 ? conseil3[1].trim() : null,
].filter(Boolean),
};
}
}

return {
hasQuestions: questions.length > 0,
hasPrompt: !!promptMatch,
prompt: promptMatch ? promptMatch[1].trim() : null,
optimised: optimisedMatch ? optimisedMatch[1].trim() : null,
reco: recoMatch ? recoMatch[1].trim().replace(/\*\*(.*?)\*\*/g, '$1') : null,
questions: questions.length > 0 ? questions : null,
score,
};
};

const detectAiId = (reco, manualAi) => {
if (manualAi) return manualAi;
if (!reco) return null;
const r = reco.toLowerCase();
if (r.includes("suno")) return "suno";
if (r.includes("midjourney")) return "midjourney";
if (r.includes("dall-e") || r.includes("dalle")) return "dalle";
if (r.includes("runway")) return "runway";
if (r.includes("stable diffusion")) return "stablediff";
if (r.includes("chatgpt") || r.includes("chat gpt")) return "chatgpt";
if (r.includes("claude")) return "claude";
if (r.includes("gemini")) return "gemini";
return null;
};

const formatDate = (ts) => {
const d = new Date(ts);
const now = new Date();
const diff = now - d;
if (diff < 60000) return "À l'instant";
if (diff < 3600000) return `Il y a ${Math.floor(diff / 60000)} min`;
if (diff < 86400000) return `Il y a ${Math.floor(diff / 3600000)}h`;
return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
};

const getScoreColor = (note) => {
if (note >= 80) return "#4ade80";
if (note >= 60) return "#facc15";
return "#f87171";
};

const ScoreCircle = ({ note, label, size = 110, locked = false, onUnlock }) => {
const [display, setDisplay] = useState(0);
const color = getScoreColor(note);
const radius = size * 0.4;
const circumference = 2 * Math.PI * radius;
const progress = (display / 100) * circumference;
const dashOffset = circumference - progress;
const center = size / 2;

useEffect(() => {
setDisplay(0);
let start = null;
const duration = 1200;
const step = (timestamp) => {
if (!start) start = timestamp;
const elapsed = timestamp - start;
const pct = Math.min(elapsed / duration, 1);
const eased = 1 - Math.pow(1 - pct, 3);
setDisplay(Math.round(eased * note));
if (pct < 1) requestAnimationFrame(step);
};
requestAnimationFrame(step);
}, [note]);

return (
<div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
<div style={{ position: "relative", width: size, height: size, cursor: locked ? "pointer" : "default" }} onClick={locked ? onUnlock : undefined}>
<svg width={size} height={size} style={{ transform: "rotate(-90deg)", filter: locked ? "blur(3px)" : "none" }}>
<circle cx={center} cy={center} r={radius} fill="none" stroke="#1a1a1a" strokeWidth="8" />
<circle cx={center} cy={center} r={radius} fill="none" stroke={color} strokeWidth="8"
strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round" />
</svg>
<div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", filter: locked ? "blur(4px)" : "none" }}>
<div style={{ fontSize: size * 0.22, fontWeight: 800, color, letterSpacing: -1 }}>{display}</div>
<div style={{ fontSize: size * 0.09, color: "#555" }}>/100</div>
</div>
{locked && (
<div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
<div style={{ fontSize: 18 }}>🔒</div>
<div style={{ fontSize: 9, color: "#fff", fontWeight: 600, letterSpacing: 0.5 }}>PREMIUM</div>
</div>
)}
</div>
<div style={{ fontSize: 11, color: "#aaa", letterSpacing: 1, textAlign: "center" }}>{label}</div>
</div>
);
};

const StatBar = ({ label, value, animated }) => {
const [width, setWidth] = useState(animated ? 0 : value);
const color = getScoreColor(value);
useEffect(() => {
if (!animated) { setWidth(value); return; }
const timer = setTimeout(() => setWidth(value), 50);
return () => clearTimeout(timer);
}, [value, animated]);
return (
<div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
<div style={{ fontSize: 11, color: "#aaa" }}>{label}</div>
<div style={{ fontSize: 11, fontWeight: 700, color }}>{value}</div>
</div>
<div style={{ height: 5, background: "#1a1a1a", borderRadius: 100, overflow: "hidden" }}>
<div style={{ height: "100%", width: `${width}%`, background: color, borderRadius: 100, transition: animated ? "width 1s cubic-bezier(0.4, 0, 0.2, 1)" : "none" }} />
</div>
</div>
);
};

const CAROUSEL_HEIGHT = 280;
const TABS = ["Score", "Conseils", "Infos +", "IA-to-IA +"];

const ScoreCarousel = ({ score, scoreOpt, isPremium, onUnlockPremium, reco }) => {
const [tab, setTab] = useState(0);
const [animating, setAnimating] = useState(false);
const [direction, setDirection] = useState(1);
const [barsAnimated, setBarsAnimated] = useState(false);
const [barsOptAnimated, setBarsOptAnimated] = useState(false);
const touchStartX = useRef(null);
const TOTAL = TABS.length;

const goTo = (next, dir) => {
if (animating) return;
setDirection(dir);
setAnimating(true);
setTimeout(() => {
setTab(next);
setAnimating(false);
if (next === 2 && !barsAnimated) setBarsAnimated(true);
if (next === 3 && !barsOptAnimated) setBarsOptAnimated(true);
}, 220);
};

const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
const handleTouchEnd = (e) => {
if (touchStartX.current === null) return;
const diff = touchStartX.current - e.changedTouches[0].clientX;
if (Math.abs(diff) > 40) {
if (diff > 0) goTo((tab + 1) % TOTAL, 1);
else goTo((tab - 1 + TOTAL) % TOTAL, -1);
}
touchStartX.current = null;
};

const optScore = scoreOpt || (score ? {
...score,
noteStandard: Math.min((score.noteStandard || 0) + 18, 95),
} : null);

const renderBarsColumn = (items, animated, locked, onUnlock) => (
<div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative" }}>
<div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", filter: locked ? "blur(4px)" : "none", pointerEvents: locked ? "none" : "auto" }}>
{items.map((item, i) => item.value != null ? <StatBar key={i} label={item.label} value={item.value} animated={animated && !locked} /> : null)}
</div>
{locked && (
<div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, cursor: "pointer" }} onClick={onUnlock}>
<div style={{ fontSize: 18 }}>🔒</div>
<div style={{ fontSize: 9, color: "#fff", fontWeight: 600, letterSpacing: 0.5 }}>PREMIUM</div>
</div>
)}
</div>
);

return (
<div style={{ marginBottom: 24, background: "#080808", border: "1px solid #222", borderRadius: 16, overflow: "hidden" }}>
<div style={{ display: "flex", borderBottom: "1px solid #111" }}>
{TABS.map((t, i) => (
<button key={i} onClick={() => goTo(i, i > tab ? 1 : -1)}
style={{ flex: 1, padding: "12px 4px", fontSize: 9, fontWeight: 500, background: "transparent", color: tab === i ? "#fff" : "#444", border: "none", borderBottom: tab === i ? "2px solid #fff" : "2px solid transparent", cursor: "pointer", fontFamily: "inherit", letterSpacing: 0.3, transition: "all 0.15s" }}>
{t}
</button>
))}
</div>

<div
onTouchStart={handleTouchStart}
onTouchEnd={handleTouchEnd}
style={{
height: CAROUSEL_HEIGHT,
overflow: "hidden",
transform: animating ? `translateX(${direction * -30}px)` : "translateX(0)",
opacity: animating ? 0 : 1,
transition: "transform 0.22s ease, opacity 0.22s ease",
}}
>
{tab === 0 && (
<div style={{ height: "100%", padding: "20px 16px", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
<div style={{ display: "flex", justifyContent: "center", gap: 32 }}>
<ScoreCircle note={score.noteStandard} label="STANDARD" size={110} />
<ScoreCircle
note={score.noteOptimise || Math.min((score.noteStandard || 0) + 18, 95)}
label="IA-TO-IA"
size={110}
locked={!isPremium}
onUnlock={onUnlockPremium}
/>
</div>
{reco && <div style={{ fontSize: 13, color: "#666", textAlign: "center", lineHeight: 1.5, padding: "0 8px" }}>{reco}</div>}
</div>
)}

{tab === 1 && (
<div style={{ height: "100%", padding: "24px 16px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-evenly" }}>
{score?.conseils && score.conseils.length > 0 ? (
score.conseils.map((conseil, i) => (
<div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
<div style={{ width: 24, height: 24, borderRadius: "50%", background: "#111", border: "1px solid #222", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11, color: "#555", fontWeight: 700 }}>{i + 1}</div>
<div style={{ fontSize: 13, color: "#aaa", lineHeight: 1.6 }}>{conseil}</div>
</div>
))
) : (
<div style={{ fontSize: 13, color: "#555", textAlign: "center" }}>Aucun conseil disponible.</div>
)}
</div>
)}

{tab === 2 && (
<div style={{ height: "100%", padding: "16px 14px", boxSizing: "border-box", display: "flex", flexDirection: "row", gap: 16 }}>
{/* Qualité — toujours visible */}
<div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
<div style={{ fontSize: 9, color: "#555", letterSpacing: 1.5, marginBottom: 6, textAlign: "center" }}>QUALITÉ</div>
<div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
{score?.qualite?.clarte != null && <StatBar label="Clarté" value={score.qualite.clarte} animated={barsAnimated} />}
{score?.qualite?.precision != null && <StatBar label="Précision" value={score.qualite.precision} animated={barsAnimated} />}
{score?.qualite?.richesse != null && <StatBar label="Richesse" value={score.qualite.richesse} animated={barsAnimated} />}
{score?.qualite?.originalite != null && <StatBar label="Originalité" value={score.qualite.originalite} animated={barsAnimated} />}
{score?.qualite?.coherence != null && <StatBar label="Cohérence" value={score.qualite.coherence} animated={barsAnimated} />}
</div>
</div>
<div style={{ width: 1, background: "#1a1a1a" }} />
{/* Technique — floutée si non premium */}
<div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
<div style={{ fontSize: 9, color: "#555", letterSpacing: 1.5, marginBottom: 6, textAlign: "center" }}>TECHNIQUE</div>
<div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", filter: !isPremium ? "blur(4px)" : "none", pointerEvents: !isPremium ? "none" : "auto" }}>
{score?.technique?.structure != null && <StatBar label="Structure" value={score.technique.structure} animated={barsAnimated} />}
{score?.technique?.syntaxe_ia != null && <StatBar label="Syntaxe IA" value={score.technique.syntaxe_ia} animated={barsAnimated} />}
{score?.technique?.parametres != null && <StatBar label="Paramètres" value={score.technique.parametres} animated={barsAnimated} />}
{score?.technique?.vocabulaire != null && <StatBar label="Vocabulaire" value={score.technique.vocabulaire} animated={barsAnimated} />}
{score?.technique?.completude != null && <StatBar label="Complétude" value={score.technique.completude} animated={barsAnimated} />}
</div>
{!isPremium && (
<div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, cursor: "pointer" }} onClick={onUnlockPremium}>
<div style={{ fontSize: 18 }}>🔒</div>
<div style={{ fontSize: 9, color: "#fff", fontWeight: 600, letterSpacing: 0.5 }}>PREMIUM</div>
</div>
)}
</div>
</div>
)}

{tab === 3 && (
<div style={{ height: "100%", padding: "16px 14px", boxSizing: "border-box", position: "relative" }}>
<div style={{ display: "flex", flexDirection: "row", gap: 16, height: "100%", filter: !isPremium ? "blur(4px)" : "none", pointerEvents: !isPremium ? "none" : "auto" }}>
<div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
<div style={{ fontSize: 9, color: "#555", letterSpacing: 1.5, marginBottom: 6, textAlign: "center" }}>QUALITÉ</div>
<div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
{optScore?.qualite?.clarte != null && <StatBar label="Clarté" value={optScore.qualite.clarte} animated={barsOptAnimated && isPremium} />}
{optScore?.qualite?.precision != null && <StatBar label="Précision" value={optScore.qualite.precision} animated={barsOptAnimated && isPremium} />}
{optScore?.qualite?.richesse != null && <StatBar label="Richesse" value={optScore.qualite.richesse} animated={barsOptAnimated && isPremium} />}
{optScore?.qualite?.originalite != null && <StatBar label="Originalité" value={optScore.qualite.originalite} animated={barsOptAnimated && isPremium} />}
{optScore?.qualite?.coherence != null && <StatBar label="Cohérence" value={optScore.qualite.coherence} animated={barsOptAnimated && isPremium} />}
</div>
</div>
<div style={{ width: 1, background: "#1a1a1a" }} />
<div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
<div style={{ fontSize: 9, color: "#555", letterSpacing: 1.5, marginBottom: 6, textAlign: "center" }}>TECHNIQUE</div>
<div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
{optScore?.technique?.structure != null && <StatBar label="Structure" value={optScore.technique.structure} animated={barsOptAnimated && isPremium} />}
{optScore?.technique?.syntaxe_ia != null && <StatBar label="Syntaxe IA" value={optScore.technique.syntaxe_ia} animated={barsOptAnimated && isPremium} />}
{optScore?.technique?.parametres != null && <StatBar label="Paramètres" value={optScore.technique.parametres} animated={barsOptAnimated && isPremium} />}
{optScore?.technique?.vocabulaire != null && <StatBar label="Vocabulaire" value={optScore.technique.vocabulaire} animated={barsOptAnimated && isPremium} />}
{optScore?.technique?.completude != null && <StatBar label="Complétude" value={optScore.technique.completude} animated={barsOptAnimated && isPremium} />}
</div>
</div>
</div>
{!isPremium && (
<div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer" }} onClick={onUnlockPremium}>
<div style={{ fontSize: 24 }}>🔒</div>
<div style={{ fontSize: 11, color: "#fff", fontWeight: 600, letterSpacing: 1 }}>PREMIUM</div>
<div style={{ fontSize: 11, color: "#555" }}>Débloquer l'analyse IA-to-IA</div>
</div>
)}
</div>
)}
</div>

<div style={{ display: "flex", justifyContent: "center", gap: 6, padding: "10px 0 14px" }}>
{TABS.map((_, i) => (
<div key={i} onClick={() => goTo(i, i > tab ? 1 : -1)}
style={{ width: tab === i ? 16 : 6, height: 6, borderRadius: 100, background: tab === i ? "#fff" : "#333", transition: "all 0.3s", cursor: "pointer" }} />
))}
</div>
</div>
);
};

const PremiumModal = ({ isPremium, onClose, onUnlock }) => {
const [codeInput, setCodeInput] = useState("");
const [codeError, setCodeError] = useState(false);
const [showCode, setShowCode] = useState(false);

const tryUnlock = () => {
if (codeInput === PREMIUM_CODE) { onUnlock(); onClose(); }
else setCodeError(true);
};

if (isPremium) {
return (
<div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 24 }}>
<div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 20, padding: 32, width: "100%", maxWidth: 400 }}>
<div style={{ textAlign: "center", marginBottom: 24 }}>
<div style={{ fontSize: 28, marginBottom: 8 }}>⚡</div>
<div style={{ fontSize: 18, fontWeight: 700 }}>Tu es Premium</div>
<div style={{ fontSize: 13, color: "#666", marginTop: 6 }}>Toutes les fonctionnalités sont débloquées.</div>
</div>
<div style={{ background: "#111", borderRadius: 12, padding: "16px", marginBottom: 20 }}>
<div style={{ fontSize: 12, color: "#aaa", marginBottom: 8 }}>Inclus dans ton abonnement :</div>
{["Générations illimitées", "Prompt IA-to-IA", "Améliorations illimitées", "Analyse complète des critères"].map((f, i) => (
<div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
<div style={{ color: "#4ade80", fontSize: 12 }}>✓</div>
<div style={{ fontSize: 13, color: "#ccc" }}>{f}</div>
</div>
))}
</div>
<button onClick={onClose} style={{ width: "100%", padding: "14px", background: "#fff", color: "#000", border: "none", borderRadius: 100, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
Fermer
</button>
</div>
</div>
);
}

return (
<div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20, overflowY: "auto" }}>
<div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 20, padding: 28, width: "100%", maxWidth: 420 }}>
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
<div style={{ fontSize: 18, fontWeight: 700 }}>Passer Premium</div>
<button onClick={onClose} style={{ background: "transparent", border: "none", color: "#555", fontSize: 20, cursor: "pointer", fontFamily: "inherit" }}>×</button>
</div>

<div style={{ border: "1px solid #1a1a1a", borderRadius: 14, padding: "16px", marginBottom: 12 }}>
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
<div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Gratuit</div>
<div style={{ fontSize: 16, fontWeight: 700, color: "#aaa" }}>0€</div>
</div>
{["5 générations par jour", "Prompt standard uniquement", "Score et analyse de base"].map((f, i) => (
<div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
<div style={{ color: "#444", fontSize: 11 }}>—</div>
<div style={{ fontSize: 12, color: "#555" }}>{f}</div>
</div>
))}
</div>

<div style={{ border: "1px solid #333", borderRadius: 14, padding: "16px", marginBottom: 12 }}>
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
<div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Standard</div>
<div>
<span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>4,99€</span>
<span style={{ fontSize: 11, color: "#555" }}> /mois</span>
</div>
</div>
{["Générations illimitées", "Prompt IA-to-IA débloqué", "Améliorations illimitées", "Analyse complète 10 critères"].map((f, i) => (
<div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
<div style={{ color: "#4ade80", fontSize: 11 }}>✓</div>
<div style={{ fontSize: 12, color: "#ccc" }}>{f}</div>
</div>
))}
<button style={{ width: "100%", marginTop: 12, padding: "12px", background: "#fff", color: "#000", border: "none", borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: "not-allowed", fontFamily: "inherit", opacity: 0.5 }}>
Bientôt disponible
</button>
</div>

<div style={{ border: "1px solid #4ade80", borderRadius: 14, padding: "16px", marginBottom: 20, position: "relative" }}>
<div style={{ position: "absolute", top: -10, right: 16, background: "#4ade80", color: "#000", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 100, letterSpacing: 1 }}>MEILLEURE OFFRE</div>
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
<div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Pro</div>
<div>
<span style={{ fontSize: 18, fontWeight: 800, color: "#4ade80" }}>11,99€</span>
<span style={{ fontSize: 11, color: "#555" }}> /mois</span>
</div>
</div>
{["Tout du Standard", "Fonctionnalités futures en priorité", "Support prioritaire", "Accès bêta aux nouvelles IA"].map((f, i) => (
<div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
<div style={{ color: "#4ade80", fontSize: 11 }}>✓</div>
<div style={{ fontSize: 12, color: "#ccc" }}>{f}</div>
</div>
))}
<button style={{ width: "100%", marginTop: 12, padding: "12px", background: "#4ade80", color: "#000", border: "none", borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: "not-allowed", fontFamily: "inherit", opacity: 0.5 }}>
Bientôt disponible
</button>
</div>

<div style={{ borderTop: "1px solid #111", paddingTop: 16 }}>
<button onClick={() => setShowCode(!showCode)}
style={{ background: "transparent", border: "none", color: "#444", fontSize: 11, cursor: "pointer", fontFamily: "inherit", width: "100%", textAlign: "center" }}>
{showCode ? "Masquer" : "J'ai un code d'accès"}
</button>
{showCode && (
<div style={{ marginTop: 12 }}>
<input value={codeInput} onChange={e => { setCodeInput(e.target.value); setCodeError(false); }}
onKeyDown={e => e.key === "Enter" && tryUnlock()} placeholder="Code d'accès" type="password"
style={{ width: "100%", background: "#000", border: `1px solid ${codeError ? "#ff4444" : "#222"}`, borderRadius: 12, color: "#fff", padding: "12px 16px", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box", marginBottom: 8 }} />
{codeError && <div style={{ fontSize: 12, color: "#ff4444", marginBottom: 8 }}>Code incorrect.</div>}
<button onClick={tryUnlock} style={{ width: "100%", padding: "12px", background: "#222", color: "#fff", border: "none", borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
Activer
</button>
</div>
)}
</div>
</div>
</div>
);
};

export default function App() {
const [goal, setGoal] = useState("");
const [manualAi, setManualAi] = useState("");
const [showManual, setShowManual] = useState(false);
const [phase, setPhase] = useState("idle");
const [parsed, setParsed] = useState(null);
const [loading, setLoading] = useState(false);
const [copied, setCopied] = useState("");
const [showAiLink, setShowAiLink] = useState(false);
const [messages, setMessages] = useState([]);
const [answers, setAnswers] = useState({});
const [isPremium, setIsPremium] = useState(false);
const [activeTab, setActiveTab] = useState("normal");
const [showPremiumModal, setShowPremiumModal] = useState(false);
const [examples, setExamples] = useState(getRandomExamples);
const [freeInput, setFreeInput] = useState("");
const [error, setError] = useState(null);
const [showHistory, setShowHistory] = useState(false);
const [history, setHistory] = useState(() => {
try { return JSON.parse(localStorage.getItem("scripte_history") || "[]"); }
catch { return []; }
});
const [showImprove, setShowImprove] = useState(false);
const [improveNote, setImproveNote] = useState("");
const [improvingLoading, setImprovingLoading] = useState(false);
const [scoreStandard, setScoreStandard] = useState(null);
const [scoreOptimise, setScoreOptimise] = useState(null);
const inputRef = useRef(null);

const isReady = goal.trim().length > 0;
const isOptimisedTab = activeTab === "optimised" && isPremium;

const aiTargets = [
{ id: "chatgpt", label: "ChatGPT" },
{ id: "claude", label: "Claude" },
{ id: "midjourney", label: "Midjourney" },
{ id: "dalle", label: "DALL-E" },
{ id: "runway", label: "Runway" },
{ id: "stablediff", label: "Stable Diffusion" },
{ id: "suno", label: "Suno" },
{ id: "gemini", label: "Gemini" },
];

const saveToHistory = (goalText, promptText, aiId, score) => {
const entry = { id: Date.now(), goal: goalText, prompt: promptText, aiId: aiId || null, aiName: aiId ? AI_NAMES[aiId] : "IA Scripte", score: score?.noteStandard || null, timestamp: Date.now() };
const newHistory = [entry, ...history].slice(0, 50);
setHistory(newHistory);
try { localStorage.setItem("scripte_history", JSON.stringify(newHistory)); } catch {}
};

const callAPI = async (msgs) => {
const res = await fetch("https://scripte-backend-production.up.railway.app/api/generate", {
method: "POST", headers: { "Content-Type": "application/json" },
body: JSON.stringify({ messages: msgs }),
});
const data = await res.json();
return data.content?.map(b => b.text || "").join("") || "Erreur.";
};

const handleGenerate = async () => {
if (!isReady) return;
setLoading(true); setError(null); setAnswers({}); setFreeInput("");
setActiveTab("normal"); setShowAiLink(false); setShowImprove(false); setImproveNote("");
setScoreStandard(null); setScoreOptimise(null);
const iaContext = manualAi ? `IA choisie : ${manualAi}` : `Aucune IA choisie — sélectionne la meilleure selon les règles.`;
const msgs = [{ role: "user", content: `${iaContext}\nObjectif : ${goal}` }];
try {
const text = await callAPI(msgs);
const p = parseOutput(text);
setParsed(p); setMessages(msgs);
if (p.score) setScoreStandard(p.score);
if (p.hasQuestions && p.questions?.length > 0) setPhase("qcm");
else if (p.hasPrompt && p.prompt) { setPhase("result"); saveToHistory(goal, p.prompt, detectAiId(p.reco, manualAi), p.score); }
else { setPhase("idle"); setError("Réponse inattendue — réessaie."); }
} catch (e) { setParsed(null); setPhase("idle"); setError("Erreur réseau — réessaie."); }
setLoading(false);
};

const handleImprove = async () => {
setImprovingLoading(true);
const aiId = detectAiId(parsed?.reco, manualAi);
const aiNameTarget = aiId ? AI_NAMES[aiId] : "l'IA cible";
const promptToImprove = isOptimisedTab ? (parsed?.optimised || parsed?.prompt) : parsed?.prompt;
const scoreActuel = isOptimisedTab
? (scoreOptimise?.noteStandard || scoreStandard?.noteOptimise || scoreStandard?.noteStandard || 0)
: (scoreStandard?.noteStandard || 0);
const directionLine = improveNote.trim() ? `DIRECTION DEMANDÉE : ${improveNote.trim()}` : `DIRECTION : améliore de façon autonome selon les critères de ${aiNameTarget}`;
try {
const text = await callAPI([{ role: "user", content: `Tu es expert en prompt engineering pour ${aiNameTarget}.
OBJECTIF ORIGINAL : ${goal}
SCORE ACTUEL : ${scoreActuel}/100
IA CIBLE : ${aiNameTarget}
TYPE : ${isOptimisedTab ? "Prompt IA-to-IA optimisé" : "Prompt standard"}
${directionLine}
MISSION : Améliore UNIQUEMENT ce prompt. Le nouveau score doit être SUPÉRIEUR à ${scoreActuel}.
PROMPT À AMÉLIORER : ${promptToImprove}
FORMAT STRICT — AUCUN MARKDOWN :
[PROMPT]
Prompt amélioré ici.
[/PROMPT]
[SCORE]
NOTE_STANDARD: (moyenne exacte des 10 critères)
NOTE_OPTIMISE: (10-20 points au dessus, max 97)
CLARTE: (0-100)
PRECISION: (0-100)
RICHESSE: (0-100)
ORIGINALITE: (0-100)
COHERENCE: (0-100)
STRUCTURE: (0-100)
SYNTAXE_IA: (0-100)
PARAMETRES: (0-100)
VOCABULAIRE: (0-100)
COMPLETUDE: (0-100)
CONSEIL_1: (conseil)
CONSEIL_2: (conseil)
CONSEIL_3: (conseil)
[/SCORE]` }]);
const p = parseOutput(text);
if (p.hasPrompt && p.prompt && p.score) {
const newScore = { ...p.score, noteStandard: Math.max(p.score.noteStandard, scoreActuel + 1) };
if (isOptimisedTab) {
setParsed(prev => ({ ...prev, optimised: p.prompt }));
setScoreOptimise(newScore);
} else {
setParsed(prev => ({ ...prev, prompt: p.prompt }));
setScoreStandard(newScore);
}
setShowImprove(false); setImproveNote("");
saveToHistory(goal, p.prompt, aiId, newScore);
}
} catch (e) {}
setImprovingLoading(false);
};

const handleKeyDown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleGenerate(); } };

const handleAnswer = (qIndex, answer) => {
setAnswers(prev => {
if (prev[qIndex] === answer) { const u = { ...prev }; delete u[qIndex]; return u; }
return { ...prev, [qIndex]: answer };
});
};

const handleFreeSubmit = async () => {
setLoading(true); setError(null); setActiveTab("normal"); setShowAiLink(false);
const answered = parsed?.questions ? parsed.questions.map((q, i) => answers[i] ? `${q.question} → ${answers[i]}` : null).filter(Boolean).join("\n") : "";
const extra = freeInput.trim() ? `\nPrécisions : ${freeInput.trim()}` : "";
const content = answered ? `Mes réponses :\n${answered}${extra}\n\nGénère maintenant le prompt parfait.` : `Pas de réponses.${extra}\n\nGénère le prompt avec les informations disponibles.`;
const newMsgs = [...messages, { role: "assistant", content: "Questions posées." }, { role: "user", content }];
try {
const text = await callAPI(newMsgs);
const p = parseOutput(text);
setParsed(p); setMessages(newMsgs);
if (p.score) setScoreStandard(p.score);
if (p.hasPrompt && p.prompt) { setPhase("result"); saveToHistory(goal, p.prompt, detectAiId(p.reco, manualAi), p.score); }
else { setPhase("idle"); setError("Réponse inattendue — réessaie."); }
} catch (e) { setParsed(null); setPhase("idle"); setError("Erreur réseau — réessaie."); }
setLoading(false);
};

const copy = (text, key) => { navigator.clipboard.writeText(text); setCopied(key); setShowAiLink(true); setTimeout(() => setCopied(""), 2000); };

const reset = () => {
setGoal(""); setParsed(null); setCopied(""); setMessages([]); setAnswers({}); setManualAi("");
setShowManual(false); setActiveTab("normal"); setFreeInput(""); setPhase("idle"); setError(null);
setShowAiLink(false); setExamples(getRandomExamples()); setShowImprove(false); setImproveNote("");
setScoreStandard(null); setScoreOptimise(null);
};

const loadFromHistory = (entry) => {
setShowHistory(false);
setParsed({ hasPrompt: true, prompt: entry.prompt, reco: null, questions: null, hasQuestions: false, optimised: null, score: null });
setGoal(entry.goal); setManualAi(entry.aiId || ""); setPhase("result");
setShowAiLink(false); setCopied(""); setShowImprove(false);
setScoreStandard(null); setScoreOptimise(null);
};

const currentPrompt = isOptimisedTab && parsed?.optimised ? parsed.optimised : parsed?.prompt;
const detectedAiId = detectAiId(parsed?.reco, manualAi);
const aiLink = detectedAiId ? AI_LINKS[detectedAiId] : null;
const aiName = detectedAiId ? AI_NAMES[detectedAiId] : null;
const displayScore = scoreStandard || parsed?.score;

return (
<div style={{ minHeight: "-webkit-fill-available", background: "#000", color: "#fff", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif", display: "flex", flexDirection: "column", overflowX: "hidden" }}>

{showHistory && (
<div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex" }}>
<div style={{ width: "min(320px, 85vw)", background: "#0a0a0a", borderRight: "1px solid #1a1a1a", height: "100%", display: "flex", flexDirection: "column", animation: "slideIn 0.25s ease" }}>
<div style={{ padding: "24px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #111" }}>
<div style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>Historique</div>
<button onClick={() => setShowHistory(false)} style={{ background: "transparent", border: "none", color: "#fff", fontSize: 20, cursor: "pointer" }}>×</button>
</div>
<div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
{history.length === 0 ? (
<div style={{ padding: "32px 20px", fontSize: 13, color: "#666", textAlign: "center" }}>Aucun prompt généré.</div>
) : history.map(entry => (
<button key={entry.id} onClick={() => loadFromHistory(entry)}
style={{ width: "100%", padding: "14px 20px", background: "transparent", border: "none", borderBottom: "1px solid #0d0d0d", cursor: "pointer", textAlign: "left", display: "flex", flexDirection: "column", gap: 4 }}
onMouseEnter={e => e.currentTarget.style.background = "#111"}
onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
<div style={{ fontSize: 13, color: "#fff", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{entry.goal}</div>
{entry.score && <div style={{ fontSize: 11, color: getScoreColor(entry.score), fontWeight: 600, marginLeft: 8 }}>{entry.score}</div>}
</div>
<div style={{ display: "flex", justifyContent: "space-between" }}>
<div style={{ fontSize: 11, color: "#888" }}>{entry.aiName}</div>
<div style={{ fontSize: 11, color: "#555" }}>{formatDate(entry.timestamp)}</div>
</div>
</button>
))}
</div>
{history.length > 0 && (
<div style={{ padding: "12px 20px", borderTop: "1px solid #111" }}>
<button onClick={() => { setHistory([]); try { localStorage.removeItem("scripte_history"); } catch {} }}
style={{ background: "transparent", border: "none", color: "#555", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
Effacer l'historique
</button>
</div>
)}
</div>
<div style={{ flex: 1, background: "rgba(0,0,0,0.5)" }} onClick={() => setShowHistory(false)} />
</div>
)}

{showPremiumModal && (
<PremiumModal isPremium={isPremium} onClose={() => setShowPremiumModal(false)} onUnlock={() => setIsPremium(true)} />
)}

<nav style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #0d0d0d" }}>
<button onClick={() => setShowHistory(true)} style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", gap: 5, padding: 4 }}>
<div style={{ width: 22, height: 1.5, background: "#fff", borderRadius: 2 }} />
<div style={{ width: 22, height: 1.5, background: "#fff", borderRadius: 2 }} />
<div style={{ width: 22, height: 1.5, background: "#fff", borderRadius: 2 }} />
</button>
<button onClick={reset} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}>
<div style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.5, color: "#fff" }}>Scripte.ia</div>
</button>
<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
<button onClick={() => setShowPremiumModal(true)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}>
<div style={{ fontSize: 11, color: "#fff", letterSpacing: 1 }}>⚡ PREMIUM</div>
</button>
<div style={{ fontSize: 11, color: "#fff", letterSpacing: 1 }}>L'IA POUR L'IA</div>
</div>
</nav>

<div style={{ flex: 1, display: "flex", flexDirection: "column", maxWidth: 680, width: "100%", margin: "0 auto", padding: "0 20px", boxSizing: "border-box" }}>

{phase === "idle" && (
<>
<div style={{ textAlign: "center", padding: "32px 0 16px" }}>
<h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 800, letterSpacing: -2.5, lineHeight: 1.05, margin: "0 0 8px" }}>
<span style={{ background: "linear-gradient(180deg, #fff 60%, #555)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Un prompt parfait</span><br />
<span style={{ background: "linear-gradient(180deg, #fff 60%, #555)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>pour chaque IA.</span>
</h1>
<p style={{ fontSize: 14, color: "#aaa", margin: 0 }}>Instantanément.</p>
</div>
{error && <div style={{ textAlign: "center", fontSize: 13, color: "#ff4444", marginBottom: 10 }}>{error}</div>}
{loading ? (
<div style={{ textAlign: "center", padding: "10px 0 16px" }}>
<div style={{ fontSize: 11, color: "#aaa", letterSpacing: 3 }}>SCRIPTE.IA ANALYSE</div>
<div style={{ marginTop: 12, display: "flex", justifyContent: "center", gap: 5 }}>
{[0, 1, 2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff", animation: `bounce 1s ${i * 0.2}s infinite` }} />)}
</div>
</div>
) : (
<div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginBottom: 12 }}>
{examples.map((ex, i) => (
<button key={i} onClick={() => { setGoal(ex); inputRef.current?.focus(); }}
style={{ padding: "6px 10px", background: "#080808", border: "1px solid #222", borderRadius: 100, color: "#ccc", fontSize: 11, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}
onMouseEnter={e => { e.currentTarget.style.borderColor = "#555"; e.currentTarget.style.color = "#fff"; }}
onMouseLeave={e => { e.currentTarget.style.borderColor = "#222"; e.currentTarget.style.color = "#ccc"; }}>
{ex}
</button>
))}
</div>
)}
</>
)}

{phase === "qcm" && !loading && parsed?.questions && (
<div style={{ flex: 1, padding: "32px 0" }}>
<div style={{ fontSize: 11, color: "#aaa", letterSpacing: 2, marginBottom: 6 }}>AFFINER LE PROMPT — {Object.keys(answers).length}/{parsed.questions.length}</div>
<div style={{ fontSize: 11, color: "#555", marginBottom: 20 }}>Réponds aux questions ou passe directement à la génération.</div>
{parsed.questions.map((q, i) => (
<div key={i} style={{ marginBottom: 28 }}>
<div style={{ fontSize: 15, color: "#fff", fontWeight: 500, marginBottom: 12 }}>{q.question}</div>
<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
{q.options.map(opt => (
<button key={opt.key} onClick={() => handleAnswer(i, opt.text)}
style={{ padding: "12px 16px", background: answers[i] === opt.text ? "#fff" : "#080808", color: answers[i] === opt.text ? "#000" : answers[i] && answers[i] !== opt.text ? "#333" : "#ccc", border: `1px solid ${answers[i] === opt.text ? "#fff" : "#222"}`, borderRadius: 12, cursor: "pointer", fontFamily: "inherit", fontSize: 13, textAlign: "left", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 12 }}>
<span style={{ fontSize: 11, fontWeight: 600, minWidth: 16, color: answers[i] === opt.text ? "#000" : "#888" }}>{opt.key}</span>
{opt.text}
</button>
))}
</div>
</div>
))}
<div style={{ marginTop: 8 }}>
<div style={{ fontSize: 12, color: "#aaa", marginBottom: 12 }}>Des précisions à ajouter ? (optionnel)</div>
<div style={{ display: "flex", alignItems: "flex-end", gap: 10, background: "#0a0a0a", border: "1px solid #222", borderRadius: 16, padding: "10px 14px", marginBottom: 12 }}>
<textarea value={freeInput} onChange={e => setFreeInput(e.target.value)}
onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleFreeSubmit(); } }}
placeholder="Ex: en noir et blanc, style années 80..." rows={1}
style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: 14, fontFamily: "inherit", outline: "none", resize: "none", lineHeight: 1.5, maxHeight: 80, overflowY: "auto", padding: 0 }}
onInput={e => { e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }} />
</div>
<button onClick={handleFreeSubmit} style={{ width: "100%", padding: "16px", fontSize: 15, fontWeight: 600, background: "#fff", color: "#000", border: "none", borderRadius: 100, cursor: "pointer", fontFamily: "inherit" }}>
Générer le prompt →
</button>
</div>
</div>
)}

{phase === "qcm" && loading && (
<div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
<div style={{ textAlign: "center" }}>
<div style={{ fontSize: 11, color: "#aaa", letterSpacing: 3 }}>SCRIPTE.IA ANALYSE</div>
<div style={{ marginTop: 12, display: "flex", justifyContent: "center", gap: 5 }}>
{[0, 1, 2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff", animation: `bounce 1s ${i * 0.2}s infinite` }} />)}
</div>
</div>
</div>
)}

{phase === "result" && parsed?.prompt && (
<div style={{ flex: 1, padding: "32px 0" }}>
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
<div>
<div style={{ fontSize: 10, color: "#aaa", letterSpacing: 2, marginBottom: 3 }}>PROMPT GÉNÉRÉ</div>
<div style={{ fontSize: 12, color: "#aaa" }}>{manualAi ? AI_NAMES[manualAi] || manualAi.toUpperCase() : "IA CHOISIE PAR SCRIPTE"}</div>
</div>
<button onClick={reset} style={{ background: "transparent", border: "1px solid #333", color: "#fff", padding: "8px 16px", borderRadius: 100, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
Nouveau
</button>
</div>

{displayScore && (
<ScoreCarousel score={displayScore} scoreOpt={scoreOptimise} isPremium={isPremium} onUnlockPremium={() => setShowPremiumModal(true)} reco={parsed.reco} />
)}

<div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
<button onClick={() => setActiveTab("normal")}
style={{ padding: "7px 16px", fontSize: 12, fontWeight: 500, background: activeTab === "normal" ? "#fff" : "transparent", color: activeTab === "normal" ? "#000" : "#aaa", border: "1px solid #222", borderRadius: 100, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
Prompt standard
</button>
<button onClick={() => isPremium ? setActiveTab("optimised") : setShowPremiumModal(true)}
style={{ padding: "7px 16px", fontSize: 12, fontWeight: 500, background: activeTab === "optimised" ? "#fff" : "transparent", color: activeTab === "optimised" ? "#000" : "#aaa", border: "1px solid #222", borderRadius: 100, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
{isPremium ? "⚡ IA-to-IA" : "🔒 IA-to-IA"}
</button>
</div>

{improvingLoading ? (
<div style={{ textAlign: "center", padding: "40px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
<div style={{ fontSize: 11, color: "#aaa", letterSpacing: 3 }}>AMÉLIORATION EN COURS</div>
<div style={{ display: "flex", justifyContent: "center", gap: 5 }}>
{[0, 1, 2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff", animation: `bounce 1s ${i * 0.2}s infinite` }} />)}
</div>
<div style={{ fontSize: 12, color: "#444" }}>
{isOptimisedTab ? "Optimisation du prompt IA-to-IA..." : "Optimisation du prompt standard..."}
</div>
</div>
) : (
<>
<p style={{ fontSize: 15, color: "#fff", lineHeight: 1.9, whiteSpace: "pre-wrap", margin: "0 0 12px" }}>{currentPrompt}</p>

{showImprove ? (
<div style={{ marginBottom: 12 }}>
<div style={{ fontSize: 12, color: "#aaa", marginBottom: 10 }}>Des précisions pour l'amélioration ? (optionnel)</div>
<div style={{ display: "flex", alignItems: "flex-end", gap: 10, background: "#0a0a0a", border: "1px solid #222", borderRadius: 16, padding: "10px 14px", marginBottom: 12 }}>
<textarea value={improveNote} onChange={e => setImproveNote(e.target.value)}
onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleImprove(); } }}
placeholder="Ex: plus de détails techniques, changer le style..." rows={1}
style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: 14, fontFamily: "inherit", outline: "none", resize: "none", lineHeight: 1.5, maxHeight: 80, overflowY: "auto", padding: 0 }}
onInput={e => { e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }} autoFocus />
</div>
<div style={{ display: "flex", gap: 8 }}>
<button onClick={() => { setShowImprove(false); setImproveNote(""); }}
style={{ flex: 1, padding: "12px", fontSize: 13, background: "transparent", color: "#555", border: "1px solid #222", borderRadius: 100, cursor: "pointer", fontFamily: "inherit" }}>
Annuler
</button>
<button onClick={handleImprove}
style={{ flex: 2, padding: "12px", fontSize: 13, fontWeight: 600, background: "#fff", color: "#000", border: "none", borderRadius: 100, cursor: "pointer", fontFamily: "inherit" }}>
⚡ Améliorer avec Scripte
</button>
</div>
</div>
) : (
<button onClick={() => setShowImprove(true)}
style={{ width: "100%", padding: "12px", fontSize: 13, background: "transparent", color: "#aaa", border: "1px solid #222", borderRadius: 100, cursor: "pointer", fontFamily: "inherit", marginBottom: 10, transition: "all 0.2s" }}
onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#444"; }}
onMouseLeave={e => { e.currentTarget.style.color = "#aaa"; e.currentTarget.style.borderColor = "#222"; }}>
✏️ Améliorer le prompt
</button>
)}

{!showImprove && (
<button onClick={() => copy(currentPrompt, "main")}
style={{ width: "100%", padding: "14px", fontSize: 14, fontWeight: 600, background: copied === "main" ? "#111" : "#fff", color: copied === "main" ? "#fff" : "#000", border: copied === "main" ? "1px solid #333" : "none", borderRadius: 100, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", marginBottom: 12 }}>
{copied === "main" ? "✓ Copié" : "Copier le prompt"}
</button>
)}

{!showImprove && showAiLink && aiLink && (
<a href={aiLink} target="_blank" rel="noopener noreferrer"
style={{ display: "block", textAlign: "center", fontSize: 13, color: "#aaa", textDecoration: "none", padding: "12px", border: "1px solid #222", borderRadius: 100, transition: "all 0.2s", marginBottom: 12 }}
onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#555"; }}
onMouseLeave={e => { e.currentTarget.style.color = "#aaa"; e.currentTarget.style.borderColor = "#222"; }}>
Ouvrir {aiName} pour coller ton prompt →
</a>
)}

<button onClick={reset}
style={{ width: "100%", padding: "14px", fontSize: 14, fontWeight: 600, background: "transparent", color: "#555", border: "1px solid #1a1a1a", borderRadius: 100, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", marginBottom: 32 }}
onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#333"; }}
onMouseLeave={e => { e.currentTarget.style.color = "#555"; e.currentTarget.style.borderColor = "#1a1a1a"; }}>
Nouveau prompt
</button>
</>
)}
</div>
)}

{phase === "idle" && (
<div style={{ borderTop: "1px solid #0d0d0d", padding: "10px 0 calc(16px + env(safe-area-inset-bottom))", marginTop: "auto" }}>
{showManual && (
<div style={{ marginBottom: 10 }}>
<div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
{aiTargets.map(a => (
<button key={a.id} onClick={() => setManualAi(manualAi === a.id ? "" : a.id)}
style={{ padding: "6px 12px", background: manualAi === a.id ? "#fff" : "#080808", color: manualAi === a.id ? "#000" : "#ccc", border: `1px solid ${manualAi === a.id ? "#fff" : "#222"}`, borderRadius: 100, cursor: "pointer", fontFamily: "inherit", fontSize: 11, transition: "all 0.15s" }}>
{a.label}
</button>
))}
</div>
</div>
)}
<div style={{ display: "flex", alignItems: "flex-end", gap: 10, background: "#0a0a0a", border: "1px solid #222", borderRadius: 18, padding: "10px 14px" }}>
<textarea ref={inputRef} value={goal} onChange={e => setGoal(e.target.value)} onKeyDown={handleKeyDown}
placeholder="Décris ce que tu veux obtenir..." rows={1}
style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: 15, fontFamily: "inherit", outline: "none", resize: "none", lineHeight: 1.5, maxHeight: 120, overflowY: "auto", padding: 0 }}
onInput={e => { e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }} />
<button onClick={handleGenerate} disabled={!isReady || loading}
style={{ width: 36, height: 36, borderRadius: "50%", background: isReady ? "#fff" : "#1a1a1a", border: "none", cursor: isReady ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
<span style={{ fontSize: 14, color: isReady ? "#000" : "#444" }}>↑</span>
</button>
</div>
<div style={{ textAlign: "center", marginTop: 8 }}>
<button onClick={() => setShowManual(!showManual)}
style={{ background: "transparent", border: "none", color: "#aaa", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
{showManual ? "Masquer" : "Choisir l'IA moi-même"}
</button>
</div>
</div>
)}
</div>

<style>{`
* { -webkit-font-smoothing: antialiased; }
html, body { height: -webkit-fill-available; }
::placeholder { color: #444; }
@keyframes bounce {
0%, 100% { transform: translateY(0); opacity: 0.4; }
50% { transform: translateY(-6px); opacity: 1; }
}
@keyframes slideIn {
from { transform: translateX(-100%); }
to { transform: translateX(0); }
}
`}</style>
</div>
);
}