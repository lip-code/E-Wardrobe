import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useWardrobe } from '../store/WardrobeContext';
import { ActionTypes } from '../store/wardrobeReducer';

const CATEGORY_ORDER = ['上衣', '外套', '裤子', '鞋子', '配饰'];
const CATEGORY_ICONS = {
  '上衣': '👕',
  '外套': '🧥',
  '裤子': '👖',
  '鞋子': '👟',
  '配饰': '👜',
};

export default function OutfitListScreen({ navigation }) {
  const { state, dispatch } = useWardrobe();

  const getClothById = (id) => state.clothes.find((c) => c.id === id);
  const hasEnoughClothes = state.clothes.length >= 2;

  const handleSetToday = (outfitId) => {
    dispatch({ type: ActionTypes.SET_TODAY_OUTFIT, payload: outfitId });
    Alert.alert('成功', '已设为今日穿搭');
  };

  const handleDelete = (outfitId, outfitName) => {
    Alert.alert('确认删除', `确定要删除「${outfitName}」吗？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: () =>
          dispatch({ type: ActionTypes.DELETE_OUTFIT, payload: outfitId }),
      },
    ]);
  };

  const renderOutfit = ({ item }) => {
    const clothes = item.clothIds.map(getClothById).filter(Boolean);

    // Group by category in display order
    const grouped = CATEGORY_ORDER
      .map((cat) => ({
        category: cat,
        items: clothes.filter((c) => c.category === cat),
      }))
      .filter((g) => g.items.length > 0);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('OutfitDetail', { outfitId: item.id })}
        activeOpacity={0.85}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            {item.isTodayOutfit && (
              <View style={styles.todayBadge}>
                <Text style={styles.todayBadgeText}>今日</Text>
              </View>
            )}
          </View>
          <Text style={styles.cardDate}>{item.date}</Text>
        </View>

        {/* Vertical outfit display */}
        <View style={styles.outfitPreview}>
          {grouped.map((group) => (
            <View key={group.category} style={styles.categoryRow}>
              <View style={styles.categoryLabel}>
                <Text style={styles.categoryIcon}>
                  {CATEGORY_ICONS[group.category]}
                </Text>
                <Text style={styles.categoryName}>{group.category}</Text>
              </View>
              <View style={styles.categoryItems}>
                {group.items.map((cloth) => (
                  <View key={cloth.id} style={styles.clothItem}>
                    <Image
                      source={{ uri: cloth.imageUri }}
                      style={styles.clothImage}
                      contentFit="cover"
                      transition={200}
                    />
                    <View style={styles.clothInfo}>
                      <Text style={styles.clothName} numberOfLines={1}>
                        {cloth.name}
                      </Text>
                      <Text style={styles.clothColor}>{cloth.color}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleSetToday(item.id)}
          >
            <Text style={styles.actionText}>
              {item.isTodayOutfit ? '已是今日穿搭' : '设为今日穿搭'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteAction]}
            onPress={() => handleDelete(item.id, item.name)}
          >
            <Text style={[styles.actionText, styles.deleteText]}>删除</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>我的搭配</Text>
            <Text style={styles.subtitle}>共 {state.outfits.length} 套</Text>
          </View>
          {hasEnoughClothes && (
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate('CreateOutfit')}
            >
              <Text style={styles.createButtonText}>+ 创建搭配</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {!hasEnoughClothes && (
        <View style={styles.tipBar}>
          <Text style={styles.tipText}>
            💡 至少需要 2 件衣物才能创建搭配，当前有 {state.clothes.length} 件
          </Text>
        </View>
      )}

      <FlatList
        data={state.outfits}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={renderOutfit}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>👗</Text>
            <Text style={styles.emptyText}>还没有搭配方案</Text>
            <Text style={styles.emptyHint}>
              {hasEnoughClothes
                ? '在衣橱中选择衣物组合搭配吧'
                : '先去衣橱添加至少 2 件衣物再来搭配'}
            </Text>
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
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  createButton: {
    backgroundColor: '#4a6fa5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  tipBar: {
    backgroundColor: '#fffbe6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ffe58f',
  },
  tipText: {
    fontSize: 13,
    color: '#ad6800',
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  todayBadge: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  todayBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  cardDate: {
    fontSize: 12,
    color: '#999',
  },
  outfitPreview: {
    gap: 10,
    marginBottom: 14,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryLabel: {
    width: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryName: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  categoryItems: {
    flex: 1,
    gap: 6,
  },
  clothItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    overflow: 'hidden',
  },
  clothImage: {
    width: 56,
    height: 56,
    backgroundColor: '#f0f0f0',
  },
  clothInfo: {
    flex: 1,
    paddingHorizontal: 10,
  },
  clothName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  clothColor: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f0f4ff',
    alignItems: 'center',
  },
  deleteAction: {
    backgroundColor: '#fff0f0',
  },
  actionText: {
    fontSize: 13,
    color: '#4a6fa5',
    fontWeight: '500',
  },
  deleteText: {
    color: '#ff4d4f',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  emptyHint: {
    fontSize: 13,
    color: '#bbb',
    marginTop: 8,
    textAlign: 'center',
  },
});
