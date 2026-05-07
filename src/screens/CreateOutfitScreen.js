import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import * as Crypto from 'expo-crypto';
import { useWardrobe } from '../store/WardrobeContext';
import { ActionTypes } from '../store/wardrobeReducer';

const BASE_CATEGORIES = ['上衣', '外套', '裤子', '鞋子', '配饰'];
const CATEGORY_ICONS = {
  '上衣': '👕',
  '外套': '🧥',
  '裤子': '👖',
  '鞋子': '👟',
  '配饰': '👜',
};

export default function CreateOutfitScreen({ route, navigation }) {
  const { state, dispatch } = useWardrobe();
  const editId = route.params?.outfitId;
  const editingOutfit = editId
    ? state.outfits.find((o) => o.id === editId)
    : null;
  const isEdit = !!editingOutfit;

  const [name, setName] = useState(editingOutfit?.name || '');
  const [selectedIds, setSelectedIds] = useState(
    editingOutfit?.clothIds || []
  );
  const [activeCategory, setActiveCategory] = useState('上衣');

  const categoryOrder = useMemo(
    () => [...BASE_CATEGORIES, ...state.customCategories],
    [state.customCategories]
  );

  const toggleSelect = (clothId) => {
    setSelectedIds((prev) =>
      prev.includes(clothId)
        ? prev.filter((id) => id !== clothId)
        : [...prev, clothId]
    );
  };

  const categoryClothes = useMemo(() => {
    return state.clothes.filter((c) => c.category === activeCategory);
  }, [state.clothes, activeCategory]);

  const selectedClothes = useMemo(() => {
    return state.clothes.filter((c) => selectedIds.includes(c.id));
  }, [state.clothes, selectedIds]);

  const gridKeyExtractor = useCallback((item) => item.id, []);

  const selectedByCategory = useMemo(() => {
    const groups = {};
    categoryOrder.forEach((cat) => {
      const items = selectedClothes.filter((c) => c.category === cat);
      if (items.length > 0) groups[cat] = items;
    });
    return groups;
  }, [selectedClothes, categoryOrder]);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('提示', '请输入搭配名称');
      return;
    }
    if (selectedIds.length < 2) {
      Alert.alert('提示', '请至少选择 2 件衣物');
      return;
    }

    if (isEdit) {
      dispatch({
        type: ActionTypes.UPDATE_OUTFIT,
        payload: {
          id: editId,
          name: name.trim(),
          clothIds: selectedIds,
        },
      });
      Alert.alert('成功', '搭配已更新！', [
        { text: '确定', onPress: () => navigation.goBack() },
      ]);
    } else {
      const newOutfit = {
        id: 'o' + Crypto.randomUUID(),
        name: name.trim(),
        clothIds: selectedIds,
        date: new Date().toISOString().split('T')[0],
        isTodayOutfit: false,
      };
      dispatch({ type: ActionTypes.ADD_OUTFIT, payload: newOutfit });
      Alert.alert('成功', '搭配已创建！', [
        { text: '确定', onPress: () => navigation.goBack() },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>取消</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEdit ? '修改搭配' : '创建搭配'}
        </Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>保存</Text>
        </TouchableOpacity>
      </View>

      {/* Name input */}
      <View style={styles.nameSection}>
        <TextInput
          style={styles.nameInput}
          value={name}
          onChangeText={setName}
          placeholder="给这套搭配起个名字"
          placeholderTextColor="#bbb"
        />
      </View>

      {/* Selected preview */}
      {selectedClothes.length > 0 && (
        <View style={styles.previewSection}>
          <Text style={styles.previewTitle}>
            已选 {selectedClothes.length} 件
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.previewList}
          >
            {Object.entries(selectedByCategory).map(([cat, items]) =>
              items.map((cloth) => (
                <View key={cloth.id} style={styles.previewItem}>
                  <Image
                    source={{ uri: cloth.imageUri }}
                    style={styles.previewImage}
                    contentFit="cover"
                  />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => toggleSelect(cloth.id)}
                  >
                    <Text style={styles.removeText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      )}

      {/* Category tabs */}
      <View style={styles.categoryTabs}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categoryOrder.map((cat) => {
            const isActive = activeCategory === cat;
            const count = selectedClothes.filter(
              (c) => c.category === cat
            ).length;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryTab,
                  isActive && styles.activeCategoryTab,
                ]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text style={styles.categoryTabIcon}>
                  {CATEGORY_ICONS[cat] || '📦'}
                </Text>
                <Text
                  style={[
                    styles.categoryTabText,
                    isActive && styles.activeCategoryTabText,
                  ]}
                >
                  {cat}
                </Text>
                {count > 0 && (
                  <View style={styles.categoryCount}>
                    <Text style={styles.categoryCountText}>{count}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Cloth grid */}
      <FlatList
        data={categoryClothes}
        keyExtractor={gridKeyExtractor}
        numColumns={3}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridList}
        renderItem={({ item }) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <TouchableOpacity
              style={[styles.gridItem, isSelected && styles.selectedItem]}
              onPress={() => toggleSelect(item.id)}
              activeOpacity={0.7}
            >
              <Image
                source={{ uri: item.imageUri }}
                style={styles.gridImage}
                contentFit="cover"
                transition={150}
              />
              {isSelected && (
                <View style={styles.checkOverlay}>
                  <View style={styles.checkCircle}>
                    <Text style={styles.checkMark}>✓</Text>
                  </View>
                </View>
              )}
              <Text style={styles.gridName} numberOfLines={1}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              这个分类还没有衣物
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
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cancelText: {
    fontSize: 16,
    color: '#999',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  saveText: {
    fontSize: 16,
    color: '#4a6fa5',
    fontWeight: '600',
  },
  nameSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  nameInput: {
    fontSize: 16,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 8,
  },
  previewSection: {
    backgroundColor: '#f8f9ff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e8ecf4',
  },
  previewTitle: {
    fontSize: 12,
    color: '#4a6fa5',
    fontWeight: '500',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  previewList: {
    paddingHorizontal: 12,
    gap: 8,
  },
  previewItem: {
    position: 'relative',
  },
  previewImage: {
    width: 50,
    height: 62,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  removeButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ff4d4f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  categoryTabs: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    gap: 4,
  },
  activeCategoryTab: {
    backgroundColor: '#4a6fa5',
  },
  categoryTabIcon: {
    fontSize: 14,
  },
  categoryTabText: {
    fontSize: 13,
    color: '#666',
  },
  activeCategoryTabText: {
    color: '#fff',
    fontWeight: '500',
  },
  categoryCount: {
    backgroundColor: '#ff6b6b',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  categoryCountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  gridRow: {
    justifyContent: 'flex-start',
    paddingHorizontal: 12,
    gap: 10,
  },
  gridList: {
    paddingVertical: 12,
    paddingBottom: 40,
  },
  gridItem: {
    width: '31%',
    marginBottom: 12,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fafafa',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedItem: {
    borderColor: '#4a6fa5',
    backgroundColor: '#f0f4ff',
  },
  gridImage: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: '#f0f0f0',
  },
  checkOverlay: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4a6fa5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  gridName: {
    fontSize: 12,
    color: '#333',
    padding: 6,
    textAlign: 'center',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
});
