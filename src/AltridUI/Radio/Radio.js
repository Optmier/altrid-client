import classNames from 'classnames';
import React from 'react';
import { Radio as MuiRadio, makeStyles } from '@material-ui/core';
import { getColorSets } from '../ThemeColors/ColorSets';

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
        backgroundColor: ({ colors }) => getColorSets(400, colors),
        '&:before': {
            display: 'block',
            width: 16,
            height: 16,
            backgroundImage: ({ disabled }) =>
                disabled ? 'radial-gradient(#E9EDEF,#E9EDEF 28%,transparent 32%)' : 'radial-gradient(#fff,#fff 28%,transparent 32%)',
            content: '""',
        },
        'input:hover ~ &': {
            backgroundColor: ({ colors, disabled }) => (disabled ? null : getColorSets(300, colors)),
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
