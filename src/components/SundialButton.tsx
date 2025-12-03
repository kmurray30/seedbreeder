// SundialButton component - hold to skip to next day
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SUNDIAL_HOLD_DURATION_MS } from '../constants/gameConstants';

interface SundialButtonProps {
  onComplete: () => void;
}

export const SundialButton: React.FC<SundialButtonProps> = ({ onComplete }) => {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    setIsHolding(true);
    setProgress(0);
    
    // Animate progress
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: SUNDIAL_HOLD_DURATION_MS,
      useNativeDriver: false,
    }).start();

    // Update progress every 100ms
    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / SUNDIAL_HOLD_DURATION_MS * 100);
        if (newProgress >= 100) {
          return 100;
        }
        return newProgress;
      });
    }, 100);

    // Complete after hold duration
    holdTimerRef.current = setTimeout(() => {
      setIsHolding(false);
      setProgress(0);
      progressAnim.setValue(0);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      onComplete();
    }, SUNDIAL_HOLD_DURATION_MS);
  };

  const handlePressOut = () => {
    setIsHolding(false);
    setProgress(0);
    progressAnim.setValue(0);
    
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={isHolding ? ['#FFD700', '#FFA500'] : ['#87CEEB', '#4682B4']}
        style={styles.button}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.text}>⏰ Sundial</Text>
        {isHolding && (
          <View style={styles.progressContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
          </View>
        )}
        <Text style={styles.hint}>Hold to skip to next day</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    zIndex: 1000,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
  progressContainer: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    color: '#FFF',
    marginTop: 4,
  },
  hint: {
    fontSize: 10,
    color: '#FFF',
    marginTop: 4,
    opacity: 0.8,
  },
});

