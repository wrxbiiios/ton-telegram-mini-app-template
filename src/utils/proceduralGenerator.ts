import { Level, ProceduralConfig, Position, Hazard, Collectible } from '../types/level.types';
import { getThemeByLevel, THEMES } from '../data/themes';

// Seeded random number generator for deterministic generation
// Uses Linear Congruential Generator (LCG) algorithm
// Parameters chosen for good distribution: Park and Miller "minimal standard"
class SeededRandom {
  private seed: number;
  
  constructor(seed: number) {
    this.seed = seed;
  }
  
  next(): number {
    // LCG formula: seed = (a * seed + c) % m
    // a = 9301, c = 49297, m = 233280 (commonly used LCG parameters)
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
  
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
  
  nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }
  
  chance(probability: number): boolean {
    return this.next() < probability;
  }
}

// Generate a procedural tilemap
function generateTilemap(config: ProceduralConfig, random: SeededRandom): string {
  const cols = 20;
  const rows = 12;
  const grid: number[][] = Array(rows).fill(0).map(() => Array(cols).fill(0));
  
  // Add outer walls
  for (let i = 0; i < cols; i++) {
    grid[0][i] = 1;
    grid[rows - 1][i] = 1;
  }
  for (let i = 0; i < rows; i++) {
    grid[i][0] = 1;
    grid[i][cols - 1] = 1;
  }
  
  // Add internal obstacles based on density
  const obstacleCount = Math.floor(config.obstacleDensity * 20); // Max 20 for mobile
  for (let i = 0; i < obstacleCount; i++) {
    const row = random.nextInt(2, rows - 3);
    const col = random.nextInt(2, cols - 3);
    
    // Avoid blocking too much space
    if (grid[row][col] === 0 && grid[row + 1][col] === 0) {
      grid[row][col] = 2; // Cover/obstacle
    }
  }
  
  // Ensure safe spawn areas (corners)
  const safeZones = [
    [1, 1], [1, 2], [2, 1],
    [1, cols - 2], [1, cols - 3], [2, cols - 2],
    [rows - 2, 1], [rows - 2, 2], [rows - 3, 1],
    [rows - 2, cols - 2], [rows - 2, cols - 3], [rows - 3, cols - 2]
  ];
  
  safeZones.forEach(([row, col]) => {
    grid[row][col] = 0;
  });
  
  return grid.map(row => row.join('')).join('');
}

// Generate spawn points distributed across the map
function generateSpawnPoints(config: ProceduralConfig, random: SeededRandom): Position[] {
  const spawnCount = config.arenaSize === 'tight' ? 3 : config.arenaSize === 'medium' ? 5 : 7;
  const spawns: Position[] = [];
  const cellWidth = 375 / 20;
  const cellHeight = 600 / 12;
  
  for (let i = 0; i < spawnCount; i++) {
    spawns.push({
      x: random.nextInt(2, 18) * cellWidth,
      y: random.nextInt(2, 10) * cellHeight
    });
  }
  
  return spawns;
}

// Generate hazards based on theme and density
function generateHazards(config: ProceduralConfig, random: SeededRandom): Hazard[] {
  const theme = THEMES[config.theme];
  const hazardCount = Math.floor(config.hazardDensity * 8); // Reasonable amount
  const hazards: Hazard[] = [];
  
  for (let i = 0; i < hazardCount; i++) {
    const hazardType = theme.hazardTypes[random.nextInt(0, theme.hazardTypes.length - 1)];
    hazards.push({
      type: hazardType,
      position: {
        x: random.nextInt(50, 325),
        y: random.nextInt(100, 500)
      },
      size: { width: 40, height: 40 },
      damage: config.difficulty === 'easy' ? 5 : config.difficulty === 'medium' ? 10 : config.difficulty === 'hard' ? 15 : 20
    });
  }
  
  return hazards;
}

// Generate collectibles
function generateCollectibles(config: ProceduralConfig, random: SeededRandom): Collectible[] {
  const collectibleCount = Math.floor(config.resourceDensity * 10);
  const collectibles: Collectible[] = [];
  
  for (let i = 0; i < collectibleCount; i++) {
    const types: Array<'ammo' | 'health' | 'power_up' | 'token'> = ['ammo', 'health', 'power_up', 'token'];
    const type = types[random.nextInt(0, types.length - 1)];
    
    collectibles.push({
      type,
      position: {
        x: random.nextInt(50, 325),
        y: random.nextInt(100, 500)
      },
      value: type === 'ammo' ? 50 : type === 'health' ? 25 : type === 'power_up' ? 1 : 10
    });
  }
  
  return collectibles;
}

// Generate waves based on difficulty
function generateWaves(config: ProceduralConfig, random: SeededRandom) {
  const waveCount = config.difficulty === 'easy' ? 3 : config.difficulty === 'medium' ? 4 : config.difficulty === 'hard' ? 5 : 6;
  const baseEnemyCount = config.difficulty === 'easy' ? 3 : config.difficulty === 'medium' ? 6 : config.difficulty === 'hard' ? 10 : 15;
  
  const waves = [];
  const theme = THEMES[config.theme];
  
  for (let i = 0; i < waveCount; i++) {
    const enemyTypes = (() => {
      if (config.difficulty === 'easy') return ['drone' as const];
      if (config.difficulty === 'medium') return ['drone' as const, 'trooper' as const];
      if (config.difficulty === 'hard') return ['drone' as const, 'trooper' as const, 'heavy' as const, 'sniper' as const];
      return ['drone' as const, 'trooper' as const, 'heavy' as const, 'sniper' as const, 'shield' as const, 'teleporter' as const];
    })();
    
    waves.push({
      wave: i + 1,
      enemyCount: Math.min(baseEnemyCount + i, 15),
      enemyTypes,
      hazards: theme.hazardTypes.slice(0, Math.min(i + 1, 3)),
      timeLimit: config.difficulty === 'easy' ? 180 : config.difficulty === 'medium' ? 150 : config.difficulty === 'hard' ? 120 : 90
    });
  }
  
  return waves;
}

// Main procedural level generator
export function generateProceduralLevel(config: ProceduralConfig): Level {
  const random = new SeededRandom(config.seed);
  const theme = THEMES[config.theme];
  
  const level: Level = {
    id: `procedural_${config.seed}`,
    name: `Procedural: ${theme.name}`,
    description: `Randomly generated ${theme.name} level (Seed: ${config.seed})`,
    theme: config.theme,
    difficulty: config.difficulty,
    levelNumber: 0, // Procedural levels don't have fixed numbers
    levelType: 'challenge',
    
    tilemap: generateTilemap(config, random),
    mapSize: { width: 375, height: 600 },
    gridSize: { cols: 20, rows: 12 },
    
    waves: generateWaves(config, random),
    spawns: generateSpawnPoints(config, random),
    collectibles: generateCollectibles(config, random),
    hazards: generateHazards(config, random),
    interactiveElements: [],
    
    starRequirements: {
      oneStarTime: 300,
      twoStarTime: 180,
      threeStarTime: 120,
      oneStarHealth: 50,
      twoStarHealth: 75,
      threeStarHealth: 90
    },
    
    rewards: {
      baseXp: config.difficulty === 'easy' ? 500 : config.difficulty === 'medium' ? 1000 : config.difficulty === 'hard' ? 2000 : 5000,
      baseTokens: config.difficulty === 'easy' ? 50 : config.difficulty === 'medium' ? 100 : config.difficulty === 'hard' ? 200 : 500
    }
  };
  
  return level;
}

// Generate daily challenge (same seed for all players on a given day)
export function generateDailyChallenge(date: Date): Level {
  // Create seed from date (YYYYMMDD format)
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const seed = parseInt(dateStr);
  
  const random = new SeededRandom(seed);
  const themes = Object.keys(THEMES) as Array<keyof typeof THEMES>;
  const theme = themes[random.nextInt(0, themes.length - 1)];
  
  const config: ProceduralConfig = {
    seed,
    difficulty: 'medium',
    theme,
    arenaSize: 'medium',
    obstacleDensity: 0.3,
    hazardDensity: 0.4,
    enemyDensity: 0.6,
    resourceDensity: 0.5
  };
  
  const level = generateProceduralLevel(config);
  level.id = `daily_${dateStr}`;
  level.name = `Daily Challenge: ${THEMES[theme].name}`;
  level.levelType = 'daily';
  
  return level;
}

// Generate weekly challenge (harder than daily)
export function generateWeeklyChallenge(weekNumber: number, year: number): Level {
  const seed = year * 100 + weekNumber;
  const random = new SeededRandom(seed);
  const themes = Object.keys(THEMES) as Array<keyof typeof THEMES>;
  const theme = themes[random.nextInt(0, themes.length - 1)];
  
  const config: ProceduralConfig = {
    seed,
    difficulty: 'hard',
    theme,
    arenaSize: 'tight',
    obstacleDensity: 0.5,
    hazardDensity: 0.6,
    enemyDensity: 0.8,
    resourceDensity: 0.3
  };
  
  const level = generateProceduralLevel(config);
  level.id = `weekly_${year}_${weekNumber}`;
  level.name = `Weekly Challenge: ${THEMES[theme].name}`;
  level.levelType = 'weekly';
  
  return level;
}

// Helper to get current week number
export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
