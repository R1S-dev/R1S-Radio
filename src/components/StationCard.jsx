import React from 'react'
import { Play, Radio, Star, StarOff, Waves } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

export default function StationCard({
  station,
  isCurrent,
  isFavorite,
  onPlay,
  onToggleFavorite
}) {
  return (
    <motion.div
      layout
      layoutId={`station-${station.name}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={clsx(
        'relative bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-md border border-zinc-200 dark:border-zinc-800 transition-all duration-300 ease-in-out hover:shadow-lg'
      )}
    >
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => onToggleFavorite(station)}
        className={clsx(
          'absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full transition-all z-10 shadow-sm',
          isFavorite
            ? 'bg-yellow-400 text-white hover:brightness-110'
            : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 hover:text-yellow-400'
        )}
        aria-label="Omiljena stanica"
      >
        {isFavorite ? <Star size={18} /> : <StarOff size={18} />}
      </motion.button>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Radio size={20} className="text-blue-500 dark:text-red-400" />
          <h2 className="text-xl font-semibold leading-snug truncate">{station.name}</h2>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{station.genre}</p>
      </div>

      <motion.button
        onClick={() => onPlay(station)}
        whileTap={{ scale: 0.98 }}
        className={clsx(
          'w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-semibold text-white transition-all shadow-sm',
          isCurrent
            ? 'bg-blue-600 dark:bg-red-500 animate-pulse hover:brightness-110'
            : 'bg-zinc-800 dark:bg-zinc-700 hover:bg-zinc-700 dark:hover:bg-zinc-600'
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isCurrent ? (
            <motion.div
              key="waves"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Waves size={18} />
            </motion.div>
          ) : (
            <motion.div
              key="play"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Play size={18} />
            </motion.div>
          )}
        </AnimatePresence>
        {isCurrent ? 'Slušate' : 'Pusti'}
      </motion.button>
    </motion.div>
  )
}
