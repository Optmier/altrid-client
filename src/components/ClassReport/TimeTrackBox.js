import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import LineChartTime from '../essentials/LineChartTime';
import EyeTrackPattern from './EyeTrackPattern';

const pad = (n, width) => {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
};

const timeValueToTimer = (seconds) => {
    const secs = seconds < 0 ? 0 : seconds;
    if (seconds === -2) return '제한 없음';
    else return `${pad(parseInt(secs / 60), 1)}분 ${pad(Math.floor(secs % 60), 1)}초`;
};

const StyleTimeTrackBox = styled.div`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    background-color: white;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 11px;
    padding: 30px 32px;

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

function TimeTrackBox({ data, total }) {
    const [arranged, setArranged] = useState([{ pid: 0, time: 0 }]);
    const [totalAvgs, setTotalAvgs] = useState([]);

    useEffect(() => {
        if (!data || !data.length) return;
        setArranged(data.map((d) => d).sort((a, b) => b.time - a.time));
        const sums = {};
        const filtered = total.filter((data) => data.patternsGroupedByPid);
        filtered.forEach(({ patternsGroupedByPid }, i) => {
            patternsGroupedByPid.forEach((data) => {
                const cur = data.pid;
                !sums[cur] && (sums[cur] = 0);
                sums[cur] += data.time;
            });
        });
        setTotalAvgs(Object.keys(sums).map((k) => sums[k] / 2.0));
    }, [data]);

    return (
        <StyleTimeTrackBox>
            <div className="time-header">
                <div>최장 소요시간 문제</div> {arranged[0].pid + 1}번 ({timeValueToTimer(arranged[0].time)})
            </div>
            <LineChartTime currents={data.map((d) => d.time)} averages={totalAvgs} />
        </StyleTimeTrackBox>
    );
}

export default TimeTrackBox;
