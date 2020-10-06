import React from 'react';
import styled, { css } from 'styled-components';

const StyleWrapper = styled.div`
    border: 1px solid red;
    max-width: 960px;
    padding: 0 16px;
    margin: 0 auto;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;

    @media (min-width: 633px) and (max-width: 960px) {
    }
    @media (min-width: 632px) and (max-width: 960px) {
    }
`;

function ClassWrapper({ children }) {
    return <StyleWrapper>{children}</StyleWrapper>;
}

export default ClassWrapper;
