# Integration Examples

This document provides comprehensive examples of how to integrate the level design system into your game.

## Basic Level System Integration

### 1. Using the Level System Hook

```typescript
import React from 'react';
import { useLevelSystem } from '../hooks/useLevelSystem';
import { LevelSelector } from '../components/LevelSelector';

function GameComponent() {
  const {
    progress,
    currentLevel,
    dailyChallenge,
    selectLevel,
    completeLevel,
    getAvailableLevels
  } = useLevelSystem();

  const handleLevelComplete = (time: number, health: number, score: number) => {
    if (currentLevel) {
      const result = completeLevel(currentLevel.levelNumber, time, health, score);
      console.log('Level completed!', result);
      // result.stars, result.xpEarned, result.tokensEarned
    }
  };

  return (
    <div>
      <LevelSelector
        levels={getAvailableLevels()}
        progress={progress}
        onLevelSelect={selectLevel}
      />
    </div>
  );
}
```

### 2. Displaying Progress Statistics

```typescript
import React from 'react';
import { ProgressStats, CompactStats } from '../components/ProgressStats';
import { useLevelSystem } from '../hooks/useLevelSystem';

function ProfilePage() {
  const { progress } = useLevelSystem();

  return (
    <div>
      <h2>Your Progress</h2>
      <CompactStats progress={progress} />
      <ProgressStats progress={progress} />
    </div>
  );
}
```

### 3. Implementing Leaderboards

```typescript
import React from 'react';
import { LeaderboardDisplay, MiniLeaderboard } from '../components/LeaderboardDisplay';
import { submitScore } from '../utils/leaderboard';

function LevelEndScreen({ levelId, score, time, stars }: any) {
  const playerId = 'player123'; // Get from your auth system
  const playerName = 'PlayerName';

  React.useEffect(() => {
    // Submit score when level ends
    submitScore(levelId, playerId, playerName, score, time, stars);
  }, []);

  return (
    <div>
      <h2>Level Complete!</h2>
      <LeaderboardDisplay levelId={levelId} playerId={playerId} />
    </div>
  );
}
```

## Advanced Integrations

### 4. Challenge Modes

```typescript
import { createChallengeLevel, generateRandomChallenge } from '../utils/challengeModes';

// Create a time attack variant of level 5
const timeAttackLevel = createChallengeLevel(5, 'time_attack');

// Generate random daily challenge
const randomChallenge = generateRandomChallenge();

// Use in your game
function ChallengeMenu() {
  const [challenge, setChallenge] = useState(null);

  const loadRandomChallenge = () => {
    const newChallenge = generateRandomChallenge(['pacifist_mode']); // Exclude pacifist
    setChallenge(newChallenge);
  };

  return (
    <button onClick={loadRandomChallenge}>
      Play Random Challenge
    </button>
  );
}
```

### 5. Endless Mode

```typescript
import { createEndlessMode } from '../utils/challengeModes';

function EndlessGameMode() {
  const [endlessMode] = useState(() => createEndlessMode('medium'));
  const [currentWave, setCurrentWave] = useState(1);

  const nextWave = () => {
    const waveConfig = endlessMode.getNextWave();
    setCurrentWave(waveConfig.wave);
    
    console.log('Wave', waveConfig.wave);
    console.log('Difficulty', waveConfig.difficulty);
    console.log('Enemies', waveConfig.enemyCount);
    console.log('Modifiers', waveConfig.modifiers);
    
    // Spawn enemies based on waveConfig
  };

  return (
    <div>
      <h2>Wave {currentWave}</h2>
      <button onClick={nextWave}>Next Wave</button>
    </div>
  );
}
```

### 6. Roguelike Mode with Upgrades

```typescript
import { getRandomRoguelikeUpgrades, RoguelikeUpgrade } from '../utils/challengeModes';

function RoguelikeUpgradeScreen() {
  const [upgrades, setUpgrades] = useState<RoguelikeUpgrade[]>([]);
  const [selectedUpgrades, setSelectedUpgrades] = useState<RoguelikeUpgrade[]>([]);

  const showUpgradeChoice = () => {
    const choices = getRandomRoguelikeUpgrades(3);
    setUpgrades(choices);
  };

  const selectUpgrade = (upgrade: RoguelikeUpgrade) => {
    setSelectedUpgrades([...selectedUpgrades, upgrade]);
    // Apply upgrade effect to player
    applyUpgradeEffect(upgrade.effect);
  };

  return (
    <div className="upgrade-screen">
      <h2>Choose an Upgrade</h2>
      {upgrades.map(upgrade => (
        <div key={upgrade.id} className="upgrade-card">
          <h3>{upgrade.name}</h3>
          <span className={`rarity-${upgrade.rarity}`}>{upgrade.rarity}</span>
          <p>{upgrade.description}</p>
          <button onClick={() => selectUpgrade(upgrade)}>Select</button>
        </div>
      ))}
    </div>
  );
}
```

### 7. Procedural Level Generation

```typescript
import { 
  generateProceduralLevel, 
  generateDailyChallenge, 
  generateWeeklyChallenge,
  getWeekNumber 
} from '../utils/proceduralGenerator';

function ProceduralLevelDemo() {
  // Generate with custom config
  const customLevel = generateProceduralLevel({
    seed: 42,
    difficulty: 'hard',
    theme: 'void_station',
    arenaSize: 'tight',
    obstacleDensity: 0.6,
    hazardDensity: 0.5,
    enemyDensity: 0.8,
    resourceDensity: 0.3
  });

  // Today's daily challenge
  const daily = generateDailyChallenge(new Date());

  // This week's challenge
  const weekNum = getWeekNumber(new Date());
  const weekly = generateWeeklyChallenge(weekNum, 2026);

  return (
    <div>
      <button onClick={() => playLevel(daily)}>Play Daily</button>
      <button onClick={() => playLevel(weekly)}>Play Weekly</button>
    </div>
  );
}
```

## Game Engine Integration

### 8. Rendering a Level

```typescript
import { getLevelByNumber } from '../data/levels';

function GameRenderer({ levelNumber }: { levelNumber: number }) {
  const level = getLevelByNumber(levelNumber);
  
  if (!level) return null;

  // Parse tilemap
  const parseTilemap = (tilemap: string, cols: number) => {
    return tilemap.match(new RegExp(`.{1,${cols}}`, 'g')) || [];
  };

  const rows = parseTilemap(level.tilemap, level.gridSize.cols);
  const cellWidth = level.mapSize.width / level.gridSize.cols;
  const cellHeight = level.mapSize.height / level.gridSize.rows;

  return (
    <svg width={level.mapSize.width} height={level.mapSize.height}>
      {/* Render tilemap */}
      {rows.map((row, y) => 
        row.split('').map((cell, x) => {
          const fill = cell === '1' ? '#333' : cell === '2' ? '#555' : 'transparent';
          return (
            <rect
              key={`${x}-${y}`}
              x={x * cellWidth}
              y={y * cellHeight}
              width={cellWidth}
              height={cellHeight}
              fill={fill}
            />
          );
        })
      )}

      {/* Render hazards */}
      {level.hazards.map((hazard, i) => (
        <rect
          key={`hazard-${i}`}
          x={hazard.position.x}
          y={hazard.position.y}
          width={hazard.size.width}
          height={hazard.size.height}
          fill="red"
          opacity={0.5}
        />
      ))}

      {/* Render collectibles */}
      {level.collectibles.map((item, i) => (
        <circle
          key={`item-${i}`}
          cx={item.position.x}
          cy={item.position.y}
          r={10}
          fill="gold"
        />
      ))}

      {/* Render spawn points */}
      {level.spawns.map((spawn, i) => (
        <circle
          key={`spawn-${i}`}
          cx={spawn.x}
          cy={spawn.y}
          r={5}
          fill="blue"
        />
      ))}
    </svg>
  );
}
```

### 9. Wave Management

```typescript
import { Level, Wave } from '../types/level.types';

class WaveManager {
  private level: Level;
  private currentWaveIndex: number = 0;
  private enemiesRemaining: number = 0;

  constructor(level: Level) {
    this.level = level;
  }

  startWave(): Wave | null {
    if (this.currentWaveIndex >= this.level.waves.length) {
      return null; // All waves completed
    }

    const wave = this.level.waves[this.currentWaveIndex];
    this.enemiesRemaining = wave.enemyCount;

    // Spawn enemies
    wave.enemyTypes.forEach(type => {
      this.spawnEnemy(type);
    });

    // Activate hazards for this wave
    wave.hazards.forEach(hazardType => {
      this.activateHazard(hazardType);
    });

    return wave;
  }

  enemyDefeated(): void {
    this.enemiesRemaining--;
    
    if (this.enemiesRemaining <= 0) {
      this.currentWaveIndex++;
      // Trigger next wave or level complete
    }
  }

  private spawnEnemy(type: string): void {
    // Your enemy spawning logic
  }

  private activateHazard(type: string): void {
    // Your hazard activation logic
  }

  isComplete(): boolean {
    return this.currentWaveIndex >= this.level.waves.length && this.enemiesRemaining === 0;
  }

  getCurrentWave(): number {
    return this.currentWaveIndex + 1;
  }

  getTotalWaves(): number {
    return this.level.waves.length;
  }
}

// Usage
const level = getLevelByNumber(1);
const waveManager = new WaveManager(level);
waveManager.startWave();
```

### 10. Boss Battle System

```typescript
import { Boss, BossPhase } from '../types/level.types';

class BossController {
  private boss: Boss;
  private currentPhase: number = 0;
  private health: number;

  constructor(boss: Boss) {
    this.boss = boss;
    this.health = boss.health;
  }

  takeDamage(amount: number): void {
    this.health -= amount;
    
    // Check for phase transition
    const healthPercentage = (this.health / this.boss.health) * 100;
    const nextPhase = this.boss.phases.find(
      (phase, index) => 
        index > this.currentPhase && 
        healthPercentage <= phase.healthPercentage
    );

    if (nextPhase) {
      this.transitionToPhase(nextPhase);
    }
  }

  private transitionToPhase(phase: BossPhase): void {
    this.currentPhase = phase.phase - 1;
    
    // Change attack patterns
    console.log('Boss entering phase', phase.phase);
    console.log('New attacks:', phase.attackPatterns);
    
    // Spawn minions if defined
    phase.spawnMinions?.forEach(minionType => {
      this.spawnMinion(minionType);
    });

    // Activate phase hazards
    phase.hazards?.forEach(hazardType => {
      this.activateHazard(hazardType);
    });
  }

  private spawnMinion(type: string): void {
    // Spawn minion logic
  }

  private activateHazard(type: string): void {
    // Activate hazard logic
  }

  isDefeated(): boolean {
    return this.health <= 0;
  }

  getCurrentPhase(): BossPhase {
    return this.boss.phases[this.currentPhase];
  }

  getHealthPercentage(): number {
    return (this.health / this.boss.health) * 100;
  }
}

// Usage with a level
const level = getLevelByNumber(10); // Boss level
if (level.boss) {
  const bossController = new BossController(level.boss);
  // Use in your game loop
}
```

## Telegram Integration

### 11. Sharing Progress to Telegram

```typescript
import WebApp from '@twa-dev/sdk';

function shareToTelegram(progress: PlayerProgress, level: Level) {
  const message = `🎮 Just completed ${level.name}!\n` +
    `⭐ Stars: ${progress.levelStars[level.id] || 0}/3\n` +
    `🏆 Total Progress: ${progress.levelsCompleted.length}/60 levels\n` +
    `✨ Prestige Level: ${progress.prestigeLevel}\n\n` +
    `Can you beat my score?`;

  // Share to Telegram story/chat
  WebApp.shareToStory('https://your-game-url.com', {
    text: message
  });
}

// Share daily challenge
function shareDailyChallenge(score: number, rank: number) {
  const message = `🌟 Daily Challenge Complete!\n` +
    `Score: ${score}\n` +
    `Rank: #${rank}\n\n` +
    `Try to beat me!`;

  WebApp.shareToStory('https://your-game-url.com/daily', {
    text: message
  });
}
```

### 12. Telegram Group Leaderboard

```typescript
import WebApp from '@twa-dev/sdk';
import { getLeaderboard } from '../utils/leaderboard';

function TelegramGroupLeaderboard() {
  const chatId = WebApp.initDataUnsafe.chat?.id;
  
  // Filter leaderboard to only show group members
  const groupLeaderboard = getLeaderboard('daily_challenge')
    .entries.filter(entry => {
      // Check if player is in the Telegram group
      return isPlayerInGroup(entry.playerId, chatId);
    });

  return (
    <div>
      <h2>Group Leaderboard</h2>
      {groupLeaderboard.map(entry => (
        <div key={entry.playerId}>
          {entry.rank}. {entry.playerName} - {entry.score}
        </div>
      ))}
    </div>
  );
}
```

## Complete Example: Full Game Flow

```typescript
import React, { useState } from 'react';
import { useLevelSystem } from '../hooks/useLevelSystem';
import { LevelSelector } from '../components/LevelSelector';
import { ProgressStats } from '../components/ProgressStats';
import { LeaderboardDisplay } from '../components/LeaderboardDisplay';
import { submitScore } from '../utils/leaderboard';

function CompleteGameExample() {
  const {
    progress,
    currentLevel,
    selectLevel,
    completeLevel,
    allLevels
  } = useLevelSystem();

  const [gameState, setGameState] = useState<'menu' | 'playing' | 'complete'>('menu');
  const [gameTime, setGameTime] = useState(0);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [score, setScore] = useState(0);

  // Start playing a level
  const startLevel = (levelNumber: number) => {
    if (selectLevel(levelNumber)) {
      setGameState('playing');
      setGameTime(0);
      setPlayerHealth(100);
      setScore(0);
    }
  };

  // End level
  const endLevel = () => {
    if (!currentLevel) return;

    const result = completeLevel(
      currentLevel.levelNumber,
      gameTime,
      playerHealth,
      score
    );

    // Submit to leaderboard
    submitScore(
      currentLevel.id,
      'player123',
      'PlayerName',
      score,
      gameTime,
      result?.stars || 0
    );

    setGameState('complete');
  };

  if (gameState === 'menu') {
    return (
      <div>
        <ProgressStats progress={progress} />
        <LevelSelector
          levels={allLevels}
          progress={progress}
          onLevelSelect={startLevel}
        />
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div>
        <h2>Playing: {currentLevel?.name}</h2>
        <div>Time: {gameTime}s</div>
        <div>Health: {playerHealth}%</div>
        <div>Score: {score}</div>
        {/* Your game rendering here */}
        <button onClick={endLevel}>Complete Level</button>
      </div>
    );
  }

  if (gameState === 'complete' && currentLevel) {
    return (
      <div>
        <h2>Level Complete!</h2>
        <LeaderboardDisplay 
          levelId={currentLevel.id} 
          playerId="player123"
        />
        <button onClick={() => setGameState('menu')}>
          Back to Menu
        </button>
      </div>
    );
  }

  return null;
}
```

## Performance Tips

1. **Lazy Load Levels**: Only load level data when needed
2. **Cache Parsed Tilemaps**: Parse once, reuse
3. **Object Pooling**: Reuse enemy/projectile objects
4. **Batch Rendering**: Group similar objects for efficient rendering
5. **Limit Active Entities**: Max 15 enemies, 20 obstacles per mobile
6. **Progressive Loading**: Load next level while playing current

## Testing

```typescript
// Reset progress for testing
import { useLevelSystem } from '../hooks/useLevelSystem';

function TestingTools() {
  const { resetProgress, prestige } = useLevelSystem();

  return (
    <div>
      <button onClick={resetProgress}>Reset All Progress</button>
      <button onClick={prestige}>Force Prestige</button>
    </div>
  );
}
```
