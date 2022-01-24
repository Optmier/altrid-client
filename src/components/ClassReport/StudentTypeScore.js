import React, { useState } from 'react';
import styled from 'styled-components';
import RadarChart from '../essentials/RadarChart';
import ColumnChart from '../essentials/ColumnChart';
import ReportWarningTags, { LimitFuncWrapper } from './ReportStudent/ReportWarningTags';
import { Link } from 'react-router-dom';

const StyleStudentTypeScore = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;

    & .chart-header-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;

        & .chart-header-center {
            display: flex;
            align-items: center;
            font-size: 0.94rem;
            font-weight: 400;
            color: #171717b3;

            & > span {
                display: flex;
                align-items: center;
            }
            & span + span {
                margin-left: 15px;
            }
            & .circle {
                width: 11px;
                height: 11px;
                border-radius: 50%;
                margin-left: 5px;
            }
            & .circle.student {
                background-color: #351e85;
            }
            & .circle.class {
                background-color: #68dea6;
            }
        }
        & select {
            background: url('../../../../assets/ic_select_ext.png') no-repeat 90% 50%;
            border: 1.5px solid #6c46a1;
            border-radius: 104px;
            color: #6c46a1;
            cursor: pointer;
            font-size: 16px;
            font-weight: 700;
            line-height: 20px;
            letter-spacing: -0.02em;
            min-width: 140px;
            padding: 8px 16px;
            outline: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            &::-ms-expand {
                display: none;
            }
        }
    }
    & .chart-wrapper {
        position: relative;
        overflow-x: auto;
        overflow-y: hidden;
    }
`;

function StudentTypeScore({ enabled, subject, current, total, typeSelectState, handleTypeSelect, achieveValue }) {
    const [sortedEnableCategories] = useState(enabled.sort((a, b) => a.category - b.category));
    console.log(sortedEnableCategories);
    return (
        <StyleStudentTypeScore>
            <div className="chart-header-wrapper">
                <div className="chart-header-center">
                    <span>
                        학생 점수 <div className="circle student"></div>
                    </span>
                    <span>
                        반 평균 <div className="circle class"></div>
                    </span>
                </div>

                <select name="chart-option" onChange={handleTypeSelect}>
                    <option value="0">방사형 그래프</option>
                    <option value="1">막대형 그래프</option>
                </select>
            </div>

            <div className="chart-wrapper">
                {typeSelectState === '0' ? (
                    current ? (
                        <RadarChart
                            subject={subject}
                            currentObjs={sortedEnableCategories.map((e) => ({ ...e, score: current[e.category] }))}
                            averageObjs={sortedEnableCategories.map((e) => ({ ...e, score: total[e.category] }))}
                        />
                    ) : (
                        <>
                            <LimitFuncWrapper>
                                <ReportWarningTags
                                    title={
                                        <Link to={{ pathname: 'https://www.notion.so/a4daf8676b2b4460b75613f25249abf3' }} target="_blank">
                                            유형 분석 조건을 충족하지 않았습니다.
                                        </Link>
                                    }
                                />
                            </LimitFuncWrapper>
                            <RadarChart
                                isDummy
                                subject={subject}
                                averageObjs={sortedEnableCategories.map((e) => ({ ...e, score: total[e.category] }))}
                            />
                        </>
                    )
                ) : current ? (
                    <ColumnChart
                        subject={subject}
                        currentObjs={sortedEnableCategories.map((e) => ({ ...e, score: current[e.category] }))}
                        averageObjs={sortedEnableCategories.map((e) => ({ ...e, score: total[e.category] }))}
                    />
                ) : (
                    <>
                        <LimitFuncWrapper>
                            <ReportWarningTags
                                title={
                                    <Link to={{ pathname: 'https://www.notion.so/a4daf8676b2b4460b75613f25249abf3' }} target="_blank">
                                        유형 분석 조건을 충족하지 않았습니다.
                                    </Link>
                                }
                            />
                        </LimitFuncWrapper>
                        <ColumnChart
                            isDummy
                            subject={subject}
                            averageObjs={sortedEnableCategories.map((e) => ({ ...e, score: total[e.category] }))}
                        />
                    </>
                )}
            </div>
        </StyleStudentTypeScore>
    );
}

export default StudentTypeScore;
