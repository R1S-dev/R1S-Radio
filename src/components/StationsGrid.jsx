import React from 'react'
import StationCard from './StationCard'
import { AnimatePresence, motion } from 'framer-motion'

export default function StationsGrid({ stations, currentStation, favorites, onPlay, onToggleFavorite }) {
  if (stations.length === 0) {
    return <p className="text-center text-gray-500 dark:text-gray-400">Nema pronađenih stanica...</p>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-all"
    >
      <AnimatePresence mode="sync">
        {stations.map((station, index) => (
          <StationCard
            key={station.name}
            station={station}
            isCurrent={currentStation?.name === station.name}
            isFavorite={favorites.some((fav) => fav.name === station.name)}
            onPlay={onPlay}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
