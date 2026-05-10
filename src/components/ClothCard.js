import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import PropTypes from 'prop-types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_GAP = 6;
const CARD_WIDTH = (SCREEN_WIDTH - 16 - CARD_GAP * 3) / 4;

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function ClothCard({ item, onPress }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.94,
      useNativeDriver: true,
      speed: 60,
      bounciness: 3,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();
  };

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
          {item.wearCount > 0 && (
            <View style={styles.wearBadge}>
              <Text style={styles.wearBadgeText}>{item.wearCount}</Text>
            </View>
          )}
          {item.isFavorite && (
            <View style={styles.favBadge}>
              <Text style={styles.favIcon}>♥</Text>
            </View>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
}

ClothCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    imageUri: PropTypes.string.isRequired,
    wearCount: PropTypes.number,
    isFavorite: PropTypes.bool,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 14,
    marginBottom: CARD_GAP,
    overflow: 'hidden',
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: '#F5F3F0',
  },
  wearBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(44, 62, 107, 0.85)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  wearBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  favBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favIcon: {
    fontSize: 11,
    color: '#E85C6A',
  },
});
