import { OfflineQueueRootState } from "./types";

export const getOnline = (state: OfflineQueueRootState) => state.processingQueue.online;
export const getOffline = (state: OfflineQueueRootState) => !state.processingQueue.online;
export const getOfflineQueue = (state: OfflineQueueRootState) => state.offlineQueue.offlineQueue;
export const getProcessingQueue = (state: OfflineQueueRootState) => state.processingQueue.processingQueue;
