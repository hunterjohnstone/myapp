import type { Metadata } from 'next'
import { SiteFooter, SiteNav } from '../Chrome'
import { Locale, Translation, translations } from '../translation'
import { ProjectGallery } from './ProjectGallery'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Recently shipped web platforms, apps, and automations by Hunter Johnstone.',
}

type Props = {
  searchParams?: { lang?: string }
}

export default function ProjectsPage({ searchParams }: Props) {
  const searchLang = searchParams?.lang?.toLowerCase()
  const normalizedLang =
    searchLang === 'es' ? 'es' : searchLang === 'en' ? 'en' : undefined
  const locale: Locale = normalizedLang ?? 'en'
  const t: Translation = translations[locale]

  return (
    <div className="page-shell flex min-h-screen flex-col bg-[#0b0b0f] text-white">
      <a className="skip-link" href="#content">
        {t.a11y.skipToContent}
      </a>
      <SiteNav t={t} locale={locale} basePath="/projects" />

      <main id="content" lang={locale} className="flex-1">
        <section
          aria-labelledby="projects-heading"
          className="mx-auto max-w-6xl px-6 pb-12 pt-16 sm:px-10 sm:pb-16 sm:pt-20"
        >
          <div className="w-full border-t border-white/15 pt-6">
            <h1
              id="projects-heading"
              className="section-heading text-[clamp(4rem,8vw,7rem)] font-semibold leading-[0.82] tracking-[-0.065em] text-white"
            >
              {t.projects.heading}.
            </h1>
          </div>
        </section>

        <section aria-label="Project gallery" className="mx-auto max-w-6xl px-6 pb-32 sm:px-10 sm:pb-44">
          <ProjectGallery projects={t.projects.items} />
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
