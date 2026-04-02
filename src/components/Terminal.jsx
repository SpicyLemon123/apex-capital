import React, { useState, useRef } from 'react'
import styles from './Terminal.module.css'

const STOCKS = [
  { t:'AAPL', n:'Apple Inc.', p:182.63, c:'+1.2%', up:true },
  { t:'BRK.B', n:'Berkshire Hathaway', p:372.14, c:'+0.4%', up:true },
  { t:'MSFT', n:'Microsoft Corp.', p:415.32, c:'+0.8%', up:true },
  { t:'JNJ', n:'Johnson & Johnson', p:152.77, c:'-0.3%', up:false },
  { t:'V', n:'Visa Inc.', p:278.45, c:'+0.6%', up:true },
  { t:'WMT', n:'Walmart Inc.', p:69.12, c:'+1.1%', up:true },
  { t:'GOOGL', n:'Alphabet Inc.', p:163.84, c:'-0.5%', up:false },
  { t:'KO', n:'Coca-Cola Co.', p:63.41, c:'+0.2%', up:true },
]

const AGENT_DEFS = [
  { id:'ra', init:'RA', name:'Research Analyst', role:'Sector & company due diligence', bg:'#ede9fe', col:'#5b21b6' },
  { id:'qa', init:'QA', name:'Quantitative Analyst', role:'Valuation & financial modeling', bg:'#d1fae5', col:'#065f46' },
  { id:'pm', init:'PM', name:'Portfolio Manager', role:'Position sizing & trade execution', bg:'#fce7f3', col:'#9d174d' },
  { id:'ro', init:'RO', name:'Risk Officer', role:'Drawdown & concentration limits', bg:'#fff7ed', col:'#c2410c' },
  { id:'cf', init:'CF', name:'Chief Financial Officer', role:'P&L impact & performance', bg:'#dcfce7', col:'#166534' },
]

function fmt(n) { return '$' + Math.round(n).toLocaleString() }

export default function Terminal({ cash, portfolio, onTrade, onAnalysis, onLog }) {
  const [selected, setSelected] = useState(STOCKS[0])
  const [analyzing, setAnalyzing] = useState(false)
  const [agentTexts, setAgentTexts] = useState({})
  const [activeAgent, setActiveAgent] = useState(-1)
  const [result, setResult] = useState(null)
  const [traded, setTraded] = useState(false)
  const [toast, setToast] = useState('')
  const toastRef = useRef(null)

  function showToast(msg) {
    setToast(msg)
    clearTimeout(toastRef.current)
    toastRef.current = setTimeout(() => setToast(''), 3000)
  }

  async function runAnalysis() {
    if (analyzing) return
    setAnalyzing(true)
    setResult(null)
    setTraded(false)
    setAgentTexts({})
    setActiveAgent(0)

    const { t, n, p } = selected
    const key = import.meta.env.VITE_ANTHROPIC_KEY

    const agentPrompts = [
      { id:'ra', idx:0, prompt:`You are a Research Analyst at Apex Capital, a value investing firm. Analyze ${t} (${n}, current price $${p}). In 3 sentences: describe the business model, competitive moat, and market position. Be specific and direct. No disclaimers.` },
      { id:'qa', idx:1, prompt:`You are a Quantitative Analyst at Apex Capital. For ${t} (${n}, $${p}): assess value metrics in 3 sentences. Include estimated fair value range, P/E commentary, and margin of safety at this price. Use specific numbers. No disclaimers.` },
      { id:'pm', idx:2, prompt:`You are the Portfolio Manager at Apex Capital with $1M to deploy. For ${t} (${n}, $${p}): give your recommendation. Format: "VERDICT: BUY / HOLD / PASS — [dollar amount if BUY] — [2-sentence rationale]". Be decisive. No disclaimers.` },
      { id:'ro', idx:3, prompt:`You are the Risk Officer at Apex Capital. Assess risk of ${t} (${n}, $${p}) in a $1M portfolio. 3 sentences: top 2 downside risks, max position size as % of portfolio, and key red flags. No disclaimers.` },
      { id:'cf', idx:4, prompt:`You are the CFO of Apex Capital. In 2 sentences: comment on expected return profile for ${t} (${n}, $${p}) over 1–3 years and how it fits a value investing mandate. No disclaimers.` },
    ]

    let pmText = ''
    const results = {}

    for (const ag of agentPrompts) {
      setActiveAgent(ag.idx)
      try {
        const resp = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: ag.prompt })
        })
        const data = await resp.json()
        const text = data.text || 'Analysis unavailable.'
        results[ag.id] = text
        if (ag.id === 'pm') pmText = text
        setAgentTexts(prev => ({ ...prev, [ag.id]: text }))
      } catch {
        results[ag.id] = 'Agent unavailable.'
        setAgentTexts(prev => ({ ...prev, [ag.id]: 'Agent unavailable.' }))
      }
    }

    setActiveAgent(-1)

    let verdict = 'HOLD', conviction = 55
    if (pmText.includes('BUY')) { verdict = 'BUY'; conviction = 72 + Math.floor(Math.random() * 18) }
    else if (pmText.includes('PASS')) { verdict = 'PASS'; conviction = 28 + Math.floor(Math.random() * 18) }
    else { conviction = 50 + Math.floor(Math.random() * 15) }

    const shares = verdict === 'BUY' ? Math.floor((cash * Math.min(0.15, conviction / 600)) / p) : 0
    const amount = shares * p

    setResult({ verdict, conviction, shares, amount })
    setAnalyzing(false)
    onAnalysis()
    onLog('sys', `Analysis of ${t} complete. Verdict: ${verdict} (conviction: ${conviction}/100)`)
  }

  function executeTrade() {
    if (!result || result.verdict !== 'BUY') return
    const { shares, amount, conviction } = result
    const { t, n, p } = selected
    onTrade(t, n, p, shares, amount, conviction)
    setTraded(true)
    showToast(`Bought ${shares.toLocaleString()} shares of ${t}`)
  }

  function skipTrade() {
    setTraded(true)
    onLog('pass', 'CEO passed on trade recommendation.')
  }

  const inPortfolio = !!portfolio[selected.t]

  return (
    <div className={styles.layout}>
      <div>
        <div className={styles.card}>
          <div className={styles.chd}><span className={styles.ctitle}>Watchlist</span><span className={styles.csub}>8 stocks</span></div>
          <div>
            {STOCKS.map(s => (
              <div
                key={s.t}
                className={`${styles.witem} ${selected.t === s.t ? styles.active : ''}`}
                onClick={() => { setSelected(s); setResult(null); setTraded(false); setAgentTexts({}); }}
              >
                <div className={styles.wtk}>{s.t}</div>
                <div className={styles.wnm}>{s.n.split(' ')[0]}</div>
                <div>
                  <div className={styles.wpx}>${s.p.toFixed(2)}</div>
                  <div className={`${styles.wch} ${s.up ? styles.up : styles.dn}`}>{s.c}</div>
                </div>
              </div>
            ))}
          </div>
          <button
            className={styles.runbtn}
            disabled={analyzing}
            onClick={runAnalysis}
          >
            {analyzing ? 'Analyzing…' : 'Run AI Analysis ↗'}
          </button>
        </div>
      </div>

      <div className={styles.panel}>
        {!result && !analyzing && Object.keys(agentTexts).length === 0 && (
          <div className={styles.card}>
            <div className={styles.empty}>
              <div className={styles.eico}>◈</div>
              <div className={styles.elbl}>Select a stock and click "Run AI Analysis"<br /><span className={styles.esub}>All 5 agents will evaluate the opportunity</span></div>
            </div>
          </div>
        )}

        {(analyzing || result) && (
          <>
            <div className={styles.ahd}>
              <div className={styles.ahdTop}>
                <div>
                  <div className={styles.atk}>{selected.t}</div>
                  <div className={styles.acp}>{selected.n} · ${selected.p.toFixed(2)}</div>
                </div>
                {analyzing && <div className={styles.loadRow}><div className={styles.spin} />Running analysis…</div>}
                {result && <span className={`${styles.vpill} ${styles['v' + result.verdict.toLowerCase()]}`}>{result.verdict}</span>}
              </div>

              {result && (
                <>
                  <div className={styles.srow}>
                    <div className={styles.sbox}><div className={styles.sl}>Verdict</div><div className={styles.sv} style={{fontSize:13}}>{result.verdict}</div></div>
                    <div className={styles.sbox}><div className={styles.sl}>Conviction</div><div className={styles.sv}>{result.conviction}/100</div></div>
                    <div className={styles.sbox}><div className={styles.sl}>Shares</div><div className={styles.sv}>{result.verdict === 'BUY' ? result.shares.toLocaleString() : '—'}</div></div>
                    <div className={styles.sbox}><div className={styles.sl}>Deploy</div><div className={styles.sv} style={{fontSize:13}}>{result.verdict === 'BUY' ? fmt(result.amount) : '—'}</div></div>
                  </div>

                  {result.verdict === 'BUY' && !traded && !inPortfolio && (
                    <div className={styles.erow}>
                      <button className={styles.ebuy} onClick={executeTrade}>Execute Buy — {fmt(result.amount)}</button>
                      <button className={styles.epass} onClick={skipTrade}>Skip</button>
                    </div>
                  )}

                  {(traded || inPortfolio) && result.verdict === 'BUY' && (
                    <div className={styles.tradeConfirm}>
                      {inPortfolio ? `✓ Position open — ${result.shares.toLocaleString()} shares @ $${selected.p.toFixed(2)}` : 'CEO passed on trade recommendation.'}
                    </div>
                  )}

                  {result.verdict !== 'BUY' && (
                    <div className={styles.noTrade}>Recommendation: {result.verdict} — no trade action</div>
                  )}
                </>
              )}
            </div>

            <div className={styles.rlist}>
              {AGENT_DEFS.map((ag, i) => (
                <div key={ag.id} className={styles.rcard}>
                  <div className={styles.rchd}>
                    <div className={styles.rav} style={{ background: ag.bg, color: ag.col }}>{ag.init}</div>
                    <div><div className={styles.rcn}>{ag.name}</div><div className={styles.rcr}>{ag.role}</div></div>
                    {activeAgent === i && <div className={styles.spin} style={{ marginLeft: 'auto', flexShrink: 0 }} />}
                  </div>
                  <div className={styles.rcbody}>
                    {agentTexts[ag.id] || (activeAgent === i ? <span className={styles.cur} /> : <span style={{color:'#ccc',fontSize:10}}>Waiting…</span>)}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  )
}
