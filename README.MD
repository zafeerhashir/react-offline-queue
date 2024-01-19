# react-offline-queue Package
its react library for adding offline
api calling feature into your app.
its store all api calls in offline
and call it in sequential manner when app comes online.

![Placeholder for Image](https://github.com/zafeerhashir/react-offline-queue/blob/master/20240112184134.gif)

## Overview

The `react-offline-queue` package provides a robust solution for managing offline actions in a Redux store. It allows you to queue actions that occurred while the application is offline and seamlessly replays them in sequential order upon reconnecting. Importantly, it automatically processes queued actions when the app transitions from being in the background to being visible on screen, ensuring a smooth experience as the app regains internet connectivity.

## Installation

yarn install react-offline-queue


## Usage

```bash


// ... (Other imports)

import { offlineReducer, createOfflineMiddleware } from 'react-offline-queue';
import rootSaga from './sagas';
import userSlice, { fetchUsersStart } from './slice/user';

// ... (Other code)

const persistConfigOfflineQueue = {
  key: 'offlineQueue',
  storage,
  hardSet,
};

const rootReducer = combineReducers({
  user: userSlice,
  offlineQueue: persistReducer(persistConfigOfflineQueue, offlineReducer.offlineQueue),
  processingQueue: offlineReducer.processingQueue,
});

// ... (Other code)

const configuration = {
  persistedActions: [fetchUsersStart.type],
};

const offlineMiddleware = createOfflineMiddleware(configuration);

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
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

// ... (Other code)

export default store;
export const persistedStore = persistStore(store);


// ... (Other imports)

import { getOfflineQueue } from 'react-offline-queue';

// ... (Other code)

function App() {
  const dispatch = useDispatch();
  const offlineQueue = useSelector(getOfflineQueue);

  // ... (Other code)

  return (
    <>
      <button
        onClick={handleFetchAllUsers}
        style={{
          padding: '10px 20px',
          marginTop: '20px',
          backgroundColor: '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Fetch All Users
      </button>
      <Queue queue={offlineQueue} />
      <UserList users={users} />
    </>
  );
}

export default App;


import { offlineSaga } from 'react-offline-queue';

// ... (Other code)

export default function* rootSaga() {
  yield all([
    offlineSaga(),
    watchFetchUsers(),
  ]);
}


