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

    & .pattern-click {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        & > button {
            font-weight: 500;
            font-size: 0.75rem;
            color: black;
            background-color: transparent;
        }
        & > button::before {
            content: '> ';
        }
    }

    & .pattern-item + .pattern-item {
        margin-top: 0.5rem;
    }
`;

const AnswerRoute = ({ route }) => {
    let routeArr = route.split(',');

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {routeArr.map((i, idx) => (
                <div key={idx} style={{ marginRight: '3px' }}>
                    <span style={{ marginRight: '3px' }}>{i}</span>
                    {idx === routeArr.length - 1 ? (
                        ''
                    ) : (
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M7.35355 4.35355C7.54882 4.15829 7.54882 3.84171 7.35355 3.64645L4.17157 0.464466C3.97631 0.269204 3.65973 0.269204 3.46447 0.464466C3.2692 0.659728 3.2692 0.976311 3.46447 1.17157L6.29289 4L3.46447 6.82843C3.2692 7.02369 3.2692 7.34027 3.46447 7.53553C3.65973 7.7308 3.97631 7.7308 4.17157 7.53553L7.35355 4.35355ZM0 4.5H7V3.5H0V4.5Z"
                                fill="#706D6D"
                            />
                        </svg>
                    )}
                </div>
            ))}
        </div>
    );
};
const PatternList = ({ title, pattern, answer, route, time }) => {
    const [heightToggle, setHeightToggle] = useState(false);
    const [height, setHeight] = useState(0);
    const [padding, setPadding] = useState(0);

    const handlePattern = () => {
        console.log(heightToggle);

        if (!heightToggle) {
            setHeight('92px');
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
                    <AnswerRoute route={route} />
                </div>
                <div className="pattern-item">
                    <div>소요시간</div>
                    {time}
                </div>
                <div className="pattern-item pattern-click">
                    <button>영상 확인</button>
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