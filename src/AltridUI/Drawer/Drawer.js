import { Drawer as MuiDrawer } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import styled from 'styled-components';
import DrawerTopCloseIcon from '../Icons/DrawerTopCloseIcon';
import DrawerTopHelpIcon from '../Icons/DrawerTopHelpIcon';

const DrawerRoot = styled.div`
    display: flex;
    flex-direction: column;
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
    margin-bottom: 32px;
`;
const CloseButton = styled.button`
    align-items: center;
    background-color: #f4f1fa;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    margin-right: auto;
    height: 40px;
    width: 40px;
`;
const HelpButton = styled.button`
    align-items: center;
    background-color: #f4f1fa;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    margin-left: auto;
    height: 40px;
    width: 40px;
`;

const useStyles = makeStyles({
    root: {
        '& .MuiDrawer-paper': {
            maxWidth: 600,
            width: '100%',
        },
    },
});

function Drawer({ anchor, open, handleClose, handleHelp, children, ...rest }) {
    const classes = useStyles();
    return (
        <MuiDrawer className={classes.root} anchor={anchor} open={open} {...rest}>
            <DrawerRoot>
                <TopIconContainer>
                    {handleClose ? (
                        <CloseButton onClick={handleClose}>
                            <DrawerTopCloseIcon />
                        </CloseButton>
                    ) : null}
                    {handleHelp ? (
                        <HelpButton onClick={handleHelp}>
                            <DrawerTopHelpIcon />
                        </HelpButton>
                    ) : null}
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
