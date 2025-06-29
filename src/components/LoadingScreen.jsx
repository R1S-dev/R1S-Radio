import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen({ isDark }) {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 10
        if (next >= 100) {
          clearInterval(interval)
          setTimeout(() => setDone(true), 400) // delay za izlaznu animaciju
        }
        return next >= 100 ? 100 : next
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-colors duration-500 ${
            isDark ? 'bg-black text-white' : 'bg-white text-black'
          }`}
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* Logo sa pravilnim odnosom */}
          <motion.img
            src={isDark ? '/logo.png' : '/logo-light.png'}
            alt="Logo"
            className="mb-6 max-h-24 w-auto object-contain"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />

          {/* Progress bar */}
          <div className="w-56 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700 overflow-hidden">
            <motion.div
              className="h-full bg-blue-500 dark:bg-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'linear', duration: 0.1 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
