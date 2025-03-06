"use client"

import { useEffect } from "react"

export default function YouTubeApiHandler() {
  useEffect(() => {
    // Define the YouTube iframe API callback
    window.onYouTubeIframeAPIReady = () => {
      console.log("YouTube iframe API is ready")
    }

    // Clean up
    return () => {
      delete window.onYouTubeIframeAPIReady
    }
  }, [])

  return null
}

