/* eslint-disable @typescript-eslint/no-explicit-any */
// store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { persistReducer, persistStore } from 'reduxjs-toolkit-persist';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'reduxjs-toolkit-persist/lib/constants';
import hardSet from 'reduxjs-toolkit-persist/lib/stateReconciler/hardSet';
import storage from 'reduxjs-toolkit-persist/lib/storage';
import { offlineReducer, createOfflineMiddleware } from 'react-offline-queue';
import rootSaga from './sagas';
import userSlice, { fetchUsersStart } from './slice/user';

export const persistConfigOfflineQueue = {
  key: 'offlineQueue',
  storage,
  hardSet,
};

const rootReducer = combineReducers({
  user: userSlice,
  offlineQueue: persistReducer(persistConfigOfflineQueue, offlineReducer.offlineQueue),
  processingQueue: offlineReducer.processingQueue
});

export type RootState = typeof rootReducer

const sagaMiddleware = createSagaMiddleware();

const configuration = {
  persistedActions: [fetchUsersStart.type],
};


const offlineMiddleware = createOfflineMiddleware(configuration);


const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware)=> getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [
        FLUSH,
        REHYDRATE,
        PAUSE,
        PERSIST,
        PURGE,
        REGISTER,
      ],
    },
  }).concat(sagaMiddleware).prepend(offlineMiddleware), 
});

sagaMiddleware.run(rootSaga);



export default store;
export const persistedStore = persistStore(store);
