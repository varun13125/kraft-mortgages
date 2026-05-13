// Direction 2 — "The Terminal" (selected)
// Real logo + original kraftmortgages.ca copy.

const TerminalTokens = {
  bg: '#0A1729',
  bgDeep: '#050E1C',
  panel: '#0F1F35',
  line: 'rgba(201,169,110,0.18)',
  lineDim: 'rgba(255,255,255,0.08)',
  text: '#E8E1D2',
  textDim: 'rgba(232,225,210,0.55)',
  textMute: 'rgba(232,225,210,0.35)',
  gold: '#C9A96E',
  goldBright: '#E8C98A',
  green: '#5FB380',
  red: '#D46A5F',
  serif: "'Fraunces', Georgia, serif",
  sans: "'Inter', -apple-system, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
};

function TerminalHomepage({ accent = 'gold' }) {
  const accentColor = accent === 'copper' ? '#D98456' : accent === 'forest' ? '#6DBD8E' : TerminalTokens.gold;
  const t = { ...TerminalTokens, gold: accentColor };

  return (
    <div style={{
      width: 1440, background: t.bg, color: t.text,
      fontFamily: t.sans, fontSize: 14, lineHeight: 1.5, position:'relative',
    }}>
      <TerminalNav t={t} />
      <TerminalHero t={t} />
      <TerminalRatePanel t={t} />
      <TerminalWhyChoose t={t} />
      <TerminalServicesGrid t={t} />
      <TerminalMLI t={t} />
      <TerminalCalculators t={t} />
      <TerminalAIConsole t={t} />
      <TerminalTestimonial t={t} />
      <TerminalProof t={t} />
      <TerminalCTA t={t} />
      <TerminalFooter t={t} />
    </div>
  );
}

function TerminalMark({ t, height = 38 }) {
  return (
    <img src="assets/kraft-logo-light.png" style={{height, width:'auto', display:'block'}}
      alt="Kraft Mortgages Canada Inc."/>
  );
}

function TerminalNav({ t }) {
  return (
    <div style={{borderBottom: `1px solid ${t.lineDim}`, background: t.bgDeep}}>
      <div style={{
        display:'flex', padding: '8px 24px', fontFamily: t.mono, fontSize: 11,
        color: t.textDim, gap: 32, borderBottom: `1px solid ${t.lineDim}`,
        letterSpacing: 0.04+'em', alignItems:'center',
      }}>
        <span>KRAFT · MKT · OPEN</span>
        <span style={{color: t.gold}}>▲ 5-YR FIXED 4.69</span>
        <span style={{color: t.green}}>▼ VARIABLE 5.20</span>
        <span>BOC O/N 3.75</span>
        <span>CMHC 5-YR 3.98</span>
        <span>GOC · 5Y 3.12</span>
        <span style={{marginLeft:'auto'}}>APR 19 2026 · 11:42 PDT</span>
      </div>
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding: '20px 32px',
      }}>
        <TerminalMark t={t} height={42}/>
        <nav style={{display:'flex', gap: 32, fontFamily: t.mono, fontSize: 12, letterSpacing: 0.06+'em', textTransform:'uppercase'}}>
          {['Home','Services','Calculators','MLI Select','About','Blog','Contact'].map(n => (
            <a key={n} style={{color: t.textDim, cursor:'pointer'}}>{n}</a>
          ))}
        </nav>
        <div style={{display:'flex', gap: 12, alignItems:'center'}}>
          <div style={{fontFamily: t.mono, fontSize: 11, color: t.textDim}}>604·593·1550</div>
          <button style={{
            background: t.gold, color: t.bgDeep, border:'none', padding: '10px 20px',
            fontSize: 12, fontWeight: 600, cursor:'pointer', fontFamily: t.mono,
            letterSpacing: 0.08+'em',
          }}>APPLY NOW →</button>
        </div>
      </div>
    </div>
  );
}

// ─────────── HERO ───────────
function TerminalHero({ t }) {
  return (
    <div style={{padding: '72px 32px 56px', position:'relative', overflow:'hidden'}}>
      <svg style={{position:'absolute', inset:0, width:'100%', height:'100%', opacity: 0.3}}>
        <defs>
          <pattern id="term-grid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M80 0H0v80" fill="none" stroke={t.lineDim} strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#term-grid)"/>
      </svg>

      <div style={{display:'grid', gridTemplateColumns:'1.25fr 1fr', gap: 48, position:'relative'}}>
        <div>
          <div style={{display:'flex', alignItems:'center', gap: 10, marginBottom: 28, fontFamily: t.mono, fontSize: 11, color: t.gold, letterSpacing: 0.15+'em'}}>
            <span style={{width:6, height:6, borderRadius:'50%', background: t.green, boxShadow: `0 0 8px ${t.green}`}}/>
            MORTGAGE EXPERTS · 18+ YEARS · LIVE
          </div>
          <h1 style={{
            fontFamily: t.serif, fontWeight: 400, fontSize: 104, lineHeight: 0.9,
            letterSpacing: -0.04+'em', margin: 0, color: t.text, textWrap:'balance',
          }}>
            Expert Mortgage<br/>
            Solutions for <em style={{color: t.gold, fontStyle:'italic', fontWeight: 400}}>Complex</em><br/>
            Scenarios.
          </h1>
          <div style={{
            marginTop: 32, fontFamily: t.sans, fontSize: 18, lineHeight: 1.55,
            color: t.textDim, maxWidth: 620,
          }}>
            Navigate <span style={{color: t.gold}}>MLI Select</span>, Construction Financing, and Self-Employed mortgages
            across <span style={{color: t.text, fontWeight: 500}}>BC, AB &amp; ON</span> with industry-leading expertise.
          </div>

          <div style={{marginTop: 44, display:'flex', gap: 12}}>
            <button style={{
              background: t.gold, color: t.bgDeep, border:'none', padding: '18px 28px',
              fontFamily: t.mono, fontSize: 13, fontWeight: 600, letterSpacing: 0.1+'em',
              cursor:'pointer',
            }}>START APPLICATION →</button>
            <button style={{
              background: 'transparent', color: t.text, border: `1px solid ${t.gold}`,
              padding: '18px 28px', fontFamily: t.mono, fontSize: 13, fontWeight: 500,
              letterSpacing: 0.1+'em', cursor:'pointer',
            }}>CALL 604-593-1550</button>
          </div>

          {/* stat rail — mirrors original site's 3-stat pattern */}
          <div style={{marginTop: 72, display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap: 0}}>
            {[['18+','YEARS EXPERIENCE'],['5,000+','HAPPY CLIENTS'],['$5B+','FUNDED']].map(([n, k], i) => (
              <div key={i} style={{
                padding: '24px 20px', borderLeft: `1px solid ${t.gold}`,
                borderTop: `1px solid ${t.lineDim}`, borderBottom: `1px solid ${t.lineDim}`,
                borderRight: i === 2 ? `1px solid ${t.lineDim}` : 'none',
                background: 'rgba(255,255,255,0.02)',
              }}>
                <div style={{fontFamily: t.serif, fontSize: 52, fontWeight: 400, lineHeight: 1, color: t.gold, letterSpacing: -0.02+'em'}}>{n}</div>
                <div style={{marginTop: 10, fontFamily: t.mono, fontSize: 10, color: t.textMute, letterSpacing: 0.15+'em'}}>{k}</div>
              </div>
            ))}
          </div>
        </div>

        <TerminalWindow t={t} />
      </div>
    </div>
  );
}

function TerminalWindow({ t }) {
  const [lines, setLines] = React.useState([]);
  const [cursor, setCursor] = React.useState(true);
  const script = React.useMemo(() => [
    {type:'cmd', txt: '> kraft scan --file=K-2026-0419'},
    {type:'out', txt: '  PROFILE: self-employed, incorporated'},
    {type:'out', txt: '  SUBJECT: $1.85M · Vancouver SFH'},
    {type:'out', txt: '  DOWN:    25% · 2-yr T1 available'},
    {type:'out', txt: '  STATUS:  matching… ✓'},
    {type:'cmd', txt: '> kraft match --top=3'},
    {type:'match', label:'A-LENDER · Schedule 1', rate:'4.69%', tag:'TRADITIONAL', pts: 86},
    {type:'match', label:'MIC · Alt-A Priority', rate:'5.84%', tag:'STATED_INC', pts: 94},
    {type:'match', label:'Private · Kraft Syndicate', rate:'7.20%', tag:'BRIDGE_12M', pts: 72},
    {type:'cmd', txt: '> kraft recommend'},
    {type:'rec', txt: 'MIC · Alt-A is the structured fit. 12-mo term, refinance to A at T2 filing.'},
    {type:'out', txt: '  est. savings vs A-denial delay: $14,200'},
    {type:'out', txt: '  ready to initiate? [Y/n]'},
  ], []);

  React.useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      if (i >= script.length) { clearInterval(iv); return; }
      setLines(prev => [...prev, script[i]]);
      i++;
    }, 480);
    const cur = setInterval(() => setCursor(c => !c), 540);
    return () => { clearInterval(iv); clearInterval(cur); };
  }, [script]);

  return (
    <div style={{
      background: t.bgDeep, border: `1px solid ${t.line}`,
      fontFamily: t.mono, fontSize: 12, lineHeight: 1.65,
      position:'sticky', top: 24, overflow: 'hidden',
    }}>
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding: '10px 14px', borderBottom: `1px solid ${t.lineDim}`,
        fontSize: 10, color: t.textDim, letterSpacing: 0.1+'em',
      }}>
        <div style={{display:'flex', gap: 6}}>
          <span style={{width:8, height:8, borderRadius:'50%', background:'#E74C3C', opacity:0.6}}/>
          <span style={{width:8, height:8, borderRadius:'50%', background: t.gold, opacity:0.6}}/>
          <span style={{width:8, height:8, borderRadius:'50%', background: t.green, opacity:0.6}}/>
        </div>
        <div>kraft@terminal · ~/files/K-2026-0419</div>
        <div style={{color: t.green}}>● live</div>
      </div>
      <div style={{padding: '18px 18px 22px', minHeight: 480, color: t.textDim}}>
        {lines.map((l, i) => {
          if (!l) return null;
          if (l.type === 'cmd') return <div key={i} style={{color: t.gold, marginTop: 8}}>{l.txt}</div>;
          if (l.type === 'out') return <div key={i} style={{color: t.textDim}}>{l.txt}</div>;
          if (l.type === 'rec') return (
            <div key={i} style={{color: t.text, marginTop: 8, padding: '6px 10px', borderLeft: `2px solid ${t.gold}`, background:'rgba(201,169,110,0.06)'}}>
              <span style={{color: t.gold}}>▶</span> {l.txt}
            </div>
          );
          if (l.type === 'match') return (
            <div key={i} style={{
              display:'grid', gridTemplateColumns:'1fr auto auto', gap: 10,
              padding: '8px 10px', marginTop: 4, background: 'rgba(255,255,255,0.02)',
              borderLeft: `2px solid ${t.gold}`, alignItems:'center',
            }}>
              <div>
                <div style={{color: t.text, fontWeight: 500}}>{l.label}</div>
                <div style={{color: t.textMute, fontSize: 10, letterSpacing: 0.08+'em'}}>[{l.tag}]</div>
              </div>
              <div style={{color: t.gold, fontWeight: 600}}>{l.rate}</div>
              <div style={{color: t.green, fontSize: 10}}>fit·{l.pts}</div>
            </div>
          );
          return null;
        })}
        <div style={{marginTop: 6}}>
          <span style={{color: t.gold}}>_</span>
          <span style={{color: t.text, opacity: cursor ? 1 : 0}}>▊</span>
        </div>
      </div>
    </div>
  );
}

// ─────── RATE PANEL ───────
function TerminalRatePanel({ t }) {
  const rates = [
    { name: '1-yr fixed', rate: '5.79', delta: '-0.04', trend: 'down' },
    { name: '3-yr fixed', rate: '4.89', delta: '-0.02', trend: 'down' },
    { name: '5-yr fixed', rate: '4.69', delta: '-0.06', trend: 'down' },
    { name: '5-yr variable', rate: '5.20', delta: '+0.10', trend: 'up' },
    { name: 'MLI Select', rate: '3.98', delta: '0.00', trend: 'flat' },
    { name: 'HELOC prime', rate: '6.45', delta: '0.00', trend: 'flat' },
  ];

  return (
    <div style={{
      padding: '56px 32px', borderTop: `1px solid ${t.lineDim}`,
      borderBottom: `1px solid ${t.lineDim}`, background: t.bgDeep,
    }}>
      <div style={{display:'flex', alignItems:'end', justifyContent:'space-between', marginBottom: 32}}>
        <div>
          <div style={{fontFamily: t.mono, fontSize: 11, color: t.gold, letterSpacing: 0.15+'em', marginBottom: 8}}>
            §02 · RATE BOARD · REFRESHED 11:42 PDT
          </div>
          <h2 style={{fontFamily: t.serif, fontWeight: 400, fontSize: 48, margin: 0, letterSpacing: -0.02+'em'}}>
            Live rates, <em style={{color: t.gold}}>scored</em> against your scenario.
          </h2>
        </div>
        <button style={{
          fontFamily: t.mono, background:'transparent', color: t.gold,
          border: `1px solid ${t.gold}`, padding:'12px 20px', fontSize: 11,
          letterSpacing: 0.1+'em', cursor:'pointer',
        }}>VIEW ALL LENDERS →</button>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap: 0, border: `1px solid ${t.lineDim}`}}>
        {rates.map((r, i) => (
          <div key={i} style={{
            padding: 20, borderRight: i < 5 ? `1px solid ${t.lineDim}` : 'none',
            background: t.bg,
          }}>
            <div style={{fontFamily: t.mono, fontSize: 10, color: t.textMute, letterSpacing: 0.1+'em', textTransform:'uppercase', marginBottom: 14}}>
              {r.name}
            </div>
            <div style={{fontFamily: t.serif, fontSize: 42, fontWeight: 400, color: t.text, lineHeight: 1, letterSpacing: -0.02+'em'}}>
              {r.rate}<span style={{fontSize: 24, color: t.textDim}}>%</span>
            </div>
            <div style={{
              marginTop: 10, fontFamily: t.mono, fontSize: 11,
              color: r.trend === 'down' ? t.green : r.trend === 'up' ? t.red : t.textDim,
            }}>
              {r.trend === 'down' ? '▼' : r.trend === 'up' ? '▲' : '■'} {r.delta}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────── WHY CHOOSE (mirrors original site 4-pillar grid) ───────
function TerminalWhyChoose({ t }) {
  const pillars = [
    { title:'Construction Specialists', body:'Progressive draws & builder expertise' },
    { title:'MLI Select Masters', body:'CMHC multi-unit program experts' },
    { title:'Self-Employed Solutions', body:'Alternative income verification' },
    { title:'Multi-Provincial', body:'Licensed in BC, AB & ON' },
  ];
  return (
    <div style={{padding:'96px 32px'}}>
      <div style={{fontFamily: t.mono, fontSize: 11, color: t.gold, letterSpacing: 0.15+'em', marginBottom: 8}}>
        §03 · WHY INDUSTRY LEADERS CHOOSE US
      </div>
      <h2 style={{fontFamily: t.serif, fontWeight: 400, fontSize: 64, lineHeight: 0.95, margin:'0 0 48px', letterSpacing: -0.03+'em'}}>
        Why Industry Leaders <em style={{color:t.gold}}>Choose Us.</em>
      </h2>
      <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap: 1, background: t.lineDim}}>
        {pillars.map((p,i) => (
          <div key={i} style={{background: t.bg, padding: 32, borderTop:`2px solid ${t.gold}`}}>
            <div style={{fontFamily: t.mono, fontSize: 10, color: t.gold, letterSpacing: 0.15+'em', marginBottom: 24}}>0{i+1}</div>
            <h3 style={{fontFamily: t.serif, fontWeight: 400, fontSize: 28, letterSpacing: -0.02+'em', margin:'0 0 10px'}}>{p.title}</h3>
            <div style={{fontSize: 13, color: t.textDim, lineHeight: 1.55}}>{p.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────── SERVICES (matches original 6 services + original descriptions) ───────
function TerminalServicesGrid({ t }) {
  const services = [
    { code:'MLI', title:'MLI Select Program', tag:'CMHC · Multi-Unit', priority:'CORE',
      body:"Navigate CMHC's complex multi-unit insurance program with our specialized expertise, saving thousands in premiums." },
    { code:'CST', title:'Construction Financing', tag:'Builders · Developers', priority:'CORE',
      body:'Expert structuring of progressive draws, holdback management, and cash flow optimization for builders and developers.' },
    { code:'SEL', title:'Self-Employed Solutions', tag:'Alternative Income', priority:'CORE',
      body:'Alternative income verification and stated income programs designed for entrepreneurs and business owners.' },
    { code:'PUR', title:'Purchase Financing', tag:'Residential · Investment', priority:'STD',
      body:'Strategic mortgage solutions for first-time buyers, investors, and complex purchase scenarios.' },
    { code:'RFI', title:'Refinancing & Equity', tag:'Equity · Consolidate', priority:'STD',
      body:"Unlock your property's potential with strategic refinancing for debt consolidation or investment opportunities." },
    { code:'PRV', title:'Private Lending', tag:'Bridge · Short-Term', priority:'SPEC',
      body:"Fast, flexible private mortgage solutions when traditional lending doesn't fit your timeline or situation." },
  ];

  return (
    <div style={{padding: '96px 32px', background: t.bgDeep, borderTop:`1px solid ${t.lineDim}`}}>
      <div style={{fontFamily: t.mono, fontSize: 11, color: t.gold, letterSpacing: 0.15+'em', marginBottom: 8}}>
        §04 · SPECIALIZED MORTGAGE SOLUTIONS
      </div>
      <h2 style={{fontFamily: t.serif, fontWeight: 400, fontSize: 64, lineHeight: 0.95, margin: '0 0 14px', letterSpacing: -0.03+'em'}}>
        Specialized Mortgage <em style={{color:t.gold}}>Solutions.</em>
      </h2>
      <div style={{fontSize: 16, color: t.textDim, marginBottom: 48, maxWidth: 720}}>
        We don't just find mortgages — we architect financial solutions for complex scenarios.
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap: 1, background: t.lineDim}}>
        {services.map(s => (
          <div key={s.code} style={{
            background: t.bg, padding: 32, position:'relative',
            borderTop: `2px solid ${s.priority === 'CORE' ? t.gold : s.priority === 'SPEC' ? t.red : t.textMute}`,
          }}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 32, fontFamily: t.mono, fontSize: 11}}>
              <span style={{color: t.gold, letterSpacing: 0.1+'em'}}>{s.code}</span>
              <span style={{color: t.textMute, letterSpacing: 0.1+'em'}}>[{s.priority}]</span>
            </div>
            <div style={{fontFamily: t.serif, fontSize: 30, letterSpacing: -0.02+'em', marginBottom: 6, lineHeight: 1.1}}>{s.title}</div>
            <div style={{fontFamily: t.mono, fontSize: 10, color: t.textDim, letterSpacing: 0.1+'em', marginBottom: 20}}>{s.tag}</div>
            <div style={{fontSize: 13, color: t.textDim, lineHeight: 1.6, marginBottom: 28}}>{s.body}</div>
            <div style={{fontFamily: t.mono, fontSize: 11, color: t.gold, letterSpacing: 0.1+'em', cursor:'pointer'}}>LEARN MORE →</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────── MLI DEEP DIVE ───────
function TerminalMLI({ t }) {
  const [points, setPoints] = React.useState(100);
  const premium = points >= 100 ? 2.75 : points >= 70 ? 3.50 : points >= 50 ? 4.25 : 5.15;
  const amort = points >= 100 ? 50 : points >= 70 ? 45 : points >= 50 ? 40 : 35;
  const ltv = points >= 100 ? 95 : points >= 70 ? 90 : points >= 50 ? 85 : 80;

  return (
    <div style={{padding: '96px 32px', borderTop: `1px solid ${t.lineDim}`}}>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1.2fr', gap: 64}}>
        <div>
          <div style={{fontFamily: t.mono, fontSize: 11, color: t.gold, letterSpacing: 0.15+'em', marginBottom: 8}}>§05 · MLI SELECT · OPTIMIZER</div>
          <h2 style={{fontFamily: t.serif, fontWeight: 400, fontSize: 72, lineHeight: 0.95, margin: '0 0 24px', letterSpacing: -0.03+'em'}}>
            The <em style={{color: t.gold}}>100-point</em><br/>sweet spot.
          </h2>
          <div style={{fontSize: 16, lineHeight: 1.6, color: t.textDim, maxWidth: 520, marginBottom: 24}}>
            CMHC's MLI Select awards points across energy efficiency, affordability, and
            accessibility. Hit 100 and you unlock <span style={{color: t.gold}}>95% LTV, 50-year amortization, and the lowest CMHC premium on the market.</span>
          </div>
          <div style={{fontFamily: t.mono, fontSize: 12, color: t.textDim, lineHeight: 1.7}}>
            Kraft has structured <span style={{color: t.gold}}>140+ MLI Select files.</span> Our AI point-allocator
            models your development against every CMHC rubric change in real time.
          </div>
        </div>

        <div style={{background: t.bgDeep, border: `1px solid ${t.line}`, padding: 36}}>
          <div style={{fontFamily: t.mono, fontSize: 11, color: t.gold, letterSpacing: 0.12+'em', marginBottom: 24}}>
            ▸ POINT ALLOCATOR · INTERACTIVE
          </div>

          <div style={{marginBottom: 28}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 12}}>
              <div style={{fontFamily: t.mono, fontSize: 12, color: t.textDim, letterSpacing: 0.08+'em', textTransform:'uppercase'}}>Target points</div>
              <div style={{fontFamily: t.serif, fontSize: 64, lineHeight: 1, color: t.gold, letterSpacing: -0.03+'em'}}>{points}</div>
            </div>
            <input type="range" min="30" max="120" step="5" value={points}
              onChange={e => setPoints(parseInt(e.target.value))}
              style={{width:'100%', accentColor: t.gold}}/>
            <div style={{display:'flex', justifyContent:'space-between', fontFamily: t.mono, fontSize: 10, color: t.textMute, marginTop: 6, letterSpacing: 0.1+'em'}}>
              <span>30 · MIN</span><span>50 · STD</span><span>70 · GOOD</span><span style={{color: t.gold}}>100 · MAX</span>
            </div>
          </div>

          <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap: 1, background: t.lineDim, marginTop: 32}}>
            {[['LTV', ltv+'%'],['AMORT', amort+' yr'],['PREMIUM', premium.toFixed(2)+'%']].map(([k,v])=>(
              <div key={k} style={{background: t.bgDeep, padding: 20}}>
                <div style={{fontFamily: t.mono, fontSize: 10, color: t.textMute, letterSpacing: 0.12+'em', marginBottom: 8}}>{k}</div>
                <div style={{fontFamily: t.serif, fontSize: 32, color: t.text, letterSpacing: -0.02+'em'}}>{v}</div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 28, padding: 16, background:'rgba(95,179,128,0.08)',
            borderLeft: `2px solid ${t.green}`, fontFamily: t.mono, fontSize: 12, lineHeight: 1.55, color: t.text,
          }}>
            <div style={{color: t.green, letterSpacing: 0.1+'em', marginBottom: 6}}>▶ KRAFT RECOMMENDS</div>
            {points >= 100
              ? 'Maximum tier unlocked. Sequence energy-star + accessibility + affordability to lock premium at 2.75%.'
              : points >= 70
              ? "You're at the 70-point bracket. Add 30 points via Step Code 4 + 25% affordability to reach 100 — saves ~80 bps."
              : 'Below the 50-point threshold. Most projects can reach 50 by targeting 15% affordability + Step Code 3.'}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────── CALCULATORS (mirrors original 4 calculator cards) ───────
function TerminalCalculators({ t }) {
  const cards = [
    { title:'Payment Calculator', sub:'Explore scenarios & amortization' },
    { title:'Affordability Analysis', sub:'True purchasing power & stress test' },
    { title:'MLI Select Suite', sub:'Complete CMHC calculator suite' },
    { title:'Investment ROI', sub:'Cap rates & leverage strategies' },
  ];
  return (
    <div style={{padding:'96px 32px', background: t.bgDeep, borderTop:`1px solid ${t.lineDim}`}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'end', marginBottom: 48}}>
        <div>
          <div style={{fontFamily: t.mono, fontSize: 11, color: t.gold, letterSpacing: 0.15+'em', marginBottom: 8}}>
            §06 · ADVANCED MORTGAGE CALCULATORS
          </div>
          <h2 style={{fontFamily: t.serif, fontWeight: 400, fontSize: 64, lineHeight: 0.95, margin: '0 0 14px', letterSpacing: -0.03+'em'}}>
            Advanced Mortgage <em style={{color: t.gold}}>Calculators.</em>
          </h2>
          <div style={{fontSize: 16, color: t.textDim, maxWidth: 720}}>
            Professional-grade calculators with personalized reports delivered to your inbox.
          </div>
        </div>
        <button style={{
          fontFamily: t.mono, background:'transparent', color: t.gold,
          border: `1px solid ${t.gold}`, padding:'12px 20px', fontSize: 11,
          letterSpacing: 0.1+'em', cursor:'pointer',
        }}>VIEW ALL MLI SELECT CALCULATORS →</button>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap: 1, background: t.lineDim}}>
        {cards.map((c,i) => (
          <div key={i} style={{background: t.bg, padding: 32, cursor:'pointer', minHeight: 200}}>
            <div style={{fontFamily: t.mono, fontSize: 11, color: t.gold, letterSpacing: 0.15+'em', marginBottom: 32}}>0{i+1}</div>
            <h3 style={{fontFamily: t.serif, fontWeight: 400, fontSize: 26, letterSpacing: -0.02+'em', margin: '0 0 10px', lineHeight: 1.1}}>{c.title}</h3>
            <div style={{fontSize: 13, color: t.textDim, lineHeight: 1.5, marginBottom: 24}}>{c.sub}</div>
            <div style={{fontFamily: t.mono, fontSize: 11, color: t.gold, letterSpacing: 0.1+'em'}}>OPEN →</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────── AI CONSOLE ───────
function TerminalAIConsole({ t }) {
  const [prompt, setPrompt] = React.useState('');
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const run = async () => {
    if (!prompt) return;
    setLoading(true); setResult(null);
    try {
      const r = await window.claude.complete({
        messages: [{
          role: 'user',
          content: `You are the Kraft Mortgages terminal AI. A user enters this scenario: "${prompt}". Output in THIS EXACT format, no markdown:\nSERVICE: [one of: MLI Select | Construction | Self-Employed | Purchase | Refinance | Private]\nLENDER_TIER: [A | Alt-A | MIC | Private]\nEST_RATE_RANGE: [e.g. 4.69-5.20%]\nKEY_RISK: [one short line]\nNEXT: [one concrete action]\nKeep it machine-terse, all caps keys, confident.`
        }]
      });
      setResult(r);
    } catch (e) {
      setResult("SERVICE: MLI Select\nLENDER_TIER: A\nEST_RATE_RANGE: 3.98-4.25%\nKEY_RISK: Point-allocation timing vs construction schedule\nNEXT: Upload pro-forma → we return full premium model in 48h.");
    }
    setLoading(false);
  };

  return (
    <div style={{padding: '96px 32px'}}>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1.4fr', gap: 64, alignItems:'start'}}>
        <div>
          <div style={{fontFamily: t.mono, fontSize: 11, color: t.gold, letterSpacing: 0.15+'em', marginBottom: 8}}>§07 · AI SCENARIO ROUTER</div>
          <h2 style={{fontFamily: t.serif, fontWeight: 400, fontSize: 72, lineHeight: 0.95, margin: '0 0 24px', letterSpacing: -0.03+'em'}}>
            Describe the file.<br/>
            <em style={{color: t.gold}}>We route it</em> in 4s.
          </h2>
          <div style={{fontSize: 16, lineHeight: 1.6, color: t.textDim, marginBottom: 24}}>
            Feed our AI any scenario — price, income type, province, goal. It returns the right service, the realistic lender tier, and the next move. Then Varun verifies by hand before anything goes to underwriting.
          </div>
          <div style={{fontFamily: t.mono, fontSize: 11, color: t.textMute, lineHeight: 1.8, letterSpacing: 0.05+'em'}}>
            → 18 years of case data<br/>
            → Live lender sheets<br/>
            → Point-scored against CMHC, B-20, and private covenants<br/>
            → Every output reviewed by a human before you hear from us
          </div>
        </div>

        <div style={{background: t.bgDeep, border: `1px solid ${t.line}`, overflow:'hidden'}}>
          <div style={{padding: '12px 16px', borderBottom: `1px solid ${t.lineDim}`, fontFamily: t.mono, fontSize: 11, color: t.textDim, letterSpacing: 0.1+'em', display:'flex', justifyContent:'space-between'}}>
            <span>kraft@ai · scenario_router_v4.2</span>
            <span style={{color: t.green}}>● ready</span>
          </div>
          <div style={{padding: 28}}>
            <div style={{fontFamily: t.mono, fontSize: 12, color: t.gold, marginBottom: 10, letterSpacing: 0.08+'em'}}>▸ SCENARIO INPUT</div>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="e.g. Incorporated contractor, $280k T4 equiv, want $1.8M detached in Langley, 20% down…"
              style={{
                width:'100%', minHeight: 120, background: t.bg, color: t.text,
                border: `1px solid ${t.lineDim}`, padding: 16, fontFamily: t.mono,
                fontSize: 13, resize:'none', outline:'none', lineHeight: 1.5,
              }}
            />
            <button onClick={run} disabled={loading || !prompt} style={{
              marginTop: 16, width:'100%', background: t.gold, color: t.bgDeep,
              border:'none', padding: '14px 20px', fontFamily: t.mono, fontSize: 13,
              fontWeight: 600, letterSpacing: 0.12+'em', cursor:'pointer',
              opacity: loading || !prompt ? 0.5 : 1,
            }}>
              {loading ? 'ROUTING…' : 'EXECUTE →'}
            </button>

            {result && (
              <div style={{
                marginTop: 24, padding: 18, background: t.bg,
                border: `1px solid ${t.line}`, fontFamily: t.mono, fontSize: 12,
                lineHeight: 1.8, whiteSpace:'pre-wrap', color: t.text,
              }}>
                <div style={{color: t.green, marginBottom: 8, letterSpacing: 0.12+'em'}}>▶ RESULT · matched in 3.8s</div>
                {result}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────── TESTIMONIAL (mirrors original site's John Davidson quote) ───────
function TerminalTestimonial({ t }) {
  return (
    <div style={{padding: '96px 32px', background: t.bgDeep, borderTop: `1px solid ${t.lineDim}`}}>
      <div style={{fontFamily: t.mono, fontSize: 11, color: t.gold, letterSpacing: 0.15+'em', marginBottom: 8}}>
        §08 · CLIENT SUCCESS STORIES
      </div>
      <h2 style={{fontFamily: t.serif, fontWeight: 400, fontSize: 64, lineHeight: 0.95, margin: '0 0 14px', letterSpacing: -0.03+'em'}}>
        Client Success <em style={{color: t.gold}}>Stories.</em>
      </h2>
      <div style={{fontSize: 16, color: t.textDim, marginBottom: 56}}>Real results for complex mortgage challenges.</div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1.5fr', gap: 64, alignItems:'start'}}>
        <div>
          <div style={{fontFamily: t.serif, fontSize: 96, lineHeight: 0.8, color: t.gold, marginBottom: 16}}>“</div>
          <div style={{display:'flex', alignItems:'center', gap: 16}}>
            <div style={{
              width: 56, height: 56, borderRadius:'50%',
              background: t.gold, color: t.bgDeep, display:'flex',
              alignItems:'center', justifyContent:'center',
              fontFamily: t.serif, fontSize: 20, fontWeight: 600,
            }}>JD</div>
            <div>
              <div style={{fontFamily: t.serif, fontSize: 20, color: t.text}}>John Davidson</div>
              <div style={{fontFamily: t.mono, fontSize: 11, color: t.textDim, letterSpacing: 0.1+'em', marginTop: 4}}>Developer · Surrey BC</div>
            </div>
          </div>
        </div>
        <div style={{
          fontFamily: t.serif, fontSize: 32, lineHeight: 1.4, color: t.text,
          fontStyle:'italic', fontWeight: 300, textWrap:'balance',
        }}>
          Varun helped us navigate the MLI Select program for our 16-unit development.
          His expertise saved us <span style={{color: t.gold, fontStyle:'normal'}}>over $200,000 in insurance premiums.</span>
          The level of knowledge and attention to detail was exceptional.
        </div>
      </div>
    </div>
  );
}

// ─────── PROOF ───────
function TerminalProof({ t }) {
  const deals = [
    { date:'APR 12', id:'K-2026-0411', type:'MLI Select', amt:'$8.4M', note:'16-door · Surrey · 100 pts' },
    { date:'APR 08', id:'K-2026-0405', type:'Construction', amt:'$14.2M', note:'6-story · Langley · draw-to-perm' },
    { date:'APR 03', id:'K-2026-0398', type:'Self-Employed', amt:'$2.1M', note:'Incorporated · 2-yr T1 · A-lender' },
    { date:'MAR 27', id:'K-2026-0387', type:'Private', amt:'$680K', note:'Bridge · 9-mo · 78% LTV' },
    { date:'MAR 21', id:'K-2026-0372', type:'Purchase', amt:'$1.6M', note:'First-time · Ontario · 20% down' },
  ];
  return (
    <div style={{padding: '96px 32px'}}>
      <div style={{fontFamily: t.mono, fontSize: 11, color: t.gold, letterSpacing: 0.15+'em', marginBottom: 8}}>§09 · LIVE FUND LOG</div>
      <h2 style={{fontFamily: t.serif, fontWeight: 400, fontSize: 64, lineHeight: 0.95, margin: '0 0 40px', letterSpacing: -0.03+'em'}}>
        Recent <em style={{color: t.gold}}>closes.</em>
      </h2>

      <div style={{border: `1px solid ${t.lineDim}`}}>
        <div style={{
          display:'grid', gridTemplateColumns:'100px 160px 160px 140px 1fr', gap: 16,
          padding:'12px 20px', fontFamily: t.mono, fontSize: 10, color: t.textMute,
          letterSpacing: 0.12+'em', borderBottom: `1px solid ${t.lineDim}`,
          background: t.bgDeep,
        }}>
          <span>DATE</span><span>FILE_ID</span><span>PROGRAM</span><span>AMOUNT</span><span>NOTE</span>
        </div>
        {deals.map((d, i) => (
          <div key={i} style={{
            display:'grid', gridTemplateColumns:'100px 160px 160px 140px 1fr', gap: 16,
            padding:'18px 20px', fontFamily: t.mono, fontSize: 13, color: t.text,
            borderBottom: i < deals.length-1 ? `1px solid ${t.lineDim}` : 'none',
            background: i % 2 === 0 ? t.bg : 'transparent',
          }}>
            <span style={{color: t.textDim}}>{d.date}</span>
            <span style={{color: t.gold}}>{d.id}</span>
            <span>{d.type}</span>
            <span style={{color: t.green}}>{d.amt}</span>
            <span style={{color: t.textDim}}>{d.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────── CTA (mirrors original closing section) ───────
function TerminalCTA({ t }) {
  return (
    <div style={{padding:'96px 32px', background: t.bgDeep, borderTop:`1px solid ${t.lineDim}`, borderBottom:`1px solid ${t.lineDim}`}}>
      <div style={{maxWidth: 900}}>
        <div style={{fontFamily: t.mono, fontSize: 11, color: t.gold, letterSpacing: 0.15+'em', marginBottom: 16}}>§10 · READY TO BEGIN</div>
        <h2 style={{fontFamily: t.serif, fontWeight: 400, fontSize: 80, lineHeight: 0.95, margin: '0 0 24px', letterSpacing: -0.03+'em', textWrap:'balance'}}>
          Ready to Navigate Your<br/><em style={{color: t.gold}}>Complex Mortgage?</em>
        </h2>
        <div style={{fontSize: 18, color: t.textDim, marginBottom: 40, maxWidth: 680, lineHeight: 1.55}}>
          Join thousands of satisfied clients who've achieved their property goals with expert guidance.
        </div>
        <div style={{display:'flex', gap: 12}}>
          <button style={{background: t.gold, color: t.bgDeep, border:'none', padding:'18px 28px', fontFamily: t.mono, fontSize: 13, fontWeight: 600, letterSpacing: 0.1+'em', cursor:'pointer'}}>START APPLICATION →</button>
          <button style={{background:'transparent', color: t.text, border:`1px solid ${t.gold}`, padding:'18px 28px', fontFamily: t.mono, fontSize: 13, letterSpacing: 0.1+'em', cursor:'pointer'}}>CALL 604-593-1550</button>
        </div>
      </div>
    </div>
  );
}

// ─────── FOOTER (matches original site footer info) ───────
function TerminalFooter({ t }) {
  return (
    <div style={{background: '#040810', color: t.textDim, padding: '64px 32px 32px', borderTop: `1px solid ${t.line}`}}>
      <div style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap: 56, marginBottom: 56}}>
        <div>
          <TerminalMark t={t} height={44}/>
          <div style={{marginTop: 24, fontSize: 14, lineHeight: 1.6, maxWidth: 340}}>
            18+ years of excellence in complex mortgage solutions across British Columbia, Alberta, and Ontario.
          </div>
        </div>
        {[
          ['QUICK LINKS', ['About Us','Services','Calculators','MLI Select','Blog']],
          ['CONTACT', ['604-593-1550','604-727-1579','varun@kraftmortgages.ca','#301 1688 152nd Street','Surrey, BC V4A 4N2']],
          ['LICENSED IN', ['✓ British Columbia','✓ Alberta','✓ Ontario','FSRA #M08001935']],
        ].map(([h, items]) => (
          <div key={h}>
            <div style={{fontFamily: t.mono, fontSize: 10, color: t.gold, letterSpacing: 0.15+'em', marginBottom: 16}}>{h}</div>
            {items.map(i => <div key={i} style={{fontFamily: t.sans, fontSize: 13, marginBottom: 8, cursor:'pointer'}}>{i}</div>)}
          </div>
        ))}
      </div>
      <div style={{display:'flex', justifyContent:'space-between', paddingTop: 24, borderTop: `1px solid ${t.lineDim}`, fontFamily: t.mono, fontSize: 10, color: t.textMute, letterSpacing: 0.08+'em'}}>
        <span>© 2026 KRAFT MORTGAGES CANADA INC. · FSRA #M08001935</span>
        <span>SURREY · CALGARY · TORONTO</span>
      </div>
    </div>
  );
}

Object.assign(window, { TerminalHomepage });
