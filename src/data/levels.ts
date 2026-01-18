import { Level } from '../types/level.types';
import { getBossByLevel } from './bosses';
import { getThemeByLevel } from './themes';

// Helper function to generate basic tilemap (20x12 grid)
const generateBasicTilemap = (complexity: number): string => {
  // 0 = empty, 1 = wall, 2 = cover
  const grid = Array(12).fill(0).map(() => Array(20).fill(0));
  
  // Add outer walls
  for (let i = 0; i < 20; i++) {
    grid[0][i] = 1;
    grid[11][i] = 1;
  }
  for (let i = 0; i < 12; i++) {
    grid[i][0] = 1;
    grid[i][19] = 1;
  }
  
  // Add some cover based on complexity
  const coverCount = Math.floor(complexity * 8);
  for (let i = 0; i < coverCount; i++) {
    const row = Math.floor(Math.random() * 10) + 1;
    const col = Math.floor(Math.random() * 18) + 1;
    if (grid[row][col] === 0) {
      grid[row][col] = 2;
    }
  }
  
  return grid.map(row => row.join('')).join('');
};

// Helper to determine difficulty
const getDifficulty = (level: number) => {
  if (level <= 10) return 'easy' as const;
  if (level <= 30) return 'medium' as const;
  if (level <= 50) return 'hard' as const;
  return 'nightmare' as const;
};

// Generate 60 levels
export const LEVELS: Level[] = Array.from({ length: 60 }, (_, index) => {
  const levelNumber = index + 1;
  const difficulty = getDifficulty(levelNumber);
  const theme = getThemeByLevel(levelNumber);
  const boss = getBossByLevel(levelNumber);
  const isBossLevel = boss !== undefined;
  
  // Wave configuration based on difficulty
  const getWaveConfig = () => {
    const baseEnemyCount = {
      easy: 3,
      medium: 6,
      hard: 10,
      nightmare: 15
    }[difficulty];
    
    const waveCount = isBossLevel ? 3 : {
      easy: 3,
      medium: 4,
      hard: 5,
      nightmare: 6
    }[difficulty];
    
    return Array.from({ length: waveCount }, (_, waveIndex) => ({
      wave: waveIndex + 1,
      enemyCount: Math.min(baseEnemyCount + waveIndex, 15), // Cap at 15 for mobile
      enemyTypes: (() => {
        if (difficulty === 'easy') return ['drone' as const];
        if (difficulty === 'medium') return ['drone' as const, 'trooper' as const];
        if (difficulty === 'hard') return ['drone' as const, 'trooper' as const, 'heavy' as const, 'sniper' as const];
        return ['drone' as const, 'trooper' as const, 'heavy' as const, 'sniper' as const, 'shield' as const, 'teleporter' as const];
      })(),
      hazards: theme.hazardTypes.slice(0, Math.min(waveIndex + 1, theme.hazardTypes.length)),
      timeLimit: difficulty === 'easy' ? 180 : difficulty === 'medium' ? 150 : difficulty === 'hard' ? 120 : 90
    }));
  };
  
  const level: Level = {
    id: `level_${levelNumber}`,
    name: isBossLevel ? boss.name : `${theme.name} - Stage ${levelNumber}`,
    description: isBossLevel ? boss.description : `Navigate through ${theme.name} and defeat all enemies`,
    theme: theme.id,
    difficulty,
    levelNumber,
    levelType: isBossLevel ? 'boss' : 'story',
    
    tilemap: generateBasicTilemap(levelNumber / 60),
    mapSize: { width: 375, height: 600 },
    gridSize: { cols: 20, rows: 12 },
    
    waves: getWaveConfig(),
    boss: boss || undefined,
    
    spawns: [
      { x: 50, y: 100 },
      { x: 325, y: 100 },
      { x: 50, y: 500 },
      { x: 325, y: 500 },
      { x: 187, y: 300 }
    ],
    
    collectibles: Array.from({ length: difficulty === 'easy' ? 5 : difficulty === 'medium' ? 3 : 2 }, (_, i) => ({
      type: i % 2 === 0 ? 'ammo' as const : 'health' as const,
      position: {
        x: 50 + (i * 60),
        y: 150 + (i * 80)
      },
      value: difficulty === 'easy' ? 50 : difficulty === 'medium' ? 30 : 20
    })),
    
    hazards: theme.hazardTypes.slice(0, Math.min(levelNumber / 10, 3)).map((type, i) => ({
      type,
      position: { x: 100 + (i * 100), y: 200 + (i * 100) },
      size: { width: 40, height: 40 },
      damage: 10
    })),
    
    interactiveElements: [],
    
    unlockRequirement: levelNumber === 1 ? undefined : `level_${levelNumber - 1}`,
    
    starRequirements: {
      oneStarTime: 300,
      twoStarTime: 180,
      threeStarTime: 120,
      oneStarHealth: 50,
      twoStarHealth: 75,
      threeStarHealth: 90
    },
    
    modifiers: [],
    
    rewards: {
      baseXp: levelNumber * 100,
      baseTokens: levelNumber * 10,
      bonusRewards: isBossLevel ? [
        { type: 'rare_item', value: 1 },
        { type: 'nft_fragment', value: boss!.rewards.nftChance }
      ] : []
    }
  };
  
  return level;
});

export const getLevelById = (id: string): Level | undefined => {
  return LEVELS.find(level => level.id === id);
};

export const getLevelByNumber = (levelNumber: number): Level | undefined => {
  return LEVELS.find(level => level.levelNumber === levelNumber);
};

export const getLevelsByDifficulty = (difficulty: string) => {
  return LEVELS.filter(level => level.difficulty === difficulty);
};

export const getLevelsByTheme = (themeId: string) => {
  return LEVELS.filter(level => level.theme === themeId);
};

export const getBossLevels = () => {
  return LEVELS.filter(level => level.boss !== undefined);
};
