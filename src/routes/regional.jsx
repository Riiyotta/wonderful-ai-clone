// Routes owned by the "regional" page group. Each entry: { path, element, chrome?: 'default' | 'none', title? }.
// chrome 'none' renders the page without the shared Navbar/Footer (for pages that bring their own).
import CountryPage from '../pages/regional/CountryPage'
import { COUNTRIES } from '../pages/regional/countries.data'
import FcbMatchday from '../pages/regional/FcbMatchday'
import { FCB_MATCHES } from '../pages/regional/fcb.data'
import FcbThankYou from '../pages/regional/FcbThankYou'
import AshbyJob from '../pages/regional/AshbyJob'
import AshbySubmit from '../pages/regional/AshbySubmit'
import Ashby404 from '../pages/regional/Ashby404'
import ComeetStyle from '../pages/regional/ComeetStyle'
import { JOBS } from '../pages/regional/jobs.data'

const T = 'Wonderful | The Enterprise AI OS '

export default [
  ...Object.keys(COUNTRIES).map((slug) => ({ path: `/${slug}`, element: <CountryPage slug={slug} />, title: T })),
  // FC Bayern matchday landing pages: own hero/lockup and "LP Footer", no site nav/footer.
  ...Object.entries(FCB_MATCHES).map(([slug, m]) => ({ path: `/fcb/x/${slug}`, element: <FcbMatchday slug={slug} />, title: m.title, chrome: 'none' })),
  // Not in the brief's route list, but it is where the matchday form redirects on success (live Framer Forms redirect).
  { path: '/fcb/x/thank-you', element: <FcbThankYou />, title: 'Thank you for registering | Wonderful × FC Bayern', chrome: 'none' },
  // /ashby is the site's Framer 404 page ("Page Not Found in Data"), with the standard nav/footer.
  { path: '/ashby', element: <Ashby404 />, title: T },
  // Ashby job posts + application pages: black full-bleed canvases with no site nav/footer on live.
  ...Object.entries(JOBS).flatMap(([id, j]) => [
    { path: `/ashby/${id}`, element: <AshbyJob id={id} />, title: j.title_tag, chrome: 'none' },
    { path: `/ashby/${id}/submit`, element: <AshbySubmit id={id} />, title: j.title_tag, chrome: 'none' },
  ]),
  { path: '/archive/comeet-style', element: <ComeetStyle />, title: T },
]
