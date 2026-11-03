// Mega-menu / mobile accordion contents (CLONE_SPEC §1 "Mega-menus" and "Mobile nav").

export const PLATFORM = [
  { title: 'AI OS Overview', href: '/ai-os', desc: 'The unified operating layer for the AI-native enterprise' },
  // minH: live item heights are 84.8 / 85 / 68 (col 1) and 85 / 85 / 85 (col 2) — fixed heights in the Framer file.
  { title: 'Wonderful Agents', href: '/agents', desc: 'Deploy agents anywhere work happens', minH: 85 },
  { title: 'Wonderful Systems', href: '/systems', desc: 'Software built for the way you work' },
  { title: 'Wonderful AI Gateway', href: '/ai-gateway', desc: 'A control center for all enterprise AI', minH: 85 },
  { title: 'Deployment', href: '/deployment', desc: 'Locally embedded teams who ship', minH: 85 },
  { title: 'Strategy', href: '/ai-transformation', desc: 'Drive your AI transformation', minH: 85 },
]

// Column 1: Banking, Utilities, Retail, Airlines. Column 2: Telecommunications, Healthcare, Insurance.
export const INDUSTRIES = [
  { title: 'Banking', href: '/industries/banking', desc: 'AI workflows for regulated enterprises' },
  { title: 'Utilities', href: '/industries/utilities', desc: 'AI workflows for critical infrastructure' },
  { title: 'Retail', href: '/industries/retail', desc: 'AI workflows across every channel' },
  { title: 'Airlines', href: '/industries/airlines', desc: 'AI workflows for disruption at scale' },
  { title: 'Telecommunications', href: '/industries/telecommunication', desc: 'AI workflows at massive scale' },
  { title: 'Healthcare', href: '/industries/healthcare', desc: 'AI workflows for safer, faster care' },
  { title: 'Insurance', href: '/industries/insurance', desc: 'AI workflows for audit-ready operations' },
]

export const COMPANY = [
  { title: 'About', href: '/about-us' },
  { title: 'Careers', href: '/careers' },
  { title: 'Press', href: '/press' },
]

export const FEATURE = {
  // Spec gives title + image; the link target of this card is not in the spec.
  platform: { title: 'Announcing the Wonderful AI Gateway', sub: 'Read the article', href: '/ai-gateway', img: '/assets/u77i0fAKjknSsnWQV24Oy2E9M.jpg', play: true },
  industries: { title: 'How PPC Energie cut call handling time by 75% in four weeks', sub: 'Read the article', href: '/blog-articles/ppc-energie', img: '/assets/PpzgblDc33XnDkhQ3NUEGTjNkQw.jpg', play: true },
}

// Live (measured 2026-11-03): under a "Latest press" label, the left card's title concatenates both
// headlines in #000 with no sub-link; the right card is the $550M story (with play button) + "Read the article".
export const PRESS = [
  { title: 'Announcing our Partnership with McKinsey Seb Johnson on The Scaling Europe Show', titleColor: '#000000', href: 'https://www.youtube.com/watch?v=e1u2Rt0mg6w', img: '/assets/fVSTX0gTVpHWenAo04hOvPZsbrw.jpeg', external: true },
  { title: 'Wonderful raises $550M Series C at a $5B valuation', sub: 'Read the article', href: '/blog-articles/wonderful-raises-550m-series-c', img: '/assets/OFOmy4ujpMAAI9sHrryVCrXxHI.png', play: true },
]

export const MENUS = [
  { key: 'platform', label: 'Platform', items: PLATFORM },
  { key: 'industries', label: 'Industries', items: INDUSTRIES },
  { key: 'company', label: 'Company', items: COMPANY },
]
