import classNames from 'classnames';
import React, { useState } from 'react';
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

const CheckboxRoot = styled.div`
    align-items: center;
    color: #11171c;
    cursor: pointer;
    display: flex;
    font-family: inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji',
        'Segoe UI Emoji', 'Segoe UI Symbol';
    font-size: 0.875rem;
    font-weight: 700;
    line-height: 1.25rem;
    width: fit-content;

    & input[type='checkbox'] {
        display: none;
    }

    & button.alt-checkbox-head {
        background-color: ${({ variant, colors, checked, disabled }) => {
            if (variant === 'lined') return disabled ? '#F6F8F9' : 'transparent';
            else if (variant === 'filled') {
                if (checked) return disabled ? '#F6F8F9' : getColorSeries400(colors);
                else return disabled ? '#F6F8F9' : null;
            }
        }};
        border: 2px solid;
        border-color: ${({ variant, colors, disabled }) => {
            if (variant === 'lined') {
                return disabled ? '#E9EDEF' : getColorSeries400(colors);
            } else if (variant === 'filled') {
                return 'transparent';
            }
        }};
        border-radius: 4px;
        outline: 4px solid;
        outline-color: transparent;
        width: 24px;
        height: 24px;
        transition: background-color 0.2s, border-color 0.2s, outline-color 0.2s, fill 0.2s;
    }

    & svg.alt-checkbox-icon {
        fill: ${({ variant, colors, checked, disabled }) => {
            if (variant === 'lined' && checked) return disabled ? '#E9EDEF' : getColorSeries400(colors);
            else if (variant === 'filled' && checked) return disabled ? '#E9EDEF' : '#ffffff';
            else return 'transparent';
        }};
        transition: all 0.2s;
    }

    &:hover {
        & button.alt-checkbox-head {
            background-color: ${({ variant, colors, checked, disabled }) => {
                if (variant === 'lined') {
                } else if (variant === 'filled') {
                    return checked ? getColorSeries300(colors) : '#F6F8F9';
                }
            }};
            border-color: ${({ variant, colors }) => {
                if (variant === 'lined') return getColorSeries300(colors);
            }};
        }
        & svg.alt-checkbox-icon {
            fill: ${({ variant, colors, checked, disabled }) => {
                if (variant === 'lined' && checked) return getColorSeries300(colors);
                else if (variant === 'filled' && checked) return '#ffffff';
                else return 'transparent';
            }};
        }
    }

    pointer-events: ${({ disabled }) => (disabled ? 'none' : null)};

    &:disabled {
        pointer-events: none;

        & button.alt-checkbox-head {
            pointer-events: none;
        }
    }
`;
const CheckboxHead = styled.button`
    &.alt-checkbox-head:active {
        background-color: ${({ variant }) => {
            if (variant === 'filled') return '#E9EDEF';
        }};
    }
    &.alt-checkbox-head:focus {
        outline-color: #f6f8f9;
    }
`;
const CheckboxLabel = styled.span`
    margin-left: 10px;
`;
const CheckedIcon = styled.svg`
    color: inherit;
    height: 24px;
    margin-left: -8px;
    margin-top: -3px;
    width: 24px;
`;

function Checkbox({ id, className, name, label, checked, defaultChecked, colors, variant, disabled, ref, inputRef, onChange, children }) {
    const [innerChecked, setInnerChecked] = useState(checked);

    const toggleChecked = () => {
        setInnerChecked(!innerChecked);
        onChange({ name: name, checked: !innerChecked });
    };

    return (
        <CheckboxRoot
            ref={ref}
            className={classNames(['alt-checkbox', className])}
            onClick={toggleChecked}
            disabled={disabled}
            checked={defaultChecked === null ? innerChecked : defaultChecked}
            colors={colors}
            variant={variant}
        >
            <input
                ref={inputRef}
                type="checkbox"
                name={name}
                id={id}
                className="alt-checkbox"
                disabled={disabled}
                checked={defaultChecked === null ? innerChecked : defaultChecked}
                onChange={toggleChecked}
            ></input>
            <CheckboxHead
                className="alt-checkbox-head"
                checked={defaultChecked === null ? innerChecked : defaultChecked}
                colors={colors}
                variant={variant}
                disabled={disabled}
            >
                <CheckedIcon
                    className="alt-checkbox-icon"
                    viewBox="-7 -6 24 24"
                    checked={defaultChecked === null ? innerChecked : defaultChecked}
                    colors={colors}
                    variant={variant}
                    disabled={disabled}
                >
                    <path d="M3.9403 10.1082C4.3097 10.1082 4.62313 9.9291 4.83582 9.58209L9.95149 1.53358C10.0858 1.3209 10.2313 1.06343 10.2313 0.817163C10.2313 0.324626 9.78358 0 9.31343 0C9.02239 0 8.74254 0.16791 8.54104 0.503731L3.88433 7.94776L1.6791 5.10448C1.42164 4.74627 1.16418 4.64552 0.86194 4.64552C0.369402 4.64552 0 5.03731 0 5.54104C0 5.77612 0.0895519 6.02239 0.246268 6.23507L2.97761 9.58209C3.26866 9.95149 3.5597 10.1082 3.9403 10.1082Z" />
                </CheckedIcon>
            </CheckboxHead>
            <CheckboxLabel>{label}</CheckboxLabel>
        </CheckboxRoot>
    );
}

Checkbox.defaultProps = {
    label: 'Checkbox',
    checked: false,
    defaultChecked: null,
    colors: 'purple',
    variant: 'lined',
    disabled: false,
};

export default Checkbox;
