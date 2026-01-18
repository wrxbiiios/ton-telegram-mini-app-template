import React from 'react';
import { GameMode } from '../game/types';

interface GameMenuProps {
  onStartGame: (mode: GameMode, multiplayer: boolean) => void;
  onShowNFTs: () => void;
  onShowLeaderboard: () => void;
}

export const GameMenu: React.FC<GameMenuProps> = ({ onStartGame, onShowNFTs, onShowLeaderboard }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-black flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Title */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600 animate-pulse">
            CYBER SKULL
          </h1>
          <h2 className="text-2xl text-cyan-400 font-semibold tracking-widest">
            SHOOTER
          </h2>
          <p className="text-gray-400 text-sm">
            NFT-Powered Multiplayer Combat on TON Blockchain
          </p>
        </div>

        {/* Game Modes */}
        <div className="space-y-4">
          <h3 className="text-xl text-pink-400 font-bold text-center mb-4">SELECT GAME MODE</h3>
          
          <div className="grid grid-cols-1 gap-4">
            {/* Single Player - Wave Survival */}
            <button
              onClick={() => onStartGame({ type: 'wave-survival', maxPlayers: 1 }, false)}
              className="group relative bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 border-2 border-cyan-400 shadow-lg hover:shadow-cyan-500/50"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="text-lg">🎯 Wave Survival (Solo)</div>
                  <div className="text-xs text-gray-200 mt-1">Survive endless enemy waves alone</div>
                </div>
                <div className="text-3xl group-hover:animate-bounce">▶</div>
              </div>
            </button>

            {/* Multiplayer - Team Deathmatch */}
            <button
              onClick={() => onStartGame({ type: 'team-deathmatch', maxPlayers: 4 }, true)}
              className="group relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 border-2 border-pink-400 shadow-lg hover:shadow-pink-500/50"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="text-lg">👥 Team Deathmatch (2-4 Players)</div>
                  <div className="text-xs text-gray-200 mt-1">Cooperate against AI enemies</div>
                </div>
                <div className="text-3xl group-hover:animate-bounce">▶</div>
              </div>
            </button>

            {/* Multiplayer - Free for All */}
            <button
              onClick={() => onStartGame({ type: 'free-for-all', maxPlayers: 4 }, true)}
              className="group relative bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 border-2 border-red-400 shadow-lg hover:shadow-red-500/50"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="text-lg">⚔️ Free for All (2-4 Players)</div>
                  <div className="text-xs text-gray-200 mt-1">Compete against other players</div>
                </div>
                <div className="text-3xl group-hover:animate-bounce">▶</div>
              </div>
            </button>
          </div>
        </div>

        {/* Additional Options */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onShowNFTs}
            className="bg-purple-800 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all border border-purple-500 shadow-lg hover:shadow-purple-500/50"
          >
            <div className="text-sm">🎨 NFT Inventory</div>
          </button>
          
          <button
            onClick={onShowLeaderboard}
            className="bg-yellow-800 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition-all border border-yellow-500 shadow-lg hover:shadow-yellow-500/50"
          >
            <div className="text-sm">🏆 Leaderboard</div>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-xs space-y-1">
          <p>Connect your TON wallet to unlock NFT upgrades</p>
          <p className="text-cyan-500">Powered by TON Blockchain</p>
        </div>
      </div>
    </div>
  );
};
