import React, { useEffect, useState } from 'react'
import { Play, Pause, Radio, Volume2 } from 'lucide-react'
import clsx from 'clsx'
import { motion } from 'framer-motion'

export default function PlayerBar({ audioRef, currentStation, isDark }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.8)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = volume

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)

    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
    }
  }, [audioRef])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const togglePlayback = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }

  const accentColor = isDark ? 'text-red-500' : 'text-blue-500'
  const accentSlider = isDark ? 'accent-red-500' : 'accent-blue-500'

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={clsx(
        'fixed bottom-0 left-0 right-0 px-4 py-3 z-50 transition-colors duration-500',
        isDark
          ? 'bg-zinc-900 text-white border-t border-zinc-800'
          : 'bg-white text-black border-t border-zinc-200'
      )}
    >
      <div className="flex items-center justify-between gap-4 max-w-6xl mx-auto w-full">
        {/* Naziv stanice */}
        <div className="flex items-center gap-2 min-w-0 w-1/3 truncate">
          <Radio size={20} className={`shrink-0 ${accentColor}`} />
          <span className="font-semibold truncate text-sm sm:text-base text-black dark:text-white">
            {currentStation?.name || 'Nijedna stanica'}
          </span>
        </div>

        {/* Play/Pause */}
        <button
          onClick={togglePlayback}
          className={clsx(
            'w-12 h-12 flex items-center justify-center rounded-full transition duration-300 shadow-md shrink-0',
            isDark
              ? 'bg-white text-black hover:scale-105'
              : 'bg-black text-white hover:scale-105'
          )}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        {/* Volume */}
        <div className="flex items-center gap-2 justify-end w-1/3">
          <Volume2 size={20} className={clsx('shrink-0', accentColor)} />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className={clsx(
              'w-full max-w-[100px] h-2 rounded-full cursor-pointer',
              accentSlider
            )}
          />
        </div>
      </div>
    </motion.div>
  )
}
