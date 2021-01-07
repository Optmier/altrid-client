import React, { useEffect } from 'react';

function StepCameraCheck({ setWebgazerLoaded }) {
    useEffect(() => {
        setWebgazerLoaded(false);
    }, []);
    return (
        <div className="eyetrack-step-camera">
            <div className="eyetrack-step-header">가이드 박스 안에 얼굴을 위치시켜주세요.</div>
            <div className="contents-box"> </div>
        </div>
    );
}

export default StepCameraCheck;
