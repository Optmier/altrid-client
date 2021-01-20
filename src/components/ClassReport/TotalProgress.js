import React from 'react';
import styled from 'styled-components';
import Progress from './Progress.js';
import TooltipCard from '../essentials/TooltipCard';

const StyleTotalProgress = styled.div`
    background-color: white;
    border-radius: 11px;
    padding: 30px 32px;
    height: 250px;
    overflow: auto;
    position: relative;

    & .progress-list {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        & .name {
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
            margin-right: 15px;
            min-width: 4rem;
            max-width: 4rem;

            text-overflow: ellipsis;
            white-space: nowrap;
            word-wrap: normal;
            overflow: hidden;
        }
    }

    & .progress-list + .progress-list {
        margin-top: 14px;
    }
`;

function TotalProgress({ studentList, problemNumbers }) {
    return (
        <StyleTotalProgress>
            {Object.keys(studentList).map((num) => (
                <div key={num} className="progress-list">
                    <TooltipCard title={studentList[num]['name']}>
                        <div className="name">{studentList[num]['name']}</div>
                    </TooltipCard>

                    <Progress
                        selections={studentList[num].user_data ? studentList[num].user_data.selections : null}
                        problemNumbers={problemNumbers}
                    />
                </div>
            ))}
        </StyleTotalProgress>
    );
}

export default TotalProgress;
