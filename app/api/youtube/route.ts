import { NextResponse } from "next/server"
import redis from "@/lib/redis"

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const CHANNEL_ID = "UC9W4EPj5VNING6pTioZy5hg"
const CACHE_TTL = 3600
const MAX_RESULTS = 20

export async function GET() {
  console.log("API route called")

  if (!YOUTUBE_API_KEY) {
    console.error("YouTube API key is not set")
    return NextResponse.json({ error: "YouTube API key is not configured" }, { status: 500 })
  }

  try {
    // Try to get cached data first
    const cachedData = await redis.get("youtube_videos")
    if (cachedData && typeof cachedData === "string") {
      console.log("Found cached data")
      try {
        const parsedData = JSON.parse(cachedData)
        console.log("Successfully parsed cached data")
        return NextResponse.json(parsedData)
      } catch (parseError) {
        console.error("Error parsing cached data:", parseError)
        // Continue to fetch fresh data
      }
    }

    console.log("Fetching fresh data from YouTube API")
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=date&maxResults=${MAX_RESULTS}&type=video`

    const searchResponse = await fetch(searchUrl)

    if (!searchResponse.ok) {
      throw new Error(`YouTube search API error: ${searchResponse.status}`)
    }

    const searchData = await searchResponse.json()

    if (!searchData.items || !Array.isArray(searchData.items)) {
      console.warn("No videos found in the YouTube API response")
      return NextResponse.json([])
    }

    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(",")
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoIds}&part=snippet,statistics,contentDetails`
    const detailsResponse = await fetch(detailsUrl)

    if (!detailsResponse.ok) {
      throw new Error(`YouTube videos API error: ${detailsResponse.status}`)
    }

    const detailsData = await detailsResponse.json()

    const videos = searchData.items.map((searchItem: any) => {
      const details = detailsData.items.find((item: any) => item.id === searchItem.id.videoId)
      return {
        ...searchItem,
        statistics: details?.statistics || null,
        contentDetails: details?.contentDetails || null,
      }
    })

    // Cache the results as a string
    const videosString = JSON.stringify(videos)
    try {
      await redis.set("youtube_videos", videosString, {
        ex: CACHE_TTL,
      })
      console.log("Successfully cached video data")
    } catch (cacheError) {
      console.error("Error caching data:", cacheError)
    }

    return NextResponse.json(videos)
  } catch (error) {
    console.error("Error fetching YouTube data:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch YouTube data" },
      { status: 500 },
    )
  }
}

