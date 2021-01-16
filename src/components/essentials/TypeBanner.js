import React, { useState, useEffect } from 'react';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { useCountUp } from 'react-countup';
import styled from 'styled-components';

const StyleAlert = styled.div`
    background-color: ${(props) => (props.situation === 'success' ? '#E4F4FE' : props.situation === 'warning' ? '#FFF3E4' : '#FFFFFF')};
    border: 1px solid ${(props) => (props.situation === 'success' ? '#1C648D' : props.situation === 'warning' ? '#4A2C04' : '#000000')};
    color: ${(props) => (props.situation === 'success' ? '#05172F' : props.situation === 'warning' ? '#4A2C04' : '#000000')};
    border-radius: 11px;
    padding: 9px 15px;
    width: 363px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: rgb(128 123 123 / 13%) 2px 7px 16px 0px, rgb(109 107 107 / 5%) 0px 1px 5px 0px;

    & > div {
        display: flex;
        align-items: center;
        & > p {
            margin-left: 8px;
            font-size: 13px;
            font-weight: 500;
        }
    }

    & > button {
        background-color: transparent;
        font-size: 14px;
        font-weight: 600;
        display: flex;
        align-items: center;
        & > svg {
            margin-left: 5px;
        }
    }

    &:hover {
        & > button {
            transition: all 0.4s;
            margin-right: -5px;
        }
    }
`;

function TypeBanner({ situation, value }) {
    // situation : info, warning, success

    const { countUp } = useCountUp({
        start: 0,
        end: value,
        delay: 1,
        duration: 3,
    });

    return (
        <>
            {situation ? (
                <a
                    href={
                        situation === 'notice'
                            ? 'https://www.notion.so/a4daf8676b2b4460b75613f25249abf3'
                            : 'https://www.notion.so/optmier/07bd3c8f53ac4e449242cda7eccdcb4e'
                    }
                    target="_blank"
                >
                    <StyleAlert situation={situation}>
                        {situation === 'success' ? (
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                    <g id="그룹_482" dataname="그룹 482" transform="translate(-84 -845)">
                                        <g id="그룹_459" dataname="그룹 459" transform="translate(0 -117)">
                                            <circle
                                                id="타원_73"
                                                dataname="타원 73"
                                                cx="8"
                                                cy="8"
                                                r="8"
                                                transform="translate(84 962)"
                                                fill="#1c648d"
                                            />
                                        </g>
                                        <g id="Yes" transform="translate(87.713 849)">
                                            <path
                                                id="Checkbox"
                                                d="M4.1,6.94,1,3.754,1.735,3,4.1,5.374,8.346,1l.735.756Z"
                                                transform="translate(-1.015 0.08)"
                                                fill="#fff"
                                            />
                                            <rect
                                                id="사각형_556"
                                                dataname="사각형 556"
                                                width="8"
                                                height="8"
                                                transform="translate(0.287)"
                                                fill="none"
                                            />
                                        </g>
                                    </g>
                                </svg>

                                <p>과제 최소 조건을 만족하셨습니다!</p>
                            </div>
                        ) : situation === 'warning' ? (
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                    <path
                                        id="패스_35"
                                        dataname="패스 35"
                                        d="M8,0a8,8,0,1,0,8,8A8.024,8.024,0,0,0,8,0ZM9.1,12.2H6.9V10.3H9.2v1.9Zm.1-7.4L8.6,9.2H7.4L6.8,4.8v-1H9.3v1Z"
                                        fill="#4a2c04"
                                    />
                                </svg>

                                <p>취약영역 분석까지{' ' + countUp}%</p>
                            </div>
                        ) : (
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17">
                                    <g id="그룹_458" dataname="그룹 458" transform="translate(-84 -961)">
                                        <circle id="타원_73" dataname="타원 73" cx="8" cy="8" r="8" transform="translate(84 962)" />
                                        <text
                                            id="_"
                                            dataname="?"
                                            transform="translate(89 974)"
                                            fill="#fff"
                                            fontSize="11"
                                            fontFamily="NotoSansCJKkr-Bold, Noto Sans CJK KR"
                                            fontWeight="700"
                                        >
                                            <tspan x="0" y="0">
                                                ?
                                            </tspan>
                                        </text>
                                    </g>
                                </svg>

                                <p>패턴은 무엇인가요?</p>
                            </div>
                        )}

                        <button>
                            조건 확인하기
                            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M0.589844 10.59L5.16984 6L0.589844 1.41L1.99984 0L7.99984 6L1.99984 12L0.589844 10.59Z"
                                    fill="#0d3c61"
                                />
                            </svg>
                        </button>
                    </StyleAlert>
                </a>
            ) : (
                ''
            )}
        </>
    );
}

export default TypeBanner;
