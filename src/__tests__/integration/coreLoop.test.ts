// Core loop integration test
import { seedService } from '../../services/SeedService';
import { plantService } from '../../services/PlantService';
import { growthService } from '../../services/GrowthService';
import { harvestService } from '../../services/HarvestService';
import { budlingService } from '../../services/BudlingService';
import { inventoryService } from '../../services/InventoryService';
import { GROWTH_STAGES } from '../../constants/gameConstants';
import type { Inventory } from '../../types';

describe('Core Loop Integration', () => {
  test('full cycle: Plant → Grow → Harvest → Clone → Budling', () => {
    // Create initial inventory with starter seeds
    const starterSeeds = seedService.generateStarterSeeds(1);
    const inventory: Inventory = {
      seeds: starterSeeds,
      fruits: [],
      budlings: [],
      items: [],
      perks: [],
    };

    // Step 1: Plant seed
    const seed = inventory.seeds[0];
    const plant = plantService.createPlant(seed.id);
    const wateredPlant = plantService.waterPlant(plant);
    
    expect(wateredPlant.wateredToday).toBe(true);
    expect(wateredPlant.growthStage).toBe(GROWTH_STAGES.PLANTED);

    // Step 2: Grow (simulate many ticks)
    let grownPlant = wateredPlant;
    for (let i = 0; i < 200; i++) {
      grownPlant = growthService.updateGrowth(
        grownPlant,
        seed,
        grownPlant.plantedAtTick + i
      );
    }
    
    expect(growthService.isHarvestable(grownPlant)).toBe(true);

    // Step 3: Harvest
    const { cloneSeed, fruit } = harvestService.harvest(seed);
    
    expect(cloneSeed).toBeDefined();
    expect(cloneSeed.class).toBe(seed.class);
    expect(fruit).toBeDefined();
    expect(fruit.type).toBe(seed.class);

    // Step 4: Add clone seed and fruit to inventory
    const seedResult = inventoryService.addSeed(inventory, cloneSeed);
    expect(seedResult.success).toBe(true);
    
    const fruitResult = inventoryService.addFruit(seedResult.inventory, fruit);
    expect(fruitResult.success).toBe(true);

    // Step 5: Create Budling from clone seed
    const budling = budlingService.createBudlingFromSeed(cloneSeed);
    
    expect(budling).toBeDefined();
    expect(budling.class).toBe(cloneSeed.class);
    expect(budling.temperament).toBe(cloneSeed.pattern);
    expect(budling.bodyType).toBe(cloneSeed.color);
    expect(budling.stats.hp).toBe(100);
    expect(budling.stats.hunger).toBe(100);
    expect(budling.stats.energy).toBe(100);
  });
});

