import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import LineChartTime from '../essentials/LineChartTime';
import { SecondtoMinute } from '../essentials/TimeChange';

const pad = (n, width) => {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
};

const timeValueToTimer = (seconds) => {
    const secs = seconds < 0 ? 0 : seconds;
    if (seconds === -2) return '제한 없음';
    else return `${pad(parseInt(secs / 60), 1)}분 ${pad(Math.floor(secs % 60), 1)}초`;
};

const StyleTimeTrackWrapper = styled.div`
    display: flex;
    flex-direction: column;

    & .time-box {
        display: flex;
        align-items: center;

        & .time-header-col {
            width: 50%;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 1.18rem;
            font-weight: 500;
            color: #707070;
            & .purple-time {
                font-weight: bold;
                font-size: 48px;
                line-height: 52px;
                text-align: center;
                color: #6c46a1;
                margin-bottom: 8px;
            }
            & .subtitle {
                font-weight: normal;
                font-size: 16px;
                line-height: 20px;
                text-align: center;
                letter-spacing: -0.02em;
                color: #11171c;
            }
            & > div {
                color: black;
                margin-right: 1.5rem;
            }
        }

        & .time-header-col + .time-header-col {
            border-left: #7070704e 1px solid;
            padding-left: 32px;
        }
    }

    & .time-box + .time-box {
        margin-top: 24px;
    }

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

function TimeTrackBox({ data, total, totalProblems }) {
    const [arranged, setArranged] = useState([{ pid: 0, time: 0 }]);
    const [totalAvgs, setTotalAvgs] = useState([]);
    const [personalAvg, setPersonalAvg] = useState(0);

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
        setTotalAvgs(Object.keys(sums).map((k) => (sums[k] / filtered.length).toFixed(1)));
        setPersonalAvg(
            Math.round(
                data
                    .map((d) => d.time)
                    .reduce((sum, currValue) => {
                        return sum + currValue;
                    }, 0) / data.length,
            ),
        );
    }, [data]);

    return (
        <StyleTimeTrackWrapper>
            <div className="white-box time-box">
                <div className="time-header-col">
                    <div className="purple-time">
                        {timeValueToTimer(arranged[0].time)} ({arranged[0].pid + 1}번)
                    </div>

                    <div className="subtitle">최장 소요시간(문제)</div>
                </div>
                <div className="time-header-col">
                    <div className="purple-time">
                        {SecondtoMinute(personalAvg)[0]
                            ? SecondtoMinute(personalAvg)[0] + '분 ' + SecondtoMinute(personalAvg)[1] + '초'
                            : SecondtoMinute(personalAvg)[1] + '초'}
                    </div>
                    <div className="subtitle">문제당 평균 풀이시간</div>
                </div>
            </div>
            <div className="white-box time-box">
                {data ? <LineChartTime currents={data.map((d) => d.time)} averages={totalAvgs} totalProblems={totalProblems} /> : null}
            </div>
        </StyleTimeTrackWrapper>
    );
}

export default TimeTrackBox;
