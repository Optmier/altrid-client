import Axios from 'axios';
import { apiUrl } from '../configs/configs'; /* 액션 타입 선언 */

// 플랜별 기능제한 요소 정보 조회
const GET_PLAN_INFO = 'planInfo/GET_PLAN_INFO';
const GET_PLAN_INFO_SUCCESS = 'planInfo/GET_PLAN_INFO_SUCCESS';
const GET_PLAN_INFO_ERROR = 'planInfo/GET_PLAN_INFO_ERROR';

/* 액션 생성함수 선언 */
export const getPlanInfo = () => async (dispatch) => {
    dispatch({ type: GET_PLAN_INFO }); // 요청이 시작됨
    try {
        const res = await Axios.get(`${apiUrl}/assignment-draft`, { withCredentials: true }); // API 호출

        dispatch({ type: GET_PLAN_INFO_SUCCESS, data: res.data }); // 성공
    } catch (e) {
        dispatch({ type: GET_PLAN_INFO_ERROR, error: e }); // 실패
    }
};

/* 초기 상태 선언 */
const initialState = {
    planInfoDatas: {
        loading: false,
        data: null,
        error: null,
    },
};

/* reducer 함수 */
export default function planInfo(state = initialState, action) {
    switch (action.type) {
        case GET_PLAN_INFO:
            return {
                ...state,
                planInfoDatas: {
                    loading: true,
                    data: null,
                    error: null,
                },
            };
        case GET_PLAN_INFO_SUCCESS:
            return {
                ...state,
                planInfoDatas: {
                    loading: false,
                    data: action.data,
                    error: null,
                },
            };
        case GET_PLAN_INFO_ERROR:
            return {
                ...state,
                planInfoDatas: {
                    loading: false,
                    data: null,
                    error: action.error,
                },
            };

        default:
            return state;
    }
}
