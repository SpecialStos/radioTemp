"use client"

import { useEffect } from "react"
import playerRegistry from "@/lib/player-registry"

export default function Cleanup() {
  useEffect(() => {
    // This runs only on initial mount
    console.log("Cleanup component mounted");
    
    // When the page is about to unload (refresh/close), clean up all players
    const handleBeforeUnload = () => {
      console.log("Page is being unloaded, cleaning up all players");
      playerRegistry.cleanupAllPlayers();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Additionally, let's clean up all players on mount to handle the case
    // where the page was refreshed and there might be ghost players
    playerRegistry.cleanupAllPlayers();
    
    // Log all players on mount
    playerRegistry.logPlayers();

    // Clean up on unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      playerRegistry.cleanupAllPlayers();
    }
  }, []);

  return null;
}

