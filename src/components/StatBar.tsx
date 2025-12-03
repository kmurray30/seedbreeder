// StatBar component - displays a stat bar (HP, Hunger, Energy)
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatBarProps {
  label: string;
  value: number;
  max: number;
  color: string;
}

export const StatBar: React.FC<StatBarProps> = ({ label, value, max, color }) => {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));
  
  // Color changes at thresholds
  let barColor = color;
  if (percentage < 20) {
    barColor = '#FF0000'; // Red when low
  } else if (percentage < 50) {
    barColor = '#FFA500'; // Orange when medium
  }

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{Math.round(value)}/{max}</Text>
      </View>
      <View style={styles.barContainer}>
        <View 
          style={[
            styles.barFill, 
            { width: `${percentage}%`, backgroundColor: barColor }
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
  },
  value: {
    fontSize: 12,
    color: '#FFF',
  },
  barContainer: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
});

