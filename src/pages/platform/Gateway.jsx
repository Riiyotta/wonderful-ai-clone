import WordReveal from '../../components/WordReveal'
import { useMediaQuery } from '../../components/nav/hooks'
import { Appear, H1, H2, H3, P14, P17, P20, PillSmall } from './shared'
import FeatureGrid from './FeatureGrid'
import { GATEWAY_ICONS } from './icons'
import GatewayOverview from './gateway/GatewayOverview'
import VideoSection from './gateway/VideoSection'
import '../../styles/platform/platform.css'

// /ai-gateway — CLONE_SPEC_PLATFORM.md §1.

function Hero() {
  const isMobile = useMediaQuery('(max-width: 879.98px)')
  return (
    <section
      data-nav-theme="dark"
      data-framer-name="Hero animation"
      className="relative flex min-h-[500px] w-full flex-col items-center justify-start gap-[172px] overflow-clip px-[60px] pb-0 pt-[230px] t:min-h-[119vh] t:gap-[120px] t:px-[40px] t:pt-[150px] m:gap-[44px] m:px-[24px] m:pt-[139px]"
    >
      {/* Desktop background */}
      <div className="absolute inset-0 z-0 t:hidden m:hidden">
        <img src="/assets/SuEMXvP1lfaDApSyVoFOlU8utoE.jpg" alt="" className="block h-full w-full object-cover object-[50%_0%]" />
      </div>
      {/* Tablet / mobile background (radial mask) */}
      <div className="gw-hero-bg absolute left-0 top-0 z-0 hidden h-full w-full overflow-clip t:block m:block">
        <img src="/assets/Ae16pHbdkpEmxDY88v8IUf4RnEw.jpg" alt="" className="absolute inset-0 block h-full w-full object-cover object-center" />
      </div>
      <div className="relative z-[1] flex w-[950px] flex-col items-center justify-center gap-[24px] t:w-full t:gap-[32px] m:w-full m:gap-[32px]">
        <img src="/assets/vebmpCK8vpB9DaYCJ0iK5gxHzQ.svg" alt="Wonderful AI Gateway" className="relative z-[1] block h-auto w-[255px] flex-none object-contain t:h-[30px] t:w-auto m:aspect-[7.68] m:w-[150px]" />
        <div className="relative flex w-full flex-col items-center justify-center gap-[12px] overflow-clip t:gap-[16px] m:gap-[16px]">
          <Appear delay={0.1} className="relative z-[2] w-full max-w-[814px]">
            <h1 className={`m-0 whitespace-pre-wrap text-center text-offwhite ${H1}`}>{'A control center\nfor all enterprise AI'}</h1>
          </Appear>
          <div className="relative w-[646px] max-w-full t:w-auto m:w-full">
            <WordReveal
              as="p"
              variant="paragraph"
              onMount
              text="Run all your AI stack through one place to observe, control, and optimize it."
              className={`m-0 text-center text-offwhite [text-wrap:balance] ${P20}`}
            />
          </div>
        </div>
      </div>
      {isMobile ? (
        <div className="relative z-[2] aspect-[2.0067] w-full max-w-[1200px] flex-none overflow-clip rounded-[10px] shadow-[0_24px_60px_-12px_#00000059] [mask-image:linear-gradient(#000_40%,#0000_75%)]">
          <img src="/assets/AoyBbwo6XIWpU3yh7yn6bZ2OaI.jpg" alt="" className="absolute inset-0 block h-full w-full rounded-[10px] object-cover object-top" />
        </div>
      ) : (
        <div className="relative z-[1] w-[1200px] max-w-full flex-none t:w-full">
          <GatewayOverview />
        </div>
      )}
    </section>
  )
}

const CAPS = [
  { title: 'Universal connectivity', text: 'Third-party tools plug in as supported providers, everything else connects through the SDK, and Wonderful products connect by design.', img: 'N6OVazdmXT9IUKljrsOW2oFza5E.png', imgS: 'AnK6FDdi2gzUpNoCgRxYD0jZQs.png', fitS: 'contain', posS: '50% 0%' },
  { title: 'Centralized Usage  & Cost Control', titleM: 'Centralized Usage & Cost Control', text: 'Tracks token usage and spend across every team, so you can set budget caps and limit high-cost model use.', img: 'OJrBORgFcuCpYyquCohfyermgs8.png', imgS: 'syXUSSCc6NAtGb8Xc6JmdJlF4.png' },
  { title: 'Access Policy & Permission Management', titleT: 'Access Policy  & Permission Management', text: 'Set which teams can use which models, like keeping premium models for R&D and lighter ones for everyone else.', img: 'F2AxsODQxi1ifJ8POAS3BtaKaOU.png', imgS: 'bZQIyq72oGYGO9yU05crk4sT5OQ.png' },
  { title: 'Smart Dynamic Routing', titleT: 'Smart Dynamic\nRouting', text: 'Routes each request by task complexity,  simple tasks to smaller models,  complex ones to heavier models.', small: true, img: 'U69LUPGdbly21DD9qz3ESn8xmlM.png', imgS: 'vhpdxcQfXKf1qKpLXdY9yx4PSWw.png' },
  { title: 'Security & Privacy Protection', text: 'Inspects outgoing requests and redacts PII or sensitive data before it reaches any external vendor.', img: 'dJM3zezn0mNDS2AHbgn6GGREIG0.png', imgS: 'LHDZKpzKZPDJizaoBCu5ZPuTr4.png' },
  { title: 'Observability &  Session Analytics', text: 'Full audit logs of session and user activity, to explain cost spikes and catch improper model use.', img: 'qBvnym8V3Spyx00kFqxMTiYWhI.png', imgS: 'qBvnym8V3Spyx00kFqxMTiYWhI.png', posS: '50% 0%' },
]

function CapText({ c, bp }) {
  const title = (bp === 't' && c.titleT) || (bp === 'm' && c.titleM) || c.title
  return (
    <div className="relative flex w-full max-w-[560px] flex-col items-start gap-[12px] t:max-w-none t:px-[24px] t:pb-[24px] m:max-w-none m:px-[16px] m:pb-[16px]">
      <h3 className={`m-0 w-full whitespace-pre-wrap text-white [text-wrap:balance] ${H3}`}>{title}</h3>
      {c.small
        ? <p className="m-0 w-full whitespace-pre-wrap font-inter text-[16px] leading-[1.2] text-white/70">{c.text}</p>
        : <p className={`m-0 w-full whitespace-pre-wrap text-white/70 ${P17}`}>{c.text}</p>}
    </div>
  )
}

function Capabilities() {
  const isTablet = useMediaQuery('(min-width: 880px) and (max-width: 1439.98px)')
  const isMobile = useMediaQuery('(max-width: 879.98px)')
  const bp = isMobile ? 'm' : isTablet ? 't' : 'd'
  const rows = [CAPS.slice(0, 2), CAPS.slice(2, 4), CAPS.slice(4, 6)]
  return (
    <section id="capbility" data-nav-theme="dark" className="relative flex w-full flex-col items-center justify-start gap-[80px] bg-band px-[60px] pb-[120px] pt-[160px] t:gap-[60px] t:px-[40px] t:py-[120px] m:gap-[40px] m:px-[24px] m:pb-[84px] m:pt-[64px]">
      {bp === 'm' ? (
        <div className="relative flex w-full max-w-[1680px] flex-col items-start gap-[30px]">
          <div className="relative flex w-full flex-row items-center gap-[10px] pr-[24px]">
            <h2 className="m-0 w-full whitespace-pre-wrap font-favorit text-[32px] font-light leading-[1.05] tracking-[-0.04em] text-offwhite [font-feature-settings:'ss04','ss05']">{'AI usage is outpacing\nAI control. The gateway\nis where you get it back.'}</h2>
          </div>
          <CapIntro className="w-[351px]" />
        </div>
      ) : (
        <div className="relative flex w-full max-w-[1680px] flex-row items-start justify-between">
          <div className="relative flex w-px flex-[1_0_0] flex-row items-center gap-[10px] pr-[24px]">
            <h2 className={`m-0 w-px max-w-[790px] flex-[1_0_0] whitespace-pre-wrap text-left text-offwhite [text-wrap:balance] ${H2}`}>
              {bp === 't' ? 'AI usage is outpacing  AI control. The gateway is where you get it back.' : 'AI usage is outpacing AI control.\nThe gateway is where you get it back.'}
            </h2>
          </div>
          <CapIntro className="w-[351px] t:w-[279px]" />
        </div>
      )}
      <div className="relative flex w-full max-w-[1680px] flex-col items-center gap-[24px] m:gap-[16px]">
        {rows.map((row, ri) => (
          <div key={ri} className={`relative flex w-full flex-row items-center gap-[24px] t:items-start m:flex-col ${ri < 2 ? 'm:gap-[16px]' : 'm:gap-[24px]'}`}>
            {row.map((c) => (
              bp === 'd' ? (
                <div key={c.title} className="relative flex aspect-[1.4276] w-px flex-[1_0_0] flex-col items-start justify-end gap-[10px] overflow-clip rounded-[8px] p-[32px]">
                  <div className="absolute inset-0 rounded-[8px]">
                    <img src={`/assets/${c.img}`} alt="" className="block h-full w-full rounded-[8px] object-cover object-center" />
                  </div>
                  <CapText c={c} bp={bp} />
                </div>
              ) : (
                <div key={c.title} className="relative flex w-px flex-[1_0_0] flex-col items-start justify-start gap-[24px] overflow-clip rounded-[8px] bg-[#1e1e1e] t:h-[442px] m:w-full m:flex-none">
                  <div className="relative aspect-[1.751] w-full flex-none">
                    <img src={`/assets/${c.imgS}`} alt="" className="absolute inset-0 block h-full w-full" style={{ objectFit: c.fitS || 'cover', objectPosition: c.posS || '50% 50%' }} />
                  </div>
                  <CapText c={c} bp={bp} />
                </div>
              )
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

function CapIntro({ className = '' }) {
  return (
    <div className={`relative flex-none ${className}`}>
      <p className="m-0 whitespace-pre-wrap font-inter text-[16px] leading-[1.2] text-white/70">As companies scale their AI usage, different teams adopt different tools independently.</p>
      <p className="m-0 whitespace-pre-wrap font-inter text-[16px] leading-[1.2] text-white/70">Without a single control point, spending can spiral, and security gaps can open up.</p>
    </div>
  )
}

const BUSINESS = [
  { title: 'All AI traffic in one place', text: 'No more piecing together spend and usage from a dozen different tools and teams.' },
  { title: 'Complete visibility', text: 'Know exactly what’s being used, by whom, and what it’s costing you, without having to ask.' },
  { title: 'Cost reduction', text: 'Stop overpaying for tasks that never needed a premium model.' },
  { title: 'Control access and usage', text: 'Set who can reach which models, and never manage it team by team.' },
]

const PRODUCTS = [
  { name: 'Card Code', img: 'PbxeRt98ocw3ESBEOGvSkFl16OM.jpg', lockup: 'KPfLioy5w5ahgt9CtWgxoijuvwc.svg', alt: 'Wonderful AI OS', lockupCls: 'w-[153px] t:w-[215px] m:h-[30px] m:w-auto', text: 'The unified operating layer for the AI-native enterprise', href: '/ai-os' },
  { name: 'Card Agents', img: 'hjpNFIV0jqgolK5AlfsawzB3y7w.png', lockup: 'UIOywUdFKZG6y3aToEb8LswWffk.svg', alt: 'Wonderful Agents', lockupCls: 'h-[28px] w-auto t:h-[35px] m:h-[30px]', text: 'Engage customers, assist employees, and execute work.', textCls: 'm:w-[60%]', href: '/agents' },
  { name: 'Card Systems', img: 'VNq3SEFbm1DGqP9OAywNQSYA.png', lockup: 'm9NwXolMW9WRfbDA1Issz2oFEfA.svg', alt: 'Wonderful Systems', lockupCls: 'h-[28px] w-auto t:h-[35px] m:h-[30px]', text: 'Modernize your stack with AI-native business applications.', href: '/systems' },
]

function Products() {
  return (
    <section data-nav-theme="dark" data-framer-name="Desktop" className="relative flex w-full flex-col items-center justify-start gap-[84px] overflow-clip bg-band px-[60px] py-[120px] t:px-[40px] t:pb-[80px] m:gap-[64px] m:px-[20px] m:py-[72px]">
      <div className="relative flex w-full max-w-[1680px] flex-row items-center justify-start gap-[10px]">
        <h2 className={`m-0 w-auto max-w-[560px] text-left text-offwhite [text-wrap:balance] m:w-px m:max-w-full m:flex-[1_0_0] ${H2}`}>Transform the way you work on a unified platform</h2>
      </div>
      <div className="relative flex w-full max-w-[1680px] flex-row items-start justify-start gap-[16px] t:grid t:grid-cols-1 t:grid-rows-[repeat(4,min-content)] m:flex-col m:gap-[12px]">
        {PRODUCTS.map((c) => (
          <div key={c.name} data-framer-name={c.name} className="relative flex aspect-[.697297] w-px flex-[1_0_0] cursor-pointer flex-col items-center justify-start gap-[12px] overflow-clip rounded-[8px] px-[20px] py-[28px] t:aspect-auto t:h-[350px] t:w-full t:flex-none m:aspect-[.813953] m:w-full m:flex-none">
            <div className="absolute inset-0 rounded-[8px]">
              <img src={`/assets/${c.img}`} alt="" className="block h-full w-full rounded-[8px] object-cover object-center" />
            </div>
            <div className="relative h-px w-full flex-[1.4_0_0]" />
            <img src={`/assets/${c.lockup}`} alt={c.alt} className={`relative block flex-none object-contain ${c.lockupCls}`} />
            <div className="relative h-px w-full flex-[1_0_0]" />
            <p className={`relative m-0 w-full max-w-[218px] text-center text-offwhite [text-wrap:balance] ${P14} ${c.textCls || 'm:w-[80%]'}`}>{c.text}</p>
            <PillSmall href={c.href} className="relative w-[80px]">Explore</PillSmall>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function Gateway() {
  return (
    <div className="relative flex w-full flex-col items-center overflow-clip bg-band">
      <Hero />
      <VideoSection />
      <Capabilities />
      <FeatureGrid id="black" theme="dark" title="What it means for your business" items={BUSINESS} icons={GATEWAY_ICONS} maxW={1680} lastNoStretch />
      <div className="relative flex w-full flex-col items-center justify-center overflow-clip bg-band px-[60px] t:px-[40px] m:px-[24px]">
        <div className="relative h-px w-full bg-white/[.18]" />
      </div>
      <Products />
    </div>
  )
}
