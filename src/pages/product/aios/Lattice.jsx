import MARKUP from './latticeMarkup'
import '../../../styles/product/aios.css'

// /ai-os "Hero Lattice" code component. Its SSR output (dot grid + typing tags, pure CSS keyframes, three breakpoint
// variants) is injected verbatim; the ai-os timings differ from the homepage lattice (tags hold ~22% of the cycle).
export default function AiOsLattice() {
  return (
    <div className="absolute left-0 top-0 z-[1] h-full w-full overflow-clip" aria-hidden="true">
      <div className="aios-lattice" dangerouslySetInnerHTML={{ __html: MARKUP }} />
    </div>
  )
}
