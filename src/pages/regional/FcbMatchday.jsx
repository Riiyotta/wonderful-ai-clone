import { useNavigate } from 'react-router-dom'
import '../../styles/regional/fcb.css'
import { FCB_MATCHES, FCB_CARDS } from './fcb.data'
import FcbFooter from './FcbFooter'

// Framer icon symbols #2588847244 (calendar) and #4082020113 (pin), verbatim; stroke = token #777, width 1.5.
const STROKE = { fill: 'transparent', stroke: '#777', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }
function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
      <path d="M 0 4.5 L 16.5 4.5 L 16.5 0.75 C 16.5 0.336 16.164 0 15.75 0 L 0.75 0 C 0.336 0 0 0.336 0 0.75 Z" fill="#777" fillOpacity="0" transform="translate(3.75 3.75)" />
      <path d="M 0.75 16.5 C 0.336 16.5 0 16.164 0 15.75 L 0 0.75 C 0 0.336 0.336 0 0.75 0 L 15.75 0 C 16.164 0 16.5 0.336 16.5 0.75 L 16.5 15.75 C 16.5 16.164 16.164 16.5 15.75 16.5 Z" {...STROKE} transform="translate(3.75 3.75)" />
      <path d="M 0 0 L 0 3" {...STROKE} transform="translate(16.5 2.25)" />
      <path d="M 0 0 L 0 3" {...STROKE} transform="translate(7.5 2.25)" />
      <path d="M 0 0 L 16.5 0" {...STROKE} transform="translate(3.75 8.25)" />
    </svg>
  )
}
function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
      <path d="M 0 3 C 0 1.343 1.343 0 3 0 C 4.657 0 6 1.343 6 3 C 6 4.657 4.657 6 3 6 C 1.343 6 0 4.657 0 3 Z" fill="#777" fillOpacity="0" transform="translate(9 3)" />
      <path d="M 0 3 C 0 1.343 1.343 0 3 0 C 4.657 0 6 1.343 6 3 C 6 4.657 4.657 6 3 6 C 1.343 6 0 4.657 0 3 Z" {...STROKE} transform="translate(9 3)" />
      <path d="M 0 0 L 0 7.5" {...STROKE} transform="translate(12 9)" />
      <path d="M 13.5 0 C 17.023 0.563 19.5 1.902 19.5 3.462 C 19.5 5.533 15.135 7.212 9.75 7.212 C 4.365 7.212 0 5.533 0 3.462 C 0 1.902 2.477 0.564 6 0" {...STROKE} transform="translate(2.25 13.038)" />
    </svg>
  )
}

// Framer "fit text": an SVG whose viewBox is the text's natural box, scaled to the container width (one per breakpoint).
const INFO_TITLES = [
  { v: 'd', vb: '0 0 1208.46 241', fs: 241 },
  { v: 't', vb: '0 0 800 159.5', fs: 159.5744680851064 },
  { v: 'm', vb: '0 0 320.84 64', fs: 64 },
]

function Field({ label, name, type = 'text', placeholder }) {
  return (
    <label className="fcb-field">
      <p className="fcb-x0s9r5 fcb-wrap">{label}</p>
      <div className="fcb-input">
        <input type={type} required name={name} placeholder={placeholder} />
      </div>
    </label>
  )
}

export default function FcbMatchday({ slug }) {
  const m = FCB_MATCHES[slug]
  const navigate = useNavigate()
  const toRegister = (e) => {
    e.preventDefault()
    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })
  }
  // Live posts to Framer Forms, then redirects to /fcb/x/thank-you. The clone never sends the data anywhere.
  const onSubmit = (e) => { e.preventDefault(); navigate('/fcb/x/thank-you') }
  return (
    <div className="fcb">
      <section className="fcb-hero">
        <div className="fcb-hero-content">
          <div className="fcb-lockup">
            <div className="fcb-crest"><img src="/assets/6cKN5QhpxMqywH8AgpxaZDLfasw.svg" alt="" /></div>
            <div className="fcb-lockup-div" />
            <a className="fcb-logo" href="/" aria-label="Wonderful"><img src="/assets/1sdEwML79OyrKXwjFNp4yg0QoNw.svg" alt="" /></a>
          </div>
          <div className="fcb-hero-text">
            <div className="fcb-title-block">
              <h1 className="fcb-h1 fcb-headline">{'One match. One seat.\nA room with your peers.'}</h1>
              <p className="fcb-o1ogpi fcb-wrap fcb-subhead fcb-only-d">An evening in the Sponsor Lounge at the Allianz Arena for a small circle of CXOs, hosted by Wonderful, the new official enterprise AI partner of FC Bayern Munich.</p>
              <p className="fcb-1ln1alt fcb-wrap fcb-subhead fcb-only-m">An evening in the Sponsor Lounge at the Allianz Arena for a small circle of CXOs, hosted by Wonderful, the new official enterprise AI partner of FC Bayern Munich.</p>
            </div>
            <div className="fcb-details">
              <p className="fcb-1ln1alt fcb-wrap fcb-matchline fcb-only-d">{m.matchLine}</p>
              <p className="fcb-x0s9r5 fcb-wrap fcb-matchline fcb-only-m">{m.matchLine}</p>
              <a className="fcb-cta" href={`/fcb/x/${slug}#register`} onClick={toRegister}>
                <p className="fcb-x0s9r5">Request my seat</p>
              </a>
            </div>
          </div>
        </div>
        <div className="fcb-hero-bg"><img src="/assets/wGADBOCXmWArpjLhfMucrLjYo.jpg" alt="" /></div>
      </section>

      <section className="fcb-reg" id="register">
        <div className="fcb-reg-row">
          <div className="fcb-reg-content">
            <div className="fcb-reg-intro">
              <div className="fcb-reg-titles">
                <p className="fcb-1b18csx fcb-wrap fcb-game">{m.game}</p>
                <h1 className="fcb-h1 fcb-form-title">Request my seat</h1>
              </div>
              <p className="fcb-o1ogpi fcb-wrap fcb-desc fcb-only-d"><span>Seats are limited and allocated</span><br /><span>on a first-confirmed basis.</span></p>
              <p className="fcb-1ln1alt fcb-wrap fcb-desc fcb-only-m"><span>Seats are limited and allocated</span><br /><span>on a first-confirmed basis.</span></p>
            </div>
            <div className="fcb-facts">
              <div className="fcb-fact">
                <CalendarIcon />
                <p className="fcb-1wstu17 fcb-wrap">{m.date.map((t, i) => <span key={i}>{i > 0 && <br />}{t}</span>)}</p>
              </div>
              <div className="fcb-fact">
                <PinIcon />
                <p className="fcb-1ln1alt fcb-wrap">Sponsor Lounge, Allianz Arena</p>
              </div>
            </div>
          </div>
          <div className="fcb-form-col">
            <form className="fcb-form" method="post" onSubmit={onSubmit}>
              <input type="hidden" name="Game" value={m.game} />
              <div className="fcb-fields">
                <Field label="Full Name *" name="Full Name" placeholder="First name and last name" />
                <Field label="Email *" name="Email" type="email" placeholder="Email Address" />
                <Field label="Company *" name="Company" placeholder="Company Name" />
                <Field label="Title *" name="Title" placeholder="Work Title" />
              </div>
              <p className="fcb-x0s9r5 fcb-wrap fcb-disclaimer">We store and process this data in this form to respond to your request. For more information on how we use data, please refer to our <a href="/legal/privacy">Privacy Policy</a>.</p>
              <button className="fcb-submit" type="submit" name="Submit"><p className="fcb-1b18csx">Request my seat</p></button>
            </form>
          </div>
        </div>
      </section>

      <section className="fcb-info">
        <div className="fcb-pitch"><img src="/assets/CftprAIM2YImlUloxmaaOyx7SYc.png" alt="" /></div>
        <div className="fcb-info-inner">
          <div className="fcb-info-content">
            <div className="fcb-scroller">
              <div className="fcb-cards">
                <div className="fcb-edge" />
                {FCB_CARDS(m).map((c) => (
                  <div className="fcb-card" key={c.title}>
                    <img src={c.img} alt="" />
                    <h3 className="fcb-card-title fcb-wrap">{c.title}</h3>
                    <p className="fcb-card-body fcb-wrap">{c.body}</p>
                  </div>
                ))}
                <div className="fcb-edge" />
              </div>
            </div>
          </div>
          {INFO_TITLES.map((t) => (
            <svg key={t.v} className={`fcb-info-title v-${t.v}`} viewBox={t.vb}>
              <foreignObject width="100%" height="100%" style={{ overflow: 'visible' }}>
                <h2 style={{ fontSize: `${t.fs}px` }}>Practical info</h2>
              </foreignObject>
            </svg>
          ))}
        </div>
      </section>

      <FcbFooter />
    </div>
  )
}
