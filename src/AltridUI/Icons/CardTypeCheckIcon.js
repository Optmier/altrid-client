import React from 'react';
import styled from 'styled-components';

const IconRoot = styled.svg``;

function CardTypeCheckIcon({ width, height, viewBox, fillColor, style }) {
    return (
        <IconRoot width={width} height={height} viewBox={viewBox} style={style}>
            <path
                d="M5.801 6.87976L6.507 7.58576L10.74 3.35276L11.447 4.05976L6.507 8.99976L3.325 5.81776L4.032 5.11076L5.0945 6.17326L5.801 6.87926V6.87976ZM5.802 5.46576L8.278 2.98926L8.983 3.69426L6.507 6.17076L5.802 5.46576ZM4.3885 8.29326L3.682 8.99976L0.5 5.81776L1.207 5.11076L1.9135 5.81726L1.913 5.81776L4.3885 8.29326Z"
                fill={fillColor}
            />
        </IconRoot>
    );
}

CardTypeCheckIcon.defaultProps = {
    width: 12,
    height: 12,
    viewBox: '0 0 12 12',
    fillColor: '#3B1689',
};

export default CardTypeCheckIcon;
