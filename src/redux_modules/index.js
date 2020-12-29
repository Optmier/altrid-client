import { combineReducers } from 'redux';
import RdxSessions from './sessions';
import assignmentDraft from './assignmentDraft';
import assignmentActived from './assignmentActived';
import RdxTimer from './timer';
import RdxReports from './reports';
import RdxServerDate from './serverdate';
import RdxCurrentClass from './currentClass';

const rootReducer = combineReducers({
    RdxSessions,
    RdxTimer,
    assignmentDraft,
    assignmentActived,
    RdxReports,
    RdxServerDate,
    RdxCurrentClass,
});

export default rootReducer;
