import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { CATEGORIES } from '../utils/constants';

export default function CategoryTabs({ selected, onSelect }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {CATEGORIES.map((cat) => {
        const isActive = selected === cat.key;
        return (
          <TouchableOpacity
            key={cat.key}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => onSelect(cat.key)}
          >
            <Text style={[styles.tabText, isActive && styles.activeText]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
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
    backgroundColor: '#f5f5f5',
  },
  activeTab: {
    backgroundColor: '#4a6fa5',
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
