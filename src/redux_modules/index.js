import { combineReducers } from 'redux';
import RdxSessions from './sessions';
import assignmentDraft from './assignmentDraft';
import RdxTimer from './timer';
import RdxReports from './reports';

const rootReducer = combineReducers({
    RdxSessions,
    assignmentDraft,
    RdxTimer,
    RdxReports,
});

export default rootReducer;
