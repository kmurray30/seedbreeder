// Game constants from MANIFEST.md

import type { SeedClass, Pattern, PatternColor } from '../types';

export const TICKS_PER_SECOND = 1;
export const TICKS_PER_DAY = 300;
export const SUNDIAL_HOLD_DURATION_MS = 5000; // 5 seconds

export const GROWTH_STAGES = {
  PLANTED: 0,
  STAGE_1: 1,
  STAGE_2: 2,
  STAGE_3: 3,
  HARVESTABLE: 4,
};

export const MAX_SKILL_LEVEL = 10;
export const INITIAL_PLOT_COUNT = 2;
export const MAX_PLOTS = 4; // For POC

export const INVENTORY_CAPACITY = {
  seeds: 50,
  fruits: 50,
  budlings: 50,
  items: 50,
  perks: 50,
};

export const BUDLING_INITIAL_STATS = {
  hp: 100,
  hunger: 100,
  energy: 100,
};

export const SEED_CLASSES: Array<SeedClass> = [
  'Botanical',
  'Dark',
  'Fungal',
  'Aquatic',
  'Mineral',
  'Arcane',
];

export const PATTERNS: Array<Pattern> = [
  'stripes',
  'dots',
  'fractals',
  'swirls',
];

export const PATTERN_COLORS: Array<PatternColor> = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#FFA07A', // Light Salmon
  '#98D8C8', // Mint
  '#F7DC6F', // Yellow
  '#BB8FCE', // Purple
  '#85C1E2', // Sky Blue
];

// Skill mappings - each class has 2 associated skills
export const CLASS_SKILLS: Record<SeedClass, { dominant: string; recessive: string }> = {
  Botanical: { dominant: 'Growth Speed', recessive: 'Water Efficiency' },
  Dark: { dominant: 'Depth Speed', recessive: 'Scout Instinct' },
  Fungal: { dominant: 'Multi-Seed', recessive: 'Rare Seed Chance' },
  Aquatic: { dominant: 'Energy Efficiency', recessive: 'Hunger Efficiency' },
  Mineral: { dominant: 'Gem Finder', recessive: 'Ore Scent' },
  Arcane: { dominant: 'Mana Spark', recessive: 'Mutation Drift' },
};

// Mining constants
export const MINING_STEPS_PER_DEPTH = 10;
export const MINING_STAT_DRAIN_PER_TICK = {
  hp: 0.1,
  hunger: 0.2,
  energy: 0.15,
};
export const MINING_LOOT_CHANCE = 0.3; // 30% chance per successful step
export const MINING_FORWARD_CHANCE_BASE = 0.5; // Base 50% chance

// Early depth loot balancing - tiny point values
export const LOOT_SCORE_MULTIPLIERS = {
  1: 0.1,   // Depth 1: 10% of normal
  2: 0.2,   // Depth 2: 20% of normal
  3: 0.3,   // Depth 3: 30% of normal
  4: 0.5,   // Depth 4: 50% of normal
  5: 0.7,   // Depth 5: 70% of normal
  default: 1.0, // Depth 6+: 100% of normal
};

