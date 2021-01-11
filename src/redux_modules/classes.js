/** Action types */
const GET_CLASSES = 'classes/GET_CLASSES';
const GET_CLASSES_ERROR = 'classes/GET_CLASSES_ERROR';

/** Action creators */
export const getClasses = (datas) => ({
    type: GET_CLASSES,
    datas,
});
export const getClassesError = (error) => ({
    type: GET_CLASSES_ERROR,
    error,
});

/** Initial state */
const initialState = {
    classDatas: null,
    error: null,
};

/** Reducer functions */
export default function classes(state = initialState, action) {
    switch (action.type) {
        case GET_CLASSES:
            return {
                ...state,
                classDatas: action.datas,
                error: null,
            };

        case GET_CLASSES_ERROR:
            return {
                ...state,
                classDatas: null,
                error: action.error,
            };

        default:
            return state;
    }
}
