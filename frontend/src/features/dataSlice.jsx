import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useParams } from 'react-router-dom';
import dataService from './dataService';

const initialState = {
  decks: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  activeDeck: [{}],
  card: null,
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
export const deleteDeck = createAsyncThunk(
  'data/delete',
  async (deckData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await dataService.deleteDeck(deckData, token);
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
export const getCards = createAsyncThunk(
  'data/getCards',
  async (deckData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await dataService.getCards(deckData, token);
    } catch (error) {
      const message = error.response.data.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const practiceCards = createAsyncThunk(
  'data/practiceCards',
  async (deckData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await dataService.practiceCards(deckData, token);
    } catch (error) {
      const message = error.response.data.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const nextCard = createAsyncThunk(
  'data/nextCard',
  async (deckData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await dataService.nextCard(deckData, token);
    } catch (error) {
      const message = error.response.data.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const updateRecallability = createAsyncThunk(
  'data/updateRecallability',
  async ({ deckData, cardData, newRecallability }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await dataService.updateRecallability(deckData, cardData, newRecallability, token);
    } catch (error) {
      const message = error.response.data.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const updateVisibility = createAsyncThunk(
  'data/updateVisibility',
  async (deckData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await dataService.updateVisibility(deckData, token);
    } catch (error) {
      const message = error.response.data.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);
const getIdx = (decks, deckId) => {
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
    clear: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateVisibility.fulfilled, (state, action) => {
        const deck = state.decks.find((deck) => deck._id === action.payload._id);
        deck.public = action.payload.public;
      })
      .addCase(removeCard.fulfilled, (state, action) => {
        const idx = getIdx(state.activeDeck, action.payload.cardId);
        state.activeDeck.splice(idx, 1);
      })
      .addCase(getCards.fulfilled, (state, action) => {
        state.activeDeck = action.payload;
      })
      .addCase(deleteDeck.fulfilled, (state, action) => {
        state.isSuccess = true;
        const deckIdx = getIdx(state.decks, action.payload.deckID);
        state.decks.splice(deckIdx, 1);
      })
      .addCase(addCard.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoading = false;
        const idx = getIdx(state.decks, action.payload.deckId);
        state.decks[idx].cards.push(action.payload);
      })
      .addCase(addCard.rejected, (state, action) => {
        state.isSuccess = false;
        state.message = false;
      })
      .addCase(createDeck.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createDeck.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.decks.push(action.payload);
      })
      .addCase(getDecks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDecks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.decks = action.payload;
      })
      .addCase(practiceCards.fulfilled, (state, action) => {
        state.card = action.payload;
      })
      .addCase(nextCard.fulfilled, (state, action) => {
        state.card = action.payload;
      })
      .addCase(updateRecallability.fulfilled, (state, action) => {
        state.card = action.payload;
      })
  }
});
export default dataSlice.reducer;
export const { reset } = dataSlice.actions
export const { clear } = dataSlice.actions
