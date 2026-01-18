import React from 'react';
import { useTelegramWebApp } from '../../hooks/useTelegramWebApp';

interface PostMatchProps {
  score: number;
  xp: number;
  level: number;
  onBackToMenu: () => void;
  onRematch: () => void;
}

export function PostMatch({ score, xp, level, onBackToMenu, onRematch }: PostMatchProps) {
  const telegramWebApp = useTelegramWebApp();

  const handleShare = () => {
    if (telegramWebApp) {
      telegramWebApp.HapticFeedback.impactOccurred('medium');
      
      // Share score via Telegram
      const shareText = `🎮 I just scored ${score.toLocaleString()} points in Cyberpunk Shooter! Can you beat it? 💀`;
      const shareUrl = `https://t.me/share/url?url=https://t.me/YourGameBot/app&text=${encodeURIComponent(shareText)}`;
      telegramWebApp.openTelegramLink(shareUrl);
    }
  };

  const earnedXP = Math.floor(score / 10);
  const tokensEarned = Math.floor(score / 100);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-gray-900 via-purple-900 to-black text-white p-6">
      {/* Game Over Title */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-2 neon-text">GAME OVER</h1>
        <p className="text-gray-400 text-lg">Nice try, soldier!</p>
      </div>

      {/* Score Display */}
      <div className="bg-gray-800 bg-opacity-80 rounded-2xl p-6 mb-6 w-full max-w-sm backdrop-blur-sm">
        <div className="text-center mb-4">
          <div className="text-yellow-400 text-sm font-semibold mb-1">FINAL SCORE</div>
          <div className="text-6xl font-bold text-white mb-4">{score.toLocaleString()}</div>
        </div>

        {/* Rewards */}
        <div className="space-y-3 border-t border-gray-700 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">XP Earned</span>
            <span className="text-cyan-400 font-bold text-xl">+{earnedXP}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Tokens Earned</span>
            <span className="text-yellow-400 font-bold text-xl">+{tokensEarned} 💎</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Current Level</span>
            <span className="text-purple-400 font-bold text-xl">Level {level}</span>
          </div>
        </div>

        {/* Progress to Next Level */}
        <div className="mt-4">
          <div className="text-sm text-gray-400 mb-2">Next Level Progress</div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all"
              style={{ width: `${(xp % 100)}%` }}
            />
          </div>
          <div className="text-right text-xs text-gray-400 mt-1">
            {xp % 100}/100 XP
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-sm space-y-3">
        <button
          onClick={onRematch}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 py-5 rounded-xl font-bold text-xl transition-transform active:scale-95"
          style={{ minHeight: '70px' }}
        >
          🔄 PLAY AGAIN
        </button>

        <button
          onClick={handleShare}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-5 rounded-xl font-bold text-xl transition-transform active:scale-95"
          style={{ minHeight: '70px' }}
        >
          📤 SHARE SCORE
        </button>

        <button
          onClick={onBackToMenu}
          className="w-full bg-gray-800 py-4 rounded-xl font-semibold text-lg transition-transform active:scale-95"
          style={{ minHeight: '60px' }}
        >
          🏠 MAIN MENU
        </button>
      </div>

      {/* Achievements */}
      <div className="mt-6 flex gap-3">
        <div className="bg-yellow-900 bg-opacity-50 rounded-lg p-3 text-center">
          <div className="text-2xl mb-1">🏆</div>
          <div className="text-xs text-yellow-400">First Victory</div>
        </div>
        <div className="bg-purple-900 bg-opacity-50 rounded-lg p-3 text-center">
          <div className="text-2xl mb-1">💀</div>
          <div className="text-xs text-purple-400">10 Kills</div>
        </div>
        <div className="bg-cyan-900 bg-opacity-50 rounded-lg p-3 text-center">
          <div className="text-2xl mb-1">⚡</div>
          <div className="text-xs text-cyan-400">Sharpshooter</div>
        </div>
      </div>

      <style>{`
        .neon-text {
          text-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff;
          color: #ff00ff;
        }
      `}</style>
    </div>
  );
}
