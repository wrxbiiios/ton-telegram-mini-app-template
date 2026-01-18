export interface Player {
  id: string;
  x: number;
  y: number;
  rotation: number;
  health: number;
  score: number;
  username?: string;
}

export interface Enemy {
  id: string;
  x: number;
  y: number;
  health: number;
  type: string;
}

export interface Bullet {
  id: string;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  ownerId: string;
}

export interface GameState {
  score: number;
  health: number;
  wave: number;
  playerPosition: { x: number; y: number };
}

export interface NFTUpgrade {
  id: string;
  type: 'weapon' | 'armor' | 'ability' | 'cosmetic';
  name: string;
  description: string;
  bonus: {
    damage?: number;
    fireRate?: number;
    health?: number;
    speed?: number;
    shield?: number;
  };
  imageUrl?: string;
}

export interface GameMode {
  type: 'team-deathmatch' | 'free-for-all' | 'wave-survival';
  maxPlayers: number;
}

export interface LeaderboardEntry {
  username: string;
  score: number;
  wave: number;
  timestamp: number;
}
