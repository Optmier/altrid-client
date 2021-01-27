import React from 'react';
import styled from 'styled-components';

const StyleButton = styled.button`
    font-size: 13.5px;
    background-color: #13e2a1;
    border: none;
    border-radius: 30px;
    width: 40px;
    color: white;
    padding: 3px 0;
    margin-left: 14px;

    &:hover {
        transition: 0.3s;
        background-color: #13c58d;
    }
`;

function ModifyButton({ handleDateChange }) {
    return (
        <StyleButton id="modify" onClick={handleDateChange}>
            수정
        </StyleButton>
    );
}

export default ModifyButton;
