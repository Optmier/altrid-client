/** Action types */
const SET_STUDENTS_NUM = 'current_class/SET_STUDENTS_NUM';
const SET_CURRENT_VIDEO_LECTURE = 'current_class/SET_CURRENT_VIDEO_LECTURE';
const UPDATE_LIVE_COUNTS = 'current_class/UPDATE_LIVE_COUNTS';

/** Action creator functions */
function setStudentsNum(nums) {
    return {
        type: SET_STUDENTS_NUM,
        studentsNumber: nums,
    };
}

function setCurrentVideoLecture(obj) {
    return {
        type: SET_CURRENT_VIDEO_LECTURE,
        currentVideoLecture: obj,
    };
}

function updateLiveCounts(num) {
    return {
        type: UPDATE_LIVE_COUNTS,
        liveCounts: num,
    };
}

/** Define initial states */
const initialState = {
    currentStudentsNumber: 0,
    currentVideoLecture: null,
};

/** Reducer & functions */
function RdxCurrentClass(state = initialState, action) {
    switch (action.type) {
        case SET_STUDENTS_NUM:
            return applyStudentsNumber(state, action);
        case SET_CURRENT_VIDEO_LECTURE:
            return applyCurrentVideoLecture(state, action);
        case UPDATE_LIVE_COUNTS:
            return applyUpdateLiveCounts(state, action);
        default:
            return state;
    }
}

function applyStudentsNumber(state, action) {
    return {
        ...state,
        currentStudentsNumber: action.studentsNumber,
    };
}

function applyCurrentVideoLecture(state, action) {
    return {
        ...state,
        currentVideoLecture: action.currentVideoLecture,
    };
}

function applyUpdateLiveCounts(state, action) {
    return {
        ...state,
        currentVideoLecture: {
            ...state.currentVideoLecture,
            liveCounts: action.liveCounts,
        },
    };
}

/** Export action creators */
export { setStudentsNum, setCurrentVideoLecture, updateLiveCounts };

/** Export reducer */
export default RdxCurrentClass;
