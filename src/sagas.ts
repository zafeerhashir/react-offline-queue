// rootSaga.js
import { all } from 'redux-saga/effects';
import { watchFetchUsers } from './sagas/user';
import  { offlineSaga } from 'react-offline-queue'

export default function* rootSaga() {
  yield all([
    offlineSaga(),
    watchFetchUsers(),
  ]);
}
