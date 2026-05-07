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

const TAB_ICONS = {
  '衣橱': { default: '👕', active: '👕' },
  '搭配': { default: '👗', active: '👗' },
  '统计': { default: '📊', active: '📊' },
  '我的': { default: '👤', active: '👤' },
};

function TabIcon({ label, focused }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45 }}>
        {TAB_ICONS[label]?.default || '📱'}
      </Text>
    </View>
  );
}

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
          tabBarActiveTintColor: '#2C3E6B',
          tabBarInactiveTintColor: '#9B9EB5',
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '700',
            marginTop: -2,
          },
          tabBarStyle: {
            height: Platform.OS === 'ios' ? 88 : 66,
            paddingBottom: Platform.OS === 'ios' ? 28 : 10,
            paddingTop: 8,
            backgroundColor: '#FFFFFF',
            borderTopWidth: 0,
            elevation: 0,
            shadowColor: '#1A1F36',
            shadowOffset: { width: 0, height: -8 },
            shadowOpacity: 0.08,
            shadowRadius: 20,
          },
          tabBarBackground: () => (
            <View
              style={{
                flex: 1,
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                overflow: 'hidden',
              }}
            />
          ),
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
