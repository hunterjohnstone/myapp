'use client'

import { useEffect, useRef } from 'react'

type Props = {
  /** Source image sampled for luminance. Falls back to a procedural face if it fails to load. */
  src?: string
  className?: string
  /** Approx CSS pixels per character cell. Smaller = denser / more detail. */
  cell?: number
  /** Glyph colour. */
  color?: string
  /** Source crop (fractions of the original image) used to focus on the face. */
  crop?: { x: number; y: number; w: number; h: number }
}

type Sample = { lum: Float32Array; w: number; h: number }

/**
 * Renders a portrait as a living field of 0s and 1s on a <canvas>.
 * The subject is drawn with lit digits; the background stays as negative space.
 * A slow vertical light sweep gives the "black and white transient" feel.
 */
export default function BinaryPortrait({
  src = '/portrait.png',
  className,
  cell = 5.4,
  color = '#f5f5f7',
  crop = { x: 0, y: 0, w: 1, h: 1 },
}: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!wrapRef.current || !canvasRef.current) return
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    if (!context) return
    // Non-null declared types so the narrowing survives inside the animation closures.
    const ctx: CanvasRenderingContext2D = context

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    let running = true
    let sample: Sample | null = null

    // Grid state
    let cols = 0
    let rows = 0
    let cssW = 0
    let cssH = 0
    let lum: Float32Array | null = null
    let bits: Uint8Array | null = null

    function gauss(v: number, mu: number, s: number) {
      const d = (v - mu) / s
      return Math.exp(-0.5 * d * d)
    }

    function smooth(e0: number, e1: number, x: number) {
      const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)))
      return t * t * (3 - 2 * t)
    }

    // Luminance from the real photo (cropped to the face).
    function sampleImage(img: HTMLImageElement): Sample {
      const w = 176
      const sx = img.width * crop.x
      const sy = img.height * crop.y
      const sw = img.width * crop.w
      const sh = img.height * crop.h
      const h = Math.max(1, Math.round((sh / sw) * w))
      const off = document.createElement('canvas')
      off.width = w
      off.height = h
      const octx = off.getContext('2d')
      if (!octx) return proceduralFace()
      octx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h)
      const data = octx.getImageData(0, 0, w, h).data
      const out = new Float32Array(w * h)
      for (let i = 0; i < w * h; i++) {
        const r = data[i * 4]
        const g = data[i * 4 + 1]
        const b = data[i * 4 + 2]
        out[i] = (0.299 * r + 0.587 * g + 0.114 * b) / 255
      }
      return { lum: out, w, h }
    }

    // A face-ish luminance field so the hero reads before the real photo is added.
    function proceduralFace(): Sample {
      const w = 168
      const h = 208
      const out = new Float32Array(w * h)
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const nx = (x / w) * 2 - 1
          const ny = (y / h) * 2 - 1
          // Head oval with a jaw taper toward the chin.
          const jaw = 1 - 0.28 * smooth(0.1, 0.95, ny)
          const dHead = Math.hypot(nx / (0.62 * jaw), (ny + 0.02) / 0.9)
          let l = smooth(1.04, 0.62, dHead) * 0.9
          l *= 1 - 0.18 * smooth(-0.1, 0.9, ny)
          l += 0.06 * gauss(ny, -0.45, 0.28) * smooth(0.7, 0.2, Math.abs(nx))
          // cheeks
          l += 0.05 * gauss(nx, -0.34, 0.14) * gauss(ny, 0.14, 0.18)
          l += 0.05 * gauss(nx, 0.34, 0.14) * gauss(ny, 0.14, 0.18)
          // brows
          l -= 0.42 * gauss(nx, -0.25, 0.15) * gauss(ny, -0.2, 0.035)
          l -= 0.42 * gauss(nx, 0.25, 0.15) * gauss(ny, -0.2, 0.035)
          // eyes
          l -= 0.6 * gauss(nx, -0.26, 0.1) * gauss(ny, -0.07, 0.06)
          l -= 0.6 * gauss(nx, 0.26, 0.1) * gauss(ny, -0.07, 0.06)
          // nose ridge + nostrils
          l += 0.07 * gauss(nx, 0, 0.045) * smooth(-0.05, 0.2, ny) * smooth(0.34, 0.2, ny)
          l -= 0.3 * gauss(nx, -0.08, 0.05) * gauss(ny, 0.25, 0.04)
          l -= 0.3 * gauss(nx, 0.08, 0.05) * gauss(ny, 0.25, 0.04)
          // mouth
          l -= 0.5 * gauss(nx, 0, 0.2) * gauss(ny, 0.44, 0.045)
          out[y * w + x] = Math.max(0, Math.min(1, l))
        }
      }
      return { lum: out, w, h }
    }

    function measure() {
      const r = wrap.getBoundingClientRect()
      cssW = Math.max(1, r.width)
      cssH = Math.max(1, r.height)
    }

    function setupCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(cssW * dpr)
      canvas.height = Math.round(cssH * dpr)
      canvas.style.width = `${cssW}px`
      canvas.style.height = `${cssH}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function buildGrid() {
      if (!sample) return
      const { lum: src2, w, h } = sample
      cols = Math.max(20, Math.floor(cssW / cell))
      rows = Math.max(20, Math.floor(cssH / cell))
      lum = new Float32Array(cols * rows)
      bits = new Uint8Array(cols * rows)
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const sx = Math.min(w - 1, Math.floor((x / cols) * w))
          const sy = Math.min(h - 1, Math.floor((y / rows) * h))
          let l = src2[sy * w + sx]
          // Centre vignette to matte out the window / couch behind the subject.
          // Tuned for public/portrait.png (a tight, centred face crop) via
          // scratchpad/render.mjs — re-run that if the photo is swapped.
          const vx = (x / (cols - 1)) * 2 - 1
          const vy = (y / (rows - 1)) * 2 - 1
          const d = Math.sqrt(vx * vx * 1.08 + vy * vy)
          const vig = Math.max(0, 1 - Math.pow(d, 2.1))
          l = l * (0.15 + 0.85 * vig)
          // Fade the very top so stray window bits above the hair drop to black.
          l = l * Math.min(1, Math.max(0, (vy + 0.78) / 0.23))
          // gamma + levels: lift the face off the background
          l = Math.pow(l, 0.82)
          l = Math.min(1, Math.max(0, (l - 0.21) / 0.75))
          lum[y * cols + x] = l
          bits[y * cols + x] = Math.random() > 0.5 ? 1 : 0
        }
      }
    }

    const t0 = performance.now()

    function draw(now: number) {
      if (!running || !lum || !bits) {
        raf = requestAnimationFrame(draw)
        return
      }
      const t = (now - t0) / 1000
      ctx.clearRect(0, 0, cssW, cssH)
      const cw = cssW / cols
      const ch = cssH / rows
      const fontPx = Math.min(cw, ch) * 1.32
      ctx.font = `600 ${fontPx}px "Inter", ui-monospace, SFMono-Regular, monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = color

      // soft light band travelling down the portrait = the transient
      const sweepY = ((t * 0.13) % 1.5) - 0.25

      for (let y = 0; y < rows; y++) {
        const ry = y / rows
        const sweep = Math.max(0, 1 - Math.abs(ry - sweepY) * 5.5)
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x
          const l = lum[i]
          if (l < 0.1) continue // negative space
          if (!reduced) {
            const flip = 0.006 + sweep * 0.05
            if (Math.random() < flip) bits[i] ^= 1
          }
          const lq = Math.ceil(l * 5) / 5 // posterised opacity
          let alpha = 0.12 + lq * 0.88
          alpha = Math.min(1, alpha + sweep * 0.55 * lq)
          ctx.globalAlpha = alpha
          ctx.fillText(bits[i] ? '1' : '0', x * cw + cw / 2, y * ch + ch / 2)
        }
      }
      ctx.globalAlpha = 1
      if (reduced) return
      raf = requestAnimationFrame(draw)
    }

    function begin(s: Sample) {
      sample = s
      wrap.style.aspectRatio = `${s.w} / ${s.h}`
      // aspect-ratio changes size on next frame; measure after layout settles
      requestAnimationFrame(() => {
        measure()
        setupCanvas()
        buildGrid()
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(draw)
      })
    }

    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => begin(sampleImage(img))
    img.onerror = () => begin(proceduralFace())
    img.src = src

    const ro = new ResizeObserver(() => {
      if (!sample) return
      measure()
      setupCanvas()
      buildGrid()
    })
    ro.observe(wrap)

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? true
        if (visible && !running) {
          running = true
          raf = requestAnimationFrame(draw)
        } else if (!visible && running) {
          running = false
          cancelAnimationFrame(raf)
        }
      },
      { threshold: 0 },
    )
    io.observe(wrap)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      img.onload = null
      img.onerror = null
    }
  }, [src, cell, color, crop])

  return (
    <div ref={wrapRef} className={className} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}
