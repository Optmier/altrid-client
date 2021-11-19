import React from 'react';
import styled from 'styled-components';

const IconRoot = styled.svg``;

function CardClockIcon({ width, height, viewBox, fillColor }) {
    return (
        <IconRoot width={width} height={height} viewBox={viewBox}>
            <path
                d="M5 10C2.2385 10 0 7.7615 0 5C0 2.2385 2.2385 0 5 0C7.7615 0 10 2.2385 10 5C10 7.7615 7.7615 10 5 10ZM5.5 5V2.5H4.5V6H7.5V5H5.5Z"
                fill={fillColor}
            />
        </IconRoot>
    );
}

CardClockIcon.defaultProps = {
    width: 10,
    height: 10,
    viewBox: '0 0 10 10',
    fillColor: '#3B1689',
};

export default CardClockIcon;
