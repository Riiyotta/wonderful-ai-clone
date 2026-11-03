import '../../../styles/product/product.css'

// Framer "Divider": #080808 band, 1px rgba(255,255,255,.18) line inset 24px (systems uses 60px).
export default function Divider({ inset = 24 }) {
  return (
    <div className="pr-divider" style={{ paddingLeft: inset, paddingRight: inset }} data-nav-theme="dark">
      <div />
    </div>
  )
}
