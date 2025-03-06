import { NextResponse } from "next/server"
import redis from "@/lib/redis"

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const CACHE_TTL = 3600

export async function GET(request: Request, { params }: { params: { id: string } }) {
  if (!YOUTUBE_API_KEY) {
    return NextResponse.json({ error: "YouTube API key is not configured" }, { status: 500 })
  }

  const videoId = params.id

  try {
    // Try to get cached data first
    const cacheKey = `youtube_video_${videoId}`
    const cachedData = await redis.get(cacheKey)
    if (cachedData && typeof cachedData === "string") {
      console.log("Found cached video data")
      try {
        const parsedData = JSON.parse(cachedData)
        console.log("Successfully parsed cached video data")
        return NextResponse.json(parsedData)
      } catch (parseError) {
        console.error("Error parsing cached video data:", parseError)
      }
    }

    console.log(`Fetching fresh data for video ${videoId}`)
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoId}&part=snippet,statistics`,
    )

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    const videoData = data.items[0]
    const videoString = JSON.stringify(videoData)

    try {
      await redis.set(cacheKey, videoString, {
        ex: CACHE_TTL,
      })
      console.log("Successfully cached video data")
    } catch (cacheError) {
      console.error("Error caching video data:", cacheError)
    }

    return NextResponse.json(videoData)
  } catch (error) {
    console.error("Error fetching video details:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch video details" },
      { status: 500 },
    )
  }
}

