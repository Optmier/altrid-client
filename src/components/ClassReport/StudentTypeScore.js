import React, { useState } from 'react';
import styled from 'styled-components';
import RadarChart from '../essentials/RadarChart';
import ColumnChart from '../essentials/ColumnChart';

const StyleStudentTypeScore = styled.div`
    display: flex;
    flex-direction: column;

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
            cursor: pointer;
            background: url(/bg_images/Vector.png) no-repeat 92% 50%;
            width: 160px;
            padding: 0.4rem 0.8rem;
            font-family: inherit;
            font-size: 1.001rem;
            border: none;
            border: 1px solid #707070;
            border-radius: 0px;
            -webkit-appearance: none;
            -moz-appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            outline: none;
        }
    }
    & .chart-wrapper {
        position: relative;
        overflow-x: auto;
        overflow-y: hidden;
    }
`;
const LimitFuncWrapper = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 95%;
    height: 95%;
    background: #ffffff3c;
    font-size: 1.2rem;
    font-weight: 500;
    z-index: 1000;
    color: rgb(96, 95, 96);
    & svg {
        margin-right: 15px;
    }
    @media (min-width: 0) and (max-width: 663px) {
        font-size: 0.85rem;
        text-align: center;
        & svg {
            margin-right: 5px;
        }
    }
`;

function StudentTypeScore({ enabled, subject, current, total, typeSelectState, handleTypeSelect, achieveValue }) {
    const [sortedEnableCategories] = useState(enabled.sort((a, b) => a.category - b.category));
    console.log(sortedEnableCategories);
    return (
        <div className="white-box">
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
                                    <svg id="Warning" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                        <path
                                            id="패스_35"
                                            data-name="패스 35"
                                            d="M8,0a8,8,0,1,0,8,8A8.024,8.024,0,0,0,8,0ZM9.1,12.2H6.9V10.3H9.2v1.9Zm.1-7.4L8.6,9.2H7.4L6.8,4.8v-1H9.3v1Z"
                                            fill="#605f60"
                                        />
                                    </svg>
                                    과제를 더 다양한 문제로 만들어주세요!
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
                                <svg id="Warning" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                    <path
                                        id="패스_35"
                                        data-name="패스 35"
                                        d="M8,0a8,8,0,1,0,8,8A8.024,8.024,0,0,0,8,0ZM9.1,12.2H6.9V10.3H9.2v1.9Zm.1-7.4L8.6,9.2H7.4L6.8,4.8v-1H9.3v1Z"
                                        fill="#605f60"
                                    />
                                </svg>
                                과제를 더 다양한 문제로 만들어주세요!
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
        </div>
    );
}

export default StudentTypeScore;
