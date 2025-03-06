import VideoTabs from "@/components/video-tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

async function getVideos() {
  try {
    const res = await fetch(`https://disclosure.cy/api/youtube`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`)
    }
    return res.json()
  } catch (error) {
    console.error("Failed to fetch videos:", error)
    return null
  }
}

export default async function LibraryPage() {
  const videos = await getVideos()

  return (
    <div className="container mx-auto px-4 md:px-8 py-8">
      <h1 className="text-3xl font-bold text-zinc-100">Full Library</h1>
      {videos === null ? (
        <Alert variant="destructive">
          <AlertDescription>Failed to load videos. Please try again later.</AlertDescription>
        </Alert>
      ) : (
        <VideoTabs videos={videos} />
      )}
    </div>
  )
}

