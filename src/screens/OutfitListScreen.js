import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import PropTypes from 'prop-types';
import * as Crypto from 'expo-crypto';
import { useWardrobe } from '../store/WardrobeContext';
import { ActionTypes } from '../store/wardrobeReducer';
import { OUTFIT_TYPES } from '../utils/mockData';

const OutfitCard = React.memo(function OutfitCard({
  outfit,
  clothes,
  onPress,
  onSetToday,
  onEdit,
  onCopy,
  onDelete,
}) {
  const clothesList = outfit.clothIds
    .map((id) => clothes.find((c) => c.id === id))
    .filter(Boolean);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          {outfit.isTodayOutfit && (
            <View style={styles.todayBadge}>
              <Text style={styles.todayText}>今日穿搭</Text>
            </View>
          )}
          <Text style={styles.cardName} numberOfLines={1}>
            {outfit.name}
          </Text>
          <Text style={styles.cardMeta}>
            {outfit.clothIds.length} 件单品 · {outfit.date}
            {outfit.type ? ` · ${outfit.type}` : ''}
          </Text>
        </View>
        <View style={styles.clothCount}>
          <Text style={styles.clothCountText}>{outfit.clothIds.length}</Text>
        </View>
      </View>

      {/* Images strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.imageStrip}
        contentContainerStyle={styles.imageStripContent}
      >
        {clothesList.map((cloth) => (
          <Image
            key={cloth.id}
            source={{ uri: cloth.imageUri }}
            style={styles.thumb}
            contentFit="cover"
            transition={150}
          />
        ))}
        {clothesList.length === 0 && (
          <View style={styles.emptyThumb}>
            <Text style={styles.emptyThumbText}>无图片</Text>
          </View>
        )}
      </ScrollView>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionBtn, outfit.isTodayOutfit && styles.actionBtnActive]}
          onPress={onSetToday}
        >
          <Text style={[styles.actionBtnText, outfit.isTodayOutfit && styles.actionBtnTextActive]}>
            {outfit.isTodayOutfit ? '✓ 今日' : '今日'}
          </Text>
        </TouchableOpacity>
        <View style={styles.actionDivider} />
        <TouchableOpacity style={styles.actionBtn} onPress={onEdit}>
          <Text style={styles.actionBtnText}>修改</Text>
        </TouchableOpacity>
        <View style={styles.actionDivider} />
        <TouchableOpacity style={styles.actionBtn} onPress={onCopy}>
          <Text style={styles.actionBtnText}>复制</Text>
        </TouchableOpacity>
        <View style={styles.actionDivider} />
        <TouchableOpacity style={styles.actionBtn} onPress={onDelete}>
          <Text style={[styles.actionBtnText, styles.deleteBtnText]}>删除</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
});

OutfitCard.propTypes = {
  outfit: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    clothIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    date: PropTypes.string.isRequired,
    isTodayOutfit: PropTypes.bool.isRequired,
    type: PropTypes.string,
  }).isRequired,
  clothes: PropTypes.array.isRequired,
  onPress: PropTypes.func.isRequired,
  onSetToday: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onCopy: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default function OutfitListScreen({ navigation }) {
  const { state, dispatch } = useWardrobe();
  const [activeType, setActiveType] = useState('全部');

  const hasEnoughClothes = state.clothes.length >= 2;

  const filteredOutfits = useMemo(() => {
    if (activeType === '全部') return state.outfits;
    return state.outfits.filter((o) => o.type === activeType);
  }, [state.outfits, activeType]);

  const handleSetToday = useCallback(
    (outfitId) => {
      dispatch({ type: ActionTypes.SET_TODAY_OUTFIT, payload: outfitId });
      Alert.alert('✅', '已设为今日穿搭');
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    (outfitId, outfitName) => {
      Alert.alert('确认删除', `确定要删除「${outfitName}」吗？`, [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () =>
            dispatch({ type: ActionTypes.DELETE_OUTFIT, payload: outfitId }),
        },
      ]);
    },
    [dispatch]
  );

  const handleCopy = useCallback(
    (outfit) => {
      const newOutfit = {
        ...outfit,
        id: 'o' + Crypto.randomUUID(),
        name: outfit.name + '（副本）',
        date: new Date().toISOString().split('T')[0],
        isTodayOutfit: false,
      };
      dispatch({ type: ActionTypes.ADD_OUTFIT, payload: newOutfit });
      Alert.alert('✅', '搭配已复制');
    },
    [dispatch]
  );

  const keyExtractor = useCallback((item) => item.id, []);

  const renderItem = useCallback(
    ({ item }) => (
      <OutfitCard
        outfit={item}
        clothes={state.clothes}
        onPress={() => navigation.navigate('OutfitDetail', { outfitId: item.id })}
        onSetToday={() => handleSetToday(item.id)}
        onEdit={() => navigation.navigate('CreateOutfit', { outfitId: item.id })}
        onCopy={() => handleCopy(item)}
        onDelete={() => handleDelete(item.id, item.name)}
      />
    ),
    [state.clothes, navigation, handleSetToday, handleDelete, handleCopy]
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>我的搭配</Text>
        <Text style={styles.headerSubtitle}>
          {state.outfits.length > 0
            ? `共 ${state.outfits.length} 套方案`
            : '创建你的第一套搭配'}
        </Text>
      </View>

      {/* Type filter tabs */}
      <View style={styles.typeFilter}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.typeFilterRow}>
          {['全部', ...OUTFIT_TYPES].map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.typeFilterChip, activeType === t && styles.activeTypeFilterChip]}
              onPress={() => setActiveType(t)}
            >
              <Text style={[styles.typeFilterText, activeType === t && styles.activeTypeFilterText]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {!hasEnoughClothes && (
        <View style={styles.tipBar}>
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={styles.tipText}>
            至少需要 2 件衣物才能创建搭配，当前有 {state.clothes.length} 件
          </Text>
        </View>
      )}

      <FlatList
        data={filteredOutfits}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIconWrapper}>
              <Text style={styles.emptyIcon}>👗</Text>
            </View>
            <Text style={styles.emptyText}>还没有搭配方案</Text>
            <Text style={styles.emptyHint}>
              {hasEnoughClothes
                ? '在衣橱中选择衣物，\n组合出你的完美搭配'
                : '先去衣橱添加至少 2 件衣物\n再来创建搭配'}
            </Text>
          </View>
        }
      />

      {hasEnoughClothes && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('CreateOutfit')}
          activeOpacity={0.85}
        >
          <Text style={styles.fabText}>+ 创建搭配</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  header: {
    paddingTop: 64,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1F36',
    letterSpacing: -0.8,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#9B9EB5',
    marginTop: 3,
    fontWeight: '500',
  },
  typeFilter: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e8e8e8',
  },
  typeFilterRow: {
    gap: 8,
  },
  typeFilterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
  },
  activeTypeFilterChip: {
    backgroundColor: '#333',
  },
  typeFilterText: {
    fontSize: 13,
    color: '#666',
  },
  activeTypeFilterText: {
    color: '#fff',
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 20,
    paddingHorizontal: 22,
    height: 50,
    borderRadius: 18,
    backgroundColor: '#1A1F36',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1A1F36',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  fabText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  tipBar: {
    backgroundColor: '#FFFBF0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#E8B44A',
  },
  tipIcon: {
    fontSize: 16,
  },
  tipText: {
    fontSize: 13,
    color: '#8A6B1A',
    fontWeight: '500',
    flex: 1,
  },
  list: {
    padding: 16,
    paddingBottom: 110,
    gap: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#1A1F36',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 18,
    paddingBottom: 12,
  },
  cardHeaderLeft: {
    flex: 1,
    marginRight: 12,
  },
  todayBadge: {
    backgroundColor: '#E8734A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  todayText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  cardName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1A1F36',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  cardMeta: {
    fontSize: 12,
    color: '#9B9EB5',
    fontWeight: '500',
  },
  clothCount: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#EEF0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clothCountText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4A6FE8',
  },
  imageStrip: {
    marginBottom: 0,
  },
  imageStripContent: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 8,
  },
  thumb: {
    width: 70,
    height: 88,
    borderRadius: 14,
    backgroundColor: '#F0EEE9',
  },
  emptyThumb: {
    width: 70,
    height: 88,
    borderRadius: 14,
    backgroundColor: '#F5F6FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyThumbText: {
    fontSize: 11,
    color: '#9B9EB5',
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F5F6FA',
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 13,
  },
  actionBtnActive: {
    backgroundColor: '#F0F4FF',
  },
  actionBtnText: {
    fontSize: 13,
    color: '#4A6FE8',
    fontWeight: '600',
  },
  actionBtnTextActive: {
    color: '#2C3E6B',
    fontWeight: '700',
  },
  actionDivider: {
    width: 1,
    backgroundColor: '#F5F6FA',
  },
  deleteBtnText: {
    color: '#E85C6A',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  emptyIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#EEF0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyIcon: {
    fontSize: 36,
  },
  emptyText: {
    fontSize: 18,
    color: '#1A1F36',
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  emptyHint: {
    fontSize: 14,
    color: '#9B9EB5',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
});
