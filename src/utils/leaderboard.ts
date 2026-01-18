import { Leaderboard, LeaderboardEntry, Level } from '../types/level.types';

// Mock leaderboard storage - in production, this would be backend API calls
const LEADERBOARD_STORAGE_KEY = 'cyberpunk_shooter_leaderboards';

interface LeaderboardStorage {
  [levelId: string]: LeaderboardEntry[];
}

// Get leaderboard from localStorage
function getLeaderboardStorage(): LeaderboardStorage {
  try {
    const data = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

// Save leaderboard to localStorage
function saveLeaderboardStorage(data: LeaderboardStorage): void {
  localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(data));
}

// Submit a score to a level leaderboard
export function submitScore(
  levelId: string,
  playerId: string,
  playerName: string,
  score: number,
  time: number,
  stars: number
): LeaderboardEntry {
  const storage = getLeaderboardStorage();
  
  if (!storage[levelId]) {
    storage[levelId] = [];
  }

  const entry: LeaderboardEntry = {
    playerId,
    playerName,
    score,
    time,
    stars,
    rank: 0, // Will be calculated
    timestamp: Date.now()
  };

  // Check if player already has an entry
  const existingIndex = storage[levelId].findIndex(e => e.playerId === playerId);
  
  if (existingIndex >= 0) {
    // Only update if new score is better
    const existing = storage[levelId][existingIndex];
    if (score > existing.score || (score === existing.score && time < existing.time)) {
      storage[levelId][existingIndex] = entry;
    } else {
      return existing; // Return existing entry if not better
    }
  } else {
    storage[levelId].push(entry);
  }

  // Sort by score (desc), then by time (asc)
  storage[levelId].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.time - b.time;
  });

  // Update ranks and keep top 100
  storage[levelId] = storage[levelId].slice(0, 100).map((entry, index) => ({
    ...entry,
    rank: index + 1
  }));

  saveLeaderboardStorage(storage);

  // Return the player's entry
  return storage[levelId].find(e => e.playerId === playerId)!;
}

// Get leaderboard for a specific level
export function getLeaderboard(levelId: string, limit: number = 10): Leaderboard {
  const storage = getLeaderboardStorage();
  const entries = storage[levelId] || [];

  return {
    levelId,
    entries: entries.slice(0, limit)
  };
}

// Get player's rank on a level
export function getPlayerRank(levelId: string, playerId: string): number | null {
  const storage = getLeaderboardStorage();
  const entries = storage[levelId] || [];
  const entry = entries.find(e => e.playerId === playerId);
  return entry ? entry.rank : null;
}

// Get player's best scores across all levels
export function getPlayerStats(playerId: string) {
  const storage = getLeaderboardStorage();
  let totalScore = 0;
  let bestRank = Infinity;
  let levelsPlayed = 0;
  let totalStars = 0;

  Object.values(storage).forEach(entries => {
    const playerEntry = entries.find(e => e.playerId === playerId);
    if (playerEntry) {
      totalScore += playerEntry.score;
      bestRank = Math.min(bestRank, playerEntry.rank);
      levelsPlayed++;
      totalStars += playerEntry.stars;
    }
  });

  return {
    totalScore,
    bestRank: bestRank === Infinity ? null : bestRank,
    levelsPlayed,
    totalStars,
    averageRank: levelsPlayed > 0 ? totalScore / levelsPlayed : 0
  };
}

// Get global leaderboard (combined scores across all levels)
export function getGlobalLeaderboard(limit: number = 100): LeaderboardEntry[] {
  const storage = getLeaderboardStorage();
  const playerScores: Record<string, { 
    playerId: string; 
    playerName: string; 
    totalScore: number;
    totalStars: number;
    levelsPlayed: number;
  }> = {};

  // Aggregate scores per player
  Object.values(storage).forEach(entries => {
    entries.forEach(entry => {
      if (!playerScores[entry.playerId]) {
        playerScores[entry.playerId] = {
          playerId: entry.playerId,
          playerName: entry.playerName,
          totalScore: 0,
          totalStars: 0,
          levelsPlayed: 0
        };
      }
      playerScores[entry.playerId].totalScore += entry.score;
      playerScores[entry.playerId].totalStars += entry.stars;
      playerScores[entry.playerId].levelsPlayed++;
    });
  });

  // Convert to array and sort
  const globalEntries = Object.values(playerScores)
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, limit)
    .map((player, index) => ({
      playerId: player.playerId,
      playerName: player.playerName,
      score: player.totalScore,
      time: 0, // Not applicable for global
      stars: player.totalStars,
      rank: index + 1,
      timestamp: Date.now()
    }));

  return globalEntries;
}

// Get top players for a specific theme
export function getThemeLeaderboard(levels: Level[], limit: number = 10): LeaderboardEntry[] {
  const storage = getLeaderboardStorage();
  const playerScores: Record<string, {
    playerId: string;
    playerName: string;
    totalScore: number;
    totalStars: number;
  }> = {};

  levels.forEach(level => {
    const entries = storage[level.id] || [];
    entries.forEach(entry => {
      if (!playerScores[entry.playerId]) {
        playerScores[entry.playerId] = {
          playerId: entry.playerId,
          playerName: entry.playerName,
          totalScore: 0,
          totalStars: 0
        };
      }
      playerScores[entry.playerId].totalScore += entry.score;
      playerScores[entry.playerId].totalStars += entry.stars;
    });
  });

  return Object.values(playerScores)
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, limit)
    .map((player, index) => ({
      playerId: player.playerId,
      playerName: player.playerName,
      score: player.totalScore,
      time: 0,
      stars: player.totalStars,
      rank: index + 1,
      timestamp: Date.now()
    }));
}

// Clear all leaderboards (for testing)
export function clearAllLeaderboards(): void {
  localStorage.removeItem(LEADERBOARD_STORAGE_KEY);
}

// Export leaderboard data
export function exportLeaderboardData(): string {
  const storage = getLeaderboardStorage();
  return JSON.stringify(storage, null, 2);
}

// Import leaderboard data
export function importLeaderboardData(data: string): boolean {
  try {
    const parsed = JSON.parse(data);
    saveLeaderboardStorage(parsed);
    return true;
  } catch {
    return false;
  }
}

// Get comparison between player and top player
export function getComparisonWithTop(levelId: string, playerId: string) {
  const leaderboard = getLeaderboard(levelId, 1);
  const storage = getLeaderboardStorage();
  const entries = storage[levelId] || [];
  
  const topPlayer = leaderboard.entries[0];
  const playerEntry = entries.find(e => e.playerId === playerId);

  if (!topPlayer || !playerEntry) {
    return null;
  }

  return {
    scoreDifference: topPlayer.score - playerEntry.score,
    timeDifference: playerEntry.time - topPlayer.time,
    starDifference: topPlayer.stars - playerEntry.stars,
    rankDifference: playerEntry.rank - 1
  };
}
