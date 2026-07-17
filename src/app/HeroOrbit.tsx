'use client'

import { ReactNode, useEffect, useRef } from 'react'

import { breathEnvelope, breathState } from './breath'

/**
 * A spatial field the portrait is suspended in — not an orbital system
 * around it. The traces share an implied focal centre displaced to the
 * upper right, partly beyond the viewport, so what crosses the page reads
 * as fragments of a much larger system. Only long partial arcs are drawn
 * (never closed loops, never the centre itself); a few nodes travel them.
 *
 * Each trace is still a true 3D ellipse projected with mild perspective.
 * Depth (z) decides front/back layering, size, and opacity — but "in
 * front" is confined to the portrait zone: far from the face everything
 * renders behind the page text.
 *
 * Scene units are face-box pixels (face box ~340px wide at lg), origin at
 * the portrait centre. The SVG viewBox is [-1900..600] x [-800..350] — wide
 * enough that the long traces run off the left viewport edge un-clipped, but
 * ending just under the portrait so the field never adds scroll height
 * below the footer.
 */

type Orbit = {
  cx: number // field-centre offset from the portrait (scene units)
  cy: number
  a: number // semi-major axis
  e: number // eccentricity
  pitch: number // tilt toward the viewer (rad) — the source of depth
  yaw: number // rotation around the vertical axis (rad)
  roll: number // rotation in the screen plane (rad)
  period: number // seconds per revolution
  phase: number // body start angle
  gapCenter: number // angular centre of the untraced span (rad)
  gapWidth: number // angular width of the untraced span (rad)
  precessAmp: number // slow yaw oscillation amplitude (rad)
  precessPeriod: number // seconds per precession cycle
  frontOp: number
  backOp: number
  body: { r: number; op: number; kind: 'bright' | 'dim' | 'faint' }
}

// High eccentricity makes each trace a long comet-like sweep whose focus
// sits at the displaced field centre; the far tips reach across the page.
const ORBITS: Orbit[] = [
  // Long sweep: dips from behind the text column, crosses the hero band,
  // climbs out toward the field centre off the upper right.
  {
    cx: 250, cy: -350, a: 700, e: 0.9, pitch: 0.6, yaw: 0.12, roll: -0.3,
    period: 170, phase: 1.2, gapCenter: 0.2, gapWidth: 1.6,
    precessAmp: 0.02, precessPeriod: 90,
    frontOp: 0.1, backOp: 0.055,
    body: { r: 2.2, op: 0.4, kind: 'dim' },
  },
  // Nearer trace: crosses the portrait band, the one allowed front passes.
  {
    cx: 330, cy: -140, a: 520, e: 0.82, pitch: 0.75, yaw: -0.15, roll: 0.1,
    period: 105, phase: 3.9, gapCenter: 5.6, gapWidth: 1.4,
    precessAmp: 0.026, precessPeriod: 70,
    frontOp: 0.12, backOp: 0.06,
    body: { r: 2.6, op: 0.55, kind: 'bright' },
  },
  // Far faint fragment: high across the top, exits the frame.
  {
    cx: 150, cy: -480, a: 950, e: 0.88, pitch: 0.55, yaw: 0.3, roll: -0.12,
    period: 240, phase: 5.3, gapCenter: 0.5, gapWidth: 2.0,
    precessAmp: 0.016, precessPeriod: 120,
    frontOp: 0.07, backOp: 0.04,
    body: { r: 1.5, op: 0.28, kind: 'faint' },
  },
]

// Sparse fixed dust at varied depths: [x, y, z, r, opacity].
// A few sit far out in the field so the space reads wider than the portrait.
const BACK_DUST: Array<[number, number, number, number, number]> = [
  [-310, -120, -140, 1.1, 0.13], [255, -215, -170, 0.9, 0.11],
  [-180, 235, -120, 1.3, 0.15], [330, 90, -190, 1, 0.1],
  [-345, 30, -90, 1.2, 0.14], [140, -300, -150, 0.9, 0.12],
  [60, 310, -110, 1.1, 0.13], [295, 240, -200, 1, 0.1],
  [-250, -260, -100, 1.4, 0.16], [-60, -330, -160, 0.9, 0.11],
  [-560, -40, -130, 1, 0.09], [-700, 150, -170, 1.1, 0.08],
  [-480, -300, -110, 0.9, 0.08], [450, -420, -150, 1, 0.09],
  [-920, 80, -140, 1, 0.08], [-1180, -150, -170, 1.1, 0.07],
  [-1050, 280, -120, 0.9, 0.07], [-1420, 40, -150, 1, 0.06],
]
const FRONT_DUST: Array<[number, number, number, number, number]> = [
  [-190, -95, 70, 1.2, 0.22], [240, 150, 95, 1.5, 0.26],
  [-120, 210, 60, 1.1, 0.2], [90, -180, 110, 1.4, 0.28],
]

const FOCAL = 1500
const PATH_SAMPLES = 220
const SVG_NS = 'http://www.w3.org/2000/svg'

// "In front of the face" is earned only near the portrait; elsewhere the
// field stays behind the page content (headline included).
const FRONT_ZONE = { x: 290, y: 330 }

const RAIN_COLUMNS = [
  { left: '-30%', top: '6%', height: '64%', duration: '120s', opacity: '0.10' },
  { left: '-16%', top: '-6%', height: '80%', duration: '90s', opacity: '0.07' },
  { left: '-3%', top: '14%', height: '58%', duration: '150s', opacity: '0.05' },
  { left: '103%', top: '2%', height: '72%', duration: '100s', opacity: '0.08' },
  { left: '116%', top: '-4%', height: '82%', duration: '135s', opacity: '0.06' },
  { left: '129%', top: '18%', height: '56%', duration: '165s', opacity: '0.09' },
]

const RAIN_BITS = [
  '10110100 01101001 10010110 01011011 00101101 10110010 01001011 10100101',
  '01001011 10110100 00101101 11010010 10010110 01101001 10110010 00110101',
  '11010010 01011010 10100101 00101101 01101001 10010110 11010100 01011011',
  '00101101 10010110 01101001 10110100 01001011 11010010 00110101 10100101',
  '10010110 00101101 11010100 01101001 01011011 10110100 10100101 01001011',
  '01101001 11010010 10110100 10010110 00101101 01011010 11010100 00110101',
]

type Projected = { x: number; y: number; z: number; scale: number }

function orbitPoint(orbit: Orbit, E: number, yawNow: number): Projected {
  const b = orbit.a * Math.sqrt(1 - orbit.e * orbit.e)
  const x0 = orbit.a * (Math.cos(E) - orbit.e)
  const y0 = b * Math.sin(E)

  // yaw (around Y): depth from horizontal position
  const x1 = x0 * Math.cos(yawNow)
  const z1 = -x0 * Math.sin(yawNow)
  // pitch (around X): depth from vertical position — the main tilt
  const y2 = y0 * Math.cos(orbit.pitch) - z1 * Math.sin(orbit.pitch)
  const z2 = y0 * Math.sin(orbit.pitch) + z1 * Math.cos(orbit.pitch)
  // roll (screen plane): artistic orientation
  const x3 = x1 * Math.cos(orbit.roll) - y2 * Math.sin(orbit.roll)
  const y3 = x1 * Math.sin(orbit.roll) + y2 * Math.cos(orbit.roll)

  // displace to the shared field centre, then project about the portrait
  const scale = FOCAL / (FOCAL - Math.min(z2, FOCAL * 0.6))
  return { x: (x3 + orbit.cx) * scale, y: (y3 + orbit.cy) * scale, z: z2, scale }
}

function inFrontZone(p: Projected) {
  return p.z > 0 && Math.abs(p.x) < FRONT_ZONE.x && Math.abs(p.y) < FRONT_ZONE.y
}

function inGap(E: number, orbit: Orbit) {
  const tau = Math.PI * 2
  let d = Math.abs(((E - orbit.gapCenter) % tau) + tau) % tau
  if (d > Math.PI) d = tau - d
  return d < orbit.gapWidth / 2
}

// One path element per (orbit, side); disjoint arcs become subpaths.
function buildPathD(orbit: Orbit, yawNow: number, front: boolean) {
  let d = ''
  let started = false
  for (let i = 0; i <= PATH_SAMPLES; i++) {
    const E = (i / PATH_SAMPLES) * Math.PI * 2
    if (inGap(E, orbit)) {
      started = false
      continue
    }
    const p = orbitPoint(orbit, E, yawNow)
    if (inFrontZone(p) !== front) {
      started = false
      continue
    }
    d += `${started ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`
    started = true
  }
  return d
}

export default function HeroOrbit({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const backLayerRef = useRef<HTMLDivElement | null>(null)
  const frontLayerRef = useRef<HTMLDivElement | null>(null)
  const faceLayerRef = useRef<HTMLDivElement | null>(null)
  const backPathsRef = useRef<SVGGElement | null>(null)
  const backBodiesRef = useRef<SVGGElement | null>(null)
  const frontPathsRef = useRef<SVGGElement | null>(null)
  const frontBodiesRef = useRef<SVGGElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    const backPaths = backPathsRef.current
    const backBodies = backBodiesRef.current
    const frontPaths = frontPathsRef.current
    const frontBodies = frontBodiesRef.current
    const backLayer = backLayerRef.current
    const frontLayer = frontLayerRef.current
    const faceLayer = faceLayerRef.current
    if (!root || !backPaths || !backBodies || !frontPaths || !frontBodies) return
    if (!backLayer || !frontLayer || !faceLayer) return

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // --- build persistent elements ---
    const orbitEls = ORBITS.map((orbit) => {
      const back = document.createElementNS(SVG_NS, 'path')
      back.setAttribute('class', 'orbit-path')
      back.setAttribute('stroke-opacity', String(orbit.backOp))
      backPaths.appendChild(back)

      const front = document.createElementNS(SVG_NS, 'path')
      front.setAttribute('class', 'orbit-path')
      front.setAttribute('stroke-opacity', String(orbit.frontOp))
      frontPaths.appendChild(front)

      const body = document.createElementNS(SVG_NS, 'circle')
      body.setAttribute('class', `orbit-body orbit-body--${orbit.body.kind}`)
      backBodies.appendChild(body)

      return { back, front, body }
    })

    const dustEls = [...BACK_DUST, ...FRONT_DUST].map((dust, index) => {
      const isFront = index >= BACK_DUST.length
      const el = document.createElementNS(SVG_NS, 'circle')
      el.setAttribute('class', 'orbit-dust')
      el.setAttribute('r', String(dust[3]))
      el.setAttribute('fill-opacity', String(dust[4]))
      ;(isFront ? frontBodies : backBodies).appendChild(el)
      return { el, dust }
    })

    // --- camera with inertia ---
    const cameraTarget = { x: 0, y: 0 }
    const camera = { x: 0, y: 0 }

    const onPointerMove = (event: PointerEvent) => {
      cameraTarget.x = (event.clientX / window.innerWidth - 0.5) * 8
      cameraTarget.y = (event.clientY / window.innerHeight - 0.5) * 6
    }
    const onPointerLeave = () => {
      cameraTarget.x = 0
      cameraTarget.y = 0
    }

    let raf = 0
    let running = true
    let frame = 0
    const t0 = performance.now()

    // Breathing cycle, re-seeded while the breath is at rest so duration and
    // intensity vary without a visible jump.
    let cycleStart = 0
    let cycleDuration = 7.8 + Math.random() * 1.2
    let cycleStrength = 0.88 + Math.random() * 0.18

    function renderFrame(t: number) {
      let progress = (t - cycleStart) / cycleDuration
      if (progress >= 1) {
        cycleStart = t
        cycleDuration = 7.8 + Math.random() * 1.2
        cycleStrength = 0.88 + Math.random() * 0.18
        progress = 0
      }
      const breathRaw = breathEnvelope(Math.max(0, progress))
      const b = breathRaw * cycleStrength
      breathState.value = breathRaw
      breathState.strength = cycleStrength

      camera.x += (cameraTarget.x - camera.x) * 0.045
      camera.y += (cameraTarget.y - camera.y) * 0.045

      // Whole-field drift: slow, non-repeating-feeling figure
      const driftX = 2.6 * Math.sin((t / 43) * Math.PI * 2)
      const driftY = 2.1 * Math.sin((t / 61) * Math.PI * 2 + 1.3)

      // The face carries the breath (rise, swell, brighten); the surrounding
      // field answers at a fraction of the strength so both share one
      // atmosphere without the space visibly pulsing.
      backLayer!.style.transform = `translate3d(${(driftX + camera.x * 0.3).toFixed(2)}px, ${(driftY + camera.y * 0.3).toFixed(2)}px, 0) scale(${(1 + b * 0.0012).toFixed(5)})`
      faceLayer!.style.transform = `translate3d(${(driftX + camera.x * 0.35).toFixed(2)}px, ${(driftY + camera.y * 0.35 - b * 1.2).toFixed(2)}px, 0) scale(${(1 + b * 0.006).toFixed(5)})`
      faceLayer!.style.filter = `brightness(${(1 + b * 0.025).toFixed(4)}) contrast(${(1 + b * 0.008).toFixed(4)})`
      faceLayer!.style.setProperty('--breath', breathRaw.toFixed(4))
      faceLayer!.style.setProperty('--breath-strength', cycleStrength.toFixed(3))
      frontLayer!.style.transform = `translate3d(${(driftX + camera.x).toFixed(2)}px, ${(driftY + camera.y).toFixed(2)}px, 0) scale(${(1 + b * 0.0035).toFixed(5)})`

      ORBITS.forEach((orbit, index) => {
        const yawNow =
          orbit.yaw +
          orbit.precessAmp * Math.sin((t / orbit.precessPeriod) * Math.PI * 2)

        // Paths change only with slow precession — refresh at ~10Hz.
        if (frame % 6 === 0) {
          orbitEls[index].back.setAttribute('d', buildPathD(orbit, yawNow, false))
          orbitEls[index].front.setAttribute('d', buildPathD(orbit, yawNow, true))
        }

        const E = orbit.phase + (t / orbit.period) * Math.PI * 2
        const p = orbitPoint(orbit, E, yawNow)
        const proximity = Math.max(0, Math.min(1, (p.z / orbit.a + 1) / 2))
        const body = orbitEls[index].body
        body.setAttribute('cx', p.x.toFixed(1))
        body.setAttribute('cy', p.y.toFixed(1))
        body.setAttribute('r', (orbit.body.r * (0.92 + proximity * 0.16)).toFixed(2))
        body.setAttribute(
          'fill-opacity',
          (orbit.body.op * (0.55 + proximity * 0.65)).toFixed(3),
        )
        const layer = inFrontZone(p) ? frontBodies : backBodies
        if (body.parentNode !== layer) layer!.appendChild(body)
      })

      dustEls.forEach(({ el, dust }, index) => {
        const wobble = t / (24 + (index % 5) * 7) + index * 1.7
        el.setAttribute('cx', (dust[0] + 2.6 * Math.sin(wobble)).toFixed(1))
        el.setAttribute('cy', (dust[1] + 2.1 * Math.cos(wobble * 0.9)).toFixed(1))
      })

      frame++
    }

    function loop(now: number) {
      if (!running) return
      renderFrame((now - t0) / 1000)
      raf = requestAnimationFrame(loop)
    }

    // Static single render for reduced motion; live scene otherwise.
    renderFrame(0)
    frame = 0

    let io: IntersectionObserver | null = null
    if (!reduced) {
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      document.documentElement.addEventListener('pointerleave', onPointerLeave)
      raf = requestAnimationFrame(loop)

      io = new IntersectionObserver((entries) => {
        const visible = entries[0]?.isIntersecting ?? true
        if (visible && !running) {
          running = true
          raf = requestAnimationFrame(loop)
        } else if (!visible && running) {
          running = false
          cancelAnimationFrame(raf)
        }
      })
      io.observe(root)
    }

    return () => {
      running = false
      cancelAnimationFrame(raf)
      io?.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('pointerleave', onPointerLeave)
      orbitEls.forEach(({ back, front, body }) => {
        back.remove()
        front.remove()
        body.remove()
      })
      dustEls.forEach(({ el }) => el.remove())
    }
  }, [])

  return (
    <div ref={rootRef} className="relative w-full">
      <div
        ref={backLayerRef}
        className="hero-scene__layer hero-scene__layer--back hidden lg:block"
        aria-hidden="true"
      >
        <div className="hero-orbit__glow" />
        {RAIN_COLUMNS.map((column, index) => (
          <div
            key={index}
            className="hero-orbit__rain"
            style={
              {
                left: column.left,
                top: column.top,
                height: column.height,
                '--rain-duration': column.duration,
                '--rain-opacity': column.opacity,
              } as React.CSSProperties
            }
          >
            <div className="hero-orbit__rain-track">
              <span>{RAIN_BITS[index]}</span>
              <span>{RAIN_BITS[index]}</span>
            </div>
          </div>
        ))}
        <svg className="hero-scene__svg hero-scene__svg--back" viewBox="-1900 -800 2500 1150" fill="none">
          <g ref={backPathsRef} />
          <g ref={backBodiesRef} />
        </svg>
      </div>

      <div ref={faceLayerRef} className="hero-scene__face relative z-10 w-full">
        <div className="hero-scene__atmosphere hidden lg:block" aria-hidden="true" />
        {children}
      </div>

      <div
        ref={frontLayerRef}
        className="hero-scene__layer hero-scene__layer--front hidden lg:block"
        aria-hidden="true"
      >
        <svg className="hero-scene__svg" viewBox="-1900 -800 2500 1150" fill="none">
          <g ref={frontPathsRef} />
          <g ref={frontBodiesRef} />
        </svg>
      </div>
    </div>
  )
}
