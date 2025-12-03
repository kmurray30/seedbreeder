// Growth service - handles plant growth progression
import type { Plant, Seed } from '../types';
import { GROWTH_STAGES } from '../constants/gameConstants';
import { seedService } from './SeedService';

class GrowthService {
  // Calculate growth speed multiplier based on seed's Growth Speed skill
  private getGrowthSpeedMultiplier(seed: Seed): number {
    const growthSpeedLevel = seedService.getSkillLevel(seed, 'Growth Speed');
    // Base speed: 1 tick per stage
    // With Growth Speed level 1: 1.1x, level 10: 2.0x
    return 1 + (growthSpeedLevel * 0.1);
  }

  // Update plant growth stage based on time and watering status
  updateGrowth(plant: Plant, seed: Seed, currentTick: number): Plant {
    // If not watered today, growth pauses
    if (!plant.wateredToday) {
      return plant;
    }

    // Calculate ticks since planting
    const ticksSincePlanting = currentTick - plant.plantedAtTick;
    const growthSpeedMultiplier = this.getGrowthSpeedMultiplier(seed);
    
    // Base growth: 1 stage per 50 ticks (with Growth Speed skill modifying this)
    // With multiplier, it becomes faster
    const ticksPerStage = Math.max(10, Math.floor(50 / growthSpeedMultiplier));
    
    // Calculate new growth stage
    const newStage = Math.min(
      GROWTH_STAGES.HARVESTABLE,
      Math.floor(ticksSincePlanting / ticksPerStage)
    );

    return {
      ...plant,
      growthStage: newStage,
    };
  }

  // Check if plant is harvestable
  isHarvestable(plant: Plant): boolean {
    return plant.growthStage >= GROWTH_STAGES.HARVESTABLE;
  }
}

export const growthService = new GrowthService();

