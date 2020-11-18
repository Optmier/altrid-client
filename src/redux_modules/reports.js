/** Action Tyypes */
const SET_REPORT_DATA = 'SET_REPORT_DATA';

/** Action creator functions */
function setReportData(data) {
    return {
        type: SET_REPORT_DATA,
        data: data,
    };
}

/** Define initial states */
const initStates = {};

/** Reducer & functions */
function RdxReports(state = initStates, action) {
    switch (action.type) {
        case SET_REPORT_DATA:
            return applySetReportData(state, action);
        default:
            return state;
    }
}

function applySetReportData(state, action) {
    return {
        ...state,
        ...action.data,
    };
}

/** Export action creators */
export { setReportData };

/** export reducer */
export default RdxReports;
