// === File: src/components/SettingsModal.jsx ===
import React, { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Settings2,
  Sun,
  Moon,
  Volume2,
  Info,
  Palette
} from 'lucide-react'

export default function SettingsModal({ isOpen, onClose, isDark, toggleTheme, version }) {
  const overlayRef = useRef(null)
  const [stats, setStats] = useState({})

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

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('listeningStats')
      if (stored) setStats(JSON.parse(stored))
    }
  }, [isOpen])

  const totalSeconds = Object.entries(stats)
    .filter(([k]) => k !== 'lastPlayed')
    .reduce((acc, [, sec]) => acc + sec, 0)

  const top5 = Object.entries(stats)
    .filter(([k]) => k !== 'lastPlayed')
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md p-5 shadow-2xl border border-zinc-200 dark:border-zinc-700"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-500 hover:text-red-500 transition"
              aria-label="Zatvori"
            >
              <X size={22} />
            </button>

            <div className="flex items-center gap-2 mb-5">
              <Settings2 className="text-blue-500 dark:text-red-500" size={22} />
              <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Podešavanja</h2>
            </div>

            <div className="space-y-6">
              {/* Tema */}
              <div className="space-y-2">
                <h3 className="flex items-center gap-2 font-semibold text-zinc-700 dark:text-zinc-100 text-sm">
                  <Palette size={18} /> Tema aplikacije
                </h3>
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 font-medium transition hover:bg-zinc-200 dark:hover:bg-zinc-700"
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />} Promeni u {isDark ? 'svetlu' : 'tamnu'} temu
                </button>
              </div>

              {/* Statistika slušanja */}
              {top5.length > 0 && (
                <div className="space-y-2">
                  <h3 className="flex items-center gap-2 font-semibold text-zinc-700 dark:text-zinc-100 text-sm">
                    <Volume2 size={18} /> Statistika
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                    Ukupno vreme: <strong>{Math.floor(totalSeconds / 60)} min</strong>
                  </p>
                  <ul className="list-disc text-zinc-500 dark:text-zinc-400 pl-5 text-sm space-y-1">
                    {top5.map(([name, sec]) => (
                      <li key={name}>{name}: {Math.floor(sec / 60)} min</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-col items-center justify-center gap-2 mt-4">
                <p className="text-sm font-medium text-center text-zinc-600 dark:text-zinc-400">
                  Napravio Boris Janković
                </p>
                <img
                  src={isDark ? '/logo.png' : '/logo-light.png'}
                  alt="Logo"
                  className="w-20 h-20 object-contain opacity-90"
                />
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full py-2 rounded-lg font-semibold transition-colors duration-300 bg-black text-white dark:bg-white dark:text-black hover:opacity-90 text-sm"
            >
              Zatvori
            </button>

            <div className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center justify-center gap-1">
                <Info size={14} /> Verzija aplikacije: <span className="font-medium">{version}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
