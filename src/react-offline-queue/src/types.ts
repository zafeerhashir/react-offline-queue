/* eslint-disable @typescript-eslint/no-explicit-any */
import { take } from 'redux-saga/effects';
import slice from './slice';

export type OfflineQueueItem = any


export type OfflineQueueRootState = {
  offlineQueue: ReturnType<typeof slice.offlineQueue>;
  processingQueue: ReturnType<typeof slice.processingQueue>;
};

export interface SetNetWorkSatus {
  type: string;
  payload: boolean,
}

export interface ProcessQueue {
  type: string;
}

export interface OfflineQueueState {
    offlineQueue: OfflineQueueItem[];
  }

export interface ProcessingQueueState {
    online: boolean;
    processingQueue: boolean,
}

export interface RaceResult {
    online: boolean;
    cancel: ReturnType<typeof take>;
  }

export interface Action {
    type: string;
    payload: any
    timeStamp: string;
  }

export interface Configuration {
  persistedActions: string[]
}


export type EnqueuePayload = any;
