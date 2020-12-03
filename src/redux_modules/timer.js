/** 리덕스 타이머 Created by Sain Choi */
// Reference: https://www.youtube.com/watch?v=48abnvqAo60&list=PL7jH19IHhOLMKhZfOg7fj6gFX7Lbxpk7q&index=11&t=0s

/** Action types */
const START_TIMER = 'START_TIMER';
const RESTART_TIMER = 'RESTART_TIMER';
const ADD_SECOND = 'ADD_SECOND';
const JUMP_TO = 'JUMP_TO';

/** Action creator functions */
function startTimer(duration, startedTime, from) {
    return {
        type: START_TIMER,
        duration: duration,
        startedTime: startedTime,
        from: from,
    };
}

function restartTimer(duration, startedTime) {
    return {
        type: RESTART_TIMER,
        duration: duration,
        startedTime: startedTime,
    };
}

function addSecond() {
    return {
        type: ADD_SECOND,
    };
}

function jumpTo(timeTo) {
    return {
        type: JUMP_TO,
        timeTo: timeTo,
    };
}

/** Define initial states */
const initialState = {
    isPlaying: false,
    elapsedTime: 0,
    timerDuration: 5,
    startedTimeStamp: 0,
};

/** Reducer & functions */
function RdxTimer(state = initialState, action) {
    switch (action.type) {
        case START_TIMER:
            return applyStartTimer(state, action);
        case RESTART_TIMER:
            return applyRestartTimer(state, action);
        case ADD_SECOND:
            return applyAddSecond(state, action);
        case JUMP_TO:
            return applyJumpTo(state, action);
        default:
            return state;
    }
}

function applyStartTimer(state, action) {
    return {
        ...state,
        isPlaying: true,
        timerDuration: action.duration,
        startedTimeStamp: action.startedTime - (!action.from ? 0 : action.from * 1000),
        elapsedTime: !action.from ? 0 : action.from,
    };
}

function applyRestartTimer(state, action) {
    return {
        ...state,
        isPlaying: true,
        elapsedTime: 0,
        timerDuration: action.duration,
        startedTimeStamp: action.startedTime,
    };
}

function applyAddSecond(state) {
    if (state.timerDuration === 'no' || state.elapsedTime < state.timerDuration) {
        return {
            ...state,
            elapsedTime: parseInt((new Date().getTime() - state.startedTimeStamp) / 1000),
        };
    } else {
        return {
            ...state,
            isPlaying: false,
        };
    }
}

function applyJumpTo(state, action) {
    return {
        ...state,
        startedTimeStamp: state.startedTimeStamp - action.timeTo * 1000,
        elapsedTime: state.timerDuration > action.timeTo ? action.timeTo : state.timerDuration,
        isPlaying: state.timerDuration > action.timeTo ? state.isPlaying : false,
    };
}

/** Export action creators */
export { startTimer, restartTimer, addSecond, jumpTo };

/** Export reducer */
export default RdxTimer;
