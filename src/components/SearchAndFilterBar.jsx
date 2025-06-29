import React from 'react'
import { Search, ListMusic } from 'lucide-react'

export default function SearchAndFilterBar({
  searchTerm,
  setSearchTerm,
  genres = [],
  selectedGenre,
  setSelectedGenre,
  showFavoritesOnly
}) {
  return (
    <div className="max-w-5xl mx-auto mb-6 px-4">
      {!showFavoritesOnly && (
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
              size={18}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pretraži stanice..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-red-500 transition"
            />
          </div>

          {/* Genre Dropdown */}
          <div className="relative w-full sm:w-56">
            <ListMusic
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
              size={18}
            />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-red-500 transition"
            >
              <option value="">Svi žanrovi</option>
              {genres.map((genre, idx) => (
                <option key={idx} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  )
}
