import React from 'react';
import styled from 'styled-components';

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

const ButtonRoot = styled.button`
    align-items: center;
    background-color: ${({ colors, variant }) => {
        if (variant === 'filled') return getColorSeries400(colors);
        else if (variant === 'light') return getColorSeries050(colors);
        else return 'rgba(255, 255, 255, 0)';
    }};
    border: ${({ variant }) => {
        if (variant === 'filled') return 'none';
        else if (variant === 'outlined') return '2px solid #ffffff';
        else return 'none';
    }};
    border-color: ${({ colors }) => {
        return getColorSeries400(colors);
    }};
    border-radius: 104px;
    color: ${({ variant, colors }) => {
        if (variant === 'filled') return '#ffffff';
        else {
            return getColorSeries400(colors);
        }
    }};
    display: flex;
    justify-content: center;
    font-family: inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji',
        'Segoe UI Emoji', 'Segoe UI Symbol';
    font-size: ${({ sizes }) => {
        switch (sizes) {
            case 'xsmall':
                return '0.75rem';
            default:
                return '1.125rem';
        }
    }};
    font-weight: 700;
    outline: none;
    min-height: ${({ sizes }) => {
        switch (sizes) {
            case 'large':
                return '46px';
            case 'medium':
                return '38px';
            case 'small':
                return '28px';
            case 'xsmall':
                return '20px';
            default:
                return '46px';
        }
    }};
    padding: ${({ sizes }) => {
        switch (sizes) {
            case 'large':
                return '12px 24px';
            case 'medium':
                return '8px 16px';
            case 'small':
                return '3px 12px';
            case 'xsmall':
                return '2px 8px';
            default:
                return '12px 24px';
        }
    }};
    transition: background-color 0.2s, border-color 0.2s, color 0.2s;
    width: ${({ fullWidth }) => (fullWidth ? '100%' : null)};

    &:hover {
        background-color: ${({ variant, colors }) => {
            if (variant === 'light') return null;
            else if (variant === 'outlined') return 'transparent';
            else if (variant === 'default') return '#E9EDEF';
            return getColorSeries300(colors);
        }};
        border-color: ${({ colors }) => {
            return getColorSeries300(colors);
        }};
        color: ${({ colors, variant }) => {
            if (variant === 'filled') return '#ffffff';
            else if (variant === 'default') return null;
            return getColorSeries300(colors);
        }};
    }

    &:disabled {
        background-color: ${({ variant }) => {
            if (variant === 'filled') return '#bfc6cd';
            else if (variant === 'outlined') return 'transparent';
        }};
        border-color: ${({ variant }) => {
            if (variant === 'outlined') return '#bfc6cd';
        }};
        color: ${({ variant }) => {
            if (variant === 'outlined' || variant === 'light') return '#bfc6cd';
            else if (variant === 'default') return '#BFC6CD';
        }};
        cursor: default;
        pointer-events: none;
    }
`;

const Contents = styled.span`
    align-items: center;
    display: inherit;
    /* margin-bottom: -3px; */

    & .MuiCircularProgress-root {
        width: 1em !important;
        height: 1em !important;
        color: inherit !important;
        /* margin-top: -3px; */
    }
`;

const LeftIconContainer = styled.div`
    & svg {
        display: inherit;
        font-size: inherit;
        margin-right: 8px;
    }
`;

const RightIconContainer = styled.div`
    & svg {
        display: inherit;
        font-size: inherit;
        margin-left: 8px;
    }
`;

function Button({ fullWidth, variant, colors, sizes, leftIcon, rightIcon, children, ...rests }) {
    return (
        <ButtonRoot fullWidth={fullWidth} variant={variant} colors={colors} sizes={sizes} {...rests}>
            <Contents>
                <LeftIconContainer>{leftIcon}</LeftIconContainer>
                {children}
                <RightIconContainer>{rightIcon}</RightIconContainer>
            </Contents>
        </ButtonRoot>
    );
}

Button.defaultProps = {
    fullWidth: false,
    variant: 'filled',
    color: 'default',
    sizes: 'large',
    leftIcon: null,
    rightIcon: null,
};

export default Button;
