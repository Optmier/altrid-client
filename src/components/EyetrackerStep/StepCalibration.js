import React from 'react';
import styled from 'styled-components';

const Assistance = styled.div``;
const CalibDot = styled.div`
    background-color: #ffff00;
    border: 2px solid black;
    border-radius: 50%;
    box-sizing: border-box;
    position: absolute;
    width: 20px;
    height: 20px;
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
        background-color: #dada00;
    }

    &.ok {
        background-color: #00ac75;
        pointer-events: none;
    }
`;

function StepCalibration({ onCalibDotClick, onCalibDotHover, onCalibDotLeave }) {
    return (
        <div className="eyetrack-step-calibration">
            <Assistance className="eyetracker-calib-assistance">
                <CalibDot
                    className="calib-dots top-left"
                    data-type="top_left"
                    onClick={onCalibDotClick}
                    onMouseOver={onCalibDotHover}
                    onMouseLeave={onCalibDotLeave}
                ></CalibDot>
                <CalibDot
                    className="calib-dots top-center"
                    data-type="top_center"
                    onClick={onCalibDotClick}
                    onMouseOver={onCalibDotHover}
                    onMouseLeave={onCalibDotLeave}
                ></CalibDot>
                <CalibDot
                    className="calib-dots top-right"
                    data-type="top_right"
                    onClick={onCalibDotClick}
                    onMouseOver={onCalibDotHover}
                    onMouseLeave={onCalibDotLeave}
                ></CalibDot>
                <CalibDot
                    className="calib-dots middle-left"
                    data-type="middle_left"
                    onClick={onCalibDotClick}
                    onMouseOver={onCalibDotHover}
                    onMouseLeave={onCalibDotLeave}
                ></CalibDot>
                <CalibDot
                    className="calib-dots middle-center"
                    data-type="middle_center"
                    onClick={onCalibDotClick}
                    onMouseOver={onCalibDotHover}
                    onMouseLeave={onCalibDotLeave}
                ></CalibDot>
                <CalibDot
                    className="calib-dots middle-right"
                    data-type="middle_right"
                    onClick={onCalibDotClick}
                    onMouseOver={onCalibDotHover}
                    onMouseLeave={onCalibDotLeave}
                ></CalibDot>
                <CalibDot
                    className="calib-dots bottom-left"
                    data-type="bottom_left"
                    onClick={onCalibDotClick}
                    onMouseOver={onCalibDotHover}
                    onMouseLeave={onCalibDotLeave}
                ></CalibDot>
                <CalibDot
                    className="calib-dots bottom-center"
                    data-type="bottom_center"
                    onClick={onCalibDotClick}
                    onMouseOver={onCalibDotHover}
                    onMouseLeave={onCalibDotLeave}
                ></CalibDot>
                <CalibDot
                    className="calib-dots bottom-right"
                    data-type="bottom_right"
                    onClick={onCalibDotClick}
                    onMouseOver={onCalibDotHover}
                    onMouseLeave={onCalibDotLeave}
                ></CalibDot>
            </Assistance>
        </div>
    );
}

export default StepCalibration;
