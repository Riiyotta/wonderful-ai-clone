import logo from './fcb-footer-logo.svg'

// "LP Footer" of the FC Bayern landing pages (Framer component, not the site footer).
export default function FcbFooter({ variant }) {
  return (
    <footer className={`fcb-footer${variant ? ` is-${variant}` : ''}`}>
      <div className="fcb-footer-in">
        <div className="fcb-footer-top">
          <div className="fcb-footer-left">
            <a className="fcb-footer-logo" href="/" aria-label="Wonderful"><img src={logo} alt="" /></a>
            <p className="fcb-copy">© 2026 Wonderful, Inc.</p>
          </div>
          <div className="fcb-footer-right">
            <div className="fcb-social">
              <p><a href="/legal">Legal Policies </a></p>
              <div className="fcb-social-div" />
              <p style={{ color: 'rgba(255,255,255,0.8)' }}><a href="/legal/privacy">Privacy Policy</a></p>
            </div>
          </div>
        </div>
        <div className="fcb-wordmark-box">
          <div className="fcb-wordmark"><img src="/assets/EfwFwuoTD4PdYVDGaAhoN1b4ns.png" alt="" /></div>
        </div>
      </div>
    </footer>
  )
}
