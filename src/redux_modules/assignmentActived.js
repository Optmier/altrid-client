import Axios from 'axios';
import { apiUrl } from '../configs/configs';
import { MinutetoSecond } from '../components/essentials/TimeChange';
import { $_root } from '../configs/front_urls';

/* 액션 타입 선언 */
const GET_ACTIVED = 'assignmentActived/GET_ACTIVED';
const GET_ACTIVED_SUCCESS = 'assignmentActived/GET_ACTIVED_SUCCESS';
const GET_ACTIVED_ERROR = 'assignmentActived/GET_ACTIVED_ERROR';

const POST_ACTIVED = 'assignmentActived/POST_ACTIVED';
const POST_ACTIVED_SUCCESS = 'assignmentActived/POST_ACTIVED_SUCCESS';
const POST_ACTIVED_ERROR = 'assignmentActived/POST_ACTIVED_ERROR';

const PATCH_ACTIVED = 'assignmentActived/PATCH_ACTIVED';
const PATCH_ACTIVED_ERROR = 'assignmentActived/POST_ACTIVED_ERROR';

const CHANGE_DUE_DATE = 'assignmentActived/CHANGE_DUE_DATE';

/* 액션 생성함수 선언 */
export const getActived = () => async (dispatch) => {
    // dispatch({ type: GET_ACTIVED }); // 요청이 시작됨
    // try {
    //     const arr = await Axios.get(`${apiUrl}/assignment-actived`, { withCredentials: true }); // API 호출
    //     let activedData = arr.data;
    //     dispatch({ type: GET_ACTIVED_SUCCESS, activedData }); // 성공
    // } catch (e) {
    //     dispatch({ type: GET_ACTIVED_ERROR, error: e }); // 실패
    // }
};

export const postActived = (cardData, num, due_date) => async (dispatch) => {
    dispatch({ type: POST_ACTIVED }); // 요청이 시작됨

    try {
        const { idx, title, time_limit, description } = cardData;
        const class_number = num;
        let { eyetrack } = cardData;

        if (eyetrack) {
            eyetrack = 1;
        } else {
            eyetrack = 0;
        }
        /** 나중에 json으로 받아올 데이터 !!*/
        const contents_data = null;
        const file_url = null;

        await Axios.post(
            `${apiUrl}/assignment-actived`,
            {
                assignment_number: idx,
                class_number: class_number,
                title: title,
                description: description,
                time_limit: time_limit,
                eyetrack: eyetrack,
                contents_data: contents_data,
                file_url: file_url,
                due_date: due_date,
            },
            { withCredentials: true },
        ); // API 호출

        //dispatch({ type: POST_ACTIVED_SUCCESS }); // 성공
    } catch (e) {
        dispatch({ type: POST_ACTIVED_ERROR, error: e }); //실패
    }
};
export const patchActived = (cardData, inputs, timeInputs, toggleState) => async (dispatch) => {
    // dispatch({ type: PATCH_ACTIVED }); // 요청이 시작됨
    // try {
    //     const { title, description } = inputs;
    //     let { eyetrack, timeAttack } = toggleState;
    //     const { mm, ss } = timeInputs;
    //     let time_limit = 0;
    //     if (timeAttack) {
    //         time_limit = MinutetoSecond(mm, ss);
    //     }
    //     if (eyetrack) {
    //         eyetrack = 1;
    //     } else {
    //         eyetrack = 0;
    //     }
    //     /** 나중에 json으로 받아올 데이터 !!*/
    //     const { idx, contents_data, file_url } = cardData;
    //     await Axios.patch(
    //         `${apiUrl}/assignment-actived`,
    //         {
    //             idx: idx,
    //             title: title,
    //             description: description,
    //             time_limit: time_limit,
    //             eyetrack: eyetrack,
    //             contents_data: contents_data,
    //             file_url: file_url,
    //         },
    //         { withCredentials: true },
    //     ); // API 호출
    //     console.log('update 성공 !!');
    //     dispatch(getActived()); // 성공
    // } catch (e) {
    //     dispatch({ type: PATCH_ACTIVED_ERROR, error: e }); // 실패
    //     if (!alert('데이터 베이스 오류 입니다. 관리자에게 문의해주세요 :(  관리자 이메일 cwd094@gmail.com')) {
    //         window.location.href = $_root;
    //     }
    // }
};

export const changeDueDate = (value) => ({
    type: CHANGE_DUE_DATE,
    value,
});

/* 초기 상태 선언 */
const initialState = {
    activedData: {
        loading: false,
        data: {
            class_number: '',
            assignment_number: '',
            title: '',
            description: '',
            time_limit: '',
            eyetrack: '',
            contents_data: '',
            file_url: '',
            due_date: '',
        },
        error: null,
    },
};

/* reducer 함수 */
export default function eyetrackingSelect(state = initialState, action) {
    switch (action.type) {
        case GET_ACTIVED:
            return {
                ...state,
                activedData: {
                    loading: true,
                    data: null,
                    error: null,
                },
            };
        case GET_ACTIVED_SUCCESS:
            return {
                ...state,
                activedData: {
                    loading: false,
                    data: action.activedData,
                    error: null,
                },
            };
        case GET_ACTIVED_ERROR:
            if (!alert('데이터 베이스 오류 입니다. 관리자에게 문의해주세요 :(  관리자 이메일 cwd094@gmail.com')) {
                window.location.href = $_root;
            }

            return {
                ...state,
                activedData: {
                    loading: false,
                    data: null,
                    error: action.error,
                },
            };

        case POST_ACTIVED:
            return {
                ...state,
                activedData: {
                    loading: true,
                    data: null,
                    error: null,
                },
            };
        case POST_ACTIVED_SUCCESS:
            return {
                ...state,
                activedData: {
                    loading: false,
                    error: null,
                },
            };
        case POST_ACTIVED_ERROR:
            if (!alert('데이터 베이스 오류 입니다. 관리자에게 문의해주세요 :(  관리자 이메일 cwd094@gmail.com')) {
                window.location.href = $_root;
            }

            return {
                ...state,
                activedData: {
                    loading: false,
                    data: null,
                    error: action.error,
                },
            };
        case CHANGE_DUE_DATE:
            const value = action.value;

            return {
                ...state,
                activedData: {
                    loading: false,
                    data: {
                        ...state['activedData']['data'],
                        due_date: value,
                    },
                    error: null,
                },
            };

        default:
            return state;
    }
}
