import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { useWardrobe } from '../store/WardrobeContext';
import { ActionTypes } from '../store/wardrobeReducer';

export default function OutfitListScreen({ navigation }) {
  const { state, dispatch } = useWardrobe();

  const getClothById = (id) => state.clothes.find((c) => c.id === id);

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
    const clothThumbs = item.clothIds
      .map(getClothById)
      .filter(Boolean)
      .slice(0, 4);

    return (
      <View style={styles.card}>
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

        <View style={styles.thumbRow}>
          {clothThumbs.map((c) => (
            <Image
              key={c.id}
              source={{ uri: c.imageUri }}
              style={styles.thumb}
            />
          ))}
        </View>

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
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>我的搭配</Text>
        <Text style={styles.subtitle}>共 {state.outfits.length} 套</Text>
      </View>

      <FlatList
        data={state.outfits}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={renderOutfit}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>还没有搭配方案</Text>
            <Text style={styles.emptyHint}>
              在衣橱中选择衣物组合搭配吧
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
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  thumbRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  thumb: {
    width: 60,
    height: 75,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
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
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  emptyHint: {
    fontSize: 13,
    color: '#bbb',
    marginTop: 8,
  },
});
