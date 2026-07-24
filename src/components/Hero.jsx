'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { images } from '../data/content'

export default function Hero() {
  const reduceMotion = useReducedMotion()

  return (
    <header id="top" className="relative flex min-h-[78vh] items-center overflow-hidden bg-white py-24 md:min-h-[86vh]">
      <motion.div
        className="absolute inset-0"
        initial={reduceMotion ? false : { scale: 1.04 }}
        animate={reduceMotion ? undefined : { scale: 1 }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={images.hero}
          alt="Pan-African Christian fellowship"
          className="editorial-image h-full w-full object-cover grayscale opacity-[0.11]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/20 to-white" />
      </motion.div>

      <div className="page-shell relative z-10 text-center">
        <motion.span
          className="eyebrow mb-10 block tracking-[0.38em] text-midnight-navy"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          The Gospel Network Africa
        </motion.span>
        <motion.h1
          className="mx-auto max-w-6xl font-display text-[clamp(3.3rem,8vw,7rem)] font-medium leading-[0.92] tracking-[-0.035em] text-midnight-navy"
          initial={reduceMotion ? false : { opacity: 0, y: 26 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          Ancient truth.
          <br />
          <em className="font-normal">African voices.</em>
        </motion.h1>
        <motion.p
          className="mx-auto mt-10 max-w-2xl text-lg font-light leading-8 text-charcoal-text/65 md:text-xl"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
        >
          Thoughtful, church-rooted resources helping Christians across Africa know the truth, live the gospel, and serve the local church.
        </motion.p>
        <motion.div
          className="mt-12 flex flex-col justify-center gap-4 sm:flex-row sm:gap-6"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <a href="#latest" className="editorial-button bg-midnight-navy text-white hover:opacity-80">
            Read latest
          </a>
          <a href="#resources" className="editorial-button border-midnight-navy/15 text-midnight-navy hover:bg-midnight-navy hover:text-parchment-ivory">
            Explore resources
          </a>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 opacity-35 md:flex">
        <span className="eyebrow text-[9px] tracking-[0.3em]">Scroll</span>
        <div className="h-10 w-px bg-midnight-navy" />
      </div>
    </header>
  )
}
