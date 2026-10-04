'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Marca como visibles los elementos con data-reveal cuando entran en pantalla
const Reveal = () => {
  const pathname = usePathname()

  useEffect(() => {
    const elements = document.querySelectorAll('[data-reveal]:not(.is-visible)')
    if (!('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    )

    elements.forEach((el) => observer.observe(el))
    document.documentElement.classList.add('reveal-ready')

    return () => observer.disconnect()
  }, [pathname])

  return null
}

export default Reveal
