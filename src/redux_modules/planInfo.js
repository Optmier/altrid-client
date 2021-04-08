import Axios from 'axios';
import { apiUrl } from '../configs/configs'; /* 액션 타입 선언 */
import { put, takeLatest } from 'redux-saga/effects';
import { POST_DRAFT_SUCCESS, DELETE_DRAFT_SUCCESS, PATCH_DRAFT_SUCCESS, COPY_DRAFT_SUCCESS } from './assignmentDraft';
import { POST_ACTIVED_SUCCESS, DELETE_ACTIVED_SUCCESS } from './assignmentActived';

// 플랜별 기능제한 요소 정보 조회
const GET_PLAN_INFO = 'planInfo/GET_PLAN_INFO';
const GET_PLAN_INFO_SUCCESS = 'planInfo/GET_PLAN_INFO_SUCCESS';
const GET_PLAN_INFO_ERROR = 'planInfo/GET_PLAN_INFO_ERROR';

/* 액션 생성함수 선언 & 미들웨어 적용 */
export const getPlanInfo = (update) => async (dispatch, getState) => {
    const { planInfo, RdxSessions } = getState();
    const planId = RdxSessions.academyPlanId;
    const userType = RdxSessions.userType;

    if ((!planInfo.initital || update) && userType === 'teachers') {
        //최초에 app.js에서 불렀다면 이후에는 부를 필요가 없음.
        //학생 페이지에서는 부를 필요가 없음.

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
                planId: planId,
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

function* getPlanInfoSaga() {
    //getPlanInfo 를 update 하고싶을 때는 true를 인자 값으로 전달해주시면 됩니다.
    yield put(getPlanInfo(true));
}

export function* watcher() {
    yield takeLatest(
        [POST_DRAFT_SUCCESS, DELETE_DRAFT_SUCCESS, PATCH_DRAFT_SUCCESS, COPY_DRAFT_SUCCESS, POST_ACTIVED_SUCCESS, DELETE_ACTIVED_SUCCESS],
        getPlanInfoSaga,
    );
}

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
                restricted: state.restricted,
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
                    ...state.restricted,
                    studentInvited: action.studentNums >= 63 ? true : false,
                    teacherInvited: action.teacherNums >= (action.planId === 1 ? 1 : action.planId === 2 ? 5 : 10) ? true : false,
                    fileCreation: action.planId === 1 ? true : action.fileCounts >= (action.planId === 2 ? 5 : 10) ? true : false,
                    eyetrack: action.planId !== 1 ? false : action.eyetrackAssigments >= 2 ? true : false,
                    analysisPattern: action.planId === 1 ? true : false,
                    videoLecture: action.planId === 3 ? false : true,
                },
                error: null,
            };
        case GET_PLAN_INFO_ERROR:
            return {
                ...state,
                initital: false,
                loading: false,
                data: null,
                restricted: state.restricted,
                error: action.error,
            };

        default:
            return state;
    }
}
