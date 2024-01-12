/* eslint-disable @typescript-eslint/no-explicit-any */
// userSaga.js
import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchUsersSuccess, fetchUsersFailure, fetchUsersStart } from '../slice/user';

function* fetchUsersSaga(): Generator<any, any, any> {
  try {
    const response = yield call(fetch, 'https://randomuser.me/api/?results=10');
    const data = yield response.json();
    yield put(fetchUsersSuccess(data.results));
  } catch (error) {
    yield put(fetchUsersFailure(error));
  }
}

export function* watchFetchUsers(): Generator<any, any, any>  {
  yield takeLatest(fetchUsersStart.type, fetchUsersSaga);
}
