"use client"

import { useState, useEffect, type ReactNode } from "react"
import { Search, X } from "lucide-react"
import Link from "next/link"
import VideoCard from "@/components/video-card"
import type { Artist } from "@/components/video-tabs"

export default function SearchModal({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [videos, setVideos] = useState([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Handle escape key to close modal
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEsc)
      document.body.style.overflow = "hidden" // Prevent scrolling when modal is open
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.removeEventListener("keydown", handleEsc)
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  // Reset search when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("")
      setVideos([])
      setArtists([])
    }
  }, [isOpen])

  // Perform search as user types
  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (searchTerm.trim().length > 2) {
        performSearch(searchTerm)
      } else {
        setVideos([])
        setArtists([])
      }
    }, 300) // Debounce for 300ms to avoid too many requests

    return () => clearTimeout(searchTimeout)
  }, [searchTerm])

  const performSearch = async (query: string) => {
    if (!query.trim()) return

    setLoading(true)
    try {
      // Fetch videos
      const res = await fetch("/api/youtube")
      if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.status}`)
      }

      const data = await res.json()

      if (Array.isArray(data)) {
        // Filter videos that match the query in title
        const filteredVideos = data
          .filter((video) => video.snippet.title.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 8) // Limit to 8 results for the modal
        setVideos(filteredVideos)

        // Extract artists from video titles
        const artistMap = new Map<string, any[]>()

        data.forEach((video) => {
          // This is a simplified approach - in a real app, you'd have a more robust way to identify artists
          const title = video.snippet.title.toUpperCase()
          const possibleArtists = title
            .split(/\s*(?:B2B|\s+X\s+|,|&|\+)\s*/)
            .map((part) => part.trim())
            .filter((part) => part.length > 0)

          possibleArtists.forEach((artist) => {
            if (!artistMap.has(artist)) {
              artistMap.set(artist, [])
            }
            artistMap.get(artist)?.push(video)
          })
        })

        // Filter artists that match the query
        const matchingArtists = Array.from(artistMap.entries())
          .filter(([name]) => name.toLowerCase().includes(query.toLowerCase()))
          .map(([name, videos]) => ({ name, videos }))
          .slice(0, 4) // Limit to 4 artists for the modal

        setArtists(matchingArtists)
      }
    } catch (e) {
      console.error("Error searching:", e)
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  const viewAllResults = () => {
    if (searchTerm.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`
      setIsOpen(false)
    }
  }

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-semibold text-white">Search</span>
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-primary transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="w-full mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search shows and artists..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-md py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
              </div>
            </div>

            {loading && (
              <div className="flex justify-center py-8">
                <div className="animate-pulse text-primary">Searching...</div>
              </div>
            )}

            {error && <div className="text-red-500 mb-4">Error: {error}</div>}

            {!loading && searchTerm.trim().length > 2 && (
              <>
                {videos.length === 0 && artists.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No results found for "{searchTerm}"</div>
                ) : (
                  <div>
                    {/* Videos section */}
                    {videos.length > 0 && (
                      <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-xl font-bold text-white">Videos</h2>
                          <button onClick={viewAllResults} className="text-sm text-primary hover:underline">
                            View all results
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {videos.map((video) => (
                            <VideoCard key={video.id.videoId} video={video} onClick={() => setIsOpen(false)} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Artists section */}
                    {artists.length > 0 && (
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-xl font-bold text-white">Artists</h2>
                          <button onClick={viewAllResults} className="text-sm text-primary hover:underline">
                            View all results
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {artists.map((artist) => (
                            <Link
                              key={artist.name}
                              href={`/search?q=${encodeURIComponent(artist.name)}`}
                              onClick={() => setIsOpen(false)}
                              className="bg-card p-4 rounded-lg hover:bg-primary/10 transition-colors"
                            >
                              <h3 className="text-lg font-semibold text-white">{artist.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {artist.videos.length} {artist.videos.length === 1 ? "set" : "sets"}
                              </p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

