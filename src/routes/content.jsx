// Routes owned by the "content" page group: /blog, /blog-articles/<slug> (51, one CMS template),
// /legal and /legal/<slug> (9, one template). Content is extracted from _source/pages by
// src/pages/content/_extract/extract.cjs into src/pages/content/data/**.
import Article from '../pages/content/Article'
import Blog from '../pages/content/Blog'
import LegalIndex from '../pages/content/LegalIndex'
import LegalDoc from '../pages/content/LegalDoc'
import TITLES from '../pages/content/data/titles.json'

const articles = Object.entries(TITLES.articles).flatMap(([slug, title]) => {
  const route = { path: `/blog-articles/${slug}`, element: <Article key={slug} slug={slug} />, title }
  // Slugs with a typographic apostrophe (won’t, isn’t, can’t): also register the percent-encoded
  // form so App's exact-path lookup (location.pathname is encoded) finds the route entry.
  const enc = encodeURI(route.path)
  return enc === route.path ? [route] : [route, { ...route, path: enc }]
})

const legal = Object.entries(TITLES.legalPages).map(([slug, title]) => ({
  path: `/legal/${slug}`,
  element: <LegalDoc key={slug} slug={slug} />,
  title,
  // Live legal documents render without the site nav and footer.
  chrome: 'none',
}))

export default [
  { path: '/blog', element: <Blog />, title: TITLES.blog },
  // /legal uses the "White L" light footer variant -> chrome 'none', renders the shared Navbar + its own footer.
  { path: '/legal', element: <LegalIndex />, title: TITLES.legal, chrome: 'none' },
  ...articles,
  ...legal,
]
