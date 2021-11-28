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
const ProblemContainer = styled.div`
    display: flex;
    position: relative;
`;
const ProblemNumber = styled.span`
    cursor: pointer;
    font-family: 'Times New Roman';
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 600;
    margin-right: 0.4rem;
    position: relative;
    user-select: none;
`;
const TextsContainer = styled.div`
    display: inline-flex;
    flex-direction: column;
    margin-right: 30px;
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
    vocas,
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
    onStarringClick,
}) {
    const shortAnswerFieldRef = useRef();
    const textContainerRef = useRef();
    const [renderTextContents, setRenderTextContents] = useState(null);
    const handleSelection = (id) => () => {
        onSelect(id, answer === id);
    };

    const onTextFieldChange = ({ target }) => {
        const { name, value } = target;
        onSelect(value.toUpperCase(), answer === value.toUpperCase());
    };

    const actionClickStarring = () => {
        onStarringClick();
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

    useEffect(() => {
        // setRenderTextContents(textForRender);
    }, [textForRender]);

    const markWords = (words) => {
        let replaceHtml = textForRender;
        for (let word of words) {
            const wordCases = [word.toLowerCase(), word.toUpperCase(), word.charAt(0).toUpperCase() + word.slice(1)];
            for (let wc of wordCases) {
                const replacement = new RegExp(`(?<!<[^>]*)\\b${wc}\\b`, 'g');
                replaceHtml = replaceHtml.replace(replacement, `<span class="voca-highlighted">${wc}</span>`);
            }
        }
        setRenderTextContents(HtmlParser(replaceHtml));
    };

    useEffect(() => {
        if (!vocas.length) {
            setRenderTextContents(HtmlParser(textForRender));
            return;
        }
        markWords(vocas);
    }, [vocas, textForRender]);

    const SelectionWordRenderer = (string, words) => {
        let replaceHtml = string;
        for (let word of words) {
            const wordCases = [word.toLowerCase(), word.toUpperCase(), word.charAt(0).toUpperCase() + word.slice(1)];
            for (let wc of wordCases) {
                const replacement = new RegExp(`(?<!<[^>]*)\\b${wc}\\b`, 'g');
                replaceHtml = replaceHtml.replace(replacement, `<span class="voca-highlighted">${wc}</span>`);
            }
        }
        return HtmlParser(replaceHtml);
    };

    return (
        <Root>
            <ProblemContainer>
                <ProblemNumber className="problem-number">{problemNumber}.</ProblemNumber>
                <TextsContainer ref={textContainerRef}>{renderTextContents}</TextsContainer>
                <StarredButton>
                    <AssignmentsStarringIcon fillColor={starred ? undefined : '#BFC6CD'} onClick={actionClickStarring} />
                </StarredButton>
            </ProblemContainer>
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
                            <p>{SelectionWordRenderer(selections[1], vocas)}</p>
                        </Selection>
                    ) : null}
                    {selections[2] ? (
                        <Selection onClick={handleSelection(2)}>
                            {currentSelection === 2 ? (
                                <CheckCircleIcon htmlColor="#757575" />
                            ) : (
                                <RadioButtonUncheckedIcon htmlColor="#757575" />
                            )}
                            <p>{SelectionWordRenderer(selections[2], vocas)}</p>
                        </Selection>
                    ) : null}
                    {selections[3] ? (
                        <Selection onClick={handleSelection(3)}>
                            {currentSelection === 3 ? (
                                <CheckCircleIcon htmlColor="#757575" />
                            ) : (
                                <RadioButtonUncheckedIcon htmlColor="#757575" />
                            )}
                            <p>{SelectionWordRenderer(selections[3], vocas)}</p>
                        </Selection>
                    ) : null}
                    {selections[4] ? (
                        <Selection onClick={handleSelection(4)}>
                            {currentSelection === 4 ? (
                                <CheckCircleIcon htmlColor="#757575" />
                            ) : (
                                <RadioButtonUncheckedIcon htmlColor="#757575" />
                            )}
                            <p>{SelectionWordRenderer(selections[4], vocas)}</p>
                        </Selection>
                    ) : null}
                    {selections[5] ? (
                        <Selection onClick={handleSelection(5)}>
                            {currentSelection === 5 ? (
                                <CheckCircleIcon htmlColor="#757575" />
                            ) : (
                                <RadioButtonUncheckedIcon htmlColor="#757575" />
                            )}
                            <p>{SelectionWordRenderer(selections[5], vocas)}</p>
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
    vocas: [],
    onSelect() {},
    onProblemNumberDoubleClick() {},
};

export default React.memo(ProblemComponent);
