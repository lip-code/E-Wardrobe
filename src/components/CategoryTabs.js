import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { CATEGORIES } from '../utils/constants';

function AnimatedTab({ cat, isActive, onSelect }) {
  const bgAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(isActive ? 1 : 1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(bgAnim, {
        toValue: isActive ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: isActive ? 1.08 : 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [isActive]);

  const backgroundColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#f5f5f5', '#4a6fa5'],
  });

  return (
    <TouchableOpacity onPress={() => onSelect(cat.key)} activeOpacity={0.7}>
      <Animated.View
        style={[
          styles.tab,
          { backgroundColor, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Text style={[styles.tabText, isActive && styles.activeText]}>
          {cat.label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function CategoryTabs({ selected, onSelect }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {CATEGORIES.map((cat) => (
        <AnimatedTab
          key={cat.key}
          cat={cat}
          isActive={selected === cat.key}
          onSelect={onSelect}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeText: {
    color: '#fff',
    fontWeight: '600',
  },
});
