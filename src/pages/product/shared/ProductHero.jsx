import WordReveal from '../../../components/WordReveal'
import Appear from './Appear'
import '../../../styles/product/product.css'

// Product hero ("Hero animation"): full-bleed image, wordmark lockup, H1 (appear: opacity spring 200/60, delay .1),
// optional sub paragraph (word reveal on mount, preset o1ogpi, text-wrap balance).
// Heights: D 95vh (min 500); T 80vh (/ai-os 90vh); M 90vh (/ai-os 100vh).
export default function ProductHero({ bg, bgCls = "", wordmark, title, titleMax, titleT, sub, subMax, children, heightCls }) {
  return (
    <section
      data-nav-theme="dark"
      className={`relative flex w-full flex-col items-center justify-center gap-[120px] overflow-clip px-[60px] pt-[24px]
        t:px-[40px] t:pt-0 m:gap-[44px] m:px-[24px] m:pt-0 ${heightCls || 'h-[95vh] min-h-[500px] t:h-[80vh] m:h-[90vh]'}`}
    >
      <div className="relative flex w-[950px] flex-col items-center justify-center gap-[24px] t:w-full t:gap-[32px] m:w-full m:gap-[32px]">
        <div className={`relative z-[1] flex-none ${wordmark.cls}`}>
          <img src={`/assets/${wordmark.src}`} alt="" className="absolute inset-0 block h-full w-full object-contain object-center" />
        </div>
        <div className={`relative flex w-full flex-col items-center justify-center gap-[12px] t:gap-[16px] m:gap-[16px] ${sub ? 'overflow-clip' : ''}`}>
          <Appear className={`relative z-[2] w-full whitespace-pre-wrap break-words [will-change:transform] ${titleMax}`}>
            {titleT ? (
              <>
                <h1 className="pr-h1 t:hidden">{title}</h1>
                <h1 className="pr-h1 hidden t:block">{titleT}</h1>
              </>
            ) : (
              <h1 className="pr-h1">{title}</h1>
            )}
          </Appear>
          {sub && (
            <div className={`relative z-[2] w-full [text-wrap:balance] m:max-w-full ${subMax}`}>
              <WordReveal as="p" text={sub} variant="paragraph" onMount className="pr-p20 text-center text-[#fafafa]" />
            </div>
          )}
        </div>
      </div>
      {children}
      <div className={`absolute left-0 top-0 z-0 h-full w-full overflow-clip ${bgCls}`}>
        <div className="absolute inset-0">
          <img src={`/assets/${bg}`} alt="" className="block h-full w-full object-cover object-center" />
        </div>
      </div>
    </section>
  )
}
