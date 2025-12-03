// SeedService tests
import { seedService } from '../SeedService';
import { SEED_CLASSES, MAX_SKILL_LEVEL } from '../../constants/gameConstants';

describe('SeedService', () => {
  test('generates starter seeds', () => {
    const seeds = seedService.generateStarterSeeds(4);
    
    expect(seeds).toHaveLength(4);
    seeds.forEach(seed => {
      expect(seed.id).toBeDefined();
      expect(SEED_CLASSES).toContain(seed.class);
      expect(seed.skills).toHaveLength(3);
      seed.skills.forEach(skill => {
        expect(skill.level).toBeGreaterThanOrEqual(1);
        expect(skill.level).toBeLessThanOrEqual(MAX_SKILL_LEVEL);
      });
    });
  });

  test('clone seed matches parent with drift', () => {
    const parentSeed = seedService.generateStarterSeeds(1)[0];
    const cloneSeed = seedService.cloneSeed(parentSeed);
    
    expect(cloneSeed.id).not.toBe(parentSeed.id);
    expect(cloneSeed.class).toBe(parentSeed.class);
    expect(cloneSeed.pattern).toBe(parentSeed.pattern);
    expect(cloneSeed.color).toBe(parentSeed.color);
    
    // Skills should be similar but may have drifted
    cloneSeed.skills.forEach((skill, index) => {
      const parentSkill = parentSeed.skills[index];
      expect(skill.name).toBe(parentSkill.name);
      // Level can drift ±1
      expect(Math.abs(skill.level - parentSkill.level)).toBeLessThanOrEqual(1);
    });
  });

  test('getSkillLevel returns correct level', () => {
    const seed = seedService.generateStarterSeeds(1)[0];
    const skillName = seed.skills[0].name;
    const expectedLevel = seed.skills[0].level;
    
    const level = seedService.getSkillLevel(seed, skillName);
    expect(level).toBe(expectedLevel);
  });

  test('getSkillLevel returns 0 for non-existent skill', () => {
    const seed = seedService.generateStarterSeeds(1)[0];
    const level = seedService.getSkillLevel(seed, 'NonExistentSkill');
    expect(level).toBe(0);
  });
});

