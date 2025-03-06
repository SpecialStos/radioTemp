"use client"

import type React from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import SearchModal from "@/components/search-modal"
import MobileMenu from "@/components/mobile-menu"
import FloatingVideoPlayer from "@/components/floating-video-player"
import Script from "next/script"
import { VideoProvider } from "@/lib/video-context"
import { useVideo } from "@/lib/video-context"
import YouTubePlayer from "@/components/youtube-player"
import { Music2, Calendar, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import playerRegistry from "@/lib/player-registry"

// Main video player for homepage
function MainVideoPlayer() {
  const { videoId, isHomePage } = useVideo()
  const [videoDetails, setVideoDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Only fetch details if we're on the homepage
  useEffect(() => {
    if (!isHomePage || !videoId) return

    async function fetchVideoDetails() {
      setLoading(true)
      try {
        const response = await fetch(`/api/youtube/video/${videoId}`)
        if (response.ok) {
          const data = await response.json()
          setVideoDetails(data)
        }
      } catch (err) {
        console.error("Error fetching video details:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchVideoDetails()
  }, [videoId, isHomePage])

  // Don't render if not on homepage
  if (!isHomePage) return null

  // Helper function to extract clean artist name
  const extractArtistName = (title: string): string => {
    // Get everything before @ or | if they exist
    const name = title.split(/[@|]/)[0].trim().toUpperCase()
    return name
  }

  // Format the date as MONTH YEAR
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date
      .toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
      .toUpperCase()
  }

  // Get clean artist name and formatted date
  const artistName = videoDetails?.snippet?.title ? extractArtistName(videoDetails.snippet.title) : "FEATURED ARTIST"

  const formattedDate = videoDetails?.snippet?.publishedAt ? formatDate(videoDetails.snippet.publishedAt) : "LOADING..."

  // Combine artist name and date with the | separator
  const displayTitle = `${artistName} | ${formattedDate}`

  return (
    <>
      <div className="w-full bg-black">
        <div className="aspect-video w-full max-w-none">
          <YouTubePlayer playerId="main" />
        </div>
      </div>
      <div className="container mx-auto px-4 md:px-8 mt-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold neon-text">{displayTitle}</h1>
            {!loading && videoDetails && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(videoDetails?.snippet.publishedAt || "").toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Music2 className="h-4 w-4" />
                  {videoDetails?.statistics.viewCount || "0"} views
                </span>
              </div>
            )}
          </div>
          <Button
            variant="outline"
            className="border-primary text-white hover:bg-primary/10"
            onClick={() => window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank")}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Watch on YouTube
          </Button>
        </div>
      </div>
    </>
  )
}

// Component to clean up players when the app is closed/refreshed
function PlayerCleanup() {
  useEffect(() => {
    // Clean up all players when the component unmounts (app closes)
    return () => {
      playerRegistry.cleanupAllPlayers()
    }
  }, [])

  return null
}

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  // Clean up any existing players when the app loads
  useEffect(() => {
    playerRegistry.cleanupAllPlayers()
  }, [])

  return (
    <VideoProvider>
      <Script
        src="https://www.youtube.com/iframe_api"
        strategy="beforeInteractive"
        onLoad={() => console.log("YouTube API loaded")}
      />
      <PlayerCleanup />
      <header className="border-b border-border py-4">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold neon-text">
              disclosure.cy
            </Link>
            <div className="flex items-center gap-6 md:gap-8">
              <nav className="hidden md:flex items-center gap-6 md:gap-8">
                <Link href="/?scroll=videos" className="text-white hover:text-white neon-text" scroll={false}>
                  Library
                </Link>
                <Link href="/calendar" className="text-white hover:text-white neon-text">
                  Calendar
                </Link>
                <a
                  href="https://linktr.ee/disclosure.cy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-white neon-text"
                >
                  Social
                </a>
                <Link href="/about" className="text-white hover:text-white neon-text">
                  About
                </Link>
                <Link href="/contact" className="text-white hover:text-white neon-text">
                  Contact
                </Link>
              </nav>
              <div className="flex items-center gap-4">
                <SearchModal>
                  <button className="text-white hover:text-primary transition-colors">
                    <Search className="h-5 w-5" />
                  </button>
                </SearchModal>
                <MobileMenu />
              </div>
            </div>
          </div>
        </div>
      </header>
      <MainVideoPlayer />
      <main>{children}</main>
      <FloatingVideoPlayer />
    </VideoProvider>
  )
}

