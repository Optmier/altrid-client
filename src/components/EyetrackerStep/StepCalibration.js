import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import CheckButton from '../../images/eyetracker_logo/calibration_check.png';

const RelativeDiv = styled.div`
    position: ${(props) => (props.relative ? 'relative' : 'inherit')};
`;
const Assistance = styled.div``;
const CalibDot = styled.button`
    background-color: #f2f2f2;
    border: 2px solid #707070;
    border-radius: 50%;
    box-sizing: border-box;
    position: absolute;
    width: 40px;
    height: 40px;

    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    color: #4d4949;
    font-weight: 600;

    cursor: pointer;

    &.top-left {
        top: 12px;
        left: 12px;
    }

    &.top-center {
        top: 12px;
        left: calc(50% - 10px);
    }

    &.top-right {
        top: 12px;
        right: 12px;
    }

    &.middle-left {
        top: calc(50% - 10px);
        left: 12px;
    }

    &.middle-center {
        top: calc(50% - 10px);
        left: calc(50% - 10px);
    }

    &.middle-right {
        top: calc(50% - 10px);
        right: 12px;
    }

    &.bottom-left {
        bottom: 12px;
        left: 12px;
    }

    &.bottom-center {
        bottom: 12px;
        left: calc(50% - 10px);
    }

    &.bottom-right {
        bottom: 12px;
        right: 12px;
    }

    &:hover {
        background-color: #7d7d7d6b;
    }

    &.ok {
        background-color: #00ac75;
        pointer-events: none;
    }
`;
const CalibImg = styled.img`
    position: absolute;
    width: 40px;
    height: 40px;

    &.top-left {
        top: 12px;
        left: 12px;
    }

    &.top-center {
        top: 12px;
        left: calc(50% - 10px);
    }

    &.top-right {
        top: 12px;
        right: 12px;
    }

    &.middle-left {
        top: calc(50% - 10px);
        left: 12px;
    }

    &.middle-center {
        top: calc(50% - 10px);
        left: calc(50% - 10px);2
    }

    &.middle-right {
        top: calc(50% - 10px);
        right: 12px;
    }

    &.bottom-left {
        bottom: 12px;
        left: 12px;
    }

    &.bottom-center {
        bottom: 12px;
        left: calc(50% - 10px);
    }

    &.bottom-right {
        bottom: 12px;
        right: 12px;
    }
`;
function StepCalibration({ onCalibDotClick, onCalibDotHover, onCalibDotLeave, calibDotCounts, relative }) {
    const {
        top_left,
        top_center,
        top_right,
        middle_left,
        middle_center,
        middle_right,
        bottom_left,
        bottom_center,
        bottom_right,
    } = calibDotCounts;
    // const [countState, setCountState] = useState(20);

    // useEffect(() => {
    //     if (countState === 0) {
    //         setCountState(20);
    //     } else {
    //         setCountState(countState - 1);
    //     }
    // }, []);

    return (
        <RelativeDiv className="eyetrack-step-calibration" relative={relative}>
            <Assistance className="eyetracker-calib-assistance">
                {top_left < 20 ? (
                    <CalibDot
                        className="calib-dots top-left"
                        data-type="top_left"
                        onClick={onCalibDotClick}
                        onMouseOver={onCalibDotHover}
                        onMouseLeave={onCalibDotLeave}
                    >
                        {20 - top_left}
                    </CalibDot>
                ) : (
                    <CalibImg src={CheckButton} className="top-left" alt="checking.." />
                )}

                {top_left === 20 ? (
                    top_center < 20 ? (
                        <CalibDot
                            className="calib-dots top-center"
                            data-type="top_center"
                            onClick={onCalibDotClick}
                            onMouseOver={onCalibDotHover}
                            onMouseLeave={onCalibDotLeave}
                        >
                            {20 - top_center}
                        </CalibDot>
                    ) : (
                        <CalibImg src={CheckButton} className="top-center" alt="checking.." />
                    )
                ) : (
                    ''
                )}

                {top_center === 20 ? (
                    top_right < 20 ? (
                        <CalibDot
                            className="calib-dots top-right"
                            data-type="top_right"
                            onClick={onCalibDotClick}
                            onMouseOver={onCalibDotHover}
                            onMouseLeave={onCalibDotLeave}
                        >
                            {20 - top_right}
                        </CalibDot>
                    ) : (
                        <CalibImg src={CheckButton} className="top-right" alt="checking.." />
                    )
                ) : (
                    ''
                )}
                {top_right === 20 ? (
                    middle_left < 20 ? (
                        <CalibDot
                            className="calib-dots middle-left"
                            data-type="middle_left"
                            onClick={onCalibDotClick}
                            onMouseOver={onCalibDotHover}
                            onMouseLeave={onCalibDotLeave}
                        >
                            {20 - middle_left}
                        </CalibDot>
                    ) : (
                        <CalibImg src={CheckButton} className="middle-left" alt="checking.." />
                    )
                ) : (
                    ''
                )}
                {middle_left === 20 ? (
                    middle_center < 20 ? (
                        <CalibDot
                            className="calib-dots middle-center"
                            data-type="middle_center"
                            onClick={onCalibDotClick}
                            onMouseOver={onCalibDotHover}
                            onMouseLeave={onCalibDotLeave}
                        >
                            {20 - middle_center}
                        </CalibDot>
                    ) : (
                        <CalibImg src={CheckButton} className="middle-center" alt="checking.." />
                    )
                ) : (
                    ''
                )}
                {middle_center === 20 ? (
                    middle_right < 20 ? (
                        <CalibDot
                            className="calib-dots middle-right"
                            data-type="middle_right"
                            onClick={onCalibDotClick}
                            onMouseOver={onCalibDotHover}
                            onMouseLeave={onCalibDotLeave}
                        >
                            {20 - middle_right}
                        </CalibDot>
                    ) : (
                        <CalibImg src={CheckButton} className="middle-right" alt="checking.." />
                    )
                ) : (
                    ''
                )}
                {middle_right === 20 ? (
                    bottom_left < 20 ? (
                        <CalibDot
                            className="calib-dots bottom-left"
                            data-type="bottom_left"
                            onClick={onCalibDotClick}
                            onMouseOver={onCalibDotHover}
                            onMouseLeave={onCalibDotLeave}
                        >
                            {20 - bottom_left}
                        </CalibDot>
                    ) : (
                        <CalibImg src={CheckButton} className="bottom-left" alt="checking.." />
                    )
                ) : (
                    ''
                )}
                {bottom_left === 20 ? (
                    bottom_center < 20 ? (
                        <CalibDot
                            className="calib-dots bottom-center"
                            data-type="bottom_center"
                            onClick={onCalibDotClick}
                            onMouseOver={onCalibDotHover}
                            onMouseLeave={onCalibDotLeave}
                        >
                            {20 - bottom_center}
                        </CalibDot>
                    ) : (
                        <CalibImg src={CheckButton} className="bottom-center" alt="checking.." />
                    )
                ) : (
                    ''
                )}
                {bottom_center === 20 ? (
                    bottom_right < 20 ? (
                        <CalibDot
                            className="calib-dots bottom-right"
                            data-type="bottom_right"
                            onClick={onCalibDotClick}
                            onMouseOver={onCalibDotHover}
                            onMouseLeave={onCalibDotLeave}
                        >
                            {20 - bottom_right}
                        </CalibDot>
                    ) : (
                        <CalibImg src={CheckButton} className="bottom-right" alt="checking.." />
                    )
                ) : (
                    ''
                )}
            </Assistance>
        </RelativeDiv>
    );
}

export default StepCalibration;
