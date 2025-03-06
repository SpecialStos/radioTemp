"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import VideoTabs from "@/components/video-tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function HomePage() {
  const videoSectionRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()
  const shouldScrollToVideos = searchParams.get("scroll") === "videos"
  const [videos, setVideos] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  // Use a ref to track if videos have been loaded
  const hasLoadedVideosRef = useRef(false)

  useEffect(() => {
    if (shouldScrollToVideos && videoSectionRef.current) {
      videoSectionRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [shouldScrollToVideos])

  useEffect(() => {
    // Only fetch videos once
    if (!hasLoadedVideosRef.current) {
      hasLoadedVideosRef.current = true

      async function fetchVideos() {
        try {
          const res = await fetch("/api/youtube")
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
          }
          const data = await res.json()
          if (Array.isArray(data)) {
            setVideos(data)
          } else if (data.error) {
            throw new Error(data.error)
          } else {
            throw new Error("Unexpected data format")
          }
        } catch (e) {
          console.error("Error fetching videos:", e)
          setError(e.message)
        } finally {
          setLoading(false)
        }
      }

      fetchVideos()
    }
  }, [])

  return (
    <div>
      <div ref={videoSectionRef} className="container mx-auto px-4 md:px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>Failed to load videos: {error}. Please try again later.</AlertDescription>
          </Alert>
        ) : videos.length === 0 ? (
          <Alert>
            <AlertDescription>No videos available at the moment. Please check back later.</AlertDescription>
          </Alert>
        ) : (
          <VideoTabs videos={videos} />
        )}
      </div>
    </div>
  )
}

