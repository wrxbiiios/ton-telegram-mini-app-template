// Core Level System Type Definitions

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'nightmare';

export type ThemeType = 
  | 'neon_downtown' 
  | 'industrial_complex' 
  | 'underground_bunker' 
  | 'skyrise_tower' 
  | 'void_station' 
  | 'corrupted_wasteland' 
  | 'nightmare_realm';

export type EnemyType = 
  | 'drone' 
  | 'trooper' 
  | 'heavy' 
  | 'sniper' 
  | 'shield' 
  | 'teleporter' 
  | 'mini_boss';

export type HazardType = 
  | 'lava_pit' 
  | 'toxic_gas' 
  | 'electrical_field' 
  | 'spike_trap' 
  | 'moving_platform' 
  | 'falling_debris' 
  | 'wind_zone' 
  | 'freezing_area';

export type InteractiveElementType = 
  | 'destructible_wall' 
  | 'pressure_plate' 
  | 'conveyor_belt' 
  | 'elevator' 
  | 'force_field' 
  | 'light_bridge' 
  | 'teleporter' 
  | 'vending_machine';

export type BossType = 
  | 'neon_overlord' 
  | 'iron_sentinel' 
  | 'quantum_entity' 
  | 'sky_leviathan' 
  | 'void_abomination' 
  | 'corrupted_god';

export type LevelModifier = 
  | 'double_spawns' 
  | 'armored_enemies' 
  | 'faster_enemies' 
  | 'floating_enemies' 
  | 'invisible_enemies' 
  | 'chain_explosion' 
  | 'no_ammo' 
  | 'limited_vision' 
  | 'slow_motion' 
  | 'fast_forward' 
  | 'gravity_changes' 
  | 'mirror_mode' 
  | 'double_xp' 
  | 'token_bonus' 
  | 'rare_drop_boost' 
  | 'streak_multiplier';

export type LevelType = 'story' | 'challenge' | 'daily' | 'weekly' | 'endless' | 'boss';

export type ChallengeType = 
  | 'time_attack' 
  | 'survival_gauntlet' 
  | 'pacifist_mode' 
  | 'one_hit_challenge' 
  | 'inverted' 
  | 'mirror_mode' 
  | 'speedrun_mode';

export interface Position {
  x: number;
  y: number;
}

export interface Hazard {
  type: HazardType;
  position: Position;
  size: { width: number; height: number };
  damage?: number;
  effect?: string;
  duration?: number;
}

export interface InteractiveElement {
  type: InteractiveElementType;
  position: Position;
  size: { width: number; height: number };
  activated?: boolean;
  effect?: string;
}

export interface EnemySpawn {
  type: EnemyType;
  count: number;
  position?: Position;
  spawnDelay?: number;
}

export interface Wave {
  wave: number;
  enemyCount: number;
  enemyTypes: EnemyType[];
  enemySpawns?: EnemySpawn[];
  hazards: HazardType[];
  modifiers?: LevelModifier[];
  timeLimit?: number;
}

export interface Collectible {
  type: 'ammo' | 'health' | 'power_up' | 'token' | 'nft_fragment';
  position: Position;
  value?: number;
}

export interface BossPhase {
  phase: number;
  healthPercentage: number;
  attackPatterns: string[];
  spawnMinions?: EnemyType[];
  hazards?: HazardType[];
}

export interface Boss {
  type: BossType;
  name: string;
  description: string;
  health: number;
  phases: BossPhase[];
  weakPoints?: Position[];
  rewards: {
    xp: number;
    tokens: number;
    nftChance: number;
  };
}

export interface Level {
  id: string;
  name: string;
  description: string;
  theme: ThemeType;
  difficulty: DifficultyLevel;
  levelNumber: number;
  levelType: LevelType;
  challengeType?: ChallengeType;
  
  // Map configuration
  tilemap: string; // 1D string representation of the map
  mapSize: { width: number; height: number };
  gridSize: { cols: number; rows: number };
  
  // Gameplay
  waves: Wave[];
  boss?: Boss;
  spawns: Position[];
  collectibles: Collectible[];
  hazards: Hazard[];
  interactiveElements: InteractiveElement[];
  
  // Meta
  unlockRequirement?: string;
  starRequirements: {
    oneStarTime?: number;
    twoStarTime?: number;
    threeStarTime?: number;
    oneStarHealth?: number;
    twoStarHealth?: number;
    threeStarHealth?: number;
  };
  modifiers?: LevelModifier[];
  
  // Rewards
  rewards: {
    baseXp: number;
    baseTokens: number;
    bonusRewards?: Array<{ type: string; value: number }>;
  };
}

export interface Theme {
  id: ThemeType;
  name: string;
  description: string;
  levelRange: { min: number; max: number };
  visualStyle: {
    backgroundColor: string;
    primaryColor: string;
    accentColor: string;
    ambientEffects: string[];
  };
  uniqueFeatures: string[];
  hazardTypes: HazardType[];
}

export interface ProceduralConfig {
  seed: number;
  difficulty: DifficultyLevel;
  theme: ThemeType;
  arenaSize: 'tight' | 'medium' | 'open';
  obstacleDensity: number; // 0-1
  hazardDensity: number; // 0-1
  enemyDensity: number; // 0-1
  resourceDensity: number; // 0-1
}

export interface PlayerProgress {
  currentLevel: number;
  maxLevelReached: number;
  starsEarned: number;
  levelsCompleted: number[];
  levelStars: { [levelId: string]: number };
  prestigeLevel: number;
  prestigePoints: number;
}

export interface Leaderboard {
  levelId: string;
  entries: LeaderboardEntry[];
}

export interface LeaderboardEntry {
  playerId: string;
  playerName: string;
  score: number;
  time: number;
  stars: number;
  rank: number;
  timestamp: number;
}

export interface DailyChallenge {
  date: string;
  seed: number;
  level: Level;
  modifiers: LevelModifier[];
  leaderboard: Leaderboard;
}
