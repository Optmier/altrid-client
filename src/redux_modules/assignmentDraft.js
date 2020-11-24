import Axios from 'axios';
import { apiUrl } from '../configs/configs';
import { MinutetoSecond } from '../components/essentials/TimeChange';

/* 액션 타입 선언 */
// draft 여러개 조회하기
const GET_DRAFTS = 'assignmentDraft/GET_DRAFTS';
const GET_DRAFTS_SUCCESS = 'assignmentDraft/GET_DRAFTS_SUCCESS';

// draft 하나 조회하기
const GET_DRAFT = 'assignmentDraft/GET_DRAFT';
const GET_DRAFT_SUCCESS = 'assignmentDraft/GET_DRAFT_SUCCESS';

// draft 삽입하기
const POST_DRAFT = 'assignmentDraft/POST_DRAFT';
const POST_DRAFT_SUCCESS = 'assignmentDraft/POST_DRAFT_SUCCESS';

// draft 수정하기
const PATCH_DRAFT = 'assignmentDraft/PATCH_DRAFT';
const PATCH_DRAFT_SUCCESS = 'assignmentDraft/PATCH_DRAFT_SUCCESS';

// draft 삭제하기
const DELETE_DRAFT = 'assignmentDraft/DELETE_DRAFT';
const DELETE_DRAFT_SUCCESS = 'assignmentDraft/DELETE_DRAFT_SUCCESS';

// CRUD error
const DRAFT_ERROR = 'assignmentDraft/DRAFT_ERROR';

/* 액션 생성함수 선언 */
export const getDrafts = () => async (dispatch) => {
    dispatch({ type: GET_DRAFTS }); // 요청이 시작됨
    try {
        const drafts = await Axios.get(`${apiUrl}/assignment-draft`, { withCredentials: true }); // API 호출
        let draftDatas = drafts.data.map((d) => {
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

        console.log(draftDatas);
        dispatch({ type: GET_DRAFTS_SUCCESS, draftDatas }); // 성공
    } catch (e) {
        dispatch({ type: DRAFT_ERROR, error: e }); // 실패
    }
};
export const getDraft = (idx) => async (dispatch) => {};
export const postDraft = (inputs, timeInputs, toggleState, selectState, attachFiles, contentsData) => async (dispatch) => {
    dispatch({ type: POST_DRAFT }); // 요청이 시작됨

    try {
        const { title, description } = inputs;
        const { mm, ss } = timeInputs;

        let { eyetrack, timeAttack } = toggleState;
        let time_limit = -2;

        if (timeAttack) {
            time_limit = MinutetoSecond(mm, ss);
        }

        if (eyetrack) {
            eyetrack = 1;
        } else {
            eyetrack = 0;
        }

        //파일 업로드 선택시,
        if (selectState === 'left') {
            contentsData = null;
        }

        const result = await Axios.post(
            `${apiUrl}/assignment-draft`,
            {
                title: title,
                description: description,
                time_limit: time_limit,
                eyetrack: eyetrack,
                contents_data: contentsData === null ? null : JSON.stringify(contentsData),
            },
            { withCredentials: true },
        ); // API 호출

        const idx = result['data']['result2'][0]['LAST_INSERT_ID()'];
        const academy_code = result['data']['academy_code'];
        const teacher_id = result['data']['teacher_id'];

        //파일 업로드 선택시,
        let file_url = null;
        if (selectState === 'left') {
            const result = await Axios.post(`${apiUrl}/files/requests-contents/${idx}`, attachFiles, { withCredentials: true });
            file_url = result.data.file_name;
        }

        let postData = {
            idx: idx,
            academy_code: academy_code,
            teacher_id: teacher_id,
            title: title,
            description: description,
            time_limit: time_limit,
            eyetrack: eyetrack,
            contents_data: contentsData,
            file_url: file_url,
        };
        dispatch({ type: POST_DRAFT_SUCCESS, postData }); // 성공
    } catch (e) {
        dispatch({ type: DRAFT_ERROR, error: e }); // 실패
    }
};
export const patchDraft = (cardData, inputs, timeInputs, toggleState, contentsData) => async (dispatch) => {
    dispatch({ type: PATCH_DRAFT }); // 요청이 시작됨

    try {
        const { idx } = cardData;
        const { title, description } = inputs;
        let { eyetrack, timeAttack } = toggleState;
        const { mm, ss } = timeInputs;

        let time_limit = -2;
        if (timeAttack) {
            time_limit = MinutetoSecond(mm, ss);
        }

        if (eyetrack) {
            eyetrack = 1;
        } else {
            eyetrack = 0;
        }

        await Axios.patch(
            `${apiUrl}/assignment-draft`,
            {
                idx: idx,
                title: title,
                description: description,
                time_limit: time_limit,
                eyetrack: eyetrack,
                contents_data: contentsData ? JSON.stringify(contentsData) : null,
            },
            { withCredentials: true },
        ); // API 호출

        let patchData = {
            idx: idx,
            title: title,
            description: description,
            time_limit: time_limit,
            eyetrack: eyetrack,
            contents_data: contentsData,
        };

        dispatch({ type: PATCH_DRAFT_SUCCESS, patchData }); // 성공
    } catch (e) {
        dispatch({ type: DRAFT_ERROR, error: e }); // 실패
    }
};
export const deleteDraft = (idx) => async (dispatch) => {
    dispatch({ type: DELETE_DRAFT }); // 요청이 시작됨

    try {
        await Axios.delete(`${apiUrl}/assignment-draft/${idx}`, { withCredentials: true }); // API 호출

        dispatch({ type: DELETE_DRAFT_SUCCESS, idx }); // 성공
    } catch (e) {
        dispatch({ type: DRAFT_ERROR, error: e }); // 실패
    }
};

/* 초기 상태 선언 */
const initialState = {
    draftDatas: {
        loading: false,
        data: null,
        error: null,
    },
    draftData: {
        loading: false,
        data: null,
        error: null,
    },
};

/* reducer 함수 */
export default function eyetrackingSelect(state = initialState, action) {
    switch (action.type) {
        case GET_DRAFTS:
            return {
                ...state,
                draftDatas: {
                    loading: true,
                    data: null,
                    error: null,
                },
            };
        case GET_DRAFTS_SUCCESS:
            return {
                ...state,
                draftDatas: {
                    loading: false,
                    data: action.draftDatas,
                    error: null,
                },
            };
        case PATCH_DRAFT:
            return {
                ...state,
                draftDatas: {
                    loading: true,
                    data: state['draftDatas']['data'],
                    error: null,
                },
            };
        case PATCH_DRAFT_SUCCESS:
            alert('과제 수정이 완료되었습니다!');
            return {
                ...state,
                draftDatas: {
                    loading: false,
                    data: state.draftDatas.data.map((dt) =>
                        dt.idx === action.patchData.idx ? { ...dt, ...action.patchData, updated: new Date() } : dt,
                    ),
                    error: null,
                },
            };
        case POST_DRAFT:
            return {
                ...state,
                draftDatas: {
                    loading: true,
                    data: state.draftDatas.data,
                    error: null,
                },
            };
        case POST_DRAFT_SUCCESS:
            alert('과제 생성이 완료되었습니다 !');
            return {
                ...state,
                draftDatas: {
                    loading: false,
                    data: [{ ...action.postData, created: new Date(), updated: new Date() }].concat(state.draftDatas.data),
                    error: null,
                },
            };
        case DELETE_DRAFT:
            return {
                ...state,
                draftDatas: {
                    loading: true,
                    data: state.draftDatas.data,
                    error: null,
                },
            };
        case DELETE_DRAFT_SUCCESS:
            alert('삭제가 완료되었습니다.');
            return {
                ...state,
                draftDatas: {
                    loading: false,
                    data: state.draftDatas.data.filter((dt) => dt.idx !== action.idx),
                    error: null,
                },
            };

        case DRAFT_ERROR:
            alert('데이터 베이스 오류 입니다. 관리자에게 문의해주세요:(\n** 관리자 이메일 cwd094@gmail.com');
            console.error('error type : ', action.type);
            console.error('error 내용 :\n', action.error);

            return {
                ...state,
                draftDatas: {
                    loading: false,
                    data: null,
                    error: action.error,
                },
            };

        default:
            return state;
    }
}
