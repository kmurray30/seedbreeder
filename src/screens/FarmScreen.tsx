// FarmScreen - main farming interface
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { PlotTile } from '../components/PlotTile';
import { SeedCard } from '../components/SeedCard';
import { SundialButton } from '../components/SundialButton';
import { GROWTH_STAGES } from '../constants/gameConstants';

export const FarmScreen: React.FC = () => {
  const { farmPlots, inventory, plantSeed, waterPlant, harvestPlant, advanceToNextDay } = useGameStore();
  const [selectedPlotIndex, setSelectedPlotIndex] = useState<number | null>(null);
  const [showSeedModal, setShowSeedModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);

  const handlePlotPress = (index: number) => {
    const plot = farmPlots[index];
    
    if (!plot) {
      // Empty plot - show seed selection
      setSelectedPlotIndex(index);
      setShowSeedModal(true);
    } else {
      // Planted plot - show actions
      setSelectedPlotIndex(index);
      setShowActionModal(true);
    }
  };

  const handleSeedSelect = (seedId: string) => {
    if (selectedPlotIndex !== null) {
      const success = plantSeed(selectedPlotIndex, seedId);
      if (success) {
        setShowSeedModal(false);
        setSelectedPlotIndex(null);
      }
    }
  };

  const handleWater = () => {
    if (selectedPlotIndex !== null) {
      waterPlant(selectedPlotIndex);
      setShowActionModal(false);
      setSelectedPlotIndex(null);
    }
  };

  const handleHarvest = () => {
    if (selectedPlotIndex !== null) {
      const success = harvestPlant(selectedPlotIndex);
      if (success) {
        setShowActionModal(false);
        setSelectedPlotIndex(null);
      } else {
        // Show error - inventory full or not harvestable
        alert('Cannot harvest: Inventory full or plant not ready!');
      }
    }
  };

  const selectedPlot = selectedPlotIndex !== null ? farmPlots[selectedPlotIndex] : null;
  const isHarvestable = Boolean(selectedPlot && selectedPlot.growthStage >= GROWTH_STAGES.HARVESTABLE);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Farm</Text>
        
        <View style={styles.plotsContainer}>
          {farmPlots.map((plot, index) => {
            const seed = plot ? inventory.seeds.find(s => s.id === plot.seedId) : undefined;
            return (
              <PlotTile
                key={index}
                plant={plot}
                seedClass={seed?.class}
                onPress={() => handlePlotPress(index)}
              />
            );
          })}
        </View>
      </ScrollView>

      <SundialButton onComplete={advanceToNextDay} />

      {/* Seed Selection Modal */}
      <Modal
        visible={showSeedModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setShowSeedModal(false);
          setSelectedPlotIndex(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Seed to Plant</Text>
            <ScrollView>
              {inventory.seeds.length === 0 ? (
                <Text style={styles.emptyText}>No seeds available</Text>
              ) : (
                inventory.seeds.map(seed => (
                  <SeedCard
                    key={seed.id}
                    seed={seed}
                    onPress={() => handleSeedSelect(seed.id)}
                  />
                ))
              )}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowSeedModal(false);
                setSelectedPlotIndex(null);
              }}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Action Modal (Water/Harvest) */}
      <Modal
        visible={showActionModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setShowActionModal(false);
          setSelectedPlotIndex(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Plant Actions</Text>
            
            {selectedPlot && Boolean(selectedPlot.wateredToday === false) && (
              <TouchableOpacity style={styles.actionButton} onPress={handleWater}>
                <Text style={styles.actionButtonText}>💧 Water</Text>
              </TouchableOpacity>
            )}

            {isHarvestable && (
              <TouchableOpacity style={styles.actionButton} onPress={handleHarvest}>
                <Text style={styles.actionButtonText}>🌾 Harvest</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowActionModal(false);
                setSelectedPlotIndex(null);
              }}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  plotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 20,
  },
  closeButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  closeButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  actionButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  actionButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

