import React from 'react';
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
                    시선흐름 관련해서 웹캠이 구동되며 과제 중에 실시간으로 기록됩니다. <br />
                    다만 시선의 위치 관련 데이터만 기록이 되며, 이 외의 데이터(얼굴, 소리, 이미지 등)는
                    <span style={{ fontWeight: 600 }}> 일절 수집하지 않음</span>을 알려드립니다. <br />
                    <br />
                    시선흐름 데이터 수집에 동의하십니까?
                </div>
                <div className="contents-checkbox">
                    <GreenCheckbox checked={agreeCheck} onChange={handleCheckChange} name="checkedG" /> 데이터 수집에 동의합니다.
                </div>
            </div>
        </div>
    );
}

export default StepAgree;
