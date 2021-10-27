import Axios from 'axios';
import { apiUrl } from '../configs/configs';

/** action types */
const FETCH_VOCA_DATAS = 'vocaLearnings/FETCH_VOCA_DATAS';
const FETCH_VOCA_DATAS_SUCCESS = 'vocaLearnings/FETCH_VOCA_DATAS_SUCCESS';
const FETCH_VOCA_DATAS_ERROR = 'vocaLearnings/FETCH_VOCA_DATAS_ERROR';

/** action creators */
export const fetchVocaDatas = (limit) => async (dispatch) => {
    dispatch({ type: FETCH_VOCA_DATAS });
    try {
        const vocaDatas = await Axios.get(`${apiUrl}/vocas/learning-list`, { params: { limit: limit }, withCredentials: true });
        dispatch({ type: FETCH_VOCA_DATAS_SUCCESS, vocaDatasOriginal: vocaDatas['data'] });
    } catch (e) {
        console.error(e);
        dispatch({ type: FETCH_VOCA_DATAS_ERROR, error: e });
    }
};

/** initial state */
const initialState = {
    vocaDatasOriginal: null,
    isLoading: false,
    error: null,
};

/** reducer functions */
export default function RdxVocaLearnings(state = initialState, action) {
    switch (action.type) {
        case FETCH_VOCA_DATAS:
            return {
                ...state,
                vocaDatasOriginal: null,
                isLoading: true,
                error: null,
            };
        case FETCH_VOCA_DATAS_SUCCESS:
            return {
                ...state,
                vocaDatasOriginal: action.vocaDatasOriginal,
                isLoading: false,
                error: null,
            };
        case FETCH_VOCA_DATAS_ERROR:
            return {
                ...state,
                vocaDatasOriginal: null,
                loading: false,
                error: action.error,
            };
        default:
            return state;
    }
}
