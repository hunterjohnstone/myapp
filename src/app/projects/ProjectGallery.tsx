'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'

type Project = {
  description: string
  name: string
  preview: string
  type: string
  url: string
}

export function ProjectGallery({ projects }: { projects: readonly Project[] }) {
  const galleryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const gallery = galleryRef.current

    if (!gallery) return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const images = Array.from(
      gallery.querySelectorAll<HTMLElement>('[data-project-image]'),
    )
    const cleanupTimers: number[] = []

    const revealImmediately = () => {
      images.forEach((image) => image.classList.add('project-colour-reveal--visible'))
    }

    if (mediaQuery.matches || typeof IntersectionObserver === 'undefined') {
      revealImmediately()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          const image = entry.target.querySelector<HTMLElement>('[data-project-image]')

          if (image) {
            image.style.willChange = 'filter'
            image.classList.add('project-colour-reveal--visible')
            cleanupTimers.push(
              window.setTimeout(() => {
                image.style.willChange = 'auto'
              }, 3800),
            )
          }

          observer.unobserve(entry.target)
        })
      },
      {
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.12,
      },
    )

    gallery
      .querySelectorAll<HTMLElement>('[data-project-reveal]')
      .forEach((card) => observer.observe(card))

    return () => {
      observer.disconnect()
      cleanupTimers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  return (
    <div
      ref={galleryRef}
      className="grid gap-y-20 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-24 lg:gap-x-16 lg:gap-y-32"
    >
      {projects.map((project, index) => (
        <article
          key={project.url}
          data-project-reveal
        >
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block focus-visible:outline-white"
          >
            <div className="relative overflow-hidden border border-white/12 bg-white/[0.025] transition-colors duration-500 group-hover:border-white/35">
              <Image
                src={project.preview}
                alt={`${project.name} preview`}
                width={1280}
                height={720}
                sizes="(min-width: 1024px) 520px, (min-width: 640px) 46vw, 100vw"
                className="project-colour-reveal aspect-[16/10] w-full object-cover group-hover:scale-[1.015]"
                data-project-image
                priority={index === 0}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.04]"
              />
            </div>

            <div className="mt-5 border-t border-white/12 pt-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 transition-colors duration-300 group-hover:text-white/65">
                {project.type}
              </p>
              <h2 className="mt-5 max-w-[28rem] text-[clamp(1.6rem,3vw,2.65rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-white">
                {project.name}
              </h2>
              <p className="mt-4 max-w-[34rem] text-[15px] leading-[1.65] text-white/52 transition-colors duration-300 group-hover:text-white/72">
                {project.description}
              </p>
            </div>
          </a>
        </article>
      ))}
    </div>
  )
}
