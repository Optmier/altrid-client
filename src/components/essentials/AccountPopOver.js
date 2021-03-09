import React, { useState, useEffect } from 'react';
import { Popover, Card, CardContent, Avatar, CardActions, List, ListItem, withStyles, makeStyles, Divider } from '@material-ui/core';
import * as $ from 'jquery';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        zIndex: 1300,
        pointerEvents: 'initial',
        minWidth: 275,
    },
    popover: {
        pointerEvents: 'none',
    },
    popoverLeaved: {
        pointerEvents: 'initial',
    },
    paper: {
        padding: theme.spacing(1),
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
}));

const EdListItem = withStyles((theme) => ({
    root: {
        color: 'black',
        height: 48,
        justifyContent: 'center',

        '&.secondary': {
            color: 'black',
        },
    },
}))(ListItem);

function ListItemLink(props) {
    return <EdListItem button component="a" {...props} />;
}

function AccountPopOver({ targetEl, image, userName, history }) {
    const classes = useStyles();
    const [accountPopOverAnchorEl, setAccountPopOverAnchorEl] = useState(null);
    const accountPopOverOpen = Boolean(accountPopOverAnchorEl);
    const accountPopOverId = accountPopOverOpen ? 'account_popover' : undefined;

    const handleLogout = () => {
        window.logout();
    };

    const handleAccountPopoverOpen = (event) => {
        setAccountPopOverAnchorEl(event.currentTarget);
    };

    const handleAccountPopoverClose = () => {
        setAccountPopOverAnchorEl(null);
    };

    useEffect(() => {
        $(document).on('mouseover', ({ target }) => {
            const accountBadge = $(target).closest('.accounts-welcome');
            const accountPopover = $(target).closest('.MuiPaper-root.MuiPopover-paper');
            if (!accountBadge.length && !accountPopover.length) handleAccountPopoverClose();
        });

        return () => {
            setAccountPopOverAnchorEl(null);
        };
    }, []);

    useEffect(() => {
        if (targetEl) {
            targetEl.current.onmouseenter = handleAccountPopoverOpen;
        }
        return () => {
            setAccountPopOverAnchorEl(null);
        };
    }, [targetEl]);

    return (
        <Popover
            id={accountPopOverId}
            className={classes.popover}
            open={accountPopOverOpen}
            anchorEl={accountPopOverAnchorEl}
            anchorOrigin={{
                vertical: 'center',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            onClose={handleAccountPopoverClose}
            disableRestoreFocus
            elevation={24}
        >
            <Card className={classes.root}>
                <CardContent>
                    <div className="nav-popover-acc-header">
                        {image ? (
                            <img src={image} alt="avatar" />
                        ) : (
                            <Avatar src="/broken-image.jpg" style={{ width: 72, height: 72, margin: '0 auto' }} />
                        )}
                        <div className="nav-popover-acc-name">{userName} 님</div>
                    </div>
                </CardContent>
                <Divider />

                <CardActions style={{ padding: 0 }}>
                    <List
                        style={{ width: '100%' }}
                        component="nav"
                        aria-label="secondary mailbox folders"
                        onClick={handleAccountPopoverClose}
                    >
                        {/* <ListItemLink href={'/'}>마이페이지</ListItemLink> */}
                        <EdListItem button onClick={() => history.replace('/mypage/profile')}>
                            마이페이지
                        </EdListItem>
                        <EdListItem button onClick={handleLogout}>
                            로그아웃
                        </EdListItem>
                    </List>
                </CardActions>
            </Card>
        </Popover>
    );
}

export default withRouter(AccountPopOver);
