import React, { useState, useRef, useEffect } from 'react'
import stations from './data/stations'
import Header from './components/Header'
import SearchAndFilterBar from './components/SearchAndFilterBar'
import StationsGrid from './components/StationsGrid'
import PlayerBar from './components/PlayerBar'
import SettingsModal from './components/SettingsModal'
import LoadingScreen from './components/LoadingScreen'
import UpdateModal from './components/UpdateModal'
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion'

export default function App() {
  const APP_VERSION = '1.3.5'

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
  const [updateModalOpen, setUpdateModalOpen] = useState(false)

  const audioRef = useRef(new Audio())

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
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

  useEffect(() => {
    const lastSeenVersion = localStorage.getItem('appVersion')
    if (lastSeenVersion !== APP_VERSION) {
      setUpdateModalOpen(true)
      localStorage.setItem('appVersion', APP_VERSION)
    }
  }, [])

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
      }, 100)
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
    let baseList = showRecentsOnly ? recents : stations

    let result = baseList.filter((station) => {
      const matchesSearch = station.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesGenre = selectedGenre ? station.genre === selectedGenre : true
      const isFavorite = favorites.some((fav) => fav.name === station.name)

      if (showFavoritesOnly) return matchesSearch && matchesGenre && isFavorite
      return matchesSearch && matchesGenre
    })

    if (!showRecentsOnly) {
      result.sort((a, b) => a.name.localeCompare(b.name))
    }

    return result
  })()

  if (loading) return <LoadingScreen isDark={isDark} />

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-[env(safe-area-inset-top)] transition-colors duration-500">
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

      <main className="px-4 pt-4 pb-36">
        <AnimatePresence mode="wait" initial={false}>
          {!showFavoritesOnly && !showRecentsOnly && (
            <motion.div
              key="search-bar"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="overflow-hidden mb-4"
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

        <LayoutGroup>
          <motion.div
            layout
            transition={{ layout: { duration: 0.35, ease: 'easeOut' } }}
            className="transition-all duration-500 ease-in-out"
          >
            <StationsGrid
              stations={filteredStations}
              currentStation={currentStation}
              favorites={favorites}
              onPlay={handlePlay}
              onToggleFavorite={toggleFavorite}
            />
          </motion.div>
        </LayoutGroup>
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
        version={APP_VERSION}
      />

      <UpdateModal
        isOpen={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        version={APP_VERSION}
      />
    </div>
  )
}
