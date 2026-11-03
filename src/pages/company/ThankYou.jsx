import '../../styles/company/common.css'
import '../../styles/company/thankyou.css'
import WordReveal from '../../components/WordReveal'
import { Appear, SPRING_PARA, durationSpring } from './sections/motion'
import { TWEEN_FADE } from '../../lib/spring'

// /thank-you (CLONE_SPEC_COMPANY §5). Light page; nav stays in its frosted "Desktop" variant.
const POSTS = [
  { href: '/blog-articles/kpn-ventures-and-wonderful-announce-strategic-partnership', img: 'DpdxHOKqPNBTasD1gCcIkyODx7I.png', title: 'Announcing our strategic partnership with KPN Ventures', date: 'Oct 22, 2026', iso: '2026-10-22' },
  { href: '/blog-articles/wonderful-agents-can-now-work-with-your-customers-agents', img: 'uygCDa20eKTI8LOILfVFQ8oxUdc.png', title: 'Wonderful agents can now work with your customers’ agents', date: 'Oct 12, 2026', iso: '2026-10-12' },
  { href: '/blog-articles/wonderful-united-kingdom', img: '9EgqtaeUa7bhyaRXbn7p8Umnfag.png', title: 'Wonderful launches in the UK ', date: 'Sep 22, 2026', iso: '2026-09-22' },
  // tablet-only 4th card (the tablet variant's CMS list has 4 items)
  { href: '/blog-articles/let-the-field-build-the-product', img: 'ic4FBzjROphJUcujluPKILebdzA.jpg', title: 'Let the Field Build the Product', date: 'Sep 17, 2026', iso: '2026-09-17', tabletOnly: true },
]

// Image appear (h4me46): opacity .001 -> 1, spring bounce .2 / .4s, on view.
const IMG_SPRING = durationSpring(0.4, 0.2)

function PostCard({ p }) {
  return (
    <a href={p.href} className="cty-card">
      <div className="cty-card-in" data-framer-name="Card">
        <Appear className="cty-card-img" ease={IMG_SPRING}>
          <img src={`/assets/${p.img}`} alt="" loading="lazy" decoding="async" />
        </Appear>
        <div className="cty-card-text">
          <h4 className="cty-card-h4 co-favorit">{p.title}</h4>
          <p className="cty-meta co-inter"><time dateTime={`${p.iso}T00:00:00.000Z`}>{p.date}</time></p>
        </div>
      </div>
    </a>
  )
}

export default function ThankYou() {
  return (
    <section className="cty-section" data-framer-name="Container">
      <div className="cty-top" data-framer-name="Tag & Title">
        {/* Two looping orb videos; live ships them with preload="none" and no autoplay, so they paint nothing. */}
        <div className="cty-orbs" aria-hidden="true">
          <div className="cty-orb cty-orb--back"><video src="/videos/p9SLwNW1RVbrau3RWgus9WOxM.mp4" loop preload="none" muted playsInline /></div>
          <div className="cty-orb cty-orb--front"><video src="/videos/p9SLwNW1RVbrau3RWgus9WOxM.mp4" loop preload="none" muted playsInline /></div>
        </div>
        <div className="cty-copy">
          <Appear as="h1" mode="mount" className="cty-h1 co-favorit" from={{ opacity: 0.001, y: 10, blur: 10 }} ease={SPRING_PARA}>
            {'Thank you! '}<br />{"We'll be in touch soon. "}
          </Appear>
          <WordReveal as="p" variant="paragraph" onMount className="cty-sub co-inter" text="A member of our team will follow up with you to continue the conversation." />
        </div>
        <Appear mode="mount" delay={0.5} ease={{ duration: 0.6, easing: TWEEN_FADE }}>
          <a href="/" className="co-pill co-pill--l co-pill--black"><span className="co-btn-l">Back to Homepage</span></a>
        </Appear>
      </div>
      <div className="cty-blog">
        <div className="cty-title" data-framer-name="Title">
          <h3 className="cty-h3 co-favorit">From our blog</h3>
          <p className="cty-meta co-inter">Stories, announcements, and product updates.</p>
        </div>
        <div className="cty-grid">
          {POSTS.map((p) => (
            <div key={p.href + (p.tabletOnly ? '-t' : '')} className={p.tabletOnly ? 'cty-v-t' : 'contents'}>
              <PostCard p={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
