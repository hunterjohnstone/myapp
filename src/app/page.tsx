import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import { headers } from 'next/headers'
import { Locale, projectPreviews, Translation, translations } from './translation'

const EMAIL_LINK = 'mailto:hunterjohnst1@gmail.com'
const PHONE_NUMBER_DISPLAY = '+34 685 235 507'
const PHONE_LINK = 'tel:+34685235507'
const WHATSAPP_LINK = 'https://wa.me/+61448817307'

const languageOptions: Array<{ code: Locale; shortLabel: string }> = [
  { code: 'en', shortLabel: 'EN' },
  { code: 'es', shortLabel: 'ES' },
]

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Hunter Johnstone',
  jobTitle: 'Software Engineer & Product Consultant',
  url: 'https://hunterjohnstone.dev',
  sameAs: [
    'https://github.com/hunterjohnstone',
  ],
  worksFor: {
    '@type': 'Organization',
    name: 'Independent Consultant',
  },
  knowsAbout: [
    'Full-stack development',
    'SaaS products',
    'React',
    'Next.js',
    'TypeScript',
    'Product strategy',
    'Automations',
  ],
  email: EMAIL_LINK,
  telephone: '+34-685-235-507',
  image: 'https://hunterjohnstone.dev/opengraph-image',
} as const

type HomeProps = {
  searchParams?: { lang?: string }
}

export default function Home({ searchParams }: HomeProps) {
  const acceptLanguage = headers().get('accept-language') ?? ''
  const searchLang = searchParams?.lang?.toLowerCase()
  const normalizedLang =
    searchLang === 'es' ? 'es' : searchLang === 'en' ? 'en' : undefined
  const defaultLang: Locale = acceptLanguage.toLowerCase().startsWith('es') ? 'es' : 'en'
  const locale: Locale = normalizedLang ?? defaultLang
  const t: Translation = translations[locale]

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <a className="skip-link" href="#content">
        {t.a11y.skipToContent}
      </a>
      <div className="page-shell relative overflow-hidden px-4 pb-24 pt-6 sm:px-8 lg:px-12">
        <nav
          className="sticky top-4 z-50 mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full border border-white/12 bg-[#0b0b0f]/95 px-5 py-3 text-sm text-white shadow-xl backdrop-blur-xl"
          aria-label="Primary navigation"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
              HJ
            </span>
            <span className="hidden text-sm font-medium text-white/70 sm:inline">
              Hunter Johnstone
            </span>
          </div>
          <div className="flex flex-1 items-center justify-end gap-4">
            <ul className="hidden items-center gap-3 md:flex">
              {t.navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="rounded-full px-3 py-2 text-sm text-white/70 transition hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 text-xs text-white/60">
              <span className="hidden sm:inline">{t.localeSwitch.label}</span>
              <div className="flex items-center gap-1">
                {languageOptions.map((option) => (
                  <Link
                    key={option.code}
                    href={`/?lang=${option.code}`}
                    aria-label={`${t.localeSwitch.label}: ${option.shortLabel}`}
                    aria-current={locale === option.code ? 'true' : undefined}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
                      locale === option.code
                        ? 'bg-white text-[#0b0b0f]'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                    prefetch={false}
                  >
                    {option.shortLabel}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        <main id="content" lang={locale} className="mx-auto mt-12 flex max-w-6xl flex-col gap-20">
          <header className="surface flex flex-col gap-8 px-6 py-10 sm:px-10 sm:py-14">
            <div className="flex flex-col gap-6">
              <h1 className="section-heading text-4xl font-semibold leading-[1.08] tracking-tight text-neutral-900 sm:text-6xl sm:leading-tight">
                {t.hero.title}
              </h1>
              <p className="max-w-2xl text-base text-neutral-700 sm:text-lg">
                {t.hero.subtitle}
              </p>
              <p className="max-w-2xl text-sm text-neutral-600 sm:text-base">{t.hero.supporting}</p>
              <ul className="flex flex-wrap gap-3 text-sm text-neutral-700">
                {t.hero.chips.map((chip) => (
                  <li key={chip} className="pill bg-black/5 px-4 py-2">
                    {chip}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <a
                  href={EMAIL_LINK}
                  className="pill inline-flex items-center justify-center bg-[#0b0b0f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-black"
                  aria-label={t.ctas.email}
                >
                  {t.ctas.email}
                </a>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill pill--outline-animate pill--interactive flex w-full items-center justify-center bg-[#25d366] px-6 py-3 text-sm font-semibold text-[#062b18] transition hover:bg-[#22c15d] sm:w-auto"
                  aria-label={t.ctas.whatsapp}
                >
                  {t.ctas.whatsapp}
                </a>
              </div>
              {/* <p className="text-sm text-neutral-500">
                {t.hero.note}{' '}
                <a
                  href={PHONE_LINK}
                  className="underline decoration-transparent transition hover:decoration-current"
                  aria-label={`${t.ctas.phone} ${PHONE_NUMBER_DISPLAY}`}
                >
                  {PHONE_NUMBER_DISPLAY}
                </a>
              </p> */}
            </div>
            <dl className="grid gap-5 border-t border-black/10 pt-8 text-sm sm:grid-cols-3">
              {t.hero.highlights.map((highlight) => (
                <div key={highlight.label} className="flex flex-col gap-1">
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
                    {highlight.label}
                  </dt>
                  <dd className="text-base font-medium text-neutral-900">
                    {highlight.value}
                  </dd>
                </div>
              ))}
            </dl>
          </header>

          <section
            id="services"
            aria-labelledby="services-heading"
            className="section-grid"
          >
            <div className="surface p-8 sm:p-12">
              <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-col gap-2">
                  <span className="eyebrow text-neutral-500">{t.services.heading}</span>
                  <h2 id="services-heading" className="section-heading text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                    {t.services.subheading}
                  </h2>
                </div>
                <a
                  href={EMAIL_LINK}
                  className="pill inline-flex items-center justify-center bg-[#0b0b0f] px-4 py-2 text-xs font-semibold text-white transition hover:bg-black"
                  aria-label={t.ctas.email}
                >
                  {t.ctas.email}
                </a>
              </div>
              <div className="grid gap-5 sm:grid-cols-3">
                {t.services.items.map((service) => (
                  <article
                    key={service.title}
                    className="glass-panel flex h-full flex-col gap-4 border border-black/5 px-5 py-6 text-neutral-800 transition hover:-translate-y-1 hover:border-black/10 hover:text-neutral-900"
                  >
                    <h3 className="text-xl font-semibold text-neutral-900">{service.title}</h3>
                    <p className="text-sm text-neutral-600">{service.outcome}</p>
                    <ul className="mt-auto flex flex-col gap-2 text-sm text-neutral-600">
                      {service.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-neutral-400" aria-hidden="true" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section
            id="projects"
            aria-labelledby="projects-heading"
            className="section-grid"
          >
            <div className="surface p-8 sm:p-12">
              <div className="mb-8 flex flex-col gap-2">
                <span className="eyebrow text-neutral-500">{t.projects.heading}</span>
                <h2 id="projects-heading" className="section-heading text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                  {t.projects.subheading}
                </h2>
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                {projectPreviews.map((project) => (
                  <a className='cursor-pointer' key={project.url} href={project.url} target="_blank" rel="noopener noreferrer">
                    <article
                      // key={project.url}
                      className="group flex flex-col overflow-hidden rounded-3xl border border-black/5 bg-white/85 text-neutral-800 shadow-xl transition hover:-translate-y-1 hover:border-black/10"
                    >
                      <div className="relative overflow-hidden rounded-2xl border border-black/5 bg-neutral-900/5">
                        <Image
                          src={project.preview}
                          alt={`${project.name[locale]} preview`}
                          width={1280}
                          height={720}
                          sizes="(min-width: 1024px) 50vw, 100vw"
                          className="aspect-[16/9] h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          priority={project.url === 'https://www.vcgs.org.au/'}
                        />
                        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                        </div>
                        <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/10 to-transparent p-5 opacity-0 transition duration-300 group-hover:opacity-100">
                          <p className="text-sm text-white">{project.description[locale]}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 px-6 py-5">
                        <div className="flex flex-col gap-2">
                          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
                            {project.type[locale]}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                        </div>
                      </div>
                    </article>
                  </a>
                ))}
              </div>
            </div>
          </section>

          <section
            id="approach"
            aria-labelledby="approach-heading"
            className="section-grid"
          >
            <div className="surface surface--dark text-white">
              <div className="flex flex-col gap-10 px-8 py-12 sm:px-12 sm:py-14">
                <div className="flex flex-col gap-3">
                  <span className="eyebrow text-white/60">{t.approach.heading}</span>
                  <h2 id="approach-heading" className="section-heading text-3xl font-semibold sm:text-4xl">
                    {t.approach.intro}
                  </h2>
                </div>
                <div className="grid gap-6 sm:grid-cols-3">
                  {t.approach.steps.map((step) => (
                    <article key={step.label} className="flex flex-col gap-3 rounded-2xl bg-white/5 p-6">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                        {step.label}
                      </h3>
                      <p className="text-base text-white/80">{step.detail}</p>
                    </article>
                  ))}
                </div>
                <p className="text-sm text-white/70 sm:text-base">{t.engagement}</p>
              </div>
            </div>
          </section>

          <section
            id="contact"
            aria-labelledby="contact-heading"
            className="section-grid"
          >
            <div className="surface surface--dark text-white">
              <div className="flex flex-col gap-6 px-8 py-12 sm:px-12 sm:py-14">
                <div className="flex flex-col gap-3">
                  <span className="eyebrow text-white/60">{t.contact.subheading}</span>
                  <h2 id="contact-heading" className="section-heading text-3xl font-semibold sm:text-4xl">
                    {t.contact.heading}
                  </h2>
                  <p className="max-w-xl text-sm text-white/70 sm:text-base">{t.contact.description}</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                  <a
                    href={EMAIL_LINK}
                    className="pill flex w-full items-center justify-center bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20 sm:w-auto"
                    aria-label={t.ctas.email}
                  >
                    {t.ctas.email}
                  </a>
                  <a
                    href={PHONE_LINK}
                    className="pill flex w-full items-center justify-center bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20 sm:w-auto"
                    aria-label={`${t.ctas.phone} ${PHONE_NUMBER_DISPLAY}`}
                  >
                    {t.ctas.phone} · {PHONE_NUMBER_DISPLAY}
                  </a>
                  <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pill flex w-full items-center justify-center bg-[#25d366] px-6 py-3 text-sm font-semibold text-[#062b18] transition hover:bg-[#22c15d] sm:w-auto"
                    aria-label={t.ctas.whatsapp}
                  >
                    {t.ctas.whatsapp}
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="mx-auto mt-16 flex max-w-6xl flex-col gap-4 border-t border-black/10 pt-8 text-sm text-neutral-600 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Hunter Johnstone. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href={EMAIL_LINK} className="transition hover:text-neutral-900" aria-label="Email Hunter Johnstone">
              Email
            </a>
            <a
              href={WHATSAPP_LINK}
              className="transition hover:text-neutral-900"
              aria-label="WhatsApp Hunter Johnstone"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
            <a
              href="https://github.com/hunterjohnstone"
              className="transition hover:text-neutral-900"
              aria-label="Hunter Johnstone on GitHub"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </footer>
      </div>
    </>
  )
}
