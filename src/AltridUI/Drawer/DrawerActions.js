import React from 'react';
import styled from 'styled-components';

const DrawerActionsRoot = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: auto;
    padding-top: 32px;
    width: 100%;
`;

function DrawerActions({ children }) {
    return <DrawerActionsRoot>{children}</DrawerActionsRoot>;
}

DrawerActions.defaultProps = {};

export default DrawerActions;
