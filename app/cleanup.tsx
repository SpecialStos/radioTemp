"use client"

import { useEffect } from "react"
import playerRegistry from "@/lib/player-registry"

export default function Cleanup() {
  useEffect(() => {
    // Log all players on mount
    playerRegistry.logPlayers()

    // Clean up all players when the component unmounts
    return () => {
      playerRegistry.cleanupAllPlayers()
    }
  }, [])

  return null
}

