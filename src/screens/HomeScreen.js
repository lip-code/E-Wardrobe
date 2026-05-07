import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useWardrobe } from '../store/WardrobeContext';
import { ActionTypes } from '../store/wardrobeReducer';
import ClothCard from '../components/ClothCard';
import CategoryTabs from '../components/CategoryTabs';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_MARGIN = 8;
const CARD_WIDTH = (SCREEN_WIDTH - CARD_MARGIN * 4) / 2;
const ITEM_HEIGHT = CARD_WIDTH * 1.2 + 55;

export default function HomeScreen({ navigation }) {
  const { state, dispatch } = useWardrobe();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const filteredClothes = useMemo(() => {
    if (selectedCategory === 'all') return state.clothes;
    return state.clothes.filter((c) => c.category === selectedCategory);
  }, [state.clothes, selectedCategory]);

  const isEmpty = state.clothes.length === 0;

  const handleAddCategory = useCallback(() => {
    setShowAddCategory(true);
    setNewCategoryName('');
  }, []);

  const handleConfirmAddCategory = useCallback(() => {
    const name = newCategoryName.trim();
    if (!name) return;
    if (state.customCategories.includes(name)) {
      Alert.alert('提示', '该分类已存在');
      return;
    }
    dispatch({ type: ActionTypes.ADD_CATEGORY, payload: name });
    setSelectedCategory(name);
    setShowAddCategory(false);
    setNewCategoryName('');
  }, [newCategoryName, state.customCategories, dispatch]);

  const keyExtractor = useCallback((item) => item.id, []);

  const getItemLayout = useCallback(
    (_, index) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * Math.floor(index / 2),
      index,
    }),
    []
  );

  const renderItem = useCallback(
    ({ item }) => (
      <ClothCard
        item={item}
        onPress={() => navigation.navigate('ClothDetail', { clothId: item.id })}
      />
    ),
    [navigation]
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View style={styles.header} />

      {/* Category tabs */}
      {!isEmpty && (
        <CategoryTabs
          selected={selectedCategory}
          onSelect={setSelectedCategory}
          customCategories={state.customCategories}
          onAdd={handleAddCategory}
        />
      )}

      {/* Cloth list */}
      <FlatList
        data={filteredClothes}
        keyExtractor={keyExtractor}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[styles.list, isEmpty && styles.emptyList]}
        getItemLayout={getItemLayout}
        renderItem={renderItem}
        ListEmptyComponent={
          isEmpty ? (
            <View style={styles.emptyGuide}>
              <Text style={styles.emptyIcon}>👕</Text>
              <Text style={styles.emptyTitle}>衣橱还是空的</Text>
              <Text style={styles.emptyHint}>
                添加你的第一件单品，开始管理你的穿搭吧
              </Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddCloth')}
              >
                <Text style={styles.addButtonText}>+ 添加第一件单品</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyCategory}>
              <Text style={styles.emptyCategoryText}>这个分类还没有衣物</Text>
            </View>
          )
        }
      />

      {/* Add Category Modal */}
      <Modal
        visible={showAddCategory}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddCategory(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAddCategory(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>新建分类</Text>
            <TextInput
              style={styles.modalInput}
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              placeholder="输入分类名称"
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setShowAddCategory(false)}
              >
                <Text style={styles.modalCancelText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirm}
                onPress={handleConfirmAddCategory}
              >
                <Text style={styles.modalConfirmText}>确定</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  list: {
    paddingBottom: 100,
  },
  emptyList: {
    flex: 1,
  },
  emptyGuide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#4a6fa5',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 24,
    elevation: 2,
    shadowColor: '#4a6fa5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyCategory: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyCategoryText: {
    fontSize: 14,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalCancel: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalCancelText: {
    fontSize: 15,
    color: '#999',
  },
  modalConfirm: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#4a6fa5',
  },
  modalConfirmText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
  },
});
