// Budling service - handles conversion from seed to Budling
import type { Seed, Budling } from '../types';
import { BUDLING_INITIAL_STATS } from '../constants/gameConstants';

class BudlingService {
  private budlingIdCounter: number = 1;

  // Generate a unique Budling ID
  private generateBudlingId(): string {
    return `budling_${Date.now()}_${this.budlingIdCounter++}`;
  }

  // Convert a seed to a Budling
  createBudlingFromSeed(seed: Seed): Budling {
    return {
      id: this.generateBudlingId(),
      class: seed.class, // Class → Budling Class
      temperament: seed.pattern, // Pattern → Budling Temperament
      bodyType: seed.color, // Pattern Color → Budling Body Type
      inheritedSkills: seed.skills.map(skill => ({ ...skill })), // Copy skills
      stats: {
        hp: BUDLING_INITIAL_STATS.hp,
        hunger: BUDLING_INITIAL_STATS.hunger,
        energy: BUDLING_INITIAL_STATS.energy,
      },
    };
  }

  // Get skill level by name from a Budling
  getSkillLevel(budling: Budling, skillName: string): number {
    const skill = budling.inheritedSkills.find(s => s.name === skillName);
    return skill?.level ?? 0;
  }
}

export const budlingService = new BudlingService();

