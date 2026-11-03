import '../../styles/company/richtext.css'
import html from './data/candidateNoticeHtml'

// /careers/candidate_notice (CLONE_SPEC_COMPANY §6). Rendered without Navbar/Footer, like live.
// Framer breakpoints for this page: >=1200 (1200px column, pad 120/60), 810-1199 (pad 90/60/120), <810 (pad 60/20).
export default function CandidateNotice() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-offwhite">
      <div className="relative flex w-[1200px] max-w-full flex-col items-center justify-center gap-[64px] rounded-[16px] px-[60px] py-[120px] [@media(max-width:1199.98px)]:w-full [@media(min-width:810px)_and_(max-width:1199.98px)]:pb-[120px] [@media(min-width:810px)_and_(max-width:1199.98px)]:pt-[90px] [@media(max-width:809.98px)]:px-[20px] [@media(max-width:809.98px)]:py-[60px]">
        <div className="relative flex w-full max-w-[980px] flex-col items-start justify-start gap-[32px] overflow-clip">
          <h2 className="w-full max-w-[768px] whitespace-pre-wrap break-words pb-[3px] text-left font-favorit text-[48px] font-light leading-[1.05] tracking-[-0.04em] text-ink [font-feature-settings:'ss04','ss05'] [text-wrap:balance] [@media(min-width:800px)_and_(max-width:1199px)]:text-[42px] [@media(min-width:800px)_and_(max-width:1199px)]:leading-[1.15] [@media(max-width:799px)]:text-[34px] [@media(max-width:799px)]:leading-[1.15] [@media(max-width:799px)]:tracking-[-0.05em]">
            Candidate Privacy Notice
          </h2>
          <div className="flex w-full flex-row items-center justify-start gap-[10px] overflow-clip">
            <p className="whitespace-pre font-inter text-[16px] leading-[1.2] text-black">Updated Date:</p>
            <p className="whitespace-pre font-inter text-[16px] leading-[1.2] text-black">Jul 29, 2026</p>
          </div>
        </div>
        <div className="h-px w-full max-w-[980px] bg-[#000000bf] opacity-[0.65]" />
        <div className="flex w-full max-w-[980px] flex-col items-center justify-center">
          <div className="co-rt w-full" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </div>
  )
}
