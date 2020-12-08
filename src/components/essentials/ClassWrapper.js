import React from 'react';
import styled, { css } from 'styled-components';

const StyleWrapper = styled.div`
    max-width: 960px;
    padding: 0 16px;
    margin: 0 auto;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: ${(props) => (props.col ? 'column' : 'none')};

    ${(props) =>
        props.type === 'main_page'
            ? css`
                  @media (min-width: 992px) and (max-width: 1231px) {
                      max-width: 960px;
                  }
                  @media (min-width: 663px) and (max-width: 991px) {
                      max-width: 632px;
                  }
              `
            : css`
                  @media (min-width: 0px) and (max-width: 1231px) {
                      max-width: 632px;
                  }
              `}
`;

function ClassWrapper({ children, col, type }) {
    return (
        <StyleWrapper col={col} type={type}>
            {children}
        </StyleWrapper>
    );
}

ClassWrapper.defaultProps = {
    col: false,
};

export default ClassWrapper;
