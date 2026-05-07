import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WearCalendar({ wearHistory = [] }) {
  const today = new Date();
  const days = [];

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    days.push({
      date: dateStr,
      day: d.getDate(),
      isWorn: wearHistory.includes(dateStr),
      isToday: i === 0,
    });
  }

  const wornCount = days.filter((d) => d.isWorn).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>近30天记录</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>穿了 {wornCount} 天</Text>
        </View>
      </View>
      <View style={styles.grid}>
        {days.map((d, i) => (
          <View
            key={i}
            style={[
              styles.dayCell,
              d.isWorn && styles.wornCell,
              d.isToday && styles.todayCell,
              d.isWorn && d.isToday && styles.wornTodayCell,
            ]}
          >
            <Text
              style={[
                styles.dayText,
                d.isWorn && styles.wornText,
                d.isToday && !d.isWorn && styles.todayText,
              ]}
            >
              {d.day}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#2C3E6B' }]} />
          <Text style={styles.legendText}>已穿</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { borderWidth: 2, borderColor: '#E8734A' }]} />
          <Text style={styles.legendText}>今天</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1F36',
    letterSpacing: -0.3,
  },
  countBadge: {
    backgroundColor: '#EEF0FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  countText: {
    fontSize: 12,
    color: '#4A6FE8',
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 14,
  },
  dayCell: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F5F6FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wornCell: {
    backgroundColor: '#2C3E6B',
  },
  todayCell: {
    borderWidth: 2,
    borderColor: '#E8734A',
    backgroundColor: '#FFFFFF',
  },
  wornTodayCell: {
    backgroundColor: '#2C3E6B',
    borderColor: '#E8734A',
  },
  dayText: {
    fontSize: 11,
    color: '#9B9EB5',
    fontWeight: '600',
  },
  wornText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  todayText: {
    color: '#E8734A',
    fontWeight: '800',
  },
  legend: {
    flexDirection: 'row',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  legendText: {
    fontSize: 12,
    color: '#9B9EB5',
    fontWeight: '600',
  },
});
