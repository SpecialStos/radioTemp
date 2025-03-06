"use client"

import { useState } from "react"
import type { Artist } from "./video-tabs"
import VideoCard from "./video-card"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

function groupArtistsByLetter(artists: Artist[]) {
  const groups = new Map<string, Artist[]>()

  artists.forEach((artist) => {
    // Use the first letter of the artist name for grouping
    const key = artist.name.charAt(0).match(/[A-Z]/) ? artist.name.charAt(0) : "#"

    if (!groups.has(key)) {
      groups.set(key, [])
    }
    groups.get(key)?.push(artist)
  })

  // Sort groups alphabetically, with "#" at the end
  return new Map(
    [...groups.entries()].sort((a, b) => {
      if (a[0] === "#") return 1
      if (b[0] === "#") return -1
      return a[0].localeCompare(b[0])
    }),
  )
}

export default function Artists({ artists }: { artists: Artist[] }) {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)

  // Sort artists alphabetically
  const sortedArtists = [...artists].sort((a, b) => a.name.localeCompare(b.name))

  if (!sortedArtists || sortedArtists.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-zinc-400">No artists found</p>
      </div>
    )
  }

  if (selectedArtist) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedArtist(null)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-3xl font-bold neon-text">
            {selectedArtist.name}
            <span className="text-base font-normal text-muted-foreground ml-2" style={{ textShadow: "none" }}>
              ({selectedArtist.videos.length} {selectedArtist.videos.length === 1 ? "set" : "sets"})
            </span>
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {selectedArtist.videos.map((video) => (
            <VideoCard key={video.id.videoId} video={video} />
          ))}
        </div>
      </div>
    )
  }

  const groupedArtists = groupArtistsByLetter(sortedArtists)

  return (
    <div className="grid gap-8">
      {Array.from(groupedArtists.entries()).map(([letter, artists]) => (
        <div key={letter} className="space-y-4">
          <h2 className="text-xl font-bold neon-text">{letter}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {artists.map((artist) => (
              <button
                key={artist.name}
                onClick={() => setSelectedArtist(artist)}
                className="text-left p-4 rounded-lg bg-card hover:bg-primary/10 transition-colors"
              >
                <h3 className="text-lg font-semibold text-white">{artist.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {artist.videos.length} {artist.videos.length === 1 ? "set" : "sets"}
                </p>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

