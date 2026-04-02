import React from 'react'
import styles from './Dashboard.module.css'

const PRICES = { AAPL:182.63,'BRK.B':372.14,MSFT:415.32,JNJ:152.77,V:278.45,WMT:69.12,GOOGL:163.84,KO:63.41 }

const AGENTS = [
  { init:'RA', name:'Research Analyst', role:'Sector & company due diligence', bg:'#ede9fe', col:'#5b21b6' },
  { init:'QA', name:'Quantitative Analyst', role:'Valuation & financial modeling', bg:'#d1fae5', col:'#065f46' },
  { init:'PM', name:'Portfolio Manager', role:'Position sizing & trade execution', bg:'#fce7f3', col:'#9d174d' },
  { init:'RO', name:'Risk Officer', role:'Drawdown & concentration limits', bg:'#fff7ed', col:'#c2410c' },
  { init:'CF', name:'Chief Financial Officer', role:'P&L reporting & performance', bg:'#dcfce7', col:'#166534' },
]

function fmt(n) { return '$' + Math.round(n).toLocaleString() }

export default function Dashboard({ cash, portfolio, analyses, actLog }) {
  const totalValue = Object.entries(portfolio).reduce((sum, [tk, pos]) => {
    return sum + pos.shares * (PRICES[tk] || pos.entryPrice)
  }, cash)

  const pnl = totalValue - 1_000_000
  const pct = ((pnl / 1_000_000) * 100).toFixed(2)
  const positions = Object.keys(portfolio).length

  return (
    <div>
      <div className={styles.metrics}>
        <div className={styles.metric}>
          <div className={styles.mlbl}>Portfolio Value</div>
          <div className={styles.mval}>{fmt(totalValue)}</div>
          <div className={`${styles.msub} ${pnl > 0 ? styles.up : pnl < 0 ? styles.dn : styles.nt}`}>
            {pnl === 0 ? '— Since inception' : pnl > 0 ? `+${pct}% all time` : `${pct}% all time`}
          </div>
        </div>
        <div className={styles.metric}>
          <div className={styles.mlbl}>Cash Available</div>
          <div className={styles.mval}>{fmt(cash)}</div>
          <div className={`${styles.msub} ${styles.nt}`}>Ready to deploy</div>
        </div>
        <div className={styles.metric}>
          <div className={styles.mlbl}>Open Positions</div>
          <div className={styles.mval}>{positions}</div>
          <div className={`${styles.msub} ${styles.nt}`}>{positions === 0 ? 'No active trades' : `${positions} stock${positions > 1 ? 's' : ''}`}</div>
        </div>
        <div className={styles.metric}>
          <div className={styles.mlbl}>Analyses Run</div>
          <div className={styles.mval}>{analyses}</div>
          <div className={`${styles.msub} ${styles.nt}`}>By AI agents</div>
        </div>
      </div>

      <div className={styles.twocol}>
        <div className={styles.card}>
          <div className={styles.chd}><span className={styles.ctitle}>Portfolio Holdings</span></div>
          {positions === 0 ? (
            <div className={styles.empty}>
              <div className={styles.eico}>◇</div>
              <div className={styles.elbl}>No positions yet — run your first analysis in the Terminal</div>
            </div>
          ) : (
            <table className={styles.ptbl}>
              <thead><tr>
                <th>Ticker</th><th>Shares</th><th>Entry</th><th>Mkt Val</th><th>P&L</th><th>Conv.</th>
              </tr></thead>
              <tbody>
                {Object.entries(portfolio).map(([tk, pos]) => {
                  const cp = PRICES[tk] || pos.entryPrice
                  const mv = pos.shares * cp
                  const pp = ((mv - pos.cost) / pos.cost * 100).toFixed(1)
                  const up = mv >= pos.cost
                  return (
                    <tr key={tk}>
                      <td><span className={styles.tkr}>{tk}</span></td>
                      <td>{pos.shares.toLocaleString()}</td>
                      <td>${pos.entryPrice.toFixed(2)}</td>
                      <td>{fmt(mv)}</td>
                      <td className={up ? styles.up : styles.dn}>{up ? '+' : ''}{pp}%</td>
                      <td>
                        <div className={styles.cbar}>
                          <div className={styles.btr}><div className={styles.bfi} style={{ width: `${pos.conviction}%` }} /></div>
                          <span className={styles.cvn}>{pos.conviction}</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className={styles.card}>
          <div className={styles.chd}><span className={styles.ctitle}>AI Agent Team</span><span className={styles.csub}>5 employees</span></div>
          <div className={styles.alist}>
            {AGENTS.map(a => (
              <div key={a.init} className={styles.arow}>
                <div className={styles.av} style={{ background: a.bg, color: a.col }}>{a.init}</div>
                <div className={styles.ai}>
                  <div className={styles.an}>{a.name}</div>
                  <div className={styles.ar}>{a.role}</div>
                </div>
                <div className={styles.status}><span className={styles.sdot} />Standby</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.chd}><span className={styles.ctitle}>Activity Log</span></div>
        <div className={styles.feed}>
          {actLog.map((item, i) => (
            <div key={i} className={styles.fitem}>
              <div className={`${styles.fdot} ${styles[item.type]}`} />
              <div className={styles.ftxt}>{item.text}</div>
              <div className={styles.ftm}>{item.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
