import React, { useEffect, useRef, useState } from 'react';
import { GameCanvas } from '../components/game/GameCanvas';
import { GameHUD } from '../components/game/GameHUD';
import { GameMenu } from '../components/game/GameMenu';
import { GameLobby } from '../components/game/GameLobby';
import { PostMatch } from '../components/game/PostMatch';
import { useTelegramWebApp } from '../hooks/useTelegramWebApp';

export type GameState = 'menu' | 'lobby' | 'playing' | 'paused' | 'game-over';

export function CyberpunkGame() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [health, setHealth] = useState(100);
  const [xp, setXP] = useState(0);
  const [level, setLevel] = useState(1);
  const telegramWebApp = useTelegramWebApp();

  useEffect(() => {
    // Initialize Telegram Web App
    if (telegramWebApp) {
      telegramWebApp.ready();
      telegramWebApp.expand();
      telegramWebApp.enableClosingConfirmation();
    }
  }, [telegramWebApp]);

  const handleStartGame = (mode: 'single' | 'coop' | 'practice') => {
    setGameState('playing');
    setScore(0);
    setWave(1);
    setHealth(100);
    
    // Haptic feedback
    if (telegramWebApp) {
      telegramWebApp.HapticFeedback.impactOccurred('medium');
    }
  };

  const handleGameOver = (finalScore: number, earnedXP: number) => {
    setScore(finalScore);
    setXP(prev => prev + earnedXP);
    setGameState('game-over');
    
    // Haptic feedback
    if (telegramWebApp) {
      telegramWebApp.HapticFeedback.notificationOccurred('error');
    }
  };

  const handleBackToMenu = () => {
    setGameState('menu');
  };

  const handleOpenLobby = () => {
    setGameState('lobby');
  };

  return (
    <div className="w-full h-screen bg-black text-white flex flex-col overflow-hidden">
      {gameState === 'menu' && (
        <GameMenu 
          onPlay={handleOpenLobby}
          level={level}
          xp={xp}
        />
      )}
      
      {gameState === 'lobby' && (
        <GameLobby 
          onStartGame={handleStartGame}
          onBack={handleBackToMenu}
        />
      )}
      
      {gameState === 'playing' && (
        <>
          <GameCanvas 
            onGameOver={handleGameOver}
            wave={wave}
            setWave={setWave}
            health={health}
            setHealth={setHealth}
            score={score}
            setScore={setScore}
          />
          <GameHUD 
            health={health}
            score={score}
            wave={wave}
          />
        </>
      )}
      
      {gameState === 'game-over' && (
        <PostMatch 
          score={score}
          xp={xp}
          level={level}
          onBackToMenu={handleBackToMenu}
          onRematch={handleOpenLobby}
        />
      )}
    </div>
  );
}
