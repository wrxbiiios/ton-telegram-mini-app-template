import { useState, useEffect, useCallback } from 'react';
import { Level, PlayerProgress, DailyChallenge } from '../types/level.types';
import { LEVELS, getLevelByNumber } from '../data/levels';
import { generateDailyChallenge, generateWeeklyChallenge, getWeekNumber } from '../utils/proceduralGenerator';
import {
  isLevelUnlocked,
  calculateStars,
  updateProgressAfterLevel,
  getRecommendedLevel,
  canPrestige,
  applyPrestige
} from '../utils/levelUtils';

const PROGRESS_STORAGE_KEY = 'cyberpunk_shooter_progress';

export function useLevelSystem() {
  const [progress, setProgress] = useState<PlayerProgress>(() => {
    // Load from localStorage
    const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fall through to default
      }
    }
    
    return {
      currentLevel: 1,
      maxLevelReached: 0,
      starsEarned: 0,
      levelsCompleted: [],
      levelStars: {},
      prestigeLevel: 0,
      prestigePoints: 0
    };
  });

  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [dailyChallenge, setDailyChallenge] = useState<Level | null>(null);
  const [weeklyChallenge, setWeeklyChallenge] = useState<Level | null>(null);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  // Generate daily and weekly challenges
  useEffect(() => {
    const now = new Date();
    const daily = generateDailyChallenge(now);
    setDailyChallenge(daily);

    const weekNum = getWeekNumber(now);
    const weekly = generateWeeklyChallenge(weekNum, now.getFullYear());
    setWeeklyChallenge(weekly);
  }, []);

  // Select a level to play
  const selectLevel = useCallback((levelNumber: number) => {
    const level = getLevelByNumber(levelNumber);
    if (level && isLevelUnlocked(level, progress)) {
      setCurrentLevel(level);
      return true;
    }
    return false;
  }, [progress]);

  // Complete a level and update progress
  const completeLevel = useCallback((
    levelNumber: number,
    completionTime: number,
    healthRemaining: number,
    score: number
  ) => {
    const level = getLevelByNumber(levelNumber);
    if (!level) return;

    const stars = calculateStars(level, completionTime, healthRemaining);
    const newProgress = updateProgressAfterLevel(progress, levelNumber, stars);
    
    setProgress(newProgress);
    
    return {
      stars,
      xpEarned: level.rewards.baseXp,
      tokensEarned: level.rewards.baseTokens,
      bonusRewards: level.rewards.bonusRewards || []
    };
  }, [progress]);

  // Get all available levels
  const getAvailableLevels = useCallback(() => {
    return LEVELS.filter(level => isLevelUnlocked(level, progress));
  }, [progress]);

  // Get recommended next level
  const getNextLevel = useCallback(() => {
    return getRecommendedLevel(progress);
  }, [progress]);

  // Prestige system
  const prestige = useCallback(() => {
    if (canPrestige(progress)) {
      const newProgress = applyPrestige(progress);
      setProgress(newProgress);
      return true;
    }
    return false;
  }, [progress]);

  // Reset progress (for testing/debugging)
  const resetProgress = useCallback(() => {
    const freshProgress: PlayerProgress = {
      currentLevel: 1,
      maxLevelReached: 0,
      starsEarned: 0,
      levelsCompleted: [],
      levelStars: {},
      prestigeLevel: 0,
      prestigePoints: 0
    };
    setProgress(freshProgress);
    localStorage.removeItem(PROGRESS_STORAGE_KEY);
  }, []);

  return {
    // State
    progress,
    currentLevel,
    dailyChallenge,
    weeklyChallenge,
    allLevels: LEVELS,
    
    // Actions
    selectLevel,
    completeLevel,
    getAvailableLevels,
    getNextLevel,
    prestige,
    resetProgress,
    
    // Helpers
    canPrestige: canPrestige(progress)
  };
}
