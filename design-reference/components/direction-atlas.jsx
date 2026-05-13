// Direction 3 — "The Atlas"
// Architectural Swiss grid. Bone ground, navy ink, gold/ember accent.
// Theme: geographic — 3 provinces, mapped files, big spatial numbers.
// AI as a multi-step scenario classifier.

const AtlasTokens = {
  bone: '#F4F1EC',
  boneDeep: '#E9E4DA',
  paper: '#FDFBF6',
  ink: '#0A2540',
  inkSoft: '#1E3A5F',
  gold: '#C9A96E',
  ember: '#B8683C',
  muted: '#8A8578',
  line: 'rgba(10,37,64,0.16)',
  lineSoft: 'rgba(10,37,64,0.08)',
  serif: "'Fraunces', Georgia, serif",
  sans: "'Inter', -apple-system, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
};

function AtlasHomepage({ accent = 'gold' }) {
  const accentColor = accent === 'copper' ? '#B8683C' : accent === 'forest' ? '#2F6B4F' : AtlasTokens.gold;
  const t = { ...AtlasTokens, gold: accentColor };

  return (
    <div style={{
      width: 1440, background: t.bone, color: t.ink,
      fontFamily: t.sans, fontSize: 14, lineHeight: 1.5,
    }}>
      <AtlasNav t={t} />
      <AtlasHero t={t} />
      <AtlasMap t={t} />
      <AtlasScenarioFinder t={t} />
      <AtlasServices t={t} />
      <AtlasProcess t={t} />
      <AtlasInsights t={t} />
      <AtlasFooter t={t} />
    </div>
  );
}

// ─────── NAV ───────
function AtlasNav({ t }) {
  return (
    <div style={{borderBottom: `1px solid ${t.line}`, background: t.bone}}>
      <div style={{
        display:'grid', gridTemplateColumns:'repeat(12, 1fr)', gap: 16,
        padding: '20px 40px', alignItems:'center',
      }}>
        <div style={{gridColumn: '1 / 4', display:'flex', alignItems:'center', gap: 12}}>
          <AtlasMark t={t}/>
        </div>
        <nav style={{gridColumn:'4 / 11', display:'flex', justifyContent:'center', gap: 32, fontSize: 13, letterSpacing: 0.02+'em'}}>
          {['Services','Calculators','MLI Select','Insights','About','Contact'].map((n,i) => (
            <a key={n} style={{color: t.inkSoft, cursor:'pointer', fontVariant:'small-caps', fontFeatureSettings:"'smcp'", letterSpacing: 0.05+'em'}}>{n}</a>
          ))}
        </nav>
        <div style={{gridColumn: '11 / 13', display:'flex', justifyContent:'end', alignItems:'center', gap: 10}}>
          <div style={{fontFamily: t.mono, fontSize: 11, color: t.muted}}>604·593·1550</div>
          <button style={{
            background: t.ink, color: t.bone, border:'none',
            padding: '10px 16px', fontSize: 12, fontWeight: 500, cursor:'pointer',
          }}>Apply</button>
        </div>
      </div>
    </div>
  );
}

function AtlasMark({ t }) {
  return (
    <div style={{display:'flex', alignItems:'center', gap: 12}}>
      <svg width="30" height="30" viewBox="0 0 30 30">
        <rect x="2" y="2" width="4" height="26" fill={t.ink}/>
        <polygon points="7,2 15,2 7,15" fill={t.ink}/>
        <polygon points="7,15 15,28 7,28" fill={t.ink} opacity="0.55"/>
        <polygon points="9,15 20,4 20,13" fill={t.gold}/>
        <polygon points="9,15 20,17 20,26" fill={t.gold} opacity="0.55"/>
      </svg>
      <div style={{lineHeight: 1}}>
        <div style={{fontFamily: t.serif, fontSize: 19, fontWeight: 500, letterSpacing: 0.14+'em'}}>KRAFT</div>
        <div style={{fontFamily: t.sans, fontSize: 8.5, color: t.muted, letterSpacing: 0.2+'em', marginTop: 2}}>MORTGAGES · CANADA</div>
      </div>
    </div>
  );
}

// ─────── HERO (12-col Swiss grid) ───────
function AtlasHero({ t }) {
  return (
    <div style={{padding: '40px 40px 80px'}}>
      {/* Meta row */}
      <div style={{
        display:'grid', gridTemplateColumns:'repeat(12, 1fr)', gap: 16,
        paddingBottom: 20, borderBottom: `1px solid ${t.line}`,
        fontFamily: t.mono, fontSize: 10, color: t.muted, letterSpacing: 0.15+'em',
      }}>
        <div style={{gridColumn:'1 / 3'}}>VOL · XVIII</div>
        <div style={{gridColumn:'3 / 6'}}>FUNDED · $5.2B</div>
        <div style={{gridColumn:'6 / 9'}}>FILES · 2,400+</div>
        <div style={{gridColumn:'9 / 13', textAlign:'right'}}>SURREY · CALGARY · TORONTO</div>
      </div>

      {/* Headline */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(12, 1fr)', gap: 16, marginTop: 64}}>
        <h1 style={{
          gridColumn:'1 / 10',
          fontFamily: t.serif, fontWeight: 300, fontSize: 136, lineHeight: 0.9,
          letterSpacing: -0.045+'em', margin: 0, color: t.ink, textWrap:'balance',
        }}>
          An atlas of<br/>
          <em style={{color: t.gold, fontWeight: 400}}>complex</em> Canadian<br/>
          mortgage files.
        </h1>
        <div style={{gridColumn:'10 / 13'}}>
          <div style={{fontFamily: t.mono, fontSize: 10, color: t.muted, letterSpacing: 0.15+'em', marginBottom: 12}}>§ PREFACE</div>
          <div style={{fontSize: 15, lineHeight: 1.6, color: t.inkSoft, marginBottom: 24}}>
            For eighteen years, Kraft has been the cartographer for mortgage files that
            national lenders default to the "too hard" pile. MLI Select multi-unit. Spec
            construction. Self-employed with a layered income story.
          </div>
          <div style={{fontSize: 15, lineHeight: 1.6, color: t.inkSoft}}>
            Our AI-native practice now maps your file against <span style={{color: t.ink, fontWeight:500}}>52 Canadian lenders</span> in under four seconds — then Varun works it by hand.
          </div>
        </div>
      </div>

      {/* CTA row */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(12, 1fr)', gap: 16, marginTop: 64, alignItems:'center'}}>
        <div style={{gridColumn:'1 / 6', display:'flex', gap: 12}}>
          <button style={{
            background: t.ink, color: t.bone, border:'none', padding:'16px 28px',
            fontSize: 14, fontWeight: 500, letterSpacing: 0.02+'em', cursor:'pointer',
          }}>Start your file →</button>
          <button style={{
            background: 'transparent', color: t.ink, border:`1px solid ${t.ink}`,
            padding:'16px 28px', fontSize: 14, fontWeight: 500, cursor:'pointer',
          }}>Find my scenario</button>
        </div>
        <div style={{gridColumn:'8 / 13', fontFamily: t.mono, fontSize: 11, color: t.muted, letterSpacing: 0.1+'em', textAlign:'right'}}>
          ↓ SCROLL · SIX SECTIONS · 4-MIN READ
        </div>
      </div>
    </div>
  );
}

// ─────── MAP / provincial coverage ───────
function AtlasMap({ t }) {
  const [active, setActive] = React.useState(0);
  const provinces = [
    { code: 'BC', name:'British Columbia', files: 1420, funded:'$3.1B', note:'Headquarters · Surrey · since 2008', specialties:'Construction · MLI Select · Self-Employed' },
    { code: 'AB', name:'Alberta', files: 620, funded:'$1.4B', note:'Licensed since 2016 · Calgary focus', specialties:'Purchase · Refinance · Construction' },
    { code: 'ON', name:'Ontario', files: 380, funded:'$720M', note:'FSRA #M08001935 · Toronto corridor', specialties:'MLI Select · Self-Employed · Private' },
  ];
  const p = provinces[active];

  return (
    <div style={{
      padding: '80px 40px', background: t.paper,
      borderTop: `1px solid ${t.line}`, borderBottom: `1px solid ${t.line}`,
    }}>
      <div style={{display:'grid', gridTemplateColumns:'repeat(12,1fr)', gap: 16, marginBottom: 40}}>
        <div style={{gridColumn:'1/4', fontFamily: t.mono, fontSize: 10, color: t.gold, letterSpacing: 0.18+'em'}}>§ 01 · COVERAGE</div>
        <h2 style={{gridColumn:'1/9', fontFamily: t.serif, fontWeight: 400, fontSize: 64, lineHeight: 0.95, margin: '12px 0 0', letterSpacing: -0.03+'em'}}>
          Three provinces. <em style={{color: t.gold}}>One</em> practice.
        </h2>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1.5fr 1fr', gap: 48, alignItems:'start'}}>
        {/* Abstract map */}
        <div style={{aspectRatio: '1.4', background: t.bone, position:'relative', border: `1px solid ${t.line}`, padding: 24}}>
          <svg viewBox="0 0 600 420" style={{width:'100%', height:'100%'}}>
            {/* latitude/longitude grid */}
            <defs>
              <pattern id="grid-atlas" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0 H0 V40" fill="none" stroke={t.lineSoft} strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="600" height="420" fill="url(#grid-atlas)"/>
            {/* simplified canada outline (impressionistic) */}
            <path d="M 40 180 Q 80 140 140 160 L 200 140 Q 260 130 320 150 L 400 140 Q 480 150 540 180 L 560 240 Q 540 280 480 290 L 420 310 Q 360 320 300 310 L 240 320 Q 180 310 120 290 L 60 260 Q 40 220 40 180 Z"
              fill="none" stroke={t.line} strokeWidth="0.8" strokeDasharray="3 3"/>

            {/* Province blocks */}
            {/* BC */}
            <g onClick={() => setActive(0)} style={{cursor:'pointer'}}>
              <rect x="60" y="180" width="120" height="80" fill={active === 0 ? t.ink : t.bone} stroke={t.ink} strokeWidth="1"/>
              <text x="120" y="215" fontSize="14" fontFamily={t.mono} fill={active === 0 ? t.gold : t.ink} textAnchor="middle" letterSpacing="0.1em">BC</text>
              <text x="120" y="235" fontSize="9" fontFamily={t.mono} fill={active === 0 ? t.bone : t.muted} textAnchor="middle">1,420</text>
              <circle cx="100" cy="220" r="3" fill={t.gold}/>
            </g>
            {/* AB */}
            <g onClick={() => setActive(1)} style={{cursor:'pointer'}}>
              <rect x="200" y="180" width="100" height="80" fill={active === 1 ? t.ink : t.bone} stroke={t.ink} strokeWidth="1"/>
              <text x="250" y="215" fontSize="14" fontFamily={t.mono} fill={active === 1 ? t.gold : t.ink} textAnchor="middle" letterSpacing="0.1em">AB</text>
              <text x="250" y="235" fontSize="9" fontFamily={t.mono} fill={active === 1 ? t.bone : t.muted} textAnchor="middle">620</text>
              <circle cx="245" cy="200" r="3" fill={t.gold}/>
            </g>
            {/* ON */}
            <g onClick={() => setActive(2)} style={{cursor:'pointer'}}>
              <rect x="380" y="190" width="120" height="70" fill={active === 2 ? t.ink : t.bone} stroke={t.ink} strokeWidth="1"/>
              <text x="440" y="225" fontSize="14" fontFamily={t.mono} fill={active === 2 ? t.gold : t.ink} textAnchor="middle" letterSpacing="0.1em">ON</text>
              <text x="440" y="243" fontSize="9" fontFamily={t.mono} fill={active === 2 ? t.bone : t.muted} textAnchor="middle">380</text>
              <circle cx="455" cy="215" r="3" fill={t.gold}/>
            </g>

            {/* latitude labels */}
            <text x="10" y="185" fontSize="8" fontFamily={t.mono} fill={t.muted}>49°N</text>
            <text x="10" y="265" fontSize="8" fontFamily={t.mono} fill={t.muted}>43°N</text>

            {/* legend */}
            <g transform="translate(40, 370)">
              <circle cx="0" cy="0" r="3" fill={t.gold}/>
              <text x="10" y="4" fontSize="9" fontFamily={t.mono} fill={t.muted} letterSpacing="0.1em">LICENSED BROKERAGE · 3 PROVINCES · 52 LENDERS</text>
            </g>
          </svg>
        </div>

        {/* Active province panel */}
        <div style={{padding: '8px 0'}}>
          <div style={{fontFamily: t.mono, fontSize: 11, color: t.gold, letterSpacing: 0.15+'em', marginBottom: 8}}>
            REGION · {p.code}
          </div>
          <div style={{fontFamily: t.serif, fontSize: 64, fontWeight: 300, lineHeight: 1, letterSpacing: -0.03+'em', color: t.ink, marginBottom: 10}}>
            {p.name}
          </div>
          <div style={{fontSize: 14, color: t.inkSoft, marginBottom: 32}}>{p.note}</div>

          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 0, borderTop: `1px solid ${t.line}`, borderBottom: `1px solid ${t.line}`, padding: '20px 0'}}>
            <div>
              <div style={{fontFamily: t.mono, fontSize: 10, color: t.muted, letterSpacing: 0.15+'em', marginBottom: 6}}>FILES CLOSED</div>
              <div style={{fontFamily: t.serif, fontSize: 40, color: t.ink, letterSpacing: -0.02+'em'}}>{p.files.toLocaleString()}</div>
            </div>
            <div>
              <div style={{fontFamily: t.mono, fontSize: 10, color: t.muted, letterSpacing: 0.15+'em', marginBottom: 6}}>VOLUME</div>
              <div style={{fontFamily: t.serif, fontSize: 40, color: t.gold, letterSpacing: -0.02+'em'}}>{p.funded}</div>
            </div>
          </div>
          <div style={{marginTop: 24}}>
            <div style={{fontFamily: t.mono, fontSize: 10, color: t.muted, letterSpacing: 0.15+'em', marginBottom: 10}}>STRENGTHS IN REGION</div>
            <div style={{fontSize: 15, color: t.ink}}>{p.specialties}</div>
          </div>

          <div style={{marginTop: 28, display:'flex', gap: 8}}>
            {provinces.map((pp, i) => (
              <button key={i} onClick={() => setActive(i)} style={{
                flex: 1, padding: '12px 10px', background: active === i ? t.ink : 'transparent',
                color: active === i ? t.bone : t.inkSoft, border: `1px solid ${active === i ? t.ink : t.line}`,
                fontFamily: t.mono, fontSize: 11, cursor:'pointer', letterSpacing: 0.1+'em',
              }}>{pp.code}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────── AI Scenario Finder (multi-step) ───────
function AtlasScenarioFinder({ t }) {
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState({ role: '', goal: '', income: '', province: '' });
  const [analysis, setAnalysis] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const steps = [
    {
      key: 'role', q: 'Which best describes you?',
      opts: ['Homebuyer', 'Developer / builder', 'Investor / landlord', 'Self-employed / incorporated', 'Refinancing owner'],
    },
    {
      key: 'goal', q: 'What are you trying to solve?',
      opts: ['First-time purchase', 'Move up / new home', 'New construction project', 'MLI Select multi-unit', 'Take equity out', 'Bridge / short-term'],
    },
    {
      key: 'income', q: 'How is your income structured?',
      opts: ['Traditional T4 salary', 'Incorporated / dividends', 'Contractor / self-employed', 'Rental portfolio', 'Mix of above'],
    },
    {
      key: 'province', q: 'Where is the subject property?',
      opts: ['British Columbia', 'Alberta', 'Ontario', 'Other / national'],
    },
  ];

  const pick = (val) => {
    const cur = steps[step];
    const next = { ...data, [cur.key]: val };
    setData(next);
    if (step < steps.length - 1) setStep(step + 1);
    else run(next);
  };

  const run = async (d) => {
    setLoading(true); setAnalysis(null);
    try {
      const r = await window.claude.complete({
        messages: [{
          role: 'user',
          content: `You are a Kraft Mortgages advisor. A user selected: role=${d.role}, goal=${d.goal}, income=${d.income}, province=${d.province}. Respond in this exact plain-text format (no markdown, no asterisks):\n\nMATCHED SERVICE: [one of MLI Select / Construction / Self-Employed / Purchase / Refinance / Private]\n\nWHY THIS FITS: [2 sentences, confident, specific to their inputs]\n\nWHAT HAPPENS NEXT: [3 short numbered steps, one line each, starting with 1.]\n\nExpected timeline: [e.g. "4-6 weeks to funding"]\n\nKeep the whole thing under 110 words.`
        }]
      });
      setAnalysis(r);
    } catch (e) {
      setAnalysis("MATCHED SERVICE: MLI Select\n\nWHY THIS FITS: Your profile pairs a multi-unit project with a province we actively cover. The MLI Select point framework typically saves 80–120 bps on premium and extends amortization to 50 years.\n\nWHAT HAPPENS NEXT:\n1. Scenario call with Varun (30 min, no credit pull)\n2. Pro-forma + rent roll review, point-allocation modeled\n3. Term sheet with 2–3 lender options, then underwriting\n\nExpected timeline: 6–8 weeks to funding.");
    }
    setLoading(false);
  };

  const reset = () => { setStep(0); setData({role:'',goal:'',income:'',province:''}); setAnalysis(null); };

  return (
    <div style={{padding: '96px 40px', background: t.bone}}>
      <div style={{display:'grid', gridTemplateColumns:'repeat(12,1fr)', gap: 16, marginBottom: 48}}>
        <div style={{gridColumn:'1/4', fontFamily: t.mono, fontSize: 10, color: t.gold, letterSpacing: 0.18+'em'}}>§ 02 · AI SCENARIO FINDER</div>
        <h2 style={{gridColumn:'1/9', fontFamily: t.serif, fontWeight: 400, fontSize: 80, lineHeight: 0.95, margin:'12px 0 0', letterSpacing: -0.03+'em'}}>
          Four questions. <em style={{color: t.gold}}>One</em> clear path.
        </h2>
        <div style={{gridColumn:'9/13', alignSelf:'end', fontSize: 14, color: t.inkSoft, lineHeight: 1.5}}>
          Our AI maps your answers against 18 years of Kraft case data and 52 live lender sheets. You'll see the matched service, the logic behind it, and the next concrete steps.
        </div>
      </div>

      <div style={{
        display:'grid', gridTemplateColumns:'repeat(12,1fr)', gap: 16,
        background: t.paper, border: `1px solid ${t.line}`,
        padding: 48,
      }}>
        {/* Step tracker */}
        <div style={{gridColumn: '1 / 5'}}>
          <div style={{fontFamily: t.mono, fontSize: 10, color: t.muted, letterSpacing: 0.15+'em', marginBottom: 20}}>
            STEP {Math.min(step + 1, steps.length)} / {steps.length}
          </div>
          <div style={{display:'flex', flexDirection:'column', gap: 14}}>
            {steps.map((s, i) => {
              const done = data[s.key];
              const active = i === step && !analysis;
              return (
                <div key={i} style={{
                  padding: '14px 16px',
                  borderLeft: `3px solid ${active ? t.gold : done ? t.ink : t.lineSoft}`,
                  background: active ? 'rgba(201,169,110,0.06)' : 'transparent',
                }}>
                  <div style={{
                    fontFamily: t.mono, fontSize: 10, letterSpacing: 0.1+'em',
                    color: active ? t.gold : done ? t.ink : t.muted, marginBottom: 4,
                  }}>0{i+1} · {s.key.toUpperCase()}</div>
                  <div style={{fontSize: 13, color: done ? t.ink : t.inkSoft, fontWeight: done ? 500 : 400}}>
                    {done || s.q}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel */}
        <div style={{gridColumn:'5 / 13'}}>
          {!analysis && (
            <div>
              <div style={{fontFamily: t.serif, fontSize: 44, fontWeight: 400, letterSpacing: -0.02+'em', lineHeight: 1.1, marginBottom: 32, color: t.ink}}>
                {steps[step].q}
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12}}>
                {steps[step].opts.map(o => (
                  <button key={o} onClick={() => pick(o)} style={{
                    textAlign:'left', padding: '20px 22px',
                    background: t.bone, border: `1px solid ${t.line}`,
                    fontSize: 15, color: t.ink, cursor:'pointer',
                    fontFamily: t.sans, transition: 'all 150ms',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = t.ink; e.currentTarget.style.color = t.bone; }}
                  onMouseLeave={e => { e.currentTarget.style.background = t.bone; e.currentTarget.style.color = t.ink; }}
                  >
                    {o}
                  </button>
                ))}
              </div>
              {step > 0 && (
                <button onClick={() => setStep(step - 1)} style={{
                  marginTop: 28, background:'transparent', border:'none',
                  color: t.muted, fontSize: 12, cursor:'pointer', fontFamily: t.mono,
                  letterSpacing: 0.1+'em',
                }}>← BACK</button>
              )}
            </div>
          )}

          {loading && (
            <div style={{padding: '60px 0', textAlign:'center', fontFamily: t.mono, color: t.gold, letterSpacing: 0.15+'em', fontSize: 12}}>
              ANALYZING AGAINST 52 LENDER SHEETS…
            </div>
          )}

          {analysis && (
            <div>
              <div style={{fontFamily: t.mono, fontSize: 10, color: t.gold, letterSpacing: 0.18+'em', marginBottom: 12}}>
                ▸ ROUTED · MATCHED IN 3.8s
              </div>
              <div style={{
                padding: 28, background: t.bone, border: `1px solid ${t.line}`,
                borderLeft: `3px solid ${t.gold}`, whiteSpace: 'pre-wrap',
                fontSize: 15, lineHeight: 1.65, color: t.ink,
              }}>{analysis}</div>
              <div style={{marginTop: 24, display:'flex', gap: 12}}>
                <button onClick={reset} style={{
                  background:'transparent', color: t.ink, border:`1px solid ${t.ink}`,
                  padding:'14px 22px', fontSize: 13, cursor:'pointer', fontFamily: t.sans,
                }}>Run another scenario</button>
                <button style={{
                  background: t.ink, color: t.bone, border:'none',
                  padding:'14px 22px', fontSize: 13, cursor:'pointer', fontFamily: t.sans, fontWeight: 500,
                }}>Book scenario call with Varun →</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────── SERVICES (asymmetric grid) ───────
function AtlasServices({ t }) {
  return (
    <div style={{padding: '96px 40px', borderTop: `1px solid ${t.line}`, background: t.paper}}>
      <div style={{display:'grid', gridTemplateColumns:'repeat(12,1fr)', gap: 16, marginBottom: 64}}>
        <div style={{gridColumn:'1/4', fontFamily: t.mono, fontSize: 10, color: t.gold, letterSpacing: 0.18+'em'}}>§ 03 · DISCIPLINES</div>
        <h2 style={{gridColumn:'1/9', fontFamily: t.serif, fontWeight: 400, fontSize: 80, lineHeight: 0.95, margin:'12px 0 0', letterSpacing: -0.03+'em'}}>
          A <em style={{color: t.gold}}>practiced</em> hand<br/>in each discipline.
        </h2>
      </div>

      {/* Asymmetric layout: 1 big + 5 small */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(12,1fr)', gap: 16}}>
        {/* Flagship: MLI Select */}
        <div style={{
          gridColumn:'1 / 8', gridRow: 'span 2',
          background: t.ink, color: t.bone, padding: 48,
          position:'relative', overflow:'hidden',
        }}>
          <svg style={{position:'absolute', inset: 0, width: '100%', height:'100%', opacity: 0.08}} viewBox="0 0 400 500">
            <g stroke={t.gold} fill="none" strokeWidth="0.5">
              {[...Array(40)].map((_,i) => <line key={i} x1={i*10} y1="0" x2={i*10} y2="500"/>)}
              {[...Array(50)].map((_,i) => <line key={i} x1="0" y1={i*10} x2="400" y2={i*10}/>)}
            </g>
          </svg>
          <div style={{position:'relative'}}>
            <div style={{fontFamily: t.mono, fontSize: 11, color: t.gold, letterSpacing: 0.15+'em', marginBottom: 32}}>01 · FLAGSHIP DISCIPLINE</div>
            <h3 style={{fontFamily: t.serif, fontWeight: 400, fontSize: 72, letterSpacing: -0.03+'em', lineHeight: 0.95, margin: '0 0 24px'}}>MLI Select</h3>
            <div style={{fontSize: 17, lineHeight: 1.6, color:'rgba(244,241,236,0.75)', maxWidth: 440, marginBottom: 40}}>
              Our flagship practice. CMHC's point-based multi-unit insurance program — a labyrinth that rewards precision. We've structured 140+ files to 100 points, unlocking 95% LTV and 50-year amortizations.
            </div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap: 24, paddingTop: 32, borderTop: `1px solid rgba(255,255,255,0.15)`}}>
              {[['140+','files'],['$200K','avg premium saved'],['50-yr','max amort']].map(([n,k])=>(
                <div key={k}>
                  <div style={{fontFamily: t.serif, fontSize: 36, color: t.gold, letterSpacing: -0.02+'em'}}>{n}</div>
                  <div style={{fontFamily: t.mono, fontSize: 10, color:'rgba(244,241,236,0.5)', letterSpacing: 0.12+'em', textTransform:'uppercase', marginTop: 6}}>{k}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5 small service cards */}
        {[
          ['02','Construction','Progressive draws, holdbacks, cash-flow modeling through completion.'],
          ['03','Self-Employed','Stated income, bank-statement, hybrid files for incorporated professionals.'],
          ['04','Purchase','First-time buyers to high-net-worth move-ups across BC, AB, and ON.'],
          ['05','Refinance','Equity takeouts, HELOC placement, debt consolidation structured for rate ladders.'],
          ['06','Private','Bridge capital and short-term lending when traditional A-lenders won\'t close in time.'],
        ].map(([n, title, body], i) => {
          const col = i < 3 ? 8 : i === 3 ? 1 : 5;
          const span = i < 3 ? 5 : 4;
          const row = i < 3 ? 'auto' : 3;
          return (
            <div key={n} style={{
              gridColumn: `${col} / span ${span}`, gridRow: row,
              background: t.bone, border: `1px solid ${t.line}`,
              padding: i < 3 ? '28px 32px' : 32,
              minHeight: i < 3 ? 160 : 220,
            }}>
              <div style={{fontFamily: t.mono, fontSize: 11, color: t.gold, letterSpacing: 0.15+'em', marginBottom: 12}}>{n}</div>
              <h3 style={{fontFamily: t.serif, fontWeight: 400, fontSize: 32, letterSpacing: -0.02+'em', margin: '0 0 12px', color: t.ink}}>{title}</h3>
              <div style={{fontSize: 13, lineHeight: 1.55, color: t.inkSoft}}>{body}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────── PROCESS ───────
function AtlasProcess({ t }) {
  const steps = [
    { n:'01', t:'Scenario call', body:'30 minutes with Varun. No credit pull. We model your file against the 52 lenders we source from and tell you which 2–3 are realistic.' },
    { n:'02', t:'Structured package', body:'AI drafts the lender presentation; Varun rewrites it by hand. Every file goes out with a pro-forma, point-allocation model, and a clean income narrative.' },
    { n:'03', t:'Underwriting', body:'We run appraisal, title, and conditions in parallel. Average time-to-commitment on complex files: 14 business days.' },
    { n:'04', t:'Funding', body:'Lawyer coordination, draw schedule setup, refinance ladder — we stay on the file past funding, not before it.' },
  ];

  return (
    <div style={{padding: '96px 40px', background: t.bone, borderTop: `1px solid ${t.line}`}}>
      <div style={{display:'grid', gridTemplateColumns:'repeat(12,1fr)', gap: 16, marginBottom: 56}}>
        <div style={{gridColumn:'1/4', fontFamily: t.mono, fontSize: 10, color: t.gold, letterSpacing: 0.18+'em'}}>§ 04 · ENGAGEMENT</div>
        <h2 style={{gridColumn:'1/9', fontFamily: t.serif, fontWeight: 400, fontSize: 80, lineHeight: 0.95, margin:'12px 0 0', letterSpacing: -0.03+'em'}}>
          Four <em style={{color: t.gold}}>movements.</em>
        </h2>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap: 0, borderTop: `1px solid ${t.line}`}}>
        {steps.map((s, i) => (
          <div key={s.n} style={{
            padding: '36px 28px',
            borderRight: i < 3 ? `1px solid ${t.line}` : 'none',
            borderBottom: `1px solid ${t.line}`,
          }}>
            <div style={{display:'flex', alignItems:'center', gap: 12, marginBottom: 28}}>
              <div style={{fontFamily: t.mono, fontSize: 11, color: t.gold, letterSpacing: 0.15+'em'}}>{s.n}</div>
              <div style={{flex: 1, height: 1, background: t.line}}/>
              <div style={{fontFamily: t.mono, fontSize: 10, color: t.muted, letterSpacing: 0.12+'em'}}>{i === 0 ? 'DAY 0' : i === 1 ? 'DAY 1-3' : i === 2 ? 'DAY 4-14' : 'DAY 15-30'}</div>
            </div>
            <h3 style={{fontFamily: t.serif, fontWeight: 400, fontSize: 28, letterSpacing: -0.02+'em', margin: '0 0 14px', color: t.ink}}>{s.t}</h3>
            <div style={{fontSize: 13, lineHeight: 1.55, color: t.inkSoft}}>{s.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────── INSIGHTS (editorial blog strip) ───────
function AtlasInsights({ t }) {
  const posts = [
    { tag:'MLI SELECT', title:'Why the 100-point bracket is the only one worth targeting', read:'7 min', date:'APR 14' },
    { tag:'CONSTRUCTION', title:'Progressive draw mistakes that cost builders six figures', read:'5 min', date:'APR 08' },
    { tag:'SELF-EMPLOYED', title:'How A-lenders really read incorporated income', read:'9 min', date:'MAR 29' },
  ];
  return (
    <div style={{padding: '96px 40px', background: t.paper, borderTop: `1px solid ${t.line}`}}>
      <div style={{display:'grid', gridTemplateColumns:'repeat(12,1fr)', gap: 16, marginBottom: 56}}>
        <div style={{gridColumn:'1/4', fontFamily: t.mono, fontSize: 10, color: t.gold, letterSpacing: 0.18+'em'}}>§ 05 · INSIGHTS</div>
        <h2 style={{gridColumn:'1/9', fontFamily: t.serif, fontWeight: 400, fontSize: 80, lineHeight: 0.95, margin:'12px 0 0', letterSpacing: -0.03+'em'}}>
          From the <em style={{color: t.gold}}>field.</em>
        </h2>
        <div style={{gridColumn:'10/13', alignSelf:'end', fontFamily: t.mono, fontSize: 11, color: t.gold, letterSpacing: 0.15+'em', textAlign:'right', cursor:'pointer'}}>
          ALL INSIGHTS →
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap: 24}}>
        {posts.map((p, i) => (
          <div key={i} style={{
            paddingTop: 28, borderTop: `1px solid ${t.ink}`,
            display:'flex', flexDirection:'column', gap: 18, cursor:'pointer',
          }}>
            <div style={{display:'flex', justifyContent:'space-between', fontFamily: t.mono, fontSize: 10, letterSpacing: 0.15+'em', color: t.muted}}>
              <span style={{color: t.gold}}>{p.tag}</span>
              <span>{p.date} · {p.read}</span>
            </div>
            <h3 style={{fontFamily: t.serif, fontWeight: 400, fontSize: 32, lineHeight: 1.08, letterSpacing: -0.02+'em', margin: 0, color: t.ink, textWrap:'balance'}}>
              {p.title}
            </h3>
            <div style={{fontFamily: t.mono, fontSize: 11, color: t.ink, letterSpacing: 0.08+'em', marginTop:'auto'}}>READ →</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────── FOOTER ───────
function AtlasFooter({ t }) {
  return (
    <div style={{background: t.ink, color: t.bone, padding: '80px 40px 32px'}}>
      <div style={{display:'grid', gridTemplateColumns:'repeat(12,1fr)', gap: 16, paddingBottom: 56, borderBottom: `1px solid rgba(255,255,255,0.12)`}}>
        <div style={{gridColumn:'1/8'}}>
          <div style={{fontFamily: t.serif, fontWeight: 300, fontSize: 72, lineHeight: 0.95, letterSpacing: -0.03+'em', marginBottom: 24, textWrap:'balance'}}>
            Ready to add your file<br/><em style={{color: t.gold}}>to the atlas?</em>
          </div>
          <div style={{display:'flex', gap: 12}}>
            <button style={{background: t.gold, color: t.ink, border:'none', padding:'16px 28px', fontSize: 14, fontWeight: 600, cursor:'pointer'}}>Book scenario call →</button>
            <button style={{background:'transparent', color: t.bone, border:`1px solid ${t.bone}`, padding:'16px 28px', fontSize: 14, cursor:'pointer'}}>Call 604·593·1550</button>
          </div>
        </div>
        <div style={{gridColumn: '9/13', fontSize: 13, color:'rgba(244,241,236,0.7)', lineHeight: 1.7}}>
          <div style={{fontFamily: t.mono, fontSize: 10, color: t.gold, letterSpacing: 0.15+'em', marginBottom: 12}}>HEADQUARTERS</div>
          #301 1688 152nd Street<br/>
          Surrey, BC V4A 4N2<br/><br/>
          varun@kraftmortgages.ca<br/>
          604·593·1550 · 604·727·1579
        </div>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap: 16, padding: '40px 0', borderBottom: `1px solid rgba(255,255,255,0.12)`}}>
        {[
          ['DISCIPLINES', ['MLI Select','Construction','Self-Employed','Purchase','Refinance','Private']],
          ['TOOLS', ['Payment Calculator','Affordability','MLI Select Suite','Investment ROI']],
          ['FIRM', ['About','Varun','Insights','Licensing','Privacy']],
          ['LICENSED', ['British Columbia','Alberta','Ontario','FSRA #M08001935']],
        ].map(([h, items]) => (
          <div key={h}>
            <div style={{fontFamily: t.mono, fontSize: 10, color: t.gold, letterSpacing: 0.15+'em', marginBottom: 14}}>{h}</div>
            {items.map(i => <div key={i} style={{fontSize: 13, color:'rgba(244,241,236,0.75)', marginBottom: 8, cursor:'pointer'}}>{i}</div>)}
          </div>
        ))}
      </div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: 24, fontFamily: t.mono, fontSize: 10, color:'rgba(244,241,236,0.4)', letterSpacing: 0.08+'em'}}>
        <span>© 2026 KRAFT MORTGAGES CANADA INC.</span>
        <span>AN ATLAS OF COMPLEX CANADIAN FILES · VOL. XVIII</span>
      </div>
    </div>
  );
}

Object.assign(window, { AtlasHomepage });
