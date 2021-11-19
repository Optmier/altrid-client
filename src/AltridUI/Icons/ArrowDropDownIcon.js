import React from 'react';
import styled from 'styled-components';

const IconRoot = styled.svg`
    padding-right: 20px;
`;

function ArrowDropDownIcon({ width, height, viewBox, fillColor, style }) {
    return (
        <IconRoot width={width} height={height} viewBox={viewBox} style={style}>
            <path
                d="M7.11061 5.06133L12.0606 0.111328L13.4746 1.52533L7.11061 7.88933L0.746609 1.52533L2.16061 0.111328L7.11061 5.06133Z"
                fill={fillColor}
            />
        </IconRoot>
    );
}

ArrowDropDownIcon.defaultProps = {
    width: 14,
    height: 8,
    viewBox: '0 0 14 8',
    fillColor: '#3B1689',
};

export default ArrowDropDownIcon;
