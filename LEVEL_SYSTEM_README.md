# Cyberpunk Shooter - Level Design System Documentation

## Overview

This implementation provides a comprehensive level design and procedural generation system for a Telegram-optimized cyberpunk shooter game with 60+ handcrafted levels, 7 unique themes, 6 epic boss battles, and advanced procedural generation capabilities.

## Features Implemented

### ✅ Core Level Architecture

- **60 Handcrafted Levels**: All levels pre-configured with progressive difficulty
- **Difficulty Scaling**: 
  - Easy (Levels 1-10): 3-5 enemies per wave, large arenas, generous resources
  - Medium (Levels 11-30): 6-10 enemies per wave, mixed challenges
  - Hard (Levels 31-50): 10-15 enemies per wave, complex layouts
  - Nightmare (Levels 51-60): 15-20 enemies per wave, extreme challenge
- **Boss Levels**: Special encounters at levels 10, 20, 30, 40, 50, and 60
- **Star Rating System**: 1-3 stars based on time and health performance

### ✅ Themed Environments (7 Themes)

1. **Neon Downtown** (Levels 1-8)
   - Cyberpunk city streets with neon aesthetics
   - Features: Spike traps, moving platforms

2. **Industrial Complex** (Levels 9-16)
   - Factory warehouses and machinery
   - Features: Electrical hazards, toxic gas, conveyor belts

3. **Underground Bunker** (Levels 17-24)
   - Military research facility
   - Features: Server rooms, ventilation systems

4. **Skyrise Tower** (Levels 25-32)
   - Rooftop combat scenarios
   - Features: Wind zones, falling debris, glass platforms

5. **Void Station** (Levels 33-40)
   - Space station with alien corruption
   - Features: Zero gravity, energy shields, portals

6. **Corrupted Wasteland** (Levels 41-50)
   - Post-apocalyptic desert
   - Features: Toxic clouds, lava pits, dimensional rifts

7. **Nightmare Realm** (Levels 51-60)
   - Reality-bending nightmare zone
   - Features: All hazard types, impossible geometry

### ✅ Boss Encounters (6 Unique Bosses)

1. **Neon Overlord** (Level 10) - 1000 HP, 3 phases
2. **Iron Sentinel** (Level 20) - 2000 HP, heavy armor
3. **Quantum Entity** (Level 30) - 3000 HP, phase shifting
4. **Sky Leviathan** (Level 40) - 4000 HP, aerial combat
5. **Void Abomination** (Level 50) - 5000 HP, cosmic horror
6. **Corrupted God** (Level 60) - 10000 HP, 4 phases, ultimate challenge

Each boss has:
- Multiple attack phases
- Unique attack patterns
- Minion summoning
- Progressive hazards
- Special rewards (XP, tokens, NFT chances)

### ✅ Procedural Generation System

- **Seeded Random Generation**: Same seed = same level (fairness)
- **Daily Challenges**: Auto-generated each day with shared seed
- **Weekly Challenges**: Harder weekly levels for competition
- **Configurable Parameters**:
  - Arena size (tight/medium/open)
  - Obstacle density
  - Hazard density
  - Enemy density
  - Resource density
- **Tilemap System**: 20x12 grid optimized for 375px screens

### ✅ Level Features & Mechanics

**8 Hazard Types**:
- Lava Pits (instant death)
- Toxic Gas (DoT + visibility reduction)
- Electrical Fields (stun + damage)
- Spike Traps (contact damage)
- Moving Platforms (timing-based)
- Falling Debris (random obstacles)
- Wind Zones (push effects)
- Freezing Areas (slow movement)

**8 Interactive Elements**:
- Destructible Walls
- Pressure Plates
- Conveyor Belts
- Elevators
- Force Fields
- Light Bridges
- Teleporters
- Vending Machines

**7 Enemy Types**:
- Drone (basic flying)
- Trooper (ground infantry)
- Heavy (armored tank)
- Sniper (long-range)
- Shield (defensive)
- Teleporter (mobile)
- Mini-Boss (elite)

### ✅ Meta Progression System

**Player Progress Tracking**:
- Current level position
- Maximum level reached
- Total stars earned
- Level completion tracking
- Per-level star ratings
- Prestige level & points

**Unlocking System**:
- Sequential unlock (beat N to unlock N+1)
- Star-based rewards at milestones
- Achievement tracking

**Prestige System**:
- Available after completing level 60
- Resets progress but grants prestige points
- Permanent bonuses from prestige

### ✅ Level Types

- **Story Levels**: Main campaign progression (60 levels)
- **Daily Challenge**: Procedurally generated, same for all players
- **Weekly Challenge**: Harder procedural levels
- **Boss Levels**: Special encounters every 10 levels
- **Challenge Levels**: Coming soon (time attack, survival, etc.)

### ✅ UI Components

**LevelSelector Component**:
- Grid-based level display
- Visual difficulty indicators
- Star rating display
- Lock/unlock status
- Theme-based color coding
- Boss level badges
- Filter options (all, unlocked, boss, completed)

**GamePage Component**:
- Main menu with progress overview
- Level selection interface
- Daily/weekly challenge access
- Quick stats dashboard
- Prestige system UI
- Level preview and details

## File Structure

```
src/
├── types/
│   └── level.types.ts          # TypeScript interfaces and types
├── data/
│   ├── themes.ts               # 7 theme definitions
│   ├── bosses.ts               # 6 boss configurations
│   └── levels.ts               # 60 handcrafted level definitions
├── utils/
│   ├── proceduralGenerator.ts  # Procedural level generation
│   └── levelUtils.ts           # Level management utilities
├── hooks/
│   └── useLevelSystem.ts       # React hook for level state
├── components/
│   └── LevelSelector.tsx       # Level selection UI
└── pages/
    └── GamePage.tsx            # Main game interface
```

## Usage Examples

### Using the Level System Hook

```typescript
import { useLevelSystem } from '../hooks/useLevelSystem';

function MyComponent() {
  const {
    progress,          // Player progress data
    currentLevel,      // Currently selected level
    dailyChallenge,    // Today's challenge
    weeklyChallenge,   // This week's challenge
    allLevels,         // All 60 levels
    selectLevel,       // Function to select a level
    completeLevel,     // Function to complete a level
    getAvailableLevels,// Get unlocked levels
    getNextLevel,      // Get recommended next level
    prestige,          // Prestige function
    canPrestige        // Can player prestige?
  } = useLevelSystem();
  
  // Select and play a level
  const playLevel = (levelNumber: number) => {
    if (selectLevel(levelNumber)) {
      // Level selected, start game
    }
  };
  
  // Complete a level
  const finishLevel = () => {
    const result = completeLevel(5, 120, 75, 5000);
    // result contains: stars, xpEarned, tokensEarned, bonusRewards
  };
}
```

### Generating Procedural Levels

```typescript
import { generateProceduralLevel, generateDailyChallenge } from '../utils/proceduralGenerator';

// Generate custom procedural level
const level = generateProceduralLevel({
  seed: 12345,
  difficulty: 'hard',
  theme: 'void_station',
  arenaSize: 'medium',
  obstacleDensity: 0.5,
  hazardDensity: 0.4,
  enemyDensity: 0.7,
  resourceDensity: 0.3
});

// Get today's daily challenge
const dailyLevel = generateDailyChallenge(new Date());
```

### Accessing Level Data

```typescript
import { LEVELS, getLevelByNumber, getBossLevels } from '../data/levels';
import { THEMES, getThemeByLevel } from '../data/themes';
import { BOSSES } from '../data/bosses';

// Get a specific level
const level5 = getLevelByNumber(5);

// Get all boss levels
const bossLevels = getBossLevels();

// Get theme for a level
const theme = getThemeByLevel(25); // Skyrise Tower

// Access boss data
const finalBoss = BOSSES.corrupted_god;
```

## Mobile Optimization

All levels are optimized for Telegram mini-apps:
- **Grid Size**: 20x12 tiles (375px width screens)
- **Max Obstacles**: 20 per level (performance)
- **Max Enemies**: 15 per wave (performance)
- **Load Time**: Target <2s per level
- **Touch Controls**: All UI designed for touch input
- **Responsive Design**: Adapts to various screen sizes

## Data Persistence

Player progress is automatically saved to `localStorage`:
- Key: `cyberpunk_shooter_progress`
- Auto-saves on every progress update
- Loaded on app initialization
- Can be reset for testing

## Future Enhancements

Phase 2 (Planned):
- Challenge level variants (Time Attack, Pacifist, etc.)
- Multiplayer level modes
- Level editor
- More boss types
- Seasonal events
- Community voting

## Integration with Game Engine

The level system is designed to integrate with any game engine. Each level provides:
- `tilemap`: String representation of the map grid
- `spawns`: Enemy spawn points
- `hazards`: Hazard positions and types
- `collectibles`: Item positions
- `waves`: Wave configuration with enemy counts and types
- `boss`: Boss configuration if applicable

Example integration:
```typescript
const level = getLevelByNumber(10);

// Use tilemap to render environment
renderTilemap(level.tilemap, level.gridSize);

// Spawn enemies for wave 1
const wave1 = level.waves[0];
spawnEnemies(wave1.enemyTypes, wave1.enemyCount, level.spawns);

// Place hazards
level.hazards.forEach(hazard => {
  createHazard(hazard.type, hazard.position, hazard.damage);
});

// Place collectibles
level.collectibles.forEach(item => {
  createCollectible(item.type, item.position, item.value);
});

// Boss level?
if (level.boss) {
  spawnBoss(level.boss, level.boss.phases[0]);
}
```

## Performance Considerations

- Object pooling recommended for enemies/projectiles
- Lazy load next level while playing current
- Use sprite batching for rendering
- Cull off-screen objects
- Cache level data
- Compress tilemaps with RLE if needed

## Testing

To test the level system:
1. Navigate to `/game` route
2. View progress overview
3. Select levels from level selector
4. Try daily/weekly challenges
5. Use browser dev tools to inspect localStorage
6. Reset progress for testing

## License

MIT License - Part of ton-telegram-mini-app-template
