const CHANGE_PARAMS = 'params/CHANGE_PARAMS';

export const changePramas = (params, data) => ({ type: CHANGE_PARAMS, params, data });

const initialState = {
    params: '',
    data: '',
};

export default function counter(state = initialState, action) {
    switch (action.type) {
        case CHANGE_PARAMS:
            return {
                ...state,
                params: action.params,
                data: action.data,
            };
        default:
            return state;
    }
}
