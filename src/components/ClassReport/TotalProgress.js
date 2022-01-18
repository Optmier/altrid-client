import React from 'react';
import styled from 'styled-components';
import Progress from './Progress.js';
import Tooltip from '../../AltridUI/Tooltip/Tooltip.js';

const StyleTotalProgress = styled.div`
    padding: 0 4px;
    overflow: auto;
    position: relative;
    max-width: 960px;
    & .progress-list {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        & .name {
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
            margin-right: 8px;
            min-width: 4rem;
            max-width: 4rem;

            text-overflow: ellipsis;
            white-space: nowrap;
            word-wrap: normal;
            overflow: hidden;
        }
    }
    & .progress-list + .progress-list {
        margin-top: 8px;
    }
    @media (max-width: 640px) {
        margin-left: -16px;
        margin-right: -16px;
        padding-left: 16px;
    }
`;

function TotalProgress({ studentList, problemNumbers }) {
    return (
        <StyleTotalProgress>
            {Object.keys(studentList).map((num) => (
                <div key={num} className="progress-list">
                    <Tooltip title={studentList[num]['name']}>
                        <div className="name">{studentList[num]['name']}</div>
                    </Tooltip>

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
