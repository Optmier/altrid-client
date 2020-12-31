import React from 'react';

function StepCalibrationInfo() {
    return (
        <div className="eyetrack-step-cali-info">
            <div className="eyetrack-step-header" style={{ textAlign: 'center' }}>
                시선 보정 단계입니다.
                <br /> 화면에 나타나는 원이 초록색이 될 때까지 클릭해주세요.
            </div>
        </div>
    );
}

export default StepCalibrationInfo;
