import React, { useEffect, useState } from 'react';
import HtmlParser from 'react-html-parser';
import styled from 'styled-components';
import TimerIcon from '@material-ui/icons/Timer';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Button, IconButton } from '@material-ui/core';
import ProblemComponent from './ProblemComponent';
import * as $ from 'jquery';

const pad = (n, width) => {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
};

const timeValueToTimer = (seconds) => {
    const secs = seconds < 0 ? 0 : seconds;
    if (seconds === -2) return '제한 없음';
    else return `${pad(parseInt(secs / 60), 2)}:${pad(Math.floor(secs % 60), 2)}`;
};

const RenderRoot = styled.div`
    min-width: 1280px;
    min-height: 750px;
    max-width: 1280px;
    max-height: 750px;
    height: 750px;
`;
const HeaderToolbar = styled.div`
    border-bottom: 1px solid #cccccc;
    box-sizing: border-box;
    color: #666666;
    display: flex;
    justify-content: space-between;
    height: 42px;
    padding: 8px;
`;
const ContentsContainer = styled.div`
    display: flex;
    flex-direction: row;
    height: calc(100% - 42px - 16px);

    & p {
        font-family: 'Times New Roman';
        font-size: 1.125rem;
        line-height: 1.75rem;
    }
`;
const PassageContainer = styled.div`
    overflow: auto;
    padding: 8px;
    width: 60%;
    height: 100%;
`;
const ProblemsContainer = styled.div`
    border-left: 1px solid #cccccc;
    padding: 8px;
    overflow: auto;
    width: 40%;
    height: 100%;

    & p {
        font-family: 'Times New Roman';
        font-size: 1rem;
        line-height: 1.5rem;
    }
`;
const HeaderTitle = styled.div``;
const HeaderTimer = styled.div`
    display: flex;
    align-items: center;

    & h5 {
        margin-left: 8px;
        width: 6rem;
    }
`;
const HeaderPageController = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 12rem;
`;
const HeaderMasterSWs = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

function SmartTOFELRender({
    preview,
    title,
    passageForRender,
    problemDatas,
    userDatas,
    userAnswerDirect,
    timer,
    timeLimit,
    onPrev,
    onNext,
    onEnd,
    onUserAnswerChanged,
}) {
    const [currentProblemIdx, setCurrentProblemIdx] = useState(userDatas.lastProblem);
    const [userSelectionDatas, setUserSelectionDatas] = useState(userDatas.selections);
    const [currentLog, setCurrentLog] = useState({
        pid: 0,
        action: null,
        time: 0,
        answerBefore: 0,
        answerAfter: 0,
        correct: false,
    });
    const [metadata, setMetadata] = useState(userDatas);

    const handlePrev = () => {
        setCurrentLog((currentLog) => {
            const state = {
                ...currentLog,
                action: 'end',
                time: timeLimit - timer,
                answerAfter: userSelectionDatas[currentProblemIdx].answerUser,
                correct: userSelectionDatas[currentProblemIdx].correct,
            };
            // console.log(state);
            onPrev(currentProblemIdx - 1);
            return state;
        });
        setCurrentProblemIdx(currentProblemIdx - 1);
    };

    const handleNext = () => {
        setCurrentLog((currentLog) => {
            const state = {
                ...currentLog,
                action: 'end',
                time: timeLimit - timer,
                answerAfter: userSelectionDatas[currentProblemIdx].answerUser,
                correct: userSelectionDatas[currentProblemIdx].correct,
            };
            // console.log(state);
            if (currentProblemIdx < problemDatas.length - 1) onNext(currentProblemIdx + 1);
            return state;
        });
        if (currentProblemIdx >= problemDatas.length - 1) {
            onEnd();
            return;
        }
        setCurrentProblemIdx(currentProblemIdx + 1);
    };

    const onSelectionSelected = (userAnswer, isCorrect) => {
        // console.log(userAnswer, isCorrect);
        // if (preview && isCorrect) {
        //     alert('정답입니다.');
        // }
        setCurrentLog((currentLog) => {
            const state = {
                ...currentLog,
                action: 'changed',
                time: timeLimit - timer,
                answerBefore: userSelectionDatas[currentProblemIdx].answerUser,
                answerAfter: userAnswer,
                correct: isCorrect,
            };
            // console.log(state);
            return state;
        });
        setUserSelectionDatas(
            userSelectionDatas.map((data, idx) =>
                idx === currentProblemIdx
                    ? {
                          ...data,
                          type: problemDatas[currentProblemIdx].type,
                          answerUser: userAnswer,
                          answerCorrect: problemDatas[currentProblemIdx].answer,
                          correct: isCorrect,
                          score: isCorrect ? problemDatas[currentProblemIdx].score : 0,
                      }
                    : data,
            ),
        );
    };

    const handleEnd = () => {
        console.log(timer, metadata);
        onEnd(timer, metadata);
    };

    useEffect(() => {
        if (!userSelectionDatas[currentProblemIdx]) {
            if (preview) {
                setUserSelectionDatas([
                    ...userSelectionDatas,
                    {
                        type: problemDatas[currentProblemIdx].type,
                        answerUser: problemDatas[currentProblemIdx].answer,
                        answerCorrect: problemDatas[currentProblemIdx].answer,
                        correct: false,
                        score: 0,
                    },
                ]);
            } else {
                setUserSelectionDatas([
                    ...userSelectionDatas,
                    {
                        type: problemDatas[currentProblemIdx].type,
                        answerUser: problemDatas[currentProblemIdx].type === 'short-answer' ? '' : 0,
                        answerCorrect: problemDatas[currentProblemIdx].answer,
                        correct: false,
                        score: 0,
                    },
                ]);
            }
            setCurrentLog((currentLog) => {
                const state = {
                    pid: currentProblemIdx,
                    action: 'begin',
                    time: timeLimit - timer,
                    answerBefore: 0,
                    answerAfter: 0,
                    correct: false,
                };
                // console.log(state);
                return state;
            });
        } else {
            setCurrentLog((currentLog) => {
                const state = {
                    pid: currentProblemIdx,
                    action: 'begin',
                    time: timeLimit - timer,
                    answerBefore: userSelectionDatas[currentProblemIdx].answerUser,
                    answerAfter: userSelectionDatas[currentProblemIdx].answerUser,
                    correct: userSelectionDatas[currentProblemIdx].correct,
                };
                // console.log(state);
                return state;
            });
        }
        setMetadata({
            ...metadata,
            lastProblem: currentProblemIdx,
        });
    }, [currentProblemIdx]);

    useEffect(() => {
        if (
            currentProblemIdx !== undefined &&
            userSelectionDatas &&
            userSelectionDatas[currentProblemIdx] &&
            userSelectionDatas[currentProblemIdx].answerUser !== undefined
        )
            onUserAnswerChanged(userSelectionDatas[currentProblemIdx].answerUser);
        setMetadata({
            ...metadata,
            selections: userSelectionDatas,
            lastProblem: currentProblemIdx,
            logs: currentLog.action === null ? [...metadata.logs] : [...metadata.logs, currentLog],
        });
    }, [currentProblemIdx, userSelectionDatas, currentLog]);

    useEffect(() => {
        console.log(metadata);
    }, [metadata]);

    useEffect(() => {
        setCurrentProblemIdx(userDatas.lastProblem);
    }, [userDatas]);

    useEffect(() => {
        if (preview) return;
        if (timer < 0) {
            handleEnd();
        }
    }, [timer]);

    useEffect(() => {}, []);

    return (
        <RenderRoot>
            <HeaderToolbar>
                <HeaderTitle>
                    <h4>{title}</h4>
                </HeaderTitle>
                <HeaderTimer>
                    <TimerIcon />
                    <h5>{timeValueToTimer(timer)}</h5>
                </HeaderTimer>
                <HeaderPageController>
                    <IconButton size="small" disabled={currentProblemIdx <= 0} onClick={handlePrev}>
                        <NavigateBeforeIcon />
                    </IconButton>
                    <h5>
                        {currentProblemIdx + 1} / {problemDatas.length}
                    </h5>
                    <IconButton size="small" disabled={currentProblemIdx >= problemDatas.length - 1} onClick={handleNext}>
                        <NavigateNextIcon />
                    </IconButton>
                    <HeaderMasterSWs>
                        <Button size="small" endIcon={<ExitToAppIcon />} color="secondary" onClick={handleEnd}>
                            종료
                        </Button>
                    </HeaderMasterSWs>
                </HeaderPageController>
            </HeaderToolbar>
            <ContentsContainer>
                <PassageContainer className="passages">{HtmlParser(passageForRender)}</PassageContainer>
                <ProblemsContainer className="problems">
                    <ProblemComponent
                        category={problemDatas[currentProblemIdx].category}
                        type={problemDatas[currentProblemIdx].type}
                        textForRender={problemDatas[currentProblemIdx].textForRender}
                        selections={problemDatas[currentProblemIdx].selections}
                        answer={preview ? problemDatas[currentProblemIdx].answer : ''}
                        currentSelection={
                            userAnswerDirect === null || userAnswerDirect === undefined
                                ? userSelectionDatas[currentProblemIdx]
                                    ? userSelectionDatas[currentProblemIdx].answerUser
                                    : problemDatas[currentProblemIdx].type === 'short-answer'
                                    ? ''
                                    : 0
                                : userAnswerDirect
                        }
                        onSelect={onSelectionSelected}
                    />
                </ProblemsContainer>
            </ContentsContainer>
        </RenderRoot>
    );
}

SmartTOFELRender.defaultProps = {
    preview: false,
    title: '타이틀',
    passageForRender: '',
    problemDatas: [],
    userDatas: {
        selections: [],
        lastProblem: 0,
        logs: [],
    },
    userAnswerDirect: null,
    timer: 90,
    onPrev() {},
    onNext() {},
    onEnd() {},
    onUserAnswerChanged() {},
};

export default React.memo(SmartTOFELRender);