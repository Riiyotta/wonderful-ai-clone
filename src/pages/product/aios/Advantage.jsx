import FeatureCell from '../shared/FeatureCell'

// "The advantage of a unified, open layer" (#080808). Grid: D 3 cols gap 24 (rows equal, minmax(0,1fr));
// T 2 cols gap 40/24; M single column gap 24 (cells: top border, padding 30px 0).
const CELLS = [
  { icon: 'Optionality', title: 'Model optionality', text: 'Nothing you build is locked to a model. The platform routes each task to whichever model fits, and new models drop in without breaking what’s built.' },
  { icon: 'Building', title: 'Accelerated building', text: 'Permissions, integrations, and audit setup are normally rebuilt for every new AI use case. Here, they’re built once and reused, so each new use case launches faster than the last.' },
  { icon: 'Knowledge', title: 'Shared knowledge & context', text: 'Siloed tools force work to be re-entered between them. Here, everything reads the same data under one set of permissions, so work continues without re-entry.' },
  { icon: 'Cloud', title: 'Centralized governance', text: 'Scaling AI means more agents and decisions running without anyone watching. One place governs your data and AI, so access, quality, and cost scale together.' },
  { icon: 'Buildings', title: 'Compounding intelligence', text: 'Every decision that runs through the platform builds a record of how your business operates, data no competitor can access. The platform learns from it, and the advantage compounds.' },
]

export default function Advantage() {
  return (
    <section data-nav-theme="dark" className="relative flex w-full flex-col items-center justify-center gap-[60px] overflow-hidden bg-band px-[60px] py-[120px] t:px-[40px] m:px-[30px] m:py-[60px]">
      <div className="relative flex w-full max-w-[1680px] flex-col items-start gap-[24px]">
        <div className="relative w-auto [text-wrap:balance]">
          <h2 className="pr-h2 text-left text-[#fafafa]">The advantage of a unified, open layer</h2>
        </div>
        <div className="relative w-full max-w-[620px] whitespace-pre-wrap break-words">
          <p className="pr-p17 text-[#9e9e9e]">Running an enterprise on a single operating layer turns goals, context, intelligence, workflows, controls, system access, and user experiences into one continuous execution environment.</p>
        </div>
      </div>
      <div className="relative grid w-full max-w-[1680px] grid-cols-[repeat(3,minmax(50px,1fr))] [grid-auto-rows:minmax(0,1fr)] gap-[24px] t:grid-cols-[repeat(2,minmax(50px,1fr))] t:gap-x-[24px] t:gap-y-[40px] m:flex m:flex-col m:items-start">
        {CELLS.map((c) => <FeatureCell key={c.title} {...c} className="self-start" />)}
      </div>
    </section>
  )
}
