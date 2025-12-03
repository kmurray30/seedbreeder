// BudlingCard component - displays Budling information
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Budling } from '../types';
import { StatBar } from './StatBar';

interface BudlingCardProps {
  budling: Budling;
}

export const BudlingCard: React.FC<BudlingCardProps> = ({ budling }) => {
  const classColors: Record<Budling['class'], [string, string]> = {
    Botanical: ['#90EE90', '#32CD32'],
    Dark: ['#2F2F2F', '#1A1A1A'],
    Fungal: ['#9370DB', '#8B008B'],
    Aquatic: ['#00CED1', '#008B8B'],
    Mineral: ['#B0C4DE', '#778899'],
    Arcane: ['#FF69B4', '#FF1493'],
  };

  const colors = classColors[budling.class] || ['#D3D3D3', '#C0C0C0'];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <Text style={styles.className}>{budling.class}</Text>
          <Text style={styles.traits}>
            {budling.temperament} • {budling.bodyType}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <StatBar label="HP" value={budling.stats.hp} max={100} color="#FF4444" />
          <StatBar label="Hunger" value={budling.stats.hunger} max={100} color="#FFA500" />
          <StatBar label="Energy" value={budling.stats.energy} max={100} color="#4444FF" />
        </View>

        <View style={styles.skillsContainer}>
          <Text style={styles.skillsTitle}>Skills:</Text>
          {budling.inheritedSkills.map((skill, index) => (
            <View key={index} style={styles.skillRow}>
              <Text style={styles.skillName}>{skill.name}</Text>
              <Text style={styles.skillLevel}>Lv.{skill.level}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  card: {
    padding: 12,
  },
  header: {
    marginBottom: 12,
  },
  className: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  traits: {
    fontSize: 12,
    color: '#FFF',
    opacity: 0.9,
    marginTop: 4,
  },
  statsContainer: {
    marginVertical: 8,
  },
  skillsContainer: {
    marginTop: 8,
  },
  skillsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
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

