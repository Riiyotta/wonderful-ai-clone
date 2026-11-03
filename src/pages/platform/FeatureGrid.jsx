import { H2, P14, P17 } from './shared'

// "Deploy anywhere" (deployment) / "What it means for your business" (ai-gateway): four icon columns.
// Each column: padding 32, 1px left rule (::after), backdrop blur 20; icon 32 -> 60 gap -> title/text (gap 24).
// Tablet: 2x2 grid (gap 40/24). Mobile: stacked, 1px top rule, padding 30px 0.
export function Icon({ icon, color, className = '' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={icon.viewBox} focusable="false" aria-hidden="true" className={`block h-full w-full ${className}`} style={{ fill: color, color }}>
      {icon.paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
  )
}

export default function FeatureGrid({ id, title, subtitle, items, icons, theme = 'light', maxW = 1200, titleW, lastNoStretch = false }) {
  const dark = theme === 'dark'
  return (
    <section
      id={id}
      data-nav-theme={dark ? 'dark' : undefined}
      className={`relative flex w-full flex-col items-center justify-center gap-[60px] overflow-hidden px-[60px] py-[120px] t:px-[40px] m:px-[30px] m:py-[60px] ${dark ? 'bg-band' : 'bg-offwhite'}`}
    >
      <div className="relative flex w-full flex-col items-start gap-[24px]" style={{ maxWidth: maxW }}>
        <div className="relative" style={{ width: titleW }}>
          <h2 className={`m-0 text-left [text-wrap:balance] ${H2} ${dark ? 'text-offwhite' : 'text-ink'}`}>{title}</h2>
        </div>
        {subtitle && (
          <p className={`m-0 max-w-[600px] whitespace-pre-wrap text-left text-ink-300 ${P17}`}>{subtitle}</p>
        )}
      </div>
      <div
        className="relative flex w-full flex-row items-start gap-[24px] t:grid t:grid-cols-2 t:gap-x-[24px] t:gap-y-[40px] m:flex-col"
        style={{ maxWidth: maxW }}
      >
        {items.map((it, i) => (
          <div
            key={it.title}
            className={`fg-card relative flex w-px flex-[1_0_0] flex-col items-start p-[32px] t:w-full t:flex-none t:self-start m:w-full m:flex-none m:px-0 m:py-[30px] ${lastNoStretch && i === items.length - 1 ? 'self-start' : 'self-stretch'} ${dark ? 'fg-card--dark' : 'fg-card--light'}`}
          >
            <div className="relative flex w-full flex-col items-start gap-[60px]">
              <div className="relative h-[32px] w-[32px] flex-none">
                <Icon icon={icons[i]} color={dark ? '#ffffff' : '#171719'} />
              </div>
              <div className="relative flex w-full flex-col items-start gap-[24px]">
                <h5 className={`m-0 w-full font-inter text-[20px] font-light leading-[1.15] tracking-[-0.05em] [font-feature-settings:"ss04"] ${dark ? 'text-offwhite' : 'text-ink'}`}>{it.title}</h5>
                <p className={`m-0 w-full ${P14} ${dark ? 'text-[#9e9e9e]' : 'text-ink-300'}`}>{it.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
