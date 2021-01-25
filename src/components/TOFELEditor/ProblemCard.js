import React, { useEffect, useRef, useState } from 'react';
import ReactHtmlParser from 'react-html-parser';
import styled from 'styled-components';
import * as $ from 'jquery';
import ProblemCategories from './ProblemCategories';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Checkbox, IconButton, withStyles } from '@material-ui/core';
import { RadioButtonChecked, RadioButtonCheckedOutlined, RadioButtonUnchecked } from '@material-ui/icons';
import EditorProblemRadioChecked from './assets/EditorProblemRadioChecked';
import EditorProblemRadioUnchecked from './assets/EditorProblemRadioUnchecked';
import EditorProblemCheckboxUnchecked from './assets/EditorProblemCheckboxUnchecked';
import EditorProblemCheckboxChecked from './assets/EditorProblemCheckboxChecked';

const EdCheckbox = withStyles((theme) => ({
    root: {
        '&:hover': {
            backgroundColor: '#ffffff00',
        },
    },
}))(Checkbox);
const EdIconButton = withStyles((theme) => ({
    root: {
        '&:hover': {
            backgroundColor: '#ffffff00',
        },
    },
}))(IconButton);
const Root = styled.div`
    /* padding-top: 24px; */
    display: flex;
    position: relative;

    & + & {
        margin-top: 32px;
    }
`;
const PCardActions = styled.div`
    display: flex;
    flex-direction: column;
    margin-right: 2px;
`;
const HiddenBorder = styled.div`
    cursor: move;
    display: flex;
    justify-content: flex-end;
    background-color: #777777;
    border: 2px solid #777777;
    border-radius: 4px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom: none;
    height: 20px;
    opacity: 0;
    padding: 0 4px;

    & button {
        color: #ffffff;
        margin-bottom: 2px;

        & + button {
            margin-left: 8px;
        }
    }

    &.hover {
        opacity: 1;
    }
`;
const ContentsContainer = styled.div`
    display: flex;
    flex-direction: row;
    min-width: 100px;
    min-height: 64px;
    border: 2px solid #e2e2e2;
    border-radius: 10px;
    font-size: 1rem;
    font-family: Noto Sans CJK KR;
    overflow: auto;
    padding: 18px 28px;
    width: 100%;

    &.checked {
        border-color: #484848;
    }

    & div.order-number {
        display: flex;
        color: #707070;
        line-height: 1.5rem;
        margin-right: 18px;
    }
`;
const Contents = styled.div`
    display: inherit;
    flex-direction: column;

    & div {
        color: #707070;
        font-family: inherit;
        font-size: 1rem;
        font-weight: 400;
        /* line-height: 1rem; */

        &.selection {
            color: rgba(112, 112, 112, 0.79);
            display: flex;
            font-family: inherit;
            font-weight: 400;

            & .answer-selected-icon {
                margin-right: 20px;
            }

            & .selection-text {
                color: rgba(112, 112, 112, 0.79);
            }

            & + .selection {
                margin-top: 12px;
            }
        }
    }

    & .ql-container.ql-snow {
        border: none;
        font-family: inherit;
        font-size: 1rem;
    }

    &.hover {
        border: 2px solid #777777;
        border-top: none;
    }
`;

const ShortAnswerBox = styled.div`
    background-color: #f6f7f9;
    border-radius: 10px;
    display: flex;
    align-items: center;
    padding: 0 32px 0 24px;
    margin-top: 16px;
    min-height: 40px;
    width: fit-content;

    & p {
        color: rgba(112, 112, 112, 0.79);
    }

    & span {
        color: rgba(112, 112, 112, 0.79);
    }
`;

function ProblemCard({
    orderNumber,
    category,
    type,
    textForRender,
    selections,
    answer,
    score,
    handleEdit,
    handleDelete,
    handleProblemCardCheckChanged,
}) {
    const rootRef = useRef();
    const hiddenMenuRef = useRef();
    const contentsRef = useRef();
    const [cardChecked, setCardChecked] = useState(false);

    const SelectionRender = (selection, num, answer) => {
        return selection ? (
            <div className="selection">
                <div className="answer-selected-icon">
                    {num === answer ? <EditorProblemRadioChecked /> : <EditorProblemRadioUnchecked />}
                </div>
                <div className="selection-text">{selection}</div>
            </div>
        ) : null;
    };

    const handleCardCheckChange = ({ target }) => {
        const { checked } = target;
        setCardChecked(checked);
        handleProblemCardCheckChanged(orderNumber, checked);
    };

    useEffect(() => {
        $(hiddenMenuRef.current).on('mouseover', () => {
            $(hiddenMenuRef.current).addClass('hover');
            $(contentsRef.current).addClass('hover');
            $(rootRef.current).attr('draggable', true);
        });
        $(hiddenMenuRef.current).on('mouseout', () => {
            $(hiddenMenuRef.current).removeClass('hover');
            $(contentsRef.current).removeClass('hover');
            $(rootRef.current).removeAttr('draggable');
        });
    }, []);

    return (
        <Root ref={rootRef}>
            <PCardActions>
                <EdCheckbox
                    icon={<EditorProblemCheckboxUnchecked />}
                    checkedIcon={<EditorProblemCheckboxChecked />}
                    disableRipple
                    size="medium"
                    color="default"
                    onChange={handleCardCheckChange}
                />
                <EdIconButton disableRipple size="medium" aria-label="edit" onClick={handleEdit}>
                    <EditIcon fontSize="inherit" />
                </EdIconButton>
            </PCardActions>
            {/* <HiddenBorder ref={hiddenMenuRef}>
                <IconButton aria-label="edit" size="small" onClick={handleEdit}>
                    <EditIcon fontSize="inherit" />
                </IconButton>
                <IconButton aria-label="delete" size="small" onClick={handleDelete}>
                    <DeleteIcon fontSize="inherit" />
                </IconButton>
            </HiddenBorder> */}
            <ContentsContainer className={`${cardChecked ? 'checked' : ''}`}>
                <div className="order-number">{orderNumber + 1}.</div>
                <Contents ref={contentsRef}>
                    <div className="ql-container ql-snow" style={{ marginBottom: '1rem' }}>
                        {ReactHtmlParser(textForRender)}
                    </div>
                    {type === 'short-answer' ? (
                        <>
                            <ShortAnswerBox>
                                <p>
                                    <span>정답</span>
                                    <span style={{ padding: '0 32px 0 24px' }}>|</span>
                                    {answer}
                                </p>
                            </ShortAnswerBox>
                        </>
                    ) : (
                        <>
                            {SelectionRender(selections[1], 1, answer)}
                            {SelectionRender(selections[2], 2, answer)}
                            {SelectionRender(selections[3], 3, answer)}
                            {SelectionRender(selections[4], 4, answer)}
                            {SelectionRender(selections[5], 5, answer)}
                        </>
                    )}
                    {/* <p style={{ marginTop: '0.5rem' }}>유형: {category ? ProblemCategories[category - 1].name : '기타'}</p>
                <p style={{ marginTop: '0.375rem' }}>정답: {answer}</p>
                <p style={{ marginTop: '0.375rem' }}>배점: {score}</p> */}
                </Contents>
            </ContentsContainer>
        </Root>
    );
}

ProblemCard.defaultProps = {
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
    handleProblemCardCheckChanged(no) {
        console.log(no);
    },
};

export default ProblemCard;
