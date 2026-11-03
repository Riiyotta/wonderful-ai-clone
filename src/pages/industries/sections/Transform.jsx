// "Transform your <industry> operations with AI": masked glow image, H2, three bordered feature columns.
// Icons are the page's inline SVG symbols (fill via --21h8s6 / --1m6trwb like the Framer icon component).
export default function Transform({ data }) {
  return (
    <section className="inx-tf" data-nav-theme="dark" data-framer-name="Transform">
      <div className="inx-tf-glow">
        <div className="inx-cover">
          <img src="/assets/93SjXd7ceCNvJA26xK3NXv1Nw2I.jpg" alt="" decoding="async" loading="lazy" />
        </div>
      </div>
      <div className="inx-tf-head">
        <div className="inx-tf-title">
          <h2 className="inx-tf-h2">{data.title}</h2>
        </div>
      </div>
      <div className="inx-tf-row">
        {data.items.map((it) => (
          <div key={it.title} className="inx-tf-card inx-bd">
            <div className="inx-tf-inner">
              <svg className="inx-tf-icon" role="presentation" viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: it.icon }} />
              <div className="inx-tf-text">
                <p className="inx-tf-t">{it.title}</p>
                <p className="inx-p17b inx-tf-d">{it.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
