import '../../styles/lattice.css'
import { useMediaQuery } from '../nav/hooks'

// CLONE_SPEC §4.6 dot pattern, top -> bottom. 'W'/'O' + delay (s); null = empty slot.
const W = (d) => ['w', d]
const O = (d) => ['o', d]
const C0 = [W(1.8), W(1.725), W(1.65), W(1.575), W(1.5), W(1.575), W(1.65), W(1.725), W(1.8)]
const C1 = [O(1.462), O(1.387), O(1.313), O(1.238), O(1.238), O(1.313), O(1.387), O(1.462)]
const C2 = [W(1.2), W(1.125), W(1.05), null, null, null, W(1.05), W(1.125), W(1.2)]
const C3 = [O(0.863), O(0.787), null, null, null, null, O(0.787), O(0.863)]
const C4 = [W(0.6), W(0.525), null, null, null, null, null, W(0.525), W(0.6)]
const C5 = [O(0.263), O(0.188), null, null, null, null, O(0.188), O(0.263)]
const DOTS = [C0, C1, C2, C3, C4, C5, C4, C3, C2, C1, C0]

// Tag anchors (column, slot) taken from the SSR markup of the tag layer.
const TAGS = [
  { col: 3, slot: 0, label: 'Data', side: 'left', delay: 11.757 },
  { col: 4, slot: 0, label: 'Alerts', side: 'left', delay: 6.385 },
  { col: 4, slot: 1, label: 'Permissions', side: 'left', delay: 1.125 },
  { col: 4, slot: 7, label: 'Skills', side: 'left', delay: 3.983 },
  { col: 4, slot: 8, label: 'Orchestrator', side: 'left', delay: 9.5 },
  { col: 6, slot: 0, label: 'CLI', side: 'right', delay: 9.2 },
  { col: 6, slot: 1, label: 'Evals', side: 'right', delay: 3.683 },
  { col: 6, slot: 7, label: 'Guardrails', side: 'right', delay: 1.425 },
  { col: 6, slot: 8, label: 'Workspaces', side: 'right', delay: 6.685 },
  { col: 7, slot: 7, label: 'Knowledge', side: 'right', delay: 12.057 },
]

const slotCount = (c) => (c % 2 === 0 ? 9 : 8)

// M (<=879.98) is a separate configuration on live (measured 2026-11-03 at 390x844): 12 columns,
// even columns 6 slots / odd columns 5, 6 tags, 23px boxes, 16.712s cycle with its own keyframes.
const M_DOTS = [
  [W(1.462), W(1.372), W(1.282), W(1.282), W(1.372), W(1.462)],
  [O(1.192), O(1.103), O(1.012), O(1.103), O(1.192)],
  [W(1.012), W(0.922), null, null, W(0.922), W(1.012)],
  [O(0.742), null, null, null, O(0.742)],
  [W(0.563), W(0.472), null, null, W(0.472), W(0.563)],
  [O(0.292), null, null, null, O(0.292)],
  [W(0.337), W(0.247), null, null, W(0.247), W(0.337)],
  [O(0.517), null, null, null, O(0.517)],
  [W(0.787), W(0.698), null, null, W(0.698), W(0.787)],
  [O(0.967), O(0.877), null, O(0.877), O(0.967)],
  [W(1.237), W(1.147), W(1.057), W(1.057), W(1.147), W(1.237)],
  [O(1.417), O(1.327), O(1.237), O(1.327), O(1.417)],
]
const M_TAGS = [
  { col: 3, slot: 0, label: 'Alerts', side: 'left', delay: 9.61 },
  { col: 5, slot: 0, label: 'Permissions', side: 'left', delay: 0.892 },
  { col: 5, slot: 4, label: 'Skills', side: 'left', delay: 5.325 },
  { col: 6, slot: 5, label: 'Workspaces', side: 'right', delay: 9.91 },
  { col: 7, slot: 0, label: 'Evals', side: 'right', delay: 5.025 },
  { col: 7, slot: 4, label: 'Guardrails', side: 'right', delay: 1.192 },
]

// T (880-1439.98, Framer breakpoint bgr1vb) is a third configuration on live (measured 2026-11-03 at
// 880/900/1100/1300/1439): 13 columns, even 9 slots / odd 8, only the outer three (even) / two (odd)
// slots at each end are filled, grid 86% x 65% of the band, 17.49s cycle with its own keyframes.
const tE = (a, b, c) => [W(c), W(b), W(a), null, null, null, W(a), W(b), W(c)]
const tO = (a, b) => [O(b), O(a), null, null, null, null, O(a), O(b)]
const T_DOTS = [
  tE(2.08, 2.16, 2.24), tO(1.8, 1.88), tE(1.44, 1.52, 1.6), tO(1.16, 1.24), tE(0.8, 0.88, 0.96), tO(0.52, 0.6),
  tE(0.16, 0.24, 0.32),
  tO(0.52, 0.6), tE(0.8, 0.88, 0.96), tO(1.16, 1.24), tE(1.44, 1.52, 1.6), tO(1.8, 1.88), tE(2.08, 2.16, 2.24),
]
const T_TAGS = [
  { col: 4, slot: 0, label: 'Data', side: 'left', delay: 11.771 },
  { col: 4, slot: 1, label: 'Alerts', side: 'left', delay: 6.431 },
  { col: 4, slot: 7, label: 'Orchestrator', side: 'left', delay: 9.529 },
  { col: 5, slot: 0, label: 'Permissions', side: 'left', delay: 1.2 },
  { col: 5, slot: 7, label: 'Skills', side: 'left', delay: 4.045 },
  { col: 7, slot: 0, label: 'Evals', side: 'right', delay: 3.745 },
  { col: 7, slot: 7, label: 'Guardrails', side: 'right', delay: 1.5 },
  { col: 8, slot: 1, label: 'CLI', side: 'right', delay: 9.229 },
  { col: 8, slot: 7, label: 'Workspaces', side: 'right', delay: 6.731 },
  { col: 8, slot: 8, label: 'Knowledge', side: 'right', delay: 12.071 },
]

function Tag({ label, side, delay }) {
  const n = label.length
  return (
    <div className={`wf-anchor is-${side}`}>
      <div>
        <div className="wf-tag" style={{ '--delay': `${delay}s` }}>
          <div className="wf-tag-panel" />
          <div className="wf-tag-box"><i /></div>
          <span className="wf-tag-lab" style={{ '--n': n }}>
            <span className="wf-type" style={{ '--type-anim': `wfType${n}`, '--type-anim-m': `wfType${n}m`, '--type-anim-t': `wfType${n}t` }}>{label}</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default function Lattice() {
  const isM = useMediaQuery('(max-width: 879.98px)')
  const isT = useMediaQuery('(min-width: 880px) and (max-width: 1439.98px)')
  const dots = isM ? M_DOTS : isT ? T_DOTS : DOTS
  const tags = isM ? M_TAGS : isT ? T_TAGS : TAGS
  const cols = dots.map((_, c) => c)
  return (
    <div className={`wf-lattice${isM ? ' is-m' : isT ? ' is-t' : ''}`} aria-hidden="true">
      <div className="wf-grid">
        {cols.map((c) => (
          <div key={c} className={`wf-col${c % 2 ? ' is-odd' : ''}`}>
            {dots[c].map((dot, s) => (
              <div key={s} className="wf-slot">
                {dot && <div className={`wf-dot is-${dot[0]}`} style={{ '--delay': `${dot[1]}s` }} />}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="wf-grid">
        {cols.map((c) => (
          <div key={c} className={`wf-col${c % 2 ? ' is-odd' : ''}`}>
            {Array.from({ length: isM || isT ? dots[c].length : slotCount(c) }, (_, s) => {
              const tag = tags.find((t) => t.col === c && t.slot === s)
              return <div key={s} className="wf-slot">{tag && <Tag {...tag} />}</div>
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
