import React, { useEffect, useState } from 'react';
import * as $ from 'jquery';
import { Button, Dialog } from '@material-ui/core';
import { useRef } from 'react';
import BackdropComponent from './BackdropComponent';
import styled from 'styled-components';
import { buildMode } from '../../configs/configs';
import '../../styles/eyetracker_core.scss';
import StepHome from '../EyetrackerStep/StepHome';
import StepBox from '../EyetrackerStep/StepBox';
import StepAgree from '../EyetrackerStep/StepAgree';

const Assistance = styled.div``;
const CalibDot = styled.div`
    background-color: #ffff00;
    border: 2px solid black;
    border-radius: 50%;
    box-sizing: border-box;
    position: absolute;
    width: 20px;
    height: 20px;
    cursor: pointer;

    &.top-left {
        top: 12px;
        left: 12px;
    }

    &.top-center {
        top: 12px;
        left: calc(50% - 10px);
    }

    &.top-right {
        top: 12px;
        right: 12px;
    }

    &.middle-left {
        top: calc(50% - 10px);
        left: 12px;
    }

    &.middle-center {
        top: calc(50% - 10px);
        left: calc(50% - 10px);
    }

    &.middle-right {
        top: calc(50% - 10px);
        right: 12px;
    }

    &.bottom-left {
        bottom: 12px;
        left: 12px;
    }

    &.bottom-center {
        bottom: 12px;
        left: calc(50% - 10px);
    }

    &.bottom-right {
        bottom: 12px;
        right: 12px;
    }

    &:hover {
        background-color: #dada00;
    }

    &.ok {
        background-color: #00ac75;
        pointer-events: none;
    }
`;
const SlideUl = styled.ul`
    margin-left: ${(props) => props.translateNum + '%'};
    width: calc(100% * 4);
    display: flex;
    transition: 0.4s;
`;

/** Webgazer configuration */
const Webgazer = window.webgazer;
window.applyKalmanFilter = true;
window.saveDataAcrossSessions = true;

/** Eyetracking data configuration */
// const eyetrackingResults = {
//     sequences: [],
// };
window.etRes = {
    sequences: [],
};

/** Eyetracking statistics set */
/** fixation 개수 */
window.numOfFixations = 0;
/** fixation duration 들의 평균값 */
window.avgOfFixationDurations = 0;
/** fixation 속도들의 평균값*/
window.avgOfFixationVelocities = 0;
/** saccade 개수 */
window.numOfSaccades = 0;
/** saccade 속도들 */
window.saccadeVelocities = [];
/** saccade 속도들의 분산값 */
window.varOfSaccadeVelocities = 0;
/** fixation 들을 클러스터링 할 영역(이 영역에 들어올 시 동일한 좌표 출력, 원을 키우기 위함) */
window.clusterAreaOfFixations = 128;
/** fixation 카운트 값(이 값 만큼 영역에 들어올 시 원이 커지기 시작함) */
window.clusterCountsOfFixations = 3;
/** 8. Number of regressions */
window.numberOfRegressions = 0;

window.$ = $;
window._etNxtSetNum = 0;

let completedCalib = false;
let setnum = 0 + window._etNxtSetNum;
let tickerTimeout = null;
let _step = 0;
let _lastStep = 0;
let _userAnswer = 0;
let _duration = 1;
let _timeElapsed = 0;

const getDistance = (pos1, pos2) => {
    const distX = Math.abs(pos1.x - pos2.x);
    const distY = Math.abs(pos1.y - pos2.y);
    return Math.sqrt(distX * distX + distY * distY);
};

const checkRange = (pos1, pos2, allowedOffset) => {
    return allowedOffset >= getDistance(pos1, pos2);
};

const captureChanged = (position, elapsedTime, precisionElapsedTime) => {
    console.log(position, elapsedTime, precisionElapsedTime);
    // 지문 스크롤 위치
    const passageScrollPosition = $('.passages').length ? $('.passages')[0].scrollTop : 0;
    // 문제 스크롤 위치
    const problemScrollPosition = $('.problems').length ? $('.problems')[0].scrollTop : 0;
    // 데이터 구조 정의
    const _obj = {
        code: '',
        problemStep: 0,
        userAnswer: 0,
        setNumber: 0,
        x: 0,
        y: 0,
        value: 0,
        passageScrollPosition: 0,
        problemScrollPosition: 0,
        elapsedTime: 0,
        eyetrackTime: 0,
    };
    // setNumber 지정
    const seqs = window.etRes.sequences;
    if (seqs[seqs.length - 1]) {
        if (position === null) {
            if (_step !== _lastStep || seqs[seqs.length - 1].x || seqs[seqs.length - 1].y) {
                setnum++;
            }
        } else {
            if (_step !== _lastStep || seqs[seqs.length - 1].x !== position.x || seqs[seqs.length - 1].y !== position.y) {
                setnum++;
            }
        }
        // duration 계산
        if (position && seqs[seqs.length - 1].x === position.x && seqs[seqs.length - 1].y === position.y && _step === _lastStep) {
            _duration++;
        } else {
            _duration = 1;
        }
    }

    // 위치가 포착되지 않았으면 경고 기록
    if (!position) {
        _obj.code = 'out-of-range';
        _obj.problemStep = _step;
        _obj.userAnswer = _userAnswer;
        _obj.setNumber = setnum;
        _obj.x = null;
        _obj.y = null;
        _obj.value = 0;
        _obj.passageScrollPosition = passageScrollPosition;
        _obj.problemScrollPosition = problemScrollPosition;
        _obj.elapsedTime = elapsedTime;
        _obj.eyetrackTime = precisionElapsedTime;
    } else {
        _obj.problemStep = _step;
        _obj.userAnswer = _userAnswer;
        _obj.setNumber = setnum;
        _obj.x = position.x;
        _obj.y = position.y;
        _obj.value = _duration;
        _obj.passageScrollPosition = passageScrollPosition;
        _obj.problemScrollPosition = problemScrollPosition;
        _obj.elapsedTime = elapsedTime;
        _obj.eyetrackTime = precisionElapsedTime;
    }
    window.etRes.sequences.push(_obj);
    _lastStep = _step;
};

function EyetrackerCore({ step, userAnswer, onChange, onAfterCalib, onStop, onUpdate, rootRef, timeElapsed }) {
    _step = step;
    _userAnswer = userAnswer;
    _timeElapsed = timeElapsed;
    const [stepNum, setStepNum] = useState(0);
    const [translateNum, setTranslateNum] = useState(-200);
    const [agreeCheck, setAgreeCheck] = useState(false);

    const [start, setStart] = useState(false);
    const [webgazerLoded, setWebgazerLoaded] = useState(false);

    const [calib, setCalib] = useState(false);
    const [calibBtnText, setCalibBtnText] = useState(
        localStorage.getItem('eye_calibrated') && localStorage.getItem('eye_calibrated') === 'true' ? '이전 보정 사용' : '보정 완료',
    );
    const [calibDotCounts, setCalibDotCounts] = useState({
        top_left: 0,
        top_center: 0,
        top_right: 0,
        middle_left: 0,
        middle_center: 0,
        middle_right: 0,
        bottom_left: 0,
        bottom_center: 0,
        bottom_right: 0,
    });
    const [calibBtnDisabled, setCalibBtnDisabled] = useState(
        localStorage.getItem('eye_calibrated') && localStorage.getItem('eye_calibrated') === 'true' ? false : true,
    );

    const backCanvas = useRef();

    const executeCalibration = () => {
        setCalib(true);
        completedCalib = true;
        Webgazer.removeMouseEventListeners();
        Webgazer.setVideoViewerSize(0, 0);
        if (buildMode === 'prod') Webgazer.showPredictionPoints(false);
        onAfterCalib();
    };

    window.manualcalib = executeCalibration;

    const restartCalibration = () => {
        setWebgazerLoaded(false);
        setCalibDotCounts({
            top_left: 0,
            top_center: 0,
            top_right: 0,
            middle_left: 0,
            middle_center: 0,
            middle_right: 0,
            bottom_left: 0,
            bottom_center: 0,
            bottom_right: 0,
        });
        $('.calib-dots').removeClass('ok');
        localStorage.setItem('eye_calibrated', false);
        setCalibBtnText('보정 완료');
        setCalibBtnDisabled(true);
        Webgazer.clearData().then(() => {
            setCalibBtnText('보정 완료');
            setTimeout(() => {
                setWebgazerLoaded(true);
            }, 500);
        });
    };

    const getVelocity = (pos1, pos2, diffTime) => {
        // const distX = Math.abs(pos1.x - pos2.x);
        // const distY = Math.abs(pos1.y - pos2.y);
        // const dist = Math.sqrt(distX * distX + distY * distY);
        // const toSecondDivide = 1 / diffTime;

        // return dist / diffTime / toSecondDivide;
        const distX = Math.abs(pos1.x - pos2.x);
        const distY = Math.abs(pos1.y - pos2.y);
        const dist = Math.sqrt(distX * distX + distY * distY);
        const toSecondDivide = diffTime / 1000;

        return dist / toSecondDivide || 0;
    };

    let clusterCounts = 0;
    let duration = 0;
    let totalDuration = 0;
    let totalFixationVelocity = 0;
    let lastX = null;
    let lastY = null;
    let lastElapsedTime = null;
    let lastFixation = {};
    let lastSentIdx = -1;
    let accumMovedDist = 0;
    let accumMovedDistLastX = null;
    let accumMovedDistLastY = null;
    let distPointLastX = null;
    let distPointLastY = null;
    let afterCalibAndStarted = false;
    let startedTime = null;

    const updateTicker = (data, elapsedTime) => {
        console.log(data, elapsedTime);
        if (!completedCalib) return;
        if (!afterCalibAndStarted) {
            afterCalibAndStarted = true;
            // startedTime = elapsedTime;
        }
        onUpdate(data, _timeElapsed);

        if (!tickerTimeout)
            tickerTimeout = setTimeout(() => {
                if (!data) {
                    // console.log('22 out of range! not recorded.');
                    captureChanged(null, _timeElapsed, elapsedTime);
                    tickerTimeout = null;
                    return;
                }

                const calcX = parseInt(data.x);
                const calcY = parseInt(data.y);

                if (lastX === null) lastX = calcX;
                if (lastY === null) lastY = calcY;
                if (lastElapsedTime === null) lastElapsedTime = elapsedTime;

                // 클러스터링 영역 안에 들어오면
                if (checkRange({ x: calcX, y: calcY }, { x: lastX, y: lastY }, window.clusterAreaOfFixations)) {
                    // 클러스터링 카운트 증가
                    clusterCounts++;
                    // 클러스터링 카운트가 최소 조건 만족하면 같은 영역으로 간주하여 duration 값 증가
                    if (clusterCounts >= window.clusterCountsOfFixations) {
                        duration++;
                    } else if (clusterCounts < 1) {
                    } else {
                    }
                }
                // 클러스터링 영역 밖을 벗어나면
                else {
                    // 먼저 속도 판별하여 400px/s 이상이면 saccade, 그 미만이면 fixation 으로 구분지어 계산 수행
                    const fixationVelocity = getVelocity(
                        { x: lastX, y: lastY },
                        { x: calcX, y: calcY },
                        Math.abs(elapsedTime - lastElapsedTime),
                    );
                    // 속도가 1280px/s 이상이므로 saccade 로 간주
                    // console.log(fixationVelocity);
                    if (fixationVelocity >= 1280) {
                        window.saccadeVelocities.push(fixationVelocity);
                        // saccade 로 카운팅
                        window.numOfSaccades++;
                    } else {
                        // 이전 fixation duration 합산
                        totalDuration += duration * 100;
                        // fixation duration 의 평균값 업데이트
                        window.avgOfFixationDurations = (totalDuration / window.numOfFixations) * 1.0;
                        // fixation 들의 속도 평균
                        totalFixationVelocity += fixationVelocity;
                        window.avgOfFixationVelocities = totalFixationVelocity / window.numOfFixations;
                        // fixation 으로 카운팅
                        window.numOfFixations++;
                    }
                    // 클러스터링 카운트, duration 초기화
                    clusterCounts = 0;
                    duration = 0;
                    lastX = calcX;
                    lastY = calcY;
                }

                lastElapsedTime = elapsedTime;

                // console.log(lastX, lastY);
                captureChanged({ x: lastX, y: lastY }, _timeElapsed, elapsedTime);

                tickerTimeout = null;
            }, 100);
    };

    // useEffect(() => {
    //     if (!start) {
    //         setStart(true);
    //         if (localStorage.getItem('eye_calibrated') && localStorage.getItem('eye_calibrated') === 'true') {
    //             $(document).ready(() => {
    //                 $('.calib-dots').addClass('ok');
    //             });
    //         }
    //         //
    //         setTimeout(() => {
    //             window.numOfFixations++;
    //             window.numOfSaccades++;

    //             Webgazer.setGazeListener(function (data, elapsedTime) {
    //                 // if (data == null) {
    //                 //     return;
    //                 // }
    //                 updateTicker(data, elapsedTime);
    //             }).begin();

    //             const check = setInterval(() => {
    //                 try {
    //                     if (Webgazer.isReady()) {
    //                         Webgazer.showPredictionPoints(true);
    //                         $('#webgazerVideoFeed').css({ 'z-index': 99999, top: 'calc(50% - 304px)', left: 'calc(50% - 160px)' });
    //                         $('#webgazerVideoCanvas').css({ 'z-index': 99999, top: 'calc(50% - 304px)', left: 'calc(50% - 160px)' });
    //                         $('#webgazerFaceOverlay').css({ 'z-index': 99999, top: 'calc(50% - 304px)', left: 'calc(50% - 160px)' });
    //                         $('#webgazerFaceFeedbackBox').css({
    //                             'z-index': 99999,
    //                             top: 'calc(50% - 263.2px)',
    //                             left: 'calc(50% - 79.2px)',
    //                         });

    //                         if (
    //                             $('#webgazerVideoFeed').length &&
    //                             $('#webgazerVideoCanvas').length &&
    //                             $('#webgazerFaceOverlay').length &&
    //                             $('#webgazerFaceFeedbackBox').length
    //                         ) {
    //                             if (!localStorage.getItem('eye_calibrated') || localStorage.getItem('eye_calibrated') === 'false') {
    //                                 Webgazer.clearData();
    //                                 Webgazer.removeMouseEventListeners();
    //                                 console.log("Webgaze cleared data because you didn't calibrate complete.");
    //                             }
    //                             console.log('all loaded!');
    //                             setWebgazerLoaded((webgazerLoaded) => true);
    //                             const backCvs = backCanvas.current;
    //                             const ctx = backCvs.getContext('2d');
    //                             // makeDots(ctx);
    //                             clearInterval(check);
    //                         }
    //                         //
    //                     }
    //                 } catch (error) {
    //                     console.error(error);
    //                 }
    //             }, 500);
    //         }, 1000);
    //     } else {
    //     }
    // }, [start]);

    // useEffect(() => {
    //     return () => {
    //         try {
    //             Webgazer.end();
    //         } catch (e) {
    //             console.warn(e);
    //         }
    //     };
    // }, []);

    const onCalibDotClick = ({ target }) => {
        const type = target['dataset'].type;
        // console.log(type);
        setCalibDotCounts((calibDotCounts) => {
            const state = {
                ...calibDotCounts,
                [type]: calibDotCounts[type] + 1,
            };
            if (calibDotCounts[type] >= 19) {
                $(target).addClass('ok');
            }
            return state;
        });
    };

    const onCalibDotHover = () => {
        // console.log('calib dot hovered');
        Webgazer.addMouseEventListeners();
    };

    const onCalibDotLeave = () => {
        // console.log('calib dot leaved');
        Webgazer.removeMouseEventListeners();
    };

    window.dots = calibDotCounts;

    // useEffect(() => {
    //     if (!start) return;
    //     let allCalibrated = true;
    //     Object.keys(calibDotCounts).forEach((key) => {
    //         if (calibDotCounts[key] < 20) {
    //             allCalibrated = false;
    //             return;
    //         }
    //     });
    //     if (allCalibrated) {
    //         localStorage.setItem('eye_calibrated', true);
    //         setCalibBtnDisabled(false);
    //     } else {
    //         localStorage.setItem('eye_calibrated', false);
    //     }
    // }, [calibDotCounts]);

    const handleStep = () => {
        setStepNum(stepNum + 1);
        setTranslateNum(-100);
    };
    const handleCheckChange = (e) => {
        setAgreeCheck(e.target.checked);
    };
    return (
        <>
            {/* <BackdropComponent disableShrink open={!webgazerLoded} /> */}
            <div className="eyetrackerCore-root">
                <div className="eyetrackerCore-wrapper">
                    <SlideUl translateNum={translateNum}>
                        <li>
                            <StepHome />
                        </li>
                        <li>
                            <StepAgree agreeCheck={agreeCheck} handleCheckChange={handleCheckChange} />
                        </li>
                        <li>
                            <StepBox step={1} />
                        </li>
                        <li>
                            <StepBox step={2} />
                        </li>
                    </SlideUl>
                </div>
                <div className="eyetrack-step-button">
                    <button onClick={handleStep} className="eyetracker-footer">
                        확인 완료
                    </button>
                </div>
            </div>
        </>
    );
}

export default React.memo(EyetrackerCore);
