import React from 'react';
import styled from 'styled-components';

const StyleWrapper = styled.div`
    max-width: 960px;
    padding: 0 16px;
    margin: 0 auto;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: ${(props) => (props.col ? 'column' : 'none')};

    @media (min-width: 0px) and (max-width: 1231px) {
        max-width: 632px;
    }
`;

function ClassWrapper({ children, col }) {
    return <StyleWrapper col={col}>{children}</StyleWrapper>;
}

ClassWrapper.defaultProps = {
    col: false,
};

export default ClassWrapper;
