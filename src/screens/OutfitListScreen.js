import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  Animated,
  Pressable,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useWardrobe } from '../store/WardrobeContext';
import { ActionTypes } from '../store/wardrobeReducer';
import { OUTFIT_TYPES } from '../utils/mockData';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_GAP = 6;
const CARD_WIDTH = (SCREEN_WIDTH - 16 - CARD_GAP * 2) / 3;

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

function OutfitCard({ outfit, onPress }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.94,
      useNativeDriver: true,
      speed: 60,
      bounciness: 3,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();
  };

  const coverUri = outfit.coverImageUri;

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress}>
      <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
        {coverUri ? (
          <Image
            source={{ uri: coverUri }}
            style={styles.cardImage}
            placeholder={{ blurhash }}
            contentFit="cover"
            transition={300}
          />
        ) : (
          <View style={[styles.cardImage, styles.cardImageEmpty]}>
            <Text style={styles.cardImageEmptyText}>👗</Text>
          </View>
        )}
        {outfit.isTodayOutfit && (
          <View style={styles.todayDot} />
        )}
      </Animated.View>
    </Pressable>
  );
}

export default function OutfitListScreen({ navigation }) {
  const { state, dispatch } = useWardrobe();
  const [activeType, setActiveType] = useState('全部');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const hasEnoughClothes = state.clothes.length >= 2;

  const allOutfitTypes = useMemo(
    () => ['全部', ...OUTFIT_TYPES, ...state.customOutfitCategories],
    [state.customOutfitCategories]
  );

  const filteredOutfits = useMemo(() => {
    if (activeType === '全部') return state.outfits;
    return state.outfits.filter((o) => o.type === activeType);
  }, [state.outfits, activeType]);

  const handleAddCategory = useCallback(() => {
    setShowAddCategory(true);
    setNewCategoryName('');
  }, []);

  const handleConfirmAddCategory = useCallback(() => {
    const name = newCategoryName.trim();
    if (!name) return;
    if (allOutfitTypes.includes(name)) {
      Alert.alert('提示', '该分类已存在');
      return;
    }
    dispatch({ type: ActionTypes.ADD_OUTFIT_CATEGORY, payload: name });
    setActiveType(name);
    setShowAddCategory(false);
    setNewCategoryName('');
  }, [newCategoryName, allOutfitTypes, dispatch]);

  const keyExtractor = useCallback((item) => item.id, []);

  const renderItem = useCallback(
    ({ item }) => (
      <OutfitCard
        outfit={item}
        onPress={() => navigation.navigate('OutfitDetail', { outfitId: item.id })}
      />
    ),
    [navigation]
  );

  return (
    <View style={styles.container}>
      {/* Type filter tabs */}
      <View style={styles.header}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.typeFilterRow}>
          {allOutfitTypes.map((t) => (
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
          <TouchableOpacity
            style={styles.addCategoryChip}
            onPress={handleAddCategory}
            activeOpacity={0.7}
          >
            <Text style={styles.addCategoryText}>+ 新建</Text>
          </TouchableOpacity>
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
        numColumns={3}
        columnWrapperStyle={styles.row}
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
          <Text style={styles.fabText}>+ 添加</Text>
        </TouchableOpacity>
      )}

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
            <Text style={styles.modalTitle}>新建搭配分类</Text>
            <TextInput
              style={styles.modalInput}
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              placeholder="输入分类名称，如：约会、旅行"
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
  typeFilterRow: {
    paddingVertical: 6,
    gap: 6,
  },
  typeFilterChip: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#EEEFF6',
  },
  activeTypeFilterChip: {
    backgroundColor: '#2C3E6B',
  },
  typeFilterText: {
    fontSize: 12,
    color: '#9B9EB5',
    fontWeight: '600',
  },
  activeTypeFilterText: {
    color: '#fff',
    fontWeight: '700',
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
  card: {
    width: CARD_WIDTH,
    borderRadius: 14,
    marginBottom: CARD_GAP,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: '#F5F3F0',
  },
  cardImageEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEEFF6',
  },
  cardImageEmptyText: {
    fontSize: 28,
  },
  todayDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E8734A',
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
  addCategoryChip: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#D8DBF0',
    borderStyle: 'dashed',
  },
  addCategoryText: {
    fontSize: 12,
    color: '#9B9EB5',
    fontWeight: '600',
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
