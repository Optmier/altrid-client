import React from 'react';
import {
    Dialog as MuiDialog,
    DialogTitle as MuiDialogTitle,
    DialogContent as MuiDialogContent,
    DialogActions as MuiDialogActions,
    withStyles,
} from '@material-ui/core';
import Typography from '../Typography/Typography';
import Success from '../Snackbar/Icons/Success';
import Info from '../Snackbar/Icons/Info';
import Warning from '../Snackbar/Icons/Warning';
import Error from '../Snackbar/Icons/Error';
import { getColorSets } from '../ThemeColors/ColorSets';
import Button from '../Button/Button';
import styled from 'styled-components';

const AltridCommonDialog = withStyles((theme) => ({
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
        '& .MuiBackdrop-root': {
            backgroundColor: '#0000004f',
        },
    },
    paper: {
        borderRadius: 16,
        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
        minWidth: 280,
        maxWidth: ({ maxwidth }) => (maxwidth === 'false' ? 'initial' : maxwidth),
        '@media (max-width: 640px)': {
            borderRadius: ({ fullmobile }) => (fullmobile === 'true' ? 0 : null),
            margin: ({ fullmobile }) => (fullmobile === 'true' ? 0 : 16),
            maxWidth: ({ fullmobile }) => (fullmobile === 'true' ? 'initial' : 'calc(100% - 32px)'),
            width: ({ fullmobile, fullWidth }) => (fullmobile === 'true' ? '100%' : fullWidth ? 'calc(100% - 32px)' : null),
            maxHeight: ({ fullmobile }) => (fullmobile === 'true' ? 'initial' : 'calc(100% - 32px)'),
            height: ({ fullmobile }) => (fullmobile === 'true' ? '100%' : null),
        },
    },
}))(MuiDialog);
const AltridAlertDialogTitle = withStyles((theme) => ({
    root: {
        color: (props) => {
            switch (props['alert-type']) {
                case 'success':
                    return getColorSets(600, 'green');
                case 'info':
                    return getColorSets(600, 'blue');
                case 'warning':
                    return getColorSets(600, 'yellow');
                case 'error':
                    return getColorSets(600, 'red');
                case 'normal':
                default:
                    return '#000000';
            }
        },
        fontFamily: 'inherit',
        '& .MuiTypography-h6': {
            fontFamily: 'inherit',
            '& div.altrid-typography': {
                alignItems: 'center',
                display: 'flex',
                '& svg': {
                    marginRight: 8,
                    width: 24,
                    height: 24,
                    '@media (max-width: 640px)': {
                        width: 20,
                        height: 20,
                    },
                },
            },
        },
        padding: '24px 24px 0 24px',
        '@media (max-width: 640px)': {
            padding: '16px 16px 0 16px',
        },
    },
}))(MuiDialogTitle);
const AltridAlertDialogContent = withStyles((theme) => ({
    root: {
        color: '#000000',
        padding: '32px 24px 24px 24px',
        '@media (max-width: 640px)': {
            padding: '24px 16px 16px 16px',
        },
    },
}))(MuiDialogContent);
const AltridAlertDialogActions = withStyles((theme) => ({
    root: {
        boxShadow: 'inset 0px 1px 0px #E9EDEF;',
        padding: '12px 24px',
        '@media (max-width: 640px)': {
            padding: '12px 16px',
        },
    },
}))(MuiDialogActions);

function AlertDialog({
    open,
    alertType,
    title,
    message,
    actionButtons,
    actionNamesMapping,
    actionPrimaryColor,
    actionSecondaryColor,
    actionFirst,
    actionSecond,
    actionThird,
    disableEscapeKeyDown,
    transitionDuration,
    onClose,
    children,
}) {
    const makeAlertDialogActions = () => {
        const actions = actionButtons.split('|');
        const mappedActionNames = actionNamesMapping.split('|');
        const primaryColor = actionPrimaryColor.split('|');
        const secondaryColor = actionSecondaryColor.split('|');
        const actionsRender = [];
        for (let i = 0; i < actions.length; i++) {
            if (i > 2) break;
            const onClickFn = () => {
                switch (i) {
                    case 0:
                        typeof actionFirst === 'string' && actionFirst === 'defaultClose' ? onClose() : actionFirst();
                        break;
                    case 1:
                        typeof actionSecond === 'string' && actionSecond === 'defaultClose' ? onClose() : actionSecond();
                        break;
                    case 2:
                        typeof actionThird === 'string' && actionThird === 'defaultClose' ? onClose() : actionThird();
                        break;
                    default:
                        break;
                }
            };
            actionsRender.push(
                <Button
                    key={i}
                    sizes="medium"
                    variant={
                        actions[i] === 'yes' || actions[i] === 'ok'
                            ? !primaryColor[1]
                                ? 'filled'
                                : primaryColor[1]
                            : !secondaryColor[1]
                            ? 'mono'
                            : secondaryColor[1]
                    }
                    colors={
                        actions[i] === 'yes' || actions[i] === 'ok'
                            ? !primaryColor[0]
                                ? 'purple'
                                : primaryColor[0]
                            : !secondaryColor[0]
                            ? null
                            : secondaryColor[0]
                    }
                    onClick={onClickFn}
                >
                    {mappedActionNames[i] ? mappedActionNames[i] : actions[i]}
                </Button>,
            );
        }
        return actionsRender;
    };
    return (
        <AltridCommonDialog
            open={open}
            onClose={onClose}
            disableEscapeKeyDown={disableEscapeKeyDown}
            transitionDuration={transitionDuration}
        >
            <AltridAlertDialogTitle alert-type={alertType}>
                <Typography type="label" size="xxl" bold>
                    {((type) => {
                        switch (type) {
                            case 'success':
                                return <Success color={getColorSets(600, 'green')} fontSize="inherit" />;
                            case 'info':
                                return <Info color={getColorSets(600, 'blue')} fontSize="inherit" />;
                            case 'warning':
                                return <Warning color={getColorSets(600, 'yellow')} fontSize="inherit" />;
                            case 'error':
                                return <Error color={getColorSets(600, 'red')} fontSize="inherit" />;
                            case 'normal':
                            default:
                                return null;
                        }
                    })(alertType)}
                    {title}
                </Typography>
            </AltridAlertDialogTitle>
            <AltridAlertDialogContent>
                <Typography type="label" size="xl">
                    {((message) => {
                        const messageArr = message.split('\n');
                        const returnArr = [messageArr[0]];
                        for (let i = 1; i < messageArr.length; i++) {
                            returnArr.push(<br key={i} />);
                            returnArr.push(messageArr[i]);
                        }
                        return returnArr;
                    })(message)}
                </Typography>
            </AltridAlertDialogContent>
            <AltridAlertDialogActions>{makeAlertDialogActions()}</AltridAlertDialogActions>
        </AltridCommonDialog>
    );
}
AlertDialog.defaultProps = {
    open: false,
    alertType: 'normal',
    title: '타이틀',
    message: '메시지',
    actionButtons: 'no|yes',
    actionNamesMapping: '아니오|네',
    actionPrimaryColor: '',
    actionSecondaryColor: '',
    actionFirst() {},
    actionSecond() {},
    actionThird() {},
    disableEscapeKeyDown: false,
    transitionDuration: 0,
    onClose() {},
};

const DialogTopContainer = styled.div`
    font-family: inherit;
    padding: 48px 48px 0 48px;
    @media (max-width: 640px) {
        padding: 16px 16px 0 16px;
    }
`;
const DialogTopActions = styled.div`
    display: flex;
    justify-content: space-between;
`;
const DialogTopActionButton = styled.button`
    align-items: center;
    background-color: ${getColorSets(50, 'purple')};
    border-radius: 12px;
    cursor: pointer;
    display: flex;
    fill: ${getColorSets(500, 'purple')};
    justify-content: center;
    outline: none;
    height: 40px;
    width: 40px;
    &:hover {
        fill: ${getColorSets(400, 'purple')};
    }
`;
const DialogTitle = styled.div`
    margin-top: 32px;
    @media (max-width: 640px) {
        margin-top: 48px;
    }
`;
const DialogContentsContainer = styled.div`
    font-family: inherit;
    overflow: auto;
    padding: 32px 48px 24px 48px;
    @media (max-width: 640px) {
        padding: 16px 16px 16px 16px;
    }
`;

const AltridDialogActions = withStyles((theme) => ({
    root: {
        boxShadow: 'inset 0px 1px 0px #E9EDEF;',
        marginTop: 'auto',
        padding: '12px 48px',
        '@media (max-width: 640px)': {
            padding: '12px 16px',
        },
    },
}))(MuiDialogActions);

function Dialog({
    open,
    title,
    actionButtons,
    actionNamesMapping,
    actionPrimaryColor,
    actionSecondaryColor,
    actionFirst,
    actionSecond,
    actionThird,
    disableEscapeKeyDown,
    transitionDuration,
    fullWidth,
    fullMobile,
    maxWidth,
    hasCloseButton,
    onHelpClick,
    onClose,
    children,
}) {
    const makeAlertDialogActions = () => {
        const actions = actionButtons.split('|');
        const mappedActionNames = actionNamesMapping.split('|');
        const primaryColor = actionPrimaryColor.split('|');
        const secondaryColor = actionSecondaryColor.split('|');
        const actionsRender = [];
        for (let i = 0; i < actions.length; i++) {
            if (i > 2) break;
            const onClickFn = () => {
                switch (i) {
                    case 0:
                        typeof actionFirst === 'string' && actionFirst === 'defaultClose' ? onClose() : actionFirst();
                        break;
                    case 1:
                        typeof actionSecond === 'string' && actionSecond === 'defaultClose' ? onClose() : actionSecond();
                        break;
                    case 2:
                        typeof actionThird === 'string' && actionThird === 'defaultClose' ? onClose() : actionThird();
                        break;
                    default:
                        break;
                }
            };
            actionsRender.push(
                <Button
                    key={i}
                    sizes="medium"
                    variant={
                        actions[i] === 'yes' || actions[i] === 'ok'
                            ? !primaryColor[1]
                                ? 'filled'
                                : primaryColor[1]
                            : !secondaryColor[1]
                            ? 'mono'
                            : secondaryColor[1]
                    }
                    colors={
                        actions[i] === 'yes' || actions[i] === 'ok'
                            ? !primaryColor[0]
                                ? 'purple'
                                : primaryColor[0]
                            : !secondaryColor[0]
                            ? null
                            : secondaryColor[0]
                    }
                    onClick={onClickFn}
                >
                    {mappedActionNames[i] ? mappedActionNames[i] : actions[i]}
                </Button>,
            );
        }
        return actionsRender;
    };
    return (
        <AltridCommonDialog
            open={open}
            fullWidth={fullWidth}
            fullmobile={fullMobile ? 'true' : 'false'}
            disableEscapeKeyDown={disableEscapeKeyDown}
            transitionDuration={transitionDuration}
            maxwidth={!maxWidth ? 'false' : maxWidth}
            onClose={onClose}
        >
            <DialogTopContainer>
                <DialogTopActions>
                    {hasCloseButton ? (
                        <DialogTopActionButton onClick={onClose}>
                            <svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.99999 5.58672L11.95 0.636719L13.364 2.05072L8.41399 7.00072L13.364 11.9507L11.95 13.3647L6.99999 8.41472L2.04999 13.3647L0.635986 11.9507L5.58599 7.00072L0.635986 2.05072L2.04999 0.636719L6.99999 5.58672Z" />
                            </svg>
                        </DialogTopActionButton>
                    ) : null}
                    {!onHelpClick ? null : (
                        <DialogTopActionButton onClick={onHelpClick}>
                            <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM9 13V15H11V13H9ZM11 11.355C11.8037 11.1128 12.4936 10.59 12.9442 9.88174C13.3947 9.17353 13.5759 8.32705 13.4547 7.49647C13.3336 6.66588 12.9181 5.90644 12.284 5.35646C11.6499 4.80647 10.8394 4.50254 10 4.5C9.19085 4.49994 8.40666 4.78015 7.78079 5.29299C7.15492 5.80583 6.72601 6.51963 6.567 7.313L8.529 7.706C8.58468 7.42743 8.71832 7.1704 8.91437 6.96482C9.11042 6.75923 9.36081 6.61354 9.63643 6.54471C9.91204 6.47587 10.2015 6.48671 10.4712 6.57597C10.7409 6.66523 10.9797 6.82924 11.1598 7.04891C11.34 7.26858 11.454 7.53489 11.4887 7.81684C11.5234 8.0988 11.4773 8.3848 11.3558 8.64158C11.2343 8.89837 11.0423 9.11536 10.8023 9.26733C10.5623 9.4193 10.2841 9.49998 10 9.5C9.73478 9.5 9.48043 9.60536 9.29289 9.79289C9.10536 9.98043 9 10.2348 9 10.5V12H11V11.355Z" />
                            </svg>
                        </DialogTopActionButton>
                    )}
                </DialogTopActions>
                <DialogTitle>
                    <Typography type="heading" size="m" bold>
                        {title}
                    </Typography>
                </DialogTitle>
            </DialogTopContainer>
            <DialogContentsContainer>{children}</DialogContentsContainer>
            <AltridDialogActions>{makeAlertDialogActions()}</AltridDialogActions>
        </AltridCommonDialog>
    );
}
Dialog.defaultProps = {
    open: false,
    title: '타이틀',
    actionButtons: 'ok',
    actionNamesMapping: '확인',
    actionPrimaryColor: '',
    actionSecondaryColor: '',
    actionFirst() {},
    actionSecond() {},
    actionThird() {},
    disableEscapeKeyDown: false,
    transitionDuration: 0,
    fullWidth: false,
    fullMobile: false,
    maxWidth: false,
    hasCloseButton: true,
    onHelpClick: null,
    onClose() {},
};

export { AlertDialog, Dialog };
