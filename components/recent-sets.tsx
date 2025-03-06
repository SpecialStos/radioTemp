import { Youtube, Music2, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

async function getVideos() {
  try {
    const res = await fetch("/api/youtube")
    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`Failed to fetch data: ${res.status} ${errorText}`)
    }
    const data = await res.json()
    if (data.error) {
      throw new Error(data.error)
    }
    if (!Array.isArray(data)) {
      console.error("Unexpected data format:", data)
      throw new Error(`Unexpected data format: ${JSON.stringify(data)}`)
    }
    return data
  } catch (error) {
    console.error("Error fetching videos:", error)
    throw error
  }
}

export default async function RecentSets() {
  let videos = []
  let error = null

  try {
    videos = await getVideos()
  } catch (e) {
    error = e.message
  }

  if (error) {
    return (
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-zinc-100 mb-4">Recent Sets</h2>
        <p className="text-red-500">Error loading videos: {error}</p>
        <p className="text-zinc-400 mt-2">
          There was an issue fetching the videos. Please try again later or contact support if the problem persists.
        </p>
      </section>
    )
  }

  if (videos.length === 0) {
    return (
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-zinc-100 mb-4">Recent Sets</h2>
        <p className="text-zinc-400">No videos available at the moment.</p>
      </section>
    )
  }

  return (
    <section className="container mx-auto px-4">
      <h2 className="text-2xl font-bold text-zinc-100 mb-4">Recent Sets</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {videos.map((video: any) => (
          <VideoCard
            key={video.id.videoId}
            title={video.snippet.title}
            date={new Date(video.snippet.publishedAt).toLocaleDateString()}
            views={video.statistics?.viewCount || "N/A"}
            duration={formatDuration(video.contentDetails?.duration)}
            thumbnail={video.snippet.thumbnails.medium.url}
            youtubeId={video.id.videoId}
          />
        ))}
      </div>
    </section>
  )
}

function VideoCard({
  title,
  date,
  views,
  duration,
  thumbnail,
  youtubeId,
}: {
  title: string
  date: string
  views: string
  duration: string
  thumbnail: string
  youtubeId: string
}) {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-zinc-800/50 transition-colors hover:bg-zinc-800">
      <div className="aspect-video relative">
        <img
          src={thumbnail || "/placeholder.svg"}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <a
          href={`https://www.youtube.com/watch?v=${youtubeId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex items-center justify-center"
        >
          <Button size="icon" className="h-12 w-12 rounded-full opacity-0 transition-opacity group-hover:opacity-100">
            <Youtube className="h-6 w-6" />
          </Button>
        </a>
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1 rounded">{duration}</div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-zinc-100 line-clamp-2">{title}</h3>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {date}
          </span>
          <span className="flex items-center gap-1">
            <Music2 className="h-3 w-3" />
            {views} views
          </span>
        </div>
      </div>
    </div>
  )
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

