import React, { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Settings2, ToggleRight, Globe, Bell, Trash } from 'lucide-react'

export default function SettingsModal({ isOpen, onClose, isDark }) {
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

  const handleResetStats = () => {
    localStorage.removeItem('listeningStats')
    setStats({})
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-white dark:bg-zinc-900 rounded-xl p-6 w-[90%] max-w-md shadow-2xl border border-zinc-200 dark:border-zinc-700"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Close dugme */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-zinc-500 hover:text-red-500 transition"
              aria-label="Zatvori"
            >
              <X size={20} />
            </button>

            {/* Naslov */}
            <div className="flex items-center gap-2 mb-4">
              <Settings2 className="text-blue-500 dark:text-red-500" size={20} />
              <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
                Podešavanja
              </h2>
            </div>

            {/* Statistika */}
            <div className="mt-4 space-y-2 text-sm">
              <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">📈 Statistika slušanja</h3>

              {stats.lastPlayed && (
                <p className="text-zinc-600 dark:text-zinc-400">
                  Poslednje slušano: <strong>{stats.lastPlayed}</strong>
                </p>
              )}

              {Object.keys(stats).length > 1 && (() => {
                const sorted = Object.entries(stats)
                  .filter(([k]) => k !== 'lastPlayed')
                  .sort((a, b) => b[1] - a[1])

                const [topName, topSeconds] = sorted[0]

                return (
                  <>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      Najviše slušano: <strong>{topName}</strong> ({Math.floor(topSeconds / 60)} min)
                    </p>
                    <ul className="list-disc text-zinc-500 dark:text-zinc-400 pl-5 space-y-1">
                      {sorted.map(([name, sec]) => (
                        <li key={name}>
                          {name}: {Math.floor(sec / 60)} min
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={handleResetStats}
                      className="mt-3 flex items-center gap-2 text-sm text-red-500 hover:underline"
                    >
                      <Trash size={16} /> Obriši statistiku
                    </button>
                  </>
                )
              })()}
            </div>

            {/* Potpis i logo */}
            <div className="mt-6 flex flex-col items-center justify-center gap-2">
              <p className="text-sm font-medium text-center text-zinc-600 dark:text-zinc-400">
                Napravio Boris Janković:
              </p>
              <img
                src={isDark ? '/logo.png' : '/logo-light.png'}
                alt="Boris Janković logo"
                className="w-20 h-20 object-contain opacity-90"
              />
            </div>

            {/* Zatvori dugme */}
            <button
              onClick={onClose}
              className="mt-6 w-full py-2 rounded-lg font-semibold transition-colors duration-300 bg-black text-white dark:bg-white dark:text-black hover:opacity-90"
            >
              Zatvori
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
