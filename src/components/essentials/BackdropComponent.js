import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import React, { useState } from 'react';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: 9999 + 1,
        color: '#2d106b',
        backgroundColor: '#f7f9f8',
        marginLeft: '240px',
    },
    blind: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 9999,
    },
}));

function BackdropComponent({ open, blind, disableShrink }) {
    const classes = useStyles();
    return (
        <>
            {blind && open ? <div className={classes.blind} style={{ backgroundColor: blind }}></div> : null}
            <Backdrop className={classes.backdrop} open={open}>
                <CircularProgress disableShrink={disableShrink} color="inherit" />
            </Backdrop>
        </>
    );
}

BackdropComponent.defaultProps = {
    open: false,
    blind: false,
    disableShrink: false,
};

export default BackdropComponent;
