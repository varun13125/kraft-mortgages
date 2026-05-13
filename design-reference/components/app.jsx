// App — lays out the 3 directions on DesignCanvas

const { DesignCanvas, DCSection, DCArtboard, DCPostIt } = window;

function App() {
  const [focus, setFocus] = React.useState(document.documentElement.dataset.focus || 'all');
  const [accent, setAccent] = React.useState(document.documentElement.dataset.accent || 'gold');

  React.useEffect(() => {
    const on = (e) => {
      setFocus(e.detail.focus);
      setAccent(e.detail.accent);
    };
    window.addEventListener('tweaks', on);
    return () => window.removeEventListener('tweaks', on);
  }, []);

  // Artboards
  const showAdvisor = focus === 'all' || focus === '1';
  const showTerminal = focus === 'all' || focus === '2';
  const showAtlas = focus === 'all' || focus === '3';

  return (
    <DesignCanvas>
      {/* Title card */}
      <div style={{padding: '0 60px 40px', maxWidth: 1200}}>
        <div style={{
          display:'flex', alignItems:'center', gap: 16, marginBottom: 16,
          fontSize: 11, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.15em',
          textTransform: 'uppercase', color: 'rgba(40,30,20,0.5)',
        }}>
          <img src="assets/kraft-logo.png" style={{height: 28, width:'auto'}}/>
          <span>·</span>
          <span>Homepage redesign · 3 directions</span>
          <span>·</span>
          <span>Apr 2026</span>
        </div>
        <div style={{
          fontFamily: "'Fraunces', Georgia, serif", fontSize: 56, fontWeight: 400,
          letterSpacing: '-0.03em', color: '#1A1A1A', lineHeight: 1.02,
          textWrap: 'balance', marginBottom: 18,
        }}>
          Three aesthetic directions for <em style={{color:'#C9A96E'}}>kraftmortgages.ca</em>
        </div>
        <div style={{
          fontSize: 15, color: 'rgba(40,30,20,0.7)', maxWidth: 840, lineHeight: 1.55,
          fontFamily: 'Inter, sans-serif',
        }}>
          Each direction is a full homepage at 1440 × {'~'}6000px, built as a working prototype.
          All three share your navy + cream + gold palette and Fraunces display serif, but differ
          in personality, density, and the way AI shows up in the UI. Scroll an artboard to see
          every section; interact with the live calculators, AI scenario finders, and point optimizers.
        </div>
        <div style={{
          marginTop: 22, display:'flex', gap: 12, flexWrap:'wrap',
          fontFamily:'JetBrains Mono, monospace', fontSize: 11, color: '#5A4A2A',
        }}>
          <span style={{background:'#fef4a8', padding:'6px 10px'}}>→ Scroll inside artboards</span>
          <span style={{background:'#fef4a8', padding:'6px 10px'}}>→ Click buttons & sliders — everything is live</span>
          <span style={{background:'#fef4a8', padding:'6px 10px'}}>→ Tweaks panel: isolate one direction / change accent</span>
        </div>
      </div>

      {showAdvisor && (
        <DCSection
          title="Direction 01 · The Advisor"
          subtitle="Editorial, private-bank gravitas. Cream ground, huge serif, AI as a quiet advisor panel. Recommended for buyers who want to feel in capable hands."
        >
          <ScrollArtboard label="kraftmortgages.ca · The Advisor · 1440w" width={1440} height={900}>
            <AdvisorHomepage accent={accent}/>
          </ScrollArtboard>
          <NotesPanel
            title="The Advisor"
            bullets={[
              'Private-bank / architecture firm gravitas',
              'Cream + navy + gold. Serif-dominant type',
              'AI lives in a quiet Kraft Intelligence panel — ask any scenario',
              'Section numbering (§ 01, § 02) and archival case file',
              'Best if your target clients value trust & discretion',
            ]}
            pros={['Elevated, premium', 'Serif feels timeless', 'Differentiates from every other broker']}
            cons={['Less data-forward', 'Less obviously "AI-native"']}
          />
        </DCSection>
      )}

      {showTerminal && (
        <DCSection
          title="Direction 02 · The Terminal"
          subtitle="Data-forward, Bloomberg-meets-fintech. Dark navy ground, monospace UI, live rate board, an AI file-router that streams results like a console."
        >
          <ScrollArtboard label="kraftmortgages.ca · The Terminal · 1440w" width={1440} height={900}>
            <TerminalHomepage accent={accent}/>
          </ScrollArtboard>
          <NotesPanel
            title="The Terminal"
            bullets={[
              'Reads like a mortgage trading terminal',
              'Live rate ticker + 6-lender rate board',
              'Streaming AI console: types out file analysis like tail -f',
              'MLI Select point optimizer (drag the slider, see LTV/amort/premium update)',
              'Leans hardest into "AI-native" — impossible for generic brokers to copy',
            ]}
            pros={['Maximum AI/tech signal', 'Developers & investors will love it', 'Unique in the industry']}
            cons={['Might read "cold" for residential first-timers', 'Higher cognitive load']}
          />
        </DCSection>
      )}

      {showAtlas && (
        <DCSection
          title="Direction 03 · The Atlas"
          subtitle="Editorial Swiss grid. Modular 12-column layout, interactive province map, 4-step AI scenario finder. Feels like a well-designed financial publication."
        >
          <ScrollArtboard label="kraftmortgages.ca · The Atlas · 1440w" width={1440} height={900}>
            <AtlasHomepage accent={accent}/>
          </ScrollArtboard>
          <NotesPanel
            title="The Atlas"
            bullets={[
              'Swiss-grid editorial: 12-col, rigorous, magazine-like',
              'Clickable provincial map as the geographic hero',
              'Multi-step AI scenario finder (4 questions → matched service + next steps)',
              'Asymmetric service grid with MLI Select as a flagship card',
              'Best balance of human warmth + modern data + AI',
            ]}
            pros={['Appeals to the broadest audience', 'Most versatile layout system', 'Editorial feel = authority']}
            cons={['Slightly more conventional than Terminal', 'Map metaphor needs ongoing content investment']}
          />
        </DCSection>
      )}

      {/* Summary */}
      <div style={{padding: '0 60px', marginTop: 40}}>
        <div style={{
          background:'#fff', border: '1px solid rgba(0,0,0,0.08)',
          padding: 48, maxWidth: 1200,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.04)',
        }}>
          <div style={{
            fontFamily:'JetBrains Mono, monospace', fontSize: 11,
            letterSpacing: '0.15em', color: '#C9A96E', marginBottom: 16,
          }}>RECOMMENDATION</div>
          <div style={{
            fontFamily:"'Fraunces', serif", fontSize: 36, fontWeight: 400,
            letterSpacing:'-0.02em', lineHeight: 1.2, marginBottom: 20,
            color: '#0A2540', textWrap:'balance',
          }}>
            My pick: <em style={{color:'#C9A96E'}}>The Atlas</em> as the backbone, with
            <em style={{color:'#C9A96E'}}> Terminal</em> elements grafted in.
          </div>
          <div style={{fontSize: 15, lineHeight: 1.65, color: '#1E3A5F', maxWidth: 820}}>
            The Atlas layout speaks to all four of your audiences — developers, self-employed,
            first-timers, and referral partners — while staying editorially cohesive. But the
            Terminal's <strong>live rate board</strong> and <strong>streaming AI file-router</strong> are the moat you asked for.
            Bolt those into the Atlas hero and you get: editorial warmth on the outside, AI-native
            terminal depth the moment anyone touches the product. No Canadian competitor has
            anything close to this right now.
          </div>
          <div style={{marginTop: 24, display:'flex', gap: 12, flexWrap:'wrap'}}>
            {['Next step: pick a direction', 'Then: component library + full page build', 'Then: calculator suite + /mli-select deep-dive pages'].map((s,i)=>(
              <div key={i} style={{
                background:'#F5F1EA', padding:'10px 14px', fontSize: 12,
                fontFamily:'JetBrains Mono, monospace', letterSpacing:'0.05em', color:'#0A2540',
              }}>{String(i+1).padStart(2,'0')} · {s}</div>
            ))}
          </div>
        </div>
      </div>
    </DesignCanvas>
  );
}

// ───────── Scroll artboard wrapper ─────────
function ScrollArtboard({ label, width, height, children }) {
  return (
    <div style={{position:'relative', flexShrink: 0}}>
      {label && (
        <div style={{
          position:'absolute', bottom:'100%', left: 0, paddingBottom: 8,
          fontSize: 12, fontWeight: 500, color: 'rgba(60,50,40,0.7)',
          fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em',
          whiteSpace: 'nowrap',
        }}>{label}</div>
      )}
      <div style={{
        width, height, overflow:'auto', overflowX:'hidden',
        boxShadow:'0 1px 3px rgba(0,0,0,0.08), 0 12px 40px rgba(0,0,0,0.08)',
        background:'#fff',
        scrollbarWidth: 'thin',
      }}>
        {children}
      </div>
    </div>
  );
}

// ───────── Notes panel beside each direction ─────────
function NotesPanel({ title, bullets, pros, cons }) {
  return (
    <div style={{
      width: 380, flexShrink: 0, padding: '0 4px',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{
        fontFamily:"'Fraunces', serif", fontSize: 28, fontWeight: 400,
        letterSpacing:'-0.02em', color:'#1A1A1A', marginBottom: 24,
      }}>{title}</div>

      <div style={{marginBottom: 24}}>
        <div style={{
          fontFamily:'JetBrains Mono, monospace', fontSize: 10,
          letterSpacing: '0.15em', color: '#C9A96E', marginBottom: 12,
        }}>CHARACTER</div>
        {bullets.map((b, i) => (
          <div key={i} style={{
            fontSize: 13, lineHeight: 1.55, color:'#333', marginBottom: 8,
            paddingLeft: 16, position:'relative',
          }}>
            <span style={{position:'absolute', left: 0, color:'#C9A96E'}}>—</span>
            {b}
          </div>
        ))}
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 16, marginTop: 20}}>
        <div>
          <div style={{
            fontFamily:'JetBrains Mono, monospace', fontSize: 10,
            letterSpacing:'0.15em', color:'#3A7A5A', marginBottom: 10,
          }}>STRENGTHS</div>
          {pros.map((p, i) => (
            <div key={i} style={{fontSize: 12, color:'#333', marginBottom: 6, lineHeight: 1.4}}>+ {p}</div>
          ))}
        </div>
        <div>
          <div style={{
            fontFamily:'JetBrains Mono, monospace', fontSize: 10,
            letterSpacing:'0.15em', color:'#A8663C', marginBottom: 10,
          }}>WATCHOUTS</div>
          {cons.map((c, i) => (
            <div key={i} style={{fontSize: 12, color:'#333', marginBottom: 6, lineHeight: 1.4}}>− {c}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
