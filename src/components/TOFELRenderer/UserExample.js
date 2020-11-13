import React, { useRef, useState } from 'react';
import EyetrackerCore from '../essentials/EyetrackerCore';
import SmartTOFELRender from './SmartTOFELRender';
import { variance } from 'mathjs';
import testData from '../../datas/contentsDataDummy.json';

const getDistance = (pos1, pos2) => {
    const distX = Math.abs(pos1.x - pos2.x);
    const distY = Math.abs(pos1.y - pos2.y);
    return Math.sqrt(distX * distX + distY * distY);
};

const checkRange = (pos1, pos2, allowedOffset) => {
    return allowedOffset >= getDistance(pos1, pos2);
};

function UserExample() {
    const [remainTime, setRemainTime] = useState(testData.timeLimit);
    const [activeStep, setActiveStep] = useState(0);
    const [userAnswer, setUserAnswer] = useState(0);
    const rootRef = useRef();

    const onAfterCalib = () => {
        console.log('started!');
    };

    const onEyetrackerUpdate = (data, elapsedTime) => {
        setRemainTime((remainTime) => {
            return testData.timeLimit - elapsedTime / 1000;
        });
        // console.log(data, elapsedTime / 1000);
    };

    const onPrev = (step) => {
        setActiveStep(step);
    };

    const onNext = (step) => {
        setActiveStep(step);
    };

    const onUserAnswerChanged = (answer) => {
        console.log(answer);
        setUserAnswer(answer);
    };

    const onEnd = (time, metadata) => {
        console.log(time, metadata);

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
    };
    return (
        <>
            {/* {console.log(remainTime)} */}
            {testData.timeLimit !== -2 ? (
                <EyetrackerCore
                    step={activeStep}
                    userAnswer={userAnswer}
                    onAfterCalib={onAfterCalib}
                    onUpdate={onEyetrackerUpdate}
                    rootRef={rootRef}
                />
            ) : null}
            <h2>시선 추적이 들어간 사용자 문제 예시 화면</h2>
            <div className="activity-root" ref={rootRef}>
                <SmartTOFELRender
                    timer={remainTime}
                    timeLimit={testData.timeLimit}
                    title={testData.title}
                    passageForRender={testData.passageForRender}
                    problemDatas={testData.problemDatas}
                    onPrev={onPrev}
                    onNext={onNext}
                    onEnd={onEnd}
                    onUserAnswerChanged={onUserAnswerChanged}
                />
            </div>
        </>
    );
}

export default UserExample;
