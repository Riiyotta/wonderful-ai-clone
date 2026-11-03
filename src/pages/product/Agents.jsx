import ProductHero from './shared/ProductHero'
import ProductCards from './shared/ProductCards'
import Divider from './shared/Divider'
import UseCards from './agents/UseCards'
import RealWork from './agents/RealWork'
import AgentCases from './agents/AgentCases'
import Teams from './agents/Teams'

export default function Agents() {
  return (
    <>
      <ProductHero
        bg="lOzB6A2mLfsIG1Nzz1sMZpI9jCw.jpg"
        wordmark={{ src: 'UIOywUdFKZG6y3aToEb8LswWffk.svg', cls: 'h-[29px] w-[181px] m:h-auto m:w-[150px] m:[aspect-ratio:6.24138]' }}
        title="Deploy agents anywhere work happens"
        titleT={'Deploy agents anywhere\nwork happens'}
        titleMax="max-w-[707px]"
        sub="Wonderful agents engage customers, assist employees, and execute work."
        subMax="max-w-[70%]"
      />
      <UseCards />
      <RealWork />
      <Divider />
      <AgentCases />
      <Teams />
      <ProductCards current="agents" />
    </>
  )
}
