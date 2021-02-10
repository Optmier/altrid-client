import { combineReducers } from 'redux';
import RdxSessions from './sessions';
import assignmentDraft from './assignmentDraft';
import assignmentActived from './assignmentActived';
import RdxTimer from './timer';
import RdxReports from './reports';
import RdxServerDate from './serverdate';
import RdxCurrentClass from './currentClass';
import classes from './classes';
import params from './params';

const rootReducer = combineReducers({
    RdxSessions,
    RdxTimer,
    assignmentDraft,
    assignmentActived,
    RdxReports,
    RdxServerDate,
    RdxCurrentClass,
    classes,
    params,
});

export default rootReducer;
