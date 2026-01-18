import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { createGameConfig } from './config';
import { GameScene } from './GameScene';
import { NFTUpgrade } from './types';
import { io, Socket } from 'socket.io-client';

interface PhaserGameProps {
  nftUpgrades?: NFTUpgrade[];
  multiplayerEnabled?: boolean;
  onGameStateChange?: (state: any) => void;
}

export const PhaserGame: React.FC<PhaserGameProps> = ({ 
  nftUpgrades = [], 
  multiplayerEnabled = false,
  onGameStateChange 
}) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const [gameReady, setGameReady] = useState(false);

  useEffect(() => {
    if (gameRef.current) return;

    // Set up multiplayer socket if enabled
    if (multiplayerEnabled) {
      // WebSocket server URL - configurable via environment variable
      const wsUrl = import.meta.env.VITE_WS_SERVER_URL || 'ws://localhost:3001';
      
      socketRef.current = io(wsUrl, {
        autoConnect: false,
      });
      
      socketRef.current.on('connect', () => {
        console.log('Connected to multiplayer server');
      });

      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from multiplayer server');
      });
    }

    // Create game instance
    const config = createGameConfig(socketRef.current, nftUpgrades);
    gameRef.current = new Phaser.Game(config);

    // Pass initial data to the scene
    gameRef.current.events.once('ready', () => {
      const scene = gameRef.current!.scene.getScene('GameScene') as GameScene;
      if (scene) {
        scene.scene.restart({ socket: socketRef.current, nftUpgrades });
        setGameReady(true);
      }
    });

    // Set up game state listener
    const interval = setInterval(() => {
      if (gameRef.current && onGameStateChange) {
        const scene = gameRef.current.scene.getScene('GameScene') as GameScene;
        if (scene && scene.getGameState) {
          onGameStateChange(scene.getGameState());
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [multiplayerEnabled, nftUpgrades, onGameStateChange]);

  return (
    <div className="relative w-full flex justify-center items-center bg-black">
      <div id="phaser-game" className="rounded-lg overflow-hidden shadow-2xl" />
      {!gameReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="text-cyan-400 text-2xl font-bold animate-pulse">
            Loading Game...
          </div>
        </div>
      )}
    </div>
  );
};
