// GrowthService tests
import { growthService } from '../GrowthService';
import { plantService } from '../PlantService';
import { seedService } from '../SeedService';
import { GROWTH_STAGES } from '../../constants/gameConstants';
import type { Plant, Seed } from '../../types';

describe('GrowthService', () => {
  test('growth pauses when not watered', () => {
    const seed = seedService.generateStarterSeeds(1)[0];
    const plant = plantService.createPlant(seed.id);
    
    const updatedPlant = growthService.updateGrowth(plant, seed, plant.plantedAtTick + 100);
    
    expect(updatedPlant.growthStage).toBe(plant.growthStage);
  });

  test('growth advances when watered', () => {
    const seed = seedService.generateStarterSeeds(1)[0];
    const plant = plantService.createPlant(seed.id);
    const wateredPlant = plantService.waterPlant(plant);
    
    const updatedPlant = growthService.updateGrowth(wateredPlant, seed, wateredPlant.plantedAtTick + 100);
    
    expect(updatedPlant.growthStage).toBeGreaterThan(wateredPlant.growthStage);
  });

  test('isHarvestable returns true for harvestable stage', () => {
    const seed = seedService.generateStarterSeeds(1)[0];
    const plant: Plant = {
      seedId: seed.id,
      plantedAtTick: 0,
      wateredToday: true,
      growthStage: GROWTH_STAGES.HARVESTABLE,
      isPassive: false,
    };
    
    expect(growthService.isHarvestable(plant)).toBe(true);
  });

  test('isHarvestable returns false for non-harvestable stage', () => {
    const seed = seedService.generateStarterSeeds(1)[0];
    const plant: Plant = {
      seedId: seed.id,
      plantedAtTick: 0,
      wateredToday: true,
      growthStage: GROWTH_STAGES.STAGE_2,
      isPassive: false,
    };
    
    expect(growthService.isHarvestable(plant)).toBe(false);
  });
});

