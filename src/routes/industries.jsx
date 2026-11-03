// Routes owned by the "industries" page group. Each entry: { path, element, chrome?: 'default' | 'none', title?, footer?: { desktop, mobile } }.
// chrome 'none' renders the page without the shared Navbar/Footer (for pages that bring their own).
import IndustryPage from '../pages/industries/IndustryPage'
import CaseStudyPage from '../pages/industries/CaseStudyPage'
import { INDUSTRIES } from '../pages/industries/data/industries'
import { CASE_STUDIES } from '../pages/industries/data/caseStudies'

const INDUSTRY_ORDER = ['airlines', 'banking', 'healthcare', 'insurance', 'retail', 'telecommunication', 'utilities']
const CASE_ORDER = ['financial-services', 'healthcare', 'telecommunication']

export default [
  ...INDUSTRY_ORDER.map((slug) => ({
    path: `/industries/${slug}`,
    element: <IndustryPage data={INDUSTRIES[slug]} />,
    title: INDUSTRIES[slug].title,
    footer: { desktop: 1400, mobile: 880 }, // live footer breakpoints on industry pages
  })),
  ...CASE_ORDER.map((slug) => ({
    path: `/case-studies/${slug}`,
    element: <CaseStudyPage data={CASE_STUDIES[slug]} />,
    title: CASE_STUDIES[slug].title,
    footer: { desktop: 1200, mobile: 810 }, // live footer breakpoints on case studies
  })),
]
