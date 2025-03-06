import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import RootLayoutClient from "./root-layout-client"
import Cleanup from "./cleanup"
import YouTubeApiHandler from "./youtube-api"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "disclosure.cy",
  description: "Your go-to place for the best radio sets",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-background`}>
        <YouTubeApiHandler />
        <Cleanup />
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  )
}



import './globals.css'