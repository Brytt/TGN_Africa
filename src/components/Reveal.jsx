'use client'

import { useEffect, useRef, useState } from 'react'

export default function Reveal({ children, className = '', delay = 0, as = 'div' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const Component = as

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return undefined
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, { rootMargin: '80px 0px', threshold: 0.08 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <Component
      ref={ref}
      className={`reveal-section ${visible ? 'is-visible' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}s` }}
    >
      {children}
    </Component>
  )
}
