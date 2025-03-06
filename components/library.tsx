"use client"

import { useState, useEffect } from "react"
import VideoCard from "./video-card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

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

export default function Library({ videos: initialVideos }: { videos?: Video[] }) {
  const [videos, setVideos] = useState<Video[]>(initialVideos || [])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(!initialVideos)

  useEffect(() => {
    if (initialVideos) {
      setVideos(initialVideos)
      setLoading(false)
      return
    }

    async function fetchVideos() {
      try {
        const response = await fetch("/api/youtube")
        if (!response.ok) {
          throw new Error(`Failed to fetch videos: ${response.statusText}`)
        }
        const data = await response.json()
        if (Array.isArray(data)) {
          setVideos(data)
        } else if (data.error) {
          throw new Error(data.error)
        } else {
          throw new Error("Invalid response format")
        }
      } catch (err) {
        console.error("Error fetching videos:", err)
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [initialVideos])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-zinc-400">No videos available</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {videos.map((video) => (
        <VideoCard key={video.id.videoId} video={video} />
      ))}
    </div>
  )
}

