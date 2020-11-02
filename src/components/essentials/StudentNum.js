import React from 'react';
import styled from 'styled-components';

const StyleStudentNum = styled.div`
    width: ${(props) => props.width};
    display: flex;
    flex-direction: column;
    position: relative;

    & .complete-num {
        font-size: 40px;
        color: #777171;
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
    }
    & .total-num {
        font-size: 52px;
        color: #2e2c2c;
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
    }
    & .divider {
        position: absolute;
        left: 25%;
        top: 22%;
    }
`;

function StudentNum({ totalNum, completeNum, width }) {
    return (
        <StyleStudentNum width={width}>
            <span className="complete-num">{completeNum}</span>
            <div className="divider">
                <svg width="53" height="51" viewBox="0 0 53 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line
                        y1="-2"
                        x2="69.0673"
                        y2="-2"
                        transform="matrix(-0.716409 0.69768 -0.731229 -0.682132 49.4805 0)"
                        stroke="#2E2C2C"
                        strokeWidth="4"
                    />
                </svg>
            </div>
            <span className="total-num">{totalNum}</span>
        </StyleStudentNum>
    );
}

StudentNum.defaultProps = {
    width: '100%',
};

export default StudentNum;
