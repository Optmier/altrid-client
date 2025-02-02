import Axios from 'axios';
import * as configs from '../configs/config.json';

/** Action types */
const GET = 'serverdate/GET';
const GET_SUCCESS = 'serverdate/GET_SUCCESS';
const GET_ERROR = 'serverdate/GET_ERROR';

const UPDATE = 'serverdate/UPDATE';

/** Action creators */
export const getServerDate = () => async (dispatch) => {
    dispatch({ type: GET });
    try {
        const datetime = await Axios.get(`${configs.SERVER_HOST}/auth/datetime`, { withCredentials: true });

        dispatch({ type: GET_SUCCESS, datetime: datetime['data'] });
    } catch (e) {
        console.error(e);
        dispatch({ type: GET_ERROR, error: e });
    }
};

export const updateServerDate = () => async (dispatch) => {
    dispatch({ type: UPDATE });
    try {
        const datetime = await Axios.get(`${configs.SERVER_HOST}/auth/datetime`, { withCredentials: true });
        dispatch({ type: UPDATE, datetime: datetime['data'] });
    } catch (e) {
        console.error(e);
        dispatch({ type: UPDATE, error: e });
    }
};

/** Initial state */
const initialState = {
    datetime: null,
    loading: false,
    error: null,
};

/** Reducer functions */
export default function RdxServerDate(state = initialState, action) {
    switch (action.type) {
        case GET:
            return {
                ...state,
                datetime: null,
                loading: true,
                error: null,
            };
        case GET_SUCCESS:
            return {
                ...state,
                datetime: action.datetime,
                loading: false,
                error: null,
            };
        case GET_ERROR:
            return {
                ...state,
                datetime: null,
                loading: false,
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
