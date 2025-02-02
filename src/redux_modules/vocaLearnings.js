import Axios from 'axios';
import * as configs from '../configs/config.json';

/** action types */
const FETCH_VOCA_DATAS = 'vocaLearnings/FETCH_VOCA_DATAS';
const FETCH_VOCA_DATAS_SUCCESS = 'vocaLearnings/FETCH_VOCA_DATAS_SUCCESS';
const FETCH_VOCA_DATAS_FAILED = 'vocaLearnings/FETCH_VOCA_DATAS_FAILED';
const UPDATE_VOCA_DATAS = 'vocaLearnings/UPDATE_VOCA_DATAS';
const UPDATE_VOCA_DATAS_SUCCESS = 'vocaLearnings/UPDATE_VOCA_DATAS_SUCCESS';
const UPDATE_VOCA_DATAS_FAILED = 'vocaLearnings/UPDATE_VOCA_DATAS_FAILED';

/** action creators */
export const fetchVocaDatas = (limit, classNum) => async (dispatch) => {
    dispatch({ type: FETCH_VOCA_DATAS });
    try {
        const vocaDatas = await Axios.get(`${configs.SERVER_HOST}/vocas/learning-list`, {
            params: { limit: limit, classNum: classNum },
            withCredentials: true,
        });
        dispatch({ type: FETCH_VOCA_DATAS_SUCCESS, vocaDatasOriginal: vocaDatas['data'] });
    } catch (e) {
        console.error(e);
        dispatch({ type: FETCH_VOCA_DATAS_FAILED, error: e });
    }
};

export const updateVocaDatas = (idx, classNum, data) => async (dispatch) => {
    dispatch({ type: UPDATE_VOCA_DATAS });
    try {
        const updateResult = await Axios.patch(`${configs.SERVER_HOST}/vocas`, { ...data, idx: idx, classNum: classNum }, { withCredentials: true });
        dispatch({ type: UPDATE_VOCA_DATAS_SUCCESS });
    } catch (e) {
        console.error(e);
        dispatch({ type: UPDATE_VOCA_DATAS_FAILED, error: e });
    }
};

/** initial state */
const initialState = {
    vocaDatasOriginal: null,
    isPending: false,
    error: null,
};

/** reducer functions */
export default function RdxVocaLearnings(state = initialState, action) {
    switch (action.type) {
        case FETCH_VOCA_DATAS:
            return {
                ...state,
                vocaDatasOriginal: null,
                isPending: true,
                error: null,
            };
        case FETCH_VOCA_DATAS_SUCCESS:
            return {
                ...state,
                vocaDatasOriginal: action.vocaDatasOriginal,
                isPending: false,
                error: null,
            };
        case FETCH_VOCA_DATAS_FAILED:
            return {
                ...state,
                vocaDatasOriginal: null,
                isPending: false,
                error: action.error,
            };
        case UPDATE_VOCA_DATAS:
            return {
                ...state,
                isPending: true,
                error: null,
            };
        case UPDATE_VOCA_DATAS_SUCCESS:
            return {
                ...state,
                isPending: false,
                error: null,
            };
        case UPDATE_VOCA_DATAS_FAILED:
            return {
                ...state,
                isPending: false,
                error: action.error,
            };
        default:
            return state;
    }
}
