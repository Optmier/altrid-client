import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import RadarChart from '../essentials/RadarChart';
import ColumnChart from '../essentials/ColumnChart';

const StyleStudentTypeScore = styled.div`
    box-sizing: border-box;
    background-color: white;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 10px;
    padding: 30px 32px;
    width: 100%;
    box-sizing: border-box;
    overflow: auto;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    & .chart-right {
        width: 40%;
    }

    & .chart-right {
        width: 60%;
    }
`;

function StudentTypeScore({ current, total }) {
    return (
        <StyleStudentTypeScore>
            <div className="chart-left">
                <RadarChart objDatas={current} />
            </div>
            <div className="chart-right">
                <ColumnChart currentObjs={current} averageObjs={total} />
            </div>
        </StyleStudentTypeScore>
    );
}

export default StudentTypeScore;
