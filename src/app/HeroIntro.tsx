'use client'

import { useEffect, useState } from 'react'

type Frame = {
  delay: number
  text: string
}

type Props = {
  emailDisplay: string
  emailLabel: string
  emailLink: string
  phoneDisplay: string
  phoneLink: string
  subtitle: string
  title: string
  whatsappLabel: string
  whatsappLink: string
}

type ButtonPhase = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

const introDelayMs = 1200
const typoTitle = 'Web applications,\ninternal tools,\nautomation.'

// Module-level so it survives client-side navigation (Home <-> Projects) and
// language switches. The intro plays once per full page load, not on every mount.
let heroIntroPlayed = false

function typingDelay(character: string, index: number) {
  const cadence = [72, 91, 64, 83, 105, 69, 88, 76]
  const baseDelay = cadence[index % cadence.length]

  if (character === ' ') return baseDelay + 20
  if (character === ',') return baseDelay + 150
  if (character === '.') return baseDelay + 110

  return baseDelay
}

function typeText(frames: Frame[], current: string, addition: string) {
  let text = current

  Array.from(addition).forEach((character, index) => {
    text += character
    frames.push({
      delay: typingDelay(character, index),
      text,
    })
  })

  return text
}

function buildPlainFrames(text: string) {
  const frames: Frame[] = []
  typeText(frames, '', text)
  return frames
}

function buildTitleFrames(title: string) {
  const frames: Frame[] = []

  if (title !== typoTitle) {
    typeText(frames, '', title)
    return frames
  }

  let text = typeText(frames, '', 'Web applications,\ninternal toolw,\nau')

  // The mistake is allowed to continue for a few characters before it is
  // noticed. Backspaces are intentionally quicker and more evenly spaced.
  const backspaceCadence = [50, 46, 53, 48, 51]
  Array.from('w,\nau').forEach((_, index) => {
    text = text.slice(0, -1)
    frames.push({
      delay: index === 0 ? 520 : backspaceCadence[index],
      text,
    })
  })

  frames.push({ delay: 170, text })
  typeText(frames, text, 's,\nautomation.')

  return frames
}

function Caret({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className={`ml-[0.12em] inline-block h-[0.82em] w-px animate-[pulse_0.9s_steps(1,end)_infinite] align-[-0.04em] ${
        dark ? 'bg-[#0b0b0f]' : 'bg-white'
      }`}
      aria-hidden="true"
    />
  )
}

export default function HeroIntro({
  emailDisplay,
  emailLabel,
  emailLink,
  phoneDisplay,
  phoneLink,
  subtitle,
  title,
  whatsappLabel,
  whatsappLink,
}: Props) {
  // When the intro has already played this session, mount straight into the
  // finished state — no flash, no re-typing.
  const [displayedTitle, setDisplayedTitle] = useState(() => (heroIntroPlayed ? title : ''))
  const [displayedSubtitle, setDisplayedSubtitle] = useState(() =>
    heroIntroPlayed ? subtitle : '',
  )
  const [displayedEmailLabel, setDisplayedEmailLabel] = useState(() =>
    heroIntroPlayed ? emailLabel : '',
  )
  const [displayedWhatsappLabel, setDisplayedWhatsappLabel] = useState(() =>
    heroIntroPlayed ? whatsappLabel : '',
  )
  const [displayedContact, setDisplayedContact] = useState(() =>
    heroIntroPlayed ? `${emailDisplay} · ${phoneDisplay}` : '',
  )
  const [emailButtonPhase, setEmailButtonPhase] = useState<ButtonPhase>(() =>
    heroIntroPlayed ? 5 : 0,
  )
  const [whatsappButtonPhase, setWhatsappButtonPhase] = useState<ButtonPhase>(() =>
    heroIntroPlayed ? 8 : 0,
  )
  const [emailReady, setEmailReady] = useState(() => heroIntroPlayed)
  const [whatsappReady, setWhatsappReady] = useState(() => heroIntroPlayed)
  const [contactComplete, setContactComplete] = useState(() => heroIntroPlayed)
  const [activeCaret, setActiveCaret] = useState<
    'title' | 'subtitle' | 'email' | 'whatsapp' | 'contact' | null
  >(null)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const contactText = `${emailDisplay} · ${phoneDisplay}`

    setDisplayedTitle('')
    setDisplayedSubtitle('')
    setDisplayedEmailLabel('')
    setDisplayedWhatsappLabel('')
    setDisplayedContact('')
    setEmailButtonPhase(0)
    setWhatsappButtonPhase(0)
    setEmailReady(false)
    setWhatsappReady(false)
    setContactComplete(false)
    setActiveCaret(null)

    if (reducedMotion || heroIntroPlayed) {
      setDisplayedTitle(title)
      setDisplayedSubtitle(subtitle)
      setDisplayedEmailLabel(emailLabel)
      setDisplayedWhatsappLabel(whatsappLabel)
      setDisplayedContact(contactText)
      setEmailButtonPhase(5)
      setWhatsappButtonPhase(8)
      setEmailReady(true)
      setWhatsappReady(true)
      setContactComplete(true)
      return
    }

    const timers: number[] = []
    let elapsed = introDelayMs

    const schedule = (callback: () => void) => {
      timers.push(window.setTimeout(callback, elapsed))
    }

    const pause = (duration: number) => {
      elapsed += duration
    }

    const scheduleFrames = (
      frames: Frame[],
      setter: (text: string) => void,
      speed = 1,
    ) => {
      frames.forEach((frame) => {
        elapsed += Math.round(frame.delay * speed)
        schedule(() => setter(frame.text))
      })
    }

    setActiveCaret(null)
    schedule(() => setActiveCaret('title'))
    scheduleFrames(buildTitleFrames(title), setDisplayedTitle)
    pause(260)
    schedule(() => setActiveCaret(null))

    pause(320)
    schedule(() => setActiveCaret('subtitle'))
    scheduleFrames(buildPlainFrames(subtitle), setDisplayedSubtitle, 0.68)
    pause(300)
    schedule(() => setActiveCaret(null))

    // Each CTA is built independently. The uneven pauses make the changes
    // feel like small design decisions rather than a looping preset.
    pause(380)
    schedule(() => setEmailButtonPhase(1))
    pause(680)
    schedule(() => setEmailButtonPhase(2))
    pause(540)
    schedule(() => setEmailButtonPhase(3))
    pause(760)
    schedule(() => setEmailButtonPhase(4))
    pause(650)
    schedule(() => setEmailButtonPhase(5))
    pause(420)
    schedule(() => setActiveCaret('email'))
    scheduleFrames(buildPlainFrames(emailLabel), setDisplayedEmailLabel, 0.88)
    pause(300)
    schedule(() => {
      setActiveCaret(null)
      setEmailReady(true)
    })

    pause(480)
    schedule(() => setWhatsappButtonPhase(1))
    pause(610)
    schedule(() => setWhatsappButtonPhase(2))
    pause(720)
    schedule(() => setWhatsappButtonPhase(3))
    pause(560)
    schedule(() => setWhatsappButtonPhase(4))
    pause(620)
    schedule(() => setWhatsappButtonPhase(5))
    pause(540)
    schedule(() => setWhatsappButtonPhase(6))
    pause(650)
    schedule(() => setWhatsappButtonPhase(7))
    pause(560)
    schedule(() => setWhatsappButtonPhase(8))
    // The option changes above snap. This final pause lets the selected bright
    // green ease into the more restrained green used by the finished design.
    pause(940)
    schedule(() => setActiveCaret('whatsapp'))
    scheduleFrames(buildPlainFrames(whatsappLabel), setDisplayedWhatsappLabel, 0.78)
    pause(320)
    schedule(() => {
      setActiveCaret(null)
      setWhatsappReady(true)
    })

    pause(520)
    schedule(() => setActiveCaret('contact'))
    scheduleFrames(buildPlainFrames(contactText), setDisplayedContact, 0.56)
    pause(280)
    schedule(() => {
      setActiveCaret(null)
      setContactComplete(true)
    })

    // Only mark the intro as played once it has actually finished, so a
    // Strict Mode double-mount (dev) doesn't skip it.
    schedule(() => {
      heroIntroPlayed = true
    })

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [emailDisplay, emailLabel, phoneDisplay, subtitle, title, whatsappLabel])

  const commonButtonClass =
    'relative inline-flex items-center justify-center border px-6 py-3 text-sm font-semibold transition-[border-radius,opacity,transform] duration-700 ease-out'

  const shapeClass = (phase: ButtonPhase) => {
    if (phase >= 4) return 'rounded-full'
    if (phase === 3) return 'rounded-lg'
    return 'rounded-none'
  }

  const entranceClass = (phase: ButtonPhase) =>
    phase === 0
      ? 'pointer-events-none translate-y-1 opacity-0'
      : 'translate-y-0 opacity-100'

  const emailTreatmentClass = (() => {
    if (emailButtonPhase >= 5) {
      // Settles from the solid-white flash into the finished treatment:
      // transparent centre, thin white border, white text.
      return 'border-white bg-transparent text-white transition-[background-color,border-color,color] duration-700 ease-out hover:bg-white/10'
    }
    if (emailButtonPhase === 4) return 'border-white bg-white text-[#0b0b0f]'
    if (emailButtonPhase === 3) return 'border-white/30 bg-white/10 text-white'
    if (emailButtonPhase === 2) return 'border-white/55 bg-white/[0.04] text-white'
    return 'border-white/25 bg-transparent text-white'
  })()

  const whatsappTreatmentClass = (() => {
    if (whatsappButtonPhase >= 8) {
      return 'border-[#0e7a4d] bg-[#0e7a4d] text-white transition-[background-color,border-color,color] duration-700 ease-out hover:border-[#12915b] hover:bg-[#12915b]'
    }
    if (whatsappButtonPhase === 7) return 'border-[#22c55e] bg-[#22c55e] text-white'
    if (whatsappButtonPhase === 6) return 'border-[#7f1d1d] bg-[#7f1d1d] text-white'
    if (whatsappButtonPhase === 5) return 'border-[#2563eb] bg-[#2563eb] text-white'
    if (whatsappButtonPhase === 4) return 'border-white/70 bg-transparent text-white'
    if (whatsappButtonPhase === 3) return 'border-white/30 bg-white/10 text-white'
    if (whatsappButtonPhase === 2) return 'border-white/55 bg-white/[0.04] text-white'
    return 'border-white/25 bg-transparent text-white'
  })()

  return (
    <div className="order-2 flex w-full flex-col items-center gap-6 text-center lg:order-1 lg:flex-1 lg:items-start lg:text-left">
      <h1
        className="section-heading whitespace-pre-line text-4xl font-semibold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-[clamp(3rem,4.5vw,4.25rem)]"
        aria-label={title}
      >
        <span className="relative block">
          <span className="invisible" aria-hidden="true">
            {title}
          </span>
          <span className="absolute inset-0" aria-hidden="true">
            {displayedTitle}
            {activeCaret === 'title' ? <Caret /> : null}
          </span>
        </span>
      </h1>

      <p
        className="max-w-xl text-pretty text-lg leading-relaxed text-white/70 sm:text-xl"
        aria-label={subtitle}
      >
        <span className="relative block">
          <span className="invisible" aria-hidden="true">
            {subtitle}
          </span>
          <span className="absolute inset-0" aria-hidden="true">
            {displayedSubtitle}
            {activeCaret === 'subtitle' ? <Caret /> : null}
          </span>
        </span>
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center" aria-label="Contact options">
        <a
          href={emailLink}
          className={`${commonButtonClass} ${shapeClass(emailButtonPhase)} ${entranceClass(emailButtonPhase)} ${emailReady ? '' : 'pointer-events-none'} ${emailTreatmentClass}`}
          aria-label={emailLabel}
          aria-hidden={!emailReady}
          tabIndex={emailReady ? undefined : -1}
        >
          <span className="relative block whitespace-nowrap">
            <span className="invisible" aria-hidden="true">
              {emailLabel}
            </span>
            <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
              {displayedEmailLabel}
              {activeCaret === 'email' ? <Caret /> : null}
            </span>
          </span>
        </a>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`${commonButtonClass} ${shapeClass(whatsappButtonPhase)} ${entranceClass(whatsappButtonPhase)} ${whatsappReady ? '' : 'pointer-events-none'} ${whatsappTreatmentClass}`}
          aria-label={whatsappLabel}
          aria-hidden={!whatsappReady}
          tabIndex={whatsappReady ? undefined : -1}
        >
          <span className="relative block whitespace-nowrap">
            <span className="invisible" aria-hidden="true">
              {whatsappLabel}
            </span>
            <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
              {displayedWhatsappLabel}
              {activeCaret === 'whatsapp' ? <Caret /> : null}
            </span>
          </span>
        </a>
      </div>
    </div>
  )
}
