import React from 'react';
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
import { useWardrobe } from '../store/WardrobeContext';
import { ActionTypes } from '../store/wardrobeReducer';

export default function OutfitListScreen({ navigation }) {
  const { state, dispatch } = useWardrobe();

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

  const handleCopy = (outfit) => {
    const newOutfit = {
      ...outfit,
      id: 'o' + Date.now().toString(),
      name: outfit.name + '（副本）',
      date: new Date().toISOString().split('T')[0],
      isTodayOutfit: false,
    };
    dispatch({ type: ActionTypes.ADD_OUTFIT, payload: newOutfit });
    Alert.alert('成功', '搭配已复制');
  };

  const handleEdit = (outfitId) => {
    navigation.navigate('CreateOutfit', { outfitId });
  };

  const getClothById = (id) => state.clothes.find((c) => c.id === id);

  const renderOutfit = ({ item }) => {
    const clothes = item.clothIds.map(getClothById).filter(Boolean);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('OutfitDetail', { outfitId: item.id })}
        activeOpacity={0.7}
      >
        <View style={styles.cardMain}>
          <View style={styles.cardLeft}>
            <View style={styles.nameRow}>
              <Text style={styles.cardName} numberOfLines={1}>
                {item.name}
              </Text>
              {item.isTodayOutfit && (
                <View style={styles.todayBadge}>
                  <Text style={styles.todayText}>今日</Text>
                </View>
              )}
            </View>
            <Text style={styles.cardMeta}>
              {item.clothIds.length} 件 · {item.date}
            </Text>
          </View>
        </View>

        {/* Image strip */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imageStrip}
        >
          {clothes.map((cloth) => (
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
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleSetToday(item.id)}
          >
            <Text style={styles.actionBtnText}>
              {item.isTodayOutfit ? '✓ 今日' : '今日'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleEdit(item.id)}
          >
            <Text style={styles.actionBtnText}>修改</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleCopy(item)}
          >
            <Text style={styles.actionBtnText}>复制</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleDelete(item.id, item.name)}
          >
            <Text style={[styles.actionBtnText, styles.deleteBtnText]}>删除</Text>
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
