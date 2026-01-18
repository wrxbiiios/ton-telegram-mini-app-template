import React, { useState } from 'react';
import { useTelegramWebApp, useTelegramUser } from '../../hooks/useTelegramWebApp';

interface GameLobbyProps {
  onStartGame: (mode: 'single' | 'coop' | 'practice') => void;
  onBack: () => void;
}

export function GameLobby({ onStartGame, onBack }: GameLobbyProps) {
  const [selectedMode, setSelectedMode] = useState<'single' | 'coop' | 'practice'>('single');
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
  const telegramWebApp = useTelegramWebApp();
  const user = useTelegramUser();

  const handleQuickMatch = () => {
    if (telegramWebApp) {
      telegramWebApp.HapticFeedback.impactOccurred('medium');
    }
    onStartGame(selectedMode);
  };

  const handleInviteFriend = () => {
    if (telegramWebApp) {
      telegramWebApp.HapticFeedback.selectionChanged();
      // Generate deep link for sharing
      const gameLink = `https://t.me/YourGameBot/app?startapp=room_${Date.now()}`;
      telegramWebApp.openTelegramLink(gameLink);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-black text-white p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="text-3xl mr-4 active:scale-90 transition-transform"
          style={{ minWidth: '48px', minHeight: '48px' }}
        >
          ←
        </button>
        <h2 className="text-2xl font-bold">Game Lobby</h2>
      </div>

      {/* Player Info */}
      {user && (
        <div className="bg-gray-800 rounded-lg p-4 mb-6 flex items-center">
          <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center text-2xl mr-4">
            {user.photo_url ? (
              <img src={user.photo_url} alt={user.first_name} className="w-full h-full rounded-full" />
            ) : (
              '👤'
            )}
          </div>
          <div>
            <div className="font-bold">{user.first_name}</div>
            <div className="text-sm text-gray-400">@{user.username || 'player'}</div>
          </div>
        </div>
      )}

      {/* Game Mode Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Game Mode</h3>
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => {
              setSelectedMode('single');
              telegramWebApp?.HapticFeedback.selectionChanged();
            }}
            className={`p-4 rounded-xl font-semibold text-left transition-all ${
              selectedMode === 'single' 
                ? 'bg-cyan-600 border-2 border-cyan-400' 
                : 'bg-gray-800 border-2 border-transparent'
            }`}
            style={{ minHeight: '60px' }}
          >
            <div className="text-lg">🎯 Campaign (10 Waves)</div>
            <div className="text-sm text-gray-300">Single-player progression</div>
          </button>
          
          <button
            onClick={() => {
              setSelectedMode('coop');
              telegramWebApp?.HapticFeedback.selectionChanged();
            }}
            className={`p-4 rounded-xl font-semibold text-left transition-all ${
              selectedMode === 'coop' 
                ? 'bg-cyan-600 border-2 border-cyan-400' 
                : 'bg-gray-800 border-2 border-transparent'
            }`}
            style={{ minHeight: '60px' }}
          >
            <div className="text-lg">👥 Co-op (2 Players)</div>
            <div className="text-sm text-gray-300">Play with a friend</div>
          </button>
          
          <button
            onClick={() => {
              setSelectedMode('practice');
              telegramWebApp?.HapticFeedback.selectionChanged();
            }}
            className={`p-4 rounded-xl font-semibold text-left transition-all ${
              selectedMode === 'practice' 
                ? 'bg-cyan-600 border-2 border-cyan-400' 
                : 'bg-gray-800 border-2 border-transparent'
            }`}
            style={{ minHeight: '60px' }}
          >
            <div className="text-lg">🎮 Practice vs AI</div>
            <div className="text-sm text-gray-300">Train without limits</div>
          </button>
        </div>
      </div>

      {/* Difficulty Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Difficulty</h3>
        <div className="grid grid-cols-3 gap-3">
          {(['easy', 'normal', 'hard'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => {
                setDifficulty(diff);
                telegramWebApp?.HapticFeedback.selectionChanged();
              }}
              className={`py-3 rounded-lg font-semibold transition-all ${
                difficulty === diff 
                  ? 'bg-cyan-600' 
                  : 'bg-gray-800'
              }`}
              style={{ minHeight: '48px' }}
            >
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto space-y-3">
        <button
          onClick={handleQuickMatch}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 py-5 rounded-xl font-bold text-xl transition-transform active:scale-95"
          style={{ minHeight: '70px' }}
        >
          {selectedMode === 'coop' ? '🔍 Find Partner' : '▶ START GAME'}
        </button>
        
        {selectedMode === 'coop' && (
          <button
            onClick={handleInviteFriend}
            className="w-full bg-gray-800 py-5 rounded-xl font-bold text-lg transition-transform active:scale-95"
            style={{ minHeight: '70px' }}
          >
            📤 Invite Friend via Telegram
          </button>
        )}
      </div>
    </div>
  );
}
