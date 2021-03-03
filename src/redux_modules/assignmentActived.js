import Axios from 'axios';
import { apiUrl } from '../configs/configs';
import { MinutetoSecond } from '../components/essentials/TimeChange';
import { $_root } from '../configs/front_urls';
import moment from 'moment';

/* 액션 타입 선언 */
//atived 과제 모두 조회
const GET_ACTIVED = 'assignmentActived/GET_ACTIVED';
const GET_ACTIVED_SUCCESS = 'assignmentActived/GET_ACTIVED_SUCCESS';

//atived 과제 하나 조회
const GET_ACTIVED_ONLY = 'assignmentActived/GET_ACTIVED_ONLY';
const GET_ACTIVED_SUCCESS_ONLY = 'assignmentActived/GET_ACTIVED_SUCCESS_ONLY';

//atived 과제 등록
const POST_ACTIVED = 'assignmentActived/POST_ACTIVED';
const POST_ACTIVED_SUCCESS = 'assignmentActived/POST_ACTIVED_SUCCESS';

//atived 과제 수정
const PATCH_ACTIVED = 'assignmentActived/PATCH_ACTIVED';
const PATCH_ACTIVED_SUCCESS = 'assignmentActived/PATCH_ACTIVED_SUCCESS';

//atived 과제 하나 수정
const PATCH_ACTIVED_ONLY = 'assignmentActived/PATCH_ACTIVED_ONLY';
const PATCH_ACTIVED_SUCCESS_ONLY = 'assignmentActived/PATCH_ACTIVED_SUCCESS_ONLY';

//atived 과제 삭제
const DELETE_ACTIVED = 'assignmentActived/DELETE_ACTIVED';
const DELETE_ACTIVED_SUCCESS = 'assignmentActived/DELETE_ACTIVED_SUCCESS';

//atived 과제 날짜 변경
const CHANGE_DUE_DATE = 'assignmentActived/CHANGE_DUE_DATE';

// CRUD error
const ACTIVED_ERROR = 'assignmentActived/ACTIVED_ERROR';
const ACTIVEDES_ERROR = 'assignmentActived/ACTIVEDES_ERROR';

/* 액션 생성함수 선언 */
export const getActived = (num) => async (dispatch) => {
    dispatch({ type: GET_ACTIVED }); // 요청이 시작됨

    try {
        const activedes = await Axios.get(`${apiUrl}/assignment-actived/${num}`, { withCredentials: true }); // API 호출

        let activedDatas = activedes.data.map((d) => {
            if (d.contents_data) {
                let unparsed = d.contents_data
                    .replace(/\\n/g, '\\n')
                    .replace(/\\'/g, "\\'")
                    .replace(/\\"/g, '\\"')
                    .replace(/\\&/g, '\\&')
                    .replace(/\\r/g, '\\r')
                    .replace(/\\t/g, '\\t')
                    .replace(/\\b/g, '\\b')
                    .replace(/\\f/g, '\\f')
                    .replace(/[\u0000-\u0019]+/g, '');
                try {
                    return {
                        ...d,
                        contents_data: JSON.parse(unparsed),
                    };
                } catch (e) {
                    return {
                        ...d,
                        contents_data: null,
                    };
                }
            } else {
                return {
                    ...d,
                    contents_data: null,
                };
            }
        });

        dispatch({ type: GET_ACTIVED_SUCCESS, activedDatas }); // 성공
    } catch (e) {
        dispatch({ type: ACTIVEDES_ERROR, error: e }); // 실패
    }
};
export const getActivedOnly = (idx, created, due_date) => async (dispatch) => {
    dispatch({ type: GET_ACTIVED_ONLY }); // 요청이 시작됨

    try {
        const activedData = {
            idx: idx,
            created: created,
            due_date: due_date,
        };

        dispatch({ type: GET_ACTIVED_SUCCESS_ONLY, activedData }); // 성공
    } catch (e) {
        dispatch({ type: ACTIVED_ERROR, error: e }); // 실패
    }
};
export const postActived = (cardData, num, due_date, history) => async (dispatch) => {
    dispatch({ type: POST_ACTIVED }); // 요청이 시작됨

    try {
        const { idx, title, time_limit, description, eyetrack, contents_data, file_url } = cardData;
        const class_number = num;
        await Axios.post(
            `${apiUrl}/assignment-actived`,
            {
                assignment_number: idx,
                class_number: class_number,
                title: title,
                description: description,
                time_limit: time_limit,
                eyetrack: eyetrack,
                contents_data: JSON.stringify(contents_data),
                file_url: file_url,
                due_date: moment(due_date).format('YYYY-MM-DD HH:mm:ss'),
            },
            { withCredentials: true },
        ); // API 호출

        dispatch({ type: POST_ACTIVED_SUCCESS }); // 성공
        //history.replace($_root + `class/${class_number}/share`);
    } catch (e) {
        dispatch({ type: ACTIVEDES_ERROR, error: e }); //실패
    }
};
export const patchActived = (idx, date) => async (dispatch) => {
    dispatch({ type: PATCH_ACTIVED }); // 요청이 시작됨

    let now = moment().format('YYYY-MM-DD HH:mm:ss');
    let patchData = {};

    try {
        //과제 재시작하는 경우,
        if (date) {
            date = moment(date).format('YYYY-MM-DD HH:mm:ss');

            await Axios.patch(`${apiUrl}/assignment-actived`, { idx: idx, now: date }, { withCredentials: true }); // API 호출
            patchData = { idx: idx, due_date: date };
        }
        //과제 완료하는 경우,
        else {
            await Axios.patch(`${apiUrl}/assignment-actived`, { idx: idx, now: now }, { withCredentials: true }); // API 호출
            patchData = { idx: idx, due_date: now };
        }

        dispatch({ type: PATCH_ACTIVED_SUCCESS, patchData }); // 성공
    } catch (e) {
        dispatch({ type: ACTIVEDES_ERROR, error: e }); // 실패
    }
};
export const patchActivedOnly = (idx, date) => async (dispatch) => {
    dispatch({ type: PATCH_ACTIVED_ONLY }); // 요청이 시작됨

    let now = moment().format('YYYY-MM-DD HH:mm:ss');
    let patchData = {};

    try {
        //과제 재시작하는 경우,
        if (date) {
            date = moment(date).format('YYYY-MM-DD HH:mm:ss');

            await Axios.patch(`${apiUrl}/assignment-actived`, { idx: idx, now: date }, { withCredentials: true }); // API 호출
            patchData = { idx: idx, due_date: date };
        }
        //과제 완료하는 경우,
        else {
            await Axios.patch(`${apiUrl}/assignment-actived`, { idx: idx, now: now }, { withCredentials: true }); // API 호출
            patchData = { idx: idx, due_date: now };
        }

        dispatch({ type: PATCH_ACTIVED_SUCCESS_ONLY, patchData }); // 성공
    } catch (e) {
        dispatch({ type: ACTIVED_ERROR, error: e }); // 실패
    }
};
export const deleteActived = (idx) => async (dispatch) => {
    dispatch({ type: DELETE_ACTIVED }); // 요청이 시작됨

    try {
        await Axios.delete(`${apiUrl}/assignment-actived/${idx}`, { withCredentials: true }); // API 호출

        dispatch({ type: DELETE_ACTIVED_SUCCESS, idx }); // 성공
    } catch (e) {
        dispatch({ type: ACTIVEDES_ERROR, error: e }); // 실패
    }
};
export const changeDueDate = (value) => ({
    type: CHANGE_DUE_DATE,
    value,
});

/* 초기 상태 선언 */
const initialState = {
    activedDatas: {
        loading: false,
        data: null,
        error: null,
    },
    activedData: {
        loading: false,
        data: null,
        error: null,
    },
    dueData: {
        loading: false,
        data: '',
        error: null,
    },
};

// window.state = initialState;

/* reducer 함수 */
export default function assignmentActived(state = initialState, action) {
    switch (action.type) {
        case GET_ACTIVED:
            return {
                ...state,
                activedDatas: {
                    loading: true,
                    data: null,
                    error: null,
                },
            };
        case GET_ACTIVED_SUCCESS:
            return {
                ...state,
                activedDatas: {
                    loading: false,
                    data: action.activedDatas,
                    error: null,
                },
            };

        case GET_ACTIVED_ONLY:
            return {
                ...state,
                activedData: {
                    loading: true,
                    data: null,
                    error: null,
                },
            };
        case GET_ACTIVED_SUCCESS_ONLY:
            return {
                ...state,
                activedData: {
                    loading: false,
                    data: action.activedData,
                    error: null,
                },
            };

        case POST_ACTIVED:
            return {
                ...state,
            };
        case POST_ACTIVED_SUCCESS:
            return {
                ...state,
            };
        case PATCH_ACTIVED:
            return {
                ...state,
                activedDatas: {
                    loading: true,
                    data: state.activedDatas.data,
                    error: null,
                },
            };
        case PATCH_ACTIVED_SUCCESS:
            alert('수정 완료되었습니다!');
            return {
                ...state,
                activedDatas: {
                    loading: false,
                    data: state.activedDatas.data.map((obj) =>
                        obj.idx === action.patchData.idx
                            ? {
                                  ...obj,
                                  ...action.patchData,
                              }
                            : obj,
                    ),
                    error: null,
                },
            };

        case PATCH_ACTIVED_ONLY:
            return {
                ...state,
                activedData: {
                    loading: true,
                    data: state.activedData.data,
                    error: null,
                },
            };
        case PATCH_ACTIVED_SUCCESS_ONLY:
            alert('수정 완료되었습니다!');
            return {
                ...state,
                activedData: {
                    loading: false,
                    data: {
                        ...state.activedData.data,
                        due_date: action.patchData.due_date,
                    },
                    error: null,
                },
            };

        case DELETE_ACTIVED:
            return {
                ...state,
                activedDatas: {
                    loading: true,
                    data: state.activedDatas.data,
                    error: null,
                },
            };
        case DELETE_ACTIVED_SUCCESS:
            alert('삭제가 완료되었습니다.');
            return {
                ...state,
                activedDatas: {
                    loading: false,
                    data: state.activedDatas.data.filter((dt) => dt.idx !== action.idx),
                    error: null,
                },
            };
        case CHANGE_DUE_DATE:
            return {
                ...state,
                dueData: {
                    loading: false,
                    data: action.value,
                    error: null,
                },
            };
        case ACTIVED_ERROR:
            alert('데이터베이스 오류가 발생했습니다.\n기술 지원으로 문의해주세요!');
            console.error('error type : ', action.type);
            console.error('error 내용 :\n', action.error);

            return {
                ...state,
                activedData: {
                    loading: false,
                    data: null,
                    error: action.error,
                },
            };

        case ACTIVEDES_ERROR:
            alert('데이터베이스 오류가 발생했습니다.\n기술 지원으로 문의해주세요!');
            console.error('error type : ', action.type);
            console.error('error 내용 :\n', action.error);

            return {
                ...state,
                activedDatas: {
                    loading: false,
                    data: null,
                    error: action.error,
                },
            };
        default:
            return state;
    }
}
