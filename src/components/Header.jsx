import React from 'react'
import { Settings, Heart, History } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Header({
  openSettings,
  isDark,
  toggleFavorites,
  showFavoritesOnly,
  toggleRecents,
  showRecentsOnly,
  onResetFilters
}) {
  const iconColor = isDark ? 'text-red-500' : 'text-blue-500'
  const bg = isDark ? 'bg-zinc-900' : 'bg-white'
  const border = isDark ? 'border-zinc-700' : 'border-zinc-200'

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`sticky top-0 z-50 px-5 py-4 flex items-center justify-between transition-colors duration-500 ${bg} border-b ${border} shadow-sm`}
    >
      {/* Logo i naziv */}
      <div className="flex items-center gap-4 cursor-pointer" onClick={onResetFilters}>
        <motion.img
          key={isDark ? 'logo-dark' : 'logo-light'}
          src={isDark ? '/logo.png' : '/logo-light.png'}
          alt="R1S Radio"
          className="w-14 h-14 object-contain transition-all duration-500"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        />
        <h1 className="text-2xl font-bold tracking-tight text-black dark:text-white">Radio</h1>
      </div>

      {/* Akcije */}
      <div className="flex items-center gap-3">
        <motion.button
          onClick={toggleFavorites}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            showFavoritesOnly
              ? isDark
                ? 'bg-red-700 text-white'
                : 'bg-blue-100 text-blue-600'
              : 'bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600'
          }`}
          aria-label="Omiljene stanice"
        >
          <Heart
            className={`size-5 transition ${
              showFavoritesOnly
                ? isDark
                  ? 'text-white'
                  : 'text-blue-600'
                : iconColor
            }`}
            fill={showFavoritesOnly ? (isDark ? 'white' : 'currentColor') : 'none'}
          />
        </motion.button>

        <motion.button
          onClick={toggleRecents}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            showRecentsOnly
              ? isDark
                ? 'bg-red-700 text-white'
                : 'bg-blue-100 text-blue-600'
              : 'bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600'
          }`}
          aria-label="Poslednje slušano"
        >
          <History
            className={`size-5 transition ${
              showRecentsOnly
                ? isDark
                  ? 'text-white'
                  : 'text-blue-600'
                : iconColor
            }`}
          />
        </motion.button>

        <motion.button
          onClick={openSettings}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 flex items-center justify-center transition"
          aria-label="Podešavanja"
        >
          <Settings className={`size-5 ${iconColor}`} />
        </motion.button>
      </div>
    </motion.header>
  )
}
