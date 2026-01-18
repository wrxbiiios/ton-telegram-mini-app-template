import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTelegramWebApp } from '../../hooks/useTelegramWebApp';
import { Joystick } from './Joystick';

interface GameCanvasProps {
  onGameOver: (finalScore: number, earnedXP: number) => void;
  wave: number;
  setWave: (wave: number) => void;
  health: number;
  setHealth: (health: number) => void;
  score: number;
  setScore: (score: number) => void;
}

interface GameObject {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface Player extends GameObject {
  angle: number;
  speed: number;
}

interface Enemy extends GameObject {
  health: number;
  maxHealth: number;
  type: 'drone' | 'trooper' | 'tank' | 'boss';
}

interface Bullet extends GameObject {
  damage: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

export function GameCanvas({ onGameOver, wave, setWave, health, setHealth, score, setScore }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isShooting, setIsShooting] = useState(false);
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });
  const telegramWebApp = useTelegramWebApp();
  
  const gameStateRef = useRef({
    player: { x: 0, y: 0, vx: 0, vy: 0, radius: 15, angle: 0, speed: 3 } as Player,
    enemies: [] as Enemy[],
    bullets: [] as Bullet[],
    particles: [] as Particle[],
    lastShot: 0,
    shootCooldown: 200,
    enemySpawnTimer: 0,
    waveEnemiesLeft: 5,
    waveComplete: false,
    lastDamageTime: 0, // Add damage cooldown tracking
    damageCooldown: 500, // 500ms immunity after taking damage
  });

  const spawnEnemy = useCallback((canvasWidth: number, canvasHeight: number) => {
    const types: Enemy['type'][] = ['drone', 'trooper', 'tank'];
    if (wave % 3 === 0) types.push('boss');
    
    const type = types[Math.floor(Math.random() * types.length)];
    const side = Math.floor(Math.random() * 4);
    let x, y;
    
    // Spawn from edges
    switch (side) {
      case 0: x = Math.random() * canvasWidth; y = -20; break;
      case 1: x = canvasWidth + 20; y = Math.random() * canvasHeight; break;
      case 2: x = Math.random() * canvasWidth; y = canvasHeight + 20; break;
      default: x = -20; y = Math.random() * canvasHeight;
    }

    const enemyConfig = {
      drone: { health: 20, radius: 10, speed: 2 },
      trooper: { health: 50, radius: 15, speed: 1.5 },
      tank: { health: 100, radius: 20, speed: 1 },
      boss: { health: 200, radius: 30, speed: 0.8 },
    };

    const config = enemyConfig[type];
    
    return {
      x, y,
      vx: 0, vy: 0,
      radius: config.radius,
      health: config.health,
      maxHealth: config.health,
      type,
    };
  }, [wave]);

  const createParticles = (x: number, y: number, color: string, count: number = 5) => {
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 30,
        color,
        size: Math.random() * 3 + 2,
      });
    }
    return particles;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = Math.min(container.clientWidth, 500);
        canvas.height = container.clientHeight;
        // Initialize player position
        gameStateRef.current.player.x = canvas.width / 2;
        gameStateRef.current.player.y = canvas.height / 2;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationFrameId: number;
    let lastTime = performance.now();

    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      const state = gameStateRef.current;
      const { player, enemies, bullets, particles } = state;

      // Clear canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid background
      ctx.strokeStyle = '#0a0a0a';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 30) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Update player movement
      player.vx = joystickPosition.x * player.speed;
      player.vy = joystickPosition.y * player.speed;
      player.x += player.vx;
      player.y += player.vy;

      // Keep player in bounds
      player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
      player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));

      // Spawn enemies
      if (state.waveEnemiesLeft > 0 && enemies.length < 6) {
        state.enemySpawnTimer += deltaTime;
        if (state.enemySpawnTimer > 2000) {
          enemies.push(spawnEnemy(canvas.width, canvas.height));
          state.waveEnemiesLeft--;
          state.enemySpawnTimer = 0;
        }
      }

      // Check for wave completion
      if (state.waveEnemiesLeft === 0 && enemies.length === 0 && !state.waveComplete) {
        state.waveComplete = true;
        setTimeout(() => {
          setWave(wave + 1);
          state.waveEnemiesLeft = Math.min(5 + wave, 8);
          state.waveComplete = false;
          telegramWebApp?.HapticFeedback.notificationOccurred('success');
        }, 2000);
      }

      // Auto-shoot
      if (isShooting && enemies.length > 0) {
        const now = currentTime;
        if (now - state.lastShot > state.shootCooldown) {
          // Find nearest enemy
          const nearestEnemy = enemies.reduce((nearest, enemy) => {
            const dx = enemy.x - player.x;
            const dy = enemy.y - player.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (!nearest.dist || dist < nearest.dist) {
              return { enemy, dist };
            }
            return nearest;
          }, {} as { enemy?: Enemy; dist?: number });

          if (nearestEnemy.enemy) {
            const dx = nearestEnemy.enemy.x - player.x;
            const dy = nearestEnemy.enemy.y - player.y;
            const angle = Math.atan2(dy, dx);
            const speed = 8;
            
            bullets.push({
              x: player.x,
              y: player.y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              radius: 4,
              damage: 10,
            });
            
            state.lastShot = now;
            player.angle = angle;
          }
        }
      }

      // Update enemies
      enemies.forEach((enemy) => {
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const speedMultiplier = enemy.type === 'drone' ? 2 : enemy.type === 'trooper' ? 1.5 : enemy.type === 'tank' ? 1 : 0.8;
        
        if (dist > 0) {
          enemy.vx = (dx / dist) * speedMultiplier;
          enemy.vy = (dy / dist) * speedMultiplier;
        }
        
        enemy.x += enemy.vx;
        enemy.y += enemy.vy;
      });

      // Update bullets
      for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;

        // Remove off-screen bullets
        if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
          bullets.splice(i, 1);
        }
      }

      // Collision: bullets vs enemies
      for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        for (let j = enemies.length - 1; j >= 0; j--) {
          const enemy = enemies[j];
          const dx = bullet.x - enemy.x;
          const dy = bullet.y - enemy.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < bullet.radius + enemy.radius) {
            enemy.health -= bullet.damage;
            bullets.splice(i, 1);
            particles.push(...createParticles(bullet.x, bullet.y, '#00ffff', 3));

            if (enemy.health <= 0) {
              enemies.splice(j, 1);
              const points = enemy.type === 'drone' ? 10 : enemy.type === 'trooper' ? 25 : enemy.type === 'tank' ? 50 : 100;
              setScore(score + points);
              particles.push(...createParticles(enemy.x, enemy.y, '#ff00ff', 10));
              telegramWebApp?.HapticFeedback.impactOccurred('light');
            }
            break;
          }
        }
      }

      // Collision: player vs enemies (with damage cooldown)
      const now = currentTime;
      enemies.forEach((enemy) => {
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < player.radius + enemy.radius && now - state.lastDamageTime > state.damageCooldown) {
          setHealth(health - 1);
          state.lastDamageTime = now;
          telegramWebApp?.HapticFeedback.impactOccurred('heavy');
          particles.push(...createParticles(player.x, player.y, '#ff0000', 5));
        }
      });

      // Check game over
      if (health <= 0) {
        onGameOver(score, Math.floor(score / 10));
        return;
      }

      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        if (p.life <= 0) {
          particles.splice(i, 1);
        }
      }

      // Draw particles
      particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 30;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Draw enemies
      enemies.forEach((enemy) => {
        const colors = {
          drone: '#00ff00',
          trooper: '#ffff00',
          tank: '#ff8800',
          boss: '#ff0000',
        };
        
        ctx.fillStyle = colors[enemy.type];
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Health bar
        const barWidth = enemy.radius * 2;
        const barHeight = 4;
        const healthPercent = enemy.health / enemy.maxHealth;
        
        ctx.fillStyle = '#333';
        ctx.fillRect(enemy.x - barWidth / 2, enemy.y - enemy.radius - 8, barWidth, barHeight);
        ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffff00' : '#ff0000';
        ctx.fillRect(enemy.x - barWidth / 2, enemy.y - enemy.radius - 8, barWidth * healthPercent, barHeight);
      });

      // Draw bullets
      ctx.fillStyle = '#00ffff';
      bullets.forEach((bullet) => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Trail
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bullet.x, bullet.y);
        ctx.lineTo(bullet.x - bullet.vx * 2, bullet.y - bullet.vy * 2);
        ctx.stroke();
      });

      // Draw player (cyberpunk skull)
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.rotate(player.angle);
      
      // Skull shape
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Eyes
      ctx.fillStyle = '#00ffff';
      ctx.beginPath();
      ctx.arc(-5, -3, 3, 0, Math.PI * 2);
      ctx.arc(5, -3, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Direction indicator
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(player.radius, 0);
      ctx.lineTo(player.radius + 10, 0);
      ctx.stroke();
      
      ctx.restore();

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [joystickPosition, isShooting, wave, health, score, onGameOver, setWave, setHealth, setScore, spawnEnemy, telegramWebApp]);

  const handleShootStart = () => {
    setIsShooting(true);
    telegramWebApp?.HapticFeedback.selectionChanged();
  };

  const handleShootEnd = () => {
    setIsShooting(false);
  };

  return (
    <div className="relative flex-1 flex flex-col bg-black">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
        style={{ touchAction: 'none' }}
      />
      
      {/* Touch Controls */}
      <div className="absolute bottom-4 left-4 z-10">
        <Joystick onMove={setJoystickPosition} />
      </div>
      
      <div 
        className="absolute bottom-4 right-4 w-24 h-24 bg-red-600 bg-opacity-50 rounded-full border-4 border-red-400 flex items-center justify-center text-4xl active:bg-opacity-80 transition-all z-10"
        onTouchStart={handleShootStart}
        onTouchEnd={handleShootEnd}
        onMouseDown={handleShootStart}
        onMouseUp={handleShootEnd}
        style={{ touchAction: 'none' }}
      >
        🔫
      </div>
    </div>
  );
}
