import React from 'react';
import styled from 'styled-components';

const IconRoot = styled.svg``;

function DrawerTopCloseIcon({ width, height, viewBox, fillColor, style, ...restProps }) {
    return (
        <IconRoot width={width} height={height} viewBox={viewBox} style={style} {...restProps}>
            <path
                d="M7.00023 5.58672L11.9502 0.636719L13.3642 2.05072L8.41423 7.00072L13.3642 11.9507L11.9502 13.3647L7.00023 8.41472L2.05023 13.3647L0.63623 11.9507L5.58623 7.00072L0.63623 2.05072L2.05023 0.636719L7.00023 5.58672Z"
                fill={fillColor}
            />
        </IconRoot>
    );
}

DrawerTopCloseIcon.defaultProps = {
    width: 14,
    height: 14,
    viewBox: '0 0 14 14',
    fillColor: '#3B1689',
};

export default DrawerTopCloseIcon;
