// Harvest service - handles plant harvesting and loot generation
import type { Seed, Fruit } from '../types';
import { seedService } from './SeedService';

class HarvestService {
  private fruitIdCounter: number = 1;

  // Generate fruit based on seed class
  private generateFruit(seedClass: Seed['class']): Fruit {
    const fruitNames: Record<Seed['class'], string> = {
      Botanical: 'Berry',
      Dark: 'Shadow Fruit',
      Fungal: 'Spore Pod',
      Aquatic: 'Aqua Berry',
      Mineral: 'Crystal Fruit',
      Arcane: 'Mana Berry',
    };

    return {
      id: `fruit_${Date.now()}_${this.fruitIdCounter++}`,
      type: seedClass,
      name: fruitNames[seedClass],
    };
  }

  // Harvest a plant - returns clone seed and fruit
  harvest(seed: Seed): { cloneSeed: Seed; fruit: Fruit } {
    const cloneSeed = seedService.cloneSeed(seed);
    const fruit = this.generateFruit(seed.class);

    return {
      cloneSeed,
      fruit,
    };
  }
}

export const harvestService = new HarvestService();

