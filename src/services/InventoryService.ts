// Inventory service - handles inventory management
import type { Inventory, Seed, Fruit, Budling, Item, Perk } from '../types';
import { INVENTORY_CAPACITY } from '../constants/gameConstants';

class InventoryService {
  // Check if inventory has capacity for a specific category
  hasCapacity(inventory: Inventory, category: keyof Inventory): boolean {
    const currentCount = inventory[category].length;
    const capacity = INVENTORY_CAPACITY[category];
    return currentCount < capacity;
  }

  // Add seed to inventory
  addSeed(inventory: Inventory, seed: Seed): { success: boolean; inventory: Inventory } {
    if (!this.hasCapacity(inventory, 'seeds')) {
      return { success: false, inventory };
    }

    return {
      success: true,
      inventory: {
        ...inventory,
        seeds: [...inventory.seeds, seed],
      },
    };
  }

  // Add fruit to inventory
  addFruit(inventory: Inventory, fruit: Fruit): { success: boolean; inventory: Inventory } {
    if (!this.hasCapacity(inventory, 'fruits')) {
      return { success: false, inventory };
    }

    return {
      success: true,
      inventory: {
        ...inventory,
        fruits: [...inventory.fruits, fruit],
      },
    };
  }

  // Add multiple fruits
  addFruits(inventory: Inventory, fruits: Fruit[]): { success: boolean; inventory: Inventory; added: number } {
    let added = 0;
    let updatedInventory = inventory;

    for (const fruit of fruits) {
      const result = this.addFruit(updatedInventory, fruit);
      if (result.success) {
        updatedInventory = result.inventory;
        added++;
      } else {
        break; // Stop if we hit capacity
      }
    }

    return {
      success: added === fruits.length,
      inventory: updatedInventory,
      added,
    };
  }

  // Add Budling to inventory
  addBudling(inventory: Inventory, budling: Budling): { success: boolean; inventory: Inventory } {
    if (!this.hasCapacity(inventory, 'budlings')) {
      return { success: false, inventory };
    }

    return {
      success: true,
      inventory: {
        ...inventory,
        budlings: [...inventory.budlings, budling],
      },
    };
  }

  // Add item to inventory
  addItem(inventory: Inventory, item: Item): { success: boolean; inventory: Inventory } {
    if (!this.hasCapacity(inventory, 'items')) {
      return { success: false, inventory };
    }

    return {
      success: true,
      inventory: {
        ...inventory,
        items: [...inventory.items, item],
      },
    };
  }

  // Add multiple items
  addItems(inventory: Inventory, items: Item[]): { success: boolean; inventory: Inventory; added: number } {
    let added = 0;
    let updatedInventory = inventory;

    for (const item of items) {
      const result = this.addItem(updatedInventory, item);
      if (result.success) {
        updatedInventory = result.inventory;
        added++;
      } else {
        break; // Stop if we hit capacity
      }
    }

    return {
      success: added === items.length,
      inventory: updatedInventory,
      added,
    };
  }

  // Remove seed from inventory
  removeSeed(inventory: Inventory, seedId: string): Inventory {
    return {
      ...inventory,
      seeds: inventory.seeds.filter(seed => seed.id !== seedId),
    };
  }

  // Remove Budling from inventory
  removeBudling(inventory: Inventory, budlingId: string): Inventory {
    return {
      ...inventory,
      budlings: inventory.budlings.filter(budling => budling.id !== budlingId),
    };
  }

  // Get seed by ID
  getSeed(inventory: Inventory, seedId: string): Seed | undefined {
    return inventory.seeds.find(seed => seed.id === seedId);
  }

  // Get Budling by ID
  getBudling(inventory: Inventory, budlingId: string): Budling | undefined {
    return inventory.budlings.find(budling => budling.id === budlingId);
  }
}

export const inventoryService = new InventoryService();

