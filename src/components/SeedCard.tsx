// SeedCard component - displays seed information
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Seed } from '../types';

interface SeedCardProps {
  seed: Seed;
  onPress?: () => void;
  selected?: boolean;
}

export const SeedCard: React.FC<SeedCardProps> = ({ seed, onPress, selected = false }) => {
  const classColors: Record<Seed['class'], [string, string]> = {
    Botanical: ['#90EE90', '#32CD32'],
    Dark: ['#2F2F2F', '#1A1A1A'],
    Fungal: ['#9370DB', '#8B008B'],
    Aquatic: ['#00CED1', '#008B8B'],
    Mineral: ['#B0C4DE', '#778899'],
    Arcane: ['#FF69B4', '#FF1493'],
  };

  const colors = classColors[seed.class] || ['#D3D3D3', '#C0C0C0'];

  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.selected]}
      onPress={onPress}
      disabled={!onPress}
    >
      <LinearGradient
        colors={colors}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <Text style={styles.className}>{seed.class}</Text>
          <Text style={styles.pattern}>{seed.pattern}</Text>
        </View>
        
        <View style={styles.skillsContainer}>
          {seed.skills.map((skill, index) => (
            <View key={index} style={styles.skillRow}>
              <Text style={styles.skillName}>{skill.name}</Text>
              <Text style={styles.skillLevel}>Lv.{skill.level}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  selected: {
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  card: {
    padding: 12,
    minHeight: 120,
  },
  header: {
    marginBottom: 8,
  },
  className: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  pattern: {
    fontSize: 12,
    color: '#FFF',
    opacity: 0.9,
  },
  skillsContainer: {
    marginTop: 8,
  },
  skillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  skillName: {
    fontSize: 12,
    color: '#FFF',
    flex: 1,
  },
  skillLevel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

