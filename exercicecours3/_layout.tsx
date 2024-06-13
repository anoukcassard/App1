import React from 'react';
import { useColorScheme } from '../hooks/useColorScheme';
import { TabBarIcon } from '../components/navigation/TabBarIcon';
import { Stack, Tabs } from 'expo-router';




export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Index',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Users"

        options={{
          title: 'Users',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Home"
        
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="/users/[username]"
        
      />
    </Stack>
  );
}
