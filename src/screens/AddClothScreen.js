import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as Crypto from 'expo-crypto';
import { useWardrobe } from '../store/WardrobeContext';
import { ActionTypes } from '../store/wardrobeReducer';
import { CATEGORIES, COLORS, SEASONS, SCENES } from '../utils/constants';

function isValidPrice(v) {
  if (v === '' || v == null) return true;
  return /^\d+(\.\d{1,2})?$/.test(v);
}

export default function AddClothScreen({ route, navigation }) {
  const { state, dispatch } = useWardrobe();
  const clothId = route.params?.clothId;
  const editingCloth = clothId ? state.clothes.find((c) => c.id === clothId) : null;

  const [name, setName] = useState(editingCloth?.name || '');
  const [category, setCategory] = useState(editingCloth?.category || '上衣');
  const [color, setColor] = useState(editingCloth?.color || '白色');
  const [season, setSeason] = useState(editingCloth?.season || '四季');
  const [scene, setScene] = useState(editingCloth?.scene || '休闲');
  const [imageUri, setImageUri] = useState(editingCloth?.imageUri || null);
  const [brand, setBrand] = useState(editingCloth?.brand || '');
  const [price, setPrice] = useState(editingCloth?.price != null ? String(editingCloth.price) : '');
  const [material, setMaterial] = useState(editingCloth?.material || '');
  const [notes, setNotes] = useState(editingCloth?.notes || '');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleConfirmAddCategory = () => {
    const name = newCategoryName.trim();
    if (!name) return;
    if (state.customCategories.includes(name)) {
      setCategory(name);
      setShowAddCategory(false);
      return;
    }
    dispatch({ type: ActionTypes.ADD_CATEGORY, payload: name });
    setCategory(name);
    setShowAddCategory(false);
    setNewCategoryName('');
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('权限不足', '需要相册权限来选择图片');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('权限不足', '需要相机权限来拍照');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!imageUri) {
      Alert.alert('提示', '请添加一张图片');
      return;
    }
    if (!isValidPrice(price)) {
      Alert.alert('提示', '请输入合法价格（最多两位小数）');
      return;
    }

    if (editingCloth) {
      dispatch({
        type: ActionTypes.UPDATE_CLOTH,
        payload: {
          id: clothId,
          name: name.trim() || category,
          category,
          color,
          scene,
          season,
          imageUri,
          brand: brand.trim() || undefined,
          price: price ? Number(price) : undefined,
          material: material.trim() || undefined,
          notes: notes.trim() || undefined,
        },
      });
      Alert.alert('成功', '衣物信息已更新！', [
        { text: '确定', onPress: () => navigation.goBack() },
      ]);
    } else {
      const newCloth = {
        id: Crypto.randomUUID(),
        name: name.trim() || category,
        category,
        color,
        scene,
        season,
        imageUri,
        brand: brand.trim() || undefined,
        purchaseDate: new Date().toISOString().split('T')[0],
        price: price ? Number(price) : undefined,
        material: material.trim() || undefined,
        wearCount: 0,
        wearHistory: [],
        notes: notes.trim() || undefined,
      };
      dispatch({ type: ActionTypes.ADD_CLOTH, payload: newCloth });
      Alert.alert('成功', '衣物已添加到衣橱！', [
        { text: '确定', onPress: () => navigation.goBack() },
      ]);
    }
  };

  return (
    <View style={{ flex: 1 }}>
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{editingCloth ? '编辑衣物' : '添加衣物'}</Text>

      {/* Image section */}
      <View style={styles.imageSection}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>暂无图片</Text>
          </View>
        )}
        <View style={styles.imageButtons}>
          <TouchableOpacity style={styles.imageButton} onPress={handleTakePhoto}>
            <Text style={styles.imageButtonText}>拍照</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageButton} onPress={handlePickImage}>
            <Text style={styles.imageButtonText}>从相册选择</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Name */}
      <View style={styles.field}>
        <Text style={styles.label}>名称</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder={`留空默认使用「${category}」`}
        />
      </View>

      {/* Category */}
      <View style={styles.field}>
        <Text style={styles.label}>分类</Text>
        <View style={styles.optionsRow}>
          {CATEGORIES.filter((c) => c.key !== 'all').map((cat) => (
            <TouchableOpacity
              key={cat.key}
              style={[
                styles.optionButton,
                category === cat.key && styles.activeOption,
              ]}
              onPress={() => setCategory(cat.key)}
            >
              <Text
                style={[
                  styles.optionText,
                  category === cat.key && styles.activeOptionText,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
          {state.customCategories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.optionButton,
                category === cat && styles.activeOption,
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text
                style={[
                  styles.optionText,
                  category === cat && styles.activeOptionText,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.addCategoryButton}
            onPress={() => setShowAddCategory(true)}
          >
            <Text style={styles.addCategoryText}>+ 新建</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Color */}
      <View style={styles.field}>
        <Text style={styles.label}>颜色</Text>
        <View style={styles.optionsRow}>
          {COLORS.map((c) => (
            <TouchableOpacity
              key={c}
              style={[
                styles.optionButton,
                color === c && styles.activeOption,
              ]}
              onPress={() => setColor(c)}
            >
              <Text
                style={[
                  styles.optionText,
                  color === c && styles.activeOptionText,
                ]}
              >
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Season */}
      <View style={styles.field}>
        <Text style={styles.label}>季节</Text>
        <View style={styles.optionsRow}>
          {SEASONS.map((s) => (
            <TouchableOpacity
              key={s}
              style={[
                styles.optionButton,
                season === s && styles.activeOption,
              ]}
              onPress={() => setSeason(s)}
            >
              <Text
                style={[
                  styles.optionText,
                  season === s && styles.activeOptionText,
                ]}
              >
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Scene */}
      <View style={styles.field}>
        <Text style={styles.label}>场景</Text>
        <View style={styles.optionsRow}>
          {SCENES.map((s) => (
            <TouchableOpacity
              key={s}
              style={[
                styles.optionButton,
                scene === s && styles.activeOption,
              ]}
              onPress={() => setScene(s)}
            >
              <Text
                style={[
                  styles.optionText,
                  scene === s && styles.activeOptionText,
                ]}
              >
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Optional fields */}
      <View style={styles.field}>
        <Text style={styles.label}>品牌</Text>
        <TextInput
          style={styles.input}
          value={brand}
          onChangeText={setBrand}
          placeholder="输入品牌（可选）"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>价格</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="输入价格（可选）"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>材质</Text>
        <TextInput
          style={styles.input}
          value={material}
          onChangeText={setMaterial}
          placeholder="输入材质（可选）"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>备注</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="输入备注（可选）"
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Save button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>{editingCloth ? '保存修改' : '保存到衣橱'}</Text>
      </TouchableOpacity>
    </ScrollView>

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
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    marginTop: 40,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  previewImage: {
    width: 200,
    height: 260,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  placeholder: {
    width: 200,
    height: 260,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 14,
  },
  imageButtons: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12,
  },
  imageButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f0f4ff',
  },
  imageButtonText: {
    color: '#4a6fa5',
    fontSize: 14,
    fontWeight: '500',
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
  },
  activeOption: {
    backgroundColor: '#4a6fa5',
  },
  optionText: {
    fontSize: 13,
    color: '#666',
  },
  activeOptionText: {
    color: '#fff',
    fontWeight: '500',
  },
  addCategoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
  },
  addCategoryText: {
    fontSize: 13,
    color: '#999',
  },
  saveButton: {
    backgroundColor: '#4a6fa5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
