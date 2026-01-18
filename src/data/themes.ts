import { Theme, ThemeType } from '../types/level.types';

export const THEMES: Record<ThemeType, Theme> = {
  neon_downtown: {
    id: 'neon_downtown',
    name: 'Neon Downtown',
    description: 'Cyberpunk city streets with neon signs and holographic billboards',
    levelRange: { min: 1, max: 8 },
    visualStyle: {
      backgroundColor: '#1a0033',
      primaryColor: '#ff00ff',
      accentColor: '#00ffff',
      ambientEffects: ['rain', 'neon_glow', 'steam_vents', 'holographic_ads']
    },
    uniqueFeatures: [
      'Narrow alleys with cover points',
      'Moving vehicles as obstacles',
      'Rain effects and steam vents',
      'Neon signs and holographic billboards'
    ],
    hazardTypes: ['spike_trap', 'moving_platform']
  },
  
  industrial_complex: {
    id: 'industrial_complex',
    name: 'Industrial Complex',
    description: 'Factory warehouses with conveyor belts and metal catwalks',
    levelRange: { min: 9, max: 16 },
    visualStyle: {
      backgroundColor: '#2a2a2a',
      primaryColor: '#ff6600',
      accentColor: '#ffcc00',
      ambientEffects: ['steam_pipes', 'sparks', 'machinery_sounds', 'smoke']
    },
    uniqueFeatures: [
      'Conveyor belts (moving platforms)',
      'Metal catwalks and scaffolding',
      'Steam pipes with hazards',
      'Electrical hazards (touching = damage)'
    ],
    hazardTypes: ['electrical_field', 'moving_platform', 'spike_trap', 'toxic_gas']
  },
  
  underground_bunker: {
    id: 'underground_bunker',
    name: 'Underground Bunker',
    description: 'Military research facility with reinforced concrete walls',
    levelRange: { min: 17, max: 24 },
    visualStyle: {
      backgroundColor: '#1a1a1a',
      primaryColor: '#00ff00',
      accentColor: '#00aa00',
      ambientEffects: ['emergency_lights', 'computer_screens', 'ventilation_hum', 'alarm_lights']
    },
    uniqueFeatures: [
      'Reinforced concrete walls',
      'Server racks and tech',
      'Ventilation shafts',
      'Emergency lockdown sequences'
    ],
    hazardTypes: ['electrical_field', 'toxic_gas', 'spike_trap']
  },
  
  skyrise_tower: {
    id: 'skyrise_tower',
    name: 'Skyrise Tower',
    description: 'Rooftop combat with wind effects and glass platforms',
    levelRange: { min: 25, max: 32 },
    visualStyle: {
      backgroundColor: '#003366',
      primaryColor: '#ffffff',
      accentColor: '#6699ff',
      ambientEffects: ['wind_particles', 'clouds', 'lightning', 'glass_reflections']
    },
    uniqueFeatures: [
      'Rooftop combat',
      'Wind effects (push players)',
      'Glass platforms (slippery)',
      'Falling debris',
      'Helicopter encounters'
    ],
    hazardTypes: ['wind_zone', 'falling_debris', 'moving_platform']
  },
  
  void_station: {
    id: 'void_station',
    name: 'Void Station',
    description: 'Space station interior with zero gravity sections',
    levelRange: { min: 33, max: 40 },
    visualStyle: {
      backgroundColor: '#000033',
      primaryColor: '#9900ff',
      accentColor: '#ff00ff',
      ambientEffects: ['zero_gravity', 'alien_corruption', 'energy_pulses', 'portal_distortion']
    },
    uniqueFeatures: [
      'Zero gravity sections',
      'Alien corruption spreading',
      'Energy shields and barriers',
      'Portal technology'
    ],
    hazardTypes: ['electrical_field', 'toxic_gas', 'freezing_area']
  },
  
  corrupted_wasteland: {
    id: 'corrupted_wasteland',
    name: 'Corrupted Wasteland',
    description: 'Post-apocalyptic desert with toxic gas clouds',
    levelRange: { min: 41, max: 50 },
    visualStyle: {
      backgroundColor: '#331a00',
      primaryColor: '#ff3300',
      accentColor: '#ff9900',
      ambientEffects: ['dust_storms', 'toxic_clouds', 'mutated_growth', 'dimensional_rifts']
    },
    uniqueFeatures: [
      'Toxic gas clouds',
      'Mutated vegetation',
      'Meteor showers',
      'Dimensional rifts'
    ],
    hazardTypes: ['toxic_gas', 'lava_pit', 'falling_debris', 'spike_trap']
  },
  
  nightmare_realm: {
    id: 'nightmare_realm',
    name: 'Nightmare Realm',
    description: 'Reality distortion with impossible geometry',
    levelRange: { min: 51, max: 999 },
    visualStyle: {
      backgroundColor: '#0d0d0d',
      primaryColor: '#ff0000',
      accentColor: '#cc00cc',
      ambientEffects: ['reality_distortion', 'time_loops', 'shadow_creatures', 'dimensional_tears']
    },
    uniqueFeatures: [
      'Reality distortion',
      'Impossible geometry',
      'Time loops',
      'Shadow creatures',
      'Existential hazards'
    ],
    hazardTypes: ['lava_pit', 'toxic_gas', 'electrical_field', 'spike_trap', 'freezing_area', 'wind_zone', 'falling_debris', 'moving_platform']
  }
};

export const getThemeByLevel = (levelNumber: number): Theme => {
  for (const theme of Object.values(THEMES)) {
    if (levelNumber >= theme.levelRange.min && levelNumber <= theme.levelRange.max) {
      return theme;
    }
  }
  return THEMES.neon_downtown; // Default fallback
};
