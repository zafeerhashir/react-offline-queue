/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-restricted-syntax */
import { EventChannel, eventChannel } from 'redux-saga';
import {
  Effect,
  all,
  call,
  cancel,
  delay,
  fork,
  put,
  race,
  select,
  take,
  takeLatest,
} from 'redux-saga/effects';
import { getOfflineQueue } from './selectors';
import {
  processQueue,
  dequeue,
  setOffline,
  setOnline,
  setQueueProcessing,
  clearOffflineQueue,
} from './slice';

function createOnlineStatusChannel(): EventChannel<boolean> {
  return eventChannel<boolean>((emit) => {
    const handleOnline = () => emit(true);
    const handleOffline = () => emit(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  });
}

function createLoadEventChannel() {
  return eventChannel((emit) => {
    const onLoad = () => emit(true);
    window.addEventListener('load', onLoad);
    return () => {
      window.removeEventListener('load', onLoad);
    };
  });
}

function createVisibilityChangeEventChannel() {
  return eventChannel((emit) => {
    const handleVisibilityChange = () => {
      emit(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    emit(document.visibilityState === 'visible');
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  });
}

export function* watchLoadEvent(): Generator<Effect, void, any> {
  const loadChannel = yield call(createLoadEventChannel);

  try {
    while (true) {
      yield take(loadChannel);
      const online = navigator.onLine;
      if (online) {
        yield put(processQueue());
      }
    }
  } finally {
    loadChannel.close();
  }
}

export function* watchOnlineStatus(): Generator<Effect, void, any> {
  const onlineChannel = yield call(createOnlineStatusChannel);
  try {
    while (true) {
      const online = yield take(onlineChannel);
      if (online) {
        yield put(setOnline(true));
        yield put(processQueue());
      } else {
        yield put(setOffline(false));
      }
    }
  } finally {
    onlineChannel.close();
  }
}

export function* watchAppVisibility(): Generator<Effect, void, any> {
  const appVisibleChannel = yield call(createVisibilityChangeEventChannel);

  try {
    while (true) {
      const appVisible = yield take(appVisibleChannel);
      const online = navigator.onLine;
      if (appVisible && online) {
        yield put(processQueue());
      }
    }
  } finally {
    appVisibleChannel.close();
  }
}

export function* processQueueHandler(): Generator<Effect, void, any> {
  try {
    const queue = yield select(getOfflineQueue);

    if (queue.length > 0) {
      yield put(setQueueProcessing(true));
    }

    for (const e of queue) {
      const { online, cancelProcessQueueHandler } = yield race({
        online: delay(1000),
        cancelProcessQueueHandler: take(setOffline),

      });

      if (cancelProcessQueueHandler) {
        yield cancel();
        break;
      }

      if (online) {
        yield put({ ...e });
        yield put(dequeue());
      }
    }
  } finally {
    yield put(setQueueProcessing(false));
  }
}

export function* clearQueueBeforeProcessing() {
  while (true) {
    yield take(clearOffflineQueue);
    yield put(setQueueProcessing(false));
  }
}

export default function* rootSaga(): Generator<Effect, void, any> {
  yield all([
    fork(watchOnlineStatus),
    fork(watchLoadEvent),
    fork(watchAppVisibility),
    fork(clearQueueBeforeProcessing),
    takeLatest(processQueue, processQueueHandler),
  ]);
}
