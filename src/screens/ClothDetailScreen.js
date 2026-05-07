import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { useWardrobe } from '../store/WardrobeContext';
import { ActionTypes } from '../store/wardrobeReducer';
import WearCalendar from '../components/WearCalendar';

const INFO_ICONS = {
  '分类': '📂',
  '颜色': '🎨',
  '场景': '🌟',
  '季节': '🍃',
  '品牌': '🏷️',
  '材质': '🧵',
  '价格': '💰',
  '购买日期': '📅',
};

export default function ClothDetailScreen({ route, navigation }) {
  const { clothId } = route.params;
  const { state, dispatch } = useWardrobe();

  const cloth = state.clothes.find((c) => c.id === clothId);

  if (state.isBootstrapping) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2C3E6B" />
      </View>
    );
  }

  if (!cloth) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>衣物不存在</Text>
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
    Alert.alert('✅ 已记录', '今日穿着已记录！');
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

  const infoItems = [
    { label: '分类', value: cloth.category },
    { label: '颜色', value: cloth.color },
    { label: '场景', value: cloth.scene },
    { label: '季节', value: cloth.season },
    cloth.brand && { label: '品牌', value: cloth.brand },
    cloth.material && { label: '材质', value: cloth.material },
    cloth.price && { label: '价格', value: `¥${cloth.price}` },
    cloth.purchaseDate && { label: '购买日期', value: cloth.purchaseDate },
  ].filter(Boolean);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: cloth.imageUri }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
        {/* Back button overlay */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Title area */}
        <View style={styles.titleRow}>
          <Text style={styles.name}>{cloth.name}</Text>
          <View style={styles.wearPill}>
            <Text style={styles.wearPillText}>穿了 {cloth.wearCount} 次</Text>
          </View>
        </View>

        {/* Info grid */}
        <View style={styles.infoGrid}>
          {infoItems.map(({ label, value }) => (
            <View key={label} style={styles.infoItem}>
              <Text style={styles.infoIcon}>{INFO_ICONS[label] || '📌'}</Text>
              <View>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Notes */}
        {cloth.notes ? (
          <View style={styles.notesSection}>
            <Text style={styles.notesIcon}>📝</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.notesLabel}>备注</Text>
              <Text style={styles.notesText}>{cloth.notes}</Text>
            </View>
          </View>
        ) : null}

        {/* Wear calendar */}
        <View style={styles.calendarSection}>
          <WearCalendar wearHistory={cloth.wearHistory} />
        </View>

        {/* Record wear button */}
        <TouchableOpacity
          style={styles.wearButton}
          onPress={handleRecordWear}
          activeOpacity={0.85}
        >
          <Text style={styles.wearButtonIcon}>✓</Text>
          <Text style={styles.wearButtonText}>记录今日穿着</Text>
        </TouchableOpacity>

        {/* Edit & Delete buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('AddCloth', { clothId: cloth.id })}
            activeOpacity={0.7}
          >
            <Text style={styles.editButtonText}>编辑</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteButtonText}>删除此衣物</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF9F6',
  },
  errorText: {
    fontSize: 16,
    color: '#9B9EB5',
    fontWeight: '500',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 420,
    backgroundColor: '#F0EEE9',
  },
  backButton: {
    position: 'absolute',
    top: 56,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  backArrow: {
    fontSize: 28,
    color: '#1A1F36',
    lineHeight: 32,
    marginLeft: -2,
    fontWeight: '300',
  },
  content: {
    padding: 20,
    paddingTop: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  name: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1A1F36',
    flex: 1,
    letterSpacing: -0.8,
    marginRight: 12,
  },
  wearPill: {
    backgroundColor: '#FFF0E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 4,
  },
  wearPillText: {
    fontSize: 13,
    color: '#E8734A',
    fontWeight: '700',
  },
  infoGrid: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    shadowColor: '#1A1F36',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '48%',
    padding: 10,
    borderRadius: 14,
    backgroundColor: '#FAFBFF',
    marginBottom: 6,
  },
  infoIcon: {
    fontSize: 18,
  },
  infoLabel: {
    fontSize: 10,
    color: '#9B9EB5',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  infoValue: {
    fontSize: 13,
    color: '#1A1F36',
    fontWeight: '700',
    marginTop: 1,
  },
  notesSection: {
    backgroundColor: '#FFFBF0',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#E8B44A',
  },
  notesIcon: {
    fontSize: 18,
    marginTop: 1,
  },
  notesLabel: {
    fontSize: 11,
    color: '#C49B3A',
    fontWeight: '700',
    letterSpacing: 0.3,
    marginBottom: 3,
  },
  notesText: {
    fontSize: 14,
    color: '#5A4A1A',
    lineHeight: 20,
  },
  calendarSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#1A1F36',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  wearButton: {
    backgroundColor: '#2C3E6B',
    paddingVertical: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
    shadowColor: '#2C3E6B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 5,
  },
  wearButtonIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  wearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 40,
  },
  editButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: '#2C3E6B',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#FFCDD2',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
  },
  deleteButtonText: {
    color: '#E85C6A',
    fontSize: 15,
    fontWeight: '700',
  },
});
