import React, { useEffect, useRef, useState } from 'react';
import HtmlParser from 'react-html-parser';
import styled from 'styled-components';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { OutlinedInput, TextField, withStyles } from '@material-ui/core';
import StarredImage from '../../images/starred.png';

const Root = styled.div``;
const TextsContainer = styled.div`
    display: inline-flex;

    & span.problem-number {
        cursor: pointer;
        font-family: 'Times New Roman';
        font-size: 1rem;
        line-height: 1.5rem;
        font-weight: 600;
        margin-right: 0.3rem;
        margin-left: 0.5rem;
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
            margin-left: -0.75em;
            opacity: 0.9;
        }
    }
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
            <TextsContainer ref={textContainerRef}>
                <span
                    className="problem-number"
                    // style={{ background: `url(${StarredImage})` }}
                    onDoubleClick={actionProblemNumberDoubleClick}
                >
                    {starred ? <div className="starred-mark"></div> : null}
                    {problemNumber}.
                </span>
                {HtmlParser(textForRender)}
            </TextsContainer>
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
