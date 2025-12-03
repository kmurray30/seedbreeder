// Loot service - converts lootScore to actual items
import type { Item, Fruit } from '../types';
import { LOOT_SCORE_MULTIPLIERS } from '../constants/gameConstants';

class LootService {
  private itemIdCounter: number = 1;

  // Generate item ID
  private generateItemId(): string {
    return `item_${Date.now()}_${this.itemIdCounter++}`;
  }

  // Convert lootScore to items (fruits, ores, gems)
  convertLootScoreToItems(lootScore: number, depth: number): {
    fruits: Fruit[];
    items: Item[];
  } {
    // Apply depth multiplier for early depths
    const multiplier = LOOT_SCORE_MULTIPLIERS[depth as keyof typeof LOOT_SCORE_MULTIPLIERS] 
      ?? LOOT_SCORE_MULTIPLIERS.default;
    
    const adjustedScore = Math.floor(lootScore * multiplier);

    const fruits: Fruit[] = [];
    const items: Item[] = [];

    // Convert score to items
    // 1 point = 1 fruit (basic)
    // 5 points = 1 ore
    // 10 points = 1 gem

    let remainingScore = adjustedScore;

    // Generate gems (10 points each)
    const gemCount = Math.floor(remainingScore / 10);
    for (let i = 0; i < gemCount; i++) {
      items.push({
        id: this.generateItemId(),
        type: 'gem',
        name: 'Gem',
      });
    }
    remainingScore -= gemCount * 10;

    // Generate ores (5 points each)
    const oreCount = Math.floor(remainingScore / 5);
    for (let i = 0; i < oreCount; i++) {
      items.push({
        id: this.generateItemId(),
        type: 'ore',
        name: 'Ore',
      });
    }
    remainingScore -= oreCount * 5;

    // Remaining points become fruits (1 point each)
    for (let i = 0; i < remainingScore; i++) {
      // Random fruit type
      const fruitTypes: Array<Fruit['type']> = ['Botanical', 'Dark', 'Fungal', 'Aquatic', 'Mineral', 'Arcane'];
      const randomType = fruitTypes[Math.floor(Math.random() * fruitTypes.length)];
      
      const fruitNames: Record<Fruit['type'], string> = {
        Botanical: 'Berry',
        Dark: 'Shadow Fruit',
        Fungal: 'Spore Pod',
        Aquatic: 'Aqua Berry',
        Mineral: 'Crystal Fruit',
        Arcane: 'Mana Berry',
      };

      fruits.push({
        id: this.generateItemId(),
        type: randomType,
        name: fruitNames[randomType],
      });
    }

    return { fruits, items };
  }
}

export const lootService = new LootService();

