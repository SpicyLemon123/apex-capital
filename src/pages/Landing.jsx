import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Landing.module.css'

const AGENTS = [
  { init: 'RA', name: 'Research Analyst', role: 'Sector & company due diligence', bg: '#ede9fe', col: '#5b21b6' },
  { init: 'QA', name: 'Quantitative Analyst', role: 'Valuation & financial modeling', bg: '#d1fae5', col: '#065f46' },
  { init: 'PM', name: 'Portfolio Manager', role: 'Position sizing & trade execution', bg: '#fce7f3', col: '#9d174d' },
  { init: 'RO', name: 'Risk Officer', role: 'Drawdown & concentration limits', bg: '#fff7ed', col: '#c2410c' },
  { init: 'CF', name: 'Chief Financial Officer', role: 'P&L reporting & performance', bg: '#dcfce7', col: '#166534' },
]

const STATS = [
  { label: 'Starting AUM', value: '$1,000,000' },
  { label: 'AI Agents', value: '5' },
  { label: 'Strategy', value: 'Value' },
  { label: 'Human Staff', value: '1' },
]

export default function Landing() {
  const nav = useNavigate()
  const [visible, setVisible] = useState(false)
  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <div className={styles.mark}>
            <svg viewBox="0 0 14 14" fill="none">
              <path d="M1.5 12L7 2L12.5 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.5 8.5H10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className={styles.logoName}>Apex Capital</span>
        </div>
        <button className={styles.enterBtn} onClick={() => nav('/app')}>
          Open Platform →
        </button>
      </nav>

      <main className={`${styles.hero} ${visible ? styles.visible : ''}`}>
        <div className={styles.eyebrow}>
          <span className={styles.dot} /> AI-Powered · Value Investing · Virtual Portfolio
        </div>
        <h1 className={styles.h1}>
          The investment firm<br />
          <span className={styles.accent}>run by AI.</span>
        </h1>
        <p className={styles.sub}>
          Apex Capital is a virtual investment firm where five autonomous AI agents
          research stocks, build valuation models, assess risk, and execute trades —
          guided by a single human CEO.
        </p>
        <div className={styles.ctaRow}>
          <button className={styles.cta} onClick={() => nav('/app')}>
            Open the Platform
          </button>
          <span className={styles.ctaNote}>$1M virtual portfolio · No real money</span>
        </div>
      </main>

      <section className={styles.statsRow}>
        {STATS.map(s => (
          <div key={s.label} className={styles.stat}>
            <div className={styles.statVal}>{s.value}</div>
            <div className={styles.statLbl}>{s.label}</div>
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHd}>
          <h2 className={styles.h2}>Meet the team</h2>
          <p className={styles.sectionSub}>Five AI agents. One human founder.</p>
        </div>
        <div className={styles.agentGrid}>
          {AGENTS.map(a => (
            <div key={a.init} className={styles.agentCard}>
              <div className={styles.agentAv} style={{ background: a.bg, color: a.col }}>{a.init}</div>
              <div className={styles.agentName}>{a.name}</div>
              <div className={styles.agentRole}>{a.role}</div>
            </div>
          ))}
          <div className={styles.agentCard}>
            <div className={styles.agentAv} style={{ background: '#1a1a2e', color: '#fff' }}>CEO</div>
            <div className={styles.agentName}>Chief Executive Officer</div>
            <div className={styles.agentRole}>Strategy, oversight & final decisions</div>
            <div className={styles.humanBadge}>Human</div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHd}>
          <h2 className={styles.h2}>How it works</h2>
        </div>
        <div className={styles.steps}>
          {[
            { n: '01', title: 'Select a stock', body: 'Choose from the watchlist of curated value and growth candidates.' },
            { n: '02', title: 'Agents analyze', body: 'All five AI agents reason independently — research, valuation, risk, portfolio fit, and P&L impact.' },
            { n: '03', title: 'Verdict delivered', body: 'The Portfolio Manager delivers a BUY, HOLD, or PASS with conviction score and position size.' },
            { n: '04', title: 'CEO decides', body: 'You review the full reasoning and execute or override the recommendation.' },
          ].map(s => (
            <div key={s.n} className={styles.step}>
              <div className={styles.stepN}>{s.n}</div>
              <div className={styles.stepTitle}>{s.title}</div>
              <div className={styles.stepBody}>{s.body}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.ctoSection}>
        <h2 className={styles.ctoH}>Ready to open the platform?</h2>
        <p className={styles.ctoSub}>$1,000,000 in virtual capital. Five AI agents on standby. You're the CEO.</p>
        <button className={styles.cta} onClick={() => nav('/app')}>Enter Apex Capital →</button>
      </section>

      <footer className={styles.footer}>
        <div className={styles.logo}>
          <div className={styles.mark}>
            <svg viewBox="0 0 14 14" fill="none">
              <path d="M1.5 12L7 2L12.5 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.5 8.5H10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className={styles.logoName}>Apex Capital</span>
        </div>
        <span className={styles.footNote}>Virtual portfolio only. Not financial advice.</span>
      </footer>
    </div>
  )
}
