import React, { useState } from 'react';
import styled from 'styled-components';

const StyleDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 18px 0px;
    cursor: pointer;
    border-radius: 11px;
    background-color: white;
    width: 100%;
    font-size: 18px;
    font-weight: 600;
    color: ${(props) => (props.clicked ? '#12a5f8' : '#80808070')};
    border: ${(props) => (props.clicked ? '2px solid #12a5f8' : '1.5px solid #80808070')};

    & svg {
        margin-right: 14px;
        pointer-events: none;
    }
`;
function TossAddCard() {
    const [clicked, setClicked] = useState(false);

    const handleClicked = () => {
        setClicked(!clicked);
    };
    return (
        <StyleDiv onClick={handleClicked} clicked={clicked}>
            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M18.6667 10.6667H10.6667V18.6667H8V10.6667H0V8H8V0H10.6667V8H18.6667V10.6667Z"
                    fill={clicked ? '#12A5F8' : '#80808070'}
                />
            </svg>
            카드 추가하기
        </StyleDiv>
    );
}

export default TossAddCard;
