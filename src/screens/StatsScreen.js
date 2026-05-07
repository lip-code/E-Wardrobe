import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useWardrobe } from '../store/WardrobeContext';

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

    return { total, categoryCounts, monthlyWears };
  }, [state.clothes]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header} />

      {/* Summary cards */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{stats.total}</Text>
          <Text style={styles.summaryLabel}>总件数</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{stats.monthlyWears}</Text>
          <Text style={styles.summaryLabel}>本月穿着</Text>
        </View>
      </View>

      {/* Category breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>分类统计</Text>
        {Object.entries(stats.categoryCounts).map(([cat, count]) => (
          <View key={cat} style={styles.categoryRow}>
            <Text style={styles.categoryName}>{cat}</Text>
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  { width: `${(count / stats.total) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.categoryCount}>{count}</Text>
          </View>
        ))}
      </View>

      {/* Top worn */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>穿着最多</Text>
        {state.clothes
          .sort((a, b) => b.wearCount - a.wearCount)
          .slice(0, 5)
          .map((cloth, index) => (
            <TouchableOpacity
              key={cloth.id}
              style={styles.topRow}
              onPress={() => navigation.navigate('ClothDetail', { clothId: cloth.id })}
              activeOpacity={0.7}
            >
              <Text style={styles.topRank}>{index + 1}</Text>
              <Text style={styles.topName} numberOfLines={1}>
                {cloth.name}
              </Text>
              <Text style={styles.topCount}>{cloth.wearCount}次</Text>
            </TouchableOpacity>
          ))}
      </View>
    </ScrollView>
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
  summaryRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  summaryNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4a6fa5',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryName: {
    width: 50,
    fontSize: 13,
    color: '#666',
  },
  barContainer: {
    flex: 1,
    height: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: '#4a6fa5',
    borderRadius: 8,
  },
  categoryCount: {
    width: 30,
    fontSize: 13,
    color: '#333',
    textAlign: 'right',
    fontWeight: '500',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  topRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f4ff',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    fontWeight: '600',
    color: '#4a6fa5',
    marginRight: 12,
  },
  topName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  topCount: {
    fontSize: 13,
    color: '#e65100',
    fontWeight: '500',
  },
});
