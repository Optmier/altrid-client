import React, { useEffect, useState } from 'react';
import EyeTrackVideo from './EyeTrackVideo';
import styled from 'styled-components';
import EyeTrackPattern from './EyeTrackPattern';
import EyetrackingPlayer from '../TOFELRenderer/EyetrackingPlayer';

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
        padding: 30px 32px;
    }
    & .eyetrack-right {
        width: 26%; //반응형 예정

        box-sizing: border-box;
        background-color: white;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 11px;
        padding: 30px 32px;
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

function EyeTrackBox({ hasEyetrack, eyetrackData, contentsData, patternData }) {
    const [trackTimeGoTo, setTrackTimeGoTo] = useState(0);
    const handleGoTo = (time) => {
        setTrackTimeGoTo(time);
    };

    return (
        <StyleEyeTrackBox>
            <div className="eyetrack-left" style={{ width: hasEyetrack ? 'initial' : '72%' }}>
                {hasEyetrack ? (
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
                ) : (
                    <div className="eyetrack-header" style={{ height: '100%' }}>
                        <div
                            className="eyetrack-text"
                            style={{
                                height: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                width: '100%',
                                margin: 0,
                                alignItems: 'center',
                            }}
                        >
                            시선추적 미포함 과제입니다.
                        </div>
                    </div>
                )}
                {hasEyetrack ? <EyetrackingPlayer data={eyetrackData} testContent={contentsData} goto={trackTimeGoTo} /> : null}
            </div>

            <div className="eyetrack-right">
                <EyeTrackPattern data={patternData} hasEyetrack={hasEyetrack} onEyetrackGoTo={handleGoTo} />
            </div>
        </StyleEyeTrackBox>
    );
}

export default EyeTrackBox;
