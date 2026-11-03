import '../styles/clients.css'
import WordReveal from './WordReveal'

// §2.2 order: row 1 = TFjZ, fxHL, EWpQ, WnKj, zXjo, Tsd5; row 2 = 0Ya2, Im5O, IG5k, Wjw2, xi8l, LxO1.
const LOGOS = [
  'TFjZnXFloDtxC1p08weXNXVqFY.png',
  'fxHL7asSKuJh27ATTpnxFOKfw.svg',
  'EWpQ141QyQFR2RsfZsg6caa0.svg',
  'WnKjt6r3cQaMTIfvEt5Z1K3F1uA.png',
  'zXjobWcE6Vd4mCUanzbNiDh5Hms.png',
  'Tsd5x3ht3N31Src77paQLPv6WNE.svg',
  '0Ya2hZThhuFRqJwsRcnw7jJV9k4.svg',
  'Im5OtStOiVceudsq4fD6AUvuDM.png',
  'IG5kvCgZvUw4X5HwUCu4elE.png',
  'Wjw29w355ypIJNyUetXJ6NoreVQ.png',
  'xi8ls77EHbDCy3SicCENW6AXk.png',
  'LxO1hRMb7JfTIE1PgnuEHkKB0a8.svg',
]

// "Client Card": bg #fafafa, radius 4, column centered; logo wrapper opacity .47, aspect 2.15, img contain.
// Tablet (880-1439, live at 1100): logos are 100% of the 166.7px card, except WnKj and the slot-10 logo,
// which stay 170px; slot 10 shows K6mHex instead of Wjw2 on tablet.
const FIXED_170_ON_TABLET = new Set(['WnKjt6r3cQaMTIfvEt5Z1K3F1uA.png'])
const TABLET_SWAP = { 'Wjw29w355ypIJNyUetXJ6NoreVQ.png': 'K6mHex5vQyCWRJumZm2EkkOxCvQ.png' }

function ClientCard({ file, mobile }) {
  const tabletFile = !mobile && TABLET_SWAP[file]
  const fixed = FIXED_170_ON_TABLET.has(file) || tabletFile
  const w = mobile ? 'aspect-[2.15] w-full' : `aspect-[2.15] w-[170px] ${fixed ? '' : 't:w-full'}`
  return (
    <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[4px] bg-offwhite">
      <div className={`relative flex-none opacity-[0.47] ${w}`}>
        <img src={`/assets/${file}`} alt="" loading="lazy" className={`absolute inset-0 block h-full w-full object-contain object-center ${tabletFile ? 't:hidden' : ''}`} />
        {tabletFile && <img src={`/assets/${tabletFile}`} alt="" loading="lazy" className="absolute inset-0 hidden h-full w-full object-contain object-center t:block" />}
      </div>
    </div>
  )
}

export default function Clients() {
  return (
    <section
      id="logos"
      data-framer-name="Section Clients"
      className="relative mx-auto flex w-full max-w-[1680px] flex-col items-center justify-start gap-[42px] overflow-hidden px-[60px] pb-0 pt-[80px] t:px-[40px] m:px-[24px] m:py-[60px] [@media(min-width:1800px)]:max-w-none [@media(min-width:1800px)]:gap-[64px] [@media(min-width:1800px)]:pt-[120px]"
    >
      <div className="relative w-full flex-none [@media(min-width:1800px)]:max-w-[1680px]">
        <WordReveal as="h2" text="Trusted by leading enterprises across industries" variant="heading" className="clients-h2" />
      </div>

      {/* Container - Desktop: 2 rows x 6, gap 4, cards flex 1 x 80 */}
      <div className="relative flex w-full flex-none flex-col items-start gap-[4px] overflow-hidden m:hidden [@media(min-width:1800px)]:max-w-[1680px]">
        {[LOGOS.slice(0, 6), LOGOS.slice(6)].map((row, r) => (
          <div key={r} className="relative flex w-full flex-none flex-row items-center justify-center gap-[4px] overflow-hidden">
            {row.map((f) => (
              <div key={f} className="relative h-[80px] w-px flex-[1_0_0]">
                <ClientCard file={f} />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Container - Mobile: 3 cols x 4 rows of 80, gap 4 */}
      <div className="hidden w-full grid-cols-3 grid-rows-[repeat(4,80px)] gap-[4px] m:grid">
        {LOGOS.map((f) => (
          <div key={f} className="relative h-[80px] w-full">
            <ClientCard file={f} mobile />
          </div>
        ))}
      </div>

      {/* empty 40px spacer (desktop only) */}
      <div className="relative h-[40px] w-full flex-none overflow-clip m:hidden [@media(min-width:1800px)]:max-w-[1680px]" />
    </section>
  )
}
