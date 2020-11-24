import React, { useCallback, useEffect, useRef, useState } from 'react';
import Axios from 'axios';
import SmartTOFELRender from '../components/TOFELRenderer/SmartTOFELRender';
import { variance } from 'mathjs';
import { apiUrl } from '../configs/configs';
import EyetrackerCore from '../components/essentials/EyetrackerCore';
import { useSelector, useDispatch } from 'react-redux';
import { startTimer, addSecond, jumpTo } from '../redux_modules/timer';
import { useBeforeunload } from 'react-beforeunload';

const getDistance = (pos1, pos2) => {
    const distX = Math.abs(pos1.x - pos2.x);
    const distY = Math.abs(pos1.y - pos2.y);
    return Math.sqrt(distX * distX + distY * distY);
};

const checkRange = (pos1, pos2, allowedOffset) => {
    return allowedOffset >= getDistance(pos1, pos2);
};

function AssignmentDoItNow({ history, match }) {
    const [remainTime, setRemainTime] = useState(null);
    const [originalDatas, setOriginalDatas] = useState({ eyetrack: 0, contents_data: null });
    const [savedData, setSavedData] = useState(undefined);
    const [activeStep, setActiveStep] = useState(0);
    const [userAnswer, setUserAnswer] = useState(0);
    const [timerInterval, setTimerInterval] = useState(null);

    /** Rdx timer */
    const timerState = useSelector((state) => state.RdxTimer);
    const dispatch = useDispatch();
    const handleStart = useCallback((duration, startedTime, from) => dispatch(startTimer(duration, startedTime, from)), [dispatch]);
    // const handleRestart = useCallback((duration, startedTime) => dispatch(restartTimer(duration, startedTime)), [dispatch]);
    const handleElapse = useCallback(() => dispatch(addSecond()), [dispatch]);

    const rootRef = useRef();

    const onAfterCalib = () => {
        upCountTries();
        if (originalDatas.eyetrack) {
            if (savedData === null) {
                startTestTimer(0);
            } else {
                setRemainTime(originalDatas.time_limit - savedData.time);
                startTestTimer(savedData.time);
            }
        } else {
            alert('데이터 구성이 잘못되었습니다.');
        }
    };

    const upCountTries = () => {
        Axios.patch(`${apiUrl}/assignment-result/tries`, { activedNumber: match.params.assignmentid }, { withCredentials: true })
            .then((res) => {
                // console.log(res);
            })
            .catch((err) => {
                alert('업데이트에 문제가 발생했습니다.');
                window.close();
                console.error(err);
            });
    };

    const updateResultData = (metadata, time, onSuccess) => {
        const userData = JSON.stringify(metadata);
        const eyetrackData = JSON.stringify(window.etRes);
        const activedNumber = match.params.assignmentid;
        /** 1. Total number of fixations */
        console.log('1. Total number of fixations : ' + window.numOfFixations);
        /** 2. Average of fixation durations */
        console.log('2. Average of fixation durations : ' + window.avgOfFixationDurations);
        /** 3. Average of fixation velocities */
        console.log('3. Average of fixation velocities : ' + window.avgOfFixationVelocities);
        /** 4. Total number of saccades */
        console.log('4. Total number of saccades : ' + window.numOfSaccades);
        /** 5. Variance of saccade velocities */
        console.log('*** Saccade velocities :: ' + window.saccadeVelocities);
        if (window.saccadeVelocities.length > 0) window.varOfSaccadeVelocities = variance(window.saccadeVelocities);
        console.log('5. Variance of saccade velocities : ' + window.varOfSaccadeVelocities);
        /** 6. Cluster area of fixations */
        console.log('6. Cluster area of fixations : ' + window.clusterAreaOfFixations);
        /** 7. Cluster counts of fixations */
        console.log('7. Cluster counts of fixations : ' + window.clusterCountsOfFixations);
        /** 8. Number of regressions */
        window.numberOfRegressions = 0;
        const eData = window.etRes.sequences;
        let accumDistCount = 0;
        let lastData = null;
        eData.forEach((data, idx) => {
            if (!lastData) lastData = data;
            const distance = getDistance(data, lastData);
            // console.log(distance);
            if (distance > 250) {
                accumDistCount++;
                let iter = 0;
                if (accumDistCount > 3) {
                    while (iter <= idx) {
                        if (checkRange(eData[iter], data, 10)) {
                            // console.log('regression!!!');
                            window.numberOfRegressions++;
                            accumDistCount = 0;
                            break;
                        }
                        iter++;
                    }
                }
            }
            lastData = data;
        });
        console.log('8. Number of regressions : ' + window.numberOfRegressions);
        console.log(metadata);

        const scorePercentage =
            (metadata.selections.filter((selection) => selection.correct === true).length /
                originalDatas.contents_data.flatMap((m) => m.problemDatas).length) *
            100.0;
        const scorePoints = metadata.selections.reduce((acc, cur) => acc + parseInt(cur.score), 0);
        console.log(scorePercentage, scorePoints);
        Axios.patch(
            `${apiUrl}/assignment-result`,
            {
                activedNumber: activedNumber,
                scorePercentage: scorePercentage,
                scorePoints: scorePoints,
                userData: userData,
                eyetrackData: eyetrackData,
                numOfFixs: window.numOfFixations,
                avgOfFixDurs: window.avgOfFixationDurations,
                avgOfFixVels: window.avgOfFixationVelocities,
                numOfSacs: window.numOfSaccades,
                varOfSacVels: window.varOfSaccadeVelocities,
                clusterArea: window.clusterAreaOfFixations,
                clusterCounts: window.clusterCountsOfFixations,
                numOfRegs: window.numberOfRegressions,
                time: time,
            },
            { withCredentials: true },
        )
            .then((res) => {
                // console.log(res);
                onSuccess(res);
            })
            .catch((err) => {
                console.error(err);
                alert('저장 에러가 발생하였습니다.\n증상이 지속될 경우 관리자에 문의 바랍니다.');
            });
    };

    const onEyetrackerUpdate = (data, elapsedTime) => {
        // if (elapsedTime / 1000 > originalDatas.time_limit + 1) return;
        // setRemainTime((remainTime) => {
        //     return Math.floor(originalDatas.time_limit - elapsedTime / 1000);
        // });
    };

    const onPrev = (step) => {
        setActiveStep(step);
    };

    const onNext = (step, time, metadata) => {
        // console.log(time);
        updateResultData(metadata, timerState.elapsedTime, () => {});
        setActiveStep(step);
    };

    const onUserAnswerChanged = (answer) => {
        // console.log(answer);
        setUserAnswer(answer);
    };

    const onEnd = (time, metadata) => {
        // console.log(time, metadata);
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        updateResultData(metadata, timerState.elapsedTime, () => {
            alert('종료되었습니다.');
            // window.close();
        });
    };

    const startTestTimer = (from, noDurOpt) => {
        if (!timerState.isPlaying) {
            handleStart(noDurOpt ? 'no' : originalDatas.time_limit, new Date().getTime(), from);
            const interval = setInterval(() => {
                handleElapse();
            }, 1000);
            setTimerInterval(interval);
        }
    };
    window.startTestTimer = startTestTimer;

    useEffect(() => {
        if (!window.opener) {
            alert('잘못된 접근입니다!');
            document.body.innerHTML = '';
            window.close();
            return;
        }

        const { classnum, assignmentid } = match.params;
        Axios.get(`${apiUrl}/assignment-actived/${classnum}/${assignmentid}`, { withCredentials: true })
            .then((res) => {
                // console.log(res);
                if (!res.data) {
                    alert('데이터가 없습니다!');
                    window.close();
                    return;
                }

                Axios.post(
                    `${apiUrl}/assignment-result`,
                    { activedNumber: res.data.idx, eyetrack: res.data.eyetrack },
                    { withCredentials: true },
                )
                    .then((res2) => {
                        // console.log(res2);
                        if (res2.data.savedData) {
                            const data = res2.data.savedData;
                            if (res.data.time_limit !== -2 && data.tries) {
                                alert('시도횟수를 초과하였습니다.\n문제가 발생한 경우 선생님께 문의 바랍니다.');
                                window.close();
                            }
                            let userData = data.user_data;
                            let eyetrackData = data.eyetrack_data;
                            try {
                                userData
                                    .replace(/\\n/g, '\\n')
                                    .replace(/\\'/g, "\\'")
                                    .replace(/\\"/g, '\\"')
                                    .replace(/\\&/g, '\\&')
                                    .replace(/\\r/g, '\\r')
                                    .replace(/\\t/g, '\\t')
                                    .replace(/\\b/g, '\\b')
                                    .replace(/\\f/g, '\\f')
                                    .replace(/[\u0000-\u0019]+/g, '');
                                userData = JSON.parse(userData);
                            } catch (e) {
                                userData = null;
                            }
                            try {
                                eyetrackData
                                    .replace(/\\n/g, '\\n')
                                    .replace(/\\'/g, "\\'")
                                    .replace(/\\"/g, '\\"')
                                    .replace(/\\&/g, '\\&')
                                    .replace(/\\r/g, '\\r')
                                    .replace(/\\t/g, '\\t')
                                    .replace(/\\b/g, '\\b')
                                    .replace(/\\f/g, '\\f')
                                    .replace(/[\u0000-\u0019]+/g, '');
                                eyetrackData = JSON.parse(eyetrackData);
                            } catch (e) {
                                eyetrackData = null;
                            }
                            setSavedData({ ...data, user_data: userData, eyetrack_data: eyetrackData });
                            if (!res.data.eyetrack) {
                                console.log('asdfasd');
                                upCountTries();
                            }
                        } else {
                            if (!res.data.eyetrack) {
                                console.log('asdfasd');
                                upCountTries();
                            }
                            setSavedData(null);
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                        alert('초기화 에러가 발생하였습니다.\n증상이 지속될 경우 관리자에 문의 바랍니다.');
                        window.close();
                    });

                let unparsedContents = res.data.contents_data
                    .replace(/\\n/g, '\\n')
                    .replace(/\\'/g, "\\'")
                    .replace(/\\"/g, '\\"')
                    .replace(/\\&/g, '\\&')
                    .replace(/\\r/g, '\\r')
                    .replace(/\\t/g, '\\t')
                    .replace(/\\b/g, '\\b')
                    .replace(/\\f/g, '\\f');
                // remove non-printable and other non-valid JSON chars
                unparsedContents = unparsedContents.replace(/[\u0000-\u0019]+/g, '');
                setOriginalDatas({ ...originalDatas, ...res.data, contents_data: JSON.parse(unparsedContents) });
                setRemainTime(res.data.time_limit);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    useEffect(() => {
        if (!originalDatas.contents_data) return;
        if (!originalDatas.eyetrack && originalDatas.time_limit === -2);
    }, [originalDatas]);

    useEffect(() => {
        if (!originalDatas.contents_data) return;
        // console.log(timerState.elapsedTime);
        if (originalDatas.time_limit !== -2) {
            setRemainTime(originalDatas.time_limit - timerState.elapsedTime);
        } else {
            setRemainTime(timerState.elapsedTime);
        }
    }, [timerState]);

    useEffect(() => {
        if (!originalDatas.eyetrack && savedData === null) {
            startTestTimer(0, originalDatas.time_limit === -2);
        }
        if (!savedData) return;
        if (!originalDatas.eyetrack && originalDatas.time_limit !== -2) {
            setRemainTime(originalDatas.time_limit - savedData.time);
            startTestTimer(savedData.time);
        } else if (originalDatas.time_limit === -2) {
            setRemainTime(0);
            startTestTimer(savedData.time, originalDatas.time_limit === -2);
        }

        if (originalDatas.eyetrack && savedData.eyetrack_data) {
            window.etRes = savedData.eyetrack_data;
            window._etNxtSetNum = window.etRes.sequences[window.etRes.sequences.length - 1].setNumber + 1;
        }
        if (originalDatas.eyetrack && savedData.user_data) {
            const logs = savedData.user_data.logs;
            setActiveStep(logs[logs.length - 1].pid);
            setUserAnswer(logs[logs.length - 1].answerAfter);
        }
    }, [savedData]);

    useBeforeunload((e) => e.preventDefault());

    return (
        <>
            {originalDatas.contents_data !== null && originalDatas.eyetrack && savedData !== undefined ? (
                <EyetrackerCore
                    timeElapsed={timerState.elapsedTime}
                    step={activeStep}
                    userAnswer={userAnswer}
                    onAfterCalib={onAfterCalib}
                    onUpdate={onEyetrackerUpdate}
                    rootRef={rootRef}
                />
            ) : null}

            {originalDatas.contents_data && remainTime !== null && savedData !== undefined && timerState.isPlaying ? (
                <div className="activity-root" ref={rootRef}>
                    <SmartTOFELRender
                        timer={remainTime}
                        timeLimit={originalDatas.time_limit}
                        title={originalDatas.contents_data.map((m) => m.title)}
                        passageForRender={originalDatas.contents_data.map((m) => m.passageForRender)}
                        problemDatas={originalDatas.contents_data.flatMap((m) => m.problemDatas)}
                        userDatas={savedData && savedData.user_data ? savedData.user_data : undefined}
                        onPrev={onPrev}
                        onNext={onNext}
                        onEnd={onEnd}
                        onUserAnswerChanged={onUserAnswerChanged}
                    />
                </div>
            ) : null}
        </>
    );
}

export default AssignmentDoItNow;
