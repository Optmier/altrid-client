import React from 'react';
import styled from 'styled-components';
import { getColorSets } from '../ThemeColors/ColorSets';

const ButtonRoot = styled.button`
    align-items: center;
    background-color: ${({ colors, variant }) => {
        if (variant === 'filled') return getColorSets(400, colors);
        else if (variant === 'light') return getColorSets(50, colors);
        else if (variant === 'mono') return '#ffffff';
        else return 'rgba(255, 255, 255, 0)';
    }};
    border: ${({ variant }) => {
        if (variant === 'filled') return 'none';
        else if (variant === 'outlined') return '2px solid #ffffff';
        else if (variant === 'mono') return '2px solid #9AA5AF';
        else return 'none';
    }};
    border-color: ${({ variant, colors }) => {
        return variant === 'outlined' ? getColorSets(400, colors) : null;
    }};
    border-radius: 104px;
    color: ${({ variant, colors }) => {
        if (variant === 'filled') return '#ffffff';
        if (variant === 'mono') return '#11171C';
        else {
            return getColorSets(400, colors);
        }
    }};
    fill: ${({ variant, colors }) => {
        if (variant === 'filled') return '#ffffff';
        if (variant === 'mono') return '#11171C';
        else {
            return getColorSets(400, colors);
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
                return '36px';
            case 'small':
                return '28px';
            case 'xsmall':
                return '20px';
            default:
                return '46px';
        }
    }};
    padding: ${({ sizes, variant }) => {
        switch (sizes) {
            case 'large':
                return `${variant === 'outlined' || variant === 'mono' ? '10px' : '12px'} 24px`;
            case 'medium':
                return `${variant === 'outlined' || variant === 'mono' ? '6px' : '8px'} 16px`;
            case 'small':
                return `${variant === 'outlined' || variant === 'mono' ? '1px' : '3px'} 12px`;
            case 'xsmall':
                return '2px 8px';
            default:
                return '12px 24px';
        }
    }};
    transition: background-color 0.2s, border-color 0.2s, color 0.2s, fill 0.2s;
    width: ${({ fullWidth }) => (fullWidth ? '100%' : null)};

    &:hover {
        background-color: ${({ variant, colors }) => {
            if (variant === 'light') return null;
            else if (variant === 'outlined') return 'transparent';
            else if (variant === 'mono') return '#ffffff';
            else if (variant === 'default') return '#E9EDEF';
            return getColorSets(300, colors);
        }};
        border-color: ${({ colors, variant }) => {
            if (variant === 'mono') return '#E9EDEF';
            else return getColorSets(300, colors);
        }};
        color: ${({ colors, variant }) => {
            if (variant === 'filled') return '#ffffff';
            if (variant === 'mono') return '#11171C';
            else if (variant === 'default') return null;
            return getColorSets(300, colors);
        }};
        fill: ${({ colors, variant }) => {
            if (variant === 'filled') return '#ffffff';
            if (variant === 'mono') return '#11171C';
            else if (variant === 'default') return null;
            return getColorSets(300, colors);
        }};
    }

    &:disabled {
        background-color: ${({ variant }) => {
            if (variant === 'filled') return '#bfc6cd';
            if (variant === 'mono') return '#ffffff';
            else if (variant === 'outlined') return 'transparent';
        }};
        border-color: ${({ variant }) => {
            if (variant === 'outlined') return '#bfc6cd';
            else if (variant === 'mono') return '#E9EDEF';
        }};
        color: ${({ variant }) => {
            if (variant === 'outlined' || variant === 'light') return '#bfc6cd';
            else if (variant === 'mono') return '#E9EDEF';
            else if (variant === 'default') return '#BFC6CD';
        }};
        fill: ${({ variant }) => {
            if (variant === 'outlined' || variant === 'light') return '#bfc6cd';
            else if (variant === 'mono') return '#E9EDEF';
            else if (variant === 'default') return '#BFC6CD';
        }};
        cursor: default;
        pointer-events: none;
    }
`;

const Contents = styled.span`
    align-items: center;
    display: inherit;
    pointer-events: none;
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
