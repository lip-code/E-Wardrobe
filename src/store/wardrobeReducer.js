import { MOCK_CLOTHES, MOCK_OUTFITS } from '../utils/mockData';

export const initialState = {
  clothes: MOCK_CLOTHES,
  outfits: MOCK_OUTFITS,
  isLoading: false,
};

export const ActionTypes = {
  SET_CLOTHES: 'SET_CLOTHES',
  ADD_CLOTH: 'ADD_CLOTH',
  UPDATE_CLOTH: 'UPDATE_CLOTH',
  DELETE_CLOTH: 'DELETE_CLOTH',
  TOGGLE_FAVORITE: 'TOGGLE_FAVORITE',
  RECORD_WEAR: 'RECORD_WEAR',
  SET_OUTFITS: 'SET_OUTFITS',
  ADD_OUTFIT: 'ADD_OUTFIT',
  UPDATE_OUTFIT: 'UPDATE_OUTFIT',
  DELETE_OUTFIT: 'DELETE_OUTFIT',
  SET_TODAY_OUTFIT: 'SET_TODAY_OUTFIT',
  SET_LOADING: 'SET_LOADING',
};

export function wardrobeReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_CLOTHES:
      return { ...state, clothes: action.payload };

    case ActionTypes.ADD_CLOTH:
      return { ...state, clothes: [...state.clothes, action.payload] };

    case ActionTypes.UPDATE_CLOTH:
      return {
        ...state,
        clothes: state.clothes.map((c) =>
          c.id === action.payload.id ? { ...c, ...action.payload } : c
        ),
      };

    case ActionTypes.DELETE_CLOTH:
      return {
        ...state,
        clothes: state.clothes.filter((c) => c.id !== action.payload),
      };

    case ActionTypes.TOGGLE_FAVORITE:
      return {
        ...state,
        clothes: state.clothes.map((c) =>
          c.id === action.payload ? { ...c, isFavorite: !c.isFavorite } : c
        ),
      };

    case ActionTypes.RECORD_WEAR: {
      const today = new Date().toISOString().split('T')[0];
      return {
        ...state,
        clothes: state.clothes.map((c) => {
          if (c.id !== action.payload) return c;
          if (c.wearHistory.includes(today)) return c;
          return {
            ...c,
            wearCount: c.wearCount + 1,
            wearHistory: [...c.wearHistory, today],
          };
        }),
      };
    }

    case ActionTypes.SET_OUTFITS:
      return { ...state, outfits: action.payload };

    case ActionTypes.ADD_OUTFIT:
      return { ...state, outfits: [...state.outfits, action.payload] };

    case ActionTypes.UPDATE_OUTFIT:
      return {
        ...state,
        outfits: state.outfits.map((o) =>
          o.id === action.payload.id ? { ...o, ...action.payload } : o
        ),
      };

    case ActionTypes.DELETE_OUTFIT:
      return {
        ...state,
        outfits: state.outfits.filter((o) => o.id !== action.payload),
      };

    case ActionTypes.SET_TODAY_OUTFIT: {
      const today = new Date().toISOString().split('T')[0];
      return {
        ...state,
        outfits: state.outfits.map((o) => ({
          ...o,
          isTodayOutfit: o.id === action.payload,
          date: o.id === action.payload ? today : o.date,
        })),
      };
    }

    case ActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };

    default:
      return state;
  }
}
