import '../../styles/regional/ashby.css'
import WordReveal from '../../components/WordReveal'
import { springEase } from '../../lib/spring'
import { useAppeared, fadeAppear } from './appear'

// /ashby renders wonderful.ai's Framer 404 page ("Page Not Found in Data").
// Motion (live, from load): title fades (~0.65s spring), button fades in at +0.63s, then the body copy
// reveals word by word (blur 10 / y 10, 50ms stagger) from +1.04s. The gradient blob spins forever.
const SPRING_TITLE = springEase({ stiffness: 36, damping: 12 })
const SPRING_BTN = springEase({ stiffness: 49, damping: 14 })
const BODY_D = 'Oops! The web page you’re looking for doesn’t\n exist. Please click the below button to get back to the home.'
const BODY_M = 'Oops! The web page you’re looking for doesn’t exist. Please click the below button to get back to the home.'

export default function Ashby404() {
  const on = useAppeared()
  return (
    <div className="rg-404">
      <section className="rg-404-hero">
        <div className="rg-404-spacer" />
        <div className="rg-404-container">
          <div className="rg-404-content">
            <div className="rg-404-text">
              <div style={{ width: '100%', ...fadeAppear(on, { spring: SPRING_TITLE }) }}>
                <h1 className="rg-h1 rg-404-title rg-404-only-d" style={{ margin: 0 }}>404 - Oops Page Not Found in Data.</h1>
                <h1 className="rg-h1 rg-404-title rg-404-title-m rg-404-only-m" style={{ margin: 0 }}>404 - Oops Page Not Found in Data.</h1>
              </div>
              <div className="rg-404-body">
                <WordReveal as="p" variant="paragraph" onMount delay={1.04} text={BODY_D} className="rg-x0s9r5 rg-wrap rg-404-only-d" />
                <WordReveal as="p" variant="paragraph" onMount delay={1.04} text={BODY_M} className="rg-x0s9r5 rg-wrap rg-404-only-m" />
              </div>
            </div>
            <div className="rg-404-btnrow" style={fadeAppear(on, { spring: SPRING_BTN, delay: 0.63 })}>
              <a className="rg-btn rg-btn-black" href="/"><p className="rg-2mfvz6">Back To Homepage</p></a>
            </div>
          </div>
        </div>
        <div className="rg-404-blob" aria-hidden="true">
          <div>
            <div className="rg-blob rg-blob-1"><div className="rg-conic rg-conic-1"><i /></div></div>
            <div className="rg-blob rg-blob-2" />
            <div className="rg-blob rg-blob-3"><div className="rg-conic rg-conic-3" /></div>
          </div>
        </div>
      </section>
    </div>
  )
}
