/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-control-regex */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import EyeTrackPattern from './EyeTrackPattern';
import EyetrackingPlayer from '../TOFELRenderer/EyetrackingPlayer';
import { AccordionDetails, AccordionSummary, withStyles } from '@material-ui/core';
import * as configs from '../../configs/config.json'
import Axios from 'axios';
import { useSelector } from 'react-redux';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Accordion from '@material-ui/core/Accordion';
import Typography from '../../AltridUI/Typography/Typography';
import { getColorSets } from '../../AltridUI/ThemeColors/ColorSets';
import ReportWarningTags, { LimitFuncWrapper } from './ReportStudent/ReportWarningTags';

const Playerset = styled.div`
    /* width: 950px; */
    box-sizing: border-box;
    width: 100%;
    /* padding: 0px 100px 0px 0px; */
`;
const EyetrackVideoAccordion = withStyles((theme) => ({
    root: {
        backgroundColor: '#ffffff00',
        border: 'none',
        width: '100%',
    },
}))(Accordion);
const EyetrackVideoAccordionSummary = withStyles((theme) => ({
    root: {},
}))(AccordionSummary);
const EyetrackVideoAccordionDetails = withStyles((theme) => ({
    root: {},
}))(AccordionDetails);
const EyetrackVideoContainer = styled.div`
    background-color: #ffffff;
    border-radius: 8px;
    display: flex;
    min-height: 32px;
    padding: 16px;
    position: relative;
    @media (max-width: 640px) {
        padding: 0;
    }
`;
const EyetrackTextsContainer = styled.div`
    background-color: #ffffff;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    margin-top: 8px;
    min-height: 28px;
    padding: 32px;
    position: relative;
    @media (max-width: 640px) {
        align-items: center;
        flex-direction: column;
        padding: 16px;
    }
`;
const EyetrackTextsWrapper = styled.div`
    display: inline-flex;
    padding: 0 16px;
    position: relative;
    &:first-child {
        padding-left: 0;
    }
    &:last-child {
        padding-right: 0;
    }
    & + &::before {
        content: '';
        border-left: 1px solid ${getColorSets(200, 'gray')};
        position: absolute;
        height: 40%;
        left: 0;
        top: 30%;
    }
    @media (max-width: 640px) {
        padding: 0;
        & + & {
            margin-top: 4px;
        }
        & + &::before {
            content: none;
        }
    }
`;
const EyetrackTextsItem = styled.div`
    align-items: center;
    display: flex;
`;
const EyetrackTextsItemKey = styled.div`
    color: ${getColorSets(700, 'gray')};
    text-align: center;
`;
const EyetrackTextsItemValue = styled.div`
    color: ${getColorSets(500, 'purple')};
    margin-left: 4px;
`;
const PatternsContainer = styled.div`
    background-color: #ffffff;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    margin-top: 8px;
    height: 288px;
    @media (max-width: 640px) {
        flex-direction: column;
        height: initial;
    }
`;
const PatternTextsContainer = styled.div`
    align-items: center;
    box-shadow: inset -1px 0px 0px #e9edef;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 50%;
    height: 100%;
    & div.altrid-typography {
        & span {
            background-color: ${getColorSets(50, 'purple')};
            border-radius: 8px;
            color: ${getColorSets(500, 'purple')};
            margin: -2px 0;
            padding: 2px 4px;
        }
        & + div.altrid-typography {
            margin-top: 6px;
        }
    }
    @media (max-width: 640px) {
        box-shadow: inset 0px -1px 0px #e9edef;
        padding: 38px;
        width: calc(100% - 76px);
    }
`;
const PatternListsContainer = styled.div`
    display: flex;
    width: 50%;
    @media (max-width: 640px) {
        width: 100%;
        height: 240px;
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

    const { eyetrack } = useSelector((state) => state.planInfo.restricted);
    const { userType } = useSelector((state) => state.RdxSessions);

    // window.mEyetrackData = mEyetrackData;
    // window.setTrackTimeGoTo = setTrackTimeGoTo;
    const handleGoTo = (time) => {
        // console.log(time);
        setTrackTimeGoTo(() => 0);
        for (let i = 0; i < mEyetrackData.sequences.length; i++) {
            if (mEyetrackData.sequences[i].elapsedTime === time) {
                setTrackTimeGoTo(() => i);
                break;
            }
        }
    };

    useEffect(() => {
        Axios.get(`${configs.SERVER_HOST}/assignment-result/eyetrack-data/${parseInt(activedNum)}`, {
            params: {
                userId: userId,
            },
            withCredentials: true,
        })
            .then((res) => {
                // console.log(res);
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
        // setchart({
        //     ...chart,
        //     series: [
        //         {
        //             name: '학생',
        //             data: [currentStudentDatas.num_of_fixs, currentStudentDatas.num_of_fix_vels, currentStudentDatas.num_of_regs],
        //         },
        //         {
        //             name: '평균',
        //             data: [
        //                 totalEyeStatsAvg.num_of_fixs.toFixed(0),
        //                 totalEyeStatsAvg.avg_of_fix_vels.toFixed(0),
        //                 totalEyeStatsAvg.num_of_regs.toFixed(0),
        //             ],
        //         },
        //     ],
        // });
    }, [totalStudentsDatas]);

    return (
        // 시선 추적 영상
        <>
            <EyetrackVideoContainer>
                {hasEyetrack && mEyetrackData ? (
                    <EyetrackVideoAccordion elevation={0}>
                        <EyetrackVideoAccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                            <Typography type="label" size="xl" bold>
                                시선흐름 분석영상 보기
                            </Typography>
                        </EyetrackVideoAccordionSummary>
                        <EyetrackVideoAccordionDetails>
                            <Playerset>
                                <EyetrackingPlayer data={mEyetrackData} testContent={contentsData} goto={trackTimeGoTo} />
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
                            </Playerset>
                        </EyetrackVideoAccordionDetails>
                    </EyetrackVideoAccordion>
                ) : (
                    <LimitFuncWrapper>
                        <ReportWarningTags title="시선 추적 미포함 과제" />
                    </LimitFuncWrapper>
                )}
            </EyetrackVideoContainer>
            <EyetrackTextsContainer>
                {hasEyetrack && mEyetrackData ? (
                    <>
                        <EyetrackTextsWrapper>
                            <EyetrackTextsItem>
                                <EyetrackTextsItemKey>
                                    <Typography type="label" size="xxl" bold>
                                        총 응시점 개수
                                    </Typography>
                                </EyetrackTextsItemKey>
                                <EyetrackTextsItemValue>
                                    <Typography type="label" size="xxl" bold>
                                        {fixations}개
                                    </Typography>
                                </EyetrackTextsItemValue>
                            </EyetrackTextsItem>
                        </EyetrackTextsWrapper>
                        <EyetrackTextsWrapper>
                            <EyetrackTextsItem>
                                <EyetrackTextsItemKey>
                                    <Typography type="label" size="xxl" bold>
                                        평균 응시 속도
                                    </Typography>
                                </EyetrackTextsItemKey>
                                <EyetrackTextsItemValue>
                                    <Typography type="label" size="xxl" bold>
                                        {avgFixVels}px/s
                                    </Typography>
                                </EyetrackTextsItemValue>
                            </EyetrackTextsItem>
                        </EyetrackTextsWrapper>
                        <EyetrackTextsWrapper>
                            <EyetrackTextsItem>
                                <EyetrackTextsItemKey>
                                    <Typography type="label" size="xxl" bold>
                                        재응시 횟수
                                    </Typography>
                                </EyetrackTextsItemKey>
                                <EyetrackTextsItemValue>
                                    <Typography type="label" size="xxl" bold>
                                        {regressions}회
                                    </Typography>
                                </EyetrackTextsItemValue>
                            </EyetrackTextsItem>
                        </EyetrackTextsWrapper>
                    </>
                ) : (
                    <LimitFuncWrapper>
                        <ReportWarningTags title="시선 추적 미포함 과제" />
                    </LimitFuncWrapper>
                )}
            </EyetrackTextsContainer>
            <PatternsContainer>
                <PatternTextsContainer>
                    <Typography type="label" size="xl" bold>
                        {stdName} 학생은 풀이 중
                    </Typography>
                    <Typography type="label" size="xl" bold>
                        <span>총 {answerChangedProblems}문제</span> 에서 답 변경 후,
                    </Typography>
                    <Typography type="label" size="xl" bold>
                        <span>{aftChangedFaileds}문제</span> 가 오답 처리되었습니다.
                    </Typography>
                </PatternTextsContainer>
                <PatternListsContainer>
                    {eyetrack && userType === 'students' ? null : (
                        <EyeTrackPattern data={patternData} hasEyetrack={hasEyetrack} onEyetrackGoTo={handleGoTo} />
                    )}
                </PatternListsContainer>
            </PatternsContainer>
        </>
    );
}

EyeTrackBox.defaultProps = {
    totalDatas: [],
};

export default EyeTrackBox;
