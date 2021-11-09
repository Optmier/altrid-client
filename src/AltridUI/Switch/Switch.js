import React from 'react';
import { Switch as MuiSwitch, withStyles } from '@material-ui/core';
import { CheckCircle } from '@material-ui/icons';
import styled from 'styled-components';

// function Switch({ children }) {
//   return (
//     <div>

//     </div>
//   );
// }

// Switch.defaultProps = {

// };

const ThumbRoot = styled.div`
    background-color: #ffffff;
    border-radius: 50%;
    box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.2);
    width: 20px;
    height: 20px;
    position: relative;
`;
const ThumbCore = styled.svg`
    left: calc(50% - 3px);
    top: calc(50% - 4px);
    position: absolute;
`;
const ThumbIcon = function () {
    return (
        <ThumbRoot>
            <ThumbCore width="6" height="8" viewBox="0 0 6 8">
                <path d="M1 0H0V8H1V0Z" fill="#F6F8F9" />
                <path d="M6 0H5V8H6V0Z" fill="#F6F8F9" />
            </ThumbCore>
        </ThumbRoot>
    );
};

const Switch = withStyles((theme) => ({
    root: {
        width: 52,
        height: 32,
        padding: '4px 4px',
        margin: '0 0 0 8px',
        '&:hover': {
            '& span.MuiSwitch-track': {
                opacity: 0.7,
            },
        },
    },
    switchBase: {
        padding: 6,
        '&$checked': {
            transform: 'translateX(20px)',
            color: theme.palette.common.white,
            '& + $track': {
                backgroundColor: '#06C167',
                opacity: 1,
                border: 'none',
            },
            '&:hover': {
                backgroundColor: 'transparent',
            },
        },
        '&$focusVisible $thumb': {
            color: '#06C167',
            border: '6px solid #fff',
        },
        '&:hover': {
            backgroundColor: 'transparent',
        },
    },
    thumb: {
        boxShadow: '1px 2px 4px rgba(0, 0, 0, 0.2)',
        width: 20,
        height: 20,
    },
    track: {
        borderRadius: 26 / 2,
        border: `none`,
        backgroundColor: '#BFC6CD',
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border', 'opacity']),
        height: 'initial',
    },
    checked: {},
    focusVisible: {},
}))(({ classes, ...props }) => {
    return (
        <MuiSwitch
            focusVisibleClassName={classes.focusVisible}
            disableRipple
            icon={<ThumbIcon />}
            checkedIcon={<ThumbIcon />}
            classes={{
                root: classes.root,
                switchBase: classes.switchBase,
                thumb: classes.thumb,
                track: classes.track,
                checked: classes.checked,
            }}
            {...props}
        />
    );
});

export default Switch;
