// App Navigator - sets up navigation structure
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { FarmScreen } from '../screens/FarmScreen';
import { MiningScreen } from '../screens/MiningScreen';
import { InventoryScreen } from '../screens/InventoryScreen';

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
  return <>{emoji}</>;
};

