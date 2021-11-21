import React, { useEffect, useRef, useState } from 'react';
import HtmlParser from 'react-html-parser';
import styled from 'styled-components';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { OutlinedInput, TextField, withStyles } from '@material-ui/core';
import StarredImage from '../../images/starred.png';
import ScoringDetailsStarringIcon from '../../AltridUI/Icons/ScoringDetailsStarringIcon';
import AssignmentsStarringIcon from '../../AltridUI/Icons/AssignmentsStarringIcon';

const Root = styled.div`
    position: relative;
`;
const ProblemNumber = styled.span`
    cursor: pointer;
    font-family: 'Times New Roman';
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 600;
    margin-right: 0.4rem;
    margin-left: 0.3rem;
    position: relative;
    user-select: none;

    & div.starred-mark {
        background: url(${StarredImage});
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        position: absolute;
        height: 2.2rem;
        width: 2.2rem;
        margin-top: -0.3rem;
        margin-left: -0.4rem;
        opacity: 0.9;
    }
`;
const TextsContainer = styled.div`
    display: inline-flex;
    flex-direction: column;
`;
const SelectionsContainer = styled.div`
    margin-top: 20px;
    margin-left: 4px;
`;
const Selection = styled.div`
    cursor: pointer;
    display: flex;
    margin-top: 16px;

    & p {
        margin-left: 16px;
        font-weight: 600;
    }
`;

const UCOutlinedInput = withStyles((theme) => ({
    root: {
        '& input': {
            textTransform: 'uppercase',
        },
    },
}))(OutlinedInput);

const StarredButton = styled.button`
    align-items: center;
    background-color: #f4f1fa;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    padding: 0;
    position: absolute;
    top: 0;
    right: 4px;
    width: 24px;
    height: 24px;
    & svg {
        margin-top: -1px;
    }
`;

function ProblemComponent({
    problemNumber,
    category,
    type,
    textForRender,
    selections,
    answer,
    score,
    currentSelection,
    onSelect,
    starred,
    onProblemNumberDoubleClick,
}) {
    const shortAnswerFieldRef = useRef();
    const textContainerRef = useRef();
    const handleSelection = (id) => () => {
        onSelect(id, answer === id);
    };

    const onTextFieldChange = ({ target }) => {
        const { name, value } = target;
        onSelect(value.toUpperCase(), answer === value.toUpperCase());
    };

    const actionProblemNumberDoubleClick = () => {
        onProblemNumberDoubleClick();
    };

    useEffect(() => {
        // const firstP = textContainerRef.current.getElementsByTagName('p')[0];
        // const exists = firstP.getElementsByClassName('problem-number');
        // exists.length && firstP.removeChild(exists[0]);
        // const nums = document.createElement('span');
        // nums.className = 'problem-number';
        // nums.style.fontWeight = 600;
        // nums.innerHTML = problemNumber + '. ';
        // firstP.prepend(nums);
    }, [problemNumber]);

    useEffect(() => {
        if (!shortAnswerFieldRef.current) return;
        shortAnswerFieldRef.current.value = currentSelection;
    }, [currentSelection]);

    return (
        <Root>
            <ProblemNumber className="problem-number" onDoubleClick={actionProblemNumberDoubleClick}>
                {starred ? <div className="starred-mark"></div> : null}
                {problemNumber}.
            </ProblemNumber>
            <TextsContainer ref={textContainerRef}>{HtmlParser(textForRender)}</TextsContainer>
            <StarredButton>
                <AssignmentsStarringIcon fillColor={starred ? undefined : '#BFC6CD'} />
            </StarredButton>
            {type === 'short-answer' ? (
                <SelectionsContainer>
                    <UCOutlinedInput
                        variant="outlined"
                        size="small"
                        placeholder="정답 입력 (띄어쓰기 제외: 예] ABC)"
                        fullWidth
                        inputRef={shortAnswerFieldRef}
                        name="short_answer_input"
                        onBlur={onTextFieldChange}
                    />
                </SelectionsContainer>
            ) : (
                <SelectionsContainer>
                    {selections[1] ? (
                        <Selection onClick={handleSelection(1)}>
                            {currentSelection === 1 ? (
                                <CheckCircleIcon htmlColor="#757575" />
                            ) : (
                                <RadioButtonUncheckedIcon htmlColor="#757575" />
                            )}
                            <p>{selections[1]}</p>
                        </Selection>
                    ) : null}
                    {selections[2] ? (
                        <Selection onClick={handleSelection(2)}>
                            {currentSelection === 2 ? (
                                <CheckCircleIcon htmlColor="#757575" />
                            ) : (
                                <RadioButtonUncheckedIcon htmlColor="#757575" />
                            )}
                            <p>{selections[2]}</p>
                        </Selection>
                    ) : null}
                    {selections[3] ? (
                        <Selection onClick={handleSelection(3)}>
                            {currentSelection === 3 ? (
                                <CheckCircleIcon htmlColor="#757575" />
                            ) : (
                                <RadioButtonUncheckedIcon htmlColor="#757575" />
                            )}
                            <p>{selections[3]}</p>
                        </Selection>
                    ) : null}
                    {selections[4] ? (
                        <Selection onClick={handleSelection(4)}>
                            {currentSelection === 4 ? (
                                <CheckCircleIcon htmlColor="#757575" />
                            ) : (
                                <RadioButtonUncheckedIcon htmlColor="#757575" />
                            )}
                            <p>{selections[4]}</p>
                        </Selection>
                    ) : null}
                    {selections[5] ? (
                        <Selection onClick={handleSelection(5)}>
                            {currentSelection === 5 ? (
                                <CheckCircleIcon htmlColor="#757575" />
                            ) : (
                                <RadioButtonUncheckedIcon htmlColor="#757575" />
                            )}
                            <p>{selections[5]}</p>
                        </Selection>
                    ) : null}
                </SelectionsContainer>
            )}
        </Root>
    );
}

ProblemComponent.defaultProps = {
    category: 1,
    type: 'multiple-choice',
    textForRender: '',
    selections: {
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
    },
    answer: '',
    score: 0,
    currentSelection: 0,
    starred: false,
    onSelect() {},
    onProblemNumberDoubleClick() {},
};

export default React.memo(ProblemComponent);
