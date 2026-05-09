import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useWardrobe } from '../store/WardrobeContext';
import { ActionTypes } from '../store/wardrobeReducer';
import { OUTFIT_TYPES } from '../utils/mockData';

export default function OutfitDetailScreen({ route, navigation }) {
  const { outfitId } = route.params;
  const { state, dispatch } = useWardrobe();

  const outfit = state.outfits.find((o) => o.id === outfitId);

  const allOutfitTypes = useMemo(
    () => [...OUTFIT_TYPES, ...state.customOutfitCategories],
    [state.customOutfitCategories]
  );

  const handleChangeType = useCallback(
    (type) => {
      dispatch({
        type: ActionTypes.UPDATE_OUTFIT,
        payload: { id: outfitId, type },
      });
    },
    [outfitId, dispatch]
  );

  const handleChangeCover = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('提示', '需要相册权限才能更换封面');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      dispatch({
        type: ActionTypes.UPDATE_OUTFIT,
        payload: { id: outfitId, coverImageUri: result.assets[0].uri },
      });
    }
  }, [outfitId, dispatch]);

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

  return (
    <ScrollView style={styles.container}>
      {/* Cover image */}
      <TouchableOpacity
        style={styles.coverWrapper}
        onPress={handleChangeCover}
        activeOpacity={0.85}
      >
        {outfit.coverImageUri ? (
          <Image
            source={{ uri: outfit.coverImageUri }}
            style={styles.coverImage}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={[styles.coverImage, styles.coverEmpty]}>
            <Text style={styles.coverEmptyIcon}>📷</Text>
            <Text style={styles.coverEmptyText}>点击设置封面</Text>
          </View>
        )}
        <View style={styles.coverHint}>
          <Text style={styles.coverHintText}>点击更换封面</Text>
        </View>
      </TouchableOpacity>

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
        {/* Type selector */}
        <Text style={styles.typeLabel}>分类</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.typeRow}>
          {allOutfitTypes.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.typeChip, outfit.type === t && styles.activeTypeChip]}
              onPress={() => handleChangeType(t)}
            >
              <Text style={[styles.typeChipText, outfit.type === t && styles.activeTypeChipText]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Cloth images grid */}
      <View style={styles.clothGrid}>
        {clothes.map((cloth) => (
          <TouchableOpacity
            key={cloth.id}
            style={styles.clothGridItem}
            onPress={() => navigation.navigate('ClothDetail', { clothId: cloth.id })}
            activeOpacity={0.85}
          >
            <Image
              source={{ uri: cloth.imageUri }}
              style={styles.clothGridImage}
              contentFit="cover"
              transition={200}
            />
          </TouchableOpacity>
        ))}
      </View>

      {clothes.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>搭配中的衣物已被删除</Text>
        </View>
      )}

      {/* Action buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.todayBtn]}
          onPress={() => {
            dispatch({ type: ActionTypes.SET_TODAY_OUTFIT, payload: outfitId });
            Alert.alert('✅', '已设为今日穿搭');
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.todayBtnText}>
            {outfit.isTodayOutfit ? '✓ 今日' : '今日'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.editBtn]}
          onPress={() => navigation.navigate('CreateOutfit', { outfitId })}
          activeOpacity={0.85}
        >
          <Text style={styles.editBtnText}>编辑</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => {
            Alert.alert('确认删除', `确定要删除「${outfit.name}」吗？`, [
              { text: '取消', style: 'cancel' },
              {
                text: '删除',
                style: 'destructive',
                onPress: () => {
                  dispatch({ type: ActionTypes.DELETE_OUTFIT, payload: outfitId });
                  navigation.goBack();
                },
              },
            ]);
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.deleteBtnText}>删除</Text>
        </TouchableOpacity>
      </View>
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
  coverWrapper: {
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: '#F0EEE9',
  },
  coverEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEEFF6',
  },
  coverEmptyIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  coverEmptyText: {
    fontSize: 14,
    color: '#9B9EB5',
    fontWeight: '500',
  },
  coverHint: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  coverHintText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  header: {
    padding: 16,
    paddingTop: 16,
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
  typeLabel: {
    fontSize: 12,
    color: '#9B9EB5',
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 6,
  },
  typeRow: {
    gap: 6,
  },
  typeChip: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#EEEFF6',
  },
  activeTypeChip: {
    backgroundColor: '#2C3E6B',
  },
  typeChipText: {
    fontSize: 12,
    color: '#9B9EB5',
    fontWeight: '600',
  },
  activeTypeChipText: {
    color: '#fff',
    fontWeight: '700',
  },
  clothGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    gap: 6,
  },
  clothGridItem: {
    width: '32.3%',
    borderRadius: 14,
    overflow: 'hidden',
  },
  clothGridImage: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: '#F0EEE9',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
  actionSection: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 40,
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  todayBtn: {
    backgroundColor: '#2C3E6B',
  },
  todayBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  editBtn: {
    backgroundColor: '#4a6fa5',
  },
  editBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  deleteBtn: {
    backgroundColor: '#FFF5F5',
    borderWidth: 1.5,
    borderColor: '#FFCDD2',
  },
  deleteBtnText: {
    color: '#E85C6A',
    fontSize: 14,
    fontWeight: '700',
  },
});
