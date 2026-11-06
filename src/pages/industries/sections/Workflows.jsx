// Workflows: image + text column. Framer renders a different list per breakpoint (ssr-variant):
// desktop = one column (no divider above item 1); tablet = 2-col grid [1,3] [2,4] inside a 200%-wide column
// (so the second column sits off-canvas, as on live); mobile = one column where items 2 & 4 use 20px titles.
function Item({ it, i, altTitle }) {
  return (
    <div className="inx-wf-wrap" data-i={i}>
      <div className="inx-wf-div" />
      <div className="inx-wf-item" data-i={i}>
        <p className={`inx-wf-it${altTitle ? ' inx-wf-it--alt' : ''}`}>{it.title}</p>
        <p className="inx-p17b inx-wf-id">{it.desc}</p>
      </div>
    </div>
  )
}

export default function Workflows({ data }) {
  const items = data.items
  const at = (n) => <Item key={n} it={items[n - 1]} i={n} />
  return (
    <section className="inx-wf" data-nav-theme="dark" data-framer-name="Workflows">
      <div className="inx-wf-cols">
        <div className="inx-wf-text">
          <div className="inx-wf-title">
            <h2 className="inx-h2s">Streamline your most critical workflows</h2>
          </div>
          <div className="inx-wf-list inx-wf-list--d">{[1, 2, 3, 4].map(at)}</div>
          <div className="inx-wf-list inx-wf-list--t">
            <div className="inx-wf-col">{[1, 3].map(at)}</div>
            <div className="inx-wf-col">{[2, 4].map(at)}</div>
          </div>
          <div className="inx-wf-list inx-wf-list--m">
            <div className="inx-wf-col">
              {[1, 2, 3, 4].map((n) => <Item key={n} it={items[n - 1]} i={n} altTitle={n % 2 === 0} />)}
            </div>
          </div>
        </div>
        <div className="inx-wf-media">
          <div className="inx-cover">
            <img src={data.media} alt={data.alt} decoding="async" loading="lazy" style={data.mediaPosition ? { objectPosition: data.mediaPosition } : undefined} />
          </div>
        </div>
      </div>
    </section>
  )
}
