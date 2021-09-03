import React, { useEffect, useRef, useState } from 'react';
import HtmlParser from 'react-html-parser';
import styled from 'styled-components';
import TimerIcon from '@material-ui/icons/Timer';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { Button, IconButton } from '@material-ui/core';
import ProblemComponent from './ProblemComponent';
import * as $ from 'jquery';
import { FaBeer } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';

const pad = (n, width) => {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
};

const timeValueToTimer = (seconds) => {
    const secs = seconds < 0 ? 0 : seconds;
    if (seconds === -2) return '제한 없음';
    else return `${pad(parseInt(secs / 60), 2)}:${pad(Math.floor(secs % 60), 2)}`;
};

const StyleButton = styled.button`
    background-color: ${(props) => (props.type === 'save' ? '#572AB5' : '#6D2AFA')};
    border: none;
    border-radius: 11px;
    padding: 8px 10px;
    color: white;
    font-size: 0.75rem;
    font-weight: 500;
    box-shadow: 0px 1px 10px 1px rgb(0 0 0 / 16%);
    margin-left: 12px;
`;

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

    & span.voca-highlighted {
        background-color: #dfdf0034;
    }
`;
const PassageContainer = styled.div`
    overflow: auto;
    padding: 8px;
    width: 60%;
    height: 100%;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */

    &::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera*/
    }
`;
const ProblemsContainer = styled.div`
    border-left: 1px solid #cccccc;
    padding: 8px;
    overflow: auto;
    width: 40%;
    height: 100%;

    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */

    &::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera*/
    }

    & p,
    & blockquote {
        font-family: 'Times New Roman';
        font-size: 1rem;
        line-height: 1.5rem;

        &.ql-indent-1 {
            margin-left: 1rem;
        }

        &.ql-indent-2 {
            margin-left: 1.5rem;
        }

        &.ql-indent-3 {
            margin-left: 2rem;
        }
    }
`;
const HeaderTitle = styled.div``;
const HeaderTimer = styled.div`
    display: flex;
    align-items: center;

    &.warning {
        color: #e49f00;
    }

    &.critical {
        color: #e40000;
    }

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
    pUUIDs,
    passageForRender,
    problemDatas,
    userDatas,
    userAnswerDirect,
    timer,
    timeLimit,
    savedVocas,
    onPrev,
    onNext,
    onEnd,
    onUserAnswerChanged,
}) {
    const [currentProblemIdx, setCurrentProblemIdx] = useState(userDatas.lastProblem);
    const [lastProblemIdx, setLastProblemIdx] = useState(userDatas.lastProblem);
    const [userSelectionDatas, setUserSelectionDatas] = useState(userDatas.selections);
    const [currentLog, setCurrentLog] = useState({
        pid: 0,
        setNum: 0,
        action: null,
        time: 0,
        answerBefore: 0,
        answerAfter: 0,
        correct: false,
    });
    const [metadata, setMetadata] = useState(userDatas);
    const [triggerExit, setTriggerExit] = useState(false);
    const [forceEnd, setForceEnd] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(0);
    const [vocas, setVocas] = useState(savedVocas);

    const contentsContainerRef = useRef();
    const passagesRef = useRef();
    const problemsRef = useRef();

    const handlePrev = () => {
        setCurrentLog((currentLog) => {
            const state = {
                ...currentLog,
                action: 'end',
                time: timeLimit === -2 ? timer : timeLimit - timer,
                answerAfter: userSelectionDatas[currentProblemIdx].answerUser,
                correct: userSelectionDatas[currentProblemIdx].correct,
                setNum: pUUIDs.findIndex((d) => d === problemDatas[currentProblemIdx].passageUid),
            };
            // console.log(state);
            // onPrev(currentProblemIdx - 1);
            return state;
        });
        setCurrentProblemIdx(currentProblemIdx - 1);
    };

    const handleNext = () => {
        setCurrentLog((currentLog) => {
            const state = {
                ...currentLog,
                action: 'end',
                time: timeLimit === -2 ? timer : timeLimit - timer,
                answerAfter: userSelectionDatas[currentProblemIdx].answerUser,
                correct: userSelectionDatas[currentProblemIdx].correct,
                setNum: pUUIDs.findIndex((d) => d === problemDatas[currentProblemIdx].passageUid),
            };
            // console.log(state);
            if (currentProblemIdx < problemDatas.length - 1) {
                // onNext(currentProblemIdx + 1);
            }
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
                time: timeLimit === -2 ? timer : timeLimit - timer,
                answerBefore: userSelectionDatas[currentProblemIdx].answerUser,
                answerAfter: userAnswer,
                correct: isCorrect,
                setNum: pUUIDs.findIndex((d) => d === problemDatas[currentProblemIdx].passageUid),
            };
            // console.log(state);
            return state;
        });
        setUserSelectionDatas(
            userSelectionDatas.map((data, idx) =>
                idx === currentProblemIdx
                    ? {
                          ...data,
                          setNum: pUUIDs.findIndex((d) => d === problemDatas[currentProblemIdx].passageUid),
                          qUUID: problemDatas[currentProblemIdx].uuid,
                          pUUID: pUUIDs[pUUIDs.findIndex((d) => d === problemDatas[currentProblemIdx].passageUid)]
                              ? pUUIDs[pUUIDs.findIndex((d) => d === problemDatas[currentProblemIdx].passageUid)]
                              : undefined,
                          type: problemDatas[currentProblemIdx].type,
                          category: problemDatas[currentProblemIdx].category,
                          answerUser: userAnswer,
                          answerCorrect: problemDatas[currentProblemIdx].answer,
                          correct: isCorrect,
                          score: isCorrect ? problemDatas[currentProblemIdx].score : 0,
                      }
                    : data,
            ),
        );
    };

    const handleEnd = (e) => {
        //console.log(timer, timeLimit);
        if (preview) {
            onEnd();
            return;
        }
        if (timeLimit === -3) {
            setIsSubmitted(1);
        } else if (timeLimit === -2 && e.target.name === 'save') {
            const conf = window.confirm('정말로 종료하시겠습니까?\n현재까지 변경사항이 저장됩니다.');
            if (!conf) return;
            setIsSubmitted(0);
        } else if (timeLimit === -2 && e.target.name === 'submit') {
            const conf = window.confirm('제출 후에는 변경이 불가능합니다.\n정말로 종료하시겠습니까?');

            if (!conf) return;

            setIsSubmitted(1);
        } else if (timeLimit !== -2 && timer > 0) {
            const conf = window.confirm('아직 제한시간이 남아있습니다.\n정말로 종료하시겠습니까?');
            if (!conf) return;
            setIsSubmitted(1);
        }
        setCurrentLog((currentLog) => {
            // console.log(timeLimit, timer);
            const state = {
                ...currentLog,
                action: 'end',
                time: timeLimit === -2 || timeLimit === -3 ? timer : timeLimit - timer,
                answerAfter: userSelectionDatas[currentProblemIdx].answerUser,
                correct: userSelectionDatas[currentProblemIdx].correct,
                setNum: pUUIDs.findIndex((d) => d === problemDatas[currentProblemIdx].passageUid),
            };
            // console.log(state);
            setForceEnd(true);
            setTriggerExit(true);
            return state;
        });
    };

    useEffect(() => {
        if (!problemDatas.length) return;
        if (!userSelectionDatas[currentProblemIdx]) {
            if (preview) {
                setUserSelectionDatas([
                    ...userSelectionDatas,
                    {
                        setNum: pUUIDs.findIndex((d) => d === problemDatas[currentProblemIdx].passageUid),
                        qUUID: problemDatas[currentProblemIdx].uuid,
                        pUUID: pUUIDs[pUUIDs.findIndex((d) => d === problemDatas[currentProblemIdx].passageUid)]
                            ? pUUIDs[pUUIDs.findIndex((d) => d === problemDatas[currentProblemIdx].passageUid)]
                            : undefined,
                        type: problemDatas[currentProblemIdx].type,
                        category: problemDatas[currentProblemIdx].category,
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
                        setNum: pUUIDs.findIndex((d) => d === problemDatas[currentProblemIdx].passageUid),
                        qUUID: problemDatas[currentProblemIdx].uuid,
                        pUUID: pUUIDs[pUUIDs.findIndex((d) => d === problemDatas[currentProblemIdx].passageUid)]
                            ? pUUIDs[pUUIDs.findIndex((d) => d === problemDatas[currentProblemIdx].passageUid)]
                            : undefined,
                        type: problemDatas[currentProblemIdx].type,
                        category: problemDatas[currentProblemIdx].category,
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
                    time: timeLimit === -2 ? timer : timeLimit - timer,
                    answerBefore: 0,
                    answerAfter: 0,
                    correct: false,
                    setNum: -99,
                };
                // console.log(state);
                return state;
            });
        } else {
            setCurrentLog((currentLog) => {
                const state = {
                    pid: currentProblemIdx,
                    action: 'begin',
                    time: timeLimit === -2 ? timer : timeLimit - timer,
                    answerBefore: userSelectionDatas[currentProblemIdx].answerUser,
                    answerAfter: userSelectionDatas[currentProblemIdx].answerUser,
                    correct: userSelectionDatas[currentProblemIdx].correct,
                    setNum: pUUIDs.findIndex((d) => d === problemDatas[currentProblemIdx].passageUid),
                };
                // console.log(state);
                return state;
            });
        }
        // 지문
        const $passage = $('div.passages');
        // 문제
        const $problems = $('div.problems');
        /** 세트 번호 다를시 지문 영역 스크롤 초기화 */
        if (
            pUUIDs.findIndex((d) => d === problemDatas[lastProblemIdx].passageUid) !==
            pUUIDs.findIndex((d) => d === problemDatas[currentProblemIdx].passageUid)
        ) {
            $passage.scrollTop(0);
        }
        /** 문제 바뀔시 문제 영역 스크롤 초기화 */
        if (currentProblemIdx !== lastProblemIdx) {
            $problems.scrollTop(0);
        }
        setMetadata({
            ...metadata,
            lastProblem: currentProblemIdx,
        });

        for (let w of vocas) {
            unmarkWords(w, document.querySelector('div.problems'));
            setTimeout(() => {
                markWords(w, document.querySelector('div.problems'));
            });
        }
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
        // console.log(metadata);
        if (lastProblemIdx > currentProblemIdx) {
            onPrev(currentProblemIdx, timer, metadata);
        } else if (lastProblemIdx < currentProblemIdx) {
            onNext(currentProblemIdx, timer, metadata, vocas);
        }
        if (triggerExit) {
            // console.log(timer, metadata);
            onEnd(timer, isSubmitted, metadata, vocas);
            setTriggerExit(false);
        }
        setLastProblemIdx(currentProblemIdx);
    }, [metadata, isSubmitted, vocas]);

    useEffect(() => {
        setCurrentProblemIdx(userDatas.lastProblem);
    }, [userDatas]);

    useEffect(() => {
        if (preview || forceEnd) return;
        if (timeLimit === -3) {
            handleEnd();
        } else if (timeLimit !== -2 && Math.floor(timer) === 0) {
            setIsSubmitted(1);
            handleEnd();
        }
    }, [timer, forceEnd]);

    useEffect(() => {
        const contents = contentsContainerRef.current;
        contents.ondblclick = () => {
            const selectedWord = window.getSelection().toString().toLowerCase();
            // 영문 한 단어만 단어로 취급함
            if (selectedWord.match(/^[a-zA-Z]*$/) && selectedWord.split(' ').length === 1 && selectedWord.length > 1) {
                // console.log(selectedWord);
                if (!vocas.find((v) => v === selectedWord)) {
                    addVocas(selectedWord);
                    markWords(selectedWord, document.querySelector('div.passages'));
                    markWords(selectedWord, document.querySelector('div.problems'));
                } else {
                    removeVocas(selectedWord);
                    unmarkWords(selectedWord, document.querySelector('div.passages'));
                    unmarkWords(selectedWord, document.querySelector('div.problems'));
                }
            }
        };
    }, [vocas]);

    const addVocas = (word) => {
        setVocas([...vocas, word]);
    };

    const removeVocas = (word) => {
        setVocas(vocas.filter((v) => v !== word));
    };

    /**
     * @param {string} word
     * @param {Element} ref
     */
    const markWords = (word, ref) => {
        const contents = ref;
        const wordCases = [word.toLowerCase(), word.toUpperCase(), word.charAt(0).toUpperCase() + word.slice(1)];
        for (let wc of wordCases) {
            const replacement = new RegExp(`(?<!<[^>]*)\\b${wc}\\b`, 'g');
            if (ref.classList.contains('passages'))
                contents.innerHTML = contents.innerHTML.replace(replacement, `<span class="voca-highlighted">${wc}</span>`);
            else if (ref.classList.contains('problems')) {
                const praghps = $(ref).children().find('p');
                for (let p of praghps) {
                    p.innerHTML = p.innerHTML.replace(replacement, `<span class="voca-highlighted">${wc}</span>`);
                }
            }
        }
    };

    const unmarkWords = (word, ref) => {
        const contents = ref;
        const highlightedWords = $(contents)
            .find('span.voca-highlighted')
            .filter((i, node) => new RegExp(`\\b${word}\\b`, 'gi').test(node.textContent));
        highlightedWords.contents().unwrap();
    };

    useEffect(() => {
        const uid = problemDatas[currentProblemIdx].passageUid;
        if (uid && passagesRef.current) {
            document.querySelector('div.passages').innerHTML = passageForRender[pUUIDs.findIndex((d) => d === uid)];
            for (let w of vocas) {
                setTimeout(() => {
                    unmarkWords(w, document.querySelector('div.passages'));
                }, 1);
                setTimeout(() => {
                    markWords(w, document.querySelector('div.passages'));
                }, 50);
            }
        }
    }, [problemDatas[currentProblemIdx].passageUid]);

    return (
        <RenderRoot>
            <HeaderToolbar>
                <HeaderTitle>
                    <h4>{title[problemDatas.length ? pUUIDs.findIndex((d) => d === problemDatas[currentProblemIdx].passageUid) : 0]}</h4>
                </HeaderTitle>
                <HeaderTimer
                    className={
                        preview
                            ? ''
                            : timeLimit !== -2
                            ? timer <= 30 && timer > 10
                                ? 'warning'
                                : timer <= 10 && timer !== -2
                                ? 'critical'
                                : ''
                            : ''
                    }
                >
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
                        {preview ? (
                            <AiOutlineClose onClick={handleEnd} style={{ cursor: 'pointer' }} />
                        ) : (
                            <>
                                {timeLimit === -2 ? (
                                    <StyleButton type={'save'} name="save" onClick={handleEnd}>
                                        저장하기
                                    </StyleButton>
                                ) : null}
                                <StyleButton type={'submit'} name="submit" onClick={handleEnd}>
                                    제출하기
                                </StyleButton>
                            </>
                        )}
                    </HeaderMasterSWs>
                </HeaderPageController>
            </HeaderToolbar>
            <ContentsContainer className="set-container" ref={contentsContainerRef}>
                <PassageContainer className="passages" ref={passagesRef}>
                    {/* {HtmlParser(passageForRender[pUUIDs.findIndex((d) => d === problemDatas[currentProblemIdx].passageUid)])} */}
                </PassageContainer>
                <ProblemsContainer className="problems" ref={problemsRef}>
                    {problemDatas.length > 0 ? (
                        <ProblemComponent
                            problemNumber={currentProblemIdx + 1}
                            category={problemDatas[currentProblemIdx].category}
                            type={problemDatas[currentProblemIdx].type}
                            textForRender={problemDatas[currentProblemIdx].textForRender}
                            selections={problemDatas[currentProblemIdx].selections}
                            answer={preview ? problemDatas[currentProblemIdx].answer : problemDatas[currentProblemIdx].answer}
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
                    ) : null}
                </ProblemsContainer>
            </ContentsContainer>
        </RenderRoot>
    );
}

SmartTOFELRender.defaultProps = {
    preview: false,
    title: ['타이틀'],
    pUUIDs: [''],
    passageForRender: [''],
    problemDatas: [],
    userDatas: {
        selections: [],
        lastProblem: 0,
        logs: [],
    },
    userAnswerDirect: null,
    timer: 90,
    savedVocas: [],
    onPrev() {},
    onNext() {},
    onEnd() {},
    onUserAnswerChanged() {},
};

export default React.memo(SmartTOFELRender);
