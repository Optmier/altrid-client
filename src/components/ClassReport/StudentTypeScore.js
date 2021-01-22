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
`;

function StudentTypeScore({ enabled, current, total, typeSelectState, handleTypeSelect, achieveValue }) {
    const [sortedEnableCategories] = useState(enabled.sort((a, b) => a.category - b.category));

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
                        <RadarChart
                            currentObjs={sortedEnableCategories.map((e) => ({ ...e, score: current[e.category] }))}
                            averageObjs={sortedEnableCategories.map((e) => ({ ...e, score: total[e.category] }))}
                        />
                    ) : (
                        <ColumnChart
                            currentObjs={sortedEnableCategories.map((e) => ({ ...e, score: current[e.category] }))}
                            averageObjs={sortedEnableCategories.map((e) => ({ ...e, score: total[e.category] }))}
                        />
                    )}
                </div>
            </StyleStudentTypeScore>
        </div>
    );
}

export default StudentTypeScore;
