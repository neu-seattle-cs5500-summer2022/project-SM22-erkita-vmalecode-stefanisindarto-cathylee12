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
      return await dataService.addCard(cardData, token);
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
export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCard.fulfilled, (state,action) => {
        state.isSuccess = true;
        state.isLoading = false;
        console.log('add card fulfilled',action.payload);
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