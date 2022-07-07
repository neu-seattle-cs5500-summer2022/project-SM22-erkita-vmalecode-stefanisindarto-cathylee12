import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dataService from './dataService';

const initialState = {
  decks: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};
export const createDeck = createAsyncThunk(
  'data/create',
  async (deckData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await dataService.createDeck(deckData, token);
    } catch (error) {
      const message = error.response.data.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const addCard = createAsyncThunk(
  'data/addCard',
  async (cardData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const res = await dataService.addCard(cardData, token);
      // res.deckIdx = cardData.deckIdx;
      return res;
    } catch (error) {
      const message = error.response.data.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const removeCard = createAsyncThunk(
  'data/remove-card',
  async (cardData, thunkAPI) => {
    try {
      console.log('[dataSlice/removeCard]',cardData);
      const token = thunkAPI.getState().auth.user.token;
      return await dataService.removeCard(cardData, token);
    } catch (error) {
      const message = error.response.data.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const getDecks = createAsyncThunk(
  'data/getDecks',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await dataService.getDecks(token);
    } catch (error) {
      const message = error.response.data.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);
const getIdx = (decks,deckId) => {
  const deck = decks.find((deck) => deck._id === deckId);
  
  return decks.indexOf(deck)
}
export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCard.fulfilled, (state,action) => {
        state.isSuccess = true;
        state.isLoading = false;
        const idx = getIdx(state.decks,action.payload.deckId);
        state.decks[idx].cards.push(action.payload);
      })
      .addCase(addCard.rejected, (state,action) => {
        state.isSuccess = true;
        state.message = false;
        console.log('add card rejected',action.payload);
      })
      .addCase(createDeck.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createDeck.fulfilled, (state,action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.decks.push(action.payload);
      })
      .addCase(getDecks.pending,(state) => {
        state.isLoading = true;
      })
      .addCase(getDecks.fulfilled,(state,action) => {
        state.isLoading = false;
        state.decks = action.payload;
      })
  }
});
export default dataSlice.reducer;
export const { reset } = dataSlice.actions
