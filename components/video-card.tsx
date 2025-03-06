"use client"

import type React from "react"

import { Calendar, Music2, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useVideo } from "@/lib/video-context"
import { useRouter } from "next/navigation"

interface Video {
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

function formatDuration(duration: string) {
  if (!duration) return "N/A"
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
  if (!match) return "N/A"
  const hours = match[1] ? match[1].replace("H", "") : 0
  const minutes = match[2] ? match[2].replace("M", "") : 0
  const seconds = match[3] ? match[3].replace("S", "") : 0
  return [hours, minutes, seconds]
    .map((val) => val.toString().padStart(2, "0"))
    .filter((val, index) => val !== "00" || index > 0)
    .join(":")
}

export default function VideoCard({ video, onClick }: { video: Video; onClick?: () => void }) {
  const { setVideoId, isHomePage, setHasUserInteracted } = useVideo()
  const router = useRouter()

  const handleVideoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log("Setting video ID:", video.id.videoId)

    // Set the video ID - this will also mark user interaction
    setVideoId(video.id.videoId)

    // Mark that user has interacted (this helps with autoplay policies)
    setHasUserInteracted(true)

    // If we're not on the home page, navigate to home
    if (!isHomePage) {
      router.push("/")
    }

    // Call the optional onClick handler if provided
    if (onClick) onClick()
  }

  return (
    <div className="group relative overflow-hidden rounded-lg bg-card transition-all video-card-hover">
      <div className="aspect-video relative">
        <img
          src={video.snippet.thumbnails.medium.url || "/placeholder.svg"}
          alt={video.snippet.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <button onClick={handleVideoClick} className="absolute inset-0 flex items-center justify-center">
          <Button
            size="icon"
            className="h-12 w-12 rounded-full bg-primary/80 hover:bg-primary opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Youtube className="h-6 w-6 text-white" />
          </Button>
        </button>
        {video.contentDetails?.duration && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video.contentDetails.duration)}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white line-clamp-2 group-hover:text-primary transition-colors">
          {video.snippet.title}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(video.snippet.publishedAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <Music2 className="h-3 w-3" />
            {video.statistics?.viewCount || "N/A"} views
          </span>
        </div>
      </div>
    </div>
  )
}

