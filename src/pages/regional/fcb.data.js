// FC Bayern matchday landing pages (/fcb/x/<slug>), extracted from _source/pages/fcb__x__<slug>.html.
// Only the copy below differs between the two pages; layout/CSS is identical (Framer CMS template).
export const FCB_MATCHES = {
  arsenal: {
    title: 'FC Bayern vs. Arsenal | Wonderful × FC Bayern Matchday',
    game: 'FC Bayern vs. Arsenal',
    matchLine: 'FC Bayern vs. Arsenal · Wednesday, October 21, 2026 ·Kick-off 21:00 CET · Allianz Arena, Munich',
    date: ['Wednesday, October 21, 2026 ', 'Kick-off 21:00 CET'],
    arrival: '18:45 at Welcome Zone West Area, Allianz Arena',
    rsvp: 'Thursday, October 1, 2026',
  },
  'slavia-prague': {
    title: 'FC Bayern vs. Slavia Prague | Wonderful × FC Bayern Matchday',
    game: 'FC Bayern vs. Slavia Prague',
    matchLine: 'FC Bayern vs. Slavia Prague · Tuesday, December 8, 2026 · Kick-off 21:00 CET · Allianz Arena, Munich',
    date: ['Tuesday, December 8th, 2026'],
    arrival: '18:45 at Welcome Zone West Area,\nAllianz Arena',
    rsvp: 'Thursday, November 17, 2026',
  },
}

export const FCB_CARDS = (m) => [
  { title: 'Arrival', body: m.arrival, img: '/assets/nsG54mSta2LAqDLRJhgHEZhEw.png' },
  { title: 'Dress code', body: 'Business casual', img: '/assets/qG68At0wxEsCxxLWIkwXXI0ME.jpg' },
  { title: 'On-site contact', body: 'Wonderful events team', img: '/assets/9haBQP7KzAj1WfFMHPga3F1Rlc.png' },
  { title: 'RSVP by', body: m.rsvp, img: '/assets/nAfTEuoiGFFnUKjyMulukp7Gng.png' },
]
