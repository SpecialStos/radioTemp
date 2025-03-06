"use client"

import { useEffect, useState } from "react"
import { X, Minimize2, Maximize2, Home } from "lucide-react"
import { useVideo } from "@/lib/video-context"
import { useRouter } from "next/navigation"
import YouTubePlayer from "./youtube-player"

export default function FloatingVideoPlayer() {
  const { videoId, isHomePage, isFloating, isMinimized, toggleMinimized, resetVideo } = useVideo()

  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  // Only show floating player if we're not on the homepage and have a video
  useEffect(() => {
    // Add a slight delay before showing the player to allow for smooth transitions
    if (isFloating) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [isFloating])

  // If we're on the homepage, don't render anything
  if (isHomePage || !videoId) return null

  const expandToHome = () => {
    router.push("/")
  }

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ${!isVisible ? "opacity-0" : "opacity-100"} ${
        isMinimized ? "bottom-4 right-4 w-80 h-45" : "bottom-8 right-8 w-96 h-54"
      }`}
    >
      <div className="bg-background border border-border rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-2 bg-card">
          <span className="text-sm font-medium">Now Playing</span>
          <div className="flex items-center gap-2">
            <button
              onClick={expandToHome}
              className="p-1 hover:text-primary transition-colors"
              title="Open in home page"
            >
              <Home className="h-4 w-4" />
            </button>
            <button
              onClick={toggleMinimized}
              className="p-1 hover:text-primary transition-colors"
              title={isMinimized ? "Maximize" : "Minimize"}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </button>
            <button onClick={resetVideo} className="p-1 hover:text-primary transition-colors" title="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="aspect-video">
          <YouTubePlayer playerId="floating" />
        </div>
      </div>
    </div>
  )
}

