import Axios from 'axios';
import { apiUrl } from '../configs/configs';
import { createPromiseThunk, reducerUtils, handleAsyncActions } from './lib/asyncUtils';

/* 액션 타입 선언 */
const GET_DRAFT = 'assignmentDraft/GET_DRAFT';
const GET_DRAFT_SUCCESS = 'assignmentDraft/GET_DRAFT_SUCCESS';
const GET_DRAFT_ERROR = 'assignmentDraft/GET_DRAFT_ERROR';

const POST_DRAFT = 'assignmentDraft/POST_DRAFT';
const PATCH_DRAFT = 'assignmentDraft/PATCH_DRAFT';

const GET_POST = 'GET_POST';
const GET_POST_SUCCESS = 'GET_POST_SUCCESS';
const GET_POST_ERROR = 'GET_POST_ERROR';

/* 액션 생성함수 선언 */

export const PostDraft = () => ({
    type: POST_DRAFT,
});
export const PatchDraft = () => ({
    type: PATCH_DRAFT,
});

export const getPost = createPromiseThunk(GET_POST, Axios.get(`${apiUrl}/assignment-draft`, { withCredentials: true }));
export const getDraft = () => async (dispatch) => {
    dispatch({ type: GET_DRAFT }); // 요청이 시작됨
    try {
        const arr = await Axios.get(`${apiUrl}/assignment-draft`, { withCredentials: true }); // API 호출
        let draftData = arr.data;

        dispatch({ type: GET_DRAFT_SUCCESS, draftData }); // 성공
        console.log('draftData!!!!!', draftData);
    } catch (e) {
        dispatch({ type: GET_DRAFT_ERROR, error: e }); // 실패
    }
};

/* 초기 상태 선언 */
const initialState = {
    draftData: {
        loading: false,
        data: null,
        error: null,
    },
};

/* axios 함수 선언*/
const getAxios = () => {
    Axios.get(`${apiUrl}/assignment-draft`, { withCredentials: true })
        .then((res) => {
            console.log('axios데이터 : ', res.data);
            return res.data;
        })
        .catch((err) => {
            console.error(err.response.data.code);
            return err;
        });
};

/* reducer 함수 */
export default function eyetrackingSelect(state = initialState, action) {
    switch (action.type) {
        case GET_DRAFT:
            return {
                ...state,
                draftData: {
                    loading: true,
                    data: null,
                    error: null,
                },
            };
        case GET_DRAFT_SUCCESS:
            console.log('axios성공 !! : ', action.draftData);
            return {
                ...state,

                draftData: {
                    loading: true,
                    data: action.draftData,
                    error: null,
                },
            };
        default:
            return state;
    }
}
