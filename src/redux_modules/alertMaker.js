/** action types */
const SHOW_SNACKBAR = 'alertMaker/SHOW_SNACKBAR';
const CLOSE_SNACKBAR = 'alertMakker/CLOSE_SNACKBAR';
const OPEN_ALERT_DIALOG = 'alertMaker/OPEN_ALERT_DIALOG';
const CLOSE_ALERT_DIALOG = 'alertMaker/CLOSE_ALERT_DIALOG';

/** action creators */
export const openAlertSnackbar =
    (message: String = '', alertType: String = 'success', duration: number = 3000) =>
    (dispatch) => {
        dispatch({
            type: SHOW_SNACKBAR,
            message: message,
            alertType: alertType,
            duration: duration,
            open: true,
        });
    };
export const closeAlertSnackbar = () => (dispatch) => {
    dispatch({
        type: CLOSE_SNACKBAR,
        open: false,
    });
};
export const openAlertDialog =
    (
        alertType: String = 'success',
        title: String = '경고창 타이틀',
        message: String | Object = '경고창 메시지',
        actionButtons: String = 'no|yes',
        actionNamesMapping: String = '아니오|네',
        actionPrimaryColor: String = null,
        actionSecondaryColor: String = null,
        actionFirst: Function = () => {},
        actionSecond: Function = () => {},
        actionThird: Function = () => {},
        disableBackdropClick: Boolean = true,
        disableEscapeKeyDown: Boolean = false,
        transitionDuration: Number | Object = 0,
    ) =>
    (dispatch) => {
        dispatch({
            type: OPEN_ALERT_DIALOG,
            alertType: alertType,
            title: title,
            message: message,
            actionButtons: actionButtons,
            actionNamesMapping: actionNamesMapping,
            actionPrimaryColor: actionPrimaryColor,
            actionSecondaryColor: actionSecondaryColor,
            actionFirst: actionFirst,
            actionSecond: actionSecond,
            actionThird: actionThird,
            disableBackdropClick: disableBackdropClick,
            disableEscapeKeyDown: disableEscapeKeyDown,
            transitionDuration: transitionDuration,
            open: true,
        });
    };
export const closeAlertDialog = (args) => (dispatch) => {
    dispatch({
        type: CLOSE_ALERT_DIALOG,
        open: false,
    });
};

/** initial state */
const initialState = {
    message: '',
    alertType: 'success',
    duration: 3000,
    open: false,
};
const initialStateAlertDialog = {
    alertType: 'normal',
    title: '경고창 타이틀',
    message: '경고창 메시지',
    actionButtons: 'no|yes',
    actionNamesMapping: '아니오|네',
    actionPrimaryColor: '',
    actionSecondaryColor: '',
    actionFirst() {},
    actionSecond() {},
    actionThird() {},
    disableBackdropClick: true,
    disableEscapeKeyDown: false,
    transitionDuration: 0,
    open: false,
};

/** reducer functions */
export default function RdxAlertSnackbar(state = initialState, action) {
    switch (action.type) {
        case SHOW_SNACKBAR:
            return {
                ...state,
                message: action.message,
                alertType: action.alertType,
                duration: action.duration,
                open: action.open,
            };
        case CLOSE_SNACKBAR:
            return {
                ...state,
                open: action.open,
            };
        default:
            return state;
    }
}

export function RdxAlertDialog(state = initialStateAlertDialog, action) {
    switch (action.type) {
        case OPEN_ALERT_DIALOG:
            return {
                ...state,
                alertType: action.alertType,
                title: action.title,
                message: action.message,
                actionButtons: action.actionButtons,
                actionNamesMapping: action.actionNamesMapping,
                actionPrimaryColor: action.actionPrimaryColor,
                actionSecondaryColor: action.actionSecondaryColor,
                actionFirst: action.actionFirst,
                actionSecond: action.actionSecond,
                actionThird: action.actionThird,
                disableBackdropClick: action.disableBackdropClick,
                disableEscapeKeyDown: action.disableEscapeKeyDown,
                transitionDuration: action.transitionDuration,
                open: action.open,
            };
        case CLOSE_ALERT_DIALOG:
            return {
                ...state,
                open: action.open,
            };
        default:
            return state;
    }
}
