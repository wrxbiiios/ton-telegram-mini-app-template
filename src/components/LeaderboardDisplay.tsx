import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../types/level.types';
import { getLeaderboard, getGlobalLeaderboard, getPlayerRank } from '../utils/leaderboard';

interface LeaderboardDisplayProps {
  levelId?: string;
  playerId?: string;
  limit?: number;
  showGlobal?: boolean;
}

export const LeaderboardDisplay: React.FC<LeaderboardDisplayProps> = ({
  levelId,
  playerId,
  limit = 10,
  showGlobal = false
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [playerRank, setPlayerRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    if (showGlobal) {
      const globalEntries = getGlobalLeaderboard(limit);
      setEntries(globalEntries);
    } else if (levelId) {
      const leaderboard = getLeaderboard(levelId, limit);
      setEntries(leaderboard.entries);
      
      if (playerId) {
        const rank = getPlayerRank(levelId, playerId);
        setPlayerRank(rank);
      }
    }
    
    setLoading(false);
  }, [levelId, playerId, limit, showGlobal]);

  if (loading) {
    return (
      <div className="text-center text-gray-400 py-8">
        Loading leaderboard...
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No entries yet. Be the first to play!
      </div>
    );
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-300';
    if (rank === 3) return 'text-orange-400';
    return 'text-gray-400';
  };

  const getRankMedal = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">
          {showGlobal ? 'Global Leaderboard' : 'Level Leaderboard'}
        </h3>
        {playerRank && (
          <span className="text-purple-400 text-sm">
            Your Rank: #{playerRank}
          </span>
        )}
      </div>

      <div className="space-y-2">
        {entries.map((entry) => {
          const isPlayer = playerId === entry.playerId;
          
          return (
            <div
              key={`${entry.playerId}-${entry.timestamp}`}
              className={`flex items-center justify-between p-3 rounded ${
                isPlayer ? 'bg-purple-900 bg-opacity-50 border border-purple-500' : 'bg-gray-700'
              }`}
            >
              {/* Rank */}
              <div className={`w-12 font-bold ${getRankColor(entry.rank)}`}>
                {getRankMedal(entry.rank)}
              </div>

              {/* Player Name */}
              <div className="flex-1 ml-2">
                <div className="text-white font-medium">
                  {entry.playerName}
                  {isPlayer && <span className="ml-2 text-purple-400 text-xs">(You)</span>}
                </div>
                <div className="flex items-center space-x-3 text-xs text-gray-400">
                  <span>⭐ {entry.stars}</span>
                  {entry.time > 0 && <span>⏱️ {formatTime(entry.time)}s</span>}
                </div>
              </div>

              {/* Score */}
              <div className="text-right">
                <div className="text-white font-bold">{entry.score.toLocaleString()}</div>
                <div className="text-xs text-gray-400">points</div>
              </div>
            </div>
          );
        })}
      </div>

      {entries.length >= limit && (
        <div className="text-center text-gray-500 text-xs mt-3">
          Showing top {limit} players
        </div>
      )}
    </div>
  );
};

// Mini leaderboard for quick view
interface MiniLeaderboardProps {
  levelId: string;
  playerId?: string;
}

export const MiniLeaderboard: React.FC<MiniLeaderboardProps> = ({ levelId, playerId }) => {
  const [topThree, setTopThree] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const leaderboard = getLeaderboard(levelId, 3);
    setTopThree(leaderboard.entries);
  }, [levelId]);

  if (topThree.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 bg-opacity-50 rounded p-3 mb-4">
      <div className="text-xs text-gray-400 mb-2">Top Players</div>
      <div className="space-y-1">
        {topThree.map((entry) => (
          <div key={entry.playerId} className="flex justify-between text-xs">
            <span className={entry.playerId === playerId ? 'text-purple-400' : 'text-gray-300'}>
              {entry.rank}. {entry.playerName}
            </span>
            <span className="text-gray-400">{entry.score.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to format time
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : secs.toString();
}
