import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useWardrobe } from '../store/WardrobeContext';
import { ActionTypes } from '../store/wardrobeReducer';
import { CATEGORIES, COLORS, SEASONS, SCENES } from '../utils/constants';

export default function AddClothScreen({ navigation }) {
  const { dispatch } = useWardrobe();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('上衣');
  const [color, setColor] = useState('白色');
  const [season, setSeason] = useState('四季');
  const [scene, setScene] = useState('休闲');
  const [imageUri, setImageUri] = useState(null);
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [material, setMaterial] = useState('');
  const [notes, setNotes] = useState('');

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
    if (!name.trim()) {
      Alert.alert('提示', '请输入衣物名称');
      return;
    }
    if (!imageUri) {
      Alert.alert('提示', '请添加一张图片');
      return;
    }

    const newCloth = {
      id: Date.now().toString(),
      name: name.trim(),
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
      isFavorite: false,
      notes: notes.trim() || undefined,
    };

    dispatch({ type: ActionTypes.ADD_CLOTH, payload: newCloth });
    Alert.alert('成功', '衣物已添加到衣橱！', [
      { text: '确定', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>添加衣物</Text>

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
        <Text style={styles.label}>名称 *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="输入衣物名称"
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
        <Text style={styles.saveButtonText}>保存到衣橱</Text>
      </TouchableOpacity>
    </ScrollView>
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
});
