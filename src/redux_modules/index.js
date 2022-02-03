import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';
import RdxSessions from './sessions';
import assignmentDraft from './assignmentDraft';
import assignmentActived from './assignmentActived';
import RdxTimer from './timer';
import RdxReports from './reports';
import RdxServerDate from './serverdate';
import RdxCurrentClass from './currentClass';
import classes from './classes';
import params from './params';
import classLists from './classLists';
import planInfo, { watcher } from './planInfo';
import RdxVocaLearnings from './vocaLearnings';
import RdxOpTimerHelper from './optimerHelper';
import RdxGlobalLeftNavState from './leftNavStateGlobal';
import RdxAlertSnackbar, { RdxAlertDialog } from './alertMaker';

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
    classLists,
    planInfo,
    RdxVocaLearnings,
    RdxOpTimerHelper,
    RdxGlobalLeftNavState,
    RdxAlertSnackbar,
    RdxAlertDialog,
});
export function* rootSaga() {
    yield all([watcher()]); // all 은 배열 안의 여러 사가를 동시에 실행시켜줍니다.
}

export default rootReducer;
