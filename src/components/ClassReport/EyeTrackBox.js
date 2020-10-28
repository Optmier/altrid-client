import React from 'react';
import EyeTrackVideo from './EyeTrackVideo';
import styled from 'styled-components';
import EyeTrackPattern from './EyeTrackPattern';

const StyleEyeTrackBox = styled.div`
    height: 500px;
    display: flex;
    align-items: inherit;
    justify-content: space-between;

    & .eyetrack-left {
        box-sizing: border-box;
        background-color: white;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 11px;
        padding: 40px 32px;
    }
    & .eyetrack-right {
        width: 26%; //반응형 예정

        box-sizing: border-box;
        background-color: white;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 11px;
        padding: 40px 32px;
        overflow: auto;
    }

    & .eyetrack-header {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;

        & .eyetrack-text {
            font-size: 0.8rem;
            font-weight: 400;
            color: #706d6d;
            margin-right: 1.2rem;
            & .eyetrack-title {
                font-weight: 600;
                margin-right: 0.3rem;
            }
        }
    }
`;

function EyeTrackBox() {
    return (
        <StyleEyeTrackBox>
            <div className="eyetrack-left">
                <div className="eyetrack-header">
                    <div className="eyetrack-text">
                        <span className="eyetrack-title">총 응시점 개수</span>429개 (평균 400개)
                    </div>
                    <div className="eyetrack-text">
                        <span className="eyetrack-title">평균 응시 속도</span>1204ms (평균 1000ms)
                    </div>
                    <div className="eyetrack-text">
                        <span className="eyetrack-title">재응시 횟수</span>12회 (평균 10회)
                    </div>
                </div>

                <EyeTrackVideo />
            </div>

            <div className="eyetrack-right">
                <EyeTrackPattern />
            </div>
        </StyleEyeTrackBox>
    );
}

export default EyeTrackBox;
