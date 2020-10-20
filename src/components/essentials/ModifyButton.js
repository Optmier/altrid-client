import React from 'react';
import styled from 'styled-components';

const StyleButton = styled.button`
    font-size: 10px;
    background-color: #13e2a1;
    border: none;
    border-radius: 30px;
    width: 36px;
    color: white;

    &:hover {
        transition: 0.3s;
        background-color: #13c58d;
    }
`;

function ModifyButton({ handleDateChange }) {
    return <StyleButton onClick={handleDateChange}>수정</StyleButton>;
}

export default ModifyButton;
