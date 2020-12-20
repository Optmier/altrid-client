import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import EyeTrackPattern from './EyeTrackPattern';
import EyetrackingPlayer from '../TOFELRenderer/EyetrackingPlayer';
import { Tooltip } from '@material-ui/core';
import TooltipCard from '../essentials/TooltipCard';

const StyleEyeTrackBox = styled.div`
    height: 500px;
    display: flex;
    align-items: inherit;
    justify-content: space-between;

    & .eyetrack-left {
        box-sizing: border-box;
        background-color: white;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 10px;
        padding: 30px 32px;
    }
    & .eyetrack-right {
        width: 26%; //반응형 예정

        box-sizing: border-box;
        background-color: white;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 10px;
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

    & .eyetrack-header-more {
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
    }
    & .eyetrack-header-more:hover {
        margin-right: -5px;
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
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                        <a
                            href="https://www.notion.so/optmier/07bd3c8f53ac4e449242cda7eccdcb4e"
                            target="_blank"
                            className="eyetrack-header-more"
                        >
                            <TooltipCard
                                title={
                                    <div>
                                        응시에 대해서 알고싶으신가요? <br /> 이곳을 클릭해주세요 :)
                                    </div>
                                }
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="11" viewBox="0 0 30.414 11">
                                    <path
                                        id="icon"
                                        d="M0 0h28l-8.27 8.27"
                                        fill="none"
                                        stroke="#706d6d"
                                        strokeWidth="3px"
                                        transform="translate(0 1)"
                                    ></path>
                                </svg>
                            </TooltipCard>
                        </a>
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
