import React, { useEffect } from 'react';
import { IconButton, Tooltip, withStyles } from '@material-ui/core';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import ChannelService from './ChannelService';
import { useState } from 'react';
import { withRouter } from 'react-router-dom';

const TalkIOButton = withStyles(() => ({
    root: {
        color: '#3b178a',
        position: 'fixed',
        zIndex: 99998,
        right: '4px',
        bottom: '4px',
    },
}))(IconButton);

const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
        padding: '1rem 1.5rem',
        fontSize: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '600',
        borderRadius: '10px',
        position: 'relative',

        '& .class-button + .class-button': {
            paddingLeft: '0.5rem',
        },

        '&::after': {
            top: 'unset',
            right: '0.9rem',
            clear: 'both',
            width: 0,
            border: '0.7rem solid transparent',
            bottom: '-0.9rem',
            height: 0,
            content: '""',
            position: 'absolute',
            borderTop: '.9rem solid rgba(97, 97, 97, 0.9)',
            borderBottom: 'none',
            borderTopColor: 'rgba(97, 97, 97, 0.9)',
            borderLeftColor: 'transparent',
        },
    },
}))(Tooltip);

function CustomChannelIOButton({ history, match }) {
    const [showCustomChannelButton, setShowCustomChannelButton] = useState(true);
    window.showCustomChannelButton = setShowCustomChannelButton;
    const onClick = () => {
        if (window.ChannelIO) ChannelService.showMessenger();
    };

    useEffect(() => {
        // if (window.ChannelIO) ChannelService.hideButton();
        if (history.location.pathname.includes('/assignments/do-it-now')) {
            setShowCustomChannelButton(false);
        }
    }, []);

    return (
        <>
            {showCustomChannelButton ? (
                <HtmlTooltip title={'도움이 필요하신가요?'} placement="bottom-end">
                    <TalkIOButton onClick={onClick}>
                        <ContactSupportIcon />
                    </TalkIOButton>
                </HtmlTooltip>
            ) : null}
        </>
    );
}

export default withRouter(React.memo(CustomChannelIOButton));
