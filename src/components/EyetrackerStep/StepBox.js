import React from 'react';
import FaceLocation from '../../images/eyetracker_logo/face_location.png';
import CameraAngle from '../../images/eyetracker_logo/camera_angle.png';
import SpaceCondition from '../../images/eyetracker_logo/space_condition.png';

const stepDatas = {
    '01': {
        title: 'FACE LOCATION',
        desc1: '얼굴 전체가 카메라 화면',
        desc2: '안에 들어오도록 해주세요.',
        img: FaceLocation,
    },
    '02': {
        title: 'SPACE CONDITION',
        desc1: '조명이 밝은 장소에서',
        desc2: '시선 보정을 해주세요.',
        img: SpaceCondition,
    },
    '03': {
        title: 'CAMERA ANGLE',
        desc1: '과제 도중 카메라 각도가 크게',
        desc2: '벗어나지 않도록 유지해주세요.',
        img: CameraAngle,
    },
};
function StepBox({ num }) {
    return (
        <div className="eyetrack-step-info">
            <div className="eyetrack-step-header">정확한 분석을 위해 문제 풀이가 진행되는 동안 아래 사항들을 유의해주세요.</div>
            <div className="contents-box">
                <div className="contents-box-left">
                    <div className="contents-title">
                        <div className="outline"></div>
                        {num}
                        <div className="contents-title-text">{stepDatas[num]['title']}</div>
                    </div>
                    <div className="contents-desc">
                        <div>{stepDatas[num]['desc1']}</div>
                        <div>{stepDatas[num]['desc2']}</div>
                    </div>
                </div>
                <div className="contents-box-right">
                    <img src={stepDatas[num]['img']} alt="step_logo" />
                </div>
            </div>
        </div>
    );
}

export default StepBox;
