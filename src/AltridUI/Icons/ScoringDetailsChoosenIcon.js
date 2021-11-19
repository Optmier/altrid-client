import React from 'react';
import styled from 'styled-components';

const IconRoot = styled.svg``;

function ScoringDetailsChoosenIcon({ width, height, viewBox, fillColor, style, ...restProps }) {
    return (
        <IconRoot width={width} height={height} viewBox={viewBox} style={style} {...restProps}>
            <path
                d="M10.5 20C4.977 20 0.5 15.523 0.5 10C0.5 4.477 4.977 0 10.5 0C16.023 0 20.5 4.477 20.5 10C20.5 15.523 16.023 20 10.5 20ZM9.503 14L16.573 6.929L15.159 5.515L9.503 11.172L6.674 8.343L5.26 9.757L9.503 14Z"
                fill={fillColor}
            />
        </IconRoot>
    );
}

ScoringDetailsChoosenIcon.defaultProps = {
    width: 21,
    height: 20,
    viewBox: '0 0 21 20',
    fillColor: '#11171C',
};

export default ScoringDetailsChoosenIcon;
