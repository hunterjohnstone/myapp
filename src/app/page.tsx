import Script from 'next/script'
import BinaryPortrait from './BinaryPortrait'
import { SiteFooter, SiteNav } from './Chrome'
import HeroIntro from './HeroIntro'
import HeroOrbit from './HeroOrbit'
import { Locale, Translation, translations } from './translation'
import {
  EMAIL_DISPLAY,
  EMAIL_LINK,
  PHONE_LINK,
  PHONE_NUMBER_DISPLAY,
  WHATSAPP_LINK,
} from './site'

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Hunter Johnstone',
  jobTitle: 'Software Engineer & Product Consultant',
  url: 'https://hunterjohnstone.dev',
  sameAs: ['https://github.com/hunterjohnstone'],
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
  telephone: '+61-448-817-307',
  image: 'https://hunterjohnstone.dev/opengraph-image',
} as const

type HomeProps = {
  searchParams?: { lang?: string }
}

export default function Home({ searchParams }: HomeProps) {
  const searchLang = searchParams?.lang?.toLowerCase()
  const normalizedLang =
    searchLang === 'es' ? 'es' : searchLang === 'en' ? 'en' : undefined
  const locale: Locale = normalizedLang ?? 'en'
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

      {/* Home is a single view: nav, hero (centred), small footer. */}
      <div className="page-shell flex min-h-screen flex-col">
        <SiteNav t={t} locale={locale} basePath="/" />

        <main
          id="content"
          lang={locale}
          className="flex flex-1 flex-col justify-start px-6 py-10 sm:px-10 lg:justify-center lg:py-8"
        >
          <header id="top" className="mx-auto w-full max-w-6xl">
            <div className="flex flex-col items-center gap-8 sm:gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
              <HeroIntro
                emailDisplay={EMAIL_DISPLAY}
                emailLabel={t.ctas.email}
                emailLink={EMAIL_LINK}
                phoneDisplay={PHONE_NUMBER_DISPLAY}
                phoneLink={PHONE_LINK}
                subtitle={t.hero.subtitle}
                title={t.hero.title}
                whatsappLabel={t.ctas.whatsapp}
                whatsappLink={WHATSAPP_LINK}
              />

              <div className="relative order-1 w-64 shrink-0 self-center sm:w-72 lg:order-2 lg:w-[min(340px,46vh)]">
                <HeroOrbit>
                  <div className="binary-portrait w-full">
                    <BinaryPortrait src="/portrait.png" />
                  </div>
                </HeroOrbit>
              </div>
            </div>
          </header>
        </main>

        <SiteFooter />
      </div>
    </>
  )
}
