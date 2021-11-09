import React from 'react';
import { FormControlLabel } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const RadioLabel = withStyles({
    root: {
        marginLeft: 0,
        marginRight: 0,
        '& span.MuiTypography-root.MuiFormControlLabel-label': {
            color: '#11171C',
            fontFamily:
                'inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
            fontSize: '0.875rem',
            fontWeight: 700,
            letterSpacing: 'initial',
            lineHeight: '1.25rem',
            marginLeft: 10,
        },
    },
})(FormControlLabel);

export default RadioLabel;
