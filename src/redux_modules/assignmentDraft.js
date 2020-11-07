import Axios from 'axios';
import { apiUrl } from '../configs/configs';

/* 액션 타입 선언 */
const GET_DRAFT = 'assignmentDraft/GET_DRAFT';

/* 액션 생성함수 선언 */
export const getDraft = () => ({
    type: GET_DRAFT,
});

/* 초기 상태 선언 */
const initialState = [1];

export default function eyetrackingSelect(state = initialState, action) {
    switch (action.type) {
        case GET_DRAFT:
            let arr = [];
            Axios.get(`${apiUrl}/assignment-draft`, { withCredentials: true })
                .then((res) => {
                    arr = res.data;
                })
                .catch((err) => {
                    console.error(err.response.data.code);
                });
            console.log(arr);
            state = [0, 0];
            return state;
        default:
            return state;
    }
}
