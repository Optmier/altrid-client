/** action types */
const SET_STATE = 'leftNavStateGlobal/SET_STATE';
const SET_SCREEN_STATE = 'leftNavStateGlobal/SET_SCREEN_STATE';

/** action creators */
export const setLeftNavStateGlobal = (state: Boolean) => (dispatch) => {
    dispatch({
        type: SET_STATE,
        leftNavGlobal: state,
    });
};
export const setLeftNavStateGlobalScreen = (state: Boolean) => (dispatch) => {
    dispatch({
        type: SET_STATE,
        screenState: state,
    });
};

/** initial states */
const initialState = {
    leftNavGlobal: window.innerWidth > 902,
    screenState: window.innerWidth > 902,
};

/** reducer functions */
export default function RdxGlobalLeftNavState(state = initialState, action) {
    switch (action.type) {
        case SET_STATE:
            return {
                ...state,
                leftNavGlobal: action.leftNavGlobal,
            };
        case SET_SCREEN_STATE:
            return {
                ...state,
                screenState: action.screenState,
            };
        default:
            return state;
    }
}
