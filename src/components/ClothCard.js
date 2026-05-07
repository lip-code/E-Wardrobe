import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Pressable,
  LinearGradient,
} from 'react-native';
import { Image } from 'expo-image';
import PropTypes from 'prop-types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_MARGIN = 10;
const CARD_WIDTH = (SCREEN_WIDTH - CARD_MARGIN * 3 - 16) / 2;

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const CATEGORY_COLORS = {
  '上衣': { bg: '#FFF0E8', text: '#E8734A' },
  '裤子': { bg: '#E8F0FF', text: '#4A6FE8' },
  '外套': { bg: '#E8FFF0', text: '#4AB878' },
  '鞋子': { bg: '#FFF8E8', text: '#E8B44A' },
  '配饰': { bg: '#F0E8FF', text: '#8B4AE8' },
};

export default function ClothCard({ item, onPress }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shadowAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        useNativeDriver: true,
        speed: 60,
        bounciness: 3,
      }),
      Animated.timing(shadowAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 40,
        bounciness: 6,
      }),
      Animated.timing(shadowAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const catColor = CATEGORY_COLORS[item.category] || { bg: '#F5F5F5', text: '#666' };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress}>
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: item.imageUri }}
            style={styles.image}
            placeholder={{ blurhash }}
            contentFit="cover"
            transition={300}
          />
          {/* Wear count badge */}
          {item.wearCount > 0 && (
            <View style={styles.wearBadge}>
              <Text style={styles.wearBadgeText}>{item.wearCount}</Text>
            </View>
          )}
          {/* Favorite indicator */}
          {item.isFavorite && (
            <View style={styles.favBadge}>
              <Text style={styles.favIcon}>♥</Text>
            </View>
          )}
        </View>

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.row}>
            <View style={[styles.categoryTag, { backgroundColor: catColor.bg }]}>
              <Text style={[styles.categoryText, { color: catColor.text }]}>
                {item.category}
              </Text>
            </View>
            {item.season && (
              <Text style={styles.season}>{item.season === '四季' ? '四季' : item.season}</Text>
            )}
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

ClothCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    imageUri: PropTypes.string.isRequired,
    wearCount: PropTypes.number.isRequired,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: CARD_MARGIN * 1.5,
    overflow: 'hidden',
    shadowColor: '#2C3E6B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: CARD_WIDTH * 1.25,
    backgroundColor: '#F5F3F0',
  },
  wearBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(44, 62, 107, 0.85)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backdropFilter: 'blur(4px)',
  },
  wearBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  favBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favIcon: {
    fontSize: 13,
    color: '#E85C6A',
  },
  info: {
    padding: 12,
    paddingTop: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1F36',
    marginBottom: 7,
    letterSpacing: -0.2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  season: {
    fontSize: 11,
    color: '#9B9EB5',
    fontWeight: '500',
  },
});
