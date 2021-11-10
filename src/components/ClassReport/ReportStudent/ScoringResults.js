import { Accordion, AccordionDetails, AccordionSummary, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import Button from '../../../AltridUI/Button/Button';
import React, { useEffect, useState } from 'react';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import HandsUpIcon from '@material-ui/icons/PanTool';
import StarIcon from '@material-ui/icons/Star';
import HtmlParser from 'react-html-parser';
import styled from 'styled-components';

const TextsContentsRenderRoot = styled.div`
    min-width: 320px;
    overflow-x: auto;
`;
const TextsContentsTitle = styled.div`
    font-weight: 600;
`;
const TextContentsBody = styled.div`
    display: flex;
    margin-top: 1rem;
`;

const PassageContainer = styled.div`
    overflow-y: auto;
    padding-right: 16px;
    min-width: 240px;
    height: 240px;
    width: 70%;
    & p {
        font-size: 0.875rem;
        line-height: 1rem;
    }
`;
const QuestionContainer = styled.div`
    border-left: 1px solid #9aa5af;
    font-size: 0.875rem;
    line-height: 1rem;
    overflow-y: auto;
    padding-left: 16px;
    min-width: 180px;
    height: 240px;
    width: 30%;
`;

const Question = styled.div`
    & p {
        font-size: 0.875rem;
        line-height: 1rem;
    }
`;
const Selections = styled.div`
    margin-top: 1rem;
`;

const SelectionEl = styled.div`
    align-items: center;
    display: flex;
    padding: 2px 0;
`;
const SelectionElIcon = styled.div`
    margin-right: 8px;
    width: 1em;
    height: 1em;
`;

const SelectionsComp = ({ selections, selected }) => {
    return (
        <>
            {selections.map((str, idx) => (
                <SelectionEl key={idx}>
                    <SelectionElIcon>{idx + 1 === selected ? <CheckCircleIcon fontSize="inherit" /> : null}</SelectionElIcon>
                    {str}
                </SelectionEl>
            ))}
        </>
    );
};

////////////////////////////////////////////////////////////

const SummaryRoot = styled.div`
    align-items: center;
    display: flex;
    font-family: inter, -apple-system, BlinkMacSystemFont, “Segoe UI”, Roboto, “Helvetica Neue”, Arial, sans-serif, “Apple Color Emoji”,
        “Segoe UI Emoji”, “Segoe UI Symbol”;
    justify-content: space-between;
    width: 100%;
`;
const SummaryNoTitle = styled.div`
    flex-basis: 11%;
    font-weight: 600;
    width: 2.6rem;
`;
const SummaryIsCorrect = styled.div`
    color: ${({ userAnswer, isCorrect }) => (!userAnswer ? '#4D5C6A' : isCorrect ? '#0CB573' : '#E11900')};
    flex-basis: 13%;
    text-align: left;
    width: 2.7rem;
`;
const SummarySpentTime = styled.div`
    flex-basis: 13%;
    text-align: right;
    width: 3rem;
`;
const SummaryIcons = styled.div`
    flex-basis: 30%;
    align-items: center;
    display: flex;
    justify-content: flex-end;
    width: 64px;
`;
const SummaryIconStarred = styled.div`
    /* flex-basis: 33.33%; */
    width: 2em;
`;
const SummaryIconHandsUp = styled.div`
    /* flex-basis: 66.66%; */
    width: 2em;
`;
const SummaryIconTeacherSelected = styled.div`
    /* flex-basis: 99.99%; */
    width: 2em;
`;
const SummaryActions = styled.div`
    justify-content: flex-end;
    width: 92px;
`;

function ScoringResults({
    open,
    userData,
    handsUp,
    teacherSelected,
    spentTime,
    contentsData,
    actionClickHandsUpButton,
    handleClose,
    children,
}) {
    const [totalProblems, setTotalProblems] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const [selectedPassage, setSelectedPassage] = useState({ title: '', renderContents: null });
    const [selectedQuestion, setSelectedQuestion] = useState({ renderContents: null, selections: [], type: '', userAnswer: null });

    const handleChange = (questionId, passageId) => (event, isExpanded) => {
        setExpanded(isExpanded ? questionId : false);
        const findedContents = contentsData.find(({ uuid }) => uuid === passageId);
        const findedQuestion = totalProblems.find(({ uuid }) => uuid === questionId);
        if (isExpanded) {
            setSelectedPassage({ title: findedContents.title, renderContents: findedContents.passageForRender });
            setSelectedQuestion({
                renderContents: findedQuestion.textForRender,
                selections: Object.keys(findedQuestion.selections).map((key) => findedQuestion.selections[key]),
                type: findedQuestion.type,
                userAnswer: findedQuestion.userAnswer,
            });
        } else {
            setSelectedPassage({ title: '', renderContents: null });
            setSelectedQuestion({ renderContents: null, selections: [], type: '', userAnswer: null });
        }
    };

    const actionClickHandsUp = (idx, isHandsUp, isTeacherSelected) => {
        actionClickHandsUpButton(idx, null, isHandsUp, isTeacherSelected);
    };

    useEffect(() => {
        if (!userData || !userData.length || !contentsData || !contentsData.length) return;
        // console.log(userData, contentsData, handsUp, teacherSelected, spentTime);
        setTotalProblems(
            contentsData
                .flatMap((m) => m.problemDatas)
                .map((d, idx) => ({
                    ...d,
                    userAnswer: userData[idx] ? userData[idx].answerUser : null,
                    isCorrect: userData[idx] ? userData[idx].correct : false,
                    starred: userData[idx] ? userData[idx].starred : false,
                    handsUp: handsUp.includes(idx),
                    teacherSelected: teacherSelected.includes(idx),
                    spentTime: spentTime[idx] ? spentTime[idx].time : null,
                })),
        );
    }, [userData, contentsData, handsUp, teacherSelected]);

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>상세한 채점 결과</DialogTitle>
            <DialogContent dividers>
                {totalProblems.map((d, idx) => (
                    <Accordion key={d.uuid} expanded={expanded === d.uuid} onChange={handleChange(d.uuid, d.passageUid)}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`${d.uuid}bh-content`} id={`${d.uuid}bh-header`}>
                            <SummaryRoot onClick={(e) => e.stopPropagation()}>
                                <SummaryNoTitle>#{idx + 1}</SummaryNoTitle>
                                <SummaryIsCorrect userAnswer={d.userAnswer} isCorrect={d.isCorrect}>
                                    {!d.userAnswer ? '미응답' : d.isCorrect ? '정답' : '오답'}
                                </SummaryIsCorrect>
                                <SummarySpentTime>{d.spentTime === null ? '' : d.spentTime + '초'}</SummarySpentTime>
                                <SummaryIcons>
                                    <SummaryIconStarred>
                                        {d.starred ? <StarIcon fontSize="inherit" color="inherit" /> : null}
                                    </SummaryIconStarred>
                                    <SummaryIconHandsUp>
                                        {d.handsUp ? <HandsUpIcon fontSize="inherit" color="inherit" /> : null}
                                    </SummaryIconHandsUp>
                                    <SummaryIconTeacherSelected>
                                        {d.teacherSelected ? <CheckCircleIcon fontSize="inherit" color="inherit" /> : null}
                                    </SummaryIconTeacherSelected>
                                </SummaryIcons>
                                <SummaryActions>
                                    <Button
                                        fullWidth
                                        sizes="xsmall"
                                        colors="green"
                                        variant={d.handsUp ? 'filled' : 'light'}
                                        leftIcon={<HandsUpIcon fontSize="inherit" />}
                                        onClick={() => {
                                            actionClickHandsUp(idx, d.handsUp, d.teacherSelected);
                                        }}
                                    >
                                        {d.handsUp ? '손들기 해제' : '손들기'}
                                    </Button>
                                </SummaryActions>
                            </SummaryRoot>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TextsContentsRenderRoot>
                                <TextsContentsTitle>{selectedPassage.title}</TextsContentsTitle>
                                <TextContentsBody>
                                    <PassageContainer>{HtmlParser(selectedPassage.renderContents)}</PassageContainer>
                                    <QuestionContainer>
                                        <Question>{HtmlParser(selectedQuestion.renderContents)}</Question>
                                        <Selections>
                                            {selectedQuestion.type === 'multiple-choice' ? (
                                                <SelectionsComp
                                                    selections={selectedQuestion.selections}
                                                    selected={selectedQuestion.userAnswer}
                                                />
                                            ) : (
                                                selectedQuestion.userAnswer
                                            )}
                                        </Selections>
                                    </QuestionContainer>
                                </TextContentsBody>
                            </TextsContentsRenderRoot>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </DialogContent>
            <DialogActions>
                <Button variant="default" colors="black" sizes="medium" onClick={handleClose}>
                    확인
                </Button>
            </DialogActions>
        </Dialog>
    );
}

ScoringResults.defaultProps = {};

export default ScoringResults;
