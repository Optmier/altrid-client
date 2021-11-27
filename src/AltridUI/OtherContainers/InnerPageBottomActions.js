import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const BottomActions = styled.div`
    align-items: center;
    background-color: #ffffff;
    box-shadow: inset 0px 1px 0px #e9edef;
    display: flex;
    justify-content: center;
    margin-top: auto;
    min-height: 72px;
    padding: 0 48px;

    @media all and (min-width: 800px) and (max-width: 1191px) {
        padding: ${({ leftnavstate }) => (leftnavstate ? '0 16px' : null)};
    }
    @media all and (max-width: 799px) {
        padding: 0 16px;
    }

    /* & button + button {
        margin-left: 16px;
    } */
`;
const BottomActionsInner = styled.div`
    display: inherit;
    justify-content: space-between;
    max-width: 960px;
    width: 100%;

    @media all and (min-width: 800px) and (max-width: 1191px) {
    }
    @media all and (max-width: 799px) {
    }
`;

function InnerPageBottomActions({ children }) {
    const leftNavGlobal = useSelector((state) => state.RdxGlobalLeftNavState);

    return (
        <BottomActions leftnavstate={window.innerWidth > 902 && leftNavGlobal}>
            <BottomActionsInner leftnavstate={window.innerWidth > 902 && leftNavGlobal}>{children}</BottomActionsInner>
        </BottomActions>
    );
}

export default InnerPageBottomActions;
