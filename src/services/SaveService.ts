// Save service - handles persistence to AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GameState } from '../types';
import { timeService } from './TimeService';

const SAVE_KEY = '@seedbreeder:gameState';

class SaveService {
  // Save game state
  async saveGameState(state: GameState): Promise<void> {
    try {
      const stateToSave = {
        ...state,
        lastSaveTimestamp: Date.now(),
      };
      const jsonValue = JSON.stringify(stateToSave);
      await AsyncStorage.setItem(SAVE_KEY, jsonValue);
    } catch (error) {
      console.error('Error saving game state:', error);
      throw error;
    }
  }

  // Load game state
  async loadGameState(): Promise<GameState | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(SAVE_KEY);
      if (jsonValue == null) {
        return null;
      }

      const state = JSON.parse(jsonValue) as GameState;
      
      // Normalize boolean values (in case old saves had strings)
      state.activeExcursions = state.activeExcursions.map(excursion => ({
        ...excursion,
        active: Boolean(excursion.active),
      }));
      
      state.farmPlots = state.farmPlots.map(plot => 
        plot ? {
          ...plot,
          wateredToday: Boolean(plot.wateredToday),
          isPassive: Boolean(plot.isPassive),
        } : null
      );
      
      // Calculate offline progress
      if (state.lastSaveTimestamp) {
        const offlineProgress = timeService.calculateOfflineProgress(state.lastSaveTimestamp);
        // Update current tick based on offline progress
        state.currentTick += offlineProgress;
      }

      return state;
    } catch (error) {
      console.error('Error loading game state:', error);
      // Try to recover from corrupted save
      try {
        await AsyncStorage.removeItem(SAVE_KEY);
      } catch (removeError) {
        console.error('Error removing corrupted save:', removeError);
      }
      return null;
    }
  }

  // Clear save data (for testing/reset)
  async clearSave(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SAVE_KEY);
    } catch (error) {
      console.error('Error clearing save:', error);
      throw error;
    }
  }
}

export const saveService = new SaveService();

