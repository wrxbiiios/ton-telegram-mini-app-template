import React from 'react';
import { GameState } from '../game/types';

interface GameHUDProps {
  gameState: GameState;
  nftBonuses: {
    damage?: number;
    fireRate?: number;
    health?: number;
    speed?: number;
  };
  connectedPlayers?: number;
}

export const GameHUD: React.FC<GameHUDProps> = ({ gameState, nftBonuses, connectedPlayers = 1 }) => {
  const healthPercent = Math.max(0, (gameState.health / 100) * 100);

  return (
    <div className="absolute top-0 left-0 right-0 p-4 pointer-events-none z-10">
      <div className="flex justify-between items-start text-white">
        {/* Left side - Health and Stats */}
        <div className="bg-black bg-opacity-70 rounded-lg p-3 border-2 border-cyan-500 shadow-lg">
          <div className="space-y-2">
            {/* Health Bar */}
            <div>
              <div className="text-xs text-cyan-400 mb-1">HEALTH</div>
              <div className="w-48 h-4 bg-gray-800 rounded-full overflow-hidden border border-cyan-500">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-300"
                  style={{ width: `${healthPercent}%` }}
                />
              </div>
              <div className="text-xs text-right mt-1 text-gray-300">{gameState.health} / 100</div>
            </div>
            
            {/* Wave */}
            <div className="flex justify-between items-center">
              <span className="text-xs text-cyan-400">WAVE</span>
              <span className="text-lg font-bold text-pink-500">{gameState.wave}</span>
            </div>
          </div>
        </div>

        {/* Right side - Score and Players */}
        <div className="bg-black bg-opacity-70 rounded-lg p-3 border-2 border-pink-500 shadow-lg">
          <div className="space-y-2">
            {/* Score */}
            <div>
              <div className="text-xs text-pink-400 mb-1">SCORE</div>
              <div className="text-2xl font-bold text-yellow-400">{gameState.score}</div>
            </div>
            
            {/* Players */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-300">{connectedPlayers} Players</span>
            </div>
          </div>
        </div>
      </div>

      {/* NFT Bonuses Display */}
      {(nftBonuses.damage || nftBonuses.fireRate || nftBonuses.health || nftBonuses.speed) && (
        <div className="mt-4 flex justify-center">
          <div className="bg-black bg-opacity-70 rounded-lg p-2 border border-purple-500 shadow-lg">
            <div className="flex space-x-4 text-xs">
              {nftBonuses.damage && (
                <div className="flex items-center space-x-1">
                  <span className="text-purple-400">⚔️</span>
                  <span className="text-white">+{nftBonuses.damage}x DMG</span>
                </div>
              )}
              {nftBonuses.fireRate && (
                <div className="flex items-center space-x-1">
                  <span className="text-purple-400">⚡</span>
                  <span className="text-white">+{nftBonuses.fireRate}x RATE</span>
                </div>
              )}
              {nftBonuses.health && (
                <div className="flex items-center space-x-1">
                  <span className="text-purple-400">❤️</span>
                  <span className="text-white">+{nftBonuses.health} HP</span>
                </div>
              )}
              {nftBonuses.speed && (
                <div className="flex items-center space-x-1">
                  <span className="text-purple-400">🏃</span>
                  <span className="text-white">+{nftBonuses.speed}x SPD</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Controls hint */}
      <div className="mt-4 flex justify-center">
        <div className="bg-black bg-opacity-50 rounded px-3 py-1 text-xs text-gray-400">
          WASD/Arrows: Move | Click/Space: Shoot
        </div>
      </div>
    </div>
  );
};
