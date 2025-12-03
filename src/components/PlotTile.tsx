// PlotTile component - displays a farm plot
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Plant } from '../types';
import { GROWTH_STAGES } from '../constants/gameConstants';

interface PlotTileProps {
  plant: Plant | null;
  onPress: () => void;
  seedClass?: string;
}

export const PlotTile: React.FC<PlotTileProps> = ({ plant, onPress, seedClass }) => {
  const getGrowthColor = (stage: number): [string, string] => {
    switch (stage) {
      case GROWTH_STAGES.PLANTED:
        return ['#8B4513', '#A0522D']; // Brown
      case GROWTH_STAGES.STAGE_1:
        return ['#90EE90', '#98FB98']; // Light green
      case GROWTH_STAGES.STAGE_2:
        return ['#32CD32', '#00FF00']; // Green
      case GROWTH_STAGES.STAGE_3:
        return ['#228B22', '#006400']; // Forest green
      case GROWTH_STAGES.HARVESTABLE:
        return ['#FFD700', '#FFA500']; // Gold/Orange
      default:
        return ['#D3D3D3', '#C0C0C0']; // Gray
    }
  };

  const getGrowthLabel = (stage: number): string => {
    switch (stage) {
      case GROWTH_STAGES.PLANTED:
        return 'Planted';
      case GROWTH_STAGES.STAGE_1:
        return 'Sprouting';
      case GROWTH_STAGES.STAGE_2:
        return 'Growing';
      case GROWTH_STAGES.STAGE_3:
        return 'Mature';
      case GROWTH_STAGES.HARVESTABLE:
        return 'Ready!';
      default:
        return 'Empty';
    }
  };

  if (!plant) {
    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={styles.emptyPlot}>
          <Text style={styles.emptyText}>+</Text>
          <Text style={styles.emptyLabel}>Plant</Text>
        </View>
      </TouchableOpacity>
    );
  }

  const colors = getGrowthColor(plant.growthStage);
  const isHarvestable = plant.growthStage >= GROWTH_STAGES.HARVESTABLE;
  // Ensure wateredToday is boolean (defensive check for React 19 strictness)
  const needsWater = !Boolean(plant.wateredToday);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <LinearGradient
        colors={colors}
        style={styles.plot}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.growthLabel}>{getGrowthLabel(plant.growthStage)}</Text>
        {needsWater && (
          <View style={styles.waterIndicator}>
            <Text style={styles.waterText}>💧</Text>
          </View>
        )}
        {isHarvestable && (
          <View style={styles.harvestIndicator}>
            <Text style={styles.harvestText}>✨</Text>
          </View>
        )}
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(plant.growthStage / GROWTH_STAGES.HARVESTABLE) * 100}%` }
            ]} 
          />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    aspectRatio: 1,
    margin: '1%',
  },
  emptyPlot: {
    flex: 1,
    backgroundColor: '#E8E8E8',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D0D0D0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 32,
    color: '#999',
  },
  emptyLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  plot: {
    flex: 1,
    borderRadius: 8,
    padding: 8,
    justifyContent: 'space-between',
  },
  growthLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  waterIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  waterText: {
    fontSize: 20,
  },
  harvestIndicator: {
    position: 'absolute',
    top: 4,
    left: 4,
  },
  harvestText: {
    fontSize: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 2,
  },
});

