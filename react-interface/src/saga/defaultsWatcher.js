import axios from 'axios';
import { GET_DEFAULTS } from "../constants";
import { takeLatest, call, put } from 'redux-saga/effects';
import { startRequest, stopRequest, updateDefaults } from '../actions/actionCreators'

/** Returns an axios call */
function getDefaultsRequest() {
    return axios.request({
        method: 'get',
        url: `${process.env.REACT_APP_GET_DATA_URL}`
    });
}

/** Saga worker responsible for the side effects */
function* loginEffectSaga(payload) {
    try {
        yield put(startRequest());

        let { data } = yield call(getDefaultsRequest);

        yield put(updateDefaults(data));
        yield put(stopRequest());
    } catch (e) {
        yield put(stopRequest());
        console.log('[Critical]', e);
    }
}

/** Saga watcher triggered when dispatching action of type 'GET_DEFAULTS */
export function* getDefaultsWatcher() {
    yield takeLatest(GET_DEFAULTS, loginEffectSaga);
}