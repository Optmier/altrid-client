import React from 'react';
import styled from 'styled-components';
import Progress from './Progress.js';

const StyleTotalProgress = styled.div`
    background-color: white;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
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
            font-size: 1rem;
            font-weight: 500;
            margin-right: 15px;
            width: 60px;

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
                    <div className="name">{studentList[num]['name']}</div>
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
