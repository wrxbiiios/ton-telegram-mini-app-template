import React, { useState, useEffect } from 'react';
import { useTelegramWebApp, useTelegramUser } from '../../hooks/useTelegramWebApp';

interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  level: number;
  avatar?: string;
}

interface LeaderboardViewProps {
  onClose: () => void;
}

export function LeaderboardView({ onClose }: LeaderboardViewProps) {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'all-time'>('weekly');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const telegramWebApp = useTelegramWebApp();
  const user = useTelegramUser();

  useEffect(() => {
    // Fetch leaderboard data
    // TODO: Replace with actual API call
    const mockData: LeaderboardEntry[] = [
      { rank: 1, username: 'CyberKing', score: 25840, level: 15, avatar: '👑' },
      { rank: 2, username: 'NeonHunter', score: 22350, level: 14, avatar: '🎯' },
      { rank: 3, username: 'PixelWarrior', score: 19720, level: 13, avatar: '⚔️' },
      { rank: 4, username: 'LaserMaster', score: 17890, level: 12, avatar: '💎' },
      { rank: 5, username: 'VoidRunner', score: 15420, level: 11, avatar: '🌟' },
      { rank: 6, username: 'GlitchGod', score: 13680, level: 10, avatar: '⚡' },
      { rank: 7, username: 'ChromeKnight', score: 12150, level: 9, avatar: '🛡️' },
      { rank: 8, username: 'DataBreaker', score: 10920, level: 8, avatar: '🔮' },
      { rank: 9, username: 'NeoSamurai', score: 9450, level: 7, avatar: '🗡️' },
      { rank: 10, username: 'ByteBlade', score: 8230, level: 6, avatar: '💫' },
    ];
    
    setLeaderboard(mockData);
    setMyRank(15); // Mock user rank
  }, [timeframe]);

  const handleTimeframeChange = (newTimeframe: typeof timeframe) => {
    setTimeframe(newTimeframe);
    telegramWebApp?.HapticFeedback.selectionChanged();
  };

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-600 to-yellow-700';
    if (rank === 2) return 'from-gray-400 to-gray-500';
    if (rank === 3) return 'from-orange-600 to-orange-700';
    return 'from-gray-800 to-gray-900';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-900 to-black p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">🏆 Leaderboard</h2>
          <button
            onClick={onClose}
            className="text-3xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-800 active:scale-90 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Timeframe Selector */}
        <div className="grid grid-cols-3 gap-2 bg-gray-800 rounded-lg p-1">
          {(['daily', 'weekly', 'all-time'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => handleTimeframeChange(tf)}
              className={`py-2 rounded-md font-semibold text-sm transition-all ${
                timeframe === tf
                  ? 'bg-cyan-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tf === 'daily' && 'Daily'}
              {tf === 'weekly' && 'Weekly'}
              {tf === 'all-time' && 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Top 3 Podium */}
        <div className="mb-6">
          <div className="flex items-end justify-center gap-2 mb-4">
            {/* 2nd Place */}
            {leaderboard[1] && (
              <div className="flex flex-col items-center">
                <div className="text-4xl mb-2">{leaderboard[1].avatar || '🥈'}</div>
                <div className="bg-gradient-to-b from-gray-400 to-gray-500 rounded-t-lg px-4 py-3 text-center h-24 flex flex-col justify-center">
                  <div className="text-xl font-bold">🥈</div>
                  <div className="text-sm font-semibold truncate max-w-[80px]">
                    {leaderboard[1].username}
                  </div>
                  <div className="text-xs text-gray-200">{leaderboard[1].score.toLocaleString()}</div>
                </div>
              </div>
            )}

            {/* 1st Place */}
            {leaderboard[0] && (
              <div className="flex flex-col items-center -mt-4">
                <div className="text-5xl mb-2">{leaderboard[0].avatar || '👑'}</div>
                <div className="bg-gradient-to-b from-yellow-600 to-yellow-700 rounded-t-lg px-4 py-4 text-center h-32 flex flex-col justify-center">
                  <div className="text-2xl font-bold">🥇</div>
                  <div className="text-base font-bold truncate max-w-[90px]">
                    {leaderboard[0].username}
                  </div>
                  <div className="text-sm font-semibold">{leaderboard[0].score.toLocaleString()}</div>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {leaderboard[2] && (
              <div className="flex flex-col items-center">
                <div className="text-4xl mb-2">{leaderboard[2].avatar || '🥉'}</div>
                <div className="bg-gradient-to-b from-orange-600 to-orange-700 rounded-t-lg px-4 py-3 text-center h-20 flex flex-col justify-center">
                  <div className="text-xl font-bold">🥉</div>
                  <div className="text-sm font-semibold truncate max-w-[80px]">
                    {leaderboard[2].username}
                  </div>
                  <div className="text-xs text-gray-200">{leaderboard[2].score.toLocaleString()}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rest of Leaderboard */}
        <div className="space-y-2">
          {leaderboard.slice(3).map((entry) => (
            <div
              key={entry.rank}
              className="bg-gray-800 rounded-lg p-4 flex items-center justify-between hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="text-2xl font-bold text-gray-400 w-10 text-center">
                  #{entry.rank}
                </div>
                <div className="text-3xl">{entry.avatar || '👤'}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{entry.username}</div>
                  <div className="text-sm text-gray-400">Level {entry.level}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-cyan-400">{entry.score.toLocaleString()}</div>
                <div className="text-xs text-gray-400">points</div>
              </div>
            </div>
          ))}
        </div>

        {/* User's Rank */}
        {myRank && myRank > 10 && (
          <div className="mt-6 sticky bottom-0 bg-gradient-to-t from-black via-black to-transparent pt-4">
            <div className="bg-gradient-to-r from-cyan-900 to-purple-900 rounded-lg p-4 border-2 border-cyan-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold text-cyan-400">#{myRank}</div>
                  <div className="text-3xl">
                    {user?.photo_url ? (
                      <img src={user.photo_url} alt="You" className="w-10 h-10 rounded-full" />
                    ) : (
                      '👤'
                    )}
                  </div>
                  <div>
                    <div className="font-bold">You</div>
                    <div className="text-sm text-gray-300">
                      {user?.username || user?.first_name || 'Player'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-cyan-400">7,840</div>
                  <div className="text-xs text-gray-300">points</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-900 p-4 border-t border-gray-700">
        <button
          onClick={() => {
            telegramWebApp?.HapticFeedback.impactOccurred('medium');
            // Navigate to game
          }}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 py-4 rounded-xl font-bold text-lg active:scale-95 transition-transform"
        >
          🎮 CLIMB THE RANKS
        </button>
      </div>
    </div>
  );
}
