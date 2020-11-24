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
        margin-bottom: 10px;

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

function EyeTrackBox({ hasEyetrack, eyetrackData, contentsData, patternData, currentStudentDatas, totalStudentsDatas }) {
    const [trackTimeGoTo, setTrackTimeGoTo] = useState(0);
    const [fixations, setFixations] = useState('-');
    const [avgFixVels, setAvgFixVels] = useState('-');
    const [regressions, setRegressions] = useState('-');
    const [fixationsTotalAvg, setFixationsTotalAvg] = useState('-');
    const [avgFixDurTotalAvg, setAvgFixDurTotalAvg] = useState('-');
    const [regressionsTotalAvg, setRegressionsTotalAvg] = useState('-');
    // window.setTrackTimeGoTo = setTrackTimeGoTo;
    const handleGoTo = (time) => {
        // console.log(time);
        setTrackTimeGoTo(0);
        for (let i = 0; i < eyetrackData.sequences.length; i++) {
            if (eyetrackData.sequences[i].elapsedTime === time) {
                console.log('asdfasd', i);
                setTrackTimeGoTo(i);
                break;
            }
        }
    };

    useEffect(() => {
        if (!totalStudentsDatas || !totalStudentsDatas.length) return;
        if (!currentStudentDatas) return;
        const totalEyeStatsSum = totalStudentsDatas.reduce((a, b) => ({
            num_of_fixs: a.num_of_fixs + b.num_of_fixs,
            avg_of_fix_durs: a.avg_of_fix_durs + b.avg_of_fix_durs,
            avg_of_fix_vels: a.avg_of_fix_vels + b.avg_of_fix_vels,
            num_of_sacs: a.num_of_sacs + b.num_of_sacs,
            var_of_sac_vels: a.var_of_sac_vels + b.var_of_sac_vels,
            cluster_area: a.cluster_area + b.cluster_area,
            cluster_counts: a.cluster_counts + b.cluster_counts,
            num_of_regs: a.num_of_regs + b.num_of_regs,
        }));
        const totalEyeStatsAvg = {};
        Object.keys(totalEyeStatsSum).forEach((name) => {
            totalEyeStatsAvg[name] = (totalEyeStatsSum[name] / totalStudentsDatas.length) * 1.0;
        });
        setFixations(currentStudentDatas.num_of_fixs);
        setAvgFixVels(currentStudentDatas.avg_of_fix_vels);
        setRegressions(currentStudentDatas.num_of_regs);
        setFixationsTotalAvg(totalEyeStatsAvg.num_of_fixs.toFixed(0));
        setAvgFixDurTotalAvg(totalEyeStatsAvg.avg_of_fix_vels.toFixed(0));
        setRegressionsTotalAvg(totalEyeStatsAvg.num_of_regs.toFixed(0));
    }, [totalStudentsDatas]);

    return (
        <StyleEyeTrackBox>
            <div className="eyetrack-left" style={{ width: hasEyetrack ? '72%' : '72%' }}>
                {hasEyetrack ? (
                    <div className="eyetrack-header">
                        <div className="eyetrack-text">
                            <span className="eyetrack-title">총 응시점 개수</span>
                            {fixations}개 (평균 {fixationsTotalAvg}개)
                        </div>
                        <div className="eyetrack-text">
                            <span className="eyetrack-title">평균 응시 속도</span>
                            {avgFixVels}ms (평균 {avgFixDurTotalAvg}ms)
                        </div>
                        <div className="eyetrack-text">
                            <span className="eyetrack-title">재응시 횟수</span>
                            {regressions}회 (평균 {regressionsTotalAvg}회)
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
                {hasEyetrack && eyetrackData ? (
                    <EyetrackingPlayer data={eyetrackData} testContent={contentsData} goto={trackTimeGoTo} />
                ) : null}
            </div>

            <div className="eyetrack-right">
                <EyeTrackPattern data={patternData} hasEyetrack={hasEyetrack} onEyetrackGoTo={handleGoTo} />
            </div>
        </StyleEyeTrackBox>
    );
}

EyeTrackBox.defaultProps = {
    totalDatas: [],
};

export default EyeTrackBox;
