import { useEffect, useRef, useState, useCallback } from 'react';
import { Player, Enemy, Bullet, PowerUp, GameState, WeaponType, EnemyType } from '../types';
import { GAME_CONFIG, PLAYER_CONFIG, WEAPON_STATS, ENEMY_STATS } from '../constants';

export const useGameEngine = () => {
  const [gameState, setGameState] = useState<GameState>({
    players: new Map(),
    enemies: new Map(),
    bullets: new Map(),
    powerUps: new Map(),
    wave: 1,
    score: 0,
    isGameOver: false,
    isPaused: false,
    timeElapsed: 0,
  });

  const [localPlayer, setLocalPlayer] = useState<Player>({
    id: 'local',
    position: { x: GAME_CONFIG.CANVAS_WIDTH / 2, y: GAME_CONFIG.CANVAS_HEIGHT / 2 },
    velocity: { x: 0, y: 0 },
    health: PLAYER_CONFIG.MAX_HEALTH,
    maxHealth: PLAYER_CONFIG.MAX_HEALTH,
    score: 0,
    kills: 0,
    deaths: 0,
    level: 1,
    xp: 0,
    currentWeapon: WeaponType.PLASMA_RIFLE,
    rotation: 0,
    isAlive: true,
    username: 'Player',
  });

  const gameLoopRef = useRef<number>();
  const lastFireTimeRef = useRef<number>(0);
  const gameStateRef = useRef(gameState);
  
  // Keep ref in sync with state
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // Physics update
  const updatePhysics = useCallback((deltaTime: number) => {
    setGameState(prev => {
      // Skip physics if paused or game over
      if (prev.isPaused || prev.isGameOver) {
        return prev;
      }
      
      const newState = { ...prev };

      // Update bullets
      const bullets = new Map(prev.bullets);
      bullets.forEach((bullet, id) => {
        const newX = bullet.position.x + bullet.velocity.x * deltaTime;
        const newY = bullet.position.y + bullet.velocity.y * deltaTime;

        // Remove bullets out of bounds
        if (newX < 0 || newX > GAME_CONFIG.CANVAS_WIDTH || 
            newY < 0 || newY > GAME_CONFIG.CANVAS_HEIGHT) {
          bullets.delete(id);
        } else {
          bullets.set(id, {
            ...bullet,
            position: { x: newX, y: newY }
          });
        }
      });

      // Update enemies
      const enemies = new Map(prev.enemies);
      const players = new Map(prev.players);
      
      enemies.forEach((enemy, id) => {
        if (!enemy.isAlive) {
          enemies.delete(id);
          return;
        }

        // Simple AI: move towards nearest player
        let nearestPlayer: Player | null = null;
        let minDist = Infinity;
        
        players.forEach(player => {
          if (player.isAlive) {
            const dist = Math.hypot(
              player.position.x - enemy.position.x,
              player.position.y - enemy.position.y
            );
            if (dist < minDist) {
              minDist = dist;
              nearestPlayer = player;
            }
          }
        });

        if (nearestPlayer) {
          const dx = nearestPlayer.position.x - enemy.position.x;
          const dy = nearestPlayer.position.y - enemy.position.y;
          const dist = Math.hypot(dx, dy);

          if (dist > 0) {
            const vx = (dx / dist) * enemy.speed;
            const vy = (dy / dist) * enemy.speed;
            
            enemies.set(id, {
              ...enemy,
              position: {
                x: enemy.position.x + vx * deltaTime,
                y: enemy.position.y + vy * deltaTime
              },
              velocity: { x: vx, y: vy },
              targetId: nearestPlayer.id
            });
          }
        }
      });

      // Collision detection: bullets vs enemies
      bullets.forEach((bullet, bulletId) => {
        enemies.forEach((enemy, enemyId) => {
          const dist = Math.hypot(
            bullet.position.x - enemy.position.x,
            bullet.position.y - enemy.position.y
          );

          if (dist < 20) { // collision radius
            const newHealth = enemy.health - bullet.damage;
            
            if (newHealth <= 0) {
              enemies.set(enemyId, { ...enemy, isAlive: false, health: 0 });
              newState.score += 10;
            } else {
              enemies.set(enemyId, { ...enemy, health: newHealth });
            }

            if (!bullet.piercing) {
              bullets.delete(bulletId);
            }
          }
        });
      });

      return {
        ...newState,
        bullets,
        enemies,
        players,
        timeElapsed: prev.timeElapsed + deltaTime
      };
    });
  }, []);

  // Spawn enemies
  const spawnEnemies = useCallback((wave: number) => {
    setGameState(prev => {
      const enemyCount = Math.floor(5 + wave * 2);
      const newEnemies = new Map(prev.enemies);

      for (let i = 0; i < enemyCount; i++) {
        const type = wave % 5 === 0 ? EnemyType.BOSS : 
                     Math.random() > 0.7 ? EnemyType.HEAVY : 
                     Math.random() > 0.5 ? EnemyType.RANGED : EnemyType.MELEE;
      
      const stats = ENEMY_STATS[type];
      
      const edge = Math.floor(Math.random() * 4);
      let x, y;
      
      switch(edge) {
        case 0: x = Math.random() * GAME_CONFIG.CANVAS_WIDTH; y = -50; break;
        case 1: x = GAME_CONFIG.CANVAS_WIDTH + 50; y = Math.random() * GAME_CONFIG.CANVAS_HEIGHT; break;
        case 2: x = Math.random() * GAME_CONFIG.CANVAS_WIDTH; y = GAME_CONFIG.CANVAS_HEIGHT + 50; break;
        default: x = -50; y = Math.random() * GAME_CONFIG.CANVAS_HEIGHT;
      }

      const enemy: Enemy = {
        id: `enemy_${Date.now()}_${i}`,
        type,
        position: { x, y },
        velocity: { x: 0, y: 0 },
        health: stats.health * (1 + wave * 0.1),
        maxHealth: stats.health * (1 + wave * 0.1),
        damage: stats.damage,
        speed: stats.speed,
        isAlive: true
      };

        newEnemies.set(enemy.id, enemy);
      }

      return {
        ...prev,
        enemies: newEnemies,
        wave
      };
    });
  }, []);

  // Player shoot
  const shoot = useCallback((targetX: number, targetY: number) => {
    const now = Date.now();
    const weapon = WEAPON_STATS[localPlayer.currentWeapon];
    
    if (now - lastFireTimeRef.current < weapon.fireRate) {
      return;
    }

    lastFireTimeRef.current = now;

    const dx = targetX - localPlayer.position.x;
    const dy = targetY - localPlayer.position.y;
    const dist = Math.hypot(dx, dy);
    const speed = 10;

    const bullet: Bullet = {
      id: `bullet_${now}`,
      position: { ...localPlayer.position },
      velocity: { x: (dx / dist) * speed, y: (dy / dist) * speed },
      damage: weapon.damage,
      ownerId: localPlayer.id,
      weaponType: localPlayer.currentWeapon,
      createdAt: now,
      piercing: weapon.piercing
    };

    setGameState(prev => {
      const bullets = new Map(prev.bullets);
      bullets.set(bullet.id, bullet);
      return { ...prev, bullets };
    });
  }, [localPlayer]);

  // Move player
  const movePlayer = useCallback((keys: Set<string>) => {
    let vx = 0, vy = 0;
    
    if (keys.has('w') || keys.has('ArrowUp')) vy -= 1;
    if (keys.has('s') || keys.has('ArrowDown')) vy += 1;
    if (keys.has('a') || keys.has('ArrowLeft')) vx -= 1;
    if (keys.has('d') || keys.has('ArrowRight')) vx += 1;

    const length = Math.hypot(vx, vy);
    if (length > 0) {
      vx = (vx / length) * PLAYER_CONFIG.SPEED;
      vy = (vy / length) * PLAYER_CONFIG.SPEED;
    }

    setLocalPlayer(prev => ({
      ...prev,
      position: {
        x: Math.max(0, Math.min(GAME_CONFIG.CANVAS_WIDTH, prev.position.x + vx)),
        y: Math.max(0, Math.min(GAME_CONFIG.CANVAS_HEIGHT, prev.position.y + vy))
      },
      velocity: { x: vx, y: vy }
    }));
  }, []);

  // Game loop
  useEffect(() => {
    let lastTime = Date.now();
    
    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = (now - lastTime) / 1000;
      lastTime = now;

      updatePhysics(deltaTime);

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [updatePhysics]);

  // Initial enemy spawn - only run once on mount
  useEffect(() => {
    spawnEnemies(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    gameState,
    localPlayer,
    shoot,
    movePlayer,
    spawnEnemies,
    setGameState,
    setLocalPlayer
  };
};
