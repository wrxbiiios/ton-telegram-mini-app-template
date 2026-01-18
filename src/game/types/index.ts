// Core Game Types

export interface Position {
  x: number;
  y: number;
}

export interface Vector2D {
  x: number;
  y: number;
}

export interface Player {
  id: string;
  position: Position;
  velocity: Vector2D;
  health: number;
  maxHealth: number;
  score: number;
  kills: number;
  deaths: number;
  level: number;
  xp: number;
  currentWeapon: WeaponType;
  rotation: number;
  isAlive: boolean;
  username: string;
  walletAddress?: string;
  nftCharacterId?: string;
  team?: 'red' | 'blue';
}

export enum WeaponType {
  PLASMA_RIFLE = 'plasma_rifle',
  SPREAD_SHOT = 'spread_shot',
  HOMING_MISSILE = 'homing_missile',
  ENERGY_BLADE = 'energy_blade',
  TESLA_COIL = 'tesla_coil',
  RAIL_GUN = 'rail_gun',
  GRENADE_LAUNCHER = 'grenade_launcher',
  FLAMETHROWER = 'flamethrower',
}

export interface Weapon {
  type: WeaponType;
  damage: number;
  fireRate: number;
  range: number;
  ammo: number;
  maxAmmo: number;
  isAutomatic: boolean;
  piercing?: boolean;
  aoeRadius?: number;
  special?: string;
}

export interface Bullet {
  id: string;
  position: Position;
  velocity: Vector2D;
  damage: number;
  ownerId: string;
  weaponType: WeaponType;
  createdAt: number;
  piercing?: boolean;
}

export enum EnemyType {
  MELEE = 'melee',
  RANGED = 'ranged',
  HEAVY = 'heavy',
  MINI_BOSS = 'mini_boss',
  BOSS = 'boss',
}

export interface Enemy {
  id: string;
  type: EnemyType;
  position: Position;
  velocity: Vector2D;
  health: number;
  maxHealth: number;
  damage: number;
  speed: number;
  targetId?: string;
  isAlive: boolean;
}

export enum PowerUpType {
  SHIELD = 'shield',
  AMMO_MULTIPLIER = 'ammo_multiplier',
  SPEED_BOOST = 'speed_boost',
  WEAPON_ROTATION = 'weapon_rotation',
  HEALTH = 'health',
}

export interface PowerUp {
  id: string;
  type: PowerUpType;
  position: Position;
  duration: number;
  collected: boolean;
}

export interface GameState {
  players: Map<string, Player>;
  enemies: Map<string, Enemy>;
  bullets: Map<string, Bullet>;
  powerUps: Map<string, PowerUp>;
  wave: number;
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
  timeElapsed: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  nftTokenId?: string;
}

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  username: string;
  score: number;
  kills: number;
  wave: number;
  timestamp: number;
  season?: number;
}

export interface NFTCharacter {
  tokenId: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  generation: number;
  stats: {
    healthBonus: number;
    damageBonus: number;
    speedBonus: number;
  };
  ownerAddress: string;
}

export interface NFTWeapon {
  tokenId: string;
  weaponType: WeaponType;
  level: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  stats: {
    damageMultiplier: number;
    fireRateBonus: number;
    specialAbility?: string;
  };
}

export interface GameRoom {
  id: string;
  name: string;
  hostId: string;
  players: string[];
  maxPlayers: number;
  gameMode: 'cooperative' | 'pvp' | 'ranked' | 'tournament';
  status: 'waiting' | 'in_progress' | 'finished';
  createdAt: number;
}
