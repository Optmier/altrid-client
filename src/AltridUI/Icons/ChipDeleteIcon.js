import React from 'react';
import styled from 'styled-components';

const IconRoot = styled.svg``;

function ChipDeleteIcon({ width, height, viewBox, fillColor, style, ...restProps }) {
    return (
        <IconRoot width={width} height={height} viewBox={viewBox} style={style} {...restProps}>
            <path
                d="M7.00016 13.6673C3.31816 13.6673 0.333496 10.6827 0.333496 7.00065C0.333496 3.31865 3.31816 0.333984 7.00016 0.333984C10.6822 0.333984 13.6668 3.31865 13.6668 7.00065C13.6668 10.6827 10.6822 13.6673 7.00016 13.6673ZM7.00016 6.05798L5.11483 4.17198L4.1715 5.11532L6.0575 7.00065L4.1715 8.88598L5.11483 9.82932L7.00016 7.94332L8.8855 9.82932L9.82883 8.88598L7.94283 7.00065L9.82883 5.11532L8.8855 4.17198L7.00016 6.05798Z"
                fill={fillColor}
            />
        </IconRoot>
    );
}

ChipDeleteIcon.defaultProps = {
    width: 14,
    height: 14,
    viewBox: '0 0 14 14',
    fillColor: '#C1B5E3',
};

export default ChipDeleteIcon;
