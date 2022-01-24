/** action types */
const SHOW_SNACKBAR = 'alertMaker/SHOW_SNACKBAR';
const CLOSE_SNACKBAR = 'alertMakker/CLOSE_SNACKBAR';

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

/** initial state */
const initialState = {
    message: '',
    alertType: 'success',
    duration: 3000,
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
