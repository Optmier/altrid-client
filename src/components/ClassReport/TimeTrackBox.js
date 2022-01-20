/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getColorSets } from '../../AltridUI/ThemeColors/ColorSets';
import Typography from '../../AltridUI/Typography/Typography';
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

const AnalyzeTimeTextsContainer = styled.div`
    background-color: #ffffff;
    border-radius: 8px;
    display: flex;
    padding: 48px 32px;
    @media (max-width: 640px) {
        padding: 32px 16px;
    }
`;
const AnalyzeTimeTextsSection = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    width: 50%;
    &.section1 {
        flex-basis: 282px;
        flex-grow: 1;
        flex-shrink: 0;
    }
    & div.altrid-typography.heading {
        color: ${getColorSets(400, 'purple')};
    }
    & div.altrid-typography.label {
        color: ${getColorSets(700, 'gray')};
        margin-top: 8px;
    }
    @media (max-width: 960px) {
        &.section1 {
            flex-basis: 240px;
        }
    }
    @media (max-width: 640px) {
        &.section1 {
            flex: initial;
        }
    }
`;
const AnalyzeTimeGraphContainer = styled.div`
    background-color: #ffffff;
    border-radius: 8px;
    display: flex;
    margin-top: 8px;
    padding: 24px;
    position: relative;
    @media (max-width: 640px) {
        padding: 12px;
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
        <>
            <AnalyzeTimeTextsContainer>
                <AnalyzeTimeTextsSection className="section1">
                    <Typography type="heading" size="m" bold>
                        {timeValueToTimer(arranged[0].time)} ({arranged[0].pid + 1}번)
                    </Typography>
                    <Typography type="label" size="l">
                        최장 소요시간(문제)
                    </Typography>
                </AnalyzeTimeTextsSection>
                <AnalyzeTimeTextsSection>
                    <Typography type="heading" size="m" bold>
                        {SecondtoMinute(personalAvg)[0]
                            ? SecondtoMinute(personalAvg)[0] + '분 ' + SecondtoMinute(personalAvg)[1] + '초'
                            : SecondtoMinute(personalAvg)[1] + '초'}
                    </Typography>
                    <Typography type="label" size="l">
                        문제당 평균 풀이시간
                    </Typography>
                </AnalyzeTimeTextsSection>
            </AnalyzeTimeTextsContainer>
            <AnalyzeTimeGraphContainer>
                {data ? <LineChartTime currents={data.map((d) => d.time)} averages={totalAvgs} totalProblems={totalProblems} /> : null}
            </AnalyzeTimeGraphContainer>
        </>
    );
}

export default TimeTrackBox;
