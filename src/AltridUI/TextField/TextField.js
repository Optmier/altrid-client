import React from 'react';
import { TextField as MuiTextField } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/styles';

const TextField = withStyles({
    root: {
        '& .MuiInputBase-root.MuiOutlinedInput-root': {
            backgroundColor: ({ status }) => {
                switch (status) {
                    case 'error':
                        return '#ffefed';
                    case 'completed':
                        return '#f0fff9';
                    default:
                        return '#e9edef';
                }
            },
            borderRadius: 16,
            fontFamily:
                'inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
            fontSize: '1.125rem',
            fontWeight: 500,
            height: ({ sizes }) => {
                switch (sizes) {
                    case 'medium':
                        return 48;
                    default:
                        return 56;
                }
            },
            lineHeight: '1.375rem',
            '& input.MuiOutlinedInput-input': {
                color: '#11171C',
                padding: '17px 16px',
                '&::placeholder': {
                    color: '#77818B',
                    color: ({ status }) => {
                        switch (status) {
                            case 'error':
                                return '#E85C4A';
                            case 'completed':
                                return '#0CB573';
                            default:
                                return '#77818B';
                        }
                    },
                    opacity: 1,
                },
            },
            '& fieldset.MuiOutlinedInput-notchedOutline': {
                border: ({ status }) => {
                    switch (status) {
                        case 'error':
                            return '1px solid #e11900';
                        case 'completed':
                            return '1px solid #008f58';
                        default:
                            return 'none';
                    }
                },
            },
            '&.Mui-focused': {
                backgroundColor: '#ffffff !important',
                '& fieldset.MuiOutlinedInput-notchedOutline': {
                    border: ({ status }) => {
                        switch (status) {
                            case 'error':
                                return '1px solid #e11900';
                            case 'completed':
                                return '1px solid #008f58';
                            default:
                                return '1px solid #6c46a1';
                        }
                    },
                },
            },
            '&:hover': {
                backgroundColor: ({ status }) => {
                    switch (status) {
                        case 'error':
                            return '#ffefed';
                        case 'completed':
                            return '#f0fff9';
                        default:
                            return '#f6f8f9';
                    }
                },
            },
        },
        '& .MuiFormHelperText-root.MuiFormHelperText-contained': {
            color: ({ status }) => {
                switch (status) {
                    case 'error':
                        return '#E11900';
                    case 'completed':
                        return '#008F58';
                    default:
                        return '#4D5C6A';
                }
            },
            fontSize: '0.875rem',
            margin: '4px 0 0 0',
        },
    },
})((props) => <MuiTextField variant="outlined" {...props} />);

export default TextField;
