import React from 'react';
import { Level, PlayerProgress } from '../types/level.types';
import { isLevelUnlocked } from '../utils/levelUtils';

interface LevelCardProps {
  level: Level;
  progress: PlayerProgress;
  onSelect: (levelNumber: number) => void;
}

const LevelCard: React.FC<LevelCardProps> = ({ level, progress, onSelect }) => {
  const unlocked = isLevelUnlocked(level, progress);
  const stars = progress.levelStars[level.id] || 0;
  const completed = progress.levelsCompleted.includes(level.levelNumber);
  
  const difficultyColors = {
    easy: 'bg-green-600',
    medium: 'bg-yellow-600',
    hard: 'bg-orange-600',
    nightmare: 'bg-red-600'
  };

  const themeColors = {
    neon_downtown: 'border-pink-500',
    industrial_complex: 'border-orange-500',
    underground_bunker: 'border-green-500',
    skyrise_tower: 'border-blue-500',
    void_station: 'border-purple-500',
    corrupted_wasteland: 'border-red-500',
    nightmare_realm: 'border-gray-900'
  };

  return (
    <div
      className={`relative p-4 rounded-lg border-2 ${themeColors[level.theme]} ${
        unlocked ? 'cursor-pointer hover:scale-105' : 'opacity-50 cursor-not-allowed'
      } transition-all duration-200 bg-gray-800`}
      onClick={() => unlocked && onSelect(level.levelNumber)}
    >
      {/* Level Number Badge */}
      <div className="absolute top-2 left-2 bg-black bg-opacity-70 rounded-full w-10 h-10 flex items-center justify-center">
        <span className="text-white font-bold">{level.levelNumber}</span>
      </div>

      {/* Boss Badge */}
      {level.boss && (
        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
          BOSS
        </div>
      )}

      {/* Lock Icon */}
      {!unlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-lg">
          <span className="text-4xl">🔒</span>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-white font-bold text-sm mb-1">{level.name}</h3>
        <p className="text-gray-400 text-xs mb-2 line-clamp-2">{level.description}</p>

        {/* Difficulty Badge */}
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs px-2 py-1 rounded ${difficultyColors[level.difficulty]} text-white`}>
            {level.difficulty.toUpperCase()}
          </span>

          {/* Stars */}
          {completed && (
            <div className="flex space-x-1">
              {[1, 2, 3].map((star) => (
                <span key={star} className={star <= stars ? 'text-yellow-400' : 'text-gray-600'}>
                  ⭐
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Wave Count */}
        <div className="text-xs text-gray-400">
          {level.waves.length} waves • {level.rewards.baseXp} XP
        </div>
      </div>
    </div>
  );
};

interface LevelSelectorProps {
  levels: Level[];
  progress: PlayerProgress;
  onLevelSelect: (levelNumber: number) => void;
  filter?: 'all' | 'unlocked' | 'boss' | 'completed';
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  levels,
  progress,
  onLevelSelect,
  filter = 'all'
}) => {
  const filteredLevels = React.useMemo(() => {
    let result = levels;
    
    if (filter === 'unlocked') {
      result = result.filter(level => isLevelUnlocked(level, progress));
    } else if (filter === 'boss') {
      result = result.filter(level => level.boss !== undefined);
    } else if (filter === 'completed') {
      result = result.filter(level => progress.levelsCompleted.includes(level.levelNumber));
    }
    
    return result;
  }, [levels, progress, filter]);

  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {filteredLevels.map((level) => (
        <LevelCard
          key={level.id}
          level={level}
          progress={progress}
          onSelect={onLevelSelect}
        />
      ))}
      
      {filteredLevels.length === 0 && (
        <div className="col-span-2 text-center text-gray-400 py-8">
          No levels available
        </div>
      )}
    </div>
  );
};
