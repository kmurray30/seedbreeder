// Plant service - handles planting logic
import type { Plant } from '../types';
import { timeService } from './TimeService';

class PlantService {
  // Create a new plant from a seed
  createPlant(seedId: string): Plant {
    return {
      seedId,
      plantedAtTick: timeService.getCurrentTick(),
      wateredToday: false,
      growthStage: 0,
      isPassive: false, // Always false in POC
    };
  }

  // Water a plant
  waterPlant(plant: Plant): Plant {
    return {
      ...plant,
      wateredToday: true,
    };
  }

  // Reset watering status (called at day boundary)
  resetWatering(plant: Plant): Plant {
    return {
      ...plant,
      wateredToday: false,
    };
  }
}

export const plantService = new PlantService();

