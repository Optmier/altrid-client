import React, { useState } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import DigitZeroPads from '../essentials/DigitsZeroPad';
import * as $ from 'jquery';
import RestrictWrapper from '../essentials/RestrictWrapper';
import { useSelector } from 'react-redux';

const StylePatternBox = styled.div`
    width: 100%;
    height: 100%;
    overflow: scroll;
`;

const StylePatternList = styled.div`
    padding: 16px 32px;
    display: flex;
    flex-direction: column;
    &:nth-child(1) {
        /* padding-top: 0; */
    }
    & .pattern-header {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;

        color: #2e2c2c;
        font-size: 0.85rem;
        font-weight: 400;

        &.incorrect {
            color: #ff4444;
        }

        & .pattern-num {
            font-weight: 600;
            pointer-events: none;
        }

        & svg {
            pointer-events: none;
        }
    }
    & + & {
        border-top: 1px solid #e9edef;
    }
    @media (max-width: 640px) {
        padding: 8px;
    }
`;

const StylePatternContent = styled.div`
    display: flex;
    flex-direction: column;
    font-size: 0.75rem;
    font-weight: 400;
    color: #706d6d;

    padding-top: ${(props) => props.padding};
    height: ${(props) => props.height};
    overflow: hidden;
    -moz-transition: height 0.5s ease;
    -webkit-transition: height 0.5s ease;
    -o-transition: height 0.5s ease;
    transition: all 0.5s ease;

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
        margin-top: auto !important;
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

const timeValueToTimer = (seconds) => {
    const secs = seconds < 0 ? 0 : seconds;
    if (seconds === -2) return '제한 없음';
    else return `${DigitZeroPads(parseInt(secs / 60), 1)}분 ${DigitZeroPads(Math.floor(secs % 60), 1)}초`;
};

const AnswerRoute = ({ route }) => {
    let routeArr = route.filter((d) => d);

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            {routeArr.length < 1 ? (
                <div style={{ marginRight: '3px' }}>
                    <span style={{ marginRight: '3px' }}>없음</span>
                </div>
            ) : null}
            {routeArr.map((i, idx) => (
                <div key={idx} style={{ marginRight: '3px' }}>
                    <span style={{ marginRight: '3px' }}>{routeArr.length > 1 ? i : '없음'}</span>
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
const PatternList = ({
    title,
    data,
    pattern,
    problemNumber,
    userAnswer,
    correctAnswer,
    correct,
    time,
    elapsedAtStart,
    hasEyetrack,
    onEyetrackGoTo,
}) => {
    const [heightToggle, setHeightToggle] = useState(false);
    const [height, setHeight] = useState(0);
    const [padding, setPadding] = useState(0);

    const { eyetrack } = useSelector((state) => state.planInfo.restricted);

    const handlePattern = (e) => {
        // console.log(heightToggle);
        const h = $(e.target).siblings()[0].scrollHeight;
        if (!heightToggle) {
            setHeight(h + 20 + 'px');
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
            <div className={classNames('pattern-header', !correct ? 'incorrect' : '')} onClick={handlePattern}>
                <span className="pattern-num">패턴{parseInt(pattern) + 1}</span> {problemNumber}번 문제
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.41 0.589844L6 5.16984L10.59 0.589844L12 1.99984L6 7.99984L0 1.99984L1.41 0.589844Z" fill="#2E2C2C" />
                </svg>
            </div>

            <StylePatternContent height={height} padding={padding}>
                <RestrictWrapper type="default" size="small" restricted={eyetrack}>
                    <div className="pattern-item">
                        <div>선택 답/정답</div>
                        {userAnswer ? userAnswer : '미선택'}/{correctAnswer}
                    </div>
                    <div className="pattern-item">
                        <div>패턴 내 변경</div>
                        <AnswerRoute route={data.map((d) => (d.action === 'changed' ? d.answerAfter : null))} />
                    </div>
                    <div className="pattern-item">
                        <div>소요시간</div>
                        {timeValueToTimer(time)}
                    </div>
                    {hasEyetrack ? (
                        <div className="pattern-item pattern-click">
                            <button
                                onClick={() => {
                                    onEyetrackGoTo(elapsedAtStart);
                                }}
                            >
                                영상 확인
                            </button>
                        </div>
                    ) : null}
                </RestrictWrapper>
            </StylePatternContent>
        </StylePatternList>
    );
};
function EyeTrackPattern({ data, hasEyetrack, onEyetrackGoTo }) {
    return (
        <StylePatternBox>
            {data
                ? Object.keys(data).map((patternIdx) => (
                      <PatternList
                          key={patternIdx}
                          data={data[patternIdx].data}
                          pattern={patternIdx}
                          problemNumber={data[patternIdx].pid + 1}
                          userAnswer={data[patternIdx].userAnswer}
                          correctAnswer={data[patternIdx].correctAnswer}
                          correct={data[patternIdx].correct}
                          time={data[patternIdx].time}
                          elapsedAtStart={data[patternIdx].elapsedAtStart}
                          hasEyetrack={hasEyetrack}
                          onEyetrackGoTo={onEyetrackGoTo}
                      />
                  ))
                : null}
        </StylePatternBox>
    );
}

EyeTrackPattern.defaultProps = {
    data: {},
    hasEyetrack: false,
    onEyetrackGoTo: (time) => {
        console.log('Eyetrack go to > ', time);
    },
};

export default EyeTrackPattern;
