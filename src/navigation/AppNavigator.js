import React from 'react';
import { View, Text, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import ClothDetailScreen from '../screens/ClothDetailScreen';
import AddClothScreen from '../screens/AddClothScreen';
import OutfitListScreen from '../screens/OutfitListScreen';
import OutfitDetailScreen from '../screens/OutfitDetailScreen';
import CreateOutfitScreen from '../screens/CreateOutfitScreen';
import StatsScreen from '../screens/StatsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FloatingButton from '../components/FloatingButton';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ label, focused }) {
  const icons = {
    '衣橱': '👕',
    '搭配': '👗',
    '统计': '📊',
    '我的': '👤',
  };
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>
      {icons[label] || '📱'}
    </Text>
  );
}

const fadeTransition = {
  animation: 'fade',
  config: {
    animation: 'fade',
    config: {
      duration: 200,
    },
  },
};

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="ClothDetail" component={ClothDetailScreen} />
    </Stack.Navigator>
  );
}

function OutfitStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="OutfitList" component={OutfitListScreen} />
      <Stack.Screen name="OutfitDetail" component={OutfitDetailScreen} />
      <Stack.Screen name="CreateOutfit" component={CreateOutfitScreen} />
    </Stack.Navigator>
  );
}

function MainTabs({ navigation }) {
  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: '#4a6fa5',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: {
            height: Platform.OS === 'ios' ? 88 : 64,
            paddingBottom: Platform.OS === 'ios' ? 28 : 8,
            paddingTop: 8,
            backgroundColor: '#fff',
            borderTopWidth: 0.5,
            borderTopColor: '#e0e0e0',
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
        }}
      >
        <Tab.Screen
          name="衣橱"
          component={HomeStack}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon label="衣橱" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="搭配"
          component={OutfitStack}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon label="搭配" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="addPlaceholder"
          component={View}
          options={{
            tabBarButton: () => null,
            tabBarLabel: () => null,
          }}
        />
        <Tab.Screen
          name="统计"
          component={StatsScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon label="统计" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="我的"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon label="我的" focused={focused} />
            ),
          }}
        />
      </Tab.Navigator>
      <FloatingButton onPress={() => navigation.navigate('AddCloth')} />
    </>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="ClothDetail"
          component={ClothDetailScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="AddCloth"
          component={AddClothScreen}
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
