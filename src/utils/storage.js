import AsyncStorage from '@react-native-async-storage/async-storage';

const CLOTHES_KEY = '@mywardrobe_clothes';
const OUTFITS_KEY = '@mywardrobe_outfits';
const CATEGORIES_KEY = '@mywardrobe_categories';

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
    return { ok: true };
  } catch (e) {
    console.error('Failed to save clothes:', e);
    return { ok: false, error: e };
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
    return { ok: true };
  } catch (e) {
    console.error('Failed to save outfits:', e);
    return { ok: false, error: e };
  }
}

export async function loadCategories() {
  try {
    const json = await AsyncStorage.getItem(CATEGORIES_KEY);
    return json ? JSON.parse(json) : null;
  } catch (e) {
    console.error('Failed to load categories:', e);
    return null;
  }
}

export async function saveCategories(categories) {
  try {
    await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    return { ok: true };
  } catch (e) {
    console.error('Failed to save categories:', e);
    return { ok: false, error: e };
  }
}