import Axios from 'axios';
import { apiUrl } from '../configs/configs';

/** Action types */
const GET = 'serverdate/GET';
const UPDATE = 'serverdate/UPDATE';

/** Action creators */
export const getServerDate = () => async (dispatch) => {
    dispatch({ type: GET });
    try {
        const datetime = await Axios.get(`${apiUrl}/auth/datetime`, { withCredentials: true });
        dispatch({ type: GET, datetime: datetime['data'] });
    } catch (e) {
        console.error(e);
        dispatch({ type: GET, error: e });
    }
};

export const updateServerDate = () => async (dispatch) => {
    dispatch({ type: UPDATE });
    try {
        const datetime = await Axios.get(`${apiUrl}/auth/datetime`, { withCredentials: true });
        dispatch({ type: UPDATE, datetime: datetime['data'] });
    } catch (e) {
        console.error(e);
        dispatch({ type: UPDATE, error: e });
    }
};

/** Initial state */
const initialState = {
    datetime: null,
    error: null,
};

/** Reducer functions */
export default function RdxServerDate(state = initialState, action) {
    switch (action.type) {
        case GET:
            return {
                ...state,
                datetime: action.datetime,
                error: action.error,
            };
        case UPDATE:
            return {
                ...state,
                datetime: action.datetime,
                error: action.error,
            };
        default:
            return state;
    }
}
