import { combineReducers } from 'redux';
import RdxSessions from './sessions';
import assignmentDraft from './assignmentDraft';
import RdxTimer from './timer';

const rootReducer = combineReducers({
    RdxSessions,
    assignmentDraft,
    RdxTimer,
});

export default rootReducer;
