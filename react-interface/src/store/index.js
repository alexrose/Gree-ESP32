import rootSaga from "../saga/rootSaga";
import rootReducer from '../reducer';
import createSagaMiddleware from 'redux-saga';
import { configureStore } from '@reduxjs/toolkit';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([sagaMiddleware])
});

sagaMiddleware.run(rootSaga);

export default store;