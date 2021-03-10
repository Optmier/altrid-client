import Axios from 'axios';
import { apiUrl } from '../configs/configs'; /* 액션 타입 선언 */

// 플랜별 기능제한 요소 정보 조회
const GET_PLAN_INFO = 'planInfo/GET_PLAN_INFO';
const GET_PLAN_INFO_SUCCESS = 'planInfo/GET_PLAN_INFO_SUCCESS';
const GET_PLAN_INFO_ERROR = 'planInfo/GET_PLAN_INFO_ERROR';

/* 액션 생성함수 선언 & 미들웨어 작용 */
export const getPlanInfo = () => async (dispatch, getState) => {
    const { planInfo } = getState();
    const { planInfoDatas } = planInfo;

    if (!planInfoDatas.initital) {
        //최초에 app.js에서 불렀다면 이후에는 부를 필요가 없음.
        dispatch({ type: GET_PLAN_INFO }); // 요청이 시작됨

        try {
            console.log('axios !');
            const arr = await Promise.all([
                Axios.get(`${apiUrl}/plan-info/students-num`, { withCredentials: true }),
                Axios.get(`${apiUrl}/plan-info/teachers-num`, { withCredentials: true }),
                Axios.get(`${apiUrl}/plan-info/assignment-drafts`, { withCredentials: true }),
                Axios.get(`${apiUrl}/plan-info/assignment-actived`, { withCredentials: true }),
            ]);

            dispatch({
                type: GET_PLAN_INFO_SUCCESS,
                studentNums: arr[0].data[0]['studentNums'],
                teacherNums: arr[1].data[0]['teacherNums'],
                fileCounts: arr[2].data[0]['fileCounts'],
                eyetrackAssigments: arr[3].data[0]['eyetrackAssigments'],
            }); // 성공
        } catch (e) {
            dispatch({ type: GET_PLAN_INFO_ERROR, error: e }); // 실패
            console.error(e);
        }
    }
};

/* 초기 상태 선언 */
const initialState = {
    planInfoDatas: {
        initital: false,
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
                    initital: false,
                    loading: true,
                    data: null,
                    error: null,
                },
            };
        case GET_PLAN_INFO_SUCCESS:
            return {
                ...state,
                planInfoDatas: {
                    initital: true,
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
                    initital: false,
                    loading: false,
                    data: null,
                    error: action.error,
                },
            };

        default:
            return state;
    }
}
