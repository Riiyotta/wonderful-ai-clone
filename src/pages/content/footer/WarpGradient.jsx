import { useEffect, useRef } from 'react'

// Port of the Framer code component "Animated Gradient Background" (paper-design "warp" shader,
// WebGL2) used by the White L footer band on /legal. Live instance props: preset custom, colours
// rgb(236,232,225) / rgb(206,216,255) / #fff, rotation 123, proportion 75, scale .08, speed 75,
// distortion 0, swirl 16, swirlIterations 4 (16 on tablet+phone), softness 100, offset 88,
// shape Edge, shapeSize 22. Speed = cubic-bezier(.65,0,.88,.77)(speed/100) * 5 while in view.
const VERT = `#version 300 es
layout(location = 0) in vec4 a_position;
void main() { gl_Position = a_position; }
`
const FRAG = `#version 300 es
precision highp float;
uniform float u_time;
uniform float u_pixelRatio;
uniform vec2 u_resolution;
uniform float u_scale;
uniform float u_rotation;
uniform vec4 u_color1;
uniform vec4 u_color2;
uniform vec4 u_color3;
uniform float u_proportion;
uniform float u_softness;
uniform float u_shape;
uniform float u_shapeScale;
uniform float u_distortion;
uniform float u_swirl;
uniform float u_swirlIterations;
out vec4 fragColor;
#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846
vec2 rotate(vec2 uv, float th) { return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv; }
float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123); }
float noise(vec2 st) {
  vec2 i = floor(st); vec2 f = fract(st);
  float a = random(i); float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0)); float d = random(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  float x1 = mix(a, b, u.x); float x2 = mix(c, d, u.x);
  return mix(x1, x2, u.y);
}
vec4 blend_colors(vec4 c1, vec4 c2, vec4 c3, float mixer, float edgesWidth, float edge_blur) {
  vec3 color1 = c1.rgb * c1.a; vec3 color2 = c2.rgb * c2.a; vec3 color3 = c3.rgb * c3.a;
  float r1 = smoothstep(.0 + .35 * edgesWidth, .7 - .35 * edgesWidth + .5 * edge_blur, mixer);
  float r2 = smoothstep(.3 + .35 * edgesWidth, 1. - .35 * edgesWidth + edge_blur, mixer);
  vec3 blended_color_2 = mix(color1, color2, r1);
  float blended_opacity_2 = mix(c1.a, c2.a, r1);
  vec3 c = mix(blended_color_2, color3, r2);
  float o = mix(blended_opacity_2, c3.a, r2);
  return vec4(c, o);
}
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float t = .5 * u_time;
  float noise_scale = .0005 + .006 * u_scale;
  uv -= .5; uv *= (noise_scale * u_resolution); uv = rotate(uv, u_rotation * .5 * PI); uv /= u_pixelRatio; uv += .5;
  float n1 = noise(uv * 1. + t); float n2 = noise(uv * 2. - t);
  float angle = n1 * TWO_PI;
  uv.x += 4. * u_distortion * n2 * cos(angle);
  uv.y += 4. * u_distortion * n2 * sin(angle);
  float iterations_number = ceil(clamp(u_swirlIterations, 1., 30.));
  for (float i = 1.; i <= iterations_number; i++) {
    uv.x += clamp(u_swirl, 0., 2.) / i * cos(t + i * 1.5 * uv.y);
    uv.y += clamp(u_swirl, 0., 2.) / i * cos(t + i * 1. * uv.x);
  }
  float proportion = clamp(u_proportion, 0., 1.);
  float shape = 0.; float mixer = 0.;
  if (u_shape < .5) {
    vec2 checks_shape_uv = uv * (.5 + 3.5 * u_shapeScale);
    shape = .5 + .5 * sin(checks_shape_uv.x) * cos(checks_shape_uv.y);
    mixer = shape + .48 * sign(proportion - .5) * pow(abs(proportion - .5), .5);
  } else if (u_shape < 1.5) {
    vec2 stripes_shape_uv = uv * (.25 + 3. * u_shapeScale);
    float f = fract(stripes_shape_uv.y);
    shape = smoothstep(.0, .55, f) * smoothstep(1., .45, f);
    mixer = shape + .48 * sign(proportion - .5) * pow(abs(proportion - .5), .5);
  } else {
    float sh = 1. - uv.y; sh -= .5; sh /= (noise_scale * u_resolution.y); sh += .5;
    float shape_scaling = .2 * (1. - u_shapeScale);
    shape = smoothstep(.45 - shape_scaling, .55 + shape_scaling, sh + .3 * (proportion - .5));
    mixer = shape;
  }
  vec4 color_mix = blend_colors(u_color1, u_color2, u_color3, mixer, 1. - clamp(u_softness, 0., 1.), .01 + .01 * u_scale);
  fragColor = vec4(color_mix.rgb, color_mix.a);
}
`
const rgba = (s) => { const m = s.match(/\d+(\.\d+)?/g).map(Number); return [m[0] / 255, m[1] / 255, m[2] / 255, m[3] ?? 1] }

// cubic-bezier(x1,y1,x2,y2) evaluated at x (motion's easing).
function cubicBezier(x1, y1, x2, y2) {
  const a = (a1, a2) => 1 - 3 * a2 + 3 * a1, b = (a1, a2) => 3 * a2 - 6 * a1, c = (a1) => 3 * a1
  const calc = (t, a1, a2) => ((a(a1, a2) * t + b(a1, a2)) * t + c(a1)) * t
  return (x) => {
    let lo = 0, hi = 1, t = x
    for (let i = 0; i < 40; i++) { t = (lo + hi) / 2; if (calc(t, x1, x2) < x) lo = t; else hi = t }
    return calc(t, y1, y2)
  }
}

export default function WarpGradient({
  color1 = 'rgb(236, 232, 225)', color2 = 'rgb(206, 216, 255)', color3 = 'rgb(255, 255, 255)',
  rotation = 123, proportion = 75, scale = 0.08, speed = 75, distortion = 0, swirl = 16,
  swirlIterations = 4, softness = 100, offset = 88, shape = 2, shapeSize = 22,
}) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl2')
    if (!gl) return
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s }
    const prog = gl.createProgram()
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    gl.useProgram(prog)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'a_position')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const U = (n) => gl.getUniformLocation(prog, n)
    gl.uniform1f(U('u_scale'), scale)
    gl.uniform1f(U('u_rotation'), (rotation * Math.PI) / 180)
    gl.uniform4fv(U('u_color1'), rgba(color1))
    gl.uniform4fv(U('u_color2'), rgba(color2))
    gl.uniform4fv(U('u_color3'), rgba(color3))
    gl.uniform1f(U('u_proportion'), proportion / 100)
    gl.uniform1f(U('u_softness'), softness / 100)
    gl.uniform1f(U('u_distortion'), distortion / 50)
    gl.uniform1f(U('u_swirl'), swirl / 100)
    gl.uniform1f(U('u_swirlIterations'), swirl === 0 ? 0 : swirlIterations)
    gl.uniform1f(U('u_shapeScale'), shapeSize / 100)
    gl.uniform1f(U('u_shape'), shape)
    const uTime = U('u_time'), uRes = U('u_resolution'), uPr = U('u_pixelRatio')

    const rate = cubicBezier(0.65, 0, 0.88, 0.77)(speed / 100) * 5
    let total = offset * 10 * 8.333333333333334 // setSeed(offset * 10)
    let last = performance.now(), raf = 0, running = false
    const render = (now) => {
      const dt = now - last
      last = now
      if (running) total += dt * rate
      gl.uniform1f(uTime, total * 0.001)
      gl.uniform2f(uRes, gl.canvas.width, gl.canvas.height)
      gl.uniform1f(uPr, window.devicePixelRatio)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      if (running) raf = requestAnimationFrame(render)
    }
    const resize = () => {
      const dpr = window.devicePixelRatio
      const w = canvas.clientWidth * dpr, h = canvas.clientHeight * dpr
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h) }
      render(performance.now())
    }
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && e.intersectionRatio >= 0.1) {
        if (!running) { running = true; last = performance.now(); raf = requestAnimationFrame(render) }
      } else { running = false; cancelAnimationFrame(raf) }
    }, { threshold: [0, 0.1] })
    io.observe(wrapRef.current)
    return () => { ro.disconnect(); io.disconnect(); cancelAnimationFrame(raf); gl.deleteProgram(prog) }
  }, [color1, color2, color3, rotation, proportion, scale, speed, distortion, swirl, swirlIterations, softness, offset, shape, shapeSize])

  return (
    <div ref={wrapRef} style={{ borderRadius: 0, overflow: 'hidden', position: 'relative', height: '100%', width: '100%' }}>
      <canvas ref={canvasRef} style={{ height: '100%', width: '100%', display: 'block' }} />
    </div>
  )
}
