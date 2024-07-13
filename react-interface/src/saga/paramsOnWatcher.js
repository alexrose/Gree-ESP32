import axios from 'axios';
import { SET_PARAMS_ON } from "../constants";
import { takeLatest, call, put } from 'redux-saga/effects';
import { startRequest, stopRequest, updateParams } from '../actions/actionCreators'

/** Returns an axios call */
function getParamsRequest(data) {
    return axios.request({
        method: 'post',
        url: process.env.REACT_APP_GET_DATA_URL,
        data: `command=${data.mode},${data.temperature},${data.fanSpeed},${data.directionAuto},${data.direction},${data.light},${data.turbo},${data.xFan},${data.sleep},1`
    });
}

/** Saga worker responsible for the side effects */
function* loginEffectSaga(payload) {
    try {
        yield put(startRequest());
        let { data } = yield call(getParamsRequest, payload.param);
        yield put(stopRequest());
        put(updateParams({ 'status': data, 'state': 'on', 'message': 'AC turned on.' }));
    } catch (e) {
        yield put(stopRequest());
        console.log('[Critical]', e);
    }
}

/** Saga watcher triggered when dispatching action of type 'SET_PARAMS_ON */
export function* getParamsOnWatcher() {
    yield takeLatest(SET_PARAMS_ON, loginEffectSaga);
}