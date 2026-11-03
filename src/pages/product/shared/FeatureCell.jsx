import { PhIcon } from './icons'
import '../../../styles/product/product.css'

// Icon + H5 + p cell (ai-os "advantage", systems "What Wonderful helps you do", agents "Built for teams").
// Desktop/tablet: 1px left border (#ffffff2e on dark, rgba(0,0,0,.1)-ish on light via `border`), padding 32, backdrop blur(20px).
// Mobile (<880): top border instead and padding 30px 0 (dark variants); agents' light grid keeps its own layout.
export default function FeatureCell({ icon, title, text, tone = 'dark', className = '', style }) {
  const dark = tone === 'dark'
  return (
    <div className={`pr-cell ${dark ? 'is-dark' : 'is-light'} ${className}`} style={style}>
      <div className="flex w-full flex-col items-start gap-[60px]">
        <div className="relative h-[32px] w-[32px] flex-none" style={{ color: dark ? '#fff' : '#171719' }}>
          <PhIcon name={icon} />
        </div>
        <div className="flex w-full flex-col items-start gap-[24px]">
          <h5 className="pr-h5 w-full whitespace-pre-wrap break-words" style={{ color: dark ? '#fafafa' : '#171719' }}>{title}</h5>
          <p className="pr-p14 w-full whitespace-pre-wrap break-words" style={{ color: dark ? '#9e9e9e' : '#777777' }}>{text}</p>
        </div>
      </div>
    </div>
  )
}
