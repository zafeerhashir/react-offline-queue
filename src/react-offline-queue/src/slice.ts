import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EnqueuePayload, OfflineQueueState, ProcessingQueueState } from './types';

const initialStateOfflineQueue: OfflineQueueState = {
  offlineQueue: [],
};

const initialStateProcessingQueue: ProcessingQueueState = {
  online: true,
  processingQueue: false,
};

const offlineQueue = createSlice({
  name: 'offlineQueue',
  initialState: initialStateOfflineQueue,
  reducers: {
    enqueue: (state, action: PayloadAction<EnqueuePayload>) => {
      state.offlineQueue.push({ ...action.payload, timeStamp: new Date().toISOString() });
    },
    dequeue: (state) => {
      state.offlineQueue = state.offlineQueue.slice(1);
    },
    clearOffflineQueue: () => initialStateOfflineQueue,
  },
});

const processingQueue = createSlice({
  name: 'processingQueue',
  initialState: initialStateProcessingQueue,
  reducers: {
    setOffline: (state, action: PayloadAction<boolean>) => {
      state.online = action.payload;
    },
    setOnline: (state, action: PayloadAction<boolean>) => {
      state.online = action.payload;
    },
    setQueueProcessing: (state, action: PayloadAction<boolean>) => {
      state.processingQueue = action.payload;
    },
  },
});

export const {
  enqueue,
  dequeue,
  clearOffflineQueue,
} = offlineQueue.actions;

export const {
  setOffline,
  setOnline,
  setQueueProcessing,
} = processingQueue.actions;

export const processQueue = createAction('processingQueue/processQueue');

export default {
  offlineQueue: offlineQueue.reducer,
  processingQueue: processingQueue.reducer,
};
