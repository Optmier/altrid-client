import React from 'react';
import { Slide, Snackbar, withStyles } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

function SlideTransition(props) {
    return <Slide {...props} direction="up" />;
}

const MuiSnackbar = withStyles((theme) => ({
    root: {
        borderRadius: 16,
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
        fontSize: '0.92rem',
        fontWeight: 700,
    },
}))(Snackbar);

const MuiAlert = withStyles((theme) => ({
    root: {
        borderRadius: 16,
        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
        fontFamily: 'inherit',
        fontSize: 'inherit',
        fontWeight: 'inherit',
    },
    standardSuccess: {
        backgroundColor: '#F0FFF9',
        color: '#008F58',
    },
    standardInfo: {
        backgroundColor: '#EFF3FE',
        color: '#1E54B7',
    },
    standardWarning: {
        backgroundColor: '#FFFAF0',
        color: '#BC8B2C',
    },
    standardError: {
        backgroundColor: '#FFEFED',
        color: '#AB1300',
    },
}))(Alert);

const InnerAlert = React.forwardRef((props, ref) => <MuiAlert elevation={6} {...props} ref={ref} />);

function AlertSnackbar({ open, title, type, duration, onClose, children }) {
    return (
        <MuiSnackbar open={open} autoHideDuration={duration} TransitionComponent={SlideTransition} onClose={onClose}>
            <InnerAlert severity={type} onClose={onClose}>
                {title}
            </InnerAlert>
        </MuiSnackbar>
    );
}

AlertSnackbar.defaultProps = {
    title: '',
    type: 'success',
    duration: 5000,
};

export default AlertSnackbar;
