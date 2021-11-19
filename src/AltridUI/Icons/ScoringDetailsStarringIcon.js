import React from 'react';
import styled from 'styled-components';

const IconRoot = styled.svg``;

function ScoringDetailsStarringIcon({ width, height, viewBox, fillColor, style, ...restProps }) {
    return (
        <IconRoot width={width} height={height} viewBox={viewBox} style={style} {...restProps}>
            <path
                d="M11.4999 18.26L4.44691 22.208L6.02191 14.28L0.0869141 8.792L8.11391 7.84L11.4999 0.5L14.8859 7.84L22.9129 8.792L16.9779 14.28L18.5529 22.208L11.4999 18.26Z"
                fill={fillColor}
            />
        </IconRoot>
    );
}

ScoringDetailsStarringIcon.defaultProps = {
    width: 23,
    height: 23,
    viewBox: '0 0 23 23',
    fillColor: '#11171C',
};

export default ScoringDetailsStarringIcon;
