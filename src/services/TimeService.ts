// Time system service - handles tick loop, day cycle, and sundial
import { TICKS_PER_DAY } from '../constants/gameConstants';

class TimeService {
  private tickInterval: NodeJS.Timeout | null = null;
  private currentTick: number = 0;
  private lastTickTimestamp: number = Date.now();
  private listeners: Set<() => void> = new Set();
  private isPaused: boolean = false;

  // Initialize with saved tick count and calculate offline progress
  initialize(savedTick: number, savedTimestamp: number): void {
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - savedTimestamp) / 1000);
    this.currentTick = savedTick + elapsedSeconds;
    this.lastTickTimestamp = now;
  }

  // Start the tick loop
  start(): void {
    if (this.tickInterval) {
      return; // Already running
    }

    this.lastTickTimestamp = Date.now();
    this.tickInterval = setInterval(() => {
      if (!this.isPaused) {
        this.currentTick++;
        this.notifyListeners();
      }
    }, 1000); // 1 second = 1 tick
  }

  // Stop the tick loop
  stop(): void {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  // Pause tick processing (but keep time tracking)
  pause(): void {
    this.isPaused = true;
  }

  // Resume tick processing
  resume(): void {
    this.isPaused = false;
    // Recalculate current tick based on elapsed time
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - this.lastTickTimestamp) / 1000);
    this.currentTick += elapsedSeconds;
    this.lastTickTimestamp = now;
  }

  // Get current tick count
  getCurrentTick(): number {
    if (!this.isPaused) {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - this.lastTickTimestamp) / 1000);
      if (elapsedSeconds > 0) {
        this.currentTick += elapsedSeconds;
        this.lastTickTimestamp = now;
      }
    }
    return this.currentTick;
  }

  // Get current day number (0-indexed)
  getCurrentDay(): number {
    return Math.floor(this.getCurrentTick() / TICKS_PER_DAY);
  }

  // Get ticks within current day (0 to TICKS_PER_DAY - 1)
  getTicksInCurrentDay(): number {
    return this.getCurrentTick() % TICKS_PER_DAY;
  }

  // Check if we've crossed a day boundary
  hasDayChanged(oldDay: number): boolean {
    return this.getCurrentDay() > oldDay;
  }

  // Advance to start of next day (sundial functionality)
  advanceToNextDay(): void {
    const currentDay = this.getCurrentDay();
    const nextDayStartTick = (currentDay + 1) * TICKS_PER_DAY;
    this.currentTick = nextDayStartTick;
    this.lastTickTimestamp = Date.now();
    this.notifyListeners();
  }

  // Subscribe to tick events
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  // Calculate offline progress (time since last save)
  calculateOfflineProgress(lastSaveTimestamp: number): number {
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - lastSaveTimestamp) / 1000);
    return elapsedSeconds;
  }
}

export const timeService = new TimeService();

