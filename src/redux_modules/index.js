import { combineReducers } from 'redux';
import RdxSessions from './sessions';
import assignmentDraft from './assignmentDraft';
import assignmentActived from './assignmentActived';
import RdxTimer from './timer';
import RdxReports from './reports';

const rootReducer = combineReducers({
    RdxSessions,
    RdxTimer,
    assignmentDraft,
    assignmentActived,
    RdxReports,
});

export default rootReducer;
