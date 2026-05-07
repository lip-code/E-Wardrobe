import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Image } from 'expo-image';
import { useWardrobe } from '../store/WardrobeContext';
import { CATEGORIES } from '../utils/constants';

const CATEGORY_ORDER = ['上衣', '外套', '裤子', '鞋子', '配饰'];
const CATEGORY_ICONS = {
  '上衣': '👕',
  '外套': '🧥',
  '裤子': '👖',
  '鞋子': '👟',
  '配饰': '👜',
};

export default function OutfitDetailScreen({ route, navigation }) {
  const { outfitId } = route.params;
  const { state } = useWardrobe();

  const outfit = state.outfits.find((o) => o.id === outfitId);
  if (!outfit) {
    return (
      <View style={styles.center}>
        <Text>搭配不存在</Text>
      </View>
    );
  }

  const clothes = outfit.clothIds
    .map((id) => state.clothes.find((c) => c.id === id))
    .filter(Boolean);

  // Group clothes by category in display order
  const grouped = CATEGORY_ORDER
    .map((cat) => ({
      category: cat,
      items: clothes.filter((c) => c.category === cat),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{outfit.name}</Text>
          {outfit.isTodayOutfit && (
            <View style={styles.todayBadge}>
              <Text style={styles.todayText}>今日穿搭</Text>
            </View>
          )}
        </View>
        <Text style={styles.date}>{outfit.date}</Text>
        <Text style={styles.count}>{clothes.length} 件单品</Text>
      </View>

      {/* Vertical outfit display */}
      <View style={styles.outfitContainer}>
        {grouped.map((group) => (
          <View key={group.category} style={styles.categorySection}>
            <View style={styles.categoryLabel}>
              <Text style={styles.categoryIcon}>
                {CATEGORY_ICONS[group.category] || '👕'}
              </Text>
              <Text style={styles.categoryName}>{group.category}</Text>
            </View>
            {group.items.map((cloth) => (
              <TouchableOpacity
                key={cloth.id}
                style={styles.clothRow}
                onPress={() =>
                  navigation.navigate('ClothDetail', { clothId: cloth.id })
                }
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: cloth.imageUri }}
                  style={styles.clothImage}
                  contentFit="cover"
                  transition={200}
                />
                <View style={styles.clothInfo}>
                  <Text style={styles.clothName}>{cloth.name}</Text>
                  <View style={styles.clothMeta}>
                    <Text style={styles.clothColor}>{cloth.color}</Text>
                    <Text style={styles.clothScene}>{cloth.scene}</Text>
                  </View>
                  <Text style={styles.clothWear}>
                    穿过 {cloth.wearCount} 次
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      {grouped.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>搭配中的衣物已被删除</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  todayBadge: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  todayText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  date: {
    fontSize: 13,
    color: '#999',
    marginTop: 6,
  },
  count: {
    fontSize: 13,
    color: '#4a6fa5',
    marginTop: 2,
  },
  outfitContainer: {
    padding: 16,
    gap: 20,
  },
  categorySection: {
    gap: 10,
  },
  categoryLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  categoryIcon: {
    fontSize: 18,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  clothRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  clothImage: {
    width: 120,
    height: 150,
    backgroundColor: '#f0f0f0',
  },
  clothInfo: {
    flex: 1,
    padding: 14,
    justifyContent: 'center',
  },
  clothName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  clothMeta: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  clothColor: {
    fontSize: 12,
    color: '#fff',
    backgroundColor: '#4a6fa5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  clothScene: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  clothWear: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
});
