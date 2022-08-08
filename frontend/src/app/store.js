import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import dataReducer from "../features/dataSlice";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk'
import {combineReducers} from "redux"; 

const persistConfig = {
  key: 'root',
  storage
}
const reducers = combineReducers({
  auth: authReducer,
  data: dataReducer,
 });
const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
});

export const persistor = persistStore(store);
