import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const BottomActions = styled.div`
    align-items: center;
    background-color: #ffffff;
    box-shadow: inset 0px 1px 0px #e9edef;
    display: ${(props) => (props['contain-actions'] ? 'flex' : 'none')};
    justify-content: center;
    margin-top: auto;
    min-height: 72px;
    padding: 0 32px;
    position: fixed;
    bottom: 0;
    left: ${({ leftnavstate }) => (leftnavstate ? '393px' : 0)};
    width: calc(100% - 64px ${({ leftnavstate }) => (leftnavstate ? '- 393px' : null)});
    transition: width 0.4s, left 0.4s;
    @media all and (max-width: 640px) {
        padding: 0 16px;
        width: calc(100% - 32px ${({ leftnavstate }) => (leftnavstate ? '- 393px' : null)});
    }
`;
const BottomActionsInner = styled.div`
    align-items: center;
    display: inherit;
    justify-content: space-between;
    max-width: 960px;
    width: 100%;
    @media all and (min-width: 800px) and (max-width: 1191px) {
    }
    @media all and (max-width: 799px) {
    }
`;

function InnerPageBottomActions({ hasActions, children }) {
    const { leftNavGlobal } = useSelector((state) => state.RdxGlobalLeftNavState);
    const [containActions, setContainActions] = useState(false);

    useEffect(() => {
        if (!children || !children.props || !children.props.children) {
            if (!containActions) return;
            setContainActions(false);
            hasActions(false);
        } else {
            if (containActions) return;
            setContainActions(true);
            hasActions(true);
        }
    }, [children]);

    return (
        <BottomActions contain-actions={containActions} leftnavstate={window.innerWidth > 902 && leftNavGlobal}>
            <BottomActionsInner leftnavstate={window.innerWidth > 902 && leftNavGlobal}>{children}</BottomActionsInner>
        </BottomActions>
    );
}

InnerPageBottomActions.defaultProps = {
    hasActions() {},
};

export default InnerPageBottomActions;
