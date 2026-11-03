import { useState } from 'react'
import '../../../styles/product/aios.css'

// "Complete infrastructure to run enterprise AI" (Framer component 8xV7y; variants Desktop / Stacked / Phone x 7 states).
// Click a block (or the badge) to switch state. The "beam" (code component: a radial glow running along the border
// with offset-path, 6s linear, plus a 3s 25%->100% opacity breath) sits on the block AFTER the active one.
const STATES = {
  sec: { title: 'Security & Governance', text: 'Defines who and what can access which data and actions, and enforces those rules across every agent and application.',
    textD: 'Defines who and what can access which data\nand actions, and enforces those rules across every\nagent and application.', beam: ['obs'] },
  obs: { title: 'Observability', text: 'Evaluates and monitors every agent in development and in production, tracing performance and surfacing metrics and alerts to dashboards and a complete audit trail.', beam: ['wf'] },
  wf: { title: 'Workflows', text: 'Executes multi-step business processes end to end, orchestrating agents, systems, and people while carrying the work’s context, state, permissions, and goals throughout.', beam: ['bt'] },
  bt: { title: 'Building tools', text: 'An environment for creating agents, workflows, and applications, where you define logic, test behavior, and deploy to production.', beam: ['ctx'] },
  ctx: { title: 'Context hub', text: 'A knowledge layer that indexes enterprise documents and data for agents and applications to query directly.',
    textD: 'A knowledge layer that indexes enterprise\ndocuments and data for agents and applications\nto query directly.', beam: ['mod'] },
  mod: { title: 'Models', text: 'Runs frontier, open-weight, and on-prem models behind one interface, and routes every task to whichever model fits its requirements.',
    textD: 'Runs frontier, open-weight, and on-prem models behind\none interface, and routes every task to whichever model\nfits its requirements.', beam: ['int'] },
  int: { title: 'Integration hub', text: 'A single place to manage every integration across the organization, from supported providers to any MCP server, governed centrally instead of per product.', beam: ['obs', 'badge'] },
}
const BLOCK_IMG = '/assets/wfNU1eiDknzdlV92YJPCDR1U4.png'

function Beam({ radius }) {
  return (
    <div className="io-beam-wrap" aria-hidden="true">
      <div className="io-beam-static" style={{ borderRadius: radius }} />
      <div className="io-beam-trail" style={{ borderRadius: radius }}>
        <div className="io-beam" style={{ offsetPath: `rect(0 auto auto 0 round ${radius - 2}px)` }} />
      </div>
    </div>
  )
}

function Block({ id, label, state, setState, row }) {
  const active = state === id
  const beam = STATES[state].beam.includes(id)
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setState(id)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setState(id)}
      className={`io-block ${row ? 'is-row' : ''} ${active ? 'is-active' : ''}`}
    >
      {active && (
        <div className="absolute inset-0 rounded-[inherit]">
          <img src={BLOCK_IMG} alt="" className="block h-full w-full rounded-[inherit] object-cover object-center" />
        </div>
      )}
      <div className="io-ring" aria-hidden="true" />
      {beam && <Beam radius={8} />}
      <div className="relative flex-none whitespace-pre">
        <p className="io-label">{label}</p>
      </div>
    </div>
  )
}

function Panel({ state, setState }) {
  const active = state === 'sec'
  return (
    <div className="io-panel">
      <Block id="obs" label="Observability" state={state} setState={setState} />
      <Block id="wf" label="Workflows" state={state} setState={setState} />
      <Block id="bt" label="Building Tools" state={state} setState={setState} />
      <div className="io-row4">
        <Block id="ctx" label="Context" state={state} setState={setState} row />
        <Block id="mod" label="Models" state={state} setState={setState} row />
        <Block id="int" label="Integrations" state={state} setState={setState} row />
      </div>
      <div className="io-badge-wrap">
        <div role="button" tabIndex={0} onClick={() => setState('sec')} className={`io-badge ${active ? 'is-active' : ''}`}>
          {active && (
            <div className="absolute inset-0 rounded-[inherit]">
              <img src={BLOCK_IMG} alt="" className="block h-full w-full rounded-[inherit] object-cover object-center" />
            </div>
          )}
          {STATES[state].beam.includes('badge') && <Beam radius={16} />}
          <div className="relative flex-none whitespace-pre">
            <p className="pr-p14" style={{ color: active ? '#fff' : 'rgba(255,255,255,.85)' }}>Security &amp; Governance</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Infra() {
  const [state, setState] = useState('sec')
  const s = STATES[state]
  return (
    <section data-nav-theme="dark" className="relative flex w-full flex-col items-center justify-center gap-[100px] overflow-clip bg-band px-[60px] py-[140px] t:px-[40px] m:px-[24px] m:py-[64px]">
      <div className="io-root">
        <div className="io-left">
          <div className="relative w-full">
            <h2 className="pr-h2 whitespace-pre-wrap break-words text-[#f5f5f5]">Complete infrastructure to run enterprise AI</h2>
          </div>
          <div className="io-state">
            <div className="relative w-full"><h3 className="pr-h3 whitespace-pre-wrap text-[#f5f5f5]">{s.title}</h3></div>
            <div className="relative w-full max-w-[466px]"><p className="pr-p17 whitespace-pre-wrap break-words text-[#777777]">{s.textD || s.text}</p></div>
          </div>
        </div>
        <div className="io-visual">
          <div className="absolute inset-0 rounded-[inherit]">
            <img src="/assets/KQ4FP56yPBz9IgOdHETuu5TKbvw.jpg" alt="" className="block h-full w-full rounded-[inherit] object-cover object-center" />
          </div>
          <Panel state={state} setState={setState} />
          <div className="io-state-b">
            <div className="relative w-full"><h4 className="pr-h4 whitespace-pre-wrap text-[#f5f5f5] io-h4b">{s.title}</h4></div>
            <div className="relative w-full"><p className="pr-p17 whitespace-pre-wrap break-words text-[#fafafa]">{s.text}</p></div>
          </div>
        </div>
      </div>
    </section>
  )
}
