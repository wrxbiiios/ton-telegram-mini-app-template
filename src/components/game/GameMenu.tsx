import React, { useState } from 'react';
import { useTelegramTheme } from '../../hooks/useTelegramWebApp';
import { SettingsPanel } from './SettingsPanel';
import { LeaderboardView } from './LeaderboardView';

interface GameMenuProps {
  onPlay: () => void;
  level: number;
  xp: number;
}

export function GameMenu({ onPlay, level, xp }: GameMenuProps) {
  const { colorScheme, themeParams } = useTelegramTheme();
  const [showSettings, setShowSettings] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  const bgColor = themeParams.bg_color || (colorScheme === 'dark' ? '#000000' : '#ffffff');
  const textColor = themeParams.text_color || (colorScheme === 'dark' ? '#ffffff' : '#000000');
  const buttonColor = themeParams.button_color || '#0088cc';

  return (
    <>
      <div 
        className="flex flex-col items-center justify-center h-full p-6"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        {/* Title */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold mb-2 neon-text">CYBERPUNK</h1>
          <h2 className="text-3xl font-bold neon-text-secondary">SHOOTER</h2>
          <div className="mt-4 text-cyan-400 text-sm">
            💀 TELEGRAM MINI APP 💀
          </div>
        </div>

        {/* Player Stats */}
        <div className="mb-8 bg-gray-900 bg-opacity-50 rounded-lg p-4 w-full max-w-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Level</span>
            <span className="text-2xl font-bold text-cyan-400">{level}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full"
              style={{ width: `${(xp % 100)}%` }}
            />
          </div>
          <div className="text-right text-sm text-gray-400">
            {xp % 100}/100 XP
          </div>
        </div>

        {/* Play Button */}
        <button
          onClick={onPlay}
          className="w-full max-w-sm py-6 rounded-2xl font-bold text-2xl mb-4 transition-all transform active:scale-95"
          style={{ 
            backgroundColor: buttonColor,
            color: themeParams.button_text_color || '#ffffff',
            minHeight: '80px'
          }}
        >
          ▶ PLAY NOW
        </button>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          <button 
            onClick={() => setShowLeaderboard(true)}
            className="bg-gray-800 py-4 rounded-xl font-semibold flex flex-col items-center justify-center min-h-[80px] active:scale-95 transition-transform"
          >
            <span className="text-2xl mb-1">🏆</span>
            <span className="text-sm">Leaderboard</span>
          </button>
          <button 
            onClick={() => setShowSettings(true)}
            className="bg-gray-800 py-4 rounded-xl font-semibold flex flex-col items-center justify-center min-h-[80px] active:scale-95 transition-transform"
          >
            <span className="text-2xl mb-1">⚙️</span>
            <span className="text-sm">Settings</span>
          </button>
        </div>

        {/* Daily Reward Indicator */}
        <div className="mt-6 flex items-center gap-2 text-yellow-400">
          <span className="text-xl">🎁</span>
          <span className="text-sm">Daily reward available!</span>
        </div>

        <style>{`
          .neon-text {
            text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff;
            color: #00ffff;
          }
          .neon-text-secondary {
            text-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff;
            color: #ff00ff;
          }
        `}</style>
      </div>

      {/* Modals */}
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
      {showLeaderboard && <LeaderboardView onClose={() => setShowLeaderboard(false)} />}
    </>
  );
}
