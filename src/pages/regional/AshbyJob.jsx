import '../../styles/regional/fonts.css'
import '../../styles/regional/ashby.css'
import { JOBS } from './jobs.data'

// Framer icon symbol #156361677 ("arrow left", stroke #000 1.5).
function ArrowLeft() {
  const s = { fill: 'transparent', stroke: '#000', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }
  return (
    <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
      <path d="M 5.5 0 L 0 5.25 L 5.5 10.5" {...s} transform="translate(4.75 6.75)" />
      <path d="M 14.25 0 L 0 0" {...s} transform="translate(5 12)" />
    </svg>
  )
}

function ApplyButton({ id, className }) {
  return (
    <div className={className}>
      <a className="rg-btn rg-btn-outline" href={`/ashby/${id}/submit`}><p className="rg-2mfvz6">Apply now →</p></a>
    </div>
  )
}

// /ashby/<id> — the live Framer CMS page renders the Ashby posting on a fixed 1080px black canvas that clips
// everything below (so only the top of the description is ever visible). Reproduced as-is.
export default function AshbyJob({ id }) {
  const j = JOBS[id]
  return (
    <div className="rg-ashby rg-job">
      <div className="rg-job-col">
        <div className="rg-job-head">
          <p className="rg-1ln1alt rg-wrap rg-job-meta">{j.id}</p>
          <p className="rg-1ln1alt rg-wrap rg-job-meta">{j.department}</p>
          <a className="rg-job-back" href="/" aria-label="Back"><ArrowLeft /></a>
          <h1 className="rg-h1 rg-wrap rg-job-title">{j.title}</h1>
          <p className="rg-1ln1alt rg-wrap rg-job-meta">{j.compensation || <br />}</p>
        </div>
        <h5 className="rg-voew0c rg-job-about">About</h5>
        <div className="rg-job-tagrow">
          <div className="rg-job-tags">
            {j.tags.map((t, i) => [i > 0 && <i key={`d${i}`} />, <p key={t} className="rg-1gjbdzu">{t}</p>])}
          </div>
          <ApplyButton id={id} className="rg-job-apply" />
        </div>
        <div className="rg-rt" dangerouslySetInnerHTML={{ __html: j.html }} />
        <ApplyButton id={id} className="rg-job-apply-bottom" />
        <div className="rg-job-spacer" />
      </div>
    </div>
  )
}
