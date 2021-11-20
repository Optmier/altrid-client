import React from 'react';
import styled from 'styled-components';

const IconRoot = styled.svg``;

function AssignmentsStarringIcon({ width, height, viewBox, fillColor, style, ...restProps }) {
    return (
        <IconRoot width={width} height={height} viewBox={viewBox} style={style} {...restProps}>
            <path
                d="M8.00002 12.174L3.29802 14.806L4.34802 9.52065L0.391357 5.86198L5.74269 5.22732L8.00002 0.333984L10.2574 5.22732L15.6087 5.86198L11.652 9.52065L12.702 14.806L8.00002 12.174Z"
                fill={fillColor}
            />
        </IconRoot>
    );
}

AssignmentsStarringIcon.defaultProps = {
    width: 16,
    height: 15,
    viewBox: '0 0 16 15',
    fillColor: '#3B1689',
};

export default AssignmentsStarringIcon;
