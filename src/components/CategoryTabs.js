import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { CATEGORIES } from '../utils/constants';

function Tab({ cat, isActive, onSelect }) {
  return (
    <TouchableOpacity
      onPress={() => onSelect(cat.key)}
      activeOpacity={0.7}
      style={[styles.tab, isActive && styles.activeTab]}
    >
      <Text style={[styles.tabText, isActive && styles.activeText]}>
        {cat.label}
      </Text>
    </TouchableOpacity>
  );
}

export default function CategoryTabs({ selected, onSelect, customCategories = [], onAdd }) {
  const allCategories = [
    ...CATEGORIES,
    ...customCategories.map((c) => ({ key: c, label: c })),
  ];

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {allCategories.map((cat) => (
          <Tab
            key={cat.key}
            cat={cat}
            isActive={selected === cat.key}
            onSelect={onSelect}
          />
        ))}
        {onAdd && (
          <TouchableOpacity
            onPress={onAdd}
            activeOpacity={0.7}
            style={styles.addTab}
          >
            <Text style={styles.addTabText}>+ 新建</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FAF9F6',
  },
  container: {
    paddingVertical: 6,
    gap: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#EEEFF6',
  },
  activeTab: {
    backgroundColor: '#2C3E6B',
  },
  tabText: {
    fontSize: 12,
    color: '#9B9EB5',
    fontWeight: '600',
  },
  activeText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  addTab: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#D8DBF0',
    borderStyle: 'dashed',
  },
  addTabText: {
    fontSize: 12,
    color: '#9B9EB5',
    fontWeight: '600',
  },
});
