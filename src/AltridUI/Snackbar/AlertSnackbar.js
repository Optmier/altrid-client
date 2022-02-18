import React from 'react';
import { Slide, Snackbar, withStyles } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Success from './Icons/Success';
import Info from './Icons/Info';
import Warning from './Icons/Warning';
import Error from './Icons/Error';

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
        boxShadow: 'none',
        fontFamily: 'inherit',
        fontSize: 'inherit',
        fontWeight: 'inherit',
    },
    icon: {
        alignItems: 'center',
        opacity: 1,
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
    filledSuccess: {
        backgroundColor: '#008F58',
        color: '#ffffff',
    },
    filledInfo: {
        backgroundColor: '#1E54B7',
        color: '#ffffff',
    },
    filledWarning: {
        backgroundColor: '#BC8B2C',
        color: '#ffffff',
    },
    filledError: {
        backgroundColor: '#AB1300',
        color: '#ffffff',
    },
}))(Alert);

const InnerAlert = React.forwardRef((props, ref) => (
    <MuiAlert
        elevation={6}
        {...props}
        ref={ref}
        iconMapping={{
            success: <Success fontSize="inherit" color="inherit" />,
            info: <Info fontSize="inherit" color="inherit" />,
            warning: <Warning fontSize="inherit" color="inherit" />,
            error: <Error fontSize="inherit" color="inherit" />,
        }}
    />
));

function AlertSnackbar({ open, title, type, duration, onClose, children }) {
    return (
        <MuiSnackbar open={open} autoHideDuration={duration} TransitionComponent={SlideTransition} onClose={onClose}>
            <InnerAlert severity={type} variant="filled" onClose={onClose}>
                {((title) => {
                    const titleArr = title.split('\n');
                    const returnArr = [titleArr[0]];
                    for (let i = 1; i < titleArr.length; i++) {
                        returnArr.push(<br key={i} />);
                        returnArr.push(titleArr[i]);
                    }
                    return returnArr;
                })(title)}
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
