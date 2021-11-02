import { Drawer as MuiDrawer } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

const DrawerRoot = styled.div`
    padding: 40px 48px;
    height: 100%;
    max-width: 600px;
    min-width: 320px;

    @media all and (max-width: 768px) {
        padding: 32px;
    }
`;
const TopIconContainer = styled.div`
    display: flex;
    margin-bottom: 48px;
`;
const CloseButton = styled.button`
    margin-right: auto;
`;
const HelpButton = styled.button`
    margin-left: auto;
`;

function Drawer({ anchor, open, handleClose, handleHelp, children, ...rest }) {
    return (
        <MuiDrawer anchor={anchor} open={open} {...rest}>
            <DrawerRoot>
                <TopIconContainer>
                    {handleClose ? <CloseButton onClick={handleClose}>x</CloseButton> : null}
                    {handleHelp ? <HelpButton onClick={handleHelp}>?</HelpButton> : null}
                </TopIconContainer>
                {children}
            </DrawerRoot>
        </MuiDrawer>
    );
}

Drawer.defaultProps = {
    anchor: 'right',
    open: false,
    handleClose: null,
    handleHelp: null,
};

export default Drawer;
