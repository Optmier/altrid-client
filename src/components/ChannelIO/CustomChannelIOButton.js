import React, { useEffect } from 'react';
import { IconButton, Tooltip, withStyles } from '@material-ui/core';
import ChannelService from './ChannelService';
import { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { BsFillQuestionCircleFill } from 'react-icons/bs';

const TalkIOButton = withStyles(() => ({
    root: {
        color: '#3b178a',
        position: 'fixed',
        zIndex: 99998,
        right: '8px',
        bottom: '8px',
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
        backgroundColor: '#707070',

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
        if (
            history.location.pathname.includes('/assignments/do-it-now') ||
            history.location.pathname.includes('/video-lecture-eyetracker') ||
            history.location.pathname.includes('/cam-study-eyetracker')
        ) {
            setShowCustomChannelButton(false);
        }
    }, []);

    return (
        <>
            {showCustomChannelButton ? (
                <HtmlTooltip title={'도움이 필요하신가요?'} placement="bottom-end">
                    <TalkIOButton onClick={onClick}>
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <ellipse cx="20.5" cy="20" rx="11.5" ry="12" fill="#F6F9F8" />
                            <path
                                d="M20 0C8.95536 0 0 8.95536 0 20C0 31.0446 8.95536 40 20 40C31.0446 40 40 31.0446 40 20C40 8.95536 31.0446 0 20 0ZM20 31.6071C19.0134 31.6071 18.2143 30.808 18.2143 29.8214C18.2143 28.8348 19.0134 28.0357 20 28.0357C20.9866 28.0357 21.7857 28.8348 21.7857 29.8214C21.7857 30.808 20.9866 31.6071 20 31.6071ZM22.808 21.808C22.4037 21.9642 22.0559 22.2385 21.8098 22.5953C21.5637 22.952 21.4309 23.3746 21.4286 23.808V24.8214C21.4286 25.0179 21.2679 25.1786 21.0714 25.1786H18.9286C18.7321 25.1786 18.5714 25.0179 18.5714 24.8214V23.8616C18.5714 22.8304 18.8705 21.8125 19.4598 20.9643C20.0357 20.1339 20.8393 19.5 21.7857 19.1384C23.3036 18.5536 24.2857 17.2813 24.2857 15.8929C24.2857 13.9241 22.3616 12.3214 20 12.3214C17.6384 12.3214 15.7143 13.9241 15.7143 15.8929V16.2321C15.7143 16.4286 15.5536 16.5893 15.3571 16.5893H13.2143C13.0179 16.5893 12.8571 16.4286 12.8571 16.2321V15.8929C12.8571 14.1384 13.625 12.5 15.0179 11.2813C16.3571 10.1071 18.125 9.46429 20 9.46429C21.875 9.46429 23.6429 10.1116 24.9821 11.2813C26.375 12.5 27.1429 14.1384 27.1429 15.8929C27.1429 18.4732 25.442 20.7946 22.808 21.808Z"
                                fill="#3B168A"
                            />
                        </svg>
                    </TalkIOButton>
                </HtmlTooltip>
            ) : null}
        </>
    );
}

export default withRouter(React.memo(CustomChannelIOButton));
