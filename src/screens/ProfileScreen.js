import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWardrobe } from '../store/WardrobeContext';

export default function ProfileScreen() {
  const { state } = useWardrobe();
  const [nickname, setNickname] = useState('衣橱主人');

  const totalWears = state.clothes.reduce((sum, c) => sum + c.wearCount, 0);

  const handleClearData = () => {
    Alert.alert('确认清空', '确定要清空所有数据吗？此操作不可恢复。', [
      { text: '取消', style: 'cancel' },
      {
        text: '清空',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.clear();
            Alert.alert('已清空', '请重启应用以加载默认数据');
          } catch (e) {
            Alert.alert('错误', '清空数据失败');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header} />

      {/* Profile card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {nickname.charAt(0)}
          </Text>
        </View>
        <Text style={styles.nickname}>{nickname}</Text>
        <Text style={styles.bio}>热爱穿搭，记录每一天</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{state.clothes.length}</Text>
          <Text style={styles.statLabel}>衣物</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{state.outfits.length}</Text>
          <Text style={styles.statLabel}>搭配</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalWears}</Text>
          <Text style={styles.statLabel}>总穿着</Text>
        </View>
      </View>

      {/* Settings */}
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>设置</Text>
        <TouchableOpacity style={styles.settingRow}>
          <Text style={styles.settingLabel}>编辑个人信息</Text>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingRow}>
          <Text style={styles.settingLabel}>数据导出</Text>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingRow}
          onPress={handleClearData}
        >
          <Text style={[styles.settingLabel, { color: '#ff4d4f' }]}>
            清空所有数据
          </Text>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.version}>MyWardrobe v1.0.0</Text>
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
  profileCard: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4a6fa5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '600',
  },
  nickname: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  bio: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 16,
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4a6fa5',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#f0f0f0',
  },
  settingsSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    paddingVertical: 8,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  settingLabel: {
    fontSize: 15,
    color: '#333',
  },
  settingArrow: {
    fontSize: 20,
    color: '#ccc',
  },
  version: {
    textAlign: 'center',
    color: '#ccc',
    fontSize: 12,
    marginTop: 24,
  },
});
