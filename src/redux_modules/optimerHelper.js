import { OpTimer } from '../components/OpTimer/OpTimer';

/** action types */
const ATTACH_OPTIMER = 'optimerHelper/ATTACH_OPTIMER';

/** action creators */
export const attachOptimer = (studentId) => (dispatch) => {
    dispatch({ type: ATTACH_OPTIMER, optimer: new OpTimer(studentId) });
};

/** initial states */
const initialState = {
    optimer: null,
};

/** reducer functions */
export default function RdxOpTimerHelper(state = initialState, action) {
    switch (action.type) {
        case ATTACH_OPTIMER:
            return {
                ...state,
                optimer: action.optimer,
            };
        default:
            return state;
    }
}
