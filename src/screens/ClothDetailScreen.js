import React, { useMemo } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useWardrobe } from '../store/WardrobeContext';
import { ActionTypes } from '../store/wardrobeReducer';
import WearCalendar from '../components/WearCalendar';

export default function ClothDetailScreen({ route, navigation }) {
  const { clothId } = route.params;
  const { state, dispatch } = useWardrobe();

  const cloth = state.clothes.find((c) => c.id === clothId);

  const recommendedClothes = useMemo(() => {
    if (!cloth) return [];
    return state.clothes
      .filter((c) => c.id !== clothId && c.category !== cloth.category)
      .slice(0, 4);
  }, [state.clothes, clothId, cloth]);

  if (!cloth) {
    return (
      <View style={styles.center}>
        <Text>衣物不存在</Text>
      </View>
    );
  }

  const handleRecordWear = () => {
    const today = new Date().toISOString().split('T')[0];
    if (cloth.wearHistory.includes(today)) {
      Alert.alert('提示', '今天已经记录过这件衣物了');
      return;
    }
    dispatch({ type: ActionTypes.RECORD_WEAR, payload: clothId });
    Alert.alert('成功', '已记录今日穿着！');
  };

  const handleDelete = () => {
    Alert.alert('确认删除', `确定要删除「${cloth.name}」吗？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: () => {
          dispatch({ type: ActionTypes.DELETE_CLOTH, payload: clothId });
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: cloth.imageUri }} style={styles.image} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{cloth.name}</Text>
          <TouchableOpacity
            onPress={() =>
              dispatch({ type: ActionTypes.TOGGLE_FAVORITE, payload: clothId })
            }
          >
            <Text style={styles.heart}>
              {cloth.isFavorite ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info grid */}
        <View style={styles.infoGrid}>
          <InfoItem label="分类" value={cloth.category} />
          <InfoItem label="颜色" value={cloth.color} />
          <InfoItem label="场景" value={cloth.scene} />
          <InfoItem label="季节" value={cloth.season} />
          {cloth.brand && <InfoItem label="品牌" value={cloth.brand} />}
          {cloth.material && <InfoItem label="材质" value={cloth.material} />}
          {cloth.price && (
            <InfoItem label="价格" value={`¥${cloth.price}`} />
          )}
          {cloth.purchaseDate && (
            <InfoItem label="购买日期" value={cloth.purchaseDate} />
          )}
        </View>

        {cloth.notes ? (
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>备注</Text>
            <Text style={styles.notesText}>{cloth.notes}</Text>
          </View>
        ) : null}

        {/* Wear stats */}
        <View style={styles.wearStats}>
          <Text style={styles.wearStatsTitle}>穿着统计</Text>
          <Text style={styles.wearStatsCount}>
            累计穿着 {cloth.wearCount} 次
          </Text>
        </View>

        {/* Wear calendar */}
        <WearCalendar wearHistory={cloth.wearHistory} />

        {/* Record wear button */}
        <TouchableOpacity style={styles.wearButton} onPress={handleRecordWear}>
          <Text style={styles.wearButtonText}>记录今日穿着</Text>
        </TouchableOpacity>

        {/* Recommended */}
        {recommendedClothes.length > 0 && (
          <View style={styles.recommendSection}>
            <Text style={styles.recommendTitle}>推荐搭配</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {recommendedClothes.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={styles.recommendCard}
                  onPress={() =>
                    navigation.push('ClothDetail', { clothId: c.id })
                  }
                >
                  <Image
                    source={{ uri: c.imageUri }}
                    style={styles.recommendImage}
                  />
                  <Text style={styles.recommendName} numberOfLines={1}>
                    {c.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Delete button */}
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>删除此衣物</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function InfoItem({ label, value }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 400,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  heart: {
    fontSize: 28,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  infoItem: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: '30%',
  },
  infoLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  notesSection: {
    backgroundColor: '#fffbe6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  notesLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#333',
  },
  wearStats: {
    marginBottom: 8,
  },
  wearStatsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  wearStatsCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  wearButton: {
    backgroundColor: '#4a6fa5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  wearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  recommendSection: {
    marginBottom: 24,
  },
  recommendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  recommendCard: {
    marginRight: 12,
    width: 100,
  },
  recommendImage: {
    width: 100,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  recommendName: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
    textAlign: 'center',
  },
  deleteButton: {
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ff4d4f',
    alignItems: 'center',
    marginBottom: 40,
  },
  deleteButtonText: {
    color: '#ff4d4f',
    fontSize: 16,
    fontWeight: '500',
  },
});
