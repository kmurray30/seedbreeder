// Seed service - handles seed generation and cloning
import type { Seed, Skill } from '../types';
import {
  SEED_CLASSES,
  PATTERNS,
  PATTERN_COLORS,
  CLASS_SKILLS,
  MAX_SKILL_LEVEL,
} from '../constants/gameConstants';

class SeedService {
  private seedIdCounter: number = 1;

  // Generate a unique seed ID
  private generateSeedId(): string {
    return `seed_${Date.now()}_${this.seedIdCounter++}`;
  }

  // Create a skill with random level (1-3 for starter seeds)
  private createSkill(name: string, isDominant: boolean, level?: number): Skill {
    const skillLevel = level ?? Math.floor(Math.random() * 3) + 1; // 1-3 for starters
    return {
      name,
      level: Math.min(skillLevel, MAX_SKILL_LEVEL),
      xp: 0,
      isDominant,
    };
  }

  // Generate starter seeds (3-5 seeds)
  generateStarterSeeds(count: number = 4): Seed[] {
    const seeds: Seed[] = [];
    for (let i = 0; i < count; i++) {
      const seedClass = SEED_CLASSES[Math.floor(Math.random() * SEED_CLASSES.length)];
      const pattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];
      const color = PATTERN_COLORS[Math.floor(Math.random() * PATTERN_COLORS.length)];

      const classSkills = CLASS_SKILLS[seedClass];
      
      // Create 3 skills - mix of dominant and recessive from this class and others
      const skills: Skill[] = [
        this.createSkill(classSkills.dominant, true),
        this.createSkill(classSkills.recessive, false),
        // Third skill from random class
        (() => {
          const randomClass = SEED_CLASSES[Math.floor(Math.random() * SEED_CLASSES.length)];
          const randomClassSkills = CLASS_SKILLS[randomClass];
          return this.createSkill(
            Math.random() > 0.5 ? randomClassSkills.dominant : randomClassSkills.recessive,
            Math.random() > 0.5
          );
        })(),
      ];

      seeds.push({
        id: this.generateSeedId(),
        class: seedClass,
        pattern,
        color,
        skills: [skills[0], skills[1], skills[2]],
        recessiveSkills: [], // Empty for POC
      });
    }
    return seeds;
  }

  // Clone a seed (from harvest) with slight positive drift
  cloneSeed(parentSeed: Seed): Seed {
    const clonedSkills: Skill[] = parentSeed.skills.map(skill => {
      // Apply drift: ±1 level, but bias upward (70% chance to increase or stay same)
      const drift = Math.random() < 0.7 
        ? (Math.random() < 0.5 ? 1 : 0) // 70% chance: 50% to increase by 1, 50% to stay
        : -1; // 30% chance to decrease by 1
      
      const newLevel = Math.max(1, Math.min(MAX_SKILL_LEVEL, skill.level + drift));
      
      return {
        ...skill,
        level: newLevel,
        xp: 0, // Reset XP for new seed
      };
    });

    return {
      id: this.generateSeedId(),
      class: parentSeed.class,
      pattern: parentSeed.pattern,
      color: parentSeed.color,
      skills: clonedSkills as [Skill, Skill, Skill],
      recessiveSkills: parentSeed.recessiveSkills.map(rs => ({ ...rs })), // Copy recessive skills
    };
  }

  // Get skill level by name from a seed
  getSkillLevel(seed: Seed, skillName: string): number {
    const skill = seed.skills.find(s => s.name === skillName);
    return skill?.level ?? 0;
  }
}

export const seedService = new SeedService();

