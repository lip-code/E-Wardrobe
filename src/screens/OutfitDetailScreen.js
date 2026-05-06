import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useWardrobe } from '../store/WardrobeContext';

export default function OutfitDetailScreen({ route, navigation }) {
  const { outfitId } = route.params;
  const { state } = useWardrobe();

  const outfit = state.outfits.find((o) => o.id === outfitId);
  if (!outfit) {
    return (
      <View style={styles.center}>
        <Text>搭配不存在</Text>
      </View>
    );
  }

  const clothes = outfit.clothIds
    .map((id) => state.clothes.find((c) => c.id === id))
    .filter(Boolean);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{outfit.name}</Text>
        <Text style={styles.date}>{outfit.date}</Text>
        {outfit.isTodayOutfit && (
          <View style={styles.todayBadge}>
            <Text style={styles.todayText}>今日穿搭</Text>
          </View>
        )}
      </View>

      <View style={styles.grid}>
        {clothes.map((cloth) => (
          <TouchableOpacity
            key={cloth.id}
            style={styles.clothCard}
            onPress={() =>
              navigation.navigate('ClothDetail', { clothId: cloth.id })
            }
          >
            <Image source={{ uri: cloth.imageUri }} style={styles.clothImage} />
            <Text style={styles.clothName}>{cloth.name}</Text>
            <Text style={styles.clothCategory}>{cloth.category}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  todayBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  todayText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 12,
  },
  clothCard: {
    width: '47%',
    backgroundColor: '#fafafa',
    borderRadius: 12,
    overflow: 'hidden',
  },
  clothImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#f0f0f0',
  },
  clothName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    padding: 8,
    paddingBottom: 2,
  },
  clothCategory: {
    fontSize: 12,
    color: '#999',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
});
