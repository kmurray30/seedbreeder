// Core game types based on MANIFEST.md

export type SeedClass = 'Botanical' | 'Dark' | 'Fungal' | 'Aquatic' | 'Mineral' | 'Arcane';
export type Pattern = 'stripes' | 'dots' | 'fractals' | 'swirls';
export type PatternColor = string; // Will be hex color or color name

export interface Skill {
  name: string;
  level: number; // 1-10
  xp: number;
  isDominant: boolean;
}

export interface RecessiveSkill {
  name: string;
  level: number;
}

export interface Seed {
  id: string;
  class: SeedClass;
  pattern: Pattern;
  color: PatternColor;
  skills: [Skill, Skill, Skill];
  recessiveSkills: RecessiveSkill[]; // Hidden in POC but stored
}

export interface Plant {
  seedId: string;
  plantedAtTick: number;
  wateredToday: boolean;
  growthStage: number; // 0-4 (4 = harvestable)
  isPassive: boolean; // Always false in POC
}

export interface BudlingStats {
  hp: number;
  hunger: number;
  energy: number;
}

export interface Budling {
  id: string;
  class: SeedClass; // Inherited from seed class
  temperament: Pattern; // Inherited from seed pattern
  bodyType: PatternColor; // Inherited from seed color
  inheritedSkills: Skill[];
  stats: BudlingStats;
}

export interface Excursion {
  team: string[]; // Budling IDs (1 for POC)
  depth: number;
  stepProgress: number; // Progress within current depth
  lootScore: number;
  active: boolean;
}

export interface Fruit {
  id: string;
  type: SeedClass; // Matches seed class
  name: string;
}

export interface Item {
  id: string;
  type: 'ore' | 'gem' | 'perk';
  name: string;
}

export interface Perk {
  id: string;
  name: string;
  type: 'permanent' | 'equipment' | 'consumable';
  effect: string;
}

export interface Inventory {
  seeds: Seed[];
  fruits: Fruit[];
  budlings: Budling[];
  items: Item[];
  perks: Perk[];
}

export interface GameState {
  farmPlots: (Plant | null)[];
  inventory: Inventory;
  activeBudlings: Budling[];
  activeExcursions: Excursion[];
  currentTick: number;
  currentDay: number;
  lastSaveTimestamp: number;
}

