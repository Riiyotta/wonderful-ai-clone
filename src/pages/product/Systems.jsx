import ProductHero from './shared/ProductHero'
import ProductCards from './shared/ProductCards'
import Adapts from './systems/Adapts'
import Helps from './systems/Helps'
import Replace from './systems/Replace'
import Deployed from './systems/Deployed'
import '../../styles/product/systems.css'

function SysDivider() {
  return <div className="sys-divider" data-nav-theme="dark"><div /></div>
}

export default function Systems() {
  return (
    <>
      <ProductHero
        bg="WIqIBOiTiPsV4nkZyfqf1D6tCkc.jpg"
        bgCls="sys-hero-bg"
        wordmark={{ src: 'm9NwXolMW9WRfbDA1Issz2oFEfA.svg', cls: 'h-[31px] w-[210px] t:h-[30px] t:w-auto t:[aspect-ratio:6.787878787878788] m:h-auto m:w-[150px] m:[aspect-ratio:6.8]' }}
        title="Replace legacy software with software built for the way you work."
        titleMax="max-w-[992px]"
        sub="AI-native software, designed, built, and run by Wonderful, shaped entirely around how you work."
        subMax="max-w-[491px]"
      />
      <Adapts />
      <Helps />
      <SysDivider />
      <Replace />
      <Deployed />
      <ProductCards current="systems" />
    </>
  )
}
