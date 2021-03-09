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
        const stdNums = await Axios.get(`${apiUrl}/plan-info/students-num`, { withCredentials: true }); // API 호출
        const teacherNums = await Axios.get(`${apiUrl}/plan-info/teachers-num`, { withCredentials: true }); // API 호출
        const fileCounts = await Axios.get(`${apiUrl}/plan-info/assignment-drafts`, { withCredentials: true }); // API 호출
        const eyetrackAssigments = await Axios.get(`${apiUrl}/plan-info/assignment-actived`, { withCredentials: true }); // API 호출

        dispatch({
            type: GET_PLAN_INFO_SUCCESS,
            studentNums: stdNums.data[0]['studentNums'],
            teacherNums: teacherNums.data[0]['teacherNums'],
            fileCounts: fileCounts.data[0]['fileCounts'],
            eyetrackAssigments: eyetrackAssigments.data[0]['eyetrackAssigments'],
        }); // 성공
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
                    data: {
                        studentNums: action.studentNums,
                        teacherNums: action.teacherNums,
                        fileCounts: action.fileCounts,
                        eyetrackAssigments: action.eyetrackAssigments,
                    },
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
