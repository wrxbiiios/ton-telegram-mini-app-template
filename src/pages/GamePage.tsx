import React, { useState } from 'react';
import { LevelSelector } from '../components/LevelSelector';
import { useLevelSystem } from '../hooks/useLevelSystem';
import { Level } from '../types/level.types';

type GameMode = 'menu' | 'levelSelect' | 'playing' | 'dailyChallenge' | 'weeklyChallenge';

export const GamePage: React.FC = () => {
  const {
    progress,
    currentLevel,
    dailyChallenge,
    weeklyChallenge,
    allLevels,
    selectLevel,
    getAvailableLevels,
    getNextLevel,
    canPrestige,
    prestige
  } = useLevelSystem();

  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [activeLevel, setActiveLevel] = useState<Level | null>(null);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'boss' | 'completed'>('unlocked');

  const handleLevelSelect = (levelNumber: number) => {
    if (selectLevel(levelNumber)) {
      setActiveLevel(currentLevel);
      setGameMode('playing');
    }
  };

  const handlePlayDaily = () => {
    setActiveLevel(dailyChallenge);
    setGameMode('dailyChallenge');
  };

  const handlePlayWeekly = () => {
    setActiveLevel(weeklyChallenge);
    setGameMode('weeklyChallenge');
  };

  const handleBackToMenu = () => {
    setGameMode('menu');
    setActiveLevel(null);
  };

  const handlePrestige = () => {
    if (window.confirm('Are you sure you want to prestige? This will reset your progress but grant prestige bonuses.')) {
      prestige();
    }
  };

  const nextLevel = getNextLevel();
  const completionPercentage = Math.floor((progress.levelsCompleted.length / allLevels.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black text-white">
      {/* Main Menu */}
      {gameMode === 'menu' && (
        <div className="flex flex-col items-center justify-start p-6 pt-12">
          <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            Cyberpunk Shooter
          </h1>
          <p className="text-gray-400 mb-8">Level System v1.0</p>

          {/* Progress Overview */}
          <div className="w-full max-w-md bg-gray-800 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-bold mb-3">Your Progress</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Level:</span>
                <span className="font-bold text-purple-400">{progress.currentLevel}</span>
              </div>
              <div className="flex justify-between">
                <span>Max Reached:</span>
                <span className="font-bold text-blue-400">{progress.maxLevelReached}</span>
              </div>
              <div className="flex justify-between">
                <span>Stars:</span>
                <span className="font-bold text-yellow-400">⭐ {progress.starsEarned}</span>
              </div>
              <div className="flex justify-between">
                <span>Completion:</span>
                <span className="font-bold text-green-400">{completionPercentage}%</span>
              </div>
              {progress.prestigeLevel > 0 && (
                <div className="flex justify-between">
                  <span>Prestige:</span>
                  <span className="font-bold text-red-400">✨ {progress.prestigeLevel}</span>
                </div>
              )}
            </div>
          </div>

          {/* Main Actions */}
          <div className="w-full max-w-md space-y-3">
            {nextLevel && (
              <button
                onClick={() => handleLevelSelect(nextLevel.levelNumber)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                <div className="text-sm text-purple-200 mb-1">Continue Story</div>
                <div className="text-lg">Level {nextLevel.levelNumber}: {nextLevel.name}</div>
              </button>
            )}

            <button
              onClick={() => setGameMode('levelSelect')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
            >
              📋 Level Select
            </button>

            {dailyChallenge && (
              <button
                onClick={handlePlayDaily}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
              >
                🌟 Daily Challenge
              </button>
            )}

            {weeklyChallenge && (
              <button
                onClick={handlePlayWeekly}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
              >
                👑 Weekly Challenge
              </button>
            )}

            {canPrestige && (
              <button
                onClick={handlePrestige}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 border-2 border-yellow-400"
              >
                ✨ Prestige Available!
              </button>
            )}
          </div>

          {/* Quick Stats */}
          <div className="w-full max-w-md mt-6 grid grid-cols-3 gap-3">
            <div className="bg-gray-800 p-3 rounded text-center">
              <div className="text-2xl font-bold text-green-400">{progress.levelsCompleted.length}</div>
              <div className="text-xs text-gray-400">Completed</div>
            </div>
            <div className="bg-gray-800 p-3 rounded text-center">
              <div className="text-2xl font-bold text-yellow-400">{progress.starsEarned}</div>
              <div className="text-xs text-gray-400">Total Stars</div>
            </div>
            <div className="bg-gray-800 p-3 rounded text-center">
              <div className="text-2xl font-bold text-purple-400">{getAvailableLevels().length}</div>
              <div className="text-xs text-gray-400">Unlocked</div>
            </div>
          </div>
        </div>
      )}

      {/* Level Select */}
      {gameMode === 'levelSelect' && (
        <div className="pb-20">
          <div className="sticky top-0 bg-gray-900 z-10 p-4 border-b border-gray-700">
            <button
              onClick={handleBackToMenu}
              className="text-purple-400 hover:text-purple-300 mb-3"
            >
              ← Back to Menu
            </button>
            <h2 className="text-2xl font-bold mb-3">Select Level</h2>
            
            {/* Filters */}
            <div className="flex space-x-2 overflow-x-auto">
              {(['unlocked', 'all', 'boss', 'completed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
                    filter === f
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <LevelSelector
            levels={allLevels}
            progress={progress}
            onLevelSelect={handleLevelSelect}
            filter={filter}
          />
        </div>
      )}

      {/* Playing Level (Placeholder) */}
      {(gameMode === 'playing' || gameMode === 'dailyChallenge' || gameMode === 'weeklyChallenge') && activeLevel && (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <div className="w-full max-w-md bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-2">{activeLevel.name}</h2>
            <p className="text-gray-400 mb-4">{activeLevel.description}</p>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Theme:</span>
                <span className="text-purple-400">{activeLevel.theme.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span>Difficulty:</span>
                <span className="text-yellow-400">{activeLevel.difficulty.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span>Waves:</span>
                <span className="text-blue-400">{activeLevel.waves.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Rewards:</span>
                <span className="text-green-400">{activeLevel.rewards.baseXp} XP, {activeLevel.rewards.baseTokens} Tokens</span>
              </div>
            </div>

            {activeLevel.boss && (
              <div className="bg-red-900 bg-opacity-30 border border-red-500 rounded p-3 mb-4">
                <h3 className="text-red-400 font-bold mb-1">⚠️ BOSS LEVEL</h3>
                <p className="text-sm text-gray-300">{activeLevel.boss.name}</p>
                <p className="text-xs text-gray-400">HP: {activeLevel.boss.health}</p>
              </div>
            )}

            <div className="bg-gray-700 rounded p-4 mb-4">
              <p className="text-center text-gray-300">
                🎮 Game implementation coming soon!
              </p>
              <p className="text-center text-sm text-gray-400 mt-2">
                Level data is ready and configured
              </p>
            </div>

            <button
              onClick={handleBackToMenu}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg"
            >
              Back to Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
