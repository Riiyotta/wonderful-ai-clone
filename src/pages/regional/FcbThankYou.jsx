import '../../styles/regional/fcb.css'
import FcbFooter from './FcbFooter'

// /fcb/x/thank-you — where the matchday registration form redirects on success (live: Framer Forms redirectUrl).
export default function FcbThankYou() {
  return (
    <div className="fcb">
      <section className="fcbty">
        <div className="fcbty-video">
          <img src="/assets/LYhbXOcYYdmLM6Fv1rMR9qCXLQ.jpg" alt="" />
          <video src="/videos/ur7EFJT7kTZwKW97oSIyVvLWlc.mp4" poster="/assets/UXC4o0fmbdx7L3Crj6lYZi8wpQE.png" autoPlay loop muted playsInline preload="auto" />
          <div className="fcbty-fade" />
        </div>
        <div className="fcbty-text">
          <h1 className="fcb-h1 fcbty-title">Thank you for registering.</h1>
          <div className="fcbty-ps">
            <p className="fcb-o1ogpi fcb-wrap">You’re on the list. As seats in the Sponsor Lounge are limited, we review every registration before issuing tickets.</p>
            <p className="fcb-o1ogpi fcb-wrap">You’ll receive a confirmation email shortly with your ticket and all access details for the evening.</p>
          </div>
        </div>
      </section>
      <div className="fcbty-divider"><div /></div>
      <FcbFooter variant="ty" />
    </div>
  )
}
