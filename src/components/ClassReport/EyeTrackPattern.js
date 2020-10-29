import React, { useState } from 'react';
import patternDummy from '../../datas/patternDummy.json';
import styled from 'styled-components';

const StylePatternBox = styled.div`
    width: 100%;
`;

const StylePatternList = styled.div`
    border-bottom: 1px solid #e5e8eb;
    padding: 20px 0;

    display: flex;
    flex-direction: column;

    &:nth-child(1) {
        padding-top: 0;
    }
    & .pattern-header {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;

        color: #2e2c2c;
        font-size: 0.85rem;
        font-weight: 400;

        & .pattern-num {
            font-weight: 600;
        }
    }
`;

const StylePatternContent = styled.div`
    font-size: 0.75rem;
    font-weight: 400;
    color: #706d6d;

    padding-top: ${(props) => props.padding};
    height: ${(props) => props.height};
    overflow: hidden;
    -moz-transition: height 0.5s ease;
    -webkit-transition: height 0.5s ease;
    -o-transition: height 0.5s ease;
    transition: height 0.5s ease;

    & .pattern-item {
        display: flex;

        & > div {
            font-weight: 500;
            width: 80px;
        }
    }

    & .pattern-item + .pattern-item {
        margin-top: 0.5rem;
    }
`;
const PatternList = ({ title, pattern, answer, route, time }) => {
    const [heightToggle, setHeightToggle] = useState(false);
    const [height, setHeight] = useState(0);
    const [padding, setPadding] = useState(0);

    const handlePattern = () => {
        console.log(heightToggle);

        if (!heightToggle) {
            setHeight('68px');
            setPadding('20px');
            setHeightToggle(true);
        } else {
            setHeight(0);
            setPadding(0);
            setHeightToggle(false);
        }
    };
    return (
        <StylePatternList>
            <div className="pattern-header" onClick={handlePattern}>
                <span className="pattern-num">{pattern}</span> {title}
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.41 0.589844L6 5.16984L10.59 0.589844L12 1.99984L6 7.99984L0 1.99984L1.41 0.589844Z" fill="#2E2C2C" />
                </svg>
            </div>
            <StylePatternContent height={height} padding={padding}>
                <div className="pattern-item">
                    <div>선택 답/정답</div>
                    {answer}
                </div>
                <div className="pattern-item">
                    <div>답 선택 경로</div>
                    {route}
                </div>
                <div className="pattern-item">
                    <div>소요시간</div>
                    {time}
                </div>
            </StylePatternContent>
        </StylePatternList>
    );
};
function EyeTrackPattern() {
    return (
        <StylePatternBox>
            {Object.keys(patternDummy).map((pattern) => (
                <PatternList
                    key={pattern}
                    pattern={pattern}
                    title={patternDummy[pattern]['title']}
                    answer={patternDummy[pattern]['answer']}
                    route={patternDummy[pattern]['route']}
                    time={patternDummy[pattern]['time']}
                />
            ))}
        </StylePatternBox>
    );
}

export default EyeTrackPattern;
