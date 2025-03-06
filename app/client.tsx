"use client"

import type React from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import SearchModal from "@/components/search-modal"
import MobileMenu from "@/components/mobile-menu"
import FloatingVideoPlayer from "@/components/floating-video-player"
import Script from "next/script"
import { useEffect } from "react"
import youtubeManager from "@/lib/youtube-manager"
import { usePathname } from "next/navigation"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Clean up any stray players when the route changes
  useEffect(() => {
    // Log active players for debugging
    youtubeManager.logActivePlayers()

    // This runs on every route change
    return () => {
      // We don't want to remove all players on every navigation,
      // as that would disrupt the floating player experience.
      // Instead, we'll rely on the component-level cleanup.
    }
  }, [])

  return (
    <html lang="en">
      <head>
        <Script src="https://www.youtube.com/iframe_api" strategy="beforeInteractive" />
      </head>
      <body className={`${inter.className} min-h-screen bg-background`}>
        <header className="border-b border-border py-4">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold neon-text">
                disclosure.cy
              </Link>
              <div className="flex items-center gap-6 md:gap-8">
                <nav className="hidden md:flex items-center gap-6 md:gap-8">
                  <Link href="/?scroll=videos" className="text-white hover:text-white neon-text" scroll={false}>
                    Library
                  </Link>
                  <Link href="/calendar" className="text-white hover:text-white neon-text">
                    Calendar
                  </Link>
                  <a
                    href="https://linktr.ee/disclosure.cy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-white neon-text"
                  >
                    Social
                  </a>
                  <Link href="/about" className="text-white hover:text-white neon-text">
                    About
                  </Link>
                  <Link href="/contact" className="text-white hover:text-white neon-text">
                    Contact
                  </Link>
                </nav>
                <div className="flex items-center gap-4">
                  <SearchModal>
                    <button className="text-white hover:text-primary transition-colors">
                      <Search className="h-5 w-5" />
                    </button>
                  </SearchModal>
                  <MobileMenu />
                </div>
              </div>
            </div>
          </div>
        </header>
        <main>{children}</main>
        <FloatingVideoPlayer />
      </body>
    </html>
  )
}

