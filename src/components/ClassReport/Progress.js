import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Tooltip, withStyles } from '@material-ui/core';
import PanToolIcon from '@material-ui/icons/PanTool';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

const StyleTestSquareList = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    & .square {
        min-width: 30px;
        width: -webkit-fill-available;
        height: 30px;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        & .inner-icon {
            font-size: 1rem;
            &.teacher-selected {
                color: #3b168a;
            }
            & + .inner-icon {
                margin-left: 0.2rem;
            }
        }
    }
    & .square + .square {
        margin-left: 5px;
    }
    & + & {
        margin-top: 5px;
    }
`;
const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
        padding: '0.5rem 1rem',
        fontSize: '0.75rem',
        fontWeight: '500',
        borderRadius: '5px',
    },
}))(Tooltip);
function Progress({ mode, idx, selections, problemNumbers, onDoubleClick, handsUp, teacherSelected }) {
    const [squares, setSquars] = useState([]);

    const makesMoney = () => {
        const limiter = mode ? selections.length : problemNumbers;

        for (let i = 0; i < limiter; i++) {
            const isHandsUp = handsUp.find((d) => d === i + limiter * idx) !== undefined;
            const isTeacherSelected = teacherSelected.find((d) => d === i + limiter * idx) !== undefined;
            if (!selections || !selections[i] || selections[i] === -1) {
                setSquars((squares) => [
                    ...squares,
                    <HtmlTooltip key={i} title={!idx ? i + 1 + '번' : i + 1 + limiter * idx + '번'} placement="top">
                        <div
                            key={i}
                            className="square"
                            style={{ backgroundColor: '#E5E5E5' }}
                            // onDoubleClick={() => onDoubleClick(i + limiter * idx, selections[i].qUUID, isHandsUp, isTeacherSelected)}
                        >
                            {/* {isHandsUp ? <PanToolIcon className="inner-icon hands-up" fontSize="small" /> : null}
                            {isTeacherSelected ? <CheckCircleOutlineIcon className="inner-icon teacher-selected" fontSize="small" /> : null} */}
                        </div>
                    </HtmlTooltip>,
                ]);
            } else if (selections[i] === -2) {
                setSquars((squares) => [...squares, <div key={i} className="square" style={{ backgroundColor: 'white' }}></div>]);
            } else if (selections[i].correct) {
                setSquars((squares) => [
                    ...squares,
                    <HtmlTooltip key={i} title={!idx ? i + 1 + '번' : i + 1 + limiter * idx + '번'} placement="top">
                        <div
                            key={i}
                            className="square"
                            style={{ backgroundColor: '#13E2A1' }}
                            // onDoubleClick={() => onDoubleClick(i + limiter * idx, selections[i].qUUID, isHandsUp, isTeacherSelected)}
                        >
                            {/* {isHandsUp ? <PanToolIcon className="inner-icon hands-up" fontSize="small" /> : null} */}
                            {/* {isTeacherSelected ? <CheckCircleOutlineIcon className="inner-icon teacher-selected" fontSize="small" /> : null} */}
                        </div>
                    </HtmlTooltip>,
                ]);
            } else if (!selections[i].correct) {
                setSquars((squares) => [
                    ...squares,
                    <HtmlTooltip key={i} title={!idx ? i + 1 + '번' : i + 1 + limiter * idx + '번'} placement="bottom-end">
                        <div
                            key={i}
                            className="square"
                            style={{ backgroundColor: '#FF7A60' }}
                            // onDoubleClick={() => onDoubleClick(i + limiter * idx, selections[i].qUUID, isHandsUp, isTeacherSelected)}
                        >
                            {/* {isHandsUp ? <PanToolIcon className="inner-icon hands-up" fontSize="small" /> : null} */}
                            {/* {isTeacherSelected ? <CheckCircleOutlineIcon className="inner-icon teacher-selected" fontSize="small" /> : null} */}
                        </div>
                    </HtmlTooltip>,
                ]);
            }
        }
    };
    useEffect(() => {
        setSquars([]);
        makesMoney();
    }, [handsUp, teacherSelected]);

    return <StyleTestSquareList>{squares}</StyleTestSquareList>;
}

Progress.defaultProps = {
    mode: false,
    onDoubleClick: () => {},
    handsUp: [1, 3, 4, 7, 10],
    teacherSelected: [3, 4, 10],
};

export default Progress;
