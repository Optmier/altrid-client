import React from 'react';
import styled from 'styled-components';
import moment from 'moment-timezone';

const StyleDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding-left: 10px;
    box-sizing: border-box;

    & .header {
        & .header-desc {
            font-size: 1.8rem;
            font-weight: 600;
            color: #707070;
        }

        & .header-title {
            display: none;
        }
    }
    & .buttons {
        display: flex;
        flex-direction: column;
        width: 100%;
        margin-top: 14px;

        & button {
            font-size: 0.9rem;
            font-weight: 500;
            color: white;
            padding: 12px 0;
            border-radius: 11px;
            width: 100%;
            box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.25);
        }
        & button + button {
            margin-top: 8px;
        }
        & .main {
            background-color: #3f1990;
        }
        & .sub {
            background-color: #6d2bf5;
        }
    }

    @media (min-width: 0) and (max-width: 662px) {
        padding: 12px 0 0 0;
        align-items: flex-start;

        & .header {
            display: flex;
            align-items: center;

            & .header-title {
                display: block;
                width: 95px;
                font-size: 0.875rem;
                font-weight: 600;
                color: #2e2c2c;
                margin: 0;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
            & .header-desc {
                font-size: 0.875rem;
                font-weight: 400;
                color: #2e2c2c;
                margin: 0;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
        }
        & .buttons {
            flex-direction: row;
            margin: 24px 0 0 0;

            & button + button {
                margin: 0 0 0 8px;
            }
        }
    }
`;

function StudentState({ state, assignmentState, handlePreTest, handleStartTest, handleGoToReport, dueDate }) {
    //state(풀이 상태) : pre, ing, done
    //assignmentState(과제 상태) : true(과제 기한 진행중), false(과제 기한 완료)

    let t1 = moment(dueDate).hours(0).minutes(0);
    let t2 = moment().hours(0).minutes(0);

    let dday = t1.diff(t2, 'days') + 1;

    return (
        <StyleDiv>
            <div className="header">
                <div className="header-title">과제 상태 </div>
                <div className="header-desc">
                    {assignmentState
                        ? state === 'pre'
                            ? 'D-' + dday
                            : state === 'ing'
                            ? 'D-' + dday
                            : null
                        : state === 'pre'
                        ? '미제출'
                        : null}
                </div>
            </div>

            <div className="buttons">
                {assignmentState ? (
                    state === 'pre' ? (
                        <button onClick={handleStartTest} className="main">
                            과제 풀기
                        </button>
                    ) : state === 'ing' ? (
                        <button onClick={handleStartTest} className="main">
                            이어 풀기
                        </button>
                    ) : (
                        <button onClick={handleGoToReport} className="sub">
                            리포트 보기
                        </button>
                    )
                ) : state === 'pre' ? null : (
                    <button onClick={handleGoToReport} className="sub">
                        리포트 보기
                    </button>
                )}
                {!assignmentState ? (
                    state === 'done' ? (
                        <button onClick={handlePreTest} className="main">
                            과제 보기
                        </button>
                    ) : null
                ) : // <button onClick={handlePreTest} className="main">
                //     과제 보기
                // </button>
                null}
            </div>
        </StyleDiv>
    );
}

export default StudentState;
