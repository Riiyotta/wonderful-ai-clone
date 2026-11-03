import '../../styles/industries/fonts.css'
import '../../styles/industries/industry.css'
import IndustryHero from './sections/IndustryHero'
import LogoStrip from './sections/LogoStrip'
import Transform from './sections/Transform'
import VideoSection from './sections/VideoSection'
import Workflows from './sections/Workflows'
import WhyChoose from './sections/WhyChoose'
import ClosingCta from './sections/ClosingCta'

// One template for every /industries/<slug> CMS page (content in data/industries.js).
export default function IndustryPage({ data }) {
  return (
    <div className="inx-page" data-framer-name={`Industry / ${data.hero.h1}`}>
      <IndustryHero hero={data.hero} />
      <LogoStrip logos={data.logos} />
      <Transform data={data.transform} />
      {data.video && <VideoSection data={data.video} />}
      <Workflows data={data.workflows} />
      <WhyChoose data={data.why} />
      <ClosingCta />
    </div>
  )
}
