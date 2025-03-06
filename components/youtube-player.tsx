"use client"

import { useEffect, useState, useRef } from "react"
import { useVideo } from "@/lib/video-context"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import playerRegistry from "@/lib/player-registry"

export default function YouTubePlayer({ playerId = "main" }: { playerId?: string }) {
  const { videoId, setCurrentTime, isPlaying, setIsPlaying, getEstimatedCurrentTime } = useVideo()

  const [error, setError] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Get the estimated current time
  const estimatedTime = getEstimatedCurrentTime()

  // Handle errors
  const handleError = () => {
    setError(true)
  }

  // Register the player when it's mounted
  useEffect(() => {
    if (iframeRef.current) {
      playerRegistry.registerPlayer(playerId, iframeRef.current)
    }

    // Clean up when unmounted
    return () => {
      playerRegistry.removePlayer(playerId)
    }
  }, [playerId])

  // Set up message listener for YouTube player
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (typeof event.data === "string") {
        try {
          const data = JSON.parse(event.data)
          if (data.event === "onStateChange") {
            // Update playing state based on YouTube player state
            // 1 = playing, 2 = paused, 0 = ended, etc.
            setIsPlaying(data.info === 1)
          } else if (data.event === "onCurrentTime") {
            setCurrentTime(data.time)
          }
        } catch (e) {
          // Not our message, ignore
        }
      }
    }

    window.addEventListener("message", handleMessage)

    // Save current time periodically
    const interval = setInterval(() => {
      if (iframeRef.current) {
        try {
          // Get current time from YouTube player
          const message = JSON.stringify({ event: "getCurrentTime" })
          iframeRef.current.contentWindow?.postMessage(message, "*")
        } catch (e) {
          console.error("Error getting current time:", e)
        }
      }
    }, 1000)

    return () => {
      window.removeEventListener("message", handleMessage)
      clearInterval(interval)
    }
  }, [setCurrentTime, setIsPlaying])

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          The video could not be loaded. Please try watching it directly on YouTube.
          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-2 underline"
          >
            Watch on YouTube
          </a>
        </AlertDescription>
      </Alert>
    )
  }

  // Create the iframe src URL with the estimated current time
  const iframeSrc = `https://www.youtube.com/embed/${videoId}?start=${Math.floor(
    estimatedTime,
  )}&autoplay=1&enablejsapi=1&origin=${typeof window !== "undefined" ? window.location.origin : ""}`

  return (
    <iframe
      ref={iframeRef}
      width="100%"
      height="100%"
      src={iframeSrc}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      className="w-full h-full"
      onError={handleError}
    />
  )
}

