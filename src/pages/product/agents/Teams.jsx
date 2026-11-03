import FeatureCell from '../shared/FeatureCell'
import '../../../styles/product/product.css'
import '../../../styles/product/agents.css'

// "Built for teams building at scale" (#fafafa). D: two flex rows of 4 cells (gap 24). T: each row is a 2x2 grid
// (gap 40/24). M: 2-column grid, each column one former row (4 stacked 270px cells, top border, 30px 0 padding).
const ROWS = [
  [
    ['Workspaces', 'Workspaces', 'Teams, projects, and business units, each in their own space.'],
    ['Versioning', 'Versioning', 'Every change tracked. Roll back to any version, anytime.'],
    ['Catalog', 'Catalog', 'Build an agent once, reuse it everywhere. Skills and tools too.'],
    ['Permissions', 'Permissions', 'Decide who can build, edit, and ship, down to the resource.'],
  ],
  [
    ['Skills', 'Reusable skills', 'Package a specific procedure once, then reuse it across any agent that needs it.'],
    ['A2A', 'A2A', 'Hand work between agents across different platforms, through the A2A protocol.'],
    ['Tags', 'Tags', 'Automatically categorize every conversation, so insights become searchable and measurable.'],
    ['AB', 'A/B Testing', 'Split traffic between two agent variants, pick the winner, iterate on data.'],
  ],
]

export default function Teams() {
  return (
    <section data-nav-theme="light" className="relative flex w-full flex-col items-center justify-center gap-[60px] overflow-hidden bg-offwhite px-[60px] py-[120px] t:px-[40px] m:px-[30px] m:py-[60px]">
      <div className="relative flex w-full max-w-[1680px] flex-col items-start gap-[24px]">
        <div className="relative [text-wrap:balance]"><h2 className="pr-h2 [text-wrap:balance] text-left text-[#171719]">Built for teams building at scale</h2></div>
        <div className="relative max-w-[801px] whitespace-pre-wrap break-words">
          <p className="pr-p17 text-left text-[#777777]">Everything a team needs across the agent lifecycle,<br />from first version to testing, deployment, and improvement in production.</p>
        </div>
      </div>
      <div className="relative flex w-full flex-col items-center justify-center gap-[24px] overflow-clip m:grid m:grid-cols-2 m:items-start">
        {ROWS.map((row, r) => (
          <div key={r} className="relative flex w-full max-w-[1680px] flex-row items-start justify-start gap-[24px] t:grid t:grid-cols-2 t:gap-x-[24px] t:gap-y-[40px] m:flex-col">
            {row.map(([icon, title, text]) => (
              <FeatureCell key={title} tone="light" icon={icon} title={title} text={text} className="ag-cell [@media(min-width:1440px)]:w-px [@media(min-width:1440px)]:flex-[1_0_0]" />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
