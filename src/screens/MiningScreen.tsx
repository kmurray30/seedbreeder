// MiningScreen - mining/excursion interface
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { BudlingCard } from '../components/BudlingCard';
import { StatBar } from '../components/StatBar';

export const MiningScreen: React.FC = () => {
  const { activeExcursions, activeBudlings, inventory, startExcursion, returnFromExcursion } = useGameStore();
  const [showBudlingModal, setShowBudlingModal] = useState(false);

  const activeExcursion = activeExcursions.length > 0 ? activeExcursions[0] : null;
  const activeBudling = activeBudlings.length > 0 ? activeBudlings[0] : null;
  const isActive = Boolean(activeExcursion?.active ?? false);

  const handleStartExcursion = (budlingId: string) => {
    startExcursion(budlingId);
    setShowBudlingModal(false);
  };

  const handleReturn = () => {
    returnFromExcursion();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mining</Text>

      {!isActive ? (
        <View style={styles.inactiveContainer}>
          <Text style={styles.inactiveText}>No active excursion</Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => setShowBudlingModal(true)}
          >
            <Text style={styles.startButtonText}>Start Excursion</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {activeBudling && (
            <View style={styles.budlingContainer}>
              <Text style={styles.sectionTitle}>Active Budling</Text>
              <BudlingCard budling={activeBudling} />
            </View>
          )}

          {activeExcursion && (
            <View style={styles.excursionContainer}>
              <Text style={styles.sectionTitle}>Excursion Status</Text>
              
              <View style={styles.depthContainer}>
                <Text style={styles.depthLabel}>Depth</Text>
                <Text style={styles.depthValue}>{activeExcursion.depth}</Text>
              </View>

              <View style={styles.progressContainer}>
                <Text style={styles.progressLabel}>Progress</Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${(activeExcursion.stepProgress / 10) * 100}%` }
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {activeExcursion.stepProgress}/10 steps
                </Text>
              </View>

              {activeBudling && (
                <View style={styles.statsContainer}>
                  <StatBar label="HP" value={activeBudling.stats.hp} max={100} color="#FF4444" />
                  <StatBar label="Hunger" value={activeBudling.stats.hunger} max={100} color="#FFA500" />
                  <StatBar label="Energy" value={activeBudling.stats.energy} max={100} color="#4444FF" />
                </View>
              )}

              <View style={styles.lootContainer}>
                <Text style={styles.lootLabel}>Loot Score</Text>
                <View style={styles.lootBox}>
                  <View
                    style={[
                      styles.lootFill,
                      { width: `${Math.min(100, (activeExcursion.lootScore / 100) * 100)}%` }
                    ]}
                  />
                  <Text style={styles.lootText}>{Math.round(activeExcursion.lootScore)}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.returnButton}
                onPress={handleReturn}
              >
                <Text style={styles.returnButtonText}>Return</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}

      {/* Budling Selection Modal */}
      <Modal
        visible={showBudlingModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBudlingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Budling</Text>
            <ScrollView>
              {inventory.budlings.length === 0 ? (
                <Text style={styles.emptyText}>No Budlings available</Text>
              ) : (
                inventory.budlings.map(budling => (
                  <TouchableOpacity
                    key={budling.id}
                    onPress={() => handleStartExcursion(budling.id)}
                  >
                    <BudlingCard budling={budling} />
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowBudlingModal(false)}
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
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  inactiveContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveText: {
    fontSize: 18,
    color: '#999',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    minWidth: 200,
  },
  startButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  budlingContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  excursionContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  depthContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  depthLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  depthValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  progressBar: {
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 10,
  },
  progressText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  statsContainer: {
    marginVertical: 16,
  },
  lootContainer: {
    marginBottom: 16,
  },
  lootLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  lootBox: {
    height: 40,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lootFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#FFD700',
  },
  lootText: {
    fontSize: 16,
    fontWeight: 'bold',
    zIndex: 1,
  },
  returnButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  returnButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
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
});

