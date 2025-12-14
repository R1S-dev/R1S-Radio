import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, BadgeInfo, Sparkles } from 'lucide-react'

export default function UpdateModal({ isOpen, onClose, version }) {
  const [isDark, setIsDark] = useState(false)
  const overlayRef = useRef(null)

  useEffect(() => {
    const rootIsDark = document.documentElement.classList.contains('dark')
    setIsDark(rootIsDark)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (overlayRef.current && e.target === overlayRef.current) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-zinc-900 rounded-3xl max-w-md w-full p-6 shadow-xl text-center relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex items-center justify-center gap-2 mb-3"
            >
              <Sparkles className="text-blue-600 dark:text-red-500 animate-pulse" size={22} />
              <span className="text-blue-600 dark:text-red-500 text-sm font-semibold uppercase tracking-wide">
                Nova verzija
              </span>
              <Sparkles className="text-blue-600 dark:text-red-500 animate-pulse" size={22} />
            </motion.div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition"
              aria-label="Zatvori"
            >
              <X size={20} />
            </button>

            <img
              src={isDark ? '/logo.png' : '/logo-light.png'}
              alt="Logo"
              className="h-20 w-20 mx-auto mb-4 object-contain"
            />

            <h2 className="text-xl font-bold mb-3 text-zinc-800 dark:text-white">
              Šta je novo u aplikaciji?
            </h2>

            <div className="text-sm text-zinc-600 dark:text-zinc-300 mb-6 leading-relaxed text-left">
              <ul className="list-disc list-inside space-y-1">
                <li>Dodate 2 nove radio stanice:</li>
                <ul className="list-disc list-inside pl-5 space-y-1">
                  <li>Naxi Mix</li>
                  <li>Kolubara</li>
                </ul>
              </ul>
            </div>

            <button
              onClick={onClose}
              className="mt-2 px-6 py-2.5 rounded-full bg-blue-600 dark:bg-red-500 text-white font-semibold hover:brightness-110 transition"
            >
              OK
            </button>

            <div className="mt-6 flex items-center justify-between w-full text-xs text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1">
                <BadgeInfo size={14} /> Verzija {version}
              </span>
              <span className="italic">Boris Janković</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
