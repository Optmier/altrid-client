import React, { useEffect } from 'react';

function StepCameraCheck({ setWebgazerLoaded }) {
    useEffect(() => {
        setWebgazerLoaded(false);
    }, []);
    return (
        <div className="eyetrack-step-camera">
            <div className="eyetrack-step-header">
                가이드 박스가 초록색이 되로록 얼굴을 위치시켜주세요. <br /> 과제 풀이 동안 이 위치를 유지해주세요.
            </div>
            <div className="contents-box"> </div>
        </div>
    );
}

export default StepCameraCheck;
