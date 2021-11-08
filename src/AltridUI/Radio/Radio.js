import classNames from 'classnames';
import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Radio as MuiRadio, withStyles, makeStyles } from '@material-ui/core';

const getColorSeries400 = (colorName) => {
    switch (colorName) {
        case 'purple':
            return '#6C46A1';
        case 'blue':
            return '#276EF1';
        case 'green':
            return '#0CB573';
        case 'yellow':
            return '#FFC043';
        case 'orange':
            return '#FF6937';
        case 'red':
            return '#E11900';
        default:
            return '#77818B';
    }
};

const getColorSeries300 = (colorName) => {
    switch (colorName) {
        case 'purple':
            return '#957FCE';
        case 'blue':
            return '#5B91F5';
        case 'green':
            return '#3AE2A1';
        case 'yellow':
            return '#FFCF70';
        case 'orange':
            return '#FA9269';
        case 'red':
            return '#E85C4A';
        default:
            return '#9AA5AF';
    }
};

const getColorSeries050 = (colorName) => {
    switch (colorName) {
        case 'purple':
            return '#F4F1FA';
        case 'blue':
            return '#EFF3FE';
        case 'green':
            return '#F0FFF9';
        case 'yellow':
            return '#FFFAF0';
        case 'orange':
            return '#FFF3EF';
        case 'red':
            return '#FFEFED';
        default:
            return '#F6F8F9';
    }
};

const useStyles = makeStyles({
    root: {
        padding: 0,
        '&:hover': {
            backgroundColor: 'transparent',
        },
    },
    icon: {
        borderRadius: '50%',
        width: 16,
        height: 16,
        backgroundColor: '#E9EDEF',
        '$root.Mui-focusVisible &': {
            outline: '4px solid',
            outlineColor: '#F6F8F9',
        },
        'input:hover ~ &': {
            backgroundColor: '#F6F8F9',
        },
        'input:disabled ~ &': {
            backgroundColor: '#F6F8F9',
        },
        transition: 'background-color 0.2s',
    },
    checkedIcon: {
        backgroundColor: ({ colors }) => getColorSeries400(colors),
        '&:before': {
            display: 'block',
            width: 16,
            height: 16,
            backgroundImage: ({ disabled }) =>
                disabled ? 'radial-gradient(#E9EDEF,#E9EDEF 28%,transparent 32%)' : 'radial-gradient(#fff,#fff 28%,transparent 32%)',
            content: '""',
        },
        'input:hover ~ &': {
            backgroundColor: ({ colors, disabled }) => (disabled ? null : getColorSeries300(colors)),
        },
    },
});

function Radio({ colors, disabled, ...props }) {
    const classes = useStyles({ colors: colors, disabled: disabled });
    return (
        <MuiRadio
            className={classes.root}
            disableRipple
            color="default"
            colors={colors}
            disabled={disabled}
            checkedIcon={<span disabled={disabled} className={classNames(classes.icon, classes.checkedIcon)} />}
            icon={<span className={classes.icon} />}
            {...props}
        />
    );
}

Radio.defaultProps = {
    colors: 'purple',
    disabled: false,
};

export default Radio;
