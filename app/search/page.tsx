"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import VideoCard from "@/components/video-card"
import type { Artist } from "@/components/video-tabs"
import Link from "next/link"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const [videos, setVideos] = useState([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query) {
      setLoading(false)
      return
    }

    async function fetchSearchResults() {
      setLoading(true)
      try {
        const res = await fetch("/api/youtube")
        if (!res.ok) {
          throw new Error(`Failed to fetch data: ${res.status}`)
        }

        const data = await res.json()

        if (Array.isArray(data)) {
          // Filter videos that match the query in title
          const filteredVideos = data.filter((video) => video.snippet.title.toLowerCase().includes(query.toLowerCase()))
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

          setArtists(matchingArtists)
        } else {
          throw new Error("Invalid response format")
        }
      } catch (e) {
        console.error("Error searching:", e)
        setError(e instanceof Error ? e.message : String(e))
      } finally {
        setLoading(false)
      }
    }

    fetchSearchResults()
  }, [query])

  if (!query) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-12">
        <h1 className="text-3xl font-bold mb-4 neon-text">Search</h1>
        <p className="text-muted-foreground">Enter a search term to find videos and artists.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-12">
        <h1 className="text-3xl font-bold mb-4 neon-text">Searching for "{query}"</h1>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-12">
        <h1 className="text-3xl font-bold mb-4 neon-text">Search</h1>
        <Alert variant="destructive">
          <AlertDescription>Error: {error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const hasResults = videos.length > 0 || artists.length > 0

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      <h1 className="text-3xl font-bold mb-4 neon-text">Search Results for "{query}"</h1>

      {!hasResults && <p className="text-muted-foreground mb-8">No results found for "{query}".</p>}

      {videos.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white">Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {videos.map((video) => (
              <VideoCard key={video.id.videoId} video={video} />
            ))}
          </div>
        </div>
      )}

      {artists.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-white">Artists</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {artists.map((artist) => (
              <div key={artist.name} className="bg-card p-6 rounded-lg hover:bg-primary/10 transition-colors">
                <h3 className="text-xl font-semibold text-white">{artist.name}</h3>
                <p className="text-sm text-muted-foreground mt-2 mb-4">
                  {artist.videos.length} {artist.videos.length === 1 ? "set" : "sets"}
                </p>
                {artist.videos.length > 0 && (
                  <div className="aspect-video relative rounded-md overflow-hidden mb-4">
                    <img
                      src={artist.videos[0].snippet.thumbnails.medium.url || "/placeholder.svg"}
                      alt={artist.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  </div>
                )}
                <Link
                  href={`/search?q=${encodeURIComponent(artist.name)}`}
                  className="text-primary hover:underline text-sm"
                >
                  View all sets
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

