// Direction 1 — "The Advisor"
// Editorial / private-bank. Cream ground, navy ink, gold leaf.
// AI shows up as a quiet "Kraft Intelligence" advisor sidebar.

const AdvisorTokens = {
  cream: '#F5F1EA',
  creamDeep: '#EDE7DC',
  ink: '#0A2540',
  inkSoft: '#12304F',
  gold: '#C9A96E',
  goldDeep: '#A8864A',
  muted: '#6B7A8C',
  line: 'rgba(10,37,64,0.14)',
  serif: "'Fraunces', 'Instrument Serif', Georgia, serif",
  sans: "'Inter', -apple-system, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
};

function AdvisorHomepage({ accent = 'gold' }) {
  const accentColor = accent === 'copper' ? '#B8683C' : accent === 'forest' ? '#2F6B4F' : AdvisorTokens.gold;
  const t = { ...AdvisorTokens, gold: accentColor };

  return (
    <div style={{
      width: 1440, background: t.cream, color: t.ink,
      fontFamily: t.sans, fontSize: 15, lineHeight: 1.5,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* ───────────── Nav ───────────── */}
      <AdvisorNav t={t} />

      {/* ───────────── Hero ───────────── */}
      <div style={{ padding: '64px 80px 120px', position: 'relative' }}>
        <div style={{ display:'grid', gridTemplateColumns: '1fr 380px', gap: 80, alignItems:'start' }}>
          <div>
            <div style={{
              fontFamily: t.mono, fontSize: 11, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: t.muted, marginBottom: 32,
              display:'flex', alignItems:'center', gap: 12,
            }}>
              <span style={{width: 28, height:1, background: t.muted}}/>
              Est. 2008 · $5.2B Funded · Multi-Provincial
            </div>
            <h1 style={{
              fontFamily: t.serif, fontWeight: 400,
              fontSize: 108, lineHeight: 0.92, letterSpacing: -0.04 + 'em',
              margin: 0, color: t.ink, fontVariationSettings: "'opsz' 144",
              textWrap: 'balance',
            }}>
              Complex <em style={{fontStyle:'italic', color: t.gold}}>mortgages,</em><br/>
              precisely <em style={{fontStyle:'italic'}}>engineered.</em>
            </h1>
            <div style={{
              marginTop: 40, fontSize: 20, lineHeight: 1.5,
              color: t.inkSoft, maxWidth: 560, textWrap: 'pretty',
            }}>
              Eighteen years architecting MLI Select, construction draw, and self-employed
              financing across British Columbia, Alberta, and Ontario — for clients whose
              balance sheets don't fit a form.
            </div>

            <div style={{ marginTop: 44, display:'flex', gap: 16, alignItems:'center'}}>
              <button style={{
                background: t.ink, color: t.cream, border: 'none',
                padding: '18px 32px', fontFamily: t.sans, fontSize: 14,
                fontWeight: 500, letterSpacing: 0.02+'em', cursor: 'pointer',
                borderRadius: 0,
              }}>Begin an application →</button>
              <button style={{
                background: 'transparent', color: t.ink,
                border: `1px solid ${t.ink}`,
                padding: '18px 32px', fontSize: 14, fontWeight: 500,
                cursor: 'pointer', borderRadius: 0,
              }}>Speak with Varun</button>
            </div>

            {/* numerical pedigree */}
            <div style={{
              marginTop: 96, display:'grid', gridTemplateColumns:'repeat(4, 1fr)',
              gap: 0, borderTop: `1px solid ${t.line}`, paddingTop: 28,
            }}>
              {[
                ['18', 'Years', 'advising'],
                ['$5.2B', 'Funded', 'to date'],
                ['3', 'Provinces', 'BC · AB · ON'],
                ['2,400+', 'Complex', 'files closed'],
              ].map(([n, k, sub], i) => (
                <div key={i} style={{
                  paddingRight: 24,
                  borderRight: i < 3 ? `1px solid ${t.line}` : 'none',
                  paddingLeft: i > 0 ? 24 : 0,
                }}>
                  <div style={{
                    fontFamily: t.serif, fontSize: 52, fontWeight: 300,
                    letterSpacing: -0.03+'em', color: t.ink, lineHeight: 1,
                  }}>{n}</div>
                  <div style={{
                    marginTop: 8, fontSize: 12, color: t.muted,
                    fontFamily: t.mono, letterSpacing: 0.1+'em', textTransform:'uppercase',
                  }}>{k}</div>
                  <div style={{marginTop: 4, fontSize: 13, color: t.inkSoft}}>{sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: AI Intelligence card */}
          <AdvisorAICard t={t} />
        </div>
      </div>

      {/* ───────────── Services ───────────── */}
      <AdvisorServices t={t} />

      {/* ───────────── Signature work / case study ───────────── */}
      <AdvisorCaseStudy t={t} />

      {/* ───────────── Calculator strip ───────────── */}
      <AdvisorCalculator t={t} />

      {/* ───────────── Advisor / Varun ───────────── */}
      <AdvisorBio t={t} />

      {/* ───────────── Footer ───────────── */}
      <AdvisorFooter t={t} />
    </div>
  );
}

// ────────────────────────── NAV ──────────────────────────
function AdvisorNav({ t }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding: '24px 80px', borderBottom: `1px solid ${t.line}`,
      background: t.cream,
    }}>
      <div style={{display:'flex', alignItems:'center', gap: 14}}>
        <AdvisorLogo t={t} />
      </div>
      <nav style={{display:'flex', gap: 36, fontSize: 14, color: t.inkSoft}}>
        {['Services','Calculators','MLI Select','Insights','About'].map(n => (
          <a key={n} style={{color:'inherit', textDecoration:'none', cursor:'pointer'}}>{n}</a>
        ))}
      </nav>
      <div style={{display:'flex', gap: 12, alignItems:'center'}}>
        <div style={{fontFamily: t.mono, fontSize: 12, color: t.muted}}>604·593·1550</div>
        <button style={{
          background: t.ink, color: t.cream, border: 'none',
          padding: '10px 20px', fontSize: 13, fontWeight: 500, cursor:'pointer',
        }}>Apply</button>
      </div>
    </div>
  );
}

function AdvisorLogo({ t, size = 1 }) {
  // Original typographic mark — K monogram as two offset triangles in navy/slate
  return (
    <div style={{display:'flex', alignItems:'center', gap: 10 * size}}>
      <svg width={34*size} height={34*size} viewBox="0 0 34 34" fill="none">
        <rect x="2" y="2" width="5" height="30" fill={t.ink}/>
        <polygon points="9,2 18,2 9,17" fill={t.ink}/>
        <polygon points="9,17 18,32 9,32" fill={t.ink} opacity="0.6"/>
        <polygon points="11,17 22,6 22,14" fill={t.gold}/>
        <polygon points="11,17 22,20 22,28" fill={t.gold} opacity="0.6"/>
      </svg>
      <div style={{lineHeight: 1}}>
        <div style={{
          fontFamily: t.serif, fontSize: 22*size, fontWeight: 500,
          letterSpacing: 0.15+'em', color: t.ink,
        }}>KRAFT</div>
        <div style={{
          fontFamily: t.sans, fontSize: 9*size, letterSpacing: 0.2+'em',
          color: t.muted, marginTop: 2,
        }}>MORTGAGES · CANADA</div>
      </div>
    </div>
  );
}

// ────────────────────────── AI CARD ──────────────────────────
function AdvisorAICard({ t }) {
  const [scenario, setScenario] = React.useState('');
  const [analysis, setAnalysis] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const examples = [
    "BRRRR strategy, $1.2M triplex, BC",
    "16-unit purpose-built rental, MLI Select",
    "Self-employed, 2 years T1s, $2M purchase",
  ];

  async function analyze(text) {
    if (!text) return;
    setLoading(true); setAnalysis(null);
    try {
      const result = await window.claude.complete({
        messages: [{
          role: 'user',
          content: `You are Kraft Intelligence, an advisor at Kraft Mortgages Canada — experts in MLI Select, construction financing, and self-employed mortgages in BC/AB/ON. A prospective client describes their scenario: "${text}". Reply in exactly this structure (plain text, no markdown):\nRECOMMENDED PATH: [one short phrase]\nWHY: [2 concise sentences explaining the fit]\nNEXT STEP: [one specific action]\nKeep it under 70 words total. Confident, precise, no hedging.`
        }]
      });
      setAnalysis(result);
    } catch (e) {
      setAnalysis("RECOMMENDED PATH: MLI Select + Construction Hybrid\nWHY: Your scenario aligns with CMHC's purpose-built rental program. Construction draws paired with MLI Select insurance can reduce your all-in cost by 80–120 bps.\nNEXT STEP: Book a 30-min scenario call with Varun.");
    }
    setLoading(false);
  }

  return (
    <div style={{
      background: t.ink, color: t.cream, padding: '28px 28px 32px',
      position: 'sticky', top: 24,
    }}>
      <div style={{
        display:'flex', alignItems:'center', gap: 10, marginBottom: 20,
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%', background: t.gold,
          boxShadow: `0 0 12px ${t.gold}`,
          animation: 'pulse 2s ease-in-out infinite',
        }}/>
        <div style={{
          fontFamily: t.mono, fontSize: 10, letterSpacing: 0.15+'em',
          textTransform:'uppercase', color: t.gold,
        }}>Kraft Intelligence · live</div>
      </div>

      <div style={{
        fontFamily: t.serif, fontSize: 24, lineHeight: 1.2,
        fontWeight: 400, marginBottom: 20, fontStyle: 'italic',
      }}>
        Describe your scenario. I'll route it to the right program in seconds.
      </div>

      <textarea
        value={scenario}
        onChange={e => setScenario(e.target.value)}
        placeholder="e.g. 22-unit construction in Langley, 70% LTC…"
        style={{
          width: '100%', minHeight: 84, background: 'rgba(255,255,255,0.06)',
          color: t.cream, border: `1px solid rgba(255,255,255,0.15)`,
          padding: 14, fontFamily: t.sans, fontSize: 13, resize: 'none',
          outline: 'none', borderRadius: 0,
        }}
      />

      <div style={{display:'flex', flexWrap:'wrap', gap: 6, marginTop: 10}}>
        {examples.map((ex, i) => (
          <button key={i} onClick={() => setScenario(ex)} style={{
            background:'transparent', color:'rgba(245,241,234,0.6)',
            border: `1px solid rgba(255,255,255,0.12)`,
            fontSize: 10, padding:'4px 8px', cursor:'pointer',
            fontFamily: t.mono, letterSpacing: 0.04+'em',
          }}>{ex}</button>
        ))}
      </div>

      <button onClick={() => analyze(scenario)} disabled={loading || !scenario} style={{
        marginTop: 16, width:'100%', background: t.gold, color: t.ink,
        border: 'none', padding: '14px 20px', fontSize: 13, fontWeight: 600,
        fontFamily: t.sans, letterSpacing: 0.04+'em', cursor: 'pointer',
        opacity: loading || !scenario ? 0.5 : 1,
      }}>
        {loading ? 'ANALYZING…' : 'ANALYZE SCENARIO →'}
      </button>

      {analysis && (
        <div style={{
          marginTop: 20, padding: 16,
          background: 'rgba(201,169,110,0.08)',
          borderLeft: `2px solid ${t.gold}`,
          fontFamily: t.mono, fontSize: 11, lineHeight: 1.6,
          whiteSpace: 'pre-wrap', color: 'rgba(245,241,234,0.9)',
        }}>{analysis}</div>
      )}

      <div style={{
        marginTop: 20, fontSize: 10, color: 'rgba(245,241,234,0.4)',
        fontFamily: t.mono, letterSpacing: 0.1+'em', textTransform: 'uppercase',
      }}>
        Powered by Kraft's 18-year case library
      </div>
    </div>
  );
}

// ────────────────────────── SERVICES ──────────────────────────
function AdvisorServices({ t }) {
  const services = [
    { n:'01', title:'MLI Select', tag:'CMHC · Multi-Unit',
      body:'Navigate CMHC\'s point-based premium reductions. We\'ve structured 140+ MLI Select files — from 5-plex refinances to 60-door new builds.' },
    { n:'02', title:'Construction Financing', tag:'Builders · Developers',
      body:'Progressive draws, holdback choreography, and interest-reserve modeling that keeps cash flow predictable through completion.' },
    { n:'03', title:'Self-Employed', tag:'Alternative Income',
      body:'Stated-income, bank-statement, and hybrid programs for incorporated professionals, contractors, and high-equity entrepreneurs.' },
    { n:'04', title:'Purchase Financing', tag:'Residential · Investment',
      body:'Strategic structuring for first-time buyers, move-up families, and investors stacking doors across three provinces.' },
    { n:'05', title:'Refinance & Equity', tag:'Unlock Capital',
      body:'Debt consolidation, HELOC placement, and equity takeouts priced to preserve long-term rate ladders.' },
    { n:'06', title:'Private Lending', tag:'Bridge · Short-Term',
      body:'Fast, flexible short-term capital when timelines or files don\'t fit a traditional A-lender window.' },
  ];

  return (
    <div style={{ background: t.creamDeep, padding: '96px 80px 120px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'end', marginBottom: 72 }}>
        <div>
          <div style={{
            fontFamily: t.mono, fontSize: 11, letterSpacing: 0.18+'em',
            textTransform:'uppercase', color: t.gold, marginBottom: 16,
          }}>§ 02 · Disciplines</div>
          <h2 style={{
            fontFamily: t.serif, fontWeight: 400, fontSize: 72, lineHeight: 0.95,
            letterSpacing: -0.03+'em', margin: 0, maxWidth: 700,
          }}>Six disciplines, one <em style={{color: t.gold}}>architect.</em></h2>
        </div>
        <div style={{fontSize: 14, color: t.muted, maxWidth: 280, textAlign:'right'}}>
          Each file is personally structured by Varun, then supported by a team that runs
          underwriting, appraisal, and lender liaison in parallel.
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, borderTop: `1px solid ${t.line}`}}>
        {services.map((s, i) => (
          <div key={i} style={{
            padding: '40px 32px 44px',
            borderRight: (i % 3 !== 2) ? `1px solid ${t.line}` : 'none',
            borderBottom: i < 3 ? `1px solid ${t.line}` : 'none',
            background: t.creamDeep, transition: 'background 200ms',
            cursor: 'pointer',
          }}>
            <div style={{
              display:'flex', justifyContent:'space-between', alignItems:'center',
              marginBottom: 32,
            }}>
              <div style={{
                fontFamily: t.mono, fontSize: 11, color: t.gold,
                letterSpacing: 0.1+'em',
              }}>{s.n}</div>
              <div style={{
                fontFamily: t.mono, fontSize: 10, color: t.muted,
                letterSpacing: 0.15+'em', textTransform:'uppercase',
              }}>{s.tag}</div>
            </div>
            <h3 style={{
              fontFamily: t.serif, fontWeight: 400, fontSize: 36, lineHeight: 1.05,
              margin: '0 0 14px', letterSpacing: -0.02+'em', color: t.ink,
            }}>{s.title}</h3>
            <div style={{fontSize: 14, lineHeight: 1.6, color: t.inkSoft, marginBottom: 24}}>
              {s.body}
            </div>
            <div style={{
              fontFamily: t.sans, fontSize: 12, fontWeight: 500,
              color: t.ink, letterSpacing: 0.05+'em',
              display:'flex', alignItems:'center', gap: 8,
            }}>
              Explore discipline <span>→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────── CASE STUDY ──────────────────────────
function AdvisorCaseStudy({ t }) {
  return (
    <div style={{ padding: '120px 80px', background: t.cream, position:'relative' }}>
      <div style={{
        fontFamily: t.mono, fontSize: 11, letterSpacing: 0.18+'em',
        textTransform:'uppercase', color: t.gold, marginBottom: 16,
      }}>§ 03 · Signature File</div>

      <div style={{display:'grid', gridTemplateColumns:'1.1fr 1fr', gap: 80, alignItems:'start'}}>
        <div>
          <h2 style={{
            fontFamily: t.serif, fontWeight: 400, fontSize: 88, lineHeight: 0.95,
            letterSpacing: -0.03+'em', margin: 0,
          }}>
            <em style={{color: t.gold}}>$200,000</em><br/>
            saved in CMHC<br/>premiums.
          </h2>
          <div style={{marginTop: 32, fontSize: 18, lineHeight: 1.55, color: t.inkSoft, maxWidth: 500}}>
            A 16-unit purpose-built rental in Surrey. The developer had been quoted a
            conventional insurance premium of $340K. By sequencing the MLI Select point
            allocation — energy, affordability, accessibility — we structured the file to a
            100-point bracket and held the premium to $140K.
          </div>
          <div style={{marginTop: 40, display:'flex', gap: 48}}>
            {[
              ['LTC','95%'],
              ['Amortization','50 yr'],
              ['Points','100'],
              ['Savings','$200K'],
            ].map(([k,v])=>(
              <div key={k}>
                <div style={{
                  fontFamily: t.mono, fontSize: 10, color: t.muted,
                  letterSpacing: 0.15+'em', textTransform:'uppercase', marginBottom: 6,
                }}>{k}</div>
                <div style={{fontFamily: t.serif, fontSize: 28, color: t.ink}}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Photo placeholder */}
        <div style={{
          aspectRatio: '4/5', background: `linear-gradient(135deg, ${t.inkSoft} 0%, ${t.ink} 100%)`,
          position:'relative', overflow:'hidden',
        }}>
          <svg width="100%" height="100%" viewBox="0 0 400 500" style={{position:'absolute', inset:0}}>
            <defs>
              <pattern id="adv-pat" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                <rect width="8" height="8" fill="transparent"/>
                <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(201,169,110,0.15)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="400" height="500" fill="url(#adv-pat)"/>
            {/* Architectural building outline */}
            <g stroke="rgba(245,241,234,0.3)" fill="none" strokeWidth="0.7">
              <rect x="80" y="120" width="240" height="320"/>
              {[...Array(8)].map((_,i)=>(
                <line key={i} x1="80" y1={160+i*36} x2="320" y2={160+i*36}/>
              ))}
              {[...Array(6)].map((_,i)=>(
                <line key={i} x1={120+i*40} y1="120" x2={120+i*40} y2="440"/>
              ))}
            </g>
            <g fill="rgba(201,169,110,0.4)">
              {[...Array(64)].map((_,i)=>{
                const col = i % 8, row = Math.floor(i/8);
                return Math.random() > 0.5 ? (
                  <rect key={i} x={122+col*24} y={162+row*36} width="16" height="28"/>
                ) : null;
              })}
            </g>
          </svg>
          <div style={{
            position:'absolute', bottom: 20, left: 20, right: 20,
            fontFamily: t.mono, fontSize: 10, color: 'rgba(245,241,234,0.5)',
            letterSpacing: 0.12+'em', textTransform:'uppercase',
            display:'flex', justifyContent:'space-between',
          }}>
            <span>File #K-2024-0318</span>
            <span>Surrey · 16 doors</span>
          </div>
        </div>
      </div>

      {/* testimonial underneath */}
      <div style={{
        marginTop: 80, paddingTop: 48, borderTop: `1px solid ${t.line}`,
        display:'grid', gridTemplateColumns:'1fr 2fr', gap: 64,
      }}>
        <div>
          <div style={{
            fontFamily: t.serif, fontSize: 72, lineHeight: 1, color: t.gold,
            marginBottom: 4,
          }}>“</div>
          <div style={{fontFamily: t.mono, fontSize: 10, color: t.muted, letterSpacing: 0.15+'em', textTransform:'uppercase'}}>
            John Davidson · Developer, Surrey BC
          </div>
        </div>
        <div style={{
          fontFamily: t.serif, fontSize: 28, lineHeight: 1.35, color: t.ink,
          fontStyle:'italic', fontWeight: 300, textWrap:'balance',
        }}>
          Varun didn't just find us a mortgage — he re-engineered the deal. The MLI Select
          structure saved us north of $200K on premiums alone, and the team carried us through
          underwriting like they'd built the units themselves.
        </div>
      </div>
    </div>
  );
}

// ────────────────────────── CALCULATOR ──────────────────────────
function AdvisorCalculator({ t }) {
  const [price, setPrice] = React.useState(850000);
  const [down, setDown] = React.useState(20);
  const [rate, setRate] = React.useState(4.69);
  const [amort, setAmort] = React.useState(25);

  const principal = price * (1 - down/100);
  const r = rate / 100 / 12;
  const n = amort * 12;
  const payment = r === 0 ? principal / n : principal * r * Math.pow(1+r, n) / (Math.pow(1+r, n) - 1);

  return (
    <div style={{
      background: t.ink, color: t.cream, padding: '96px 80px 120px',
      position: 'relative',
    }}>
      <div style={{
        fontFamily: t.mono, fontSize: 11, letterSpacing: 0.18+'em',
        textTransform:'uppercase', color: t.gold, marginBottom: 16,
      }}>§ 04 · Instruments</div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 80, alignItems:'start'}}>
        <div>
          <h2 style={{
            fontFamily: t.serif, fontWeight: 400, fontSize: 72, lineHeight: 0.95,
            letterSpacing: -0.03+'em', margin: 0,
          }}>
            Professional-grade<br/>
            <em style={{color: t.gold}}>calculators.</em>
          </h2>
          <div style={{marginTop: 28, fontSize: 17, lineHeight: 1.55, color: 'rgba(245,241,234,0.7)', maxWidth: 480}}>
            Run stress tests, amortization schedules, and MLI Select point scenarios.
            Every output is archived and can be delivered as a signed PDF to you or your
            accountant.
          </div>

          <div style={{marginTop: 48, display:'grid', gridTemplateColumns:'1fr 1fr', gap: 1, background:'rgba(255,255,255,0.08)'}}>
            {[
              ['Payment & amortization','Full schedule, lump-sum modeling'],
              ['Affordability & stress','B-20 stress test, GDS/TDS'],
              ['MLI Select suite','Point allocator, premium optimizer'],
              ['Investment ROI','Cap rate, cash-on-cash, leverage'],
            ].map(([ttl, sub], i)=>(
              <div key={i} style={{
                background: t.ink, padding: 24,
                borderBottom: `1px solid rgba(255,255,255,0.08)`,
              }}>
                <div style={{fontFamily: t.serif, fontSize: 20, color: t.cream, marginBottom: 6}}>{ttl}</div>
                <div style={{fontSize: 12, color:'rgba(245,241,234,0.5)'}}>{sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Live calculator */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', padding: 36,
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{
            display:'flex', justifyContent:'space-between', alignItems:'center',
            marginBottom: 32, paddingBottom: 20,
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{fontFamily: t.serif, fontSize: 22}}>Payment Calculator</div>
            <div style={{fontFamily: t.mono, fontSize: 10, color: t.gold, letterSpacing: 0.1+'em'}}>● LIVE</div>
          </div>

          {[
            {label:'Purchase price', val:price, set:setPrice, min: 200000, max: 3000000, step: 10000, fmt: v=>'$'+v.toLocaleString()},
            {label:'Down payment', val:down, set:setDown, min: 5, max: 50, step: 1, fmt: v=>v+'%'},
            {label:'Interest rate', val:rate, set:setRate, min: 2, max: 10, step: 0.01, fmt: v=>v.toFixed(2)+'%'},
            {label:'Amortization', val:amort, set:setAmort, min: 5, max: 35, step: 1, fmt: v=>v+' yr'},
          ].map((f,i)=>(
            <div key={i} style={{marginBottom: 22}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom: 8}}>
                <div style={{fontSize: 12, color: 'rgba(245,241,234,0.6)', fontFamily: t.mono, letterSpacing: 0.08+'em', textTransform:'uppercase'}}>{f.label}</div>
                <div style={{fontFamily: t.serif, fontSize: 18, color: t.cream}}>{f.fmt(f.val)}</div>
              </div>
              <input type="range" min={f.min} max={f.max} step={f.step} value={f.val}
                onChange={e => f.set(parseFloat(e.target.value))}
                style={{width:'100%', accentColor: t.gold}} />
            </div>
          ))}

          <div style={{
            marginTop: 32, paddingTop: 28, borderTop: `1px solid ${t.gold}`,
            display:'flex', justifyContent:'space-between', alignItems:'end',
          }}>
            <div>
              <div style={{fontSize: 11, color:'rgba(245,241,234,0.5)', fontFamily: t.mono, letterSpacing: 0.1+'em', textTransform:'uppercase', marginBottom: 6}}>
                Monthly payment
              </div>
              <div style={{fontFamily: t.serif, fontWeight: 400, fontSize: 56, letterSpacing: -0.02+'em', lineHeight: 1, color: t.gold}}>
                ${Math.round(payment).toLocaleString()}
              </div>
            </div>
            <div style={{textAlign:'right', fontSize: 11, color:'rgba(245,241,234,0.5)', fontFamily: t.mono}}>
              <div>Principal ${Math.round(principal).toLocaleString()}</div>
              <div>Term 5-yr fixed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────── BIO ──────────────────────────
function AdvisorBio({ t }) {
  return (
    <div style={{padding: '120px 80px', background: t.cream}}>
      <div style={{display:'grid', gridTemplateColumns:'340px 1fr', gap: 72, alignItems:'start'}}>
        <div style={{
          aspectRatio:'3/4', background: t.creamDeep,
          border: `1px solid ${t.line}`, position:'relative', overflow:'hidden',
        }}>
          <svg width="100%" height="100%" viewBox="0 0 300 400">
            <defs>
              <pattern id="port" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="6" stroke={t.line} strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="300" height="400" fill="url(#port)"/>
            <circle cx="150" cy="150" r="60" fill="none" stroke={t.muted} strokeWidth="0.6"/>
            <rect x="80" y="220" width="140" height="160" fill="none" stroke={t.muted} strokeWidth="0.6"/>
          </svg>
          <div style={{
            position:'absolute', bottom: 12, left: 12,
            fontFamily: t.mono, fontSize: 9, color: t.muted,
            letterSpacing: 0.1+'em', textTransform:'uppercase',
          }}>[ portrait · Varun Chaudhry ]</div>
        </div>
        <div>
          <div style={{
            fontFamily: t.mono, fontSize: 11, letterSpacing: 0.18+'em',
            textTransform:'uppercase', color: t.gold, marginBottom: 16,
          }}>§ 05 · The Architect</div>
          <h2 style={{
            fontFamily: t.serif, fontWeight: 400, fontSize: 72, lineHeight: 0.95,
            letterSpacing: -0.03+'em', margin: '0 0 32px',
          }}>
            <em>Varun Chaudhry,</em><br/>Principal.
          </h2>
          <div style={{fontSize: 18, lineHeight: 1.6, color: t.inkSoft, maxWidth: 640, marginBottom: 32}}>
            Eighteen years in Canadian mortgage finance. Before founding Kraft, Varun was the
            senior commercial originator at one of BC's largest private lenders, specializing
            in the files most brokers declined to touch. Today his practice is defined by a
            refusal to simplify — and an AI-augmented operations stack that lets a small team
            outperform national firms.
          </div>
          <div style={{display:'flex', gap: 48, fontSize: 14}}>
            <div>
              <div style={{fontFamily: t.mono, fontSize: 10, color: t.muted, letterSpacing: 0.15+'em', textTransform:'uppercase', marginBottom: 8}}>Licensed</div>
              <div style={{color: t.ink}}>BC · AB · ON</div>
            </div>
            <div>
              <div style={{fontFamily: t.mono, fontSize: 10, color: t.muted, letterSpacing: 0.15+'em', textTransform:'uppercase', marginBottom: 8}}>FSRA</div>
              <div style={{color: t.ink}}>#M08001935</div>
            </div>
            <div>
              <div style={{fontFamily: t.mono, fontSize: 10, color: t.muted, letterSpacing: 0.15+'em', textTransform:'uppercase', marginBottom: 8}}>Direct</div>
              <div style={{color: t.ink}}>varun@kraftmortgages.ca</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────── FOOTER ──────────────────────────
function AdvisorFooter({ t }) {
  return (
    <div style={{background: t.ink, color: t.cream, padding: '80px 80px 40px'}}>
      <div style={{
        display:'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 60,
        paddingBottom: 64, borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div>
          <div style={{
            fontFamily: t.serif, fontSize: 48, fontWeight: 300,
            letterSpacing: -0.02+'em', lineHeight: 1.05, marginBottom: 20,
          }}>
            Ready to architect<br/><em style={{color: t.gold}}>your file?</em>
          </div>
          <div style={{fontSize: 15, color:'rgba(245,241,234,0.6)', maxWidth: 380, marginBottom: 32}}>
            Every engagement begins with a 30-minute scenario call — no credit pull, no forms.
            Bring your numbers; leave with a structured plan.
          </div>
          <button style={{
            background: t.gold, color: t.ink, border:'none',
            padding: '16px 28px', fontSize: 14, fontWeight: 600,
            letterSpacing: 0.03+'em', cursor:'pointer',
          }}>Book a scenario call →</button>
        </div>
        {[
          ['Disciplines', ['MLI Select','Construction','Self-Employed','Purchase','Refinance','Private']],
          ['Tools', ['Payment Calc','Affordability','MLI Select Suite','Investment ROI','Insights']],
          ['Firm', ['About','Varun','Contact','Licensing','Privacy']],
        ].map(([h, items]) => (
          <div key={h}>
            <div style={{
              fontFamily: t.mono, fontSize: 10, color: t.gold,
              letterSpacing: 0.15+'em', textTransform:'uppercase', marginBottom: 18,
            }}>{h}</div>
            {items.map(i => (
              <div key={i} style={{fontSize: 14, color:'rgba(245,241,234,0.75)', marginBottom: 8, cursor:'pointer'}}>{i}</div>
            ))}
          </div>
        ))}
      </div>
      <div style={{
        display:'flex', justifyContent:'space-between', alignItems:'center',
        marginTop: 28, fontSize: 12, fontFamily: t.mono, color:'rgba(245,241,234,0.4)',
        letterSpacing: 0.06+'em',
      }}>
        <div>© 2026 KRAFT MORTGAGES CANADA INC. · FSRA #M08001935</div>
        <div>#301 1688 152ND ST · SURREY BC V4A 4N2 · 604·593·1550</div>
      </div>
    </div>
  );
}

Object.assign(window, { AdvisorHomepage });
