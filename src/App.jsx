import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import product from './routes/product'
import company from './routes/company'
import industries from './routes/industries'
import content from './routes/content'
import regional from './routes/regional'
import platform from './routes/platform'

const ROUTES = [{ path: '/', element: <Home />, title: 'Wonderful | The Enterprise AI OS' }, ...product, ...company, ...industries, ...content, ...regional, ...platform]

// Same-origin <a> clicks become client-side navigations (pages render plain anchors, like Framer's).
function useLinkInterception() {
  const navigate = useNavigate()
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = e.target.closest('a[href]')
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return
      const url = new URL(a.href, location.href)
      if (url.origin !== location.origin) return
      if (url.pathname === location.pathname && url.hash) return
      e.preventDefault()
      navigate(url.pathname + url.search + url.hash)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [navigate])
}

function Page({ route }) {
  useEffect(() => { if (route.title) document.title = route.title }, [route.title])
  return route.element
}

function Shell() {
  useLinkInterception()
  const { pathname, hash } = useLocation()
  useEffect(() => { if (!hash) window.scrollTo(0, 0) }, [pathname, hash])
  const route = ROUTES.find((r) => r.path === pathname)
  const chrome = route?.chrome !== 'none'
  return (
    <div className="relative min-h-screen w-full overflow-x-clip bg-white">
      {chrome && <Navbar key={`nav${pathname}`} />}
      <main key={`main${pathname}`}>
        <Routes>
          {ROUTES.map((r) => <Route key={r.path} path={r.path} element={<Page route={r} />} />)}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {chrome && <Footer breakpoints={route?.footer} />}
    </div>
  )
}

function NotFound() {
  return (
    <section data-nav-theme="dark" className="grid min-h-screen place-items-center bg-black font-favorit text-[48px] tracking-[-0.04em] text-offwhite">
      Page not found
    </section>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  )
}
