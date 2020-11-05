import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import React, { useState } from 'react';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: 9999,
        color: '#fff',
    },
}));

function BackdropComponent({ open, disableShrink }) {
    const classes = useStyles();
    // const [open, setOpen] = useState(false);
    // const handleClose = () => {
    //     setOpen(false);
    // };
    // const handleToggle = () => {
    //     setOpen(!open);
    // };
    return (
        <Backdrop className={classes.backdrop} open={open}>
            <CircularProgress disableShrink={disableShrink} color="inherit" />
        </Backdrop>
    );
}

export default BackdropComponent;
