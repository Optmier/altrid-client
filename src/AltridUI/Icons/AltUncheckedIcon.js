import React from 'react';
import styled from 'styled-components';

const IconRoot = styled.svg``;

function AltUncheckedIcon({ width, height, viewBox, fillColor }) {
    return (
        <IconRoot width={width} height={height} viewBox={viewBox}>
            <path
                d="M10.0002 19.1668C4.93741 19.1668 0.833496 15.0629 0.833496 10.0002C0.833496 4.93741 4.93741 0.833496 10.0002 0.833496C15.0629 0.833496 19.1668 4.93741 19.1668 10.0002C19.1668 15.0629 15.0629 19.1668 10.0002 19.1668ZM10.0002 17.3335C11.9451 17.3335 13.8103 16.5609 15.1856 15.1856C16.5609 13.8103 17.3335 11.9451 17.3335 10.0002C17.3335 8.05524 16.5609 6.18998 15.1856 4.81471C13.8103 3.43945 11.9451 2.66683 10.0002 2.66683C8.05524 2.66683 6.18998 3.43945 4.81471 4.81471C3.43945 6.18998 2.66683 8.05524 2.66683 10.0002C2.66683 11.9451 3.43945 13.8103 4.81471 15.1856C6.18998 16.5609 8.05524 17.3335 10.0002 17.3335Z"
                fill={fillColor}
            />
        </IconRoot>
    );
}

AltUncheckedIcon.defaultProps = {
    width: 20,
    height: 20,
    viewBox: '0 0 20 20',
    fillColor: '#3B1689',
};

export default AltUncheckedIcon;
