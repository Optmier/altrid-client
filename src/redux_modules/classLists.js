/** 액션 타입 선언 */
const GET_CLASS_LISTS = 'classLists/GET_CLASS_LISTS';

/** 액션 생성자 */
export const getClassLists = (datas) => ({
    type: GET_CLASS_LISTS,
    datas,
});

/** Initial state */
const initialState = [];

/** Reducer functions */
export default function classes(state = initialState, action) {
    switch (action.type) {
        case GET_CLASS_LISTS:
            return action.datas;

        default:
            return state;
    }
}
