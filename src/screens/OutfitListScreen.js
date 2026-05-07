import React, { useCallback } from 'react';
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
      activeOpacity={0.7}
    >
      <View style={styles.cardMain}>
        <View style={styles.cardLeft}>
          <View style={styles.nameRow}>
            <Text style={styles.cardName} numberOfLines={1}>
              {outfit.name}
            </Text>
            {outfit.isTodayOutfit && (
              <View style={styles.todayBadge}>
                <Text style={styles.todayText}>今日</Text>
              </View>
            )}
          </View>
          <Text style={styles.cardMeta}>
            {outfit.clothIds.length} 件 · {outfit.date}
          </Text>
        </View>
      </View>

      {/* Images */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.imageStrip}
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
      </ScrollView>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={onSetToday}>
          <Text style={styles.actionBtnText}>
            {outfit.isTodayOutfit ? '✓ 今日' : '今日'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={onEdit}>
          <Text style={styles.actionBtnText}>修改</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={onCopy}>
          <Text style={styles.actionBtnText}>复制</Text>
        </TouchableOpacity>
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

  const hasEnoughClothes = state.clothes.length >= 2;

  const handleSetToday = useCallback(
    (outfitId) => {
      dispatch({ type: ActionTypes.SET_TODAY_OUTFIT, payload: outfitId });
      Alert.alert('成功', '已设为今日穿搭');
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
      Alert.alert('成功', '搭配已复制');
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
      <View style={styles.header} />

      {!hasEnoughClothes && (
        <View style={styles.tipBar}>
          <Text style={styles.tipText}>
            💡 至少需要 2 件衣物才能创建搭配，当前有 {state.clothes.length} 件
          </Text>
        </View>
      )}

      <FlatList
        data={state.outfits}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
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

      {hasEnoughClothes && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('CreateOutfit')}
          activeOpacity={0.8}
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
    backgroundColor: '#fafafa',
  },
  header: {
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 20,
    paddingHorizontal: 20,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  fabText: {
    fontSize: 15,
    color: '#fff',
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
    padding: 12,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
  },
  cardMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardLeft: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cardMeta: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
  },
  imageStrip: {
    marginBottom: 10,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  todayBadge: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  todayText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
    gap: 0,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  actionBtnText: {
    fontSize: 13,
    color: '#4a6fa5',
  },
  deleteBtnText: {
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
