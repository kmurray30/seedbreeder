// Main App component
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useGameStore } from './src/store/gameStore';

export default function App() {
  const initialize = useGameStore(state => state.initialize);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const loadGame = async () => {
      try {
        await initialize();
      } catch (error) {
        console.error('Error initializing game:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGame();
  }, [initialize]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="auto" />
      <AppNavigator />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
});

