// Mining service - handles excursion logic and progression
import type { Excursion, Budling } from '../types';
import {
  MINING_STEPS_PER_DEPTH,
  MINING_STAT_DRAIN_PER_TICK,
  MINING_LOOT_CHANCE,
  MINING_FORWARD_CHANCE_BASE,
} from '../constants/gameConstants';
import { budlingService } from './BudlingService';

class MiningService {
  // Calculate forward chance based on skills and stats
  private calculateForwardChance(budling: Budling): number {
    const depthSpeedLevel = budlingService.getSkillLevel(budling, 'Depth Speed');
    const hungerEfficiencyLevel = budlingService.getSkillLevel(budling, 'Hunger Efficiency');
    const energyEfficiencyLevel = budlingService.getSkillLevel(budling, 'Energy Efficiency');

    // Base chance
    let chance = MINING_FORWARD_CHANCE_BASE;

    // Depth Speed increases chance (each level adds 5%)
    chance += depthSpeedLevel * 0.05;

    // Low hunger/energy reduces chance
    const hungerPenalty = (100 - budling.stats.hunger) / 100 * 0.3;
    const energyPenalty = (100 - budling.stats.energy) / 100 * 0.3;
    chance -= hungerPenalty + energyPenalty;

    // Efficiency skills reduce penalties
    const hungerEfficiencyBonus = hungerEfficiencyLevel * 0.02;
    const energyEfficiencyBonus = energyEfficiencyLevel * 0.02;
    chance += hungerEfficiencyBonus + energyEfficiencyBonus;

    return Math.max(0.1, Math.min(0.95, chance)); // Clamp between 10% and 95%
  }

  // Process one tick of mining for an excursion
  processTick(excursion: Excursion, budling: Budling): {
    updatedExcursion: Excursion;
    updatedBudling: Budling;
    foundLoot: boolean;
  } {
    // Check if Budling has passed out
    const isPassedOut = budling.stats.hp <= 0 || 
                       budling.stats.hunger <= 0 || 
                       budling.stats.energy <= 0;

    if (isPassedOut) {
      return {
        updatedExcursion: { ...excursion, active: false },
        updatedBudling: budling,
        foundLoot: false,
      };
    }

    // Calculate forward chance
    const forwardChance = this.calculateForwardChance(budling);
    const movedForward = Math.random() < forwardChance;

    let updatedExcursion = { ...excursion };
    let updatedBudling = { ...budling };
    let foundLoot = false;

    if (movedForward) {
      // Advance step progress
      updatedExcursion.stepProgress += 1;

      // Check if we've completed this depth
      if (updatedExcursion.stepProgress >= MINING_STEPS_PER_DEPTH) {
        updatedExcursion.depth += 1;
        updatedExcursion.stepProgress = 0;
      }

      // Chance to find loot
      if (Math.random() < MINING_LOOT_CHANCE) {
        // Loot score increases with depth
        const baseLootScore = 1 + (updatedExcursion.depth * 0.5);
        updatedExcursion.lootScore += baseLootScore;
        foundLoot = true;
      }
    }

    // Apply stat drain
    updatedBudling.stats = {
      hp: Math.max(0, updatedBudling.stats.hp - MINING_STAT_DRAIN_PER_TICK.hp),
      hunger: Math.max(0, updatedBudling.stats.hunger - MINING_STAT_DRAIN_PER_TICK.hunger),
      energy: Math.max(0, updatedBudling.stats.energy - MINING_STAT_DRAIN_PER_TICK.energy),
    };

    // Check if Budling passed out after drain
    const passedOutAfterDrain = updatedBudling.stats.hp <= 0 || 
                                updatedBudling.stats.hunger <= 0 || 
                                updatedBudling.stats.energy <= 0;

    if (passedOutAfterDrain) {
      updatedExcursion.active = false;
    }

    return {
      updatedExcursion,
      updatedBudling,
      foundLoot,
    };
  }

  // Start a new excursion
  startExcursion(budlingId: string, depth: number = 1): Excursion {
    return {
      team: [budlingId],
      depth,
      stepProgress: 0,
      lootScore: 0,
      active: true,
    };
  }

  // Return from excursion (reset)
  returnFromExcursion(excursion: Excursion): Excursion {
    return {
      ...excursion,
      active: false,
    };
  }
}

export const miningService = new MiningService();

