import React, { useState } from 'react';
import HtmlParser from 'react-html-parser';
import styled from 'styled-components';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { OutlinedInput, TextField, withStyles } from '@material-ui/core';

const Root = styled.div``;
const TextsContainer = styled.div``;
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

function ProblemComponent({ category, type, textForRender, selections, answer, score, currentSelection, onSelect }) {
    const handleSelection = (id) => () => {
        onSelect(id, answer === id);
    };

    const onTextFieldChange = ({ target }) => {
        const { name, value } = target;
        onSelect(value.toUpperCase(), answer === value.toUpperCase());
    };

    return (
        <Root>
            <TextsContainer>{HtmlParser(textForRender)}</TextsContainer>
            {type === 'short-answer' ? (
                <SelectionsContainer>
                    <UCOutlinedInput
                        variant="outlined"
                        size="small"
                        placeholder="정답 입력 (띄어쓰기 제외: ABC)"
                        fullWidth
                        value={currentSelection}
                        name="short_answer_input"
                        onChange={onTextFieldChange}
                    />
                </SelectionsContainer>
            ) : (
                <SelectionsContainer>
                    {selections[1] ? (
                        <Selection onClick={handleSelection(1)}>
                            {currentSelection === 1 ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                            <p>{selections[1]}</p>
                        </Selection>
                    ) : null}
                    {selections[2] ? (
                        <Selection onClick={handleSelection(2)}>
                            {currentSelection === 2 ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                            <p>{selections[2]}</p>
                        </Selection>
                    ) : null}
                    {selections[3] ? (
                        <Selection onClick={handleSelection(3)}>
                            {currentSelection === 3 ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                            <p>{selections[3]}</p>
                        </Selection>
                    ) : null}
                    {selections[4] ? (
                        <Selection onClick={handleSelection(4)}>
                            {currentSelection === 4 ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                            <p>{selections[4]}</p>
                        </Selection>
                    ) : null}
                    {selections[5] ? (
                        <Selection onClick={handleSelection(5)}>
                            {currentSelection === 5 ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
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
    onSelect() {},
};

export default React.memo(ProblemComponent);
