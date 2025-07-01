import React, { useState, useRef, useEffect } from 'react'
import stations from './data/stations'
import Header from './components/Header'
import SearchAndFilterBar from './components/SearchAndFilterBar'
import StationsGrid from './components/StationsGrid'
import PlayerBar from './components/PlayerBar'
import SettingsModal from './components/SettingsModal'
import LoadingScreen from './components/LoadingScreen'
import { AnimatePresence, motion } from 'framer-motion'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentStation, setCurrentStation] = useState(null)
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites') || '[]'))
  const [recents, setRecents] = useState(() => JSON.parse(localStorage.getItem('recents') || '[]'))
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [showRecentsOnly, setShowRecentsOnly] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [listeningStart, setListeningStart] = useState(null)

  const audioRef = useRef(new Audio())
  const scrollRef = useRef()

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem('recents', JSON.stringify(recents))
  }, [recents])

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentStation && listeningStart) {
        const duration = Math.floor((Date.now() - listeningStart) / 1000)
        const stats = JSON.parse(localStorage.getItem('listeningStats') || '{}')
        stats[currentStation.name] = (stats[currentStation.name] || 0) + duration
        stats.lastPlayed = currentStation.name
        localStorage.setItem('listeningStats', JSON.stringify(stats))
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [currentStation, listeningStart])

  const saveListeningStats = (stationName) => {
    if (!stationName || !listeningStart) return
    const duration = Math.floor((Date.now() - listeningStart) / 1000)
    const stats = JSON.parse(localStorage.getItem('listeningStats') || '{}')
    stats[stationName] = (stats[stationName] || 0) + duration
    stats.lastPlayed = stationName
    localStorage.setItem('listeningStats', JSON.stringify(stats))
  }

  const updateRecents = (station) => {
    setRecents((prev) => {
      const existing = prev.filter((s) => s.name !== station.name)
      const updated = [station, ...existing].slice(0, 6)
      return updated
    })
  }

  const handlePlay = (station) => {
    const audio = audioRef.current

    if (currentStation?.name !== station.name) {
      saveListeningStats(currentStation?.name)
      setCurrentStation(station)
      audio.src = station.streamUrl

      updateRecents(station)

      setTimeout(() => {
        const topCard = document.getElementById(`card-${station.name}`)
        if (topCard) topCard.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 300)
    }

    audio.play().then(() => setListeningStart(Date.now())).catch(() => {})
  }

  const handlePause = () => {
    audioRef.current.pause()
    saveListeningStats(currentStation?.name)
    setListeningStart(null)
  }

  const toggleFavorite = (station) => {
    setFavorites((prev) =>
      prev.some((fav) => fav.name === station.name)
        ? prev.filter((fav) => fav.name !== station.name)
        : [...prev, station]
    )
  }

  const toggleFavorites = () => {
    setShowFavoritesOnly((prev) => {
      const next = !prev
      if (next) {
        setSearchTerm('')
        setSelectedGenre('')
        setShowRecentsOnly(false)
      }
      return next
    })
  }

  const toggleRecents = () => {
    setShowRecentsOnly((prev) => {
      const next = !prev
      if (next) {
        setSearchTerm('')
        setSelectedGenre('')
        setShowFavoritesOnly(false)
      }
      return next
    })
  }

  const genres = Array.from(new Set(stations.map((s) => s.genre).filter(Boolean)))

  const filteredStations = (() => {
    if (showRecentsOnly) {
      return recents.filter((station) => {
        const matchesSearch = station.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesGenre = selectedGenre ? station.genre === selectedGenre : true
        return matchesSearch && matchesGenre
      })
    }

    let result = stations.filter((station) => {
      const matchesSearch = station.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesGenre = selectedGenre ? station.genre === selectedGenre : true
      const isFavorite = favorites.some((fav) => fav.name === station.name)

      if (showFavoritesOnly) return matchesSearch && matchesGenre && isFavorite
      return matchesSearch && matchesGenre
    })

    result.sort((a, b) => a.name.localeCompare(b.name))
    return result
  })()

  if (loading) return <LoadingScreen isDark={isDark} />

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-500 ease-in-out">
      <Header
        openSettings={() => setSettingsOpen(true)}
        isDark={isDark}
        toggleFavorites={toggleFavorites}
        showFavoritesOnly={showFavoritesOnly}
        toggleRecents={toggleRecents}
        showRecentsOnly={showRecentsOnly}
        onResetFilters={() => {
          setSearchTerm('')
          setSelectedGenre('')
          setShowFavoritesOnly(false)
          setShowRecentsOnly(false)
        }}
      />

      <main className="px-4 pt-6 pb-36">
        <AnimatePresence mode="wait" initial={false}>
          {!showFavoritesOnly && !showRecentsOnly && (
            <motion.div
              key="search-bar"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="origin-top overflow-hidden"
            >
              <SearchAndFilterBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                genres={genres}
                selectedGenre={selectedGenre}
                setSelectedGenre={setSelectedGenre}
                showFavoritesOnly={showFavoritesOnly}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={scrollRef} className="transition-all duration-500 ease-in-out">
          <StationsGrid
            stations={filteredStations}
            currentStation={currentStation}
            favorites={favorites}
            onPlay={handlePlay}
            onToggleFavorite={toggleFavorite}
          />
        </div>
      </main>

      {currentStation && (
        <PlayerBar
          audioRef={audioRef}
          currentStation={currentStation}
          isDark={isDark}
          onPause={handlePause}
        />
      )}

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        isDark={isDark}
        toggleTheme={() => setIsDark(!isDark)}
      />
    </div>
  )
}