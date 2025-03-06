import { Youtube, Music2, Calendar, ExternalLink, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import SecurityWarning from "./security-warning"
import YouTubeEmbed from "./youtube-embed"

export default function Page() {
  return (
    <div className="min-h-screen bg-zinc-900">
      <header className="border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-zinc-100">disclosure.cy</h1>
            <nav className="hidden md:flex items-center gap-4">
              <Button variant="ghost" className="text-zinc-400 hover:text-zinc-100">
                Latest Sets
              </Button>
              <Button variant="ghost" className="text-zinc-400 hover:text-zinc-100">
                Artists
              </Button>
              <Button variant="ghost" className="text-zinc-400 hover:text-zinc-100">
                Events
              </Button>
              <a
                href="https://www.youtube.com/@disclosurecy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-zinc-400 hover:text-zinc-100"
              >
                YouTube Channel <ExternalLink className="h-4 w-4" />
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="pb-8">
        <SecurityWarning />

        <section className="mb-12">
          <div className="aspect-video w-full bg-zinc-900">
            <YouTubeEmbed videoId="ziX_YN1-1Yo" />
          </div>
          <div className="container mx-auto px-4 mt-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-zinc-100">Featured Artist - Disclosure.cy</h1>
                <div className="mt-2 flex items-center gap-4 text-sm text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Latest Upload
                  </span>
                  <span className="flex items-center gap-1">
                    <Music2 className="h-4 w-4" />
                    8.3K views
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="ghost">
                  <ExternalLink className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-lime-500/10 text-lime-500 hover:bg-lime-500/20">
                Techno
              </Badge>
              <Badge variant="secondary" className="bg-lime-500/10 text-lime-500 hover:bg-lime-500/20">
                Electro
              </Badge>
              <Badge variant="secondary" className="bg-lime-500/10 text-lime-500 hover:bg-lime-500/20">
                Breaks
              </Badge>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-zinc-100 mb-4">Recent Sets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <VideoCard
              title="Mechatronica"
              date="Oct 03, 2024"
              views="5,395"
              thumbnail="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-eON4Ip6BaSP4QOywRyzo3C50Ydcgh0.png"
              youtubeId="example1"
              genres={["Electro", "Breaks", "EBM"]}
            />
            <VideoCard
              title="MILITSA"
              date="Feb 25, 2025"
              views="2,432"
              thumbnail="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4XY4g66Q6CSaKV5TYRl4NZTqt4Iv6R.png"
              youtubeId="example2"
              genres={["Techno", "EBM"]}
            />
            <VideoCard
              title="Commissar Lag"
              date="Feb 25, 2025"
              views="2,035"
              thumbnail="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4XY4g66Q6CSaKV5TYRl4NZTqt4Iv6R.png"
              youtubeId="example3"
              genres={["Breaks", "Electro"]}
            />
            <VideoCard
              title="Furotica"
              date="Feb 25, 2025"
              views="1,002"
              thumbnail="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-QCylch8HddQV6aCQxtIE9Z3EI4Tqxj.png"
              youtubeId="example4"
              genres={["Techno", "Electro"]}
            />
          </div>
        </section>
      </main>
    </div>
  )
}

function VideoCard({
  title,
  date,
  views,
  thumbnail,
  youtubeId,
  genres,
}: {
  title: string
  date: string
  views: string
  thumbnail: string
  youtubeId: string
  genres: string[]
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
        <div className="mt-2 flex flex-wrap gap-1">
          {genres.map((genre) => (
            <Badge key={genre} variant="secondary" className="text-xs bg-zinc-700/50 text-zinc-300">
              {genre}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

