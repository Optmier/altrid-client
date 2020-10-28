import React from 'react';
import styled from 'styled-components';
import LineChartTime from '../essentials/LineChartTime';
import EyeTrackPattern from './EyeTrackPattern';

const StyleTimeTrackBox = styled.div`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    background-color: white;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 11px;
    padding: 40px 32px;

    & .time-header {
        width: 100%;
        text-align: right;
        display: flex;
        justify-content: flex-end;
        color: #706d6d;
        font-size: 14px;
        font-weight: 400;

        & > div {
            font-weight: 600;
            margin-right: 1rem;
        }
    }
`;

function TimeTrackBox() {
    return (
        <StyleTimeTrackBox>
            <div className="time-header">
                <div>최장 소요시간 문제</div> 9번 (5:19)
            </div>

            <LineChartTime />
        </StyleTimeTrackBox>
    );
}

export default TimeTrackBox;
