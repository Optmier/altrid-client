import Axios from 'axios';
import * as configs from '../../configs/config.json';

export class OpTimer {
    /** Init
     * @param {string} studentId
     */
    constructor(studentId) {
        console.log('init optimer...');
        this.classNum = 0;
        this.studentId = studentId;
        this.timeSequenceBefore = null;
        this.timeSequenceAfter = null;
        this.elapsedTime = 0;
        this.intervalId = null;
        this.isPaused = false;
        this.isStarted = false;
        if (localStorage.getItem('_optimer_saved') === null) localStorage.setItem('_optimer_saved', 0);
        if (localStorage.getItem('_optimer_saved_classNum') === null) localStorage.setItem('_optimer_saved_classNum', 0);
        if (localStorage.getItem('_optimer_saved_studentId') === null) localStorage.setItem('_optimer_saved_studentId', '');
        const savedTime = parseInt(localStorage.getItem('_optimer_saved'));
        const savedClassNum = parseInt(localStorage.getItem('_optimer_saved_classNum'));
        const savedStudentId = localStorage.getItem('_optimer_saved_studentId');
        // 임시로 저장된 타임과 클래스 번호가 있는 경우에만 서버에 저장
        if (!savedTime || !savedClassNum || studentId !== savedStudentId) return;
        Axios.get(`${configs.SERVER_HOST}/optimer/${savedClassNum}/${studentId}`, { withCredentials: true })
            .then((res) => {
                // 데이터가 없는 경우 새로 추가
                if (!res.data || !Object.keys(res.data).length) {
                    Axios.post(`${configs.SERVER_HOST}/optimer`, { classNum: savedClassNum }, { withCredentials: true })
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
    /** update class number */
    updateClassNumber(classNum) {
        if (classNum === this.classNum) return;
        this.classNum = classNum;
        Axios.get(`${configs.SERVER_HOST}/optimer/${this.classNum}/${this.studentId}`, { withCredentials: true })
            .then((res) => {
                // 데이터가 없는 경우 새로 추가
                if (!res.data || !Object.keys(res.data).length) {
                    Axios.post(`${configs.SERVER_HOST}/optimer`, { classNum: this.classNum }, { withCredentials: true })
                        .then((res) => {
                            // if (savedTime) this.save();
                        })
                        .catch((err) => {
                            alert('레코드 추가 오류가 발생했습니다.');
                        });
                }
                // else if (savedTime) this.save();
            })
            .catch((err) => {
                alert('학습시간 초기화 오류.');
            });
    }
    /** Start optimer */
    start() {
        if (!this.classNum) {
            console.warn('클래스 번호 없음! 옵타이머 비활성화 됨.');
            return;
        }
        if (this.intervalId === null) {
            this.timeSequenceBefore = new Date().getTime();
            this.timeSequenceAfter = new Date().getTime();
            if (!this.isStarted) this.isStarted = true;
            this.intervalId = setInterval(() => {
                this.timeSequenceAfter = new Date().getTime();
                if (!this.isPaused) {
                    this.elapsedTime += this.timeSequenceAfter - this.timeSequenceBefore;
                    localStorage.setItem('_optimer_saved', this.elapsedTime);
                    if (localStorage.getItem('_optimer_saved_classNum') !== this.classNum)
                        localStorage.setItem('_optimer_saved_classNum', this.classNum);
                    if (localStorage.getItem('_optimer_saved_studentId') !== this.studentId)
                        localStorage.setItem('_optimer_saved_studentId', this.studentId);
                }
                this.timeSequenceBefore = new Date().getTime();
            }, 500);
        }
    }
    /** Stop optimer */
    stop() {
        if (!this.classNum) {
            console.warn('클래스 번호 없음! 옵타이머 비활성화 됨.');
            return;
        }
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.elapsedTime = 0;
            this.classNum = 0;
            this.intervalId = null;
            this.timeSequenceBefore = null;
            this.timeSequenceAfter = null;
            this.isPaused = false;
            this.isStarted = false;
            localStorage.setItem('_optimer_saved', 0);
            localStorage.setItem('_optimer_saved_classNum', 0);
            localStorage.setItem('_optimer_saved_studentId', '');
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
        const savedClassNum = parseInt(localStorage.getItem('_optimer_saved_classNum'));
        const savedStudentId = localStorage.getItem('_optimer_saved_studentId');
        localStorage.setItem('_optimer_saved', 0);
        localStorage.setItem('_optimer_saved_classNum', 0);
        localStorage.setItem('_optimer_saved_studentId', '');
        console.log(savedTime);
        console.log(savedClassNum);
        console.log(savedStudentId);
        if (!savedTime || !savedClassNum) return;
        // Axios call
        if (!savedTime) return;
        Axios.patch(
            `${configs.SERVER_HOST}/optimer`,
            {
                dayCode: dayCode,
                studyTime: savedTime,
                classNum: savedClassNum,
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
        Axios.get(`${configs.SERVER_HOST}/optimer/${this.classNum}`, { withCredentials: true })
            .then((response) => callback.onSuccess(response))
            .catch((error) => callback.onFailure(error));
    }
}
