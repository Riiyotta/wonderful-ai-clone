/* eslint-disable */
// Port of the live "Gateway Overview Live" Framer code component (ai-gateway hero dashboard).
// Source: framerusercontent.com/sites/SaiSHo4OFc8hYpn6gVFA4/nzGDh76Bs-...BFuqs1C1.mjs (functions ct..vt + init Xt),
// kept verbatim; the minified module-scope imports are rebound below to the same React primitives.
import { useState as s, useRef as c, useEffect as h, useCallback as a, useMemo as u, Fragment as l, forwardRef as p, Fragment as o, useContext as t, useId as n, useInsertionEffect as i } from 'react'
import { jsx as f, jsxs as d } from 'react/jsx-runtime'
const g = typeof document !== 'undefined' ? globalThis.window : void 0
const se = () => false // Framer useIsStaticRenderer: never static in the browser
const e = (fn) => { let done = false, res; return () => { if (!done) { done = true; res = fn() } return res } }
const r = () => {}, m = () => {}, ee = () => {}, j = () => {}
const P = { Number: 'number', Boolean: 'boolean' }
function ct(e, t) {
  let n = new Date(Date.UTC(e.start[0], e.start[1], e.start[2] + t));
  return `${Tt[n.getUTCMonth()]} ${n.getUTCDate()}`;
}
function q(e) {
  return `$` + Math.round(e).toLocaleString(`en-US`);
}
function lt(e) {
  return e === 0 ? `$0` : `$${Math.round(e / 1e3)}K`;
}
function J(e) {
  return Math.round(e).toLocaleString(`en-US`);
}
function ut(e) {
  let t = e.spent[e.spent.length - 1],
    n = (t) => zt - (t / e.axisMax) * 144,
    r = (t) => Lt + (t / (e.days - 1)) * 443.4,
    i = t + e.savings,
    a = e.spent.length,
    o = (e) => Q + (e / (a - 1)) * 192.3,
    s = 86 / i,
    c = i / t;
  return {
    total: t,
    projected: e.projected,
    avg: t / a,
    savings: e.savings,
    budgetY: n(e.budget),
    spentPts: e.spent.map((e, t) => [r(t), n(e)]),
    projEnd: [r(e.days - 1), n(e.projected)],
    models: e.models.map((e) => e.amount),
    routerF: e.spent.map((e, n) => [o(n), Ut - t * ((n + 1) / a) * c * s]),
    routerR: e.spent.map((e, n) => [o(n), Ut - t * ((n + 1) / a) * s]),
    frontier: i,
    requests: e.requests,
    rescued: e.rescued,
  };
}
function dt(e, t) {
  if (e.length === t) return e;
  let n = [],
    r = e[0][0],
    i = e[e.length - 1][0],
    a = 0;
  for (let o = 0; o < t; o++) {
    let s = r + ((i - r) * o) / (t - 1);
    for (; a < e.length - 2 && e[a + 1][0] < s; ) a++;
    let c = e[a],
      l = e[Math.min(a + 1, e.length - 1)],
      u = l[0] === c[0] ? 0 : (s - c[0]) / (l[0] - c[0]);
    n.push([s, c[1] + (l[1] - c[1]) * Math.max(0, Math.min(1, u))]);
  }
  return n;
}
function Y(e, t, n) {
  return e + (t - e) * n;
}
function ft(e, t, n) {
  let r = dt(e, Wt),
    i = dt(t, Wt);
  return r.map((e, t) => [Y(e[0], i[t][0], n), Y(e[1], i[t][1], n)]);
}
function pt(e, t, n) {
  return n >= 1
    ? t
    : {
        total: Y(e.total, t.total, n),
        projected: Y(e.projected, t.projected, n),
        avg: Y(e.avg, t.avg, n),
        savings: Y(e.savings, t.savings, n),
        budgetY: Y(e.budgetY, t.budgetY, n),
        spentPts: ft(e.spentPts, t.spentPts, n),
        projEnd: [
          Y(e.projEnd[0], t.projEnd[0], n),
          Y(e.projEnd[1], t.projEnd[1], n),
        ],
        models: e.models.map((e, r) => Y(e, t.models[r], n)),
        routerF: ft(e.routerF, t.routerF, n),
        routerR: ft(e.routerR, t.routerR, n),
        frontier: Y(e.frontier, t.frontier, n),
        requests: Y(e.requests, t.requests, n),
        rescued: Y(e.rescued, t.rescued, n),
      };
}
function mt(e) {
  return e
    .map((e, t) => `${t ? `L` : `M`}${e[0].toFixed(2)} ${e[1].toFixed(2)}`)
    .join(``);
}
function ht(e) {
  return e < 0.5 ? 4 * e * e * e : 1 - (-2 * e + 2) ** 3 / 2;
}
function gt(e) {
  return 1 - (1 - e) ** 3;
}
function _t({ name: e, size: t = 16, color: n = `currentColor`, style: r }) {
  let i = Kt[e];
  return i
    ? /*#__PURE__*/ f(`svg`, {
        width: t,
        height: t,
        viewBox: `0 0 13.333 13.333`,
        fill: `none`,
        "aria-hidden": `true`,
        style: { flex: `none`, ...r },
        children: /*#__PURE__*/ f(`path`, {
          d: i.d,
          transform: `translate(${i.dx} ${i.dy})`,
          stroke: n,
          strokeWidth: 0.95,
          strokeLinecap: `round`,
          strokeLinejoin: `round`,
        }),
      })
    : /*#__PURE__*/ f(`svg`, {
        width: t,
        height: t,
        viewBox: `0 0 256 256`,
        fill: n,
        "aria-hidden": `true`,
        style: { flex: `none`, ...r },
        children: /*#__PURE__*/ f(`path`, { d: Gt[e] }),
      });
}
function vt(e) {
  let t = e.visibleHeight || 598,
    n = e.fade !== !1,
    r = (t / 1200) * Et,
    o = r - Dt,
    l = se(),
    u = c(null),
    p = c(null),
    m = c(null),
    [ee, _] = s(1200 / Et),
    [v, y] = s(`30d`),
    [te, b] = s(`Overview`),
    [ne, re] = s(1),
    [x, S] = s(+!!l),
    [C, w] = s(null),
    [T, E] = s(null),
    [D, O] = s(null),
    ie = c(ut(Ct[`30d`])),
    ae = c(ut(Ct[`30d`])),
    k = c(!1),
    A = c(0),
    j = c(0);
  h(() => {
    let e = u.current;
    if (!e || typeof ResizeObserver > `u`) return;
    let t = () => {
      let t = e.clientWidth;
      t > 0 && _(t / Et);
    };
    t();
    let n = new ResizeObserver(t);
    return n.observe(e), () => n.disconnect();
  }, []),
    h(() => {
      if (g === void 0 || !g.matchMedia) return;
      let e = g.matchMedia(`(prefers-reduced-motion: reduce)`);
      (k.current = e.matches), e.matches && S(1);
      let t = () => {
        k.current = e.matches;
      };
      return (
        e.addEventListener?.(`change`, t),
        () => e.removeEventListener?.(`change`, t)
      );
    }, []),
    h(() => {
      if (l) {
        S(1);
        return;
      }
      let e = u.current;
      if (!e || typeof IntersectionObserver > `u`) {
        S(1);
        return;
      }
      let t = !1,
        n = new IntersectionObserver(
          (e) => {
            if (t || !e.some((e) => e.isIntersecting)) return;
            if (((t = !0), n.disconnect(), k.current)) {
              S(1);
              return;
            }
            let r = performance.now(),
              i = (e) => {
                let t = Math.min(1, (e - r) / 700);
                S(t), t < 1 && (j.current = requestAnimationFrame(i));
              };
            j.current = requestAnimationFrame(i);
          },
          { threshold: 0.2 },
        );
      return (
        n.observe(e),
        () => {
          n.disconnect(), cancelAnimationFrame(j.current);
        }
      );
    }, [l]),
    h(() => () => cancelAnimationFrame(A.current), []);
  let oe = a(
      (e) => {
        if (e === v) return;
        if (
          ((ie.current = pt(ie.current, ae.current, ht(ne))),
          (ae.current = ut(Ct[e])),
          y(e),
          w(null),
          E(null),
          cancelAnimationFrame(A.current),
          k.current || l)
        ) {
          re(1);
          return;
        }
        re(0);
        let t = performance.now(),
          n = (e) => {
            let r = Math.min(1, (e - t) / 650);
            re(r), r < 1 && (A.current = requestAnimationFrame(n));
          };
        A.current = requestAnimationFrame(n);
      },
      [v, ne, l],
    ),
    M = (e) => {
      let t = wt.indexOf(v),
        n = -1;
      (e.key === `ArrowRight` || e.key === `ArrowDown`) && (n = (t + 1) % 3),
        (e.key === `ArrowLeft` || e.key === `ArrowUp`) && (n = (t + 2) % 3),
        n >= 0 &&
          (e.preventDefault(),
          oe(wt[n]),
          (e.currentTarget.querySelectorAll(`button`)[n] || null)?.focus());
    },
    N = Ct[v],
    P = pt(ie.current, ae.current, ht(ne)),
    F = gt(x),
    ce = (e) => e,
    I = N.days,
    L = N.spent.length - 1,
    R = (e) => Lt + (e / (I - 1)) * 443.4,
    z = (e) => zt - (e / N.axisMax) * 144,
    le = (e) => {
      if (e <= L) return N.spent[e];
      if (e === I - 1) return N.projected;
      let t = N.spent[L];
      return (
        Math.round((t + ((N.projected - t) * (e - L)) / (I - 1 - L)) / 10) * 10
      );
    },
    B = (e) => {
      let t = p.current;
      if (!t || x < 1) return;
      let n = t.getBoundingClientRect(),
        r = ((e.clientX - n.left) / n.width) * Ft,
        i = ((e.clientY - n.top) / n.height) * It;
      if (r < 40 || r > 507.4 || i < 48 || i > 242) {
        C !== null && w(null);
        return;
      }
      let a = Math.max(
        0,
        Math.min(I - 1, Math.round(((r - Lt) / 443.4) * (I - 1))),
      );
      a !== C && w(a);
    },
    V = N.spent.length,
    ue = (e) => {
      let t = m.current;
      if (!t || x < 1) return;
      let n = t.getBoundingClientRect(),
        r = ((e.clientX - n.left) / n.width) * Vt,
        i = ((e.clientY - n.top) / n.height) * Ht;
      if (r < 8 || r > 220.3 || i < 96 || i > 218) {
        T !== null && E(null);
        return;
      }
      let a = Math.max(
        0,
        Math.min(V - 1, Math.round(((r - Q) / 192.3) * (V - 1))),
      );
      a !== T && E(a);
    },
    de = mt(P.spentPts),
    H = P.spentPts[P.spentPts.length - 1],
    fe = `${de}L${H[0].toFixed(2)} ${zt}L${P.spentPts[0][0].toFixed(2)} ${zt}Z`,
    pe = `M${H[0].toFixed(2)} ${H[1].toFixed(2)}L${P.projEnd[0].toFixed(2)} ${P.projEnd[1].toFixed(2)}`,
    me = Math.max(0, Lt + 451.4 * F), // clipPath width; negative for the first frames of the draw-in
    he = P.routerF,
    ge = P.routerR,
    _e = `${mt(he)}${ge
      .slice()
      .reverse()
      .map((e) => `L${e[0].toFixed(2)} ${e[1].toFixed(2)}`)
      .join(``)}Z`,
    ve = Math.max(0, Q + 272.3 * F),
    ye = he[he.length - 1],
    be = ge[ge.length - 1],
    xe = P.models.reduce((e, t) => e + t, 0),
    Se = 3 + Jt.slice(0, wt.indexOf(v)).reduce((e, t) => e + t + 2, 0),
    Ce = Jt[wt.indexOf(v)],
    we = Math.floor((N.days - 1) / 2),
    U = (e, t, n = 400, r = 0) => ({
      fontSize: e,
      lineHeight: `${Math.round(e * 1.21 * 10) / 10}px`,
      color: t,
      fontWeight: n,
      letterSpacing: r,
      whiteSpace: `nowrap`,
    }),
    Te = {
      position: `absolute`,
      background: Z.panel,
      boxShadow: `inset 0 0 0 1px ${Z.border}`,
      borderRadius: 12,
    },
    W = (e, t, n) => ({ position: `absolute`, left: e, top: t, ...n }),
    Ee = {
      position: `absolute`,
      pointerEvents: `none`,
      background: Z.subtle,
      border: `1px solid ${Z.border}`,
      borderRadius: 8,
      padding: `7px 10px`,
      boxShadow: `0 6px 16px -4px rgba(0,0,0,.6), 0 1px 3px rgba(0,0,0,.4)`,
      zIndex: 5,
    },
    De = P.requests,
    Oe = P.rescued,
    ke = De - Oe,
    Ae = (e) => `${((e / De) * 100).toFixed(1)}%`,
    G = [20, 380, 740, 1092],
    je = (e, t, n, r, i, a) => {
      let o = e + 8,
        s = (o + r) / 2;
      return `M${o} ${196 + t}C${s} ${196 + t} ${s} ${196 + i} ${r} ${196 + i}L${r} ${196 + a}C${s} ${196 + a} ${s} ${196 + n} ${o} ${196 + n}Z`;
    },
    Me = Math.min(1, Math.max(0, (x - 0.3) / 0.7));
  return /*#__PURE__*/ d(`div`, {
    ref: u,
    className: `gwo`,
    style: {
      ...e.style,
      position: `relative`,
      width: `100%`,
      aspectRatio: `1200 / ${t}`,
      height: `auto`,
    },
    children: [
      /*#__PURE__*/ f(`style`, { children: Yt }),
      /*#__PURE__*/ f(`div`, {
        style: {
          position: `absolute`,
          left: 0,
          top: 0,
          width: Et,
          height: r,
          transform: `scale(${ee})`,
          transformOrigin: `0 0`,
        },
        children: /*#__PURE__*/ d(`div`, {
          style: {
            position: `absolute`,
            inset: 0,
            borderRadius: `12px 12px 0 0`,
            background: Z.frame,
            overflow: `hidden`,
            boxShadow: `0 0 0 1.2px rgba(119,119,119,.47), 0 1.2px 2.4px -1.2px rgba(0,0,0,.47), 0 2.4px 4.8px rgba(0,0,0,.35), 0 9.6px 12px rgba(0,0,0,.25)`,
          },
          children: [
            /*#__PURE__*/ d(`header`, {
              style: {
                position: `absolute`,
                left: 0,
                top: 0,
                width: Et,
                height: Dt,
                background: Z.surface,
                borderBottom: `1px solid ${Z.hover}`,
                zIndex: 4,
              },
              children: [
                /*#__PURE__*/ f(`button`, {
                  type: `button`,
                  "aria-label": `Toggle sidebar`,
                  className: `gwo-iconbtn`,
                  style: {
                    ...W(12, 12),
                    width: 32.4,
                    height: 32.4,
                    borderRadius: 8,
                    display: `grid`,
                    placeItems: `center`,
                    color: Z.fgBody,
                  },
                  children: /*#__PURE__*/ f(_t, { name: `sidebar`, size: 16 }),
                }),
                /*#__PURE__*/ f(`div`, {
                  style: {
                    ...W(56.4, 19.2),
                    width: 1,
                    height: 18,
                    background: Z.border,
                  },
                }),
                /*#__PURE__*/ d(`nav`, {
                  "aria-label": `Breadcrumb`,
                  style: {
                    ...W(63.6, 12),
                    height: 32.4,
                    display: `flex`,
                    alignItems: `center`,
                  },
                  children: [
                    /*#__PURE__*/ d(`button`, {
                      type: `button`,
                      className: `gwo-crumb`,
                      style: {
                        display: `flex`,
                        alignItems: `center`,
                        gap: 6,
                        padding: `6px 8px`,
                        ...U(14, Z.fgMuted, 400, -0.28),
                        lineHeight: `20px`,
                      },
                      children: [
                        /*#__PURE__*/ f(_t, {
                          name: `arrowsSplit`,
                          size: 18,
                          style: { transform: `rotate(180deg)` },
                        }),
                        `AI Gateway`,
                      ],
                    }),
                    /*#__PURE__*/ f(`span`, {
                      "aria-hidden": `true`,
                      style: {
                        width: 20.4,
                        textAlign: `center`,
                        ...U(14, Z.strong, 400, -0.28),
                      },
                      children: `/`,
                    }),
                    /*#__PURE__*/ f(`span`, {
                      "aria-current": `page`,
                      style: {
                        padding: `6px 8px`,
                        ...U(14, Z.fgBody, 400, -0.28),
                        lineHeight: `20px`,
                      },
                      children: `Overview`,
                    }),
                  ],
                }),
                /*#__PURE__*/ f(`button`, {
                  type: `button`,
                  "aria-label": `Search`,
                  className: `gwo-iconbtn`,
                  style: {
                    ...W(1358.4, 12),
                    width: 32.4,
                    height: 32.4,
                    borderRadius: 999,
                    background: Z.subtle,
                    display: `grid`,
                    placeItems: `center`,
                    color: Z.fgSecondary,
                  },
                  children: /*#__PURE__*/ f(_t, {
                    name: `magnifier`,
                    size: 15.6,
                  }),
                }),
                /*#__PURE__*/ f(`button`, {
                  type: `button`,
                  "aria-label": `Account`,
                  className: `gwo-avatar`,
                  style: {
                    ...W(1398, 12),
                    width: 32.4,
                    height: 32.4,
                    borderRadius: 999,
                    background: Z.surface,
                    display: `grid`,
                    placeItems: `center`,
                    boxShadow: `0 0 0 1px rgba(255,255,255,.12)`,
                    ...U(12, Z.fgSecondary, 400, -0.24),
                    lineHeight: `12px`,
                  },
                  children: `GB`,
                }),
              ],
            }),
            /*#__PURE__*/ f(`nav`, {
              "aria-label": `AI Gateway`,
              style: {
                position: `absolute`,
                left: 0,
                top: Dt,
                width: Ot,
                height: o,
                background: Z.surface,
                borderRight: `1px solid ${Z.hover}`,
                padding: `12px 16px`,
                display: `flex`,
                flexDirection: `column`,
                gap: 12,
                zIndex: 3,
              },
              children: qt.map((e) =>
                /*#__PURE__*/ d(
                  `div`,
                  {
                    style: { display: `flex`, flexDirection: `column`, gap: 6 },
                    children: [
                      /*#__PURE__*/ f(`div`, {
                        style: {
                          height: 30,
                          display: `flex`,
                          alignItems: `center`,
                          paddingLeft: 10.4,
                          ...U(12, Z.fgMuted, 400, -0.24),
                        },
                        children: e.group,
                      }),
                      e.items.map((e) => {
                        let t = te === e.label;
                        return /*#__PURE__*/ d(
                          `button`,
                          {
                            type: `button`,
                            className: `gwo-nav`,
                            "aria-current": t ? `page` : void 0,
                            onClick: () => i(() => b(e.label)),
                            style: {
                              height: 36,
                              width: `100%`,
                              borderRadius: 8,
                              display: `flex`,
                              alignItems: `center`,
                              gap: 8,
                              padding: `0 10px`,
                              textAlign: `left`,
                              color: Z.fgSecondary,
                              fontSize: 14,
                              lineHeight: `20px`,
                              letterSpacing: -0.28,
                            },
                            children: [
                              /*#__PURE__*/ f(_t, {
                                name: e.icon,
                                size: 16,
                                color: `currentColor`,
                              }),
                              /*#__PURE__*/ f(`span`, { children: e.label }),
                            ],
                          },
                          e.label,
                        );
                      }),
                    ],
                  },
                  e.group,
                ),
              ),
            }),
            /*#__PURE__*/ d(`div`, {
              className: `gwo-scroll`,
              tabIndex: -1,
              "aria-label": `Overview`,
              style: {
                position: `absolute`,
                left: Ot,
                top: Dt,
                width: 1200,
                height: o,
                background: Z.surface,
              },
              children: [
                /*#__PURE__*/ d(`div`, {
                  style: {
                    position: `sticky`,
                    top: 0,
                    height: jt,
                    background: Z.surface,
                    zIndex: 3,
                    boxShadow: `0 -8px 0 0 ${Z.surface}`,
                  },
                  children: [
                    /*#__PURE__*/ f(`h2`, {
                      style: {
                        ...W(kt, 28),
                        margin: 0,
                        ...U(24, Z.fgBody, 500, -0.24),
                        lineHeight: `29px`,
                      },
                      children: `Overview`,
                    }),
                    /*#__PURE__*/ f(`p`, {
                      style: {
                        ...W(kt, 62),
                        margin: 0,
                        ...U(14, Z.fgSecondary, 400, -0.28),
                        lineHeight: `17px`,
                      },
                      children: `Spend through the gateway this period: the total, where it is heading, and what it went to.`,
                    }),
                    /*#__PURE__*/ d(`div`, {
                      role: `radiogroup`,
                      "aria-label": `Period`,
                      onKeyDown: M,
                      style: {
                        ...W(931.2, 30),
                        width: 153.6,
                        height: 32.4,
                        borderRadius: 8,
                        background: Z.subtle,
                        padding: 3,
                        display: `flex`,
                        gap: 2,
                      },
                      children: [
                        /*#__PURE__*/ f(`div`, {
                          className: `gwo-pill`,
                          "aria-hidden": `true`,
                          style: {
                            position: `absolute`,
                            top: 3,
                            left: Se,
                            width: Ce,
                            height: 26.4,
                            borderRadius: 6,
                            background: Z.hover,
                            boxShadow: `0 0 0 1px rgba(255,255,255,.06), 0 1px 2px rgba(0,0,0,.4)`,
                          },
                        }),
                        wt.map((e, t) => {
                          let n = e === v;
                          return /*#__PURE__*/ f(
                            `button`,
                            {
                              type: `button`,
                              role: `radio`,
                              "aria-checked": n,
                              tabIndex: n ? 0 : -1,
                              className: `gwo-seg`,
                              onClick: () => oe(e),
                              style: {
                                position: `relative`,
                                width: Jt[t],
                                height: 26.4,
                                borderRadius: 6,
                                ...U(
                                  14,
                                  n ? Z.fg : Z.fgMuted,
                                  n ? 500 : 400,
                                  -0.28,
                                ),
                                lineHeight: `17px`,
                              },
                              children: e,
                            },
                            e,
                          );
                        }),
                      ],
                    }),
                    /*#__PURE__*/ f(`button`, {
                      type: `button`,
                      className: `gwo-btn`,
                      style: {
                        ...W(1096.8, 30),
                        width: 63.6,
                        height: 32.4,
                        borderRadius: 8,
                        background: Z.surface,
                        border: `1px solid ${Z.border}`,
                        ...U(14, Z.fgBody, 400, -0.28),
                        lineHeight: `14px`,
                      },
                      children: `Export`,
                    }),
                    /*#__PURE__*/ f(`div`, {
                      style: {
                        ...W(kt, 96),
                        width: At,
                        height: 1,
                        background: Z.hover,
                      },
                    }),
                  ],
                }),
                /*#__PURE__*/ d(`div`, {
                  style: {
                    position: `relative`,
                    height: 728,
                    marginLeft: kt,
                    width: At,
                  },
                  children: [
                    [
                      { label: `Total spend`, v: P.total },
                      { label: `Projected`, v: P.projected },
                      { label: `Avg. spend/day`, v: P.avg },
                      { label: `Est. savings`, v: P.savings },
                    ].map((e, t) =>
                      /*#__PURE__*/ d(
                        `div`,
                        {
                          style: {
                            ...Te,
                            left: t * 284.2,
                            top: 16,
                            width: 267.4,
                            height: Mt,
                          },
                          children: [
                            /*#__PURE__*/ f(`div`, {
                              style: {
                                ...W(16.8, 14),
                                ...U(14, Z.fgSecondary, 400, -0.28),
                                lineHeight: `17px`,
                              },
                              children: e.label,
                            }),
                            /*#__PURE__*/ f(`div`, {
                              style: {
                                ...W(16.8, 41),
                                ...U(20, Z.fg, 500, -0.4),
                                lineHeight: `24px`,
                              },
                              children: q(ce(e.v)),
                            }),
                          ],
                        },
                        e.label,
                      ),
                    ),
                    /*#__PURE__*/ d(`div`, {
                      style: {
                        ...Te,
                        left: 0,
                        top: 112,
                        width: Ft,
                        height: It,
                      },
                      children: [
                        /*#__PURE__*/ d(`div`, {
                          style: {
                            ...W(18, 18),
                            display: `flex`,
                            alignItems: `center`,
                            gap: 6,
                          },
                          children: [
                            /*#__PURE__*/ f(`span`, {
                              style: {
                                ...U(14, Z.fg, 500, -0.14),
                                lineHeight: `17px`,
                              },
                              children: `Cumulative spend`,
                            }),
                            /*#__PURE__*/ f(_t, {
                              name: `info`,
                              size: 14,
                              color: Z.fgMuted,
                            }),
                          ],
                        }),
                        /*#__PURE__*/ d(`div`, {
                          style: {
                            position: `absolute`,
                            right: 20,
                            top: 20,
                            display: `flex`,
                            alignItems: `center`,
                            gap: 12,
                            ...U(12, Z.fgSecondary),
                          },
                          children: [
                            /*#__PURE__*/ d(`span`, {
                              style: {
                                display: `flex`,
                                alignItems: `center`,
                                gap: 6,
                              },
                              children: [
                                /*#__PURE__*/ f(`svg`, {
                                  width: 14,
                                  height: 4,
                                  "aria-hidden": `true`,
                                  children: /*#__PURE__*/ f(`line`, {
                                    x1: 0,
                                    y1: 2,
                                    x2: 14,
                                    y2: 2,
                                    stroke: X,
                                    strokeWidth: 2,
                                  }),
                                }),
                                `Spent so far`,
                              ],
                            }),
                            /*#__PURE__*/ d(`span`, {
                              style: {
                                display: `flex`,
                                alignItems: `center`,
                                gap: 6,
                              },
                              children: [
                                /*#__PURE__*/ f(`svg`, {
                                  width: 14,
                                  height: 4,
                                  "aria-hidden": `true`,
                                  children: /*#__PURE__*/ f(`line`, {
                                    x1: 0,
                                    y1: 2,
                                    x2: 14,
                                    y2: 2,
                                    stroke: X,
                                    strokeWidth: 2,
                                    strokeDasharray: `4 3`,
                                  }),
                                }),
                                `Projected`,
                              ],
                            }),
                          ],
                        }),
                        /*#__PURE__*/ d(`svg`, {
                          ref: p,
                          width: Ft,
                          height: It,
                          viewBox: `0 0 ${Ft} ${It}`,
                          style: {
                            position: `absolute`,
                            left: 0,
                            top: 0,
                            overflow: `visible`,
                          },
                          onPointerMove: B,
                          onPointerLeave: () => w(null),
                          role: `img`,
                          "aria-label": `Cumulative spend ${q(P.total)} so far, projected ${q(N.projected)} against a ${q(N.budget)} budget`,
                          children: [
                            /*#__PURE__*/ f(`defs`, {
                              children: /*#__PURE__*/ f(`clipPath`, {
                                id: `gwo-cum-clip`,
                                children: /*#__PURE__*/ f(`rect`, {
                                  x: 0,
                                  y: 0,
                                  width: me,
                                  height: It,
                                }),
                              }),
                            }),
                            [0, 0.5, 1].map((e) => {
                              let t = zt - e * 144;
                              return /*#__PURE__*/ d(
                                `g`,
                                {
                                  children: [
                                    /*#__PURE__*/ f(`rect`, {
                                      x: Lt,
                                      y: t - 0.6,
                                      width: 443.4,
                                      height: 1.2,
                                      fill: Z.hover,
                                    }),
                                    /*#__PURE__*/ f(`text`, {
                                      x: 42,
                                      y: t + 3.6,
                                      textAnchor: `end`,
                                      fontSize: 11,
                                      fill: Z.fgMuted,
                                      children: lt(N.axisMax * e),
                                    }),
                                  ],
                                },
                                e,
                              );
                            }),
                            /*#__PURE__*/ f(`text`, {
                              x: Lt,
                              y: 248,
                              fontSize: 10.5,
                              fill: Z.fgMuted,
                              children: ct(N, 0),
                            }),
                            /*#__PURE__*/ f(`text`, {
                              x: R(we),
                              y: 248,
                              fontSize: 10.5,
                              fill: Z.fgMuted,
                              textAnchor: `middle`,
                              children: ct(N, we),
                            }),
                            /*#__PURE__*/ f(`text`, {
                              x: Rt,
                              y: 248,
                              fontSize: 10.5,
                              fill: Z.fgMuted,
                              textAnchor: `end`,
                              children: ct(N, N.days - 1),
                            }),
                            /*#__PURE__*/ f(`line`, {
                              x1: Lt,
                              x2: Rt,
                              y1: P.budgetY,
                              y2: P.budgetY,
                              stroke: Z.fgSecondary,
                              strokeWidth: 1,
                              opacity: F,
                            }),
                            /*#__PURE__*/ d(`text`, {
                              x: Rt,
                              y: P.budgetY - 7,
                              textAnchor: `end`,
                              fontSize: 11,
                              fill: Z.fgBody,
                              opacity: F,
                              children: [`Budget `, q(N.budget)],
                            }),
                            /*#__PURE__*/ d(`g`, {
                              clipPath: `url(#gwo-cum-clip)`,
                              children: [
                                /*#__PURE__*/ f(`path`, {
                                  d: fe,
                                  fill: X,
                                  fillOpacity: 0.12,
                                }),
                                /*#__PURE__*/ f(`path`, {
                                  d: de,
                                  fill: `none`,
                                  stroke: X,
                                  strokeWidth: 2,
                                  strokeLinejoin: `round`,
                                  strokeLinecap: `round`,
                                }),
                                /*#__PURE__*/ f(`path`, {
                                  d: pe,
                                  fill: `none`,
                                  stroke: X,
                                  strokeWidth: 2,
                                  strokeDasharray: `6 4`,
                                }),
                              ],
                            }),
                            C === null
                              ? /*#__PURE__*/ d(`g`, {
                                  opacity: +(x >= 1),
                                  style: { transition: `opacity .3s ease` },
                                  children: [
                                    /*#__PURE__*/ f(`circle`, {
                                      cx: H[0],
                                      cy: H[1],
                                      r: 3.4,
                                      fill: Z.panel,
                                      stroke: X,
                                      strokeWidth: 2,
                                    }),
                                    /*#__PURE__*/ d(`text`, {
                                      x: H[0],
                                      y: H[1] - 14,
                                      textAnchor: `middle`,
                                      fontSize: 11,
                                      fontWeight: 500,
                                      fill: Z.fgBody,
                                      children: [q(P.total), ` · `, ct(N, L)],
                                    }),
                                  ],
                                })
                              : /*#__PURE__*/ d(`g`, {
                                  pointerEvents: `none`,
                                  children: [
                                    /*#__PURE__*/ f(`line`, {
                                      x1: R(C),
                                      x2: R(C),
                                      y1: 72,
                                      y2: zt,
                                      stroke: Z.strong,
                                      strokeWidth: 1,
                                    }),
                                    /*#__PURE__*/ f(`circle`, {
                                      cx: R(C),
                                      cy: z(le(C)),
                                      r: 3.4,
                                      fill: Z.panel,
                                      stroke: X,
                                      strokeWidth: 2,
                                    }),
                                  ],
                                }),
                            /*#__PURE__*/ f(`rect`, {
                              x: 40,
                              y: 48,
                              width: 467.4,
                              height: 194,
                              fill: `transparent`,
                            }),
                          ],
                        }),
                        C !== null &&
                          /*#__PURE__*/ d(`div`, {
                            role: `status`,
                            style: {
                              ...Ee,
                              left: R(C) > 345.4 ? R(C) - 12 : R(C) + 12,
                              top: Math.max(8, z(le(C)) - 60),
                              transform:
                                R(C) > 345.4 ? `translateX(-100%)` : void 0,
                            },
                            children: [
                              /*#__PURE__*/ d(`div`, {
                                style: { ...U(12, Z.fgMuted) },
                                children: [
                                  ct(N, C),
                                  C > L
                                    ? ` · Projected`
                                    : C === L
                                      ? ` · Today`
                                      : ``,
                                ],
                              }),
                              /*#__PURE__*/ f(`div`, {
                                style: {
                                  ...U(14, Z.fg, 500, -0.14),
                                  marginTop: 2,
                                },
                                children: q(le(C)),
                              }),
                            ],
                          }),
                      ],
                    }),
                    /*#__PURE__*/ d(`div`, {
                      style: {
                        ...Te,
                        left: 531.4,
                        top: 112,
                        width: Bt,
                        height: Ht,
                      },
                      children: [
                        /*#__PURE__*/ f(`div`, {
                          style: {
                            ...W(18, 18),
                            ...U(14, Z.fg, 500, -0.14),
                            lineHeight: `17px`,
                          },
                          children: `Spend by model`,
                        }),
                        /*#__PURE__*/ d(`div`, {
                          style: {
                            ...W(18, 46),
                            display: `flex`,
                            alignItems: `baseline`,
                            gap: 8,
                          },
                          children: [
                            /*#__PURE__*/ f(`span`, {
                              style: {
                                ...U(20, Z.fg, 500, -0.4),
                                lineHeight: `24px`,
                              },
                              children: q(ce(xe)),
                            }),
                            /*#__PURE__*/ d(`span`, {
                              style: { ...U(13, Z.fgMuted) },
                              children: [`across `, N.modelCount, ` models`],
                            }),
                          ],
                        }),
                        /*#__PURE__*/ f(`div`, {
                          className: `gwo-segbar`,
                          style: {
                            ...W(18, 90),
                            width: 250.3,
                            height: 6,
                            display: `flex`,
                            gap: 2.4,
                          },
                          children: P.models.map((e, t) =>
                            /*#__PURE__*/ f(
                              `div`,
                              {
                                onPointerEnter: () => O(t),
                                onPointerLeave: () => O(null),
                                style: {
                                  width: Math.max(
                                    0,
                                    (e / xe) * 243.10000000000002 * F,
                                  ),
                                  height: 6,
                                  borderRadius: 3,
                                  background: N.models[t].color,
                                  opacity: D === null || D === t ? 1 : 0.3,
                                  flex: `none`,
                                },
                              },
                              t,
                            ),
                          ),
                        }),
                        P.models.map((e, t) => {
                          let n = N.models[t],
                            r = D !== null && D !== t;
                          return /*#__PURE__*/ d(
                            `div`,
                            {
                              className: `gwo-row`,
                              onPointerEnter: () => O(t),
                              onPointerLeave: () => O(null),
                              onFocus: () => O(t),
                              onBlur: () => O(null),
                              tabIndex: 0,
                              "aria-label": `${n.name}: ${q(e)}, ${Math.round((e / xe) * 100)}%`,
                              style: {
                                ...W(10, 110 + t * 36),
                                width: 266.3,
                                height: 34,
                                borderRadius: 6,
                                opacity: r ? 0.4 : 1,
                                background: D === t ? Z.subtle : `transparent`,
                              },
                              children: [
                                /*#__PURE__*/ f(`span`, {
                                  style: {
                                    ...W(8, 13),
                                    width: 8,
                                    height: 8,
                                    borderRadius: 99,
                                    background: n.color,
                                  },
                                }),
                                /*#__PURE__*/ f(`span`, {
                                  style: {
                                    ...W(22, 9),
                                    ...U(13, Z.fgBody, 400, -0.13),
                                    lineHeight: `16px`,
                                  },
                                  children: n.name,
                                }),
                                /*#__PURE__*/ f(`span`, {
                                  style: {
                                    ...W(0, 9),
                                    width: 218.3,
                                    textAlign: `right`,
                                    ...U(13, Z.fg, 400, -0.13),
                                    lineHeight: `16px`,
                                  },
                                  children: q(ce(e)),
                                }),
                                /*#__PURE__*/ d(`span`, {
                                  style: {
                                    ...W(0, 10),
                                    width: 258.3,
                                    textAlign: `right`,
                                    ...U(11.5, Z.fgMuted),
                                    lineHeight: `14px`,
                                  },
                                  children: [Math.round((e / xe) * 100), `%`],
                                }),
                              ],
                            },
                            n.name,
                          );
                        }),
                      ],
                    }),
                    /*#__PURE__*/ d(`div`, {
                      style: {
                        ...Te,
                        left: 833.7,
                        top: 112,
                        width: Vt,
                        height: Ht,
                      },
                      children: [
                        /*#__PURE__*/ f(`div`, {
                          style: {
                            ...W(18, 18),
                            ...U(14, Z.fg, 500, -0.14),
                            lineHeight: `17px`,
                          },
                          children: `Auto router`,
                        }),
                        /*#__PURE__*/ d(`div`, {
                          style: {
                            ...W(18, 46),
                            display: `flex`,
                            alignItems: `baseline`,
                            gap: 8,
                          },
                          children: [
                            /*#__PURE__*/ f(`span`, {
                              style: {
                                ...U(20, Z.fg, 500, -0.4),
                                lineHeight: `24px`,
                              },
                              children: q(ce(P.savings)),
                            }),
                            /*#__PURE__*/ d(`span`, {
                              style: { ...U(13, Z.fgMuted) },
                              children: [
                                `Saved · `,
                                N.routedShare,
                                `% of requests`,
                              ],
                            }),
                          ],
                        }),
                        /*#__PURE__*/ d(`svg`, {
                          ref: m,
                          width: Vt,
                          height: Ht,
                          viewBox: `0 0 ${Vt} ${Ht}`,
                          style: {
                            position: `absolute`,
                            left: 0,
                            top: 0,
                            overflow: `visible`,
                          },
                          onPointerMove: ue,
                          onPointerLeave: () => E(null),
                          role: `img`,
                          "aria-label": `Frontier for every task ${q(P.frontier)}, with auto routing ${q(P.total)}`,
                          children: [
                            /*#__PURE__*/ f(`defs`, {
                              children: /*#__PURE__*/ f(`clipPath`, {
                                id: `gwo-router-clip`,
                                children: /*#__PURE__*/ f(`rect`, {
                                  x: 0,
                                  y: 0,
                                  width: ve,
                                  height: Ht,
                                }),
                              }),
                            }),
                            /*#__PURE__*/ f(`rect`, {
                              x: Q,
                              y: 209,
                              width: 250.3,
                              height: 1.2,
                              fill: Z.hover,
                            }),
                            /*#__PURE__*/ d(`g`, {
                              clipPath: `url(#gwo-router-clip)`,
                              children: [
                                /*#__PURE__*/ f(`path`, {
                                  d: _e,
                                  fill: St,
                                  fillOpacity: 0.16,
                                }),
                                /*#__PURE__*/ f(`path`, {
                                  d: mt(he),
                                  fill: `none`,
                                  stroke: Z.fgMuted,
                                  strokeWidth: 2,
                                  strokeDasharray: `5 4`,
                                }),
                                /*#__PURE__*/ f(`path`, {
                                  d: mt(ge),
                                  fill: `none`,
                                  stroke: X,
                                  strokeWidth: 2,
                                  strokeLinejoin: `round`,
                                }),
                              ],
                            }),
                            /*#__PURE__*/ d(`g`, {
                              opacity: +(x >= 1),
                              style: { transition: `opacity .3s ease` },
                              children: [
                                /*#__PURE__*/ f(`circle`, {
                                  cx: ye[0],
                                  cy: ye[1],
                                  r: 3.4,
                                  fill: Z.panel,
                                  stroke: Z.fgMuted,
                                  strokeWidth: 2,
                                }),
                                /*#__PURE__*/ f(`circle`, {
                                  cx: be[0],
                                  cy: be[1],
                                  r: 3.4,
                                  fill: Z.panel,
                                  stroke: X,
                                  strokeWidth: 2,
                                }),
                                /*#__PURE__*/ f(`text`, {
                                  x: ye[0] + 10,
                                  y: ye[1] - 3,
                                  fontSize: 11.5,
                                  fill: Z.fgBody,
                                  children: q(P.frontier),
                                }),
                                /*#__PURE__*/ f(`text`, {
                                  x: be[0] + 10,
                                  y: be[1] + 13,
                                  fontSize: 11.5,
                                  fill: Z.fgBody,
                                  children: q(P.total),
                                }),
                              ],
                            }),
                            T !== null &&
                              /*#__PURE__*/ f(`line`, {
                                x1: Q + (192.3 * T) / (V - 1),
                                x2: Q + (192.3 * T) / (V - 1),
                                y1: 100,
                                y2: 208,
                                stroke: Z.strong,
                                strokeWidth: 1,
                                pointerEvents: `none`,
                              }),
                            /*#__PURE__*/ f(`line`, {
                              x1: Q,
                              x2: 28,
                              y1: 236,
                              y2: 236,
                              stroke: Z.fgMuted,
                              strokeWidth: 2,
                              strokeDasharray: `3 2`,
                            }),
                            /*#__PURE__*/ f(`text`, {
                              x: 32,
                              y: 239.6,
                              fontSize: 10.5,
                              fill: Z.fgSecondary,
                              children: `Frontier for every task`,
                            }),
                            /*#__PURE__*/ f(`line`, {
                              x1: 160,
                              x2: 170,
                              y1: 236,
                              y2: 236,
                              stroke: X,
                              strokeWidth: 2,
                            }),
                            /*#__PURE__*/ f(`text`, {
                              x: 174,
                              y: 239.6,
                              fontSize: 10.5,
                              fill: Z.fgSecondary,
                              children: `With auto routing`,
                            }),
                            /*#__PURE__*/ f(`rect`, {
                              x: 8,
                              y: 96,
                              width: 212.3,
                              height: 122,
                              fill: `transparent`,
                            }),
                          ],
                        }),
                        T !== null &&
                          (() => {
                            let e = Q + (192.3 * T) / (V - 1),
                              t = (T + 1) / V,
                              n = Math.round((N.spent[V - 1] * t) / 10) * 10,
                              r =
                                Math.round(
                                  ((N.spent[V - 1] + N.savings) * t) / 10,
                                ) * 10,
                              i = e > Vt / 2;
                            return /*#__PURE__*/ d(`div`, {
                              role: `status`,
                              style: {
                                ...Ee,
                                left: i ? e - 10 : e + 10,
                                top: 92,
                                transform: i ? `translateX(-100%)` : void 0,
                                minWidth: 196,
                              },
                              children: [
                                /*#__PURE__*/ f(`div`, {
                                  style: {
                                    ...U(12, Z.fgMuted),
                                    marginBottom: 5,
                                  },
                                  children: ct(N, T),
                                }),
                                [
                                  {
                                    c: Z.fgMuted,
                                    dash: !0,
                                    l: `Frontier for every task`,
                                    v: r,
                                  },
                                  {
                                    c: X,
                                    dash: !1,
                                    l: `With auto routing`,
                                    v: n,
                                  },
                                ].map((e) =>
                                  /*#__PURE__*/ d(
                                    `div`,
                                    {
                                      style: {
                                        display: `flex`,
                                        alignItems: `center`,
                                        gap: 6,
                                        ...U(12, Z.fgBody),
                                        lineHeight: `18px`,
                                      },
                                      children: [
                                        /*#__PURE__*/ f(`svg`, {
                                          width: 10,
                                          height: 4,
                                          "aria-hidden": `true`,
                                          children: /*#__PURE__*/ f(`line`, {
                                            x1: 0,
                                            x2: 10,
                                            y1: 2,
                                            y2: 2,
                                            stroke: e.c,
                                            strokeWidth: 2,
                                            strokeDasharray: e.dash
                                              ? `3 2`
                                              : void 0,
                                          }),
                                        }),
                                        /*#__PURE__*/ f(`span`, {
                                          style: { flex: 1 },
                                          children: e.l,
                                        }),
                                        /*#__PURE__*/ f(`span`, {
                                          style: {
                                            color: Z.fg,
                                            fontWeight: 500,
                                          },
                                          children: q(e.v),
                                        }),
                                      ],
                                    },
                                    e.l,
                                  ),
                                ),
                                /*#__PURE__*/ d(`div`, {
                                  style: {
                                    display: `flex`,
                                    justifyContent: `space-between`,
                                    borderTop: `1px solid ${Z.border}`,
                                    marginTop: 5,
                                    paddingTop: 5,
                                    ...U(12, `#2fc79c`, 500),
                                  },
                                  children: [
                                    /*#__PURE__*/ f(`span`, {
                                      children: `Saved`,
                                    }),
                                    /*#__PURE__*/ f(`span`, {
                                      children: q(r - n),
                                    }),
                                  ],
                                }),
                              ],
                            });
                          })(),
                      ],
                    }),
                    /*#__PURE__*/ d(`div`, {
                      style: {
                        ...Te,
                        left: 0,
                        top: 396,
                        width: At,
                        height: Pt,
                      },
                      children: [
                        /*#__PURE__*/ f(`div`, {
                          style: {
                            ...W(20, 18),
                            ...U(16, Z.fg, 500, -0.16),
                            lineHeight: `20px`,
                          },
                          children: `Failover routing`,
                        }),
                        /*#__PURE__*/ f(`div`, {
                          style: { ...W(20, 42), ...U(12.5, Z.fgMuted) },
                          children: `When a provider errors, the chain retries the next one. Here is how this period went.`,
                        }),
                        /*#__PURE__*/ d(`div`, {
                          style: {
                            position: `absolute`,
                            right: 20,
                            top: 18,
                            display: `flex`,
                            alignItems: `center`,
                            gap: 8,
                          },
                          children: [
                            /*#__PURE__*/ f(`span`, {
                              style: {
                                height: 24,
                                padding: `0 8px`,
                                borderRadius: 6,
                                background: `rgba(3,169,126,.14)`,
                                color: `#2fc79c`,
                                display: `inline-flex`,
                                alignItems: `center`,
                                ...U(12, `#2fc79c`, 500),
                              },
                              children: `3 chains active`,
                            }),
                            /*#__PURE__*/ f(`button`, {
                              type: `button`,
                              className: `gwo-btn`,
                              style: {
                                height: 28,
                                padding: `0 10px`,
                                borderRadius: 8,
                                background: Z.hover,
                                border: `1px solid ${Z.border}`,
                                ...U(12.5, Z.fgBody),
                              },
                              children: `Open Model router`,
                            }),
                          ],
                        }),
                        [
                          { l: `Requests`, v: J(De), s: `this period`, x: 20 },
                          {
                            l: `Served on first try`,
                            v: J(ke),
                            s: `${Ae(ke)} of requests`,
                            x: 250,
                          },
                          {
                            l: `Rescued by failover`,
                            v: J(Oe),
                            s: `${Ae(Oe)} of requests`,
                            x: 520,
                          },
                        ].map((e) =>
                          /*#__PURE__*/ d(
                            `div`,
                            {
                              style: W(e.x, 76),
                              children: [
                                /*#__PURE__*/ f(`div`, {
                                  style: { ...U(13, Z.fgSecondary) },
                                  children: e.l,
                                }),
                                /*#__PURE__*/ d(`div`, {
                                  style: {
                                    display: `flex`,
                                    alignItems: `baseline`,
                                    gap: 8,
                                    marginTop: 6,
                                  },
                                  children: [
                                    /*#__PURE__*/ f(`span`, {
                                      style: { ...U(22, Z.fg, 500, -0.44) },
                                      children: e.v,
                                    }),
                                    /*#__PURE__*/ f(`span`, {
                                      style: { ...U(12, Z.fgMuted) },
                                      children: e.s,
                                    }),
                                  ],
                                }),
                              ],
                            },
                            e.l,
                          ),
                        ),
                        /*#__PURE__*/ d(`div`, {
                          style: {
                            ...W(20, 150),
                            display: `flex`,
                            alignItems: `center`,
                            gap: 6,
                            ...U(13, Z.fgSecondary),
                          },
                          children: [
                            `How requests got through `,
                            /*#__PURE__*/ f(_t, {
                              name: `info`,
                              size: 13,
                              color: Z.fgMuted,
                            }),
                          ],
                        }),
                        /*#__PURE__*/ d(`svg`, {
                          width: At,
                          height: Pt,
                          viewBox: `0 0 ${At} ${Pt}`,
                          style: { position: `absolute`, left: 0, top: 0 },
                          role: `img`,
                          "aria-label": `How requests got through`,
                          children: [
                            /*#__PURE__*/ d(`defs`, {
                              children: [
                                /*#__PURE__*/ d(`linearGradient`, {
                                  id: `gwo-fl-a`,
                                  x1: `0`,
                                  x2: `1`,
                                  children: [
                                    /*#__PURE__*/ f(`stop`, {
                                      offset: `0`,
                                      stopColor: `#a6ccff`,
                                    }),
                                    /*#__PURE__*/ f(`stop`, {
                                      offset: `1`,
                                      stopColor: X,
                                    }),
                                  ],
                                }),
                                /*#__PURE__*/ d(`linearGradient`, {
                                  id: `gwo-fl-b`,
                                  x1: `0`,
                                  x2: `1`,
                                  children: [
                                    /*#__PURE__*/ f(`stop`, {
                                      offset: `0`,
                                      stopColor: `#a6ccff`,
                                    }),
                                    /*#__PURE__*/ f(`stop`, {
                                      offset: `1`,
                                      stopColor: yt,
                                    }),
                                  ],
                                }),
                                /*#__PURE__*/ d(`linearGradient`, {
                                  id: `gwo-fl-c`,
                                  x1: `0`,
                                  x2: `1`,
                                  children: [
                                    /*#__PURE__*/ f(`stop`, {
                                      offset: `0`,
                                      stopColor: yt,
                                    }),
                                    /*#__PURE__*/ f(`stop`, {
                                      offset: `1`,
                                      stopColor: St,
                                    }),
                                  ],
                                }),
                                /*#__PURE__*/ d(`linearGradient`, {
                                  id: `gwo-fl-d`,
                                  x1: `0`,
                                  x2: `1`,
                                  children: [
                                    /*#__PURE__*/ f(`stop`, {
                                      offset: `0`,
                                      stopColor: X,
                                    }),
                                    /*#__PURE__*/ f(`stop`, {
                                      offset: `1`,
                                      stopColor: St,
                                    }),
                                  ],
                                }),
                                /*#__PURE__*/ f(`clipPath`, {
                                  id: `gwo-fl-clip`,
                                  children: /*#__PURE__*/ f(`rect`, {
                                    x: 0,
                                    y: 0,
                                    width: Math.max(0, 20 + 1080 * Me),
                                    height: Pt,
                                  }),
                                }),
                              ],
                            }),
                            [
                              `Requests`,
                              `First provider`,
                              `Failover`,
                              `Outcome`,
                            ].map((e, t) =>
                              /*#__PURE__*/ f(
                                `text`,
                                {
                                  x: t === 3 ? G[t] + 8 : G[t],
                                  y: 186,
                                  fontSize: 11,
                                  fill: Z.fgMuted,
                                  textAnchor: t === 3 ? `end` : `start`,
                                  children: e,
                                },
                                e,
                              ),
                            ),
                            /*#__PURE__*/ d(`g`, {
                              clipPath: `url(#gwo-fl-clip)`,
                              opacity: 0.95,
                              children: [
                                /*#__PURE__*/ f(`path`, {
                                  d: je(G[0], 0, 70, G[1], 0, 70),
                                  fill: `url(#gwo-fl-a)`,
                                  opacity: 0.28,
                                }),
                                /*#__PURE__*/ f(`path`, {
                                  d: je(G[0], 70, 76, G[1], 74, 80),
                                  fill: `url(#gwo-fl-b)`,
                                  opacity: 0.4,
                                }),
                                /*#__PURE__*/ f(`path`, {
                                  d: je(G[1], 0, 70, G[2], 0, 70),
                                  fill: X,
                                  opacity: 0.22,
                                }),
                                /*#__PURE__*/ f(`path`, {
                                  d: je(G[1], 74, 80, G[2], 74, 80),
                                  fill: `url(#gwo-fl-c)`,
                                  opacity: 0.4,
                                }),
                                /*#__PURE__*/ f(`path`, {
                                  d: je(G[2], 0, 70, G[3], 0, 70),
                                  fill: `url(#gwo-fl-d)`,
                                  opacity: 0.22,
                                }),
                                /*#__PURE__*/ f(`path`, {
                                  d: je(G[2], 74, 80, G[3], 70, 76),
                                  fill: St,
                                  opacity: 0.4,
                                }),
                                /*#__PURE__*/ f(`rect`, {
                                  x: G[0],
                                  y: 196,
                                  width: 8,
                                  height: 76,
                                  rx: 2,
                                  fill: `#a6ccff`,
                                }),
                                /*#__PURE__*/ f(`rect`, {
                                  x: G[1],
                                  y: 196,
                                  width: 8,
                                  height: 70,
                                  rx: 2,
                                  fill: X,
                                }),
                                /*#__PURE__*/ f(`rect`, {
                                  x: G[1],
                                  y: 270,
                                  width: 8,
                                  height: 6,
                                  rx: 2,
                                  fill: yt,
                                }),
                                /*#__PURE__*/ f(`rect`, {
                                  x: G[2],
                                  y: 196,
                                  width: 8,
                                  height: 70,
                                  rx: 2,
                                  fill: X,
                                }),
                                /*#__PURE__*/ f(`rect`, {
                                  x: G[2],
                                  y: 270,
                                  width: 8,
                                  height: 6,
                                  rx: 2,
                                  fill: St,
                                }),
                                /*#__PURE__*/ f(`rect`, {
                                  x: G[3],
                                  y: 196,
                                  width: 8,
                                  height: 76,
                                  rx: 2,
                                  fill: St,
                                }),
                              ],
                            }),
                            /*#__PURE__*/ d(`g`, {
                              fontSize: 11.5,
                              fill: Z.fgBody,
                              children: [
                                /*#__PURE__*/ d(`text`, {
                                  x: G[0] + 16,
                                  y: 236,
                                  children: [J(De), ` requests`],
                                }),
                                /*#__PURE__*/ d(`text`, {
                                  x: G[1] + 16,
                                  y: 230,
                                  children: [J(ke), ` served on first try`],
                                }),
                                /*#__PURE__*/ d(`text`, {
                                  x: G[1] + 16,
                                  y: 290,
                                  children: [J(Oe), ` provider errors`],
                                }),
                                /*#__PURE__*/ d(`text`, {
                                  x: G[2] + 16,
                                  y: 230,
                                  children: [J(ke), ` served on first try`],
                                }),
                                /*#__PURE__*/ d(`text`, {
                                  x: G[2] + 16,
                                  y: 290,
                                  children: [J(Oe), ` rescued by failover`],
                                }),
                                /*#__PURE__*/ d(`text`, {
                                  x: G[3] - 8,
                                  y: 236,
                                  textAnchor: `end`,
                                  children: [J(De), ` delivered`],
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      }),
      n
        ? /*#__PURE__*/ f(`div`, {
            "aria-hidden": `true`,
            style: {
              position: `absolute`,
              left: `50%`,
              width: `100vw`,
              transform: `translateX(-50%)`,
              top: `16%`,
              bottom: -1,
              pointerEvents: `none`,
              zIndex: 2,
              background: `linear-gradient(to bottom, rgba(8,8,8,0) 0%, rgba(8,8,8,.31) 30%, rgba(8,8,8,.75) 70%, #080808 100%)`,
            },
          })
        : null,
    ],
  });
}
var X,
  yt,
  bt,
  xt,
  St,
  Ct,
  wt,
  Tt,
  Z,
  Et,
  Dt,
  Ot,
  kt,
  At,
  jt,
  Mt,
  Nt,
  Pt,
  Ft,
  It,
  Lt,
  Rt,
  zt,
  Bt,
  Vt,
  Ht,
  Q,
  Ut,
  Wt,
  Gt,
  Kt,
  qt,
  Jt,
  Yt;
function Xt() {
  return (Xt = e(() => {
    r(),
      m(),
      ee(),
      j(),
      (X = `#5ca3ff`),
      (yt = `#fbb84b`),
      (bt = `#b08eff`),
      (xt = `#484848`),
      (St = `#03a97e`),
      (Ct = {
        "7d": {
          key: `7d`,
          start: [2026, 9, 19],
          days: 7,
          spent: [2050, 4280, 6380, 8690, 10940],
          projected: 15310,
          savings: 2310,
          budget: 16e3,
          axisMax: 2e4,
          routedShare: 66,
          requests: 296410,
          rescued: 3120,
          modelCount: 7,
          models: [
            { name: `gpt-5.3`, color: X, amount: 4160 },
            { name: `claude-sonnet-5`, color: yt, amount: 2730 },
            { name: `glm-5`, color: bt, amount: 1860 },
            { name: `Other (4 models)`, color: xt, amount: 2190 },
          ],
        },
        "30d": {
          key: `30d`,
          start: [2026, 9, 1],
          days: 30,
          spent: [
            2120, 3980, 5970, 7310, 8510, 10610, 12870, 15200, 17580, 19820,
            21280, 22590, 24990, 27530, 30110, 32570, 34990, 36560, 37970,
            40500, 43120, 45790, 48210,
          ],
          projected: 62880,
          savings: 9830,
          budget: 7e4,
          axisMax: 8e4,
          routedShare: 64,
          requests: 1284310,
          rescued: 12840,
          modelCount: 7,
          models: [
            { name: `gpt-5.3`, color: X, amount: 17840 },
            { name: `claude-sonnet-5`, color: yt, amount: 12530 },
            { name: `glm-5`, color: bt, amount: 7710 },
            { name: `Other (4 models)`, color: xt, amount: 10130 },
          ],
        },
        QTD: {
          key: `QTD`,
          start: [2026, 7, 1],
          days: 92,
          spent: [
            1270, 2520, 3880, 5120, 6470, 7560, 8600, 9970, 11250, 12630, 13940,
            15260, 16410, 17650, 19e3, 20390, 21890, 23470, 24970, 26180, 27510,
            28920, 30540, 32030, 33490, 34960, 36210, 37570, 39090, 40720,
            42370, 43970, 45620, 46880, 48150, 49750, 51480, 53160, 54820,
            56570, 57980, 59360, 61200, 63030, 64730, 66550, 68360, 69940,
            71490, 73270, 75260, 77010, 78860, 80820, 82290, 83860, 85640,
            87630, 89650, 91640, 93730, 95300, 96990, 99030, 101070, 103090,
            105250, 107450, 109140, 110890, 112840, 115010, 117180, 119470,
            121730, 123430, 125180, 127420, 129440, 131630, 133730, 135820,
            137530, 139460,
          ],
          projected: 157780,
          savings: 27140,
          budget: 18e4,
          axisMax: 2e5,
          routedShare: 61,
          requests: 3915600,
          rescued: 41230,
          modelCount: 7,
          models: [
            { name: `gpt-5.3`, color: X, amount: 53e3 },
            { name: `claude-sonnet-5`, color: yt, amount: 34860 },
            { name: `glm-5`, color: bt, amount: 20920 },
            { name: `Other (4 models)`, color: xt, amount: 30680 },
          ],
        },
      }),
      (wt = [`7d`, `30d`, `QTD`]),
      (Tt = [
        `Jan`,
        `Feb`,
        `Mar`,
        `Apr`,
        `May`,
        `Jun`,
        `Jul`,
        `Aug`,
        `Sep`,
        `Oct`,
        `Nov`,
        `Dec`,
      ]),
      (Z = {
        frame: `#1e1e1e`,
        surface: `#181818`,
        panel: `#141414`,
        subtle: `#1e1e1e`,
        hover: `#252525`,
        border: `#2e2e2e`,
        strong: `#484848`,
        fgMuted: `#9e9e9e`,
        fgSecondary: `#b0b0b0`,
        fgBody: `#e0e0e0`,
        fg: `#f5f5f5`,
        ink: `#080808`,
      }),
      (Et = 1440),
      (Dt = 56.4),
      (Ot = 240),
      (kt = 40),
      (At = 1120),
      (jt = 97),
      (Mt = 80),
      (Nt = 268),
      (Pt = 300),
      (Ft = 515.4),
      (It = Nt),
      (Lt = 52),
      (Rt = 495.4),
      (zt = 222),
      (Bt = 286.3),
      (Vt = Bt),
      (Ht = Nt),
      (Q = 18),
      (Ut = 206),
      (Wt = 160),
      (Gt = {
        arrowsSplit: `M229.66,189.66l-32,32a8,8,0,0,1-11.32,0l-32-32a8,8,0,0,1,11.32-11.32L184,196.69V139.31l-56-56-56,56v57.38l18.34-18.35a8,8,0,0,1,11.32,11.32l-32,32a8,8,0,0,1-11.32,0l-32-32a8,8,0,0,1,11.32-11.32L56,196.69V136a8,8,0,0,1,2.34-5.66L120,68.69V24a8,8,0,0,1,16,0V68.69l61.66,61.65A8,8,0,0,1,200,136v60.69l18.34-18.35a8,8,0,0,1,11.32,11.32Z`,
        chartBar: `M224,200h-8V40a8,8,0,0,0-8-8H152a8,8,0,0,0-8,8V80H96a8,8,0,0,0-8,8v40H48a8,8,0,0,0-8,8v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16ZM160,48h40V200H160ZM104,96h40V200H104ZM56,144H88v56H56Z`,
        chartLine: `M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0v94.37L90.73,98a8,8,0,0,1,10.07-.38l58.81,44.11L218.73,90a8,8,0,1,1,10.54,12l-64,56a8,8,0,0,1-10.07.38L96.39,114.29,40,163.630V200H224A8,8,0,0,1,232,208Z`,
        listChecks: `M224,128a8,8,0,0,1-8,8H128a8,8,0,0,1,0-16h88A8,8,0,0,1,224,128ZM128,72h88a8,8,0,0,0,0-16H128a8,8,0,0,0,0,16Zm88,112H128a8,8,0,0,0,0,16h88a8,8,0,0,0,0-16ZM82.34,42.34,56,68.690,45.66,58.34A8,8,0,0,0,34.34,69.66l16,16a8,8,0,0,0,11.32,0l32-32A8,8,0,0,0,82.34,42.34Zm0,64L56,132.69,45.66,122.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32,0l32-32a8,8,0,0,0-11.32-11.32Zm0,64L56,196.69,45.66,186.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32,0l32-32a8,8,0,0,0-11.32-11.32Z`,
        dollar: `M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-68a28,28,0,0,1-28,28h-4v8a8,8,0,0,1-16,0v-8H104a8,8,0,0,1,0-16h36a12,12,0,0,0,0-24H116a28,28,0,0,1,0-56h4V72a8,8,0,0,1,16,0v8h16a8,8,0,0,1,0,16H116a12,12,0,0,0,0,24h24A28,28,0,0,1,168,148Z`,
        shieldCheck: `M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.930,102.19,23.06,18.86,46,25.26,47,25.53a8,8,0,0,0,4.2,0c1-.27,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Zm0,72c0,37.07-13.66,67.16-40.6,89.42A129.3,129.3,0,0,1,128,223.62a128.25,128.25,0,0,1-38.92-21.810C61.82,179.51,48,149.3,48,112l0-56,160,0ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z`,
        magnifier: `M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.070a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z`,
        sidebar: `M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM40,56H80V200H40ZM216,200H96V56H216V200Z`,
        info: `M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z`,
      }),
      (Kt = {
        cube: {
          d: `M5 0L10 2.708V8.125L5 10.833L0 8.125V2.708Z M0 2.708L5 5.417L10 2.708 M5 5.417V10.833`,
          dx: 1.25,
          dy: 0.833,
        },
        signpost: {
          d: `M4.584 0V1.25 M4.584 7.083V10.833 M0 1.25H8.125L10.209 4.167L8.125 7.083H0Z`,
          dx: 1.15,
          dy: 0.833,
        },
        plug: {
          d: `M2.083 0V2.5 M5.416 0V2.5 M0 2.5H7.5V4.583A3.75 3.75 0 0 1 3.75 8.333A3.75 3.75 0 0 1 0 4.583Z M3.75 8.333V10.833`,
          dx: 2.5,
          dy: 0.833,
        },
      }),
      (qt = [
        {
          group: `Observe`,
          items: [
            { label: `Overview`, icon: `chartBar` },
            { label: `Usage`, icon: `chartLine` },
            { label: `Tasks`, icon: `listChecks` },
          ],
        },
        {
          group: `Control`,
          items: [
            { label: `Model access`, icon: `cube` },
            { label: `Model router`, icon: `signpost` },
            { label: `Spend limits`, icon: `dollar` },
            { label: `Governance`, icon: `shieldCheck` },
            { label: `Connectors`, icon: `plug` },
          ],
        },
      ]),
      (Jt = [40.8, 50.4, 52.8]),
      (Yt = `
.gwo, .gwo * { box-sizing: border-box; }
.gwo { font-family: "Inter", "Inter Placeholder", system-ui, sans-serif; -webkit-font-smoothing: antialiased; color: ${Z.fgBody}; }
.gwo button { font: inherit; color: inherit; background: none; border: 0; margin: 0; padding: 0; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.gwo button:focus-visible, .gwo [tabindex]:focus-visible { outline: 2.4px solid ${X}; outline-offset: 2px; }
.gwo-iconbtn { transition: background-color .15s ease, transform .1s ease; }
.gwo-iconbtn:hover { background-color: ${Z.hover} !important; }
.gwo-iconbtn:active { background-color: ${Z.border} !important; transform: scale(.96); }
.gwo-avatar { transition: box-shadow .15s ease, transform .1s ease; }
.gwo-avatar:hover { box-shadow: 0 0 0 1px rgba(255,255,255,.22) !important; }
.gwo-avatar:active { transform: scale(.96); }
.gwo-nav { transition: background-color .15s ease, color .15s ease; }
.gwo-nav:hover { background-color: ${Z.subtle}; color: ${Z.fgBody}; }
.gwo-nav[aria-current="page"] { background-color: ${Z.hover}; color: ${Z.fgBody}; }
.gwo-nav[aria-current="page"] svg { color: ${Z.fgBody}; }
.gwo-btn { transition: background-color .15s ease, border-color .15s ease, transform .1s ease; }
.gwo-btn:hover { background-color: ${Z.hover} !important; border-color: ${Z.strong} !important; }
.gwo-btn:active { transform: scale(.97); }
.gwo-seg { transition: color .2s ease; }
.gwo-seg:hover { color: ${Z.fgBody} !important; }
.gwo-pill { transition: left .28s cubic-bezier(.3,.7,.2,1), width .28s cubic-bezier(.3,.7,.2,1); }
.gwo-crumb { transition: background-color .15s ease, color .15s ease; border-radius: 6px; }
.gwo-crumb:hover { background-color: ${Z.subtle}; color: ${Z.fgBody} !important; }
.gwo-scroll { overflow-y: auto; overflow-x: hidden; overscroll-behavior: auto; scrollbar-width: none; -ms-overflow-style: none; }
.gwo-scroll::-webkit-scrollbar { width: 0; height: 0; display: none; }
.gwo-row, .gwo-segbar > div { transition: opacity .18s ease; }
@media (prefers-reduced-motion: reduce) {
  .gwo *, .gwo *::before, .gwo *::after { transition: none !important; }
}
`),
      void 0;
  }))();
}
Xt()
export default vt
