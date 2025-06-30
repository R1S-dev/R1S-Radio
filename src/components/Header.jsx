import React from 'react'
import { Settings, Sun, Moon, Heart } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

export default function Header({ toggleTheme, openSettings, isDark, toggleFavorites, showFavoritesOnly }) {
  const iconColor = isDark ? 'text-red-500' : 'text-blue-500'
  const bg = isDark ? 'bg-zinc-900' : 'bg-white'
  const border = isDark ? 'border-zinc-700' : 'border-zinc-200'

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`sticky top-0 flex items-center justify-between px-5 py-3 transition-colors duration-500 ${bg} border-b ${border} shadow-sm z-50`}
    >
      {/* Logo i naziv */}
      <div className="flex items-center gap-4">
        <motion.img
          key={isDark ? 'logo-dark' : 'logo-light'}
          src={isDark ? '/logo.png' : '/logo-light.png'}
          alt="R1S Radio"
          className="w-14 h-14 object-contain max-h-[56px] transition-all duration-500"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        />
        <h1 className="text-2xl font-bold tracking-tight text-black dark:text-white">Radio</h1>
      </div>

      {/* Akcije */}
      <div className="flex items-center gap-3">
        {/* Favorites toggle */}
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

        {/* Tema toggle */}
        <motion.button
          key={isDark ? 'sun' : 'moon'}
          onClick={toggleTheme}
          initial={{ rotate: 180, scale: 0.8, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:scale-110 transition-all"
          aria-label="Promeni temu"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isDark ? (
              <motion.div
                key="sun"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Sun className={`size-5 ${iconColor}`} />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Moon className={`size-5 ${iconColor}`} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Podešavanja */}
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
