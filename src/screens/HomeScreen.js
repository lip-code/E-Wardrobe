import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useWardrobe } from '../store/WardrobeContext';
import ClothCard from '../components/ClothCard';
import CategoryTabs from '../components/CategoryTabs';

export default function HomeScreen({ navigation }) {
  const { state } = useWardrobe();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredClothes = useMemo(() => {
    if (selectedCategory === 'all') return state.clothes;
    return state.clothes.filter((c) => c.category === selectedCategory);
  }, [state.clothes, selectedCategory]);

  const todayOutfit = state.outfits.find((o) => o.isTodayOutfit);
  const isEmpty = state.clothes.length === 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>我的衣橱</Text>
        <Text style={styles.subtitle}>
          共 {state.clothes.length} 件
        </Text>
      </View>

      {/* Today outfit status */}
      {!isEmpty && (
        <View style={styles.todayBar}>
          <Text style={styles.todayLabel}>
            {todayOutfit
              ? `今日穿搭：${todayOutfit.name}`
              : '今天还没选穿搭哦'}
          </Text>
        </View>
      )}

      {/* Category tabs */}
      {!isEmpty && (
        <CategoryTabs
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      )}

      {/* Cloth list */}
      <FlatList
        data={filteredClothes}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[styles.list, isEmpty && styles.emptyList]}
        renderItem={({ item }) => (
          <ClothCard
            item={item}
            onPress={() =>
              navigation.navigate('ClothDetail', { clothId: item.id })
            }
          />
        )}
        ListEmptyComponent={
          isEmpty ? (
            <View style={styles.emptyGuide}>
              <Text style={styles.emptyIcon}>👕</Text>
              <Text style={styles.emptyTitle}>衣橱还是空的</Text>
              <Text style={styles.emptyHint}>
                添加你的第一件单品，开始管理你的穿搭吧
              </Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddCloth')}
              >
                <Text style={styles.addButtonText}>+ 添加第一件单品</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyCategory}>
              <Text style={styles.emptyCategoryText}>这个分类还没有衣物</Text>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 8,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  todayBar: {
    backgroundColor: '#fff3e0',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  todayLabel: {
    fontSize: 14,
    color: '#e65100',
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  list: {
    paddingBottom: 100,
  },
  emptyList: {
    flex: 1,
  },
  emptyGuide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#4a6fa5',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 24,
    elevation: 2,
    shadowColor: '#4a6fa5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyCategory: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyCategoryText: {
    fontSize: 14,
    color: '#999',
  },
});
