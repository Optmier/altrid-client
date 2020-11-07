import { combineReducers } from 'redux';
import RdxSessions from './sessions';
import assignmentDraft from './assignmentDraft';

const rootReducer = combineReducers({
    RdxSessions,
    assignmentDraft,
});

export default rootReducer;
