import { Level, ChallengeType, LevelModifier } from '../types/level.types';
import { getLevelByNumber } from '../data/levels';

// Create a challenge variant of an existing level
export function createChallengeLevel(
  baseLevelNumber: number,
  challengeType: ChallengeType,
  modifiers?: LevelModifier[]
): Level | null {
  const baseLevel = getLevelByNumber(baseLevelNumber);
  if (!baseLevel) return null;

  const challengeLevel: Level = {
    ...baseLevel,
    id: `${baseLevel.id}_${challengeType}`,
    name: `${baseLevel.name} - ${formatChallengeName(challengeType)}`,
    levelType: 'challenge',
    challengeType,
    modifiers: modifiers || getDefaultModifiersForChallenge(challengeType)
  };

  // Apply challenge-specific modifications
  switch (challengeType) {
    case 'time_attack':
      challengeLevel.waves = challengeLevel.waves.map(wave => ({
        ...wave,
        timeLimit: Math.floor((wave.timeLimit || 180) * 0.5) // Half the time
      }));
      challengeLevel.starRequirements = {
        ...challengeLevel.starRequirements,
        oneStarTime: 60,
        twoStarTime: 45,
        threeStarTime: 30
      };
      break;

    case 'survival_gauntlet':
      // Double the waves
      challengeLevel.waves = [
        ...challengeLevel.waves,
        ...challengeLevel.waves.map(wave => ({
          ...wave,
          wave: wave.wave + challengeLevel.waves.length,
          enemyCount: Math.min(wave.enemyCount + 5, 15)
        }))
      ];
      break;

    case 'pacifist_mode':
      // No direct combat - must avoid or use environment
      challengeLevel.modifiers = [...(challengeLevel.modifiers || []), 'no_ammo'];
      challengeLevel.description = 'Complete without killing any enemies';
      break;

    case 'one_hit_challenge':
      challengeLevel.description = 'One hit and you\'re done!';
      challengeLevel.starRequirements = {
        oneStarHealth: 100,
        twoStarHealth: 100,
        threeStarHealth: 100
      };
      break;

    case 'inverted':
      // Reverse enemy AI behavior
      challengeLevel.description = 'Enemies behave unpredictably';
      break;

    case 'mirror_mode':
      challengeLevel.modifiers = [...(challengeLevel.modifiers || []), 'mirror_mode'];
      challengeLevel.description = 'Everything is mirrored!';
      break;

    case 'speedrun_mode':
      challengeLevel.modifiers = [...(challengeLevel.modifiers || []), 'fast_forward'];
      challengeLevel.waves = challengeLevel.waves.map(wave => ({
        ...wave,
        timeLimit: Math.floor((wave.timeLimit || 180) * 0.7)
      }));
      break;
  }

  // Increase rewards for challenge modes
  challengeLevel.rewards = {
    baseXp: baseLevel.rewards.baseXp * 2,
    baseTokens: baseLevel.rewards.baseTokens * 2,
    bonusRewards: [
      ...(baseLevel.rewards.bonusRewards || []),
      { type: 'challenge_medal', value: 1 }
    ]
  };

  return challengeLevel;
}

function formatChallengeName(type: ChallengeType): string {
  const names: Record<ChallengeType, string> = {
    time_attack: 'Time Attack',
    survival_gauntlet: 'Survival Gauntlet',
    pacifist_mode: 'Pacifist',
    one_hit_challenge: 'One Hit',
    inverted: 'Inverted',
    mirror_mode: 'Mirror',
    speedrun_mode: 'Speedrun'
  };
  return names[type];
}

function getDefaultModifiersForChallenge(type: ChallengeType): LevelModifier[] {
  const modifiers: Record<ChallengeType, LevelModifier[]> = {
    time_attack: ['double_xp'],
    survival_gauntlet: ['armored_enemies', 'token_bonus'],
    pacifist_mode: ['no_ammo', 'streak_multiplier'],
    one_hit_challenge: ['rare_drop_boost'],
    inverted: ['floating_enemies'],
    mirror_mode: ['mirror_mode', 'double_xp'],
    speedrun_mode: ['fast_forward', 'token_bonus']
  };
  return modifiers[type] || [];
}

// Generate a random challenge for rotation
export function generateRandomChallenge(excludeTypes?: ChallengeType[]): Level | null {
  const allChallengeTypes: ChallengeType[] = [
    'time_attack',
    'survival_gauntlet',
    'pacifist_mode',
    'one_hit_challenge',
    'inverted',
    'mirror_mode',
    'speedrun_mode'
  ];

  const availableTypes = excludeTypes 
    ? allChallengeTypes.filter(t => !excludeTypes.includes(t))
    : allChallengeTypes;

  if (availableTypes.length === 0) return null;

  const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
  const randomLevel = Math.floor(Math.random() * 50) + 1; // Levels 1-50

  return createChallengeLevel(randomLevel, randomType);
}

// Apply modifiers to enhance difficulty/rewards
export function applyModifier(level: Level, modifier: LevelModifier): Level {
  const modifiedLevel = { ...level };
  
  if (!modifiedLevel.modifiers) {
    modifiedLevel.modifiers = [];
  }
  
  if (!modifiedLevel.modifiers.includes(modifier)) {
    modifiedLevel.modifiers.push(modifier);
  }

  // Adjust rewards based on modifier
  const rewardMultipliers: Partial<Record<LevelModifier, number>> = {
    double_spawns: 1.5,
    armored_enemies: 1.3,
    faster_enemies: 1.2,
    invisible_enemies: 1.8,
    chain_explosion: 1.4,
    no_ammo: 2.0,
    limited_vision: 1.6,
    one_hit_challenge: 3.0,
    double_xp: 2.0,
    token_bonus: 1.5,
    rare_drop_boost: 1.3,
    streak_multiplier: 1.4
  };

  const multiplier = rewardMultipliers[modifier] || 1.0;
  modifiedLevel.rewards.baseXp = Math.floor(level.rewards.baseXp * multiplier);
  modifiedLevel.rewards.baseTokens = Math.floor(level.rewards.baseTokens * multiplier);

  return modifiedLevel;
}

// Create endless mode configuration
export function createEndlessMode(startingDifficulty: 'easy' | 'medium' | 'hard' = 'easy') {
  return {
    currentWave: 1,
    difficulty: startingDifficulty,
    score: 0,
    modifiers: [] as LevelModifier[],
    
    // Difficulty scales every 5 waves
    getNextWave: function() {
      this.currentWave++;
      
      // Increase difficulty every 5 waves
      if (this.currentWave % 5 === 0) {
        if (this.difficulty === 'easy') this.difficulty = 'medium';
        else if (this.difficulty === 'medium') this.difficulty = 'hard';
        // After hard, start adding modifiers
        else {
          const randomModifiers: LevelModifier[] = [
            'double_spawns',
            'armored_enemies',
            'faster_enemies',
            'invisible_enemies'
          ];
          const newModifier = randomModifiers[Math.floor(Math.random() * randomModifiers.length)];
          if (!this.modifiers.includes(newModifier)) {
            this.modifiers.push(newModifier);
          }
        }
      }

      return {
        wave: this.currentWave,
        difficulty: this.difficulty,
        modifiers: [...this.modifiers],
        enemyCount: Math.min(3 + this.currentWave, 20),
        rewards: {
          xp: 100 * this.currentWave,
          tokens: 10 * this.currentWave
        }
      };
    }
  };
}

// Roguelike mode with random upgrades
export interface RoguelikeUpgrade {
  id: string;
  name: string;
  description: string;
  effect: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const ROGUELIKE_UPGRADES: RoguelikeUpgrade[] = [
  {
    id: 'damage_boost',
    name: 'Damage Boost',
    description: '+25% weapon damage',
    effect: 'damage_multiplier_1.25',
    rarity: 'common'
  },
  {
    id: 'health_boost',
    name: 'Health Boost',
    description: '+50 max health',
    effect: 'max_health_50',
    rarity: 'common'
  },
  {
    id: 'speed_boost',
    name: 'Speed Boost',
    description: '+20% movement speed',
    effect: 'speed_multiplier_1.2',
    rarity: 'common'
  },
  {
    id: 'double_shot',
    name: 'Double Shot',
    description: 'Fire two projectiles',
    effect: 'projectile_count_2',
    rarity: 'rare'
  },
  {
    id: 'shield',
    name: 'Energy Shield',
    description: 'Absorb one hit',
    effect: 'shield_1',
    rarity: 'rare'
  },
  {
    id: 'critical_hit',
    name: 'Critical Strikes',
    description: '20% chance for 2x damage',
    effect: 'crit_chance_0.2_crit_damage_2',
    rarity: 'epic'
  },
  {
    id: 'life_steal',
    name: 'Life Steal',
    description: 'Heal 10% of damage dealt',
    effect: 'life_steal_0.1',
    rarity: 'epic'
  },
  {
    id: 'god_mode',
    name: 'Invulnerability',
    description: '5 seconds of invincibility',
    effect: 'invuln_duration_5',
    rarity: 'legendary'
  }
];

export function getRandomRoguelikeUpgrades(count: number = 3): RoguelikeUpgrade[] {
  const shuffled = [...ROGUELIKE_UPGRADES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
