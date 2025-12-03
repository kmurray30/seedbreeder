// InventoryScreen - inventory management interface
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { SeedCard } from '../components/SeedCard';
import { BudlingCard } from '../components/BudlingCard';
import { INVENTORY_CAPACITY } from '../constants/gameConstants';

type TabType = 'seeds' | 'fruits' | 'budlings' | 'items' | 'perks';

export const InventoryScreen: React.FC = () => {
  const { inventory } = useGameStore();
  const [activeTab, setActiveTab] = useState<TabType>('seeds');

  const tabs: Array<{ key: TabType; label: string }> = [
    { key: 'seeds', label: 'Seeds' },
    { key: 'fruits', label: 'Fruits' },
    { key: 'budlings', label: 'Budlings' },
    { key: 'items', label: 'Items' },
    { key: 'perks', label: 'Perks' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'seeds':
        return (
          <View>
            <Text style={styles.capacityText}>
              {inventory.seeds.length}/{INVENTORY_CAPACITY.seeds}
            </Text>
            {inventory.seeds.length === 0 ? (
              <Text style={styles.emptyText}>No seeds</Text>
            ) : (
              inventory.seeds.map(seed => (
                <SeedCard key={seed.id} seed={seed} />
              ))
            )}
          </View>
        );
      
      case 'fruits':
        return (
          <View>
            <Text style={styles.capacityText}>
              {inventory.fruits.length}/{INVENTORY_CAPACITY.fruits}
            </Text>
            {inventory.fruits.length === 0 ? (
              <Text style={styles.emptyText}>No fruits</Text>
            ) : (
              inventory.fruits.map(fruit => (
                <View key={fruit.id} style={styles.fruitCard}>
                  <Text style={styles.fruitName}>{fruit.name}</Text>
                  <Text style={styles.fruitType}>{fruit.type}</Text>
                </View>
              ))
            )}
          </View>
        );
      
      case 'budlings':
        return (
          <View>
            <Text style={styles.capacityText}>
              {inventory.budlings.length}/{INVENTORY_CAPACITY.budlings}
            </Text>
            {inventory.budlings.length === 0 ? (
              <Text style={styles.emptyText}>No Budlings</Text>
            ) : (
              inventory.budlings.map(budling => (
                <BudlingCard key={budling.id} budling={budling} />
              ))
            )}
          </View>
        );
      
      case 'items':
        return (
          <View>
            <Text style={styles.capacityText}>
              {inventory.items.length}/{INVENTORY_CAPACITY.items}
            </Text>
            {inventory.items.length === 0 ? (
              <Text style={styles.emptyText}>No items</Text>
            ) : (
              inventory.items.map(item => (
                <View key={item.id} style={styles.itemCard}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemType}>{item.type}</Text>
                </View>
              ))
            )}
          </View>
        );
      
      case 'perks':
        return (
          <View>
            <Text style={styles.capacityText}>
              {inventory.perks.length}/{INVENTORY_CAPACITY.perks}
            </Text>
            {inventory.perks.length === 0 ? (
              <Text style={styles.emptyText}>No perks</Text>
            ) : (
              inventory.perks.map(perk => (
                <View key={perk.id} style={styles.perkCard}>
                  <Text style={styles.perkName}>{perk.name}</Text>
                  <Text style={styles.perkType}>{perk.type}</Text>
                  <Text style={styles.perkEffect}>{perk.effect}</Text>
                </View>
              ))
            )}
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory</Text>
      
      <View style={styles.tabContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {renderContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#999',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  capacityText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 40,
    fontSize: 16,
  },
  fruitCard: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  fruitName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  fruitType: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  itemCard: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemType: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  perkCard: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  perkName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  perkType: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  perkEffect: {
    fontSize: 14,
    marginTop: 8,
  },
});

