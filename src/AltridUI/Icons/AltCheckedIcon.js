import React from 'react';
import styled from 'styled-components';

const IconRoot = styled.svg``;

function AltCheckedIcon({ width, height, viewBox, fillColor }) {
    return (
        <IconRoot width={width} height={height} viewBox={viewBox}>
            <path
                d="M10.0002 19.1668C4.93741 19.1668 0.833496 15.0629 0.833496 10.0002C0.833496 4.93741 4.93741 0.833496 10.0002 0.833496C15.0629 0.833496 19.1668 4.93741 19.1668 10.0002C19.1668 15.0629 15.0629 19.1668 10.0002 19.1668ZM9.08625 13.6668L15.5671 7.18508L14.2709 5.88891L9.08625 11.0745L6.493 8.48125L5.19683 9.77741L9.08625 13.6668Z"
                fill={fillColor}
            />
        </IconRoot>
    );
}

AltCheckedIcon.defaultProps = {
    width: 20,
    height: 20,
    viewBox: '0 0 20 20',
    fillColor: '#3B1689',
};

export default AltCheckedIcon;
