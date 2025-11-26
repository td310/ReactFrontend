import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  type Storage,
} from 'redux-persist';
import authReducer from './AuthStore/authSlice';
import { authApi } from '@/api/Auth/authApi';
import { userApi } from '@/api/User/userApi';

const createSessionStorageAdapter = (): Storage => {
  if (typeof window === 'undefined' || !window.sessionStorage) {
    return {
      getItem: async () => null,
      setItem: async () => {},
      removeItem: async () => {},
    };
  }

  return {
    getItem: async (key: string) => window.sessionStorage.getItem(key),
    setItem: async (key: string, value: string) => {
      window.sessionStorage.setItem(key, value);
    },
    removeItem: async (key: string) => {
      window.sessionStorage.removeItem(key);
    },
  };
};

const sessionStorageAdapter = createSessionStorageAdapter();

const persistConfig = {
  key: 'auth',
  storage: sessionStorageAdapter,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(authApi.middleware, userApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;