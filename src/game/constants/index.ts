// Game Constants

export const GAME_CONFIG = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  FPS: 60,
  TICK_RATE: 1000 / 60,
};

export const PLAYER_CONFIG = {
  SPEED: 5,
  MAX_HEALTH: 100,
  STARTING_LEVEL: 1,
  COLLISION_RADIUS: 20,
};

export const WEAPON_STATS = {
  plasma_rifle: {
    damage: 10,
    fireRate: 200,
    range: 500,
    maxAmmo: 100,
    isAutomatic: true,
  },
  spread_shot: {
    damage: 8,
    fireRate: 500,
    range: 300,
    maxAmmo: 50,
    isAutomatic: false,
  },
  homing_missile: {
    damage: 25,
    fireRate: 1000,
    range: 600,
    maxAmmo: 20,
    isAutomatic: false,
  },
  energy_blade: {
    damage: 30,
    fireRate: 300,
    range: 50,
    maxAmmo: Infinity,
    isAutomatic: false,
  },
  tesla_coil: {
    damage: 15,
    fireRate: 100,
    range: 200,
    maxAmmo: 80,
    isAutomatic: true,
    aoeRadius: 100,
  },
  rail_gun: {
    damage: 50,
    fireRate: 2000,
    range: 800,
    maxAmmo: 10,
    isAutomatic: false,
    piercing: true,
  },
  grenade_launcher: {
    damage: 40,
    fireRate: 1500,
    range: 400,
    maxAmmo: 15,
    isAutomatic: false,
    aoeRadius: 80,
  },
  flamethrower: {
    damage: 5,
    fireRate: 50,
    range: 150,
    maxAmmo: 200,
    isAutomatic: true,
  },
};

export const ENEMY_STATS = {
  melee: {
    health: 30,
    damage: 10,
    speed: 3,
  },
  ranged: {
    health: 20,
    damage: 8,
    speed: 2,
  },
  heavy: {
    health: 60,
    damage: 15,
    speed: 1.5,
  },
  mini_boss: {
    health: 200,
    damage: 20,
    speed: 2.5,
  },
  boss: {
    health: 500,
    damage: 30,
    speed: 2,
  },
};

export const POWER_UP_DURATION = {
  shield: 10000,
  ammo_multiplier: 15000,
  speed_boost: 8000,
  weapon_rotation: 20000,
  health: 0, // instant
};

export const XP_PER_LEVEL = 100;
export const WAVE_ENEMY_MULTIPLIER = 1.2;
export const BOSS_WAVE_INTERVAL = 5;
