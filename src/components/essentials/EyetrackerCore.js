/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import * as $ from 'jquery';
import BackdropComponent2 from './BackdropComponent2';
import styled from 'styled-components';
import { buildMode } from '../../configs/configs';
import '../../styles/eyetracker_core.scss';
import StepHome from '../EyetrackerStep/StepHome';
import StepBox from '../EyetrackerStep/StepBox';
import StepAgree from '../EyetrackerStep/StepAgree';
import RightButton from '../../images/eyetracker_logo/right_button.png';
import LeftButton from '../../images/eyetracker_logo/left_button.png';
import StepCameraCheck from '../EyetrackerStep/StepCameraCheck';
import StepCalibrationInfo from '../EyetrackerStep/StepCalibrationInfo';
import StepCalibration from '../EyetrackerStep/StepCalibration';
import StepTestStart from '../EyetrackerStep/StepTestStart';

const SlideUl = styled.ul`
    margin-left: ${(props) => props.translateNum + '%'};
    width: calc(100% * 3);
    display: flex;
    transition: 0.4s;
`;
const SlideBtn = styled.img`
    cursor: pointer;
    width: 60px;
    position: absolute;
    top: 55%;

    &.slide-button-left {
        display: ${(props) => (props.translateNum >= -200 && props.translateNum <= -100 ? 'block' : 'none')};
        left: 18%;
    }
    &.slide-button-right {
        display: ${(props) => (props.translateNum >= -200 && props.translateNum <= 0 ? 'block' : 'none')};
        right: 18%;
    }
`;
const StepBtn = styled.button`
    margin-top: 40px;
    width: 125px;
    height: 45px;
    pointer-events: ${(props) => (props.stepBtnState ? 'auto' : 'none')};
    background-color: ${(props) => (props.stepBtnState ? '#13e2a1' : '#707070')};
    color: ${(props) => (props.stepBtnState ? 'white' : 'white')};
    box-shadow: 0px 3px 6px #00000029;
    border-radius: 11px;
    font-size: 0.9rem;
    font-weight: 600;
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
/** fixation ?????? */
window.numOfFixations = 0;
/** fixation duration ?????? ????????? */
window.avgOfFixationDurations = 0;
/** fixation ???????????? ?????????*/
window.avgOfFixationVelocities = 0;
/** saccade ?????? */
window.numOfSaccades = 0;
/** saccade ????????? */
window.saccadeVelocities = [];
/** saccade ???????????? ????????? */
window.varOfSaccadeVelocities = 0;
/** fixation ?????? ??????????????? ??? ??????(??? ????????? ????????? ??? ????????? ?????? ??????, ?????? ????????? ??????) */
window.clusterAreaOfFixations = 128;
/** fixation ????????? ???(??? ??? ?????? ????????? ????????? ??? ?????? ????????? ?????????) */
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
    //console.log(position, elapsedTime, precisionElapsedTime);
    // ?????? ????????? ??????
    const passageScrollPosition = $('.passages').length ? $('.passages')[0].scrollTop : 0;
    // ?????? ????????? ??????
    const problemScrollPosition = $('.problems').length ? $('.problems')[0].scrollTop : 0;
    // ????????? ?????? ??????
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
    // setNumber ??????
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
        // duration ??????
        if (position && seqs[seqs.length - 1].x === position.x && seqs[seqs.length - 1].y === position.y && _step === _lastStep) {
            _duration++;
        } else {
            _duration = 1;
        }
    }

    // ????????? ???????????? ???????????? ?????? ??????
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

function EyetrackerCore({ step, userAnswer, onChange, onAfterCalib, onStop, onUpdate, rootRef, timeElapsed, relative, skipCalib }) {
    _step = step;
    _userAnswer = userAnswer;
    _timeElapsed = timeElapsed;

    const [calibBtnDisabled, setCalibBtnDisabled] = useState(
        localStorage.getItem('eye_calibrated') && localStorage.getItem('eye_calibrated') === 'true' ? false : true,
    );
    const [stepBtnState, setStepBtnState] = useState(false);
    const [translateNum, setTranslateNum] = useState(calibBtnDisabled ? 100 : 200);
    const [agreeCheck, setAgreeCheck] = useState(false);
    const [calibrateState, setCalibrateState] = useState(false);

    const [start, setStart] = useState(false);
    const [webgazerLoded, setWebgazerLoaded] = useState(false);
    const [calib, setCalib] = useState(false);
    // const [calibBtnText, setCalibBtnText] = useState(
    //     localStorage.getItem('eye_calibrated') && localStorage.getItem('eye_calibrated') === 'true' ? '?????? ?????? ??????' : '?????? ??????',
    // );
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
        // setCalibBtnText('?????? ??????');
        setCalibBtnDisabled(true);
        Webgazer.clearData().then(() => {
            // setCalibBtnText('?????? ??????');
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
    // let lastFixation = {};
    // let lastSentIdx = -1;
    // let accumMovedDist = 0;
    // let accumMovedDistLastX = null;
    // let accumMovedDistLastY = null;
    // let distPointLastX = null;
    // let distPointLastY = null;
    let afterCalibAndStarted = false;
    // let startedTime = null;

    const updateTicker = (data, elapsedTime) => {
        //console.log(data, elapsedTime);
        if (!completedCalib) return;
        if (!afterCalibAndStarted) {
            afterCalibAndStarted = true;
            // startedTime = elapsedTime;
        }

        onUpdate(data, _timeElapsed, elapsedTime);

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

                // ??????????????? ?????? ?????? ????????????
                if (checkRange({ x: calcX, y: calcY }, { x: lastX, y: lastY }, window.clusterAreaOfFixations)) {
                    // ??????????????? ????????? ??????
                    clusterCounts++;
                    // ??????????????? ???????????? ?????? ?????? ???????????? ?????? ???????????? ???????????? duration ??? ??????
                    if (clusterCounts >= window.clusterCountsOfFixations) {
                        duration++;
                    } else if (clusterCounts < 1) {
                    } else {
                    }
                }
                // ??????????????? ?????? ?????? ????????????
                else {
                    // ?????? ?????? ???????????? 400px/s ???????????? saccade, ??? ???????????? fixation ?????? ???????????? ?????? ??????
                    const fixationVelocity = getVelocity(
                        { x: lastX, y: lastY },
                        { x: calcX, y: calcY },
                        Math.abs(elapsedTime - lastElapsedTime),
                    );
                    // ????????? 1280px/s ??????????????? saccade ??? ??????
                    // console.log(fixationVelocity);
                    if (fixationVelocity >= 1280) {
                        window.saccadeVelocities.push(fixationVelocity);
                        // saccade ??? ?????????
                        window.numOfSaccades++;
                    } else {
                        // ?????? fixation duration ??????
                        totalDuration += duration * 100;
                        // fixation duration ??? ????????? ????????????
                        window.avgOfFixationDurations = (totalDuration / window.numOfFixations) * 1.0;
                        // fixation ?????? ?????? ??????
                        totalFixationVelocity += fixationVelocity;
                        window.avgOfFixationVelocities = totalFixationVelocity / window.numOfFixations;
                        // fixation ?????? ?????????
                        window.numOfFixations++;
                    }
                    // ??????????????? ?????????, duration ?????????
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

    const cameraStart = () => {
        console.log('camera start!!!');
        if (start) return;

        setStart(true);
        if (localStorage.getItem('eye_calibrated') && localStorage.getItem('eye_calibrated') === 'true') {
            $(document).ready(() => {
                $('.calib-dots').addClass('ok');
            });
        }
        //
        setTimeout(() => {
            window.numOfFixations++;
            window.numOfSaccades++;

            Webgazer.setGazeListener(function (data, elapsedTime) {
                // if (data == null) {
                //     return;
                // }
                updateTicker(data, elapsedTime);
            }).begin();

            const check = setInterval(() => {
                try {
                    if (Webgazer.isReady()) {
                        Webgazer.showPredictionPoints(true);
                        $('#webgazerVideoFeed').css({ 'z-index': 99999, top: 'calc(50% - 110px)', left: 'calc(50% - 160px)' });
                        $('#webgazerVideoCanvas').css({ 'z-index': 99999, top: 'calc(50% - 110px)', left: 'calc(50% - 160px)' });
                        $('#webgazerFaceOverlay').css({ 'z-index': 99999, top: 'calc(50% - 110px)', left: 'calc(50% - 160px)' });
                        $('#webgazerFaceFeedbackBox').css({
                            'z-index': 99999,
                            top: 'calc(50% - 71px)',
                            left: 'calc(50% - 79.2px)',
                        });

                        if (
                            $('#webgazerVideoFeed').length &&
                            $('#webgazerVideoCanvas').length &&
                            $('#webgazerFaceOverlay').length &&
                            $('#webgazerFaceFeedbackBox').length
                        ) {
                            if (!localStorage.getItem('eye_calibrated') || localStorage.getItem('eye_calibrated') === 'false') {
                                Webgazer.clearData();
                                Webgazer.removeMouseEventListeners();
                                console.log("Webgaze cleared data because you didn't calibrate complete.");
                            }
                            console.log('all loaded!');

                            setWebgazerLoaded((webgazerLoaded) => true);
                            // const backCvs = backCanvas.current;
                            //const ctx = backCvs.getContext('2d');
                            // makeDots(ctx);
                            clearInterval(check);
                        }
                        //
                    }
                } catch (error) {
                    console.error(error);
                }
            }, 500);
        }, 1000);
    };

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

    useEffect(() => {
        if (!start) return;
        let allCalibrated = true;
        Object.keys(calibDotCounts).forEach((key) => {
            if (calibDotCounts[key] < 20) {
                allCalibrated = false;
                return;
            }
        });
        if (allCalibrated) {
            localStorage.setItem('eye_calibrated', true);
            alert('?????? ?????????????????????!');

            setCalibBtnDisabled(false);
            setTranslateNum(translateNum - 100);
        } else {
            localStorage.setItem('eye_calibrated', false);
        }
    }, [calibDotCounts]);

    //??????,????????? ?????? ?????????
    const handleSlide = (e) => {
        const { name } = e.target;

        name === 'right' ? setTranslateNum(translateNum - 100) : setTranslateNum(translateNum + 100);
        // ????????? ???????????? ????????? ??????
        if (translateNum === -200) {
            //????????? ?????? ??????
            cameraStart();
        }
    };
    //?????? ?????? ?????? ?????????
    const handleComplete = (e) => {
        // ?????? ?????? ?????? ??????
        if (translateNum === 200) {
            if (calibrateState === 'new') {
                restartCalibration();
                setTranslateNum(translateNum - 100);
                setStepBtnState(false);
            } else if (calibrateState === 'pre') {
                //?????? ????????? ?????? !!
                setTranslateNum(-300);
                cameraStart();
            }
        }

        // ????????? ?????? ?????? ??????
        else if (translateNum === 100) {
            setTranslateNum(translateNum - 100);
        }
        // ????????? ?????? ??????
        else if (translateNum === -300) {
            if (calibBtnDisabled) {
                setTranslateNum(translateNum - 100);
            } else {
                setTranslateNum(-600);
            }

            $('#webgazerVideoFeed').css({ opacity: '0', 'z-index': '-1' });
            $('#webgazerVideoCanvas').css({ opacity: '0', 'z-index': '-1' });
            $('#webgazerFaceOverlay').css({ opacity: '0', 'z-index': '-1' });
            $('#webgazerFaceFeedbackBox').css({ opacity: '0', 'z-index': '-1' });
        }
        // ???????????? ?????? ??????
        else if (translateNum === -400) {
            setTranslateNum(translateNum - 100);
        }
        // ????????????  ??????
        else if (translateNum === -500) {
            setTranslateNum(translateNum - 100);
        }
        // ?????? ?????? ??????
        else if (translateNum === -600) {
            setTranslateNum(translateNum - 100);
            executeCalibration();
        } else {
            return 0;
        }
    };
    //?????? ?????? ?????? ?????????
    const handleCalibration = (e) => {
        const { name } = e.target;
        setCalibrateState(name);
        setStepBtnState(true);
    };
    //????????? ?????? ?????? ?????????
    const handleCheckChange = (e) => {
        setAgreeCheck(e.target.checked);
        setStepBtnState(e.target.checked);
    };

    useEffect(() => {
        if (webgazerLoded && skipCalib) {
            setTranslateNum(translateNum - 100);
            executeCalibration();
        }
        console.log(webgazerLoded);
    }, [webgazerLoded]);

    useEffect(() => {
        if (skipCalib) {
            cameraStart();
        }
        return () => {
            try {
                Webgazer.end();
            } catch (e) {
                console.warn(e);
            }
        };
    }, []);

    return (
        <>
            {translateNum === -700 ? null : (
                <>
                    <BackdropComponent2 disableShrink open={start && !webgazerLoded} />
                    <div className="eyetrackerCore-root">
                        {translateNum === 200 ? (
                            <StepHome handleCalibration={handleCalibration} />
                        ) : translateNum === 100 ? (
                            <StepAgree agreeCheck={agreeCheck} handleCheckChange={handleCheckChange} />
                        ) : translateNum >= -200 && translateNum <= 0 ? (
                            <div className="eyetrackerCore-wrapper">
                                <SlideBtn
                                    translateNum={translateNum}
                                    alt="btn"
                                    name="left"
                                    className="slide-button-left"
                                    src={LeftButton}
                                    onClick={handleSlide}
                                />
                                <SlideBtn
                                    translateNum={translateNum}
                                    alt="btn"
                                    name="right"
                                    className="slide-button-right"
                                    src={RightButton}
                                    onClick={handleSlide}
                                />
                                <div style={{ marginLeft: '25%' }} className="eyetrack-step-header">
                                    ????????? ????????? ?????? ?????? ????????? ???????????? ?????? ?????? ???????????? ??????????????????.
                                </div>
                                <SlideUl translateNum={translateNum}>
                                    <li>
                                        <StepBox num="01" />
                                    </li>
                                    <li>
                                        <StepBox num="02" />
                                    </li>
                                    <li>
                                        <StepBox num="03" />
                                    </li>
                                </SlideUl>
                            </div>
                        ) : translateNum === -300 ? (
                            <StepCameraCheck setWebgazerLoaded={setWebgazerLoaded} />
                        ) : translateNum === -400 ? (
                            <StepCalibrationInfo />
                        ) : translateNum === -500 ? (
                            <StepCalibration
                                onCalibDotClick={onCalibDotClick}
                                onCalibDotHover={onCalibDotHover}
                                onCalibDotLeave={onCalibDotLeave}
                                calibDotCounts={calibDotCounts}
                                relative={relative}
                            />
                        ) : translateNum === -600 ? (
                            <StepTestStart />
                        ) : (
                            ''
                        )}
                        <div className="eyetrack-step-button">
                            {(translateNum >= -200 && translateNum <= 0) || translateNum === -500 ? (
                                ''
                            ) : (
                                <StepBtn className="zIndexBtn" name="right" onClick={handleComplete} stepBtnState={stepBtnState}>
                                    {translateNum >= -600 && translateNum <= -400 ? '????????????' : '?????? ??????'}
                                </StepBtn>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default React.memo(EyetrackerCore);
