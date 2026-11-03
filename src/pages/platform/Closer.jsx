import { Appear, H2, PillButton } from './shared'

// "Transform your operating model with Wonderful." closing band (deployment + ai-transformation).
// 640 tall, padding 160/60 (tablet 160/40); title 660 wide (max 50%), tablet 549, mobile 370 (overhangs the gutter).
// Appear: title opacity spring 200/60 delay .5; button tween .6s delay .5 (Framer appear ids n8u65z/1s5g849).
export default function Closer({ image, imagePosition = '50% 50%', mask, variant = 'deployment' }) {
  const isTransformation = variant === 'transformation'
  const content = (
    <div className="relative z-[1] flex w-full max-w-[1680px] flex-col items-center gap-[32px]">
      <div className="relative flex w-full flex-col items-center justify-center gap-[24px] overflow-clip">
        <Appear delay={0.5} className="relative z-0 w-[660px] max-w-[50%] t:w-[549px] t:max-w-none m:w-[370px] m:max-w-none">
          <h2 className={`m-0 text-center text-offwhite [text-wrap:balance] ${H2}`}>Transform your operating model with Wonderful.</h2>
        </Appear>
      </div>
      <Appear delay={0.5} tween className="relative">
        <PillButton href="/contact" className="w-[140px]">Get in touch</PillButton>
      </Appear>
    </div>
  )
  const bg = (
    <div className="absolute inset-0 overflow-clip" style={mask ? { WebkitMaskImage: mask, maskImage: mask } : undefined}>
      <img src={image} alt="" className="absolute inset-0 block h-full w-full object-cover" style={{ objectPosition: imagePosition }} />
    </div>
  )
  if (isTransformation) {
    return (
      <section id="closer" data-nav-theme="dark" className="relative flex h-[640px] w-full flex-col items-center justify-center gap-[60px] overflow-hidden px-[60px] py-[160px] t:px-[40px] m:p-0">
        <div className="absolute left-0 top-0 z-[1] flex h-full w-full flex-col items-center justify-center gap-[60px] overflow-hidden px-[60px] py-[160px] t:px-[40px] m:relative m:h-px m:flex-[1_0_0] m:px-[24px] m:py-0">
          {content}
        </div>
        {bg}
      </section>
    )
  }
  return (
    <section id="closer" data-nav-theme="dark" className="relative flex h-[640px] w-full flex-col items-center justify-center gap-[60px] overflow-hidden px-[60px] py-[160px] t:px-[40px] m:h-auto m:px-[24px] m:py-[120px]">
      {bg}
      {content}
    </section>
  )
}
