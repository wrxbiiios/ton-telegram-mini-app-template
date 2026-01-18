import React from 'react';

interface GameMenuProps {
  onStart: () => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ onStart }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black via-purple-900/30 to-black z-10">
      <div className="max-w-2xl w-full p-8 text-center">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
            CYBERPUNK
          </h1>
          <h2 className="text-4xl font-bold text-white mb-4">NFT SHOOTER</h2>
          <div className="flex justify-center gap-2 mb-4">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <p className="text-gray-400 text-lg">Survive waves of enemies. Earn NFTs. Dominate the leaderboard.</p>
        </div>

        {/* Menu Options */}
        <div className="space-y-4 mb-8">
          <button
            onClick={onStart}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-lg border-2 border-purple-400 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-purple-500/50"
          >
            <span className="text-2xl">▶ START GAME</span>
          </button>

          <button className="w-full bg-black/50 hover:bg-black/70 text-white font-bold py-3 px-8 rounded-lg border-2 border-cyan-500 transform hover:scale-105 transition-all duration-200">
            🎮 MULTIPLAYER
          </button>

          <button className="w-full bg-black/50 hover:bg-black/70 text-white font-bold py-3 px-8 rounded-lg border-2 border-cyan-500 transform hover:scale-105 transition-all duration-200">
            🏆 LEADERBOARD
          </button>

          <button className="w-full bg-black/50 hover:bg-black/70 text-white font-bold py-3 px-8 rounded-lg border-2 border-cyan-500 transform hover:scale-105 transition-all duration-200">
            🎨 NFT COLLECTION
          </button>
        </div>

        {/* Controls */}
        <div className="bg-black/50 p-4 rounded-lg border border-cyan-500">
          <h3 className="text-cyan-400 font-bold mb-3">CONTROLS</h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <span className="text-cyan-400">WASD / Arrows:</span> Move
            </div>
            <div>
              <span className="text-cyan-400">Mouse:</span> Aim
            </div>
            <div>
              <span className="text-cyan-400">Click:</span> Shoot
            </div>
            <div>
              <span className="text-cyan-400">1-8:</span> Switch Weapon
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="mt-6 flex items-center justify-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-400">Connected to TON Network</span>
        </div>
      </div>
    </div>
  );
};

export default GameMenu;
