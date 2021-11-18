import React from 'react';
import styled from 'styled-components';

const IconRoot = styled.svg``;

function ProgressIndicator({ width, height, viewBox, fillColor }) {
    return (
        <IconRoot width={width} height={height} viewBox={viewBox}>
            <path
                d="M16 0C14.3636 3.27279 11.1029 5.32833 7.94318 7.17354C6.46039 8.03944 5.12945 9.13705 4 10.4167C1.51055 13.2372 0 16.9422 0 21C0 29.8366 7.16344 37 16 37C24.8366 37 32 29.8366 32 21C32 17.1397 30.6329 13.5987 28.3565 10.8347C27.1544 9.3752 25.6987 8.13233 24.0568 7.17354C20.8971 5.32833 17.6364 3.27279 16 0Z"
                fill={fillColor}
            />
        </IconRoot>
    );
}

ProgressIndicator.defaultProps = {
    width: 32,
    height: 37,
    viewBox: '0 0 32 37',
    fillColor: '#0CB573',
};

export default ProgressIndicator;
