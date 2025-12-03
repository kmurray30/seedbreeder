// TimeService tests
import { timeService } from '../TimeService';
import { TICKS_PER_DAY } from '../../constants/gameConstants';

describe('TimeService', () => {
  beforeEach(() => {
    timeService.stop();
  });

  afterEach(() => {
    timeService.stop();
  });

  test('initializes with saved tick count', () => {
    const savedTick = 100;
    const savedTimestamp = Date.now() - 5000; // 5 seconds ago
    
    timeService.initialize(savedTick, savedTimestamp);
    
    const currentTick = timeService.getCurrentTick();
    expect(currentTick).toBeGreaterThanOrEqual(savedTick);
  });

  test('tick increments correctly', (done) => {
    timeService.initialize(0, Date.now());
    const initialTick = timeService.getCurrentTick();
    
    timeService.start();
    
    setTimeout(() => {
      const newTick = timeService.getCurrentTick();
      expect(newTick).toBeGreaterThan(initialTick);
      timeService.stop();
      done();
    }, 1100); // Wait a bit more than 1 second
  });

  test('day boundary detection', () => {
    timeService.initialize(TICKS_PER_DAY - 1, Date.now());
    const day1 = timeService.getCurrentDay();
    
    timeService.initialize(TICKS_PER_DAY, Date.now());
    const day2 = timeService.getCurrentDay();
    
    expect(day2).toBeGreaterThan(day1);
  });

  test('advanceToNextDay advances to next day', () => {
    timeService.initialize(100, Date.now());
    const initialDay = timeService.getCurrentDay();
    
    timeService.advanceToNextDay();
    const newDay = timeService.getCurrentDay();
    
    expect(newDay).toBe(initialDay + 1);
  });

  test('calculates offline progress', () => {
    const lastSaveTimestamp = Date.now() - 10000; // 10 seconds ago
    const progress = timeService.calculateOfflineProgress(lastSaveTimestamp);
    
    expect(progress).toBeGreaterThanOrEqual(9); // Should be around 10 seconds
    expect(progress).toBeLessThanOrEqual(11);
  });
});

