import AsyncStorage from '@react-native-async-storage/async-storage';

const CLOTHES_KEY = '@mywardrobe_clothes';
const OUTFITS_KEY = '@mywardrobe_outfits';

export async function loadClothes() {
  try {
    const json = await AsyncStorage.getItem(CLOTHES_KEY);
    return json ? JSON.parse(json) : null;
  } catch (e) {
    console.error('Failed to load clothes:', e);
    return null;
  }
}

export async function saveClothes(clothes) {
  try {
    await AsyncStorage.setItem(CLOTHES_KEY, JSON.stringify(clothes));
  } catch (e) {
    console.error('Failed to save clothes:', e);
  }
}

export async function loadOutfits() {
  try {
    const json = await AsyncStorage.getItem(OUTFITS_KEY);
    return json ? JSON.parse(json) : null;
  } catch (e) {
    console.error('Failed to load outfits:', e);
    return null;
  }
}

export async function saveOutfits(outfits) {
  try {
    await AsyncStorage.setItem(OUTFITS_KEY, JSON.stringify(outfits));
  } catch (e) {
    console.error('Failed to save outfits:', e);
  }
}
