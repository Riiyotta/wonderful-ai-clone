import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { JOBS } from './jobs.data'
import logo from './wonderful-logo-dark.svg'

// Local stand-in for the jobs.ashbyhq.com application page that live loads in the 779x1059 iframe.
// NOTE (CLONE_SPEC_REGIONAL.md §5): jobs.ashbyhq.com is blocked by this network's policy (Netskope "Job Websites"),
// so the live form could not be inspected; this follows Ashby's default hosted job-board layout and is NOT measured.
// It never sends data anywhere: submit validates locally and routes to /thank-you.
const FIELDS = [
  { label: 'Name', name: 'name', type: 'text', required: true, placeholder: 'Type here...' },
  { label: 'Email', name: 'email', type: 'email', required: true, placeholder: 'hello@example.com...' },
  { label: 'Phone', name: 'phone', type: 'tel', placeholder: '1-415-555-1234...' },
  { label: 'LinkedIn Profile', name: 'linkedin', type: 'url', placeholder: 'Type here...' },
]

export default function AshbyApplicationForm({ id }) {
  const j = JOBS[id]
  const navigate = useNavigate()
  const file = useRef(null)
  const [fileName, setFileName] = useState('')
  const onSubmit = (e) => { e.preventDefault(); navigate('/thank-you') }
  return (
    <div className="ab-frame">
      <div className="ab-page">
        <header className="ab-head">
          <img className="ab-logo" src={logo} alt="Wonderful" />
          <h1 className="ab-title">{j.title}</h1>
          <p className="ab-sub">{j.location} • {j.department} • {j.tags[2]} • {j.tags[0]}</p>
          <nav className="ab-tabs">
            <a href={`/ashby/${id}`}>Overview</a>
            <span className="is-active">Application</span>
          </nav>
        </header>
        <form className="ab-form" onSubmit={onSubmit} noValidate={false}>
          {FIELDS.slice(0, 2).map((f) => (
            <label key={f.name} className="ab-field">
              <span className="ab-label">{f.label}{f.required && <span className="ab-req">*</span>}</span>
              <input className="ab-input" type={f.type} name={f.name} required={f.required} placeholder={f.placeholder} />
            </label>
          ))}
          <div className="ab-field">
            <span className="ab-label">Resume<span className="ab-req">*</span></span>
            <div className="ab-upload" onClick={() => file.current?.click()}>
              <button type="button" className="ab-upload-btn">
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 11V2.5M4.5 6 8 2.5 11.5 6M2.5 10.5v2a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Upload File
              </button>
              <span className="ab-upload-hint">{fileName || 'or drag and drop here'}</span>
              <input ref={file} type="file" name="resume" required accept=".pdf,.doc,.docx,.odt,.rtf" className="ab-file" onChange={(e) => setFileName(e.target.files?.[0]?.name || '')} />
            </div>
          </div>
          {FIELDS.slice(2).map((f) => (
            <label key={f.name} className="ab-field">
              <span className="ab-label">{f.label}</span>
              <input className="ab-input" type={f.type} name={f.name} placeholder={f.placeholder} />
            </label>
          ))}
          <button type="submit" className="ab-submit">Submit Application</button>
        </form>
        <footer className="ab-foot">
          <span>Powered by</span> <strong>Ashby</strong>
          <span className="ab-foot-links"><a href="https://www.ashbyhq.com/privacy" target="_blank" rel="noopener">Privacy Policy</a><a href="https://www.ashbyhq.com/security" target="_blank" rel="noopener">Security</a><a href="https://www.ashbyhq.com/disclosure" target="_blank" rel="noopener">Vulnerability Disclosure</a></span>
        </footer>
      </div>
    </div>
  )
}
