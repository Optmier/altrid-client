/** Action Types */
const SAVE_SESSION = 'SAVE_SESSION';
const UPDATE_SESSION = 'UPDATE_SESSION';
const REFRESH_SESSION = 'REFRESH_SESSION';
const DELETE_SESSION = 'DELETE_SESSION';

/** Action creator functions */
function saveSession(authId, userName, userType, academyCode, academyName, issuer, iat, exp, image) {
    return {
        type: SAVE_SESSION,
        authId: authId,
        userName: userName,
        userType: userType,
        academyCode: academyCode,
        academyName: academyName,
        issuer: issuer,
        iat: iat,
        exp: exp,
        image: image,
    };
}

function updateSession(updateStates) {
    return {
        type: UPDATE_SESSION,
        updateStates: updateStates,
    };
}

function refreshSession(exp) {
    return {
        type: REFRESH_SESSION,
        exp: exp,
    };
}

function deleteSession() {
    return {
        type: DELETE_SESSION,
    };
}

/** Define initial states */
const initStates = {
    authId: null,
    userName: null,
    userType: null,
    academyCode: null,
    academyName: null,
    issuer: null,
    iat: null,
    exp: null,
    image: null,
};

/** Reducer & functions */
function RdxSessions(state = initStates, action) {
    switch (action.type) {
        case SAVE_SESSION:
            return applySaveSession(state, action);
        case UPDATE_SESSION:
            return applyUpdateSession(state, action);
        case REFRESH_SESSION:
            return applyRefreshSession(state, action);
        case DELETE_SESSION:
            return applyDeleteSession(state, action);
        default:
            return state;
    }
}

function applySaveSession(state, action) {
    return {
        ...state,
        authId: action.authId,
        userName: action.userName,
        userType: action.userType,
        academyCode: action.academyCode,
        academyName: action.academyName,
        issuer: action.issuer,
        iat: action.iat,
        exp: action.exp,
        image: action.image,
    };
}

function applyUpdateSession(state, action) {
    return {
        ...state,
        ...action.updateStates,
    };
}

function applyRefreshSession(state, action) {
    return {
        ...state,
        exp: action.exp,
    };
}

function applyDeleteSession(state, action) {
    return {
        ...state,
        authId: null,
        userName: null,
        userType: null,
        academyCode: null,
        academyName: null,
        issuer: null,
        iat: null,
        exp: null,
    };
}

/** Export action creators */
export { saveSession, updateSession, refreshSession, deleteSession };

/** Export reducer */
export default RdxSessions;
