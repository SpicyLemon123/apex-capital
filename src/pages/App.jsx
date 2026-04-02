import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Dashboard from '../components/Dashboard'
import Terminal from '../components/Terminal'
import styles from './App.module.css'

export default function App() {
  const nav = useNavigate()
  const [tab, setTab] = useState('hq')
  const [portfolio, setPortfolio] = useState({})
  const [cash, setCash] = useState(1_000_000)
  const [analyses, setAnalyses] = useState(0)
  const [actLog, setActLog] = useState([
    { type: 'sys', text: 'Apex Capital initialized. $1,000,000 virtual portfolio created. AI agent team on standby.', time: now() }
  ])

  function now() { return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }

  const addLog = useCallback((type, text) => {
    setActLog(prev => [{ type, text, time: now() }, ...prev].slice(0, 30))
  }, [])

  const executeTrade = useCallback((ticker, name, price, shares, amount, conviction) => {
    setCash(c => c - amount)
    setPortfolio(p => ({ ...p, [ticker]: { name, entryPrice: price, shares, cost: amount, conviction } }))
    addLog('buy', `BUY executed — ${shares.toLocaleString()} shares of ${ticker} @ $${price.toFixed(2)} · Deployed: $${Math.round(amount).toLocaleString()}`)
  }, [addLog])

  const incrementAnalyses = useCallback(() => setAnalyses(a => a + 1), [])

  return (
    <div className={styles.root}>
      <div className={styles.topbar}>
        <div className={styles.logo} onClick={() => nav('/')} style={{ cursor: 'pointer' }}>
          <div className={styles.mark}>
            <svg viewBox="0 0 14 14" fill="none">
              <path d="M1.5 12L7 2L12.5 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.5 8.5H10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className={styles.logoName}>Apex Capital</span>
          <span className={styles.logoTag}>AI-Powered</span>
        </div>

        <div className={styles.tabs}>
          <button className={`${styles.tab} ${tab === 'hq' ? styles.active : ''}`} onClick={() => setTab('hq')}>HQ Dashboard</button>
          <button className={`${styles.tab} ${tab === 'terminal' ? styles.active : ''}`} onClick={() => setTab('terminal')}>Trading Terminal</button>
        </div>

        <div className={styles.topRight}>
          <div className={styles.marketPill}><span className={styles.mdot} />Markets Open</div>
          <div className={styles.ceoBadge}><div className={styles.ceoAv}>CEO</div><span className={styles.ceoLbl}>You — Founder</span></div>
        </div>
      </div>

      <div className={styles.content}>
        {tab === 'hq' ? (
          <Dashboard
            cash={cash}
            portfolio={portfolio}
            analyses={analyses}
            actLog={actLog}
          />
        ) : (
          <Terminal
            cash={cash}
            portfolio={portfolio}
            onTrade={executeTrade}
            onAnalysis={incrementAnalyses}
            onLog={addLog}
          />
        )}
      </div>
    </div>
  )
}
