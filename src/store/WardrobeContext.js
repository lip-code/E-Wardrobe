import React, { createContext, useContext, useReducer, useEffect, useMemo, Alert } from 'react';
import { wardrobeReducer, initialState, ActionTypes } from './wardrobeReducer';
import { saveClothes, saveOutfits, loadClothes, loadOutfits, loadCategories, saveCategories } from '../utils/storage';

const WardrobeContext = createContext(null);

export function WardrobeProvider({ children }) {
  const [state, dispatch] = useReducer(wardrobeReducer, initialState);

  // Load persisted data on mount
  useEffect(() => {
    async function init() {
      const savedClothes = await loadClothes();
      const savedOutfits = await loadOutfits();
      const savedCategories = await loadCategories();
      if (savedClothes) {
        dispatch({ type: ActionTypes.SET_CLOTHES, payload: savedClothes });
      }
      if (savedOutfits) {
        dispatch({ type: ActionTypes.SET_OUTFITS, payload: savedOutfits });
      }
      if (savedCategories) {
        dispatch({ type: ActionTypes.SET_CUSTOM_CATEGORIES, payload: savedCategories });
      }
      dispatch({ type: ActionTypes.SET_BOOTSTRAPPING, payload: false });
    }
    init();
  }, []);

  // Persist clothes when they change (skip during bootstrap)
  useEffect(() => {
    if (state.isBootstrapping) return;
    dispatch({ type: ActionTypes.SET_SAVING, payload: true });
    saveClothes(state.clothes).then((res) => {
      dispatch({ type: ActionTypes.SET_SAVING, payload: false });
      if (res && !res.ok) {
        Alert.alert('保存失败', '衣物数据存储异常，请稍后重试');
      }
    });
  }, [state.clothes, state.isBootstrapping]);

  // Persist outfits when they change (skip during bootstrap)
  useEffect(() => {
    if (state.isBootstrapping) return;
    dispatch({ type: ActionTypes.SET_SAVING, payload: true });
    saveOutfits(state.outfits).then((res) => {
      dispatch({ type: ActionTypes.SET_SAVING, payload: false });
      if (res && !res.ok) {
        Alert.alert('保存失败', '搭配数据存储异常，请稍后重试');
      }
    });
  }, [state.outfits, state.isBootstrapping]);

  // Persist custom categories when they change (skip during bootstrap)
  useEffect(() => {
    if (state.isBootstrapping) return;
    saveCategories(state.customCategories).then((res) => {
      if (res && !res.ok) {
        Alert.alert('保存失败', '分类数据存储异常，请稍后重试');
      }
    });
  }, [state.customCategories, state.isBootstrapping]);

  // Stable value reference to avoid unnecessary consumer re-renders
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <WardrobeContext.Provider value={value}>
      {children}
    </WardrobeContext.Provider>
  );
}

export function useWardrobe() {
  const context = useContext(WardrobeContext);
  if (!context) {
    throw new Error('useWardrobe must be used within WardrobeProvider');
  }
  return context;
}