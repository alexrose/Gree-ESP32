import axios from 'axios';
import { SET_PARAMS_OFF } from "../constants";
import { takeLatest, call, put } from 'redux-saga/effects';
import { startRequest, stopRequest, updateParams } from '../actions/actionCreators'

/** Returns an axios call */
function getParamsRequest() {
    return axios.request({
        method: 'post',
        url: process.env.REACT_APP_POST_DATA_URL,
        data: `command=0,0,0,0,0,0,0,0,0,0`
    });
}

/** Saga worker responsible for the side effects */
function* loginEffectSaga() {
    try {
        yield put(startRequest());
        let { data } = yield call(getParamsRequest);
        yield put(stopRequest());
        yield put(updateParams({ 'status': data, 'state': 'off', 'message': 'AC turned off.' }));
    } catch (e) {
        yield put(stopRequest());
        console.log('[Critical]', e);
    }
}

/** Saga watcher triggered when dispatching action of type 'SET_PARAMS_OFF */
export function* getParamsOffWatcher() {
    yield takeLatest(SET_PARAMS_OFF, loginEffectSaga);
}