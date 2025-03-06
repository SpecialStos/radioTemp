"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import Library from "./library"
import Artists from "./artists"
import { useState, useEffect } from "react"

export interface Video {
  id: { videoId: string }
  snippet: {
    title: string
    publishedAt: string
    thumbnails: {
      medium: { url: string }
    }
  }
  statistics?: {
    viewCount: string
  }
  contentDetails?: {
    duration: string
  }
}

export interface Artist {
  name: string
  videos: Video[]
}

// Updated artist names with correct capitalization
const KNOWN_ARTISTS = [
  "AGNES",
  "AXEL",
  "5OFFER",
  "OR NAGAR",
  "HAREL MOR",
  "PAZZI",
  "PAN.",
  "CHRIS BODNAR",
  "MIRONAS",
  "CHARKOAL",
  "DALTON",
  "GIO",
  "MADIMIEL",
  "DOX",
  "STÁSIA",
  "BAROQUE",
  "IVORY",
  "JIGSAW",
  "HLEB",
  "SHAYAN",
  "ADJK",
]

// Helper function to clean artist names
function cleanArtistName(name: string): string {
  return name.replace(/@.*$/, "").replace(/\|.*$/, "").replace(/,.*$/, "").trim().toUpperCase()
}

function parseArtists(title: string): string[] {
  const cleanTitle = title
    .replace(/$$[^)]*$$/g, "") // Remove content in parentheses
    .replace(/\[[^\]]*\]/g, "") // Remove content in square brackets
    .replace(/disclosure\.cy/gi, "")
    .toUpperCase()
    .trim()

  // Modified regex to handle 'X' properly
  // Only match 'X' when it's surrounded by spaces and not part of a word
  const potentialArtists = cleanTitle
    .split(/\s*(?:B2B|\s+X\s+|,|&|\+)\s*/i)
    .map((artist) => cleanArtistName(artist.trim()))
    .filter((artist) => artist.length > 0)

  // Direct matching against known artists
  const matchedArtists = KNOWN_ARTISTS.filter((knownArtist) =>
    potentialArtists.some((potentialArtist) => {
      // Exact match or contains the known artist name
      return potentialArtist === knownArtist || potentialArtist.includes(knownArtist)
    }),
  )

  return matchedArtists.length > 0 ? matchedArtists : []
}

export default function VideoTabs({ videos }: { videos: Video[] }) {
  const [activeTab, setActiveTab] = useState("library")
  const [artistsList, setArtistsList] = useState<Artist[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (videos && videos.length > 0) {
      const artistsMap = new Map<string, Video[]>()

      videos.forEach((video) => {
        const artists = parseArtists(video.snippet.title)
        artists.forEach((artist) => {
          if (!artistsMap.has(artist)) {
            artistsMap.set(artist, [])
          }
          artistsMap.get(artist)?.push(video)
        })
      })

      const newArtistsList: Artist[] = Array.from(artistsMap.entries())
        .map(([name, videos]) => ({ name, videos }))
        .sort((a, b) => a.name.localeCompare(b.name))

      setArtistsList(newArtistsList)
      setIsLoading(false)
    }
  }, [videos])

  if (!videos || videos.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No videos available</div>
  }

  return (
    <Tabs defaultValue="library" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted p-1 rounded-lg">
        <TabsTrigger
          value="library"
          className="py-2 px-4 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white transition-all neon-tab"
        >
          Library
        </TabsTrigger>
        <TabsTrigger
          value="artists"
          className="py-2 px-4 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white transition-all neon-tab"
        >
          Artists
        </TabsTrigger>
      </TabsList>
      <TabsContent value="library">
        <Library videos={videos} />
      </TabsContent>
      <TabsContent value="artists">
        <Artists artists={artistsList} />
      </TabsContent>
    </Tabs>
  )
}

