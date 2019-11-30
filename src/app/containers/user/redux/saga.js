import { fork } from 'redux-saga/effects';

// eslint-disable-next-line require-yield
function* loginSaga() {
    return 1;
}

export default function* root() {
    yield fork(loginSaga);
}
