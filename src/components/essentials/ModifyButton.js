import React from 'react';
import styled from 'styled-components';

const StyleButton = styled.button`
    font-size: 10px;
    background-color: #13e2a1;
    border: none;
    border-radius: 30px;
    width: 36px;
    color: white;
`;

function ModifyButton() {
    return <StyleButton>수정</StyleButton>;
}

export default ModifyButton;
