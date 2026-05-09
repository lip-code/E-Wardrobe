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
const CARD_GAP = 6;
const CARD_WIDTH = (SCREEN_WIDTH - 16 - CARD_GAP * 2) / 3;
const ITEM_HEIGHT = CARD_WIDTH * 4 / 3 + CARD_GAP;

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
      offset: ITEM_HEIGHT * Math.floor(index / 3),
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
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9F6" />

      {/* Category tabs */}
      {!isEmpty && (
        <View style={styles.header}>
          <CategoryTabs
            selected={selectedCategory}
            onSelect={setSelectedCategory}
            customCategories={state.customCategories}
            onAdd={handleAddCategory}
          />
        </View>
      )}

      {/* Cloth list */}
      <FlatList
        data={filteredClothes}
        keyExtractor={keyExtractor}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[styles.list, isEmpty && styles.emptyList]}
        getItemLayout={getItemLayout}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          isEmpty ? (
            <View style={styles.emptyGuide}>
              <View style={styles.emptyIconWrapper}>
                <Text style={styles.emptyIcon}>✦</Text>
              </View>
              <Text style={styles.emptyTitle}>衣橱还是空的</Text>
              <Text style={styles.emptyHint}>
                添加你的第一件单品{'\n'}开始记录每一天的穿搭
              </Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddCloth')}
                activeOpacity={0.85}
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

      {/* Floating add button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddCloth')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>+ 添加</Text>
      </TouchableOpacity>

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
              placeholderTextColor="#BABDD0"
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
    backgroundColor: '#FAF9F6',
  },
  header: {
    paddingTop: 52,
    paddingHorizontal: 16,
    paddingBottom: 4,
    backgroundColor: '#FAF9F6',
  },
  row: {
    justifyContent: 'flex-start',
    paddingHorizontal: 8,
    gap: CARD_GAP,
  },
  list: {
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 110,
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
  emptyIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#EEF0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyIcon: {
    fontSize: 36,
    color: '#4A6FE8',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1F36',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  emptyHint: {
    fontSize: 14,
    color: '#9B9EB5',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#2C3E6B',
    paddingHorizontal: 28,
    paddingVertical: 15,
    borderRadius: 18,
    shadowColor: '#2C3E6B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  emptyCategory: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyCategoryText: {
    fontSize: 14,
    color: '#9B9EB5',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 31, 54, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    width: '82%',
    shadowColor: '#1A1F36',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1F36',
    marginBottom: 18,
    letterSpacing: -0.4,
  },
  modalInput: {
    borderWidth: 1.5,
    borderColor: '#E8EAF4',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1A1F36',
    marginBottom: 20,
    backgroundColor: '#FAFBFF',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalCancel: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F4F5F9',
  },
  modalCancelText: {
    fontSize: 14,
    color: '#9B9EB5',
    fontWeight: '600',
  },
  modalConfirm: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#2C3E6B',
  },
  modalConfirmText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '700',
  },
});
