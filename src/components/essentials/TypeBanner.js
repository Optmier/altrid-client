import React, { useState, useEffect } from 'react';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import CountUp from 'react-countup';

const useStyles = makeStyles((theme) => ({
    root: {
        cursor: 'pointer',
        width: ({ situation }) => (situation === 'info' ? '580px' : '700px'),
        boxShadow: 'rgb(128 123 123 / 13%) 2px 7px 16px 0px, rgb(109 107 107 / 5%) 0px 1px 5px 0px',
        transition: 'all 0.3',
        borderRadius: '11px',
        '& > * + *': {
            marginTop: theme.spacing(2),
            display: 'flex',
        },
        '& .MuiAlert-icon': {
            display: 'flex',
            alignItems: 'center',
        },
        '& .MuiAlert-message': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '1rem 0',

            '& .badge-left': {
                display: 'flex',
                alignItems: 'center',
                '& b': {
                    fontWeight: '600',
                    marginLeft: '1rem',
                },
            },
            '& .badge-right': {
                display: 'flex',
                alignItems: 'center',

                '& p': {
                    paddingRight: '1rem',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                },
                '& .percent': {
                    fontSize: '1rem',

                    '& span': {
                        marginLeft: '0.5rem',
                    },
                },
            },
            '&:hover': {
                transition: 'all 0.3s',
                marginRight: '-5px',
            },
        },
    },
}));

function TypeBanner({ situation, value }) {
    // situation : info, warning, success

    const classes = useStyles({ situation });

    return (
        <>
            {situation ? (
                <a className={classes.root} href="https://www.notion.so/optmier/07bd3c8f53ac4e449242cda7eccdcb4e" target="_blank">
                    <Alert severity={situation}>
                        <div className="badge-left">
                            {situation === 'info'
                                ? '과제 최소 조건을 맞추면 유형별 분석이 가능합니다!'
                                : situation === 'warning'
                                ? '과제를 조금 더 다양한 유형과 문제로 만들어주세요!'
                                : '과제 최소 조건을 만족하셨습니다!'}
                        </div>

                        <div className="badge-right">
                            {situation === 'info' ? (
                                <>
                                    <p>조건 확인하기 </p>
                                    <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M0.589844 10.59L5.16984 6L0.589844 1.41L1.99984 0L7.99984 6L1.99984 12L0.589844 10.59Z"
                                            fill="#0d3c61"
                                        />
                                    </svg>
                                </>
                            ) : situation === 'warning' ? (
                                <p className="percent">
                                    취약영역 분석까지
                                    <CountUp start={0} end={value} delay={5}>
                                        {({ countUpRef }) => <span ref={countUpRef} />}
                                    </CountUp>
                                    %
                                </p>
                            ) : (
                                <p className="percent">취약영역 분석이 가능합니다.</p>
                            )}
                        </div>
                    </Alert>
                </a>
            ) : (
                ''
            )}
        </>
    );
}

export default TypeBanner;
