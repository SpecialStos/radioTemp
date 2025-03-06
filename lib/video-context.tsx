"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

// Default featured video ID
export const DEFAULT_VIDEO_ID = "ziX_YN1-1Yo"

// Key for localStorage
const STORAGE_KEY = "video-state"

interface VideoContextType {
  videoId: string
  setVideoId: (id: string) => void
  isHomePage: boolean
  isFloating: boolean
  isMinimized: boolean
  toggleMinimized: () => void
  resetVideo: () => void
  currentTime: number
  setCurrentTime: (time: number) => void
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  hasUserInteracted: boolean
  setHasUserInteracted: (interacted: boolean) => void
  playerRef: React.RefObject<HTMLIFrameElement>
  lastUpdated: number
}

const VideoContext = createContext<VideoContextType | null>(null)

export function VideoProvider({ children }: { children: React.ReactNode }) {
  // State for video player
  const [videoId, setVideoId] = useState<string>(DEFAULT_VIDEO_ID)
  const [isMinimized, setIsMinimized] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true) // Default to playing
  const [hasUserInteracted, setHasUserInteracted] = useState(false) // Track if user has interacted
  const [lastUpdated, setLastUpdated] = useState(Date.now())

  // Create a ref for the player
  const playerRef = useRef<HTMLIFrameElement>(null)

  // Get current pathname
  const pathname = usePathname()
  const isHomePage = pathname === "/"
  const isFloating = !isHomePage && videoId !== null

  // Load saved state on initial mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY)
      if (savedState) {
        const { videoId: savedId, currentTime: savedTime, hasUserInteracted: savedInteraction } = JSON.parse(savedState)

        if (savedId) setVideoId(savedId)
        if (savedTime !== undefined) setCurrentTime(savedTime)
        if (savedInteraction !== undefined) setHasUserInteracted(savedInteraction)
      }
    } catch (e) {
      console.error("Error loading saved video state:", e)
    }
  }, [])

  // Save state to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          videoId,
          currentTime,
          hasUserInteracted,
          lastUpdated: Date.now(),
        }),
      )
    } catch (e) {
      console.error("Error saving video state:", e)
    }
  }, [videoId, currentTime, hasUserInteracted])

  // Update lastUpdated whenever currentTime changes
  const updateCurrentTime = (time: number) => {
    setCurrentTime(time)
    setLastUpdated(Date.now())
  }

  // Toggle minimized state
  const toggleMinimized = () => {
    setIsMinimized((prev) => !prev)
  }

  // Reset video to default
  const resetVideo = () => {
    setVideoId(DEFAULT_VIDEO_ID)
    setCurrentTime(0)
    setIsPlaying(false)
    setIsMinimized(false)
  }

  // Custom video ID setter that also marks user interaction
  const handleSetVideoId = (id: string) => {
    setVideoId(id)
    setHasUserInteracted(true)
    setIsPlaying(true)
  }

  return (
    <VideoContext.Provider
      value={{
        videoId,
        setVideoId: handleSetVideoId,
        isHomePage,
        isFloating,
        isMinimized,
        toggleMinimized,
        resetVideo,
        currentTime,
        setCurrentTime: updateCurrentTime,
        isPlaying,
        setIsPlaying,
        hasUserInteracted,
        setHasUserInteracted,
        playerRef,
        lastUpdated,
      }}
    >
      {children}
    </VideoContext.Provider>
  )
}

export function useVideo() {
  const context = useContext(VideoContext)
  if (!context) {
    throw new Error("useVideo must be used within a VideoProvider")
  }

  // Add a helper function to get the estimated current time
  const getEstimatedCurrentTime = () => {
    const { currentTime, isPlaying, lastUpdated } = context
    if (!isPlaying) return currentTime

    const elapsed = (Date.now() - lastUpdated) / 1000
    return currentTime + elapsed
  }

  return {
    ...context,
    getEstimatedCurrentTime,
  }
}

