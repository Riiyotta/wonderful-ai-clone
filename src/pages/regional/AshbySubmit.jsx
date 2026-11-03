import '../../styles/regional/fonts.css'
import '../../styles/regional/ashby.css'
import AshbyApplicationForm from './AshbyApplicationForm'

// /ashby/<id>/submit — live embeds jobs.ashbyhq.com/Wonderful/<id>/application in a 779x1059 iframe under a "< Go back" link.
// The clone renders a local stand-in for the Ashby form in the same box; it never submits anywhere.
export default function AshbySubmit({ id }) {
  return (
    <div className="rg-ashby rg-apply">
      <div className="rg-apply-frame">
        <AshbyApplicationForm id={id} />
      </div>
      <div className="rg-apply-back">
        <div><p className="rg-1gjbdzu"><a href={`/ashby/${id}`}>{'< Go back'}</a></p></div>
      </div>
    </div>
  )
}
