import React from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'absolute',
        zIndex: '9999',
        width: '100%',
        //boxShadow: 'rgb(128 123 123 / 40%) 2px 7px 16px 0px, rgb(109 107 107 / 5%) 0px 1px 5px 0px',

        '& .MuiAlert-root': {
            borderRadius: '0',
            padding: '12px 80px',
            fontSize: '1rem',

            '& .MuiAlert-message': {
                width: '100%',
                '& .message': {
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',

                    '& .msg-left-tablet': {
                        display: 'none',
                    },
                    '& .msg-right': {
                        fontWeight: '600',
                        fontSize: '0.875rem',

                        '& svg': {
                            marginLeft: '0.5rem',
                        },
                    },

                    '@media all and (max-width: 970px)': {
                        '& .msg-left': {
                            display: 'none',
                        },
                        '& .msg-left-tablet': {
                            display: 'block',
                        },
                    },
                },
            },
        },
    },
}));

function ErrorOS({ os, mobile }) {
    const classes = useStyles();

    if (os.indexOf('chrome') !== -1) return '';

    return (
        <div className={classes.root}>
            <Alert severity="error">
                <AlertTitle>Browser Error</AlertTitle>

                <div className="message">
                    <div className="msg-left">
                        <strong>Chrome 웹 브라우저를 사용해주세요 !</strong> -- 알트리드는 서비스는 해당 웹 브라우저를 지원하지 않습니다.
                    </div>
                    <div className="msg-left-tablet">
                        <strong>Chrome 웹 브라우저를 사용해주세요 !</strong> <br />
                        알트리드는 서비스는 해당 웹 브라우저를 지원하지 않습니다.
                    </div>
                    <a className="msg-right" href="https://www.google.com/intl/ko/chrome/">
                        Chrome 설치하기
                        <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M0.589844 10.59L5.16984 6L0.589844 1.41L1.99984 0L7.99984 6L1.99984 12L0.589844 10.59Z"
                                fill="#0d3c61"
                            />
                        </svg>
                    </a>
                </div>
            </Alert>
        </div>
    );
}

export default ErrorOS;
