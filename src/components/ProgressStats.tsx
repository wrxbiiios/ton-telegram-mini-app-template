import React from 'react';
import { PlayerProgress } from '../types/level.types';
import { LEVELS } from '../data/levels';
import { getCompletionPercentage, getStarsPercentage } from '../utils/levelUtils';

interface ProgressStatsProps {
  progress: PlayerProgress;
}

export const ProgressStats: React.FC<ProgressStatsProps> = ({ progress }) => {
  const completionPercentage = getCompletionPercentage(progress);
  const starsPercentage = getStarsPercentage(progress);
  const maxPossibleStars = LEVELS.length * 3;
  
  // Calculate stats by difficulty
  const statsByDifficulty = {
    easy: { completed: 0, total: 0, stars: 0 },
    medium: { completed: 0, total: 0, stars: 0 },
    hard: { completed: 0, total: 0, stars: 0 },
    nightmare: { completed: 0, total: 0, stars: 0 }
  };

  LEVELS.forEach(level => {
    const difficulty = level.difficulty;
    statsByDifficulty[difficulty].total++;
    
    if (progress.levelsCompleted.includes(level.levelNumber)) {
      statsByDifficulty[difficulty].completed++;
      statsByDifficulty[difficulty].stars += progress.levelStars[level.id] || 0;
    }
  });

  // Boss levels completed
  const bossLevels = [10, 20, 30, 40, 50, 60];
  const bossesDefeated = bossLevels.filter(level => progress.levelsCompleted.includes(level)).length;

  return (
    <div className="space-y-4">
      {/* Overall Progress */}
      <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-lg p-4">
        <h3 className="text-white font-bold mb-3">Overall Progress</h3>
        
        <div className="space-y-3">
          {/* Completion Progress Bar */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">Levels Completed</span>
              <span className="text-white font-bold">{progress.levelsCompleted.length}/{LEVELS.length}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="text-right text-xs text-gray-400 mt-1">{completionPercentage}%</div>
          </div>

          {/* Stars Progress Bar */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">Stars Collected</span>
              <span className="text-yellow-400 font-bold">⭐ {progress.starsEarned}/{maxPossibleStars}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${starsPercentage}%` }}
              />
            </div>
            <div className="text-right text-xs text-gray-400 mt-1">{starsPercentage}%</div>
          </div>
        </div>
      </div>

      {/* Difficulty Breakdown */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-white font-bold mb-3">Difficulty Breakdown</h3>
        <div className="space-y-2">
          {Object.entries(statsByDifficulty).map(([difficulty, stats]) => {
            const percentage = stats.total > 0 ? Math.floor((stats.completed / stats.total) * 100) : 0;
            const difficultyColors = {
              easy: 'from-green-600 to-green-500',
              medium: 'from-yellow-600 to-yellow-500',
              hard: 'from-orange-600 to-orange-500',
              nightmare: 'from-red-600 to-red-500'
            };

            return (
              <div key={difficulty}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300 capitalize">{difficulty}</span>
                  <span className="text-white">{stats.completed}/{stats.total} (⭐{stats.stars})</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`bg-gradient-to-r ${difficultyColors[difficulty as keyof typeof difficultyColors]} h-2 rounded-full`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-white font-bold mb-3">Achievements</h3>
        <div className="grid grid-cols-2 gap-3">
          {/* Current Level */}
          <div className="bg-gray-700 rounded p-3 text-center">
            <div className="text-2xl mb-1">📍</div>
            <div className="text-sm text-gray-400">Current Level</div>
            <div className="text-xl font-bold text-purple-400">{progress.currentLevel}</div>
          </div>

          {/* Max Reached */}
          <div className="bg-gray-700 rounded p-3 text-center">
            <div className="text-2xl mb-1">🏆</div>
            <div className="text-sm text-gray-400">Max Reached</div>
            <div className="text-xl font-bold text-blue-400">{progress.maxLevelReached}</div>
          </div>

          {/* Bosses Defeated */}
          <div className="bg-gray-700 rounded p-3 text-center">
            <div className="text-2xl mb-1">👹</div>
            <div className="text-sm text-gray-400">Bosses Defeated</div>
            <div className="text-xl font-bold text-red-400">{bossesDefeated}/6</div>
          </div>

          {/* Prestige */}
          <div className="bg-gray-700 rounded p-3 text-center">
            <div className="text-2xl mb-1">✨</div>
            <div className="text-sm text-gray-400">Prestige</div>
            <div className="text-xl font-bold text-yellow-400">{progress.prestigeLevel}</div>
          </div>
        </div>
      </div>

      {/* Prestige Info */}
      {progress.prestigeLevel > 0 && (
        <div className="bg-gradient-to-r from-yellow-900 to-orange-900 rounded-lg p-4 border-2 border-yellow-500">
          <h3 className="text-yellow-400 font-bold mb-2 flex items-center">
            ✨ Prestige Level {progress.prestigeLevel}
          </h3>
          <p className="text-gray-300 text-sm mb-2">
            You have prestiged {progress.prestigeLevel} time{progress.prestigeLevel > 1 ? 's' : ''}!
          </p>
          <div className="text-yellow-400 text-sm">
            💎 Prestige Points: {progress.prestigePoints}
          </div>
        </div>
      )}

      {/* Next Milestone */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-white font-bold mb-2">Next Milestone</h3>
        {progress.currentLevel <= 60 ? (
          <div className="space-y-2 text-sm">
            {progress.currentLevel % 10 !== 0 && (
              <div className="flex justify-between">
                <span className="text-gray-400">Next Boss:</span>
                <span className="text-red-400">Level {Math.ceil(progress.currentLevel / 10) * 10}</span>
              </div>
            )}
            {progress.starsEarned < maxPossibleStars && (
              <div className="flex justify-between">
                <span className="text-gray-400">Perfect Stars:</span>
                <span className="text-yellow-400">{maxPossibleStars - progress.starsEarned} more needed</span>
              </div>
            )}
            {progress.maxLevelReached < 60 && (
              <div className="flex justify-between">
                <span className="text-gray-400">Final Boss:</span>
                <span className="text-purple-400">Level 60</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-green-400 text-sm">
            🎉 All levels completed! Ready to prestige?
          </div>
        )}
      </div>
    </div>
  );
};

// Compact stats widget for quick view
export const CompactStats: React.FC<{ progress: PlayerProgress }> = ({ progress }) => {
  return (
    <div className="flex justify-around bg-gray-800 rounded-lg p-3">
      <div className="text-center">
        <div className="text-lg font-bold text-purple-400">{progress.currentLevel}</div>
        <div className="text-xs text-gray-400">Level</div>
      </div>
      <div className="text-center">
        <div className="text-lg font-bold text-yellow-400">{progress.starsEarned}</div>
        <div className="text-xs text-gray-400">Stars</div>
      </div>
      <div className="text-center">
        <div className="text-lg font-bold text-green-400">{progress.levelsCompleted.length}</div>
        <div className="text-xs text-gray-400">Cleared</div>
      </div>
      {progress.prestigeLevel > 0 && (
        <div className="text-center">
          <div className="text-lg font-bold text-orange-400">✨{progress.prestigeLevel}</div>
          <div className="text-xs text-gray-400">Prestige</div>
        </div>
      )}
    </div>
  );
};
