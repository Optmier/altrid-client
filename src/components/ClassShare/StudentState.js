import React from 'react';
import styled from 'styled-components';

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
            font-size: 1.4rem;
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
        & .top {
            background-color: #3f1990;
        }
        & .bottom {
            background-color: #707070;
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
                color: #706d6d;
                margin: 0;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
            & .header-desc {
                font-size: 0.875rem;
                font-weight: 400;
                color: #706d6d;
                margin: 0;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
        }
        & .buttons {
            flex-direction: row;
            margin-top: 24px;

            & button + button {
                margin: 0 0 0 8px;
            }
        }
    }
`;

function StudentState({ state, assignmentState, handlePreTest, handleStartTest, handleGoToReport }) {
    //state(풀이 상태) : pre, ing, done
    //assignmentState(과제 상태) : true(과제 기한 진행중), false(과제 기한 완료)
    return (
        <StyleDiv>
            <div className="header">
                <div className="header-title">과제 상태 </div>
                <div className="header-desc">
                    {assignmentState
                        ? state === 'pre'
                            ? '풀이 전'
                            : state === 'ing'
                            ? '풀이 중'
                            : '풀이 완료'
                        : state === 'pre'
                        ? '풀이 미진행'
                        : '풀이 완료'}
                </div>
            </div>

            <div className="buttons">
                {assignmentState ? (
                    state === 'pre' ? (
                        <button onClick={handleStartTest} className="top">
                            문제 풀기
                        </button>
                    ) : state === 'ing' ? (
                        <button onClick={handleStartTest} className="top">
                            이어 풀기
                        </button>
                    ) : (
                        <button onClick={handleGoToReport} className="top">
                            리포트 보기
                        </button>
                    )
                ) : state === 'pre' ? null : (
                    <button onClick={handleGoToReport} className="top">
                        리포트 보기
                    </button>
                )}

                {assignmentState ? (
                    state === 'done' ? (
                        <button onClick={handlePreTest} className="bottom">
                            과제 보기
                        </button>
                    ) : null
                ) : (
                    <button onClick={handlePreTest} className="bottom">
                        과제 보기
                    </button>
                )}
            </div>
        </StyleDiv>
    );
}

export default StudentState;
