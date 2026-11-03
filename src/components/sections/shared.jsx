import WordReveal from '../WordReveal'

// H2 section preset (Framer 190xti5, CLONE_SPEC §0): D 48/1.05/-.04em, 880–1199 42/1.15/-.04em, M 34/1.15/-.05em; pad-bottom 3px.
export const H2_SECTION =
  'font-favorit font-light text-[48px] leading-[1.05] tracking-[-0.04em] pb-[3px] [font-feature-settings:"ss04","ss05"] ' +
  '[@media(min-width:880px)_and_(max-width:1199.98px)]:text-[42px] [@media(min-width:880px)_and_(max-width:1199.98px)]:leading-[1.15] ' +
  'm:text-[34px] m:leading-[1.15] m:tracking-[-0.05em]'

// Body 17 preset (1ln1alt): Inter 17/21.76/-0.34, features blwf cv03 cv04 cv09.
export const P_17 = 'font-inter font-normal text-[17px] leading-[21.76px] tracking-[-0.34px] [font-feature-settings:"blwf","cv03","cv04","cv09"]'

// Heading with forced line breaks (the Framer copy uses <br>): one WordReveal, so every line shares the
// heading's single in-view trigger and the 50ms stagger runs straight across lines.
export function LinedHeading({ as = 'h2', lines, className, variant = 'heading' }) {
  return <WordReveal as={as} variant={variant} text={lines.join('\n')} className={className} />
}

// Phosphor "ArrowRight" (regular), verbatim path from the saved Framer page (closer card buttons).
export function PhosphorArrowRight({ className, style }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" focusable="false" className={className} style={style} fill="currentColor" aria-hidden="true">
      <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
    </svg>
  )
}
