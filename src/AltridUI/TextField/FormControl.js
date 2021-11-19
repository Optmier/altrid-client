import React from 'react';
import { FormControl as MuiFormControl } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';

const FormControl = withStyles((theme) => ({
    root: {
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
        '& label': {
            fontFamily: 'inherit',
            color: '#77818B',
            fontSize: 18,
            fontWeight: 500,
            letterSpacing: '-0.02em',
            lineHeight: '22px',
            transform: 'translate(16px, 22px)',
            transition: theme.transitions.create(['font-size', 'transform'], { duration: 200 }),
        },
        '& label.Mui-focused': {
            color: '#77818B',
            fontSize: 12,
            fontWeight: 400,
            letterSpacing: '-0.01em',
            lineHeight: '16px',
            transform: 'translate(16px, 12px)',
        },
        '& label.MuiInputLabel-shrink': {
            fontSize: 12,
            fontWeight: 400,
            letterSpacing: '-0.01em',
            lineHeight: '16px',
            transform: 'translate(16px, 12px)',
        },
        '& .MuiFilledInput-root': {
            backgroundColor: ({ status }) => {
                switch (status) {
                    case 'error':
                        return '#FFEFED';
                    case 'completed':
                        return '#F0FFF9';
                    default:
                        return '#E9EDEF';
                }
            },
            border: '1px solid',
            borderColor: ({ status }) => {
                switch (status) {
                    case 'error':
                        return '#E11900';
                    case 'completed':
                        return '#008F58';
                    default:
                        return 'transparent';
                }
            },
            borderRadius: 16,
            fontFamily: 'inherit',
            minHeight: 64,
            '& input': {
                color: '#11171C',
                fontSize: 18,
                fontWeight: 500,
                letterSpacing: '-0.02em',
                lineHeight: '22px',
                padding: '30px 16px 12px',
            },
            '&:hover': {
                backgroundColor: ({ status }) => {
                    switch (status) {
                        case 'error':
                            return '#FFEFED';
                        case 'completed':
                            return '#F0FFF9';
                        default:
                            return '#F6F8F9';
                    }
                },
                borderColor: ({ status }) => {
                    switch (status) {
                        case 'error':
                            return '#E11900';
                        case 'completed':
                            return '#008F58';
                        default:
                            return 'transparent';
                    }
                },
            },
            '&.Mui-focused': {
                backgroundColor: '#FFFFFF',
                borderColor: '#6C46A1',
                '&:hover': {
                    backgroundColor: '#FFFFFF',
                    borderColor: '#6C46A1',
                },
            },
            '& .MuiSelect-select:focus': {
                // backgroundColor: '#FFFFFF',
            },
        },
        '& .MuiFilledInput-underline:before': {
            content: 'none',
        },
        '& .MuiFilledInput-underline:after': {
            content: 'none',
        },
        '& .MuiFormHelperText-root': {
            color: ({ status }) => {
                switch (status) {
                    case 'error':
                        return '#E11900';
                    case 'completed':
                        return '#008F58';
                    default:
                        return '#77818B';
                }
            },
            fontFamily: 'inherit',
            fontSize: 14,
            fontWeight: 400,
            letterSpacing: '-0.01em',
            lineHeight: '18px',
            margin: 0,
            marginTop: 4,
        },
        // '& .MuiOutlinedInput-root': {
        //     '& fieldset': {
        //         borderColor: 'red',
        //     },
        //     '&:hover fieldset': {
        //         borderColor: 'yellow',
        //     },
        //     '&.Mui-focused fieldset': {
        //         borderColor: 'green',
        //     },
        // },
    },
}))(MuiFormControl);

export default FormControl;
