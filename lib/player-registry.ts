class PlayerRegistry {
  private static instance: PlayerRegistry;
  private players: Map<string, HTMLIFrameElement> = new Map();
  private activePlayerId: string | null = null;
  private playbackStates: Map<string, { playing: boolean, time: number }> = new Map();

  private constructor() {}

  public static getInstance(): PlayerRegistry {
    if (!PlayerRegistry.instance) {
      PlayerRegistry.instance = new PlayerRegistry();
    }
    return PlayerRegistry.instance;
  }

  // Register a player and make it the active player
  public registerPlayer(id: string, iframe: HTMLIFrameElement): void {
    console.log(`Registering player: ${id}`);

    // If this is a new player, pause any existing active player
    if (this.activePlayerId && this.activePlayerId !== id) {
      this.pausePlayer(this.activePlayerId);
    }

    this.players.set(id, iframe);
    this.activePlayerId = id;

    // Initialize playback state if not already present
    if (!this.playbackStates.has(id)) {
      this.playbackStates.set(id, { playing: false, time: 0 });
    }

    console.log(`Active player is now: ${id}`);
    this.logPlayers();
  }

  // Pause a specific player
  public pausePlayer(id: string): void {
    const player = this.players.get(id);
    if (player) {
      try {
        // Try to pause by posting a message
        player.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "pauseVideo" }), "*");
        
        // Update playback state
        const state = this.playbackStates.get(id);
        if (state) {
          state.playing = false;
          // Request current time to update state
          player.contentWindow?.postMessage(JSON.stringify({ event: "getCurrentTime" }), "*");
        }
        
        console.log(`Paused player: ${id}`);
      } catch (e) {
        console.error(`Error pausing player ${id}:`, e);
      }
    }
  }

  // Update player's current time
  public updatePlayerTime(id: string, time: number): void {
    const state = this.playbackStates.get(id);
    if (state) {
      state.time = time;
    } else {
      this.playbackStates.set(id, { playing: false, time });
    }
  }

  // Remove a player from the registry
  public removePlayer(id: string): void {
    if (this.players.has(id)) {
      // Always make sure to stop the video before removing
      try {
        const player = this.players.get(id);
        if (player && player.contentWindow) {
          // Stop the video
          player.contentWindow.postMessage(JSON.stringify({ event: "command", func: "stopVideo" }), "*");
          // Clear the src attribute to truly stop all activity
          player.src = "";
        }
      } catch (e) {
        console.error(`Error stopping player ${id} before removal:`, e);
      }
      
      console.log(`Removing player: ${id}`);
      this.players.delete(id);

      // If this was the active player, clear the active player
      if (this.activePlayerId === id) {
        this.activePlayerId = null;
      }

      this.logPlayers();
    }
  }

  // Get the number of registered players
  public getPlayerCount(): number {
    return this.players.size;
  }

  // Log all registered players
  public logPlayers(): void {
    console.log(`Registered players (${this.players.size}):`);
    this.players.forEach((_, id) => {
      const state = this.playbackStates.get(id);
      console.log(
        `- ${id}${this.activePlayerId === id ? " (active)" : ""} - ${
          state ? `playing: ${state.playing}, time: ${state.time}` : "no state"
        }`
      );
    });
  }

  // Clean up all players
  public cleanupAllPlayers(): void {
    console.log("Cleaning up all players");
    this.players.forEach((player, id) => {
      try {
        // First send a stop command
        if (player.contentWindow) {
          player.contentWindow.postMessage(JSON.stringify({ event: "command", func: "stopVideo" }), "*");
        }
        // Then clear the src attribute to truly stop all activity
        player.src = "";
        console.log(`Cleaned up player: ${id}`);
      } catch (e) {
        console.error(`Error cleaning up player ${id}:`, e);
      }
    });
    this.players.clear();
    this.activePlayerId = null;
    // We keep playback states in case we need them later
  }
}

export default PlayerRegistry.getInstance();

