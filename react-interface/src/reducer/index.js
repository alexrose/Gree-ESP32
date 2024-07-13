import defaultsReducer from './defaultsReducer';
import paramsReducer from "./paramsReducer";
import handleRequestReducer from "./handleRequestReducer";
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    paramsData: paramsReducer,
    defaultsData: defaultsReducer,
    handleRequestData: handleRequestReducer
})

export default rootReducer