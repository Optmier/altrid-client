import React from 'react';
import PreLogo from '../../images/eyetracker_logo/pre_logo.png';
import NewLogo from '../../images/eyetracker_logo/new_logo.png';

function StepHome() {
    return (
        <div className="eyetrack-step-home">
            <div className="eyetracker-header">
                이전에 사용한 보정이 있으시다면 <span>이전 보정 사용하기</span> 버튼을 <br />
                아직 체크하지 못하셨다면 <span>새 보정하기</span> 버튼을 눌러주세요.
            </div>
            <div className="eyetracker-buttons">
                <button className="button-left">
                    <img alt="pre" src={PreLogo} />
                    <div className="button-title">이전 보전 사용하기</div>
                    <div className="button-desc">
                        이전 과제 진행 시의 보정값을
                        <br /> 동일하게 사용하여 진행합니다.
                    </div>
                </button>
                <button className="button-right">
                    <img alt="new" src={NewLogo} />
                    <div className="button-title">이전 보전 사용하기</div>
                    <div className="button-desc">
                        이전 과제 진행 시의 보정값을 <br />
                        동일하게 사용하여 진행합니다.
                    </div>
                </button>
            </div>

            <div className="eyetracker-warn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18">
                    <g id="그룹_85" data-name="그룹 85" transform="translate(-471 -653)">
                        <circle id="타원_27" dataName="타원 27" cx="8" cy="8" r="8" transform="translate(471 655)" fill="#cc6565" />
                        <text
                            id="_"
                            dataName="!"
                            transform="translate(477 667)"
                            fill="#fff"
                            fontSize="12"
                            fontFamily="NotoSansCJKkr-Bold, Noto Sans CJK KR"
                            fontWeight="700"
                        >
                            <tspan x="0" y="0">
                                !
                            </tspan>
                        </text>
                    </g>
                </svg>
                이전 보정 사용 시, 환경변화로 인해 정확한 측정이 어려울 수 있습니다.
            </div>
        </div>
    );
}

export default StepHome;
