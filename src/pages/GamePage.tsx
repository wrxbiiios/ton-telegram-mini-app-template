import React, { useState, useCallback } from 'react';
import { PhaserGame } from '../game/PhaserGame';
import { GameHUD } from '../components/GameHUD';
import { GameMenu } from '../components/GameMenu';
import { NFTInventory } from '../components/NFTInventory';
import { Leaderboard } from '../components/Leaderboard';
import { GameMode, GameState, NFTUpgrade, LeaderboardEntry } from '../game/types';
import { useTonConnect } from '../hooks/useTonConnect';

export function GamePage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [showNFTInventory, setShowNFTInventory] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [multiplayerEnabled, setMultiplayerEnabled] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    health: 100,
    wave: 1,
    playerPosition: { x: 400, y: 300 },
  });

  const { connected, wallet } = useTonConnect();

  // Mock NFT data - in production, this would be fetched from the TON blockchain
  const [nftUpgrades] = useState<NFTUpgrade[]>([
    {
      id: '1',
      type: 'weapon',
      name: 'Cyber Blaster',
      description: 'Increases damage and fire rate',
      bonus: { damage: 0.5, fireRate: 0.3 },
    },
    {
      id: '2',
      type: 'armor',
      name: 'Neon Shield',
      description: 'Provides extra health protection',
      bonus: { health: 50 },
    },
    {
      id: '3',
      type: 'ability',
      name: 'Rapid Fire Module',
      description: 'Dramatically increases fire rate',
      bonus: { fireRate: 0.8 },
    },
  ]);

  // Mock leaderboard data - in production, this would be fetched from TON blockchain
  const [leaderboardEntries] = useState<LeaderboardEntry[]>([
    { username: 'CyberWarrior', score: 15000, wave: 15, timestamp: Date.now() - 3600000 },
    { username: 'NeonKnight', score: 12500, wave: 12, timestamp: Date.now() - 7200000 },
    { username: 'SkullMaster', score: 10000, wave: 10, timestamp: Date.now() - 10800000 },
    { username: 'PixelHero', score: 8500, wave: 8, timestamp: Date.now() - 14400000 },
    { username: 'TonGamer', score: 7000, wave: 7, timestamp: Date.now() - 18000000 },
  ]);

  const handleStartGame = useCallback((mode: GameMode, multiplayer: boolean) => {
    setGameMode(mode);
    setMultiplayerEnabled(multiplayer);
    setGameStarted(true);
  }, []);

  const handleShowNFTs = useCallback(() => {
    setShowNFTInventory(true);
  }, []);

  const handleShowLeaderboard = useCallback(() => {
    setShowLeaderboard(true);
  }, []);

  const handleGameStateChange = useCallback((state: GameState) => {
    setGameState(state);
  }, []);

  const handleBackToMenu = useCallback(() => {
    setGameStarted(false);
    setGameMode(null);
    setMultiplayerEnabled(false);
  }, []);

  // Calculate NFT bonuses for HUD display
  const nftBonuses = nftUpgrades.reduce((acc, nft) => {
    return {
      damage: (acc.damage || 0) + (nft.bonus.damage || 0),
      fireRate: (acc.fireRate || 0) + (nft.bonus.fireRate || 0),
      health: (acc.health || 0) + (nft.bonus.health || 0),
      speed: (acc.speed || 0) + (nft.bonus.speed || 0),
    };
  }, {} as any);

  if (!gameStarted) {
    return (
      <>
        <GameMenu
          onStartGame={handleStartGame}
          onShowNFTs={handleShowNFTs}
          onShowLeaderboard={handleShowLeaderboard}
        />
        {showNFTInventory && (
          <NFTInventory
            nfts={nftUpgrades}
            onClose={() => setShowNFTInventory(false)}
          />
        )}
        {showLeaderboard && (
          <Leaderboard
            entries={leaderboardEntries}
            onClose={() => setShowLeaderboard(false)}
          />
        )}
      </>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-black">
      {/* Game HUD Overlay */}
      <GameHUD
        gameState={gameState}
        nftBonuses={nftBonuses}
        connectedPlayers={multiplayerEnabled ? 1 : 1}
      />

      {/* Phaser Game Canvas */}
      <div className="flex items-center justify-center min-h-screen">
        <PhaserGame
          nftUpgrades={nftUpgrades}
          multiplayerEnabled={multiplayerEnabled}
          onGameStateChange={handleGameStateChange}
        />
      </div>

      {/* Pause/Menu Button */}
      <button
        onClick={handleBackToMenu}
        className="absolute bottom-4 right-4 bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg border-2 border-red-400 shadow-lg z-20 pointer-events-auto"
      >
        🏠 Menu
      </button>

      {/* Wallet Connection Status */}
      {!connected && (
        <div className="absolute top-4 right-4 bg-yellow-600 bg-opacity-90 text-white px-4 py-2 rounded-lg border border-yellow-400 text-sm z-20 pointer-events-none">
          ⚠️ Connect wallet for NFT upgrades
        </div>
      )}
      {connected && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-600 bg-opacity-90 text-white px-4 py-2 rounded-lg border border-green-400 text-sm z-20 pointer-events-none">
          ✅ Wallet: {wallet?.slice(0, 6)}...{wallet?.slice(-4)}
        </div>
      )}
    </div>
  );
}
