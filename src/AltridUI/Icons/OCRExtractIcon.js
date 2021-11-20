import React from 'react';
import styled from 'styled-components';

const IconRoot = styled.svg``;

function OCRExtractIcon({ width, height, viewBox, fillColor, style, ...restProps }) {
    return (
        <IconRoot width={width} height={height} viewBox={viewBox} style={style} {...restProps}>
            <path
                d="M2 12V16H6V18H0V12H2ZM18 12V18H12V16H16V12H18ZM10 3V15H8V3H10ZM6 6V12H4V6H6ZM14 6V12H12V6H14ZM6 0V2H2V6H0V0H6ZM18 0V6H16V2H12V0H18Z"
                fill={fillColor}
            />
        </IconRoot>
    );
}

OCRExtractIcon.defaultProps = {
    width: 18,
    height: 18,
    viewBox: '0 0 18 18',
    fillColor: '#3B1689',
};

export default OCRExtractIcon;
