import Link from 'next/link'
import { Locale, Translation } from './translation'
import {
  ABN_DISPLAY,
  EMAIL_DISPLAY,
  EMAIL_LINK,
  GITHUB_LINK,
  PHONE_LINK,
  PHONE_NUMBER_DISPLAY,
} from './site'

const languageOptions: Array<{ code: Locale; shortLabel: string }> = [
  { code: 'en', shortLabel: 'EN' },
  { code: 'es', shortLabel: 'ES' },
]

export function SiteNav({
  t,
  locale,
  basePath,
}: {
  t: Translation
  locale: Locale
  basePath: string
}) {
  return (
    <div className="px-4 pt-6 sm:px-8">
      <nav
        className="sticky top-4 z-50 mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full border border-white/12 bg-[#0b0b0f]/90 px-5 py-3 text-sm text-white shadow-xl backdrop-blur-xl"
        aria-label="Primary navigation"
      >
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
            HJ
          </span>
          <span className="hidden text-sm font-medium text-white/70 sm:inline">Hunter Johnstone</span>
        </Link>
        <div className="flex items-center gap-4">
          <ul className="flex items-center gap-1">
            {t.navItems.map((item) => {
              const active = item.href === basePath
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`group relative rounded-full px-3 py-2 text-sm transition-colors ${
                      active ? 'text-white' : 'text-white/55 hover:text-white'
                    }`}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={
                        active
                          ? 'pointer-events-none absolute inset-x-3 bottom-1 h-px origin-center bg-white [animation:navUnderline_.5s_.05s_ease-out_both]'
                          : 'pointer-events-none absolute inset-x-3 bottom-1 h-px origin-center scale-x-0 bg-white/80 transition-transform duration-300 ease-out group-hover:scale-x-100'
                      }
                    />
                  </Link>
                </li>
              )
            })}
          </ul>
          <div className="flex items-center gap-1">
            {languageOptions.map((option) => (
              <Link
                key={option.code}
                href={`${basePath}?lang=${option.code}`}
                aria-label={`${t.localeSwitch.label}: ${option.shortLabel}`}
                aria-current={locale === option.code ? 'true' : undefined}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  locale === option.code
                    ? 'bg-white text-[#0b0b0f]'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
                prefetch={false}
              >
                {option.shortLabel}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0b0b0f] text-white/50">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
          <p>© {new Date().getFullYear()} Hunter Johnstone</p>
          <p className="text-white/35">ABN {ABN_DISPLAY}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <a href={EMAIL_LINK} className="transition hover:text-white">
            {EMAIL_DISPLAY}
          </a>
          <a href={PHONE_LINK} className="transition hover:text-white">
            {PHONE_NUMBER_DISPLAY}
          </a>
          <a
            href={GITHUB_LINK}
            className="transition hover:text-white"
            aria-label="Hunter Johnstone on GitHub"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
