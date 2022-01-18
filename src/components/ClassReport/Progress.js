/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core';
import Tooltip from '../../AltridUI/Tooltip/Tooltip';
import { getColorSets } from '../../AltridUI/ThemeColors/ColorSets';

const StyleTestSquareList = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    & .square {
        min-width: 56px;
        width: -webkit-fill-available;
        height: 34px;
        border-radius: 8px;
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
            // const isHandsUp = handsUp.find((d) => d === i + limiter * idx) !== undefined;
            // const isTeacherSelected = teacherSelected.find((d) => d === i + limiter * idx) !== undefined;
            if (!selections || !selections[i] || selections[i] === -1) {
                setSquars((squares) => [
                    ...squares,
                    <Tooltip key={i} title={!idx ? i + 1 + '번' : i + 1 + limiter * idx + '번'} placement="top">
                        <div
                            key={i}
                            className="square"
                            style={{ backgroundColor: getColorSets(200, 'gray') }}
                            // onDoubleClick={() => onDoubleClick(i + limiter * idx, selections[i].qUUID, isHandsUp, isTeacherSelected)}
                        >
                            <p style={{ color: '#fff' }}>미응시</p>
                            {/* {isHandsUp ? <PanToolIcon className="inner-icon hands-up" fontSize="small" /> : null}
                            {isTeacherSelected ? <CheckCircleOutlineIcon className="inner-icon teacher-selected" fontSize="small" /> : null} */}
                        </div>
                    </Tooltip>,
                ]);
            } else if (selections[i] === -2) {
                setSquars((squares) => [...squares, <div key={i} className="square" style={{ backgroundColor: '#F6F8F9' }}></div>]);
            } else if (selections[i].correct) {
                setSquars((squares) => [
                    ...squares,
                    <Tooltip key={i} title={!idx ? i + 1 + '번' : i + 1 + limiter * idx + '번'} placement="top">
                        <div
                            key={i}
                            className="square"
                            style={{ backgroundColor: getColorSets(400, 'green') }}
                            // onDoubleClick={() => onDoubleClick(i + limiter * idx, selections[i].qUUID, isHandsUp, isTeacherSelected)}
                        >
                            <p style={{ color: '#fff' }}>정답</p>
                            {/* {isHandsUp ? <PanToolIcon className="inner-icon hands-up" fontSize="small" /> : null} */}
                            {/* {isTeacherSelected ? <CheckCircleOutlineIcon className="inner-icon teacher-selected" fontSize="small" /> : null} */}
                        </div>
                    </Tooltip>,
                ]);
            } else if (!selections[i].correct) {
                setSquars((squares) => [
                    ...squares,
                    <Tooltip key={i} title={!idx ? i + 1 + '번' : i + 1 + limiter * idx + '번'} placement="bottom-end">
                        <div
                            key={i}
                            className="square"
                            style={{ backgroundColor: getColorSets(400, 'orange') }}

                            // onDoubleClick={() => onDoubleClick(i + limiter * idx, selections[i].qUUID, isHandsUp, isTeacherSelected)}
                        >
                            <p style={{ color: '#fff' }}>오답</p>
                            {/* {isHandsUp ? <PanToolIcon className="inner-icon hands-up" fontSize="small" /> : null} */}
                            {/* {isTeacherSelected ? <CheckCircleOutlineIcon className="inner-icon teacher-selected" fontSize="small" /> : null} */}
                        </div>
                    </Tooltip>,
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
