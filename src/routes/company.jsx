// Routes owned by the "company" page group. Each entry: { path, element, chrome?: 'default' | 'none', title? }.
// chrome 'none' renders the page without the shared Navbar/Footer (for pages that bring their own).
import '../styles/company/fonts.css'
import AboutUs from '../pages/company/AboutUs'
import Careers from '../pages/company/Careers'
import CandidateNotice from '../pages/company/CandidateNotice'
import Press from '../pages/company/Press'
import Contact from '../pages/company/Contact'
import ThankYou from '../pages/company/ThankYou'

const T = 'Wonderful | The Enterprise AI OS '

export default [
  { path: '/about-us', element: <AboutUs />, title: T },
  { path: '/careers', element: <Careers />, title: T },
  { path: '/careers/candidate_notice', element: <CandidateNotice />, title: 'Candidate Privacy Notice', chrome: 'none' },
  { path: '/press', element: <Press />, title: 'Wonderful in the News' },
  // Live /contact has the nav but no footer; Contact renders its own <Navbar/> (see Contact.jsx).
  { path: '/contact', element: <Contact />, title: T, chrome: 'none' },
  { path: '/thank-you', element: <ThankYou />, title: T },
]
