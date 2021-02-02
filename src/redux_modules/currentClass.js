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

function setCurrentVideoLectures(obj) {
    return {
        type: SET_CURRENT_VIDEO_LECTURE,
        currentVideoLectures: obj,
    };
}

function updateLiveCounts(roomId, num) {
    return {
        type: UPDATE_LIVE_COUNTS,
        roomId: roomId,
        liveCounts: num,
    };
}

/** Define initial states */
const initialState = {
    currentStudentsNumber: 0,
    currentVideoLectures: {
        current: [],
        scheduled: [],
        done: [],
    },
};

/** Reducer & functions */
function RdxCurrentClass(state = initialState, action) {
    switch (action.type) {
        case SET_STUDENTS_NUM:
            return applyStudentsNumber(state, action);
        case SET_CURRENT_VIDEO_LECTURE:
            return applyCurrentVideoLectures(state, action);
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

function applyCurrentVideoLectures(state, action) {
    return {
        ...state,
        currentVideoLectures: action.currentVideoLectures,
    };
}

function applyUpdateLiveCounts(state, action) {
    return {
        ...state,
        currentVideoLectures: {
            ...state.currentVideoLectures,
            current: state.currentVideoLectures.current.map((d, i) =>
                d.room_id === action.roomId ? { ...d, liveCounts: action.liveCounts } : d,
            ),
        },
    };
}

/** Export action creators */
export { setStudentsNum, setCurrentVideoLectures, updateLiveCounts };

/** Export reducer */
export default RdxCurrentClass;
