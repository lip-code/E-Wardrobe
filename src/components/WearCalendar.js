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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>近30天穿着记录</Text>
      <View style={styles.grid}>
        {days.map((d, i) => (
          <View
            key={i}
            style={[
              styles.dayCell,
              d.isWorn && styles.wornCell,
              d.isToday && styles.todayCell,
            ]}
          >
            <Text
              style={[
                styles.dayText,
                d.isWorn && styles.wornText,
                d.isToday && styles.todayText,
              ]}
            >
              {d.day}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.wornCell]} />
          <Text style={styles.legendText}>已穿</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.todayCell]} />
          <Text style={styles.legendText}>今天</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  dayCell: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wornCell: {
    backgroundColor: '#4a6fa5',
  },
  todayCell: {
    borderWidth: 2,
    borderColor: '#ff6b6b',
  },
  dayText: {
    fontSize: 12,
    color: '#999',
  },
  wornText: {
    color: '#fff',
    fontWeight: '600',
  },
  todayText: {
    color: '#ff6b6b',
    fontWeight: '600',
  },
  legend: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
});
