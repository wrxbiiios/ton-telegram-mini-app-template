import { Boss, BossType } from '../types/level.types';

export const BOSSES: Record<BossType, Boss> = {
  neon_overlord: {
    type: 'neon_overlord',
    name: 'Neon Overlord',
    description: 'Master of the cyberpunk streets, wielding holographic weapons and teleportation technology',
    health: 1000,
    phases: [
      {
        phase: 1,
        healthPercentage: 100,
        attackPatterns: ['laser_beam', 'teleport_strike', 'hologram_clone'],
        spawnMinions: ['drone'],
        hazards: []
      },
      {
        phase: 2,
        healthPercentage: 66,
        attackPatterns: ['laser_beam', 'teleport_strike', 'hologram_clone', 'neon_wave'],
        spawnMinions: ['drone', 'trooper'],
        hazards: ['electrical_field']
      },
      {
        phase: 3,
        healthPercentage: 33,
        attackPatterns: ['laser_beam', 'teleport_strike', 'hologram_clone', 'neon_wave', 'ultimate_barrage'],
        spawnMinions: ['drone', 'trooper', 'shield'],
        hazards: ['electrical_field', 'spike_trap']
      }
    ],
    weakPoints: [{ x: 0, y: 0 }],
    rewards: {
      xp: 5000,
      tokens: 1000,
      nftChance: 0.1
    }
  },

  iron_sentinel: {
    type: 'iron_sentinel',
    name: 'Iron Sentinel',
    description: 'Massive industrial war machine with heavy armor and devastating area attacks',
    health: 2000,
    phases: [
      {
        phase: 1,
        healthPercentage: 100,
        attackPatterns: ['heavy_slam', 'missile_barrage', 'armor_plate_shield'],
        spawnMinions: ['heavy'],
        hazards: []
      },
      {
        phase: 2,
        healthPercentage: 60,
        attackPatterns: ['heavy_slam', 'missile_barrage', 'armor_plate_shield', 'pushback_wave'],
        spawnMinions: ['heavy', 'trooper'],
        hazards: ['moving_platform']
      },
      {
        phase: 3,
        healthPercentage: 30,
        attackPatterns: ['heavy_slam', 'missile_barrage', 'armor_plate_shield', 'pushback_wave', 'berserker_mode'],
        spawnMinions: ['heavy', 'trooper', 'shield'],
        hazards: ['moving_platform', 'electrical_field']
      }
    ],
    weakPoints: [{ x: 0, y: 50 }, { x: 0, y: -50 }],
    rewards: {
      xp: 10000,
      tokens: 2000,
      nftChance: 0.15
    }
  },

  quantum_entity: {
    type: 'quantum_entity',
    name: 'Quantum Entity',
    description: 'Being of pure energy that phases between dimensions and warps reality',
    health: 3000,
    phases: [
      {
        phase: 1,
        healthPercentage: 100,
        attackPatterns: ['phase_shift', 'quantum_duplicate', 'energy_bolt'],
        spawnMinions: ['teleporter'],
        hazards: []
      },
      {
        phase: 2,
        healthPercentage: 66,
        attackPatterns: ['phase_shift', 'quantum_duplicate', 'energy_bolt', 'reality_warp'],
        spawnMinions: ['teleporter', 'sniper'],
        hazards: ['toxic_gas']
      },
      {
        phase: 3,
        healthPercentage: 33,
        attackPatterns: ['phase_shift', 'quantum_duplicate', 'energy_bolt', 'reality_warp', 'time_slow_field'],
        spawnMinions: ['teleporter', 'sniper', 'shield'],
        hazards: ['toxic_gas', 'freezing_area']
      }
    ],
    weakPoints: [{ x: 30, y: 30 }, { x: -30, y: -30 }],
    rewards: {
      xp: 15000,
      tokens: 3000,
      nftChance: 0.2
    }
  },

  sky_leviathan: {
    type: 'sky_leviathan',
    name: 'Sky Leviathan',
    description: 'Massive flying beast that controls wind and rain, dominating the rooftops',
    health: 4000,
    phases: [
      {
        phase: 1,
        healthPercentage: 100,
        attackPatterns: ['wind_gust', 'aerial_dive', 'lightning_strike'],
        spawnMinions: ['drone'],
        hazards: ['wind_zone']
      },
      {
        phase: 2,
        healthPercentage: 70,
        attackPatterns: ['wind_gust', 'aerial_dive', 'lightning_strike', 'tornado_summon'],
        spawnMinions: ['drone', 'heavy'],
        hazards: ['wind_zone', 'falling_debris']
      },
      {
        phase: 3,
        healthPercentage: 40,
        attackPatterns: ['wind_gust', 'aerial_dive', 'lightning_strike', 'tornado_summon', 'storm_rage'],
        spawnMinions: ['drone', 'heavy', 'trooper'],
        hazards: ['wind_zone', 'falling_debris', 'electrical_field']
      }
    ],
    weakPoints: [{ x: 0, y: 80 }],
    rewards: {
      xp: 20000,
      tokens: 4000,
      nftChance: 0.25
    }
  },

  void_abomination: {
    type: 'void_abomination',
    name: 'Void Abomination',
    description: 'Cosmic horror from beyond the stars, spreading corruption and madness',
    health: 5000,
    phases: [
      {
        phase: 1,
        healthPercentage: 100,
        attackPatterns: ['tentacle_slam', 'void_pulse', 'corruption_spread'],
        spawnMinions: ['mini_boss'],
        hazards: ['toxic_gas']
      },
      {
        phase: 2,
        healthPercentage: 66,
        attackPatterns: ['tentacle_slam', 'void_pulse', 'corruption_spread', 'dimensional_rift'],
        spawnMinions: ['mini_boss', 'teleporter'],
        hazards: ['toxic_gas', 'freezing_area']
      },
      {
        phase: 3,
        healthPercentage: 33,
        attackPatterns: ['tentacle_slam', 'void_pulse', 'corruption_spread', 'dimensional_rift', 'reality_collapse'],
        spawnMinions: ['mini_boss', 'teleporter', 'shield'],
        hazards: ['toxic_gas', 'freezing_area', 'lava_pit']
      }
    ],
    weakPoints: [{ x: 0, y: 0 }, { x: 50, y: 0 }, { x: -50, y: 0 }],
    rewards: {
      xp: 30000,
      tokens: 6000,
      nftChance: 0.3
    }
  },

  corrupted_god: {
    type: 'corrupted_god',
    name: 'Corrupted God',
    description: 'The ultimate nightmare - a deity consumed by madness, combining all previous boss abilities',
    health: 10000,
    phases: [
      {
        phase: 1,
        healthPercentage: 100,
        attackPatterns: ['divine_smite', 'reality_break', 'summon_nightmare'],
        spawnMinions: ['mini_boss', 'heavy'],
        hazards: ['electrical_field', 'spike_trap']
      },
      {
        phase: 2,
        healthPercentage: 75,
        attackPatterns: ['divine_smite', 'reality_break', 'summon_nightmare', 'time_distortion'],
        spawnMinions: ['mini_boss', 'heavy', 'teleporter'],
        hazards: ['electrical_field', 'spike_trap', 'toxic_gas']
      },
      {
        phase: 3,
        healthPercentage: 50,
        attackPatterns: ['divine_smite', 'reality_break', 'summon_nightmare', 'time_distortion', 'chaos_cascade'],
        spawnMinions: ['mini_boss', 'heavy', 'teleporter', 'shield'],
        hazards: ['electrical_field', 'spike_trap', 'toxic_gas', 'lava_pit']
      },
      {
        phase: 4,
        healthPercentage: 25,
        attackPatterns: ['divine_smite', 'reality_break', 'summon_nightmare', 'time_distortion', 'chaos_cascade', 'apocalypse'],
        spawnMinions: ['mini_boss', 'heavy', 'teleporter', 'shield', 'sniper'],
        hazards: ['electrical_field', 'spike_trap', 'toxic_gas', 'lava_pit', 'freezing_area', 'wind_zone', 'falling_debris']
      }
    ],
    weakPoints: [
      { x: 0, y: 100 },
      { x: 70, y: 70 },
      { x: 100, y: 0 },
      { x: 70, y: -70 },
      { x: 0, y: -100 },
      { x: -70, y: -70 },
      { x: -100, y: 0 },
      { x: -70, y: 70 }
    ],
    rewards: {
      xp: 100000,
      tokens: 20000,
      nftChance: 0.5
    }
  }
};

export const getBossByLevel = (levelNumber: number): Boss | undefined => {
  if (levelNumber === 10) return BOSSES.neon_overlord;
  if (levelNumber === 20) return BOSSES.iron_sentinel;
  if (levelNumber === 30) return BOSSES.quantum_entity;
  if (levelNumber === 40) return BOSSES.sky_leviathan;
  if (levelNumber === 50) return BOSSES.void_abomination;
  if (levelNumber === 60) return BOSSES.corrupted_god;
  return undefined;
};
