import ProductHero from './shared/ProductHero'
import ProductCards from './shared/ProductCards'
import Divider from './shared/Divider'
import AiOsLattice from './aios/Lattice'
import Infra from './aios/Infra'
import Advantage from './aios/Advantage'
import Enterprise from './aios/Enterprise'
import Cta from './aios/Cta'

export default function AiOs() {
  return (
    <div className="bg-band">
      <ProductHero
        bg="pSVbsZmruo4dUyaEMkXlB0yjq8.png"
        bgCls="aios-hero-mask"
        heightCls="h-[95vh] min-h-[500px] t:h-[90vh] m:h-[100vh]"
        wordmark={{ src: 'KPfLioy5w5ahgt9CtWgxoijuvwc.svg', cls: 'h-[31px] w-[193px] m:h-auto m:w-[150px] m:[aspect-ratio:6.226]' }}
        title="One AI-native operating layer for employees, agents and apps."
        titleMax="max-w-[800px]"
      >
        <AiOsLattice />
      </ProductHero>
      <Infra />
      <Divider />
      <ProductCards current="ai-os" />
      <Divider />
      <Advantage />
      <Enterprise />
      <Cta />
    </div>
  )
}
