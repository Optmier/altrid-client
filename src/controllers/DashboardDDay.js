import Axios from 'axios';
import { apiUrl } from '../configs/configs';

// interface DashboardDDayInterface {
//     save(callback): void;
//     fetch(callback): void;
// }

export default class DashboardDDay {
    constructor(classNumber, afterInitCallback = function (resultsMessage: string, response: object) {}) {
        this.classNumber = classNumber;
        this.fetch((checkMsg, checkRes) => {
            if (checkMsg === 'success') {
                if (!checkRes.data) {
                    this.init((initMsg, initRes) => {
                        afterInitCallback(initMsg, null);
                    });
                } else {
                    afterInitCallback(checkMsg, checkRes.data);
                }
            } else {
                console.error(checkRes);
            }
        });
    }
    init(callback = function (resultMessage: string, response: object) {}) {
        Axios.post(`${apiUrl}/personal-settings/my/${this.classNumber}/dday`, { value: '' }, { withCredentials: true })
            .then((res) => {
                callback('success', res);
            })
            .catch((err) => {
                callback('falied', err);
            });
    }
    save(dateStr, callback = function (resultMessage: string, response: object) {}) {
        Axios.patch(`${apiUrl}/personal-settings/my/${this.classNumber}/dday`, { value: dateStr }, { withCredentials: true })
            .then((res) => {
                callback('success', res);
            })
            .catch((err) => {
                callback('falied', err);
            });
    }
    fetch(callback = function (resultMessage: string, response: object) {}) {
        Axios.get(`${apiUrl}/personal-settings/my/${this.classNumber}/dday`, { withCredentials: true })
            .then((res) => {
                callback('success', res);
            })
            .catch((err) => {
                callback('failed', err);
            });
    }
}
