import { fork, put } from 'redux-saga/effects';

function* loginSaga() {
    return yield put(1);
}

export default function* root() {
    yield fork(loginSaga);
}
