import Axios from 'axios';
import { apiUrl } from '../configs/configs';
import { MinutetoSecond } from '../components/essentials/TimeChange';
import { $_root } from '../configs/front_urls';
import moment from 'moment';

/* 액션 타입 선언 */
//atived 과제 모두 조회
const GET_ACTIVEDES = 'assignmentActived/GET_ACTIVEDES';
const GET_ACTIVEDES_SUCCESS = 'assignmentActived/GET_ACTIVEDES_SUCCESS';

//atived 과제 등록
const POST_ACTIVED = 'assignmentActived/POST_ACTIVED';
const POST_ACTIVED_SUCCESS = 'assignmentActived/POST_ACTIVED_SUCCESS';

//atived 과제 수정
const PATCH_ACTIVED = 'assignmentActived/PATCH_ACTIVED';
const PATCH_ACTIVED_SUCCESS = 'assignmentActived/PATCH_ACTIVED_SUCCESS';

//atived 과제 날짜 변경
const CHANGE_DUE_DATE = 'assignmentActived/CHANGE_DUE_DATE';

// CRUD error
const ACTIVED_ERROR = 'assignmentActived/ACTIVED_ERROR';
const ACTIVEDES_ERROR = 'assignmentActived/ACTIVEDES_ERROR';

/* 액션 생성함수 선언 */
export const getActivedes = (num) => async (dispatch) => {
    dispatch({ type: GET_ACTIVEDES }); // 요청이 시작됨

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

        dispatch({ type: GET_ACTIVEDES_SUCCESS, activedDatas }); // 성공
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
                due_date: due_date,
            },
            { withCredentials: true },
        ); // API 호출

        dispatch({ type: POST_ACTIVED_SUCCESS }); // 성공
        history.replace($_root + `class/${class_number}/share`);
    } catch (e) {
        dispatch({ type: ACTIVED_ERROR, error: e }); //실패
    }
};
export const patchActived = (idx, name) => async (dispatch) => {
    dispatch({ type: PATCH_ACTIVED }); // 요청이 시작됨

    let now = moment().format('YYYY-MM-DD HH:mm:ss');
    try {
        await Axios.patch(`${apiUrl}/assignment-actived`, { idx: idx, now: now }, { withCredentials: true }); // API 호출

        const patchData = { idx: idx, now: now };
        window.patchData = patchData;

        dispatch({ type: PATCH_ACTIVED_SUCCESS, patchData }); // 성공
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
        data: {
            due_date: '',
        },
        error: null,
    },
};

window.state = initialState;

/* reducer 함수 */
export default function eyetrackingSelect(state = initialState, action) {
    switch (action.type) {
        case GET_ACTIVEDES:
            return {
                ...state,
                activedDatas: {
                    loading: true,
                    data: null,
                    error: null,
                },
            };
        case GET_ACTIVEDES_SUCCESS:
            return {
                ...state,
                activedDatas: {
                    loading: false,
                    data: action.activedDatas,
                    error: null,
                },
            };

        case POST_ACTIVED:
            return {
                ...state,
                activedData: {
                    loading: true,
                    data: state.activedData.data,
                    error: null,
                },
            };
        case POST_ACTIVED_SUCCESS:
            return {
                ...state,
                activedData: {
                    loading: false,
                    data: {
                        due_date: '',
                    },
                    error: null,
                },
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
            return {
                ...state,
                activedDatas: {
                    loading: false,
                    data: state['activedDatas']['data'].map((obj) =>
                        obj['idx'] === action.patchData['idx']
                            ? {
                                  ...obj,
                                  due_date: new Date(),
                              }
                            : obj,
                    ),
                    error: null,
                },
            };

        case CHANGE_DUE_DATE:
            return {
                ...state,
                activedData: {
                    loading: false,
                    data: {
                        ...state['activedData']['data'],
                        due_date: action.value,
                    },
                    error: null,
                },
            };

        case ACTIVED_ERROR:
            alert('데이터 베이스 오류 입니다. 관리자에게 문의해주세요:(\n** 관리자 이메일 cwd094@gmail.com');
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
            alert('데이터 베이스 오류 입니다. 관리자에게 문의해주세요:(\n** 관리자 이메일 cwd094@gmail.com');
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
