import Axios from 'axios';
import { apiUrl } from '../configs/configs'; /* 액션 타입 선언 */

// 플랜별 기능제한 요소 정보 조회
const GET_PLAN_INFO = 'planInfo/GET_PLAN_INFO';
const GET_PLAN_INFO_SUCCESS = 'planInfo/GET_PLAN_INFO_SUCCESS';
const GET_PLAN_INFO_ERROR = 'planInfo/GET_PLAN_INFO_ERROR';

/* 액션 생성함수 선언 & 미들웨어 적용 */
export const getPlanInfo = () => async (dispatch, getState) => {
    console.log(getState());
    const { planInfo } = getState();

    if (!planInfo.initital) {
        //최초에 app.js에서 불렀다면 이후에는 부를 필요가 없음.
        dispatch({ type: GET_PLAN_INFO }); // 요청이 시작됨

        try {
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
    initital: false,
    loading: false,
    data: null,
    restricted: {
        studentInvited: false,
        teacherInvited: false,
        classCreation: false,
        timeLimit: false,
        editorCreation: false,
        fileCreation: false,
        eyetrack: false,
        classReport: false,
        studentReport: false,
        analysisType: false,
        analysisTime: false,
        analysisPattern: false,
        videoLecture: false,
    },
    error: null,
};

/* reducer 함수 */
export default function planInfo(state = initialState, action) {
    switch (action.type) {
        case GET_PLAN_INFO:
            return {
                ...state,

                initital: false,
                loading: true,
                data: null,
                restricted: null,
                error: null,
            };
        case GET_PLAN_INFO_SUCCESS:
            return {
                ...state,

                initital: true,
                loading: false,
                data: {
                    studentNums: action.studentNums,
                    teacherNums: action.teacherNums,
                    fileCounts: action.fileCounts,
                    eyetrackAssigments: action.eyetrackAssigments,
                },
                restricted: {
                    ...state,
                    studentInvited: action.studentNums > 63 ? true : false,
                    teacherInvited: false,
                    classCreation: false,
                    timeLimit: false,
                    editorCreation: false,
                    fileCreation: false,
                    eyetrack: false,
                    classReport: false,
                    studentReport: false,
                    analysisType: false,
                    analysisTime: false,
                    analysisPattern: false,
                    videoLecture: false,
                },
                error: null,
            };
        case GET_PLAN_INFO_ERROR:
            return {
                ...state,

                initital: false,
                loading: false,
                data: null,
                restricted: null,
                error: action.error,
            };

        default:
            return state;
    }
}
