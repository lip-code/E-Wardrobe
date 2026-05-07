import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useWardrobe } from '../store/WardrobeContext';

const CATEGORY_COLORS = {
  '上衣': '#E8734A',
  '裤子': '#4A6FE8',
  '外套': '#4AB878',
  '鞋子': '#E8B44A',
  '配饰': '#8B4AE8',
};

function StatCard({ value, label, emoji, accent }) {
  return (
    <View style={[styles.statCard, { borderTopColor: accent }]}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={[styles.statNumber, { color: accent }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function StatsScreen({ navigation }) {
  const { state } = useWardrobe();

  const stats = useMemo(() => {
    const total = state.clothes.length;
    const categoryCounts = {};
    state.clothes.forEach((c) => {
      categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    });

    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const monthlyWears = state.clothes.reduce((sum, c) => {
      return sum + c.wearHistory.filter((d) => d.startsWith(thisMonth)).length;
    }, 0);

    const totalWears = state.clothes.reduce((sum, c) => sum + c.wearCount, 0);

    return { total, categoryCounts, monthlyWears, totalWears };
  }, [state.clothes]);

  const topWorn = useMemo(() => {
    return [...state.clothes]
      .sort((a, b) => b.wearCount - a.wearCount)
      .slice(0, 5);
  }, [state.clothes]);

  const RANK_MEDALS = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>穿搭统计</Text>
        <Text style={styles.headerSubtitle}>了解你的穿衣习惯</Text>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <StatCard
          value={stats.total}
          label="衣物总数"
          emoji="👚"
          accent="#4A6FE8"
        />
        <StatCard
          value={stats.monthlyWears}
          label="本月穿着"
          emoji="📅"
          accent="#E8734A"
        />
        <StatCard
          value={stats.totalWears}
          label="累计穿着"
          emoji="✨"
          accent="#4AB878"
        />
      </View>

      {/* Category breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>分类占比</Text>
        {Object.entries(stats.categoryCounts).map(([cat, count]) => {
          const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
          const color = CATEGORY_COLORS[cat] || '#9B9EB5';
          return (
            <View key={cat} style={styles.categoryRow}>
              <View style={styles.categoryLeft}>
                <View style={[styles.categoryDot, { backgroundColor: color }]} />
                <Text style={styles.categoryName}>{cat}</Text>
              </View>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${pct}%`,
                      backgroundColor: color,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.categoryCount, { color }]}>{count}</Text>
            </View>
          );
        })}
        {Object.keys(stats.categoryCounts).length === 0 && (
          <Text style={styles.emptyHint}>还没有数据</Text>
        )}
      </View>

      {/* Top worn */}
      {topWorn.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>穿着最多</Text>
          {topWorn.map((cloth, index) => (
            <TouchableOpacity
              key={cloth.id}
              style={styles.topRow}
              onPress={() => navigation.navigate('ClothDetail', { clothId: cloth.id })}
              activeOpacity={0.7}
            >
              <Text style={styles.topMedal}>{RANK_MEDALS[index]}</Text>
              <View style={styles.topInfo}>
                <Text style={styles.topName} numberOfLines={1}>
                  {cloth.name}
                </Text>
                <Text style={styles.topCategory}>{cloth.category}</Text>
              </View>
              <View style={styles.topCountBadge}>
                <Text style={styles.topCount}>{cloth.wearCount}次</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Outfit count */}
      <View style={styles.outfitBanner}>
        <View>
          <Text style={styles.outfitCount}>{state.outfits.length}</Text>
          <Text style={styles.outfitLabel}>套搭配方案</Text>
        </View>
        <Text style={styles.outfitEmoji}>🎨</Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  header: {
    paddingTop: 64,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1F36',
    letterSpacing: -0.8,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#9B9EB5',
    marginTop: 3,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 3,
    shadowColor: '#1A1F36',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },
  statEmoji: {
    fontSize: 22,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#9B9EB5',
    fontWeight: '600',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#1A1F36',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1A1F36',
    marginBottom: 16,
    letterSpacing: -0.4,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 56,
    gap: 6,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryName: {
    fontSize: 13,
    color: '#1A1F36',
    fontWeight: '600',
  },
  barTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#F0F1F8',
    borderRadius: 6,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
    minWidth: 4,
  },
  categoryCount: {
    width: 28,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'right',
  },
  emptyHint: {
    fontSize: 13,
    color: '#9B9EB5',
    textAlign: 'center',
    paddingVertical: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F1F8',
  },
  topMedal: {
    fontSize: 20,
    marginRight: 12,
    width: 30,
    textAlign: 'center',
  },
  topInfo: {
    flex: 1,
  },
  topName: {
    fontSize: 14,
    color: '#1A1F36',
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  topCategory: {
    fontSize: 11,
    color: '#9B9EB5',
    marginTop: 2,
    fontWeight: '500',
  },
  topCountBadge: {
    backgroundColor: '#FFF0E8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  topCount: {
    fontSize: 13,
    color: '#E8734A',
    fontWeight: '700',
  },
  outfitBanner: {
    backgroundColor: '#2C3E6B',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  outfitCount: {
    fontSize: 40,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -2,
  },
  outfitLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
    marginTop: 2,
  },
  outfitEmoji: {
    fontSize: 40,
  },
});
