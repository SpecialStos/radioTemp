// Global registry to track all YouTube players
class PlayerRegistry {
  private static instance: PlayerRegistry
  private players: Map<string, HTMLIFrameElement> = new Map()
  private activePlayerId: string | null = null

  private constructor() {}

  public static getInstance(): PlayerRegistry {
    if (!PlayerRegistry.instance) {
      PlayerRegistry.instance = new PlayerRegistry()
    }
    return PlayerRegistry.instance
  }

  // Register a player and make it the active player
  public registerPlayer(id: string, iframe: HTMLIFrameElement): void {
    console.log(`Registering player: ${id}`)

    // If this is a new player, pause any existing active player
    if (this.activePlayerId && this.activePlayerId !== id) {
      this.pausePlayer(this.activePlayerId)
    }

    this.players.set(id, iframe)
    this.activePlayerId = id

    console.log(`Active player is now: ${id}`)
    this.logPlayers()
  }

  // Pause a specific player
  public pausePlayer(id: string): void {
    const player = this.players.get(id)
    if (player) {
      try {
        // Try to pause by posting a message
        player.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "pauseVideo" }), "*")
        console.log(`Paused player: ${id}`)
      } catch (e) {
        console.error(`Error pausing player ${id}:`, e)
      }
    }
  }

  // Remove a player from the registry
  public removePlayer(id: string): void {
    if (this.players.has(id)) {
      console.log(`Removing player: ${id}`)
      this.players.delete(id)

      // If this was the active player, clear the active player
      if (this.activePlayerId === id) {
        this.activePlayerId = null
      }

      this.logPlayers()
    }
  }

  // Get the number of registered players
  public getPlayerCount(): number {
    return this.players.size
  }

  // Log all registered players
  public logPlayers(): void {
    console.log(`Registered players (${this.players.size}):`)
    this.players.forEach((_, id) => {
      console.log(`- ${id}${this.activePlayerId === id ? " (active)" : ""}`)
    })
  }

  // Clean up all players
  public cleanupAllPlayers(): void {
    console.log("Cleaning up all players")
    this.players.forEach((player, id) => {
      try {
        // Try to stop the video by setting src to empty
        player.src = ""
        console.log(`Cleaned up player: ${id}`)
      } catch (e) {
        console.error(`Error cleaning up player ${id}:`, e)
      }
    })
    this.players.clear()
    this.activePlayerId = null
  }
}

export default PlayerRegistry.getInstance()

