// Game store - centralized state management using Zustand
import { create } from 'zustand';
import type { GameState, Seed, Plant, Budling, Excursion, Fruit, Item } from '../types';
import { INITIAL_PLOT_COUNT } from '../constants/gameConstants';
import { seedService } from '../services/SeedService';
import { plantService } from '../services/PlantService';
import { growthService } from '../services/GrowthService';
import { harvestService } from '../services/HarvestService';
import { budlingService } from '../services/BudlingService';
import { miningService } from '../services/MiningService';
import { lootService } from '../services/LootService';
import { inventoryService } from '../services/InventoryService';
import { saveService } from '../services/SaveService';
import { timeService } from '../services/TimeService';

interface GameStore extends GameState {
  // Actions
  initialize: () => Promise<void>;
  plantSeed: (plotIndex: number, seedId: string) => boolean;
  waterPlant: (plotIndex: number) => void;
  harvestPlant: (plotIndex: number) => boolean;
  createBudlingFromSeed: (seedId: string) => boolean;
  startExcursion: (budlingId: string) => void;
  returnFromExcursion: () => void;
  processTick: () => void;
  advanceToNextDay: () => void;
  saveGame: () => Promise<void>;
}

// Normalize state to ensure all booleans are actual booleans (React 19 strictness)
const normalizeState = (state: GameState): GameState => {
  return {
    ...state,
    farmPlots: state.farmPlots.map(plot => 
      plot ? {
        ...plot,
        wateredToday: Boolean(plot.wateredToday),
        isPassive: Boolean(plot.isPassive),
      } : null
    ),
    activeExcursions: state.activeExcursions.map(excursion => ({
      ...excursion,
      active: Boolean(excursion.active),
    })),
  };
};

const createInitialState = (): GameState => {
  const starterSeeds = seedService.generateStarterSeeds(4);
  
  const initialState = {
    farmPlots: Array(INITIAL_PLOT_COUNT).fill(null),
    inventory: {
      seeds: starterSeeds,
      fruits: [],
      budlings: [],
      items: [],
      perks: [],
    },
    activeBudlings: [],
    activeExcursions: [],
    currentTick: 0,
    currentDay: 0,
    lastSaveTimestamp: Date.now(),
  };
  
  return normalizeState(initialState);
};

export const useGameStore = create<GameStore>((set, get) => {
  // Helper to normalize state before setting
  const setNormalized = (partial: Partial<GameState>) => {
    const currentState = get();
    const mergedState = { ...currentState, ...partial };
    const normalized = normalizeState(mergedState);
    set(normalized);
  };

  return {
    ...createInitialState(),

    // Initialize game (load from save or create new)
    initialize: async () => {
    const savedState = await saveService.loadGameState();
    
    if (savedState) {
      // Initialize time service with saved state
      timeService.initialize(savedState.currentTick, savedState.lastSaveTimestamp);
      
      // Normalize state to ensure all booleans are actual booleans
      const normalizedState = normalizeState(savedState);
      setNormalized(normalizedState);
    } else {
      // Create new game
      const initialState = createInitialState();
      timeService.initialize(initialState.currentTick, initialState.lastSaveTimestamp);
      // State is already normalized in createInitialState
      setNormalized(initialState);
      await saveService.saveGameState(initialState);
    }

    // Start tick loop
    timeService.start();
    
    // Subscribe to tick events
    timeService.subscribe(() => {
      get().processTick();
    });
  },

  // Plant a seed in a plot
  plantSeed: (plotIndex: number, seedId: string) => {
    const state = get();
    const seed = inventoryService.getSeed(state.inventory, seedId);
    
    if (!seed || state.farmPlots[plotIndex] !== null) {
      return false;
    }

    const plant = plantService.createPlant(seedId);
    const newPlots = [...state.farmPlots];
    newPlots[plotIndex] = plant;

    const updatedInventory = inventoryService.removeSeed(state.inventory, seedId);

    setNormalized({
      farmPlots: newPlots,
      inventory: updatedInventory,
    });

    get().saveGame();
    return true;
  },

  // Water a plant
  waterPlant: (plotIndex: number) => {
    const state = get();
    const plant = state.farmPlots[plotIndex];
    
    if (!plant || plant.wateredToday) {
      return;
    }

    const wateredPlant = plantService.waterPlant(plant);
    const newPlots = [...state.farmPlots];
    newPlots[plotIndex] = wateredPlant;

    setNormalized({ farmPlots: newPlots });
    get().saveGame();
  },

  // Harvest a plant
  harvestPlant: (plotIndex: number) => {
    const state = get();
    const plant = state.farmPlots[plotIndex];
    
    if (!plant || !growthService.isHarvestable(plant)) {
      return false;
    }

    const seed = inventoryService.getSeed(state.inventory, plant.seedId);
    if (!seed) {
      return false;
    }

    const { cloneSeed, fruit } = harvestService.harvest(seed);

    // Try to add clone seed and fruit to inventory
    const seedResult = inventoryService.addSeed(state.inventory, cloneSeed);
    if (!seedResult.success) {
      return false; // Inventory full
    }

    const fruitResult = inventoryService.addFruit(seedResult.inventory, fruit);
    if (!fruitResult.success) {
      return false; // Inventory full
    }

    // Remove plant from plot
    const newPlots = [...state.farmPlots];
    newPlots[plotIndex] = null;

    setNormalized({
      farmPlots: newPlots,
      inventory: fruitResult.inventory,
    });

    get().saveGame();
    return true;
  },

  // Create Budling from seed
  createBudlingFromSeed: (seedId: string) => {
    const state = get();
    const seed = inventoryService.getSeed(state.inventory, seedId);
    
    if (!seed) {
      return false;
    }

    const budling = budlingService.createBudlingFromSeed(seed);
    const result = inventoryService.addBudling(state.inventory, budling);

    if (!result.success) {
      return false; // Inventory full
    }

    const updatedInventory = inventoryService.removeSeed(result.inventory, seedId);

    setNormalized({ inventory: updatedInventory });
    get().saveGame();
    return true;
  },

  // Start mining excursion
  startExcursion: (budlingId: string) => {
    const state = get();
    
    // Check if Budling exists
    const budling = inventoryService.getBudling(state.inventory, budlingId);
    if (!budling) {
      return;
    }

    // Check if there's already an active excursion (POC: only 1 allowed)
    if (state.activeExcursions.length > 0 && state.activeExcursions[0].active) {
      return;
    }

    const excursion = miningService.startExcursion(budlingId);
    
    setNormalized({
      activeExcursions: [excursion],
      activeBudlings: [budling],
    });

    get().saveGame();
  },

  // Return from excursion and convert loot
  returnFromExcursion: () => {
    const state = get();
    
    if (state.activeExcursions.length === 0 || !state.activeExcursions[0].active) {
      return;
    }

    const excursion = state.activeExcursions[0];
    const { fruits, items } = lootService.convertLootScoreToItems(excursion.lootScore, excursion.depth);

    // Add fruits and items to inventory
    const fruitsResult = inventoryService.addFruits(state.inventory, fruits);
    const itemsResult = inventoryService.addItems(fruitsResult.inventory, items);

    const returnedExcursion = miningService.returnFromExcursion(excursion);

    setNormalized({
      activeExcursions: [returnedExcursion],
      activeBudlings: [],
      inventory: itemsResult.inventory,
    });

    get().saveGame();
  },

  // Process one tick (called by time service)
  processTick: () => {
    const state = get();
    const currentTick = timeService.getCurrentTick();
    const currentDay = timeService.getCurrentDay();

    // Check for day boundary
    if (currentDay > state.currentDay) {
      // Reset watering for all plants
      const resetPlots = state.farmPlots.map(plot => 
        plot ? plantService.resetWatering(plot) : null
      );
      
      setNormalized({
        farmPlots: resetPlots,
        currentDay,
      });
    }

    // Update plant growth
    const updatedPlots = state.farmPlots.map(plot => {
      if (!plot) return null;
      
      const seed = inventoryService.getSeed(state.inventory, plot.seedId);
      if (!seed) return plot;

      return growthService.updateGrowth(plot, seed, currentTick);
    });

    // Process active excursions
    if (state.activeExcursions.length > 0 && state.activeExcursions[0].active) {
      const excursion = state.activeExcursions[0];
      const budling = state.activeBudlings[0];

      if (budling) {
        const { updatedExcursion, updatedBudling } = miningService.processTick(excursion, budling);
        
        setNormalized({
          farmPlots: updatedPlots,
          activeExcursions: [updatedExcursion],
          activeBudlings: updatedBudling ? [updatedBudling] : [],
          currentTick,
        });
      } else {
        setNormalized({
          farmPlots: updatedPlots,
          currentTick,
        });
      }
    } else {
      setNormalized({
        farmPlots: updatedPlots,
        currentTick,
      });
    }

    // Auto-save periodically (every 30 seconds)
    if (currentTick % 30 === 0) {
      get().saveGame();
    }
  },

  // Advance to next day (sundial)
  advanceToNextDay: () => {
    timeService.advanceToNextDay();
    get().processTick();
    get().saveGame();
  },

  // Save game state
  saveGame: async () => {
    const state = get();
    await saveService.saveGameState(state);
  },
  };
});

