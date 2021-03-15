import React from 'react';
import styled from 'styled-components';

const StyleDiv = styled.div`
    position: fixed;
    z-index: 1300;

    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 24px;

    width: 100%;
    height: 50px;
    background-color: #2fe8b1;

    & .middle {
        display: flex;
        align-items: center;
        justify-content: center;
        & .text {
            font-size: 1rem;
            font-weight: 500;
            color: white;
        }
        & button {
            margin-left: 1rem;
            border-radius: 11px;
            background-color: #28bf92;
            padding: 0.3rem 0.5rem;
            font-size: 0.95rem;
            font-weight: 500;
            color: white;
            & > svg {
                margin-left: 8px;
            }
        }
    }
    & .text {
        font-size: 1rem;
        font-weight: 500;
        color: white;
    }
    & button {
        margin-left: 1rem;
        border-radius: 11px;
        background-color: #28bf92;
        padding: 0.3rem 0.5rem;
        font-size: 0.95rem;
        font-weight: 500;
        color: white;
        & > svg {
            margin-left: 8px;
        }
    }
`;

function AlertSubscribe() {
    const handleAlert = () => {};
    return (
        <StyleDiv>
            <div></div>
            <div className="middle">
                <div className="text">'파일 업로드를 통한 과제 생성'과 '시선흐름 과제 게시' 기능이 제한되었습니다.</div>
                <button>
                    구독 설정
                    <svg width="19" height="7" viewBox="0 0 19 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 1H16L11.2743 6" stroke="white" stroke-width="2" />
                    </svg>
                </button>
            </div>
            <svg onClick={handleAlert} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
                    fill="white"
                />
            </svg>
        </StyleDiv>
    );
}

export default AlertSubscribe;
