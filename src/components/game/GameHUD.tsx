import React from 'react';

interface GameHUDProps {
  health: number;
  score: number;
  wave: number;
  ammo?: number;
  maxAmmo?: number;
  weaponName?: string;
  abilityReady?: boolean;
}

export function GameHUD({ 
  health, 
  score, 
  wave, 
  ammo = 30, 
  maxAmmo = 30,
  weaponName = 'Plasma Rifle',
  abilityReady = true 
}: GameHUDProps) {
  
  const healthPercentage = Math.max(0, Math.min(100, health));
  const healthColor = healthPercentage > 50 ? '#10b981' : healthPercentage > 25 ? '#f59e0b' : '#ef4444';

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top Bar - Score and Wave */}
      <div className="flex justify-between items-start p-4">
        {/* Score */}
        <div className="bg-black bg-opacity-60 rounded-lg px-4 py-2 backdrop-blur-sm">
          <div className="text-yellow-400 text-sm font-semibold">SCORE</div>
          <div className="text-white text-2xl font-bold">{score.toLocaleString()}</div>
        </div>

        {/* Wave */}
        <div className="bg-black bg-opacity-60 rounded-lg px-4 py-2 backdrop-blur-sm">
          <div className="text-cyan-400 text-sm font-semibold">WAVE</div>
          <div className="text-white text-2xl font-bold">{wave}/10</div>
        </div>
      </div>

      {/* Health Bar - Top Center */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-64">
        <div className="bg-black bg-opacity-60 rounded-lg px-4 py-2 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-1">
            <span className="text-white text-sm font-semibold">HEALTH</span>
            <span className="text-white text-lg font-bold">{Math.round(health)}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <div 
              className="h-4 rounded-full transition-all duration-300"
              style={{ 
                width: `${healthPercentage}%`,
                backgroundColor: healthColor
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Bar - Weapon Info */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-between items-end px-4">
        {/* Ammo Count */}
        <div className="bg-black bg-opacity-60 rounded-lg px-4 py-3 backdrop-blur-sm">
          <div className="text-gray-400 text-xs font-semibold mb-1">{weaponName}</div>
          <div className="text-white text-3xl font-bold">
            {ammo}<span className="text-gray-400 text-xl">/{maxAmmo}</span>
          </div>
        </div>

        {/* Ability Indicator */}
        <div className="bg-black bg-opacity-60 rounded-full p-3 backdrop-blur-sm w-16 h-16 flex items-center justify-center">
          {abilityReady ? (
            <div className="text-3xl animate-pulse">⚡</div>
          ) : (
            <div className="relative w-12 h-12">
              <svg className="transform -rotate-90 w-12 h-12">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="#374151"
                  strokeWidth="4"
                  fill="none"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="#06b6d4"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 * 0.5}`}
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                5s
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Warning indicators */}
      {health < 25 && (
        <div className="absolute inset-0 border-4 border-red-600 animate-pulse pointer-events-none" 
             style={{ animation: 'pulse 1s infinite' }} />
      )}
    </div>
  );
}
