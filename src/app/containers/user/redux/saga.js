import { put, take, call, fork } from 'redux-saga/effects';
import { useMutation } from '@apollo/react-hooks';
import { loadingOpen, loadingClose } from 'app/components/loadingApp/action';
import { openToast } from 'app/components/toast/action';
import { STATUS_MESSAGE } from 'app/consts';

import * as nameEvents from './action';
import { CREATE_USER_CALL } from '../const';
import CREATE_USER from '../graphql/mutation';

const userCallApi = data => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useMutation(CREATE_USER, {
        variables: data,
    });
};

function* loginSaga() {
    while (true) {
        const { data } = yield take(CREATE_USER_CALL);
        console.log(data);
        yield put(loadingOpen());
        const result = yield call(userCallApi, data);
        if (result && !result.errMess) {
            yield put(nameEvents.userSuccess());
            yield put(openToast(STATUS_MESSAGE.SUCCESS, 'Created'));
        } else {
            yield put(nameEvents.userFailed());
            yield put(openToast(STATUS_MESSAGE.ERROR, 'Failed'));
        }

        yield put(loadingClose());
    }
}

export default function* root() {
    yield fork(loginSaga);
}
