import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { wardrobeReducer, initialState, ActionTypes } from './wardrobeReducer';
import { saveClothes, saveOutfits, loadClothes, loadOutfits } from '../utils/storage';

const WardrobeContext = createContext(null);

export function WardrobeProvider({ children }) {
  const [state, dispatch] = useReducer(wardrobeReducer, initialState);

  // Load persisted data on mount
  useEffect(() => {
    async function init() {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const savedClothes = await loadClothes();
      const savedOutfits = await loadOutfits();
      if (savedClothes) {
        dispatch({ type: ActionTypes.SET_CLOTHES, payload: savedClothes });
      }
      if (savedOutfits) {
        dispatch({ type: ActionTypes.SET_OUTFITS, payload: savedOutfits });
      }
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
    init();
  }, []);

  // Persist clothes when they change
  useEffect(() => {
    if (!state.isLoading) {
      saveClothes(state.clothes);
    }
  }, [state.clothes, state.isLoading]);

  // Persist outfits when they change
  useEffect(() => {
    if (!state.isLoading) {
      saveOutfits(state.outfits);
    }
  }, [state.outfits, state.isLoading]);

  return (
    <WardrobeContext.Provider value={{ state, dispatch }}>
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
