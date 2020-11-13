import { combineReducers } from 'redux';
import RdxSessions from './sessions';
import assignmentDraft from './assignmentDraft';
import assignmentActived from './assignmentActived';

const rootReducer = combineReducers({
    RdxSessions,
    assignmentDraft,
    assignmentActived,
});

export default rootReducer;
