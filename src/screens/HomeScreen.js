import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
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
      <View style={styles.todayBar}>
        <Text style={styles.todayLabel}>
          {todayOutfit
            ? `今日穿搭：${todayOutfit.name}`
            : '今天还没选穿搭哦'}
        </Text>
      </View>

      {/* Category tabs */}
      <CategoryTabs
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Cloth list */}
      <FlatList
        data={filteredClothes}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ClothCard
            item={item}
            onPress={() =>
              navigation.navigate('ClothDetail', { clothId: item.id })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>这个分类还没有衣物</Text>
          </View>
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
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
});
