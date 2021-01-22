import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import EyeTrackPattern from './EyeTrackPattern';
import EyetrackingPlayer from '../TOFELRenderer/EyetrackingPlayer';
import { Tooltip } from '@material-ui/core';
import TooltipCard from '../essentials/TooltipCard';
import { apiUrl } from '../../configs/configs';
import Axios from 'axios';

const StyleEyeTrackBox = styled.div`
    display: flex;
    flex-direction: column;

    & .eyetrack-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 18px;

        & .eyetrack-left {
            width: 72%;
            height: 470px;
            box-sizing: border-box;
            background-color: white;
            border-radius: 11px;
            padding: 0 32px;
            display: flex;
            align-items: center;

            & .no-eyetrack {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
                font-weight: 500;
            }
        }
        & .eyetrack-right {
            width: 26%;
            box-sizing: border-box;
            background-color: white;
            border-radius: 11px;
            padding: 30px 32px;
            overflow-y: auto;
            height: 470px;
        }
    }
`;

function EyeTrackBox({
    hasEyetrack,
    eyetrackData,
    contentsData,
    patternData,
    currentStudentDatas,
    totalStudentsDatas,
    activedNum,
    userId,
    stdName,
    answerChangedProblems,
    aftChangedFaileds,
}) {
    const [trackTimeGoTo, setTrackTimeGoTo] = useState(0);
    const [fixations, setFixations] = useState('-');
    const [avgFixVels, setAvgFixVels] = useState('-');
    const [regressions, setRegressions] = useState('-');
    const [fixationsTotalAvg, setFixationsTotalAvg] = useState('-');
    const [avgFixDurTotalAvg, setAvgFixDurTotalAvg] = useState('-');
    const [regressionsTotalAvg, setRegressionsTotalAvg] = useState('-');
    const [mEyetrackData, setEyetrackData] = useState(eyetrackData);
    window.setEyetrackData = setEyetrackData;
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
        Axios.get(`${apiUrl}/assignment-result/eyetrack-data/${parseInt(activedNum)}`, {
            params: {
                userId: userId,
            },
            withCredentials: true,
        })
            .then((res) => {
                if (res.data) {
                    let unparsedEyetrackData = res.data.eyetrack_data;
                    let parsedData = null;
                    try {
                        unparsedEyetrackData
                            .replace(/\\n/g, '\\n')
                            .replace(/\\'/g, "\\'")
                            .replace(/\\"/g, '\\"')
                            .replace(/\\&/g, '\\&')
                            .replace(/\\r/g, '\\r')
                            .replace(/\\t/g, '\\t')
                            .replace(/\\b/g, '\\b')
                            .replace(/\\f/g, '\\f')
                            .replace(/[\u0000-\u0019]+/g, '');
                        parsedData = JSON.parse(unparsedEyetrackData);
                        setEyetrackData(parsedData);
                    } catch (error) {
                        unparsedEyetrackData = null;
                    }
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

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
            <div className="white-box ment-ai">
                <div className="ment-ai-col">
                    <div>
                        <span className="ment-ai-name">{stdName}</span> 학생은 풀이 중 <br />
                    </div>
                    <div>
                        <span className="ment-ai-underline">총 {answerChangedProblems}문제</span>에서 답 변경 후, <br />
                    </div>
                    <div>
                        <span className="ment-ai-underline">{aftChangedFaileds}문제</span>가 오답 처리되었습니다.
                    </div>
                </div>
                <div className="ment-ai-col">
                    <div className="ment-ai-row">
                        <span className="row-title">총 응시점 개수</span>
                        <TooltipCard title={`${fixations}개 (평균 ${fixationsTotalAvg}개)`}>
                            <span className="row-desc">
                                {fixations}개 (평균 {fixationsTotalAvg}개)
                            </span>
                        </TooltipCard>
                    </div>
                    <div className="ment-ai-row">
                        <span className="row-title">평균 응시 속도</span>

                        <TooltipCard title={`${avgFixVels}ms (평균 ${avgFixDurTotalAvg}ms)`}>
                            <span className="row-desc">
                                {avgFixVels}ms (평균 {avgFixDurTotalAvg}ms)
                            </span>
                        </TooltipCard>
                    </div>
                    <div className="ment-ai-row">
                        <span className="row-title">재응시 횟수</span>

                        <TooltipCard title={`${regressions}회 (평균 ${regressionsTotalAvg}회)`}>
                            <span className="row-desc">
                                {regressions}회 (평균 {regressionsTotalAvg}회)
                            </span>
                        </TooltipCard>
                    </div>
                </div>
            </div>

            <div className="eyetrack-box">
                <div className="eyetrack-left" style={{ width: hasEyetrack ? '72%' : '72%' }}>
                    {hasEyetrack && mEyetrackData ? (
                        <EyetrackingPlayer data={mEyetrackData} testContent={contentsData} goto={trackTimeGoTo} />
                    ) : (
                        <div className="no-eyetrack">
                            <svg id="Warning" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                <path
                                    id="패스_35"
                                    data-name="패스 35"
                                    d="M8,0a8,8,0,1,0,8,8A8.024,8.024,0,0,0,8,0ZM9.1,12.2H6.9V10.3H9.2v1.9Zm.1-7.4L8.6,9.2H7.4L6.8,4.8v-1H9.3v1Z"
                                    fill="#605f60"
                                />
                            </svg>
                            시선 추적이 포함되지 않은 과제입니다.
                        </div>
                    )}
                </div>

                <div className="eyetrack-right">
                    <EyeTrackPattern data={patternData} hasEyetrack={hasEyetrack} onEyetrackGoTo={handleGoTo} />
                </div>
            </div>
        </StyleEyeTrackBox>
    );
}

EyeTrackBox.defaultProps = {
    totalDatas: [],
};

export default EyeTrackBox;
