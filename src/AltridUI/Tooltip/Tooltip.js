import React from 'react';
import { Tooltip as MuiTooltip, withStyles, Fade } from '@material-ui/core';

const CustomTooltip = withStyles((theme) => ({
    root: {},
    popper: {
        fontFamily: [
            'inter',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ],
    },
    tooltip: {
        backgroundColor: '#4D5C6A',
        borderRadius: 16,
        fontFamily: 'inherit',
        fontSize: '0.82rem',
    },
}))(MuiTooltip);

const Tooltip = ({ title, children, ...props }) => {
    return (
        <CustomTooltip
            {...props}
            title={title}
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 100 }}
            enterDelay={200}
            leaveDelay={100}
        >
            {children}
        </CustomTooltip>
    );
};

export default Tooltip;
