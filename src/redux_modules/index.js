import { combineReducers } from 'redux';
import RdxSessions from './sessions';
import RdxTimer from './timer';

const rootReducer = combineReducers({
    RdxSessions,
    RdxTimer,
});

export default rootReducer;
