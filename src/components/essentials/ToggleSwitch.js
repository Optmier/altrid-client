import React from 'react';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';

const StyleToggle = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;

    & .toggle-on-ment {
        font-size: 14px;
        font-weight: 500;
        color: white;
        margin-left: 8px;
    }
    & .toggle-on-ment-right {
        font-size: 14px;
        font-weight: 500;
        color: white;
        margin-right: 8px;
    }
    & .toggle-off-ment {
        font-size: 14px;
        font-weight: 500;
        color: #989696;
        margin-left: 8px;
    }
`;

const ShareSwitch = withStyles((theme) => ({
    root: {
        width: 28,
        height: 16,
        padding: 0,
        display: 'flex',
    },
    switchBase: {
        padding: 2,
        color: '#E5E5E5',
        '&$checked': {
            transform: 'translateX(12px)',
            color: '#13e2a1',
            '& + $track': {
                opacity: 1,
                backgroundColor: 'white',
                border: 'none',
            },
        },

        '& + $track': {
            backgroundColor: '#C4C4C4',
            border: 'none',
        },
    },
    thumb: {
        width: 12,
        height: 12,
        boxShadow: 'none',
    },
    track: {
        border: `1px solid ${theme.palette.grey[500]}`,
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor: theme.palette.common.white,
    },
    checked: {},
}))(Switch);

const DrawerSwitch = withStyles((theme) => ({
    root: {
        width: 28,
        height: 16,
        padding: 0,
        display: 'flex',
    },
    switchBase: {
        padding: 2,
        color: 'white',
        '&$checked': {
            transform: 'translateX(12px)',
            color: 'white',
            '& + $track': {
                opacity: 1,
                backgroundColor: '#13E2A1',
                border: 'none',
            },
        },

        '& + $track': {
            backgroundColor: '#C4C4C4',
            border: 'none',
        },
    },
    thumb: {
        width: 12,
        height: 12,
        boxShadow: 'none',
    },
    track: {
        border: `1px solid ${theme.palette.grey[500]}`,
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor: theme.palette.common.white,
    },
    checked: {},
}))(Switch);

//type : share(과제진행 vs 과제완료), drawer (drawer에 있는 toggle)
//toggle : toggle 초기 state -> true, false
//name :
function ToggleSwitch({ isStarted, type, toggle, handleToggleChange, name }) {
    toggle ? (toggle = true) : (toggle = false);
    return (
        <div style={{ display: 'inline' }}>
            <StyleToggle>
                {type === 'share' ? (
                    <>
                        <ShareSwitch
                            value="checkedA"
                            inputProps={{ 'aria-label': 'Switch A' }}
                            checked={toggle}
                            onChange={handleToggleChange}
                            name={name}
                        />
                        {toggle ? (
                            <div className="toggle-on-ment">과제 진행중</div>
                        ) : (
                            <div className="toggle-off-ment">{isStarted ? '과제 완료됨' : '과제 시작전'}</div>
                        )}
                    </>
                ) : type === 'share2' ? (
                    <>
                        {toggle ? (
                            <div style={{ color: '#13e2a1' }} className="toggle-on-ment-right">
                                과제 진행중
                            </div>
                        ) : (
                            <div className="toggle-off-ment">{isStarted ? '과제 완료됨' : '과제 시작전'}</div>
                        )}
                        <DrawerSwitch
                            value="checkedC"
                            inputProps={{ 'aria-label': 'Switch C' }}
                            checked={toggle}
                            onChange={handleToggleChange}
                            name={name}
                        />
                    </>
                ) : (
                    <DrawerSwitch
                        value="checkedB"
                        inputProps={{ 'aria-label': 'Switch B' }}
                        checked={toggle}
                        onChange={handleToggleChange}
                        name={name}
                    />
                )}
            </StyleToggle>
        </div>
    );
}

export default ToggleSwitch;
