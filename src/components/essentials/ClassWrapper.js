import React from 'react';
import styled, { css } from 'styled-components';

const StyleWrapper = styled.div`
    border: 1px solid red;
    max-width: 960px;
    padding: 0 24px;
    margin: 0 auto;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    width: calc(100% - 240px);
    @media (min-width: 769px) and (max-width: 1024px) {
        & {
            max-width: 790px;
            padding: 0 10px;
        }
    }
`;

function ClassWrapper({ children }) {
    return <StyleWrapper>{children}</StyleWrapper>;
}

export default ClassWrapper;
