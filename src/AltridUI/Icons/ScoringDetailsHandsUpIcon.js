import React from 'react';
import styled from 'styled-components';

const IconRoot = styled.svg``;

function ScoringDetailsHandsUpIcon({ width, height, viewBox, fillColor, style, ...restProps }) {
    return (
        <IconRoot width={width} height={height} viewBox={viewBox} style={style} {...restProps}>
            <path
                d="M18.5 3.33333V20H7.88L0.5 12.3583L2.05455 10.8333L6.22727 13.2583V2.5H8.68182V9.16667H9.5V0H11.9545V9.16667H12.7727V0.833333H15.2273V9.16667H16.0455V3.33333H18.5Z"
                fill={fillColor}
            />
        </IconRoot>
    );
}

ScoringDetailsHandsUpIcon.defaultProps = {
    width: 19,
    height: 20,
    viewBox: '0 0 19 20',
    fillColor: '#11171C',
};

export default ScoringDetailsHandsUpIcon;
