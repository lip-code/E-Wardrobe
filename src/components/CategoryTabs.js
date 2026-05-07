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
      {isActive && <View style={styles.activeIndicator} />}
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
    paddingVertical: 2,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 22,
    backgroundColor: '#EEEFF6',
    position: 'relative',
  },
  activeTab: {
    backgroundColor: '#2C3E6B',
    shadowColor: '#2C3E6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  tabText: {
    fontSize: 13,
    color: '#9B9EB5',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  activeText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -2,
    left: '50%',
    marginLeft: -3,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2C3E6B',
  },
  addTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#D8DBF0',
    borderStyle: 'dashed',
  },
  addTabText: {
    fontSize: 13,
    color: '#9B9EB5',
    fontWeight: '600',
  },
});
