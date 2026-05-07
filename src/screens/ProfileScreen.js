import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
  TextInput,
  Share,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWardrobe } from '../store/WardrobeContext';

export default function ProfileScreen() {
  const { state } = useWardrobe();
  const [nickname, setNickname] = useState('衣橱主人');
  const [bio, setBio] = useState('热爱穿搭，记录每一天 ✨');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editNickname, setEditNickname] = useState('');
  const [editBio, setEditBio] = useState('');

  const totalWears = state.clothes.reduce((sum, c) => sum + c.wearCount, 0);

  // ── 编辑个人信息 ──────────────────────────────────────
  const handleOpenEdit = () => {
    setEditNickname(nickname);
    setEditBio(bio);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    const trimmed = editNickname.trim();
    if (!trimmed) {
      Alert.alert('提示', '昵称不能为空');
      return;
    }
    setNickname(trimmed);
    setBio(editBio.trim() || bio);
    setShowEditModal(false);
  };

  // ── 数据导出 ──────────────────────────────────────────
  const handleExport = async () => {
    try {
      const exportData = {
        exportTime: new Date().toISOString(),
        summary: {
          totalClothes: state.clothes.length,
          totalOutfits: state.outfits.length,
          totalWears,
        },
        clothes: state.clothes.map((c) => ({
          name: c.name,
          category: c.category,
          color: c.color,
          season: c.season,
          scene: c.scene,
          brand: c.brand || '',
          price: c.price || '',
          material: c.material || '',
          wearCount: c.wearCount,
          purchaseDate: c.purchaseDate || '',
          notes: c.notes || '',
        })),
        outfits: state.outfits.map((o) => ({
          name: o.name,
          date: o.date,
          itemCount: o.clothIds.length,
        })),
      };

      const jsonStr = JSON.stringify(exportData, null, 2);
      await Share.share({
        message: jsonStr,
        title: 'MyWardrobe 数据导出',
      });
    } catch (e) {
      Alert.alert('导出失败', e.message || '请稍后重试');
    }
  };

  // ── 清空数据 ──────────────────────────────────────────
  const handleClearData = () => {
    Alert.alert('确认清空', '确定要清空所有数据吗？此操作不可恢复。', [
      { text: '取消', style: 'cancel' },
      {
        text: '清空',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.clear();
            Alert.alert('已清空', '请重启应用以重新加载');
          } catch (e) {
            Alert.alert('错误', '清空数据失败');
          }
        },
      },
    ]);
  };

  const stats = [
    { value: state.clothes.length, label: '衣物', color: '#4A6FE8' },
    { value: state.outfits.length, label: '搭配', color: '#E8734A' },
    { value: totalWears, label: '总穿着', color: '#4AB878' },
  ];

  const menuItems = [
    {
      icon: '✏️',
      bg: '#EEF0FF',
      label: '编辑个人信息',
      desc: '修改昵称和签名',
      onPress: handleOpenEdit,
    },
    {
      icon: '📤',
      bg: '#FFF3E8',
      label: '导出数据',
      desc: '以 JSON 格式分享你的衣橱',
      onPress: handleExport,
    },
    {
      icon: '🗑️',
      bg: '#FFEEEE',
      label: '清空所有数据',
      desc: '不可恢复，请谨慎操作',
      onPress: handleClearData,
      danger: true,
    },
  ];

  return (
    <>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── 头像区：昵称/bio 全部在深色背景内，文字清晰 ── */}
        <View style={styles.heroBg}>
          <View style={styles.heroTopPad} />

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{nickname.charAt(0)}</Text>
          </View>

          <Text style={styles.nickname}>{nickname}</Text>
          <Text style={styles.bio}>{bio}</Text>

          <TouchableOpacity
            style={styles.editBtn}
            onPress={handleOpenEdit}
            activeOpacity={0.8}
          >
            <Text style={styles.editBtnText}>✏️  编辑资料</Text>
          </TouchableOpacity>

          <View style={styles.heroBottomPad} />
        </View>

        {/* ── 统计卡片 ── */}
        <View style={styles.statsCard}>
          {stats.map((stat, i) => (
            <React.Fragment key={stat.label}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: stat.color }]}>
                  {stat.value}
                </Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
              {i < stats.length - 1 && <View style={styles.statDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* ── 功能菜单 ── */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>设置</Text>
          {menuItems.map((item, idx) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuItem,
                idx === menuItems.length - 1 && styles.menuItemLast,
              ]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBg, { backgroundColor: item.bg }]}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
              </View>
              <View style={styles.menuTextBlock}>
                <Text style={[styles.menuLabel, item.danger && styles.menuLabelDanger]}>
                  {item.label}
                </Text>
                <Text style={styles.menuDesc}>{item.desc}</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.version}>MyWardrobe v1.0.0</Text>
      </ScrollView>

      {/* ── 编辑个人信息 Modal（从底部滑入）── */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowEditModal(false)}
        >
          <View
            style={styles.modalSheet}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>编辑个人信息</Text>

            <Text style={styles.fieldLabel}>昵称</Text>
            <TextInput
              style={styles.fieldInput}
              value={editNickname}
              onChangeText={setEditNickname}
              placeholder="你的昵称"
              placeholderTextColor="#BABDD0"
              maxLength={20}
            />

            <Text style={styles.fieldLabel}>个性签名</Text>
            <TextInput
              style={[styles.fieldInput, styles.fieldInputMulti]}
              value={editBio}
              onChangeText={setEditBio}
              placeholder="写一句介绍自己的话"
              placeholderTextColor="#BABDD0"
              multiline
              maxLength={50}
            />

            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.modalBtnCancel}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.modalBtnCancelText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtnSave}
                onPress={handleSaveEdit}
              >
                <Text style={styles.modalBtnSaveText}>保存</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  scrollContent: {
    paddingBottom: 48,
  },

  // ── Hero：所有内容都在深色块里，文字用白色，绝对清晰 ──
  heroBg: {
    backgroundColor: '#2C3E6B',
    alignItems: 'center',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  heroTopPad: {
    // 给系统状态栏留空间
    height: Platform.OS === 'ios' ? 60 : 52,
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 30,
    backgroundColor: '#4A6FE8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  nickname: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',               // 白底白字
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  bio: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)', // 半透明白，柔和但清晰
    fontWeight: '500',
    marginBottom: 20,
    paddingHorizontal: 32,
    textAlign: 'center',
    lineHeight: 20,
  },
  editBtn: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 14,
    paddingHorizontal: 22,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  editBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  heroBottomPad: {
    height: 28,
  },

  // ── Stats ──
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 16,
    borderRadius: 24,
    paddingVertical: 22,
    shadowColor: '#1A1F36',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9B9EB5',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#F0F1F8',
  },

  // ── Menu ──
  menuSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 4,
    shadowColor: '#1A1F36',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },
  menuSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#BABDD0',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F6FA',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIconBg: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuIcon: {
    fontSize: 19,
  },
  menuTextBlock: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 15,
    color: '#1A1F36',
    fontWeight: '700',
    marginBottom: 2,
  },
  menuLabelDanger: {
    color: '#E85C6A',
  },
  menuDesc: {
    fontSize: 12,
    color: '#BABDD0',
    fontWeight: '500',
  },
  menuArrow: {
    fontSize: 22,
    color: '#D0D3E4',
    fontWeight: '300',
  },

  version: {
    textAlign: 'center',
    color: '#BABDD0',
    fontSize: 12,
    marginTop: 24,
    fontWeight: '500',
  },

  // ── Edit Modal ──
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(26,31,54,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E2EE',
    alignSelf: 'center',
    marginBottom: 22,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1F36',
    marginBottom: 20,
    letterSpacing: -0.4,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9B9EB5',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  fieldInput: {
    borderWidth: 1.5,
    borderColor: '#E8EAF4',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: '#1A1F36',
    backgroundColor: '#FAFBFF',
    marginBottom: 18,
  },
  fieldInputMulti: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalBtns: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  modalBtnCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#F4F5F9',
    alignItems: 'center',
  },
  modalBtnCancelText: {
    fontSize: 15,
    color: '#9B9EB5',
    fontWeight: '700',
  },
  modalBtnSave: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#2C3E6B',
    alignItems: 'center',
    shadowColor: '#2C3E6B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  modalBtnSaveText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
