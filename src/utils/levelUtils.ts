import { Level, PlayerProgress, DifficultyLevel } from '../types/level.types';
import { LEVELS } from '../data/levels';

// Level unlocking logic
export function isLevelUnlocked(level: Level, progress: PlayerProgress): boolean {
  if (!level.unlockRequirement) return true;
  
  const requiredLevelId = level.unlockRequirement;
  return progress.levelsCompleted.includes(parseInt(requiredLevelId.replace('level_', '')));
}

// Get all unlocked levels for a player
export function getUnlockedLevels(progress: PlayerProgress): Level[] {
  return LEVELS.filter(level => isLevelUnlocked(level, progress));
}

// Calculate stars earned based on performance
export function calculateStars(level: Level, completionTime: number, healthRemaining: number): number {
  let stars = 1; // Completed the level
  
  // Check time-based star requirements
  if (level.starRequirements.threeStarTime && completionTime <= level.starRequirements.threeStarTime) {
    stars = 3;
  } else if (level.starRequirements.twoStarTime && completionTime <= level.starRequirements.twoStarTime) {
    stars = Math.max(stars, 2);
  }
  
  // Check health-based star requirements
  if (level.starRequirements.threeStarHealth && healthRemaining >= level.starRequirements.threeStarHealth) {
    stars = 3;
  } else if (level.starRequirements.twoStarHealth && healthRemaining >= level.starRequirements.twoStarHealth) {
    stars = Math.max(stars, 2);
  }
  
  return stars;
}

// Update player progress after completing a level
export function updateProgressAfterLevel(
  progress: PlayerProgress,
  levelNumber: number,
  stars: number
): PlayerProgress {
  const newProgress = { ...progress };
  
  // Add to completed levels if not already there
  if (!newProgress.levelsCompleted.includes(levelNumber)) {
    newProgress.levelsCompleted.push(levelNumber);
  }
  
  // Update max level reached
  if (levelNumber > newProgress.maxLevelReached) {
    newProgress.maxLevelReached = levelNumber;
    newProgress.currentLevel = levelNumber + 1;
  }
  
  // Update stars (only if better than before)
  const levelId = `level_${levelNumber}`;
  const currentStars = newProgress.levelStars[levelId] || 0;
  if (stars > currentStars) {
    newProgress.levelStars[levelId] = stars;
    newProgress.starsEarned += (stars - currentStars);
  }
  
  return newProgress;
}

// Check if player should prestige
export function canPrestige(progress: PlayerProgress): boolean {
  return progress.maxLevelReached >= 60; // Completed all levels
}

// Apply prestige (reset progress but keep prestige bonuses)
export function applyPrestige(progress: PlayerProgress): PlayerProgress {
  return {
    currentLevel: 1,
    maxLevelReached: 0,
    starsEarned: 0,
    levelsCompleted: [],
    levelStars: {},
    prestigeLevel: progress.prestigeLevel + 1,
    prestigePoints: progress.prestigePoints + Math.floor(progress.starsEarned / 10)
  };
}

// Get recommended level for player
export function getRecommendedLevel(progress: PlayerProgress): Level | undefined {
  return LEVELS.find(level => level.levelNumber === progress.currentLevel);
}

// Filter levels by difficulty
export function filterLevelsByDifficulty(difficulty: DifficultyLevel): Level[] {
  return LEVELS.filter(level => level.difficulty === difficulty);
}

// Get next boss level
export function getNextBossLevel(currentLevel: number): Level | undefined {
  const bossLevels = [10, 20, 30, 40, 50, 60];
  const nextBossLevelNum = bossLevels.find(num => num > currentLevel);
  return nextBossLevelNum ? LEVELS.find(l => l.levelNumber === nextBossLevelNum) : undefined;
}

// Calculate total XP and tokens that can be earned
export function calculatePotentialRewards(levels: Level[]): { totalXp: number; totalTokens: number } {
  return levels.reduce(
    (acc, level) => ({
      totalXp: acc.totalXp + level.rewards.baseXp,
      totalTokens: acc.totalTokens + level.rewards.baseTokens
    }),
    { totalXp: 0, totalTokens: 0 }
  );
}

// Get player's completion percentage
export function getCompletionPercentage(progress: PlayerProgress): number {
  return Math.floor((progress.levelsCompleted.length / LEVELS.length) * 100);
}

// Get player's total stars percentage
export function getStarsPercentage(progress: PlayerProgress): number {
  const maxPossibleStars = LEVELS.length * 3;
  return Math.floor((progress.starsEarned / maxPossibleStars) * 100);
}
