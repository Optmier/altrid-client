import React, { useEffect, useRef } from 'react';
import ReactHtmlParser from 'react-html-parser';
import styled from 'styled-components';
import * as $ from 'jquery';
import ProblemCategories from './ProblemCategories';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { IconButton } from '@material-ui/core';

const Root = styled.div`
    /* padding-top: 24px; */
    position: relative;
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
const Contents = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 100px;
    min-height: 64px;
    border: 2px solid transparent;
    border-radius: 4px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-top: none;
    font-size: 0.75rem;
    overflow: auto;
    padding: 6px;

    & p {
        font-size: 0.75rem;
        line-height: 0.98rem;

        &.selection {
            font-family: initial;
            font-weight: 700;
            margin-left: 0.75rem;

            & + .selection {
                margin-top: 0.375rem;
            }
        }
    }

    & .ql-container.ql-snow {
        border: none;
    }

    &.hover {
        border: 2px solid #777777;
        border-top: none;
    }
`;

function ProblemCard({ category, type, textForRender, selections, answer, handleEdit, handleDelete }) {
    const rootRef = useRef();
    const hiddenMenuRef = useRef();
    const contentsRef = useRef();

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
            <HiddenBorder ref={hiddenMenuRef}>
                <IconButton aria-label="edit" size="small" onClick={handleEdit}>
                    <EditIcon fontSize="inherit" />
                </IconButton>
                <IconButton aria-label="delete" size="small" onClick={handleDelete}>
                    <DeleteIcon fontSize="inherit" />
                </IconButton>
            </HiddenBorder>
            <Contents ref={contentsRef}>
                <div className="ql-container ql-snow" style={{ marginBottom: '0.5rem' }}>
                    {ReactHtmlParser(textForRender)}
                </div>
                <p className="selection">{selections[1]}</p>
                <p className="selection">{selections[2]}</p>
                <p className="selection">{selections[3]}</p>
                <p className="selection">{selections[4]}</p>
                <p className="selection">{selections[5]}</p>
                <p style={{ marginTop: '0.5rem' }}>유형: {category ? ProblemCategories[category - 1].name : '기타'}</p>
                <p style={{ marginTop: '0.375rem' }}>정답: {answer}</p>
            </Contents>
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
};

export default ProblemCard;
