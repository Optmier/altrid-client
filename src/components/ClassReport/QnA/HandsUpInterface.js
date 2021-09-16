import Axios from 'axios';
import { apiUrl } from '../../../configs/configs';

/** 선생님께 궁금한 문제 손들기
 * @param {object[]} problemDatas
 * @param {function} callback.onSuccess
 * @param {function} callback.onFailure
 */
const handsUpProblems = (problemDatas, callback = { onSuccess: (response) => {}, onFailure: (error) => {} }) => {
    const data = problemDatas.map((d) => Object.keys(d).map((e) => d[e]));
    Axios.post(`${apiUrl}/hands-up`, data, { withCredentials: true })
        .then((response) => {
            callback.onSuccess(response);
        })
        .catch((error) => {
            callback.onFailure(error);
        });
};

/** 손들기 취소
 * @param {string[]} problemIds
 * @param {function} callback.onSuccess
 * @param {function} callback.onFailure
 */
const deleteHandsUpProblems = (problemIds, callback = { onSuccess: (response) => {}, onFailure: (error) => {} }) => {
    Axios.delete(`${apiUrl}/hands-up`, { data: { problemIds: problemIds.map((id) => `'${id}'`).join(',') }, withCredentials: true })
        .then((response) => {
            callback.onSuccess(response);
        })
        .catch((error) => {
            callback.onFailure(error);
        });
};

/** 학생들이 손든 문제들 보기 (문제별로 그룹화 할 것!)
 * @param {number} assignmentNo
 * @param {function} callback.onSuccess
 * @param {function} callback.onFailure
 */
const getHandsUpFromStudents = (assignmentNo, callback = { onSuccess: (response) => {}, onFailure: (error) => {} }) => {
    Axios.get(`${apiUrl}/hands-up/${assignmentNo}`, { withCredentials: true })
        .then((response) => {
            callback.onSuccess(response);
        })
        .catch((error) => {
            callback.onFailure(error);
        });
};

/** 특정 학생(자신)이 손든 문제들 보기
 * @param {string} studentId
 * @param {number} assignmentNo
 * @param {function} callback.onSuccess
 * @param {function} callback.onFailure
 */
const getHandsUpProblems = (studentId, assignmentNo, callback = { onSuccess: (response) => {}, onFailure: (error) => {} }) => {
    Axios.get(`${apiUrl}/hands-up/${studentId}/${assignmentNo}`, { withCredentials: true })
        .then((response) => {
            callback.onSuccess(response);
        })
        .catch((error) => {
            callback.onFailure(error);
        });
};

/** 강사가 문제를 선택하는 기능
 * @param {string[]} problemIds
 */
const selectHansUpProblems = (problemIds) => {
    return Axios.patch(
        `${apiUrl}/hands-up/selected`,
        { selected: true, problemIds: problemIds.map((id) => `'${id}'`).join(',') },
        { withCredentials: true },
    );
};

/** 강사가 문제 선택을 해제하는 기능
 * @param {string[]} problemIds
 */
const unselectHandsUpProblems = (problemIds) => {
    return Axios.patch(
        `${apiUrl}/hands-up/selected`,
        { selected: false, problemIds: problemIds.map((id) => `'${id}'`).join(',') },
        { withCredentials: true },
    );
};

/** 강사가 선택한 문제 보기
 * @param {number} assignmentNo
 * @param {function} callback.onSuccess
 * @param {function} callback.onFailure
 */
const getSelectedHandsUpProblems = (assignmentNo, callback = { onSuccess: (response) => {}, onFailure: (error) => {} }) => {
    Axios.get(`${apiUrl}/hands-up/selected/${assignmentNo}`, { withCredentials: true })
        .then((response) => {
            callback.onSuccess(response);
        })
        .catch((error) => {
            callback.onFailure(error);
        });
};

export {
    handsUpProblems,
    deleteHandsUpProblems,
    getHandsUpFromStudents,
    getHandsUpProblems,
    selectHansUpProblems,
    unselectHandsUpProblems,
    getSelectedHandsUpProblems,
};
