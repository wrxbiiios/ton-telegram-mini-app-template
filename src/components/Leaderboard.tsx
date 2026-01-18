import React from 'react';
import { LeaderboardEntry } from '../game/types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  onClose: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ entries, onClose }) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-500 to-yellow-700';
      case 2: return 'from-gray-400 to-gray-600';
      case 3: return 'from-orange-500 to-orange-700';
      default: return 'from-gray-700 to-gray-900';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-gray-900 to-black max-w-2xl w-full max-h-[90vh] rounded-lg border-2 border-yellow-500 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <span>🏆</span>
            <span>Global Leaderboard</span>
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-3xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {entries.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="text-6xl">🏆</div>
              <p className="text-gray-400 text-lg">No leaderboard entries yet</p>
              <p className="text-gray-500 text-sm">Be the first to set a high score!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map((entry, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-r ${getRankColor(index + 1)} p-4 rounded-lg border border-white border-opacity-20 shadow-lg transition-all hover:scale-105`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl font-bold w-16 text-center">
                        {getRankIcon(index + 1)}
                      </div>
                      <div>
                        <div className="text-white font-bold text-lg">
                          {entry.username}
                        </div>
                        <div className="text-gray-300 text-sm">
                          Wave {entry.wave}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold text-2xl">
                        {entry.score.toLocaleString()}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Info Section */}
          <div className="mt-6 p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-yellow-500">
            <h3 className="text-yellow-400 font-bold mb-2">Leaderboard Info</h3>
            <p className="text-gray-300 text-sm">
              Compete globally and climb the ranks! Scores are stored on the TON blockchain 
              for permanent verification. Top players earn bragging rights and exclusive NFT rewards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
