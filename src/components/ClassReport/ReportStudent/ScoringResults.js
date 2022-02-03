/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-computed-key */
import {
    Accordion as MuiAccordion,
    AccordionDetails as MuiAccordionDetails,
    AccordionSummary as MuiAccordionSummary,
    withStyles,
} from '@material-ui/core';
import Button from '../../../AltridUI/Button/Button';
import React, { useEffect, useState } from 'react';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import HtmlParser from 'react-html-parser';
import styled from 'styled-components';
import ScoringDetailsChoosenIcon from '../../../AltridUI/Icons/ScoringDetailsChoosenIcon';
import ScoringDetailsHandsUpIcon from '../../../AltridUI/Icons/ScoringDetailsHandsUpIcon';
import ScoringDetailsStarringIcon from '../../../AltridUI/Icons/ScoringDetailsStarringIcon';
import AccordionArrowIcon from '../../../AltridUI/Icons/AccordionArrowIcon';
import { Dialog as AltridDialog } from '../../../AltridUI/AlertnDialog/AlertnDialog';

const TextsContentsRenderRoot = styled.div`
    border: 1px solid transparent;
    min-width: 320px;
    overflow-x: auto;
    @media all and (max-width: 640px) {
        border-color: #e9edef;
        border-radius: 8px;
    }
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
    font-family: inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji',
        'Segoe UI Emoji', 'Segoe UI Symbol';
    font-size: 1.125rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.375rem;
    justify-content: space-between;
    width: 100%;
    @media all and (max-width: 640px) {
        flex-direction: column;
    }
`;
const SummaryTextInfos = styled.div`
    align-items: center;
    display: flex;
    width: 55%;
    @media all and (max-width: 768px) {
        width: 48%;
    }
    @media all and (max-width: 640px) {
        align-self: flex-start;
        width: 100%;
    }
`;
const SummaryNoTitle = styled.div`
    flex-basis: 30%;
    width: 2.6rem;
    @media all and (max-width: 640px) {
        margin-right: auto;
    }
`;
const SummarySpentTime = styled.div`
    flex-basis: 40%;
    width: 48px;
    @media all and (max-width: 640px) {
        flex-basis: 20%;
    }
`;
const SummaryIsCorrect = styled.div`
    color: ${({ userAnswer, isCorrect }) => (!userAnswer ? '#4D5C6A' : isCorrect ? '#0CB573' : '#E11900')};
    flex-basis: 30%;
    width: 2.7rem;
    @media all and (max-width: 640px) {
        flex-basis: initial;
        padding-right: 32px;
        text-align: end;
    }
`;
const SummaryIcons = styled.div`
    align-items: center;
    display: flex;
    justify-content: flex-end;
    margin-left: auto;
    margin-right: 24px;
    width: 92px;
    @media all and (max-width: 840px) {
        align-self: flex-start;
        margin-right: 16px;
    }
    @media all and (max-width: 680px) {
        align-self: flex-start;
        margin-right: 2px;
    }
    @media all and (max-width: 640px) {
        align-self: flex-start;
        margin: 16px 0 8px 0;
    }
`;
const SummaryIconStarred = styled.div`
    /* flex-basis: 33.33%; */
    align-items: center;
    display: flex;
    width: 2em;
`;
const SummaryIconHandsUp = styled.div`
    /* flex-basis: 66.66%; */
    align-items: center;
    display: flex;
    width: 2em;
`;
const SummaryIconTeacherSelected = styled.div`
    /* flex-basis: 99.99%; */
    align-items: center;
    display: flex;
    width: 2em;
`;
const SummaryActions = styled.div`
    justify-content: flex-end;
    width: 120px;
    @media all and (max-width: 640px) {
        display: none;
    }
`;
const DetailActions = styled.div`
    align-items: center;
    display: none;
    margin-top: 8px;
    width: 100%;
    @media all and (max-width: 640px) {
        display: flex;
    }
`;

const Accordion = withStyles({
    root: {
        boxShadow: 'none',
        '&:not(:first-child)': {
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
        },
        '&:last-child': {
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
        },
        '&:not(:last-child)': {
            borderBottom: 0,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
        '& + &': {
            marginTop: 2,
        },
        ['@media all and (max-width: 640px)']: {
            '& + &': {
                marginTop: 8,
            },
        },
    },
    expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
    root: {
        backgroundColor: ({ mark }) => (mark % 2 === 1 ? '#F6F8F9' : '#ffffff'),
        borderTop: '2px solid transparent',
        borderLeft: '2px solid transparent',
        borderRight: '2px solid transparent',
        borderRadius: 8,
        marginBottom: 0,
        minHeight: 44,
        paddingLeft: 0,
        '&$expanded': {
            borderColor: '#6C46A1',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            minHeight: 44,
        },
        ['@media all and (max-width: 640px)']: {
            backgroundColor: '#F6F8F9 !important',
            paddingRight: 0,
            '&$expanded': {
                backgroundColor: '#ffffff !important',
            },
        },
    },
    content: {
        alignItems: 'center',
        margin: '0 32px',
        color: '#11171C',
        '&$expanded': {
            margin: '0 32px',
        },
        ['@media (min-width: 0) and (max-width: 768px)']: {
            margin: '0 10px 0 16px',
            '&$expanded': {
                margin: '0 10px 0 16px',
            },
        },
        ['@media all and (max-width: 640px)']: {
            // flexDirection: 'column',
            margin: 0,
            padding: '16px 16px 8px 16px',
            '&$expanded': {
                margin: 0,
            },
        },
    },
    expandIcon: {
        ['@media all and (max-width: 640px)']: {
            right: 16,
            top: 4,
            position: 'absolute',
        },
    },
    expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
    root: {
        borderBottom: '2px solid #6C46A1',
        borderLeft: '2px solid #6C46A1',
        borderRight: '2px solid #6C46A1',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        padding: theme.spacing(2),
        '&$expanded': {
            borderColor: '#6C46A1',
            minHeight: 44,
        },
        ['@media all and (max-width: 640px)']: {
            flexDirection: 'column',
            paddingTop: 0,
        },
    },
}))(MuiAccordionDetails);

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
        <AltridDialog
            open={open}
            onClose={handleClose}
            title="상세한 채점 결과"
            actionFirst={handleClose}
            fullWidth
            fullMobile
            maxWidth={768}
        >
            {totalProblems.map((d, idx) => (
                <Accordion key={d.uuid} expanded={expanded === d.uuid} onChange={handleChange(d.uuid, d.passageUid)}>
                    <AccordionSummary
                        mark={idx}
                        expandIcon={<AccordionArrowIcon />}
                        aria-controls={`${d.uuid}bh-content`}
                        id={`${d.uuid}bh-header`}
                    >
                        <SummaryRoot onClick={(e) => e.stopPropagation()}>
                            <SummaryTextInfos>
                                <SummaryNoTitle>#{idx + 1}</SummaryNoTitle>
                                <SummarySpentTime>{d.spentTime === null ? '' : d.spentTime + '초'}</SummarySpentTime>
                                <SummaryIsCorrect userAnswer={d.userAnswer} isCorrect={d.isCorrect}>
                                    {!d.userAnswer ? '미응답' : d.isCorrect ? '정답' : '오답'}
                                </SummaryIsCorrect>
                            </SummaryTextInfos>

                            <SummaryIcons>
                                <SummaryIconHandsUp>
                                    <ScoringDetailsHandsUpIcon fillColor={d.handsUp ? '#6C46A1' : '#BFC6CD'} />
                                </SummaryIconHandsUp>
                                <SummaryIconStarred>
                                    <ScoringDetailsStarringIcon fillColor={d.starred ? '#6C46A1' : '#BFC6CD'} />
                                </SummaryIconStarred>
                                <SummaryIconTeacherSelected>
                                    <ScoringDetailsChoosenIcon fillColor={d.teacherSelected ? '#6C46A1' : '#BFC6CD'} />
                                </SummaryIconTeacherSelected>
                            </SummaryIcons>
                            <SummaryActions>
                                <Button
                                    fullWidth
                                    sizes="small"
                                    colors="purple"
                                    variant={d.handsUp ? 'filled' : 'light'}
                                    leftIcon={
                                        <ScoringDetailsHandsUpIcon fontSize="inherit" fillColor={d.handsUp ? '#ffffff' : '#6C46A1'} />
                                    }
                                    onClick={() => {
                                        actionClickHandsUp(idx, d.handsUp, d.teacherSelected);
                                    }}
                                >
                                    {d.handsUp ? '손 내리기' : '손 들기'}
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
                        <DetailActions>
                            <Button
                                fullWidth
                                sizes="small"
                                colors="purple"
                                variant={d.handsUp ? 'filled' : 'light'}
                                leftIcon={<ScoringDetailsHandsUpIcon fontSize="inherit" fillColor={d.handsUp ? '#ffffff' : '#6C46A1'} />}
                                onClick={() => {
                                    actionClickHandsUp(idx, d.handsUp, d.teacherSelected);
                                }}
                            >
                                {d.handsUp ? '손 내리기' : '손 들기'}
                            </Button>
                        </DetailActions>
                    </AccordionDetails>
                </Accordion>
            ))}
        </AltridDialog>
    );
}

ScoringResults.defaultProps = {};

export default ScoringResults;
