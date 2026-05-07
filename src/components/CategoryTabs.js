import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
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
    <View style={styles.container}>
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
          <Text style={styles.addTabText}>+ 添加</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  addTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
  },
  addTabText: {
    fontSize: 14,
    color: '#999',
  },
});
