import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import '../../styles/company/common.css'
import '../../styles/company/contact.css'
import { INDUSTRIES, COMPANY_SIZES, COUNTRIES } from './data/contactOptions'

// /contact (CLONE_SPEC_COMPANY §4). The form is visual + client-side only: native constraint validation
// (required / type=email, browser bubbles like live) and on a valid submit we navigate to /thank-you.
// Nothing is sent anywhere.
const BG = '/assets/8BGRlf6TKgvA5Zs2ZKxkG0oXbFE.png'

function Chevron({ filled }) {
  return (
    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden="true">
      <path d="M1 1L6 6L11 1" stroke={filled ? 'rgb(0, 0, 0)' : 'rgba(92, 92, 92, 0.5)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Framer "Select" code component: a hidden required <select> carries the value; a button opens a listbox.
function Select({ name, placeholder, options, className = '' }) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const root = useRef(null)
  useEffect(() => {
    if (!open) return
    const onDown = (e) => { if (root.current && !root.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])
  const label = options.find((o) => o[0] === value)?.[1]
  return (
    <div ref={root} className={`cct-select ${className}`}>
      <select name={name} required value={value} onChange={(e) => setValue(e.target.value)} tabIndex={-1} aria-hidden="true">
        <option value="" />
        {options.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
      </select>
      <button type="button" className="cct-select-btn" data-filled={value ? 'true' : 'false'} aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span>{label || placeholder}</span>
        <Chevron filled={!!value} />
      </button>
      {open && (
        <div role="listbox" className="cct-listbox">
          {options.map(([v, t]) => (
            <div key={v} role="option" aria-selected={v === value} className="cct-option" onClick={() => { setValue(v); setOpen(false) }}>{t}</div>
          ))}
        </div>
      )}
    </div>
  )
}

function Field({ label, children, full }) {
  return (
    <label className={`cct-field ${full ? 'cct-field--full' : ''}`}>
      <p className="cct-label">{label}</p>
      {children}
    </label>
  )
}

function Input({ type = 'text', name, placeholder }) {
  return (
    <div className="cct-input">
      <input type={type} required name={name} placeholder={placeholder} />
    </div>
  )
}

function Inquiries({ className = '' }) {
  return (
    <p className={`cct-small cct-inq ${className}`}>
      General inquiries: <a href="mailto:info@wonderful.ai">info@wonderful.ai</a><br />
      Media inquiries: <a href="mailto:press@wonderful.ai">press@wonderful.ai</a><br />
      Found a bug? report here: <a href="mailto:security@wonderful.ai">security@wonderful.ai</a><br />
      Bug Bounty Terms and Conditions
    </p>
  )
}

export default function Contact() {
  const navigate = useNavigate()
  const onSubmit = (e) => {
    e.preventDefault()
    if (!e.currentTarget.checkValidity()) { e.currentTarget.reportValidity(); return }
    navigate('/thank-you')
  }
  return (
    <div className="cct-root">
      <Navbar />
      <div className="cct-group" data-framer-name="LayoutGroup">
        {/* desktop: left image half */}
        <div className="cct-left" data-nav-theme="dark" data-framer-name="Container">
          <img className="cct-bg" src={BG} alt="" />
          <div className="cct-left-in">
            <div className="cct-left-col">
              <div className="cct-left-top">
                <div className="cct-left-head">
                  <h1 className="cct-h1 co-favorit">Applied AI<br />for the enterprise</h1>
                  <p className="cct-lead co-p17">Wonderful helps enterprises accelerate AI adoption to unlock their full potential.</p>
                </div>
                <div className="cct-rule" />
                <Inquiries />
              </div>
              <p className="cct-small cct-privacy">
                We store and process the data in this form to respond to your request.<br />
                For more information on how we use data, please refer to our <a href="/legal/privacy" target="_blank">Privacy policy</a>.
              </p>
            </div>
          </div>
        </div>

        {/* tablet hero */}
        <div className="cct-hero-t" data-nav-theme="dark">
          <img className="cct-bg" src={BG} alt="" />
          <div className="cct-hero-in">
            <h2 className="cct-h2-t co-favorit">Applied AI for the enterprise</h2>
            <p className="cct-lead co-p17">Wonderful helps enterprises accelerate AI adoption to unlock their full potential.</p>
          </div>
        </div>

        {/* form half */}
        <div className="cct-right" data-framer-name="Container">
          <form className="cct-form" method="post" onSubmit={onSubmit}>
            <div className="cct-form-head">
              <h4 className="cct-h4 co-favorit">Set a meeting with our team</h4>
              <p className="cct-note">Submit the form and our team will be in touch shortly to set up a meeting.</p>
            </div>
            <div className="cct-fields">
              <Field label="Work email" full><Input type="email" name="Email" placeholder="Work email" /></Field>
              <div className="cct-row cct-row--clip">
                <Field label="First name"><Input name="Fisrt name" placeholder="First name" /></Field>
                <Field label="Last name"><Input name="Last name" placeholder="Last name" /></Field>
              </div>
              <div className="cct-row cct-row--clip">
                <Field label="Job title"><Input name="Job title" placeholder="Job title" /></Field>
                <Field label="Phone number"><Input type="tel" name="Phone number" placeholder="Phone number" /></Field>
              </div>
              <div className="cct-row cct-row--stack">
                <Field label="Company"><Input name="Company name" placeholder="Company name" /></Field>
                <Field label="Industry"><Select name="industry" placeholder="Select an industry..." options={INDUSTRIES} /></Field>
              </div>
              <div className="cct-row cct-row--stack">
                <Field label="Company size"><Select name="00Nan00000SeYQ1" placeholder="Select a range" options={COMPANY_SIZES} /></Field>
                <Field label="Country"><Select name="Country" placeholder="Select a country..." options={COUNTRIES} className="cct-select--country" /></Field>
              </div>
            </div>
            <div className="cct-actions">
              <button type="submit" className="cct-send cct-o0" data-framer-name="Default"><span>Send</span></button>
              <div className="cct-divider cct-only-tm cct-t3 cct-m1" />
              <Inquiries className="cct-only-tm cct-o4" />
              <div className="cct-divider cct-only-tm cct-t1 cct-m3" />
              <p className="cct-fine cct-fine--t cct-only-t cct-t2">
                We store and process the data in this form to respond to your request. For more information on how we use data, please refer to our <a href="/legal/privacy" target="_blank">Privacy policy</a>.
              </p>
              <p className="cct-fine cct-fine--m cct-only-m cct-m2">
                We store and process the data in this form to respond to your request. For more information on how we use data, please refer to our <a href="/legal/privacy" target="_blank">Privacy policy</a>.
              </p>
            </div>
          </form>
        </div>

        {/* mobile hero (DOM after the form, ordered first) */}
        <div className="cct-hero-m" data-nav-theme="dark">
          <img className="cct-bg" src={BG} alt="" />
          <div className="cct-hero-m-in">
            <div className="cct-hero-m-col">
              <h1 className="cct-h1-m co-favorit">Applied AI<br />for the enterprise</h1>
              <p className="cct-lead co-p17">Wonderful helps enterprises accelerate AI adoption to unlock their full potential.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
