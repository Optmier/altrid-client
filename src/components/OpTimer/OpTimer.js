import Axios from 'axios';
import { apiUrl } from '../../configs/configs';

export class OpTimer {
    /** Init
     * @param {number} classNum
     * @param {string} studentId
     */
    constructor(classNum, studentId) {
        this.classNum = classNum;
        this.timeSequenceBefore = null;
        this.timeSequenceAfter = null;
        this.elapsedTime = 0;
        this.intervalId = null;
        this.isPaused = false;
        if (localStorage.getItem('_optimer_saved') === null) localStorage.setItem('_optimer_saved', 0);
        const savedTime = parseInt(localStorage.getItem('_optimer_saved'));
        Axios.get(`${apiUrl}/optimer/${classNum}/${studentId}`, { withCredentials: true })
            .then((res) => {
                // 데이터가 없는 경우 새로 추가
                if (!res.data || !Object.keys(res.data).length) {
                    Axios.post(`${apiUrl}/optimer`, {}, { withCredentials: true })
                        .then((res) => {
                            if (savedTime) this.save();
                        })
                        .catch((err) => {
                            alert('레코드 추가 오류가 발생했습니다.');
                        });
                } else if (savedTime) this.save();
            })
            .catch((err) => {
                alert('학습시간 초기화 오류.');
            });
    }
    /** Start optimer */
    start() {
        if (this.intervalId === null) {
            this.timeSequenceBefore = new Date().getTime();
            this.timeSequenceAfter = new Date().getTime();
            this.intervalId = setInterval(() => {
                console.log(this.isPaused);
                this.timeSequenceAfter = new Date().getTime();
                if (!this.isPaused) {
                    this.elapsedTime += this.timeSequenceAfter - this.timeSequenceBefore;
                    console.log(this.elapsedTime);
                    localStorage.setItem('_optimer_saved', this.elapsedTime);
                }
                this.timeSequenceBefore = new Date().getTime();
            }, 500);
        }
    }
    /** Stop optimer */
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.elapsedTime = 0;
            this.intervalId = null;
            this.timeSequenceBefore = null;
            this.timeSequenceAfter = null;
            this.isPaused = false;
            localStorage.setItem('_optimer_saved', 0);
        }
    }
    /** Pause optimer */
    pause() {
        this.isPaused = true;
    }
    /** Resume optimer */
    resume() {
        this.isPaused = false;
    }
    /** Save */
    save() {
        const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        const dayCode = days[new Date().getDay()];
        const savedTime = parseInt(localStorage.getItem('_optimer_saved'));
        localStorage.setItem('_optimer_saved', 0);
        console.log(savedTime);
        // Axios call
        if (!savedTime) return;
        Axios.patch(
            `${apiUrl}/optimer`,
            {
                dayCode: dayCode,
                studyTime: savedTime,
            },
            { withCredentials: true },
        )
            .then((res) => console.log('Optimer >> saved success.'))
            .catch((err) => {
                alert('학습시간 저장에 실패했습니다.');
                console.error(err);
            });
    }
    /** Stop and save */
    stopAndSave() {
        this.save();
        this.stop();
    }
    /** Get optimer leaderboard */
    getLeaderBoard(callback = { onSuccess: (response) => {}, onFailure: (error) => {} }) {
        Axios.get(`${apiUrl}/optimer/${this.classNum}`, { withCredentials: true })
            .then((response) => callback.onSuccess(response))
            .catch((error) => callback.onFailure(error));
    }
}
