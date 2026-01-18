import React, { useEffect, useRef, useState } from 'react';
import { useGameEngine } from '../hooks/useGameEngine';
import { GAME_CONFIG } from '../constants';
import GameHUD from './GameHUD';
import GameMenu from './GameMenu';

const CyberpunkShooterGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [gameStarted, setGameStarted] = useState(false);

  const { gameState, localPlayer, shoot, movePlayer, spawnEnemies } = useGameEngine();

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => new Set(prev).add(e.key.toLowerCase()));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => {
        const newKeys = new Set(prev);
        newKeys.delete(e.key.toLowerCase());
        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Mouse handling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };

    const handleMouseClick = (e: MouseEvent) => {
      if (!gameStarted) return;
      const rect = canvas.getBoundingClientRect();
      shoot(e.clientX - rect.left, e.clientY - rect.top);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleMouseClick);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleMouseClick);
    };
  }, [shoot, gameStarted]);

  // Player movement
  useEffect(() => {
    if (gameStarted) {
      movePlayer(keys);
    }
  }, [keys, gameStarted]);

  // Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);

    // Draw grid (cyberpunk aesthetic)
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x < GAME_CONFIG.CANVAS_WIDTH; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, GAME_CONFIG.CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y < GAME_CONFIG.CANVAS_HEIGHT; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(GAME_CONFIG.CANVAS_WIDTH, y);
      ctx.stroke();
    }

    if (!gameStarted) return;

    // Draw bullets
    gameState.bullets.forEach(bullet => {
      ctx.fillStyle = '#00ffff';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00ffff';
      ctx.beginPath();
      ctx.arc(bullet.position.x, bullet.position.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw enemies
    gameState.enemies.forEach(enemy => {
      if (!enemy.isAlive) return;

      // Enemy body
      const colors = {
        melee: '#ff0066',
        ranged: '#ff9900',
        heavy: '#cc0000',
        mini_boss: '#ff00ff',
        boss: '#ff0000'
      };

      ctx.fillStyle = colors[enemy.type] || '#ff0066';
      ctx.shadowBlur = 15;
      ctx.shadowColor = colors[enemy.type] || '#ff0066';
      ctx.beginPath();
      ctx.arc(enemy.position.x, enemy.position.y, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Health bar
      const healthBarWidth = 30;
      const healthBarHeight = 4;
      const healthPercent = enemy.health / enemy.maxHealth;

      ctx.fillStyle = '#333';
      ctx.fillRect(
        enemy.position.x - healthBarWidth / 2,
        enemy.position.y - 25,
        healthBarWidth,
        healthBarHeight
      );

      ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffff00' : '#ff0000';
      ctx.fillRect(
        enemy.position.x - healthBarWidth / 2,
        enemy.position.y - 25,
        healthBarWidth * healthPercent,
        healthBarHeight
      );
    });

    // Draw player
    if (localPlayer.isAlive) {
      // Player rotation
      const dx = mousePos.x - localPlayer.position.x;
      const dy = mousePos.y - localPlayer.position.y;
      const angle = Math.atan2(dy, dx);

      ctx.save();
      ctx.translate(localPlayer.position.x, localPlayer.position.y);
      ctx.rotate(angle);

      // Player body (cyberpunk skull)
      ctx.fillStyle = '#00ff00';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#00ff00';
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Weapon
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(15, 0);
      ctx.lineTo(35, 0);
      ctx.stroke();

      ctx.restore();

      // Player name
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(localPlayer.username, localPlayer.position.x, localPlayer.position.y - 30);
    }

    // Draw crosshair
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(mousePos.x - 10, mousePos.y);
    ctx.lineTo(mousePos.x + 10, mousePos.y);
    ctx.moveTo(mousePos.x, mousePos.y - 10);
    ctx.lineTo(mousePos.x, mousePos.y + 10);
    ctx.stroke();

  }, [gameState, localPlayer, mousePos, gameStarted]);

  const handleStartGame = () => {
    setGameStarted(true);
    spawnEnemies(1);
  };

  return (
    <div className="relative w-full h-screen bg-black flex items-center justify-center">
      {!gameStarted && <GameMenu onStart={handleStartGame} />}
      
      <canvas
        ref={canvasRef}
        width={GAME_CONFIG.CANVAS_WIDTH}
        height={GAME_CONFIG.CANVAS_HEIGHT}
        className="border-2 border-cyan-500 shadow-lg shadow-cyan-500/50"
        style={{ imageRendering: 'pixelated' }}
      />

      {gameStarted && (
        <GameHUD
          health={localPlayer.health}
          maxHealth={localPlayer.maxHealth}
          score={gameState.score}
          wave={gameState.wave}
          kills={localPlayer.kills}
          weapon={localPlayer.currentWeapon}
        />
      )}

      {gameState.isGameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="bg-gradient-to-br from-purple-900 to-black p-8 rounded-lg border-2 border-purple-500 text-center">
            <h2 className="text-4xl font-bold text-purple-400 mb-4">GAME OVER</h2>
            <p className="text-2xl text-white mb-2">Final Score: {gameState.score}</p>
            <p className="text-xl text-cyan-400 mb-6">Wave: {gameState.wave}</p>
            <button
              onClick={handleStartGame}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg border-2 border-purple-400"
            >
              RESTART
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CyberpunkShooterGame;
