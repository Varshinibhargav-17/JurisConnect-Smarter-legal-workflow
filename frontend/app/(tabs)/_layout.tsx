import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4f46e5', // Indigo-600
        tabBarInactiveTintColor: '#94a3b8', // Slate-400
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#f1f5f9',
          height: 60,
          paddingBottom: 8,
          backgroundColor: '#ffffff',
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="matters"
        options={{
          title: 'Matters',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="paperplane.fill" color={color} />, // Briefcase or folder would be better if available
        }}
      />
      <Tabs.Screen
        name="clients"
        options={{
          title: 'Clients',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="person.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="time-tracking"
        options={{
          title: 'Timer',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="chevron.right" color={color} style={{ transform: [{ rotate: '-90deg' }] }} />, // Clock icon replacement
        }}
      />
      <Tabs.Screen
        name="invoices"
        options={{
          title: 'Invoices',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="paperplane.fill" color={color} />, // Dollar replacement
        }}
      />
    </Tabs>
  );
}
