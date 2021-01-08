import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';

const GreenCheckbox = withStyles({
    root: {
        '&$checked': {
            color: '#13E2A1',
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />);

function StepAgree({ agreeCheck, handleCheckChange }) {
    return (
        <div className="eyetrack-step-agree">
            <div className="eyetrack-step-header">아래 사항에 동의하시는지 확인해주세요.</div>
            <div className="contents-box">
                <div className="contents-title">
                    <div className="outline"></div>데이터 수집
                </div>
                <div className="contents-desc">
                    시선 추적 흐름 데이터 수집에 동의합니다. 시선흐름의 해당 좌표만 수집될 뿐, 고객님의 얼굴, 이미지 등은 녹화되지 않습니다.
                </div>
                <div className="contents-checkbox">
                    <GreenCheckbox checked={agreeCheck} onChange={handleCheckChange} name="checkedG" /> 데이터 수집에 동의합니다.
                </div>
            </div>
        </div>
    );
}

export default StepAgree;
