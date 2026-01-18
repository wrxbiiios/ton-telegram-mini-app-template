import React from 'react';
import { WeaponType } from '../types';

interface GameHUDProps {
  health: number;
  maxHealth: number;
  score: number;
  wave: number;
  kills: number;
  weapon: WeaponType;
}

const GameHUD: React.FC<GameHUDProps> = ({ health, maxHealth, score, wave, kills, weapon }) => {
  const healthPercent = (health / maxHealth) * 100;

  return (
    <div className="absolute top-0 left-0 right-0 p-4 text-white pointer-events-none">
      {/* Top Bar */}
      <div className="flex justify-between items-start mb-4">
        {/* Health Bar */}
        <div className="bg-black/70 p-3 rounded-lg border border-cyan-500">
          <div className="text-xs text-cyan-400 mb-1">HEALTH</div>
          <div className="w-48 h-6 bg-gray-800 rounded overflow-hidden border border-cyan-700">
            <div
              className={`h-full transition-all duration-300 ${
                healthPercent > 50 ? 'bg-green-500' : healthPercent > 25 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${healthPercent}%` }}
            />
          </div>
          <div className="text-right text-sm font-bold mt-1">
            {health} / {maxHealth}
          </div>
        </div>

        {/* Score & Stats */}
        <div className="bg-black/70 p-3 rounded-lg border border-purple-500 text-right">
          <div className="text-2xl font-bold text-purple-400">{score.toLocaleString()}</div>
          <div className="text-xs text-gray-400">SCORE</div>
          <div className="mt-2 space-y-1">
            <div className="text-sm">
              <span className="text-cyan-400">Wave:</span> <span className="font-bold">{wave}</span>
            </div>
            <div className="text-sm">
              <span className="text-red-400">Kills:</span> <span className="font-bold">{kills}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weapon Info */}
      <div className="absolute bottom-4 left-4 bg-black/70 p-3 rounded-lg border border-cyan-500">
        <div className="text-xs text-cyan-400 mb-1">WEAPON</div>
        <div className="text-lg font-bold uppercase text-white">
          {weapon.replace(/_/g, ' ')}
        </div>
        <div className="flex gap-2 mt-2">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>

      {/* Minimap Placeholder */}
      <div className="absolute bottom-4 right-4 w-32 h-32 bg-black/70 rounded border border-purple-500 p-2">
        <div className="text-xs text-purple-400 mb-1">MINIMAP</div>
        <div className="w-full h-full bg-gray-900 rounded relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-transparent"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
      </div>

      {/* Kill Feed */}
      <div className="absolute top-20 right-4 space-y-1 max-w-xs">
        {/* Kill notifications would appear here */}
      </div>
    </div>
  );
};

export default GameHUD;
