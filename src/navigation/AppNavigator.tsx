// App Navigator - sets up navigation structure
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Text } from 'react-native';
import { FarmScreen } from '../screens/FarmScreen';
import { InventoryScreen } from '../screens/InventoryScreen';
import { MiningScreen } from '../screens/MiningScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#999',
        }}
      >
        <Tab.Screen
          name="Farm"
          component={FarmScreen}
          options={{
            tabBarIcon: ({ color }) => <TabIcon emoji="🌱" color={color} />,
          }}
        />
        <Tab.Screen
          name="Mining"
          component={MiningScreen}
          options={{
            tabBarIcon: ({ color }) => <TabIcon emoji="⛏️" color={color} />,
          }}
        />
        <Tab.Screen
          name="Inventory"
          component={InventoryScreen}
          options={{
            tabBarIcon: ({ color }) => <TabIcon emoji="🎒" color={color} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const TabIcon: React.FC<{ emoji: string; color: string }> = ({ emoji }) => {
  return <Text>{emoji}</Text>;
};

